import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ManufaturerInputService } from '../manufaturer-input/manufaturer-input.service';
import { OperationPipe } from '../material.pipe';
import { SqmsIqcDataApi } from '@service/mrr-sdk/services/custom/SqmsIqcData';

@Injectable({
  providedIn: 'root'
})
export class SqmsIqcService {

  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  constructor(
    private sqmsIqcDataApi: SqmsIqcDataApi,
    private manufaturerInputService: ManufaturerInputService
  ) { }

  /**
   * 查詢 表格中所需要的數據
   *
   * @param {FormGroup} validateForm
   * @returns {Observable<any>}
   * @memberof SqmsIqcService
   */
  query(validateForm: FormGroup, parts: any[]): Observable<any> {
    return forkJoin([
      this.manufaturerInputService.query(validateForm),
      this.queryIqc(validateForm, parts)
    ]).pipe(map(res => {
      const partNumberVendorRecords = res[0].dataSet;
      const iqcDataSet = res[1].dataSet;

      const dataSet = [];
      iqcDataSet.forEach(r => {
        const dateCode = new Date(r.dateCode).toLocaleDateString();
        const vendorRecord = partNumberVendorRecords.find(f => new Date(f.dateCode).toLocaleDateString() === dateCode);
        dataSet.push({
          ...r,
          vendorYield: vendorRecord ? vendorRecord.yield : 'error',
          yieldColor: vendorRecord ? vendorRecord.yieldColor : { 'backgroundColor': 'red', 'color': '#fff' },
          manufaturerKeyinDataSet: vendorRecord ? vendorRecord.dataSet : null,
          partNumberVendorRecordId: vendorRecord ? vendorRecord.partNumberVendorRecordId : null,
          vendorRecordStatus: vendorRecord ? vendorRecord.vendorRecordStatus : null
        });
      });
      return dataSet;
    }));
  }

  /**
   * SQMs IQC 數據查詢
   *
   * @param {FormGroup} validateForm
   * @returns {Observable<any>}
   * @memberof SqmsIqcService
   */
  queryIqc(validateForm: FormGroup, parts: any[]): Observable<any> {
    //  SQM by PlantCode
    let plantIds = [];
    const PlantMapping = this.PlantMapping.filter(p => p['Plant'] === validateForm.value.plant);
    for (let index = 0; index < PlantMapping.length; index++) {
      const plantId = `${'F'}${PlantMapping[index]['PlantCode']}`
      if (!plantIds.includes(plantId)) {
        plantIds.push(plantId);
      }
    }
    const startDate = new Date(validateForm.value.rangePicker[0]);
    const endDate = new Date(validateForm.value.rangePicker[1]);
    const diffDay = (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24;
    // 初始化dateCode rule: 20200915
    const dates = [startDate.getFullYear() * 10000 + (startDate.getMonth() + 1) * 100 + startDate.getDate() + ''];
    const jobs = [];
    jobs.push(this.sqmsIqcDataApi.find({
      where: {
        plantId: { inq: plantIds },
        materialId: validateForm.value.partNumber,
        manufacturerId: validateForm.value.manufacturer,
        vendorId: validateForm.value.vendor,
        dateCode: startDate.getFullYear() * 10000 + (startDate.getMonth() + 1) * 100 + startDate.getDate() + ''
      }
    }));
    for (let i = 0; i < diffDay; i++) {
      startDate.setDate(startDate.getDate() + 1);
      const dateString = startDate.getFullYear() * 10000 + (startDate.getMonth() + 1) * 100 + startDate.getDate() + '';
      dates.push(dateString);
      jobs.push(this.sqmsIqcDataApi.find({
        where: {
          plantId: { inq: plantIds },
          materialId: validateForm.value.partNumber,
          manufacturerId: validateForm.value.manufacturer,
          vendorId: validateForm.value.vendor,
          dateCode: dateString
        }
      }));
    }
    return forkJoin(jobs).pipe(map(res => {
      const partName = new OperationPipe().transform(validateForm.value.part, {
        key: 'id',
        list: parts,
        returnKey: 'name'
      });
      const dataSet = [];
      res.forEach((r, i) => {
        // 記錄同一天檢驗的料號的總數，抽樣數，不良數以及結果
        let iqcRecord = {
          lotQty: 0,
          sampleQty: 0,
          defectQty: 0,
          resultPass: null
        };
        for (let index = 0; index < r.length; index++) {
          iqcRecord.lotQty += r[index].lotQty;
          iqcRecord.sampleQty += r[index].sampleQty;
          iqcRecord.defectQty += r[index].defectQty;
        }
        // 料號Pass: 都是 Accept
        if (r.filter(x => (x.result && x.result === 'Accept')).length === r.length) {
          iqcRecord.resultPass = 'Accept';
        } else {
          iqcRecord.resultPass = 'No Accept';
        }
        dataSet.push({
          error: r.length > 0 ? undefined : ("No Record in SQMS(" + validateForm.value.partNumber + ", " + validateForm.value.vendor + ", " + validateForm.value.manufacturer + ", " + validateForm.value.plant + ", " + dates[i] + ")"),
          dateCode: dates[i].toString().substr(0, 4) + '/' + dates[i].toString().substr(4, 2) + '/' + dates[i].toString().substr(6, 2),
          plant: validateForm.value.plant,
          partNumber: validateForm.value.partNumber,
          manufacturer: validateForm.value.manufacturer,
          vendor: validateForm.value.vendor,
          projectCode: validateForm.value.projectCode,
          projectName: validateForm.value.projectName,
          part: validateForm.value.part,
          partName: partName,
          stage: validateForm.value.stage,
          partNumberVendorId: validateForm.value.partNumberVendor,
          lotQty: iqcRecord.lotQty,
          sampleQty: iqcRecord.sampleQty,
          defectQty: iqcRecord.defectQty,
          resultPass: iqcRecord.resultPass,
          nfr: (!iqcRecord['defectQty'] || !iqcRecord['sampleQty']) ? 0 : Math.round((iqcRecord['defectQty'] / iqcRecord['sampleQty']) * 10000) / 100
        });
      });
      return { dataSet: dataSet };
    }));
  }
}
