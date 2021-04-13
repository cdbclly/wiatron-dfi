import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ManufaturerInputService } from '../manufaturer-input/manufaturer-input.service';
import { map } from 'rxjs/operators';
import { MaterialYieldRateApi } from '@service/mrr-sdk/services/custom/MaterialYieldRate';
import * as moment from 'moment';
import { View_MaterialYieldRateReportApi, View_ProcessYieldRateApi, MaterialIssueApi } from '@service/mrr-sdk';
import { forkJoin } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MrrMaterialReportService {
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));

  constructor(
    private manufaturerInputService: ManufaturerInputService,
    private materialYieldRateApi: MaterialYieldRateApi,
    private view_MaterialYieldRateReport: View_MaterialYieldRateReportApi,
    private view_ProcessYieldRate: View_ProcessYieldRateApi,
    private materialIssueApi: MaterialIssueApi
  ) { }

  queryManufacturerReport(validateForm: FormGroup) {
    const query: any = {
      where: {
        and: [{
          dateCode: {
            between: [moment(new Date(validateForm.value.rangePicker[0]).getTime()).format('YYYY-MM-DD'), moment(new Date(validateForm.value.rangePicker[1]).getTime()).format('YYYY-MM-DD')]
          }
        }]
      }
    };
    if (validateForm.value.partNumber) {
      query.where.and.push({ partNumber: validateForm.value.partNumber });
    }
    if (validateForm.value.manufacturer) {
      query.where.and.push({ manufacturer: validateForm.value.manufacturer });
    }
    if (validateForm.value.plant) {
      query.where.and.push({ plant: validateForm.value.plant });
    }
    if (validateForm.value.customer) {
      query.where.and.push({ customer: validateForm.value.customer });
    }
    if (validateForm.value.projectCode) {
      query.where.and.push({ projectCode: validateForm.value.projectCode });
    }
    if (validateForm.value.projectName) {
      query.where.and.push({ projectName: validateForm.value.projectName });
    }
    if (validateForm.value.part) {
      query.where.and.push({ partId: validateForm.value.part });
    }
    if (validateForm.value.stage) {
      query.where.and.push({ stage: validateForm.value.stage });
    }
    return forkJoin([this.view_MaterialYieldRateReport.find(query), this.view_ProcessYieldRate.find(query)]).pipe(map((res: any) => {
      const report = res[0];
      const operationData = res[1];

      const part = report[0].part;
      const optionParam = {
        title: validateForm.value.partNumber + ' ' + part + ' Cover YR Trend Chart',
        date: [],
        factoryDefectRate: [],
        iqcDefectRate: [],
        vendorDefectRate: []
      };
      // 先將同一個料號 同一個dateCode SqmIqcData出現多筆的情況 數量相加
      const map = new Map();
      const cacheReport = report.filter(r => !map.has(r.partNumberVendorRecordId) && map.set(r.partNumberVendorRecordId, 1));
      for (let index = 0; index < cacheReport.length; index++) {
        if (report.filter(r => cacheReport[index].partNumberVendorRecordId === r.partNumberVendorRecordId).length > 1) {
          const sqmNotUniqueData = report.filter(r => cacheReport[index].partNumberVendorRecordId === r.partNumberVendorRecordId);
          let qty = {
            lotQty: 0,
            sampleQty: 0,
            iqcDefectQty: 0
          };
          for (let index = 0; index < sqmNotUniqueData.length; index++) {
            const d = sqmNotUniqueData[index];
            if (d.lotQty) {
              qty.lotQty += d.lotQty;
            }
            if (d.sampleQty) {
              qty.sampleQty += d.sampleQty;
            }
            if (d.iqcDefectQty) {
              qty.iqcDefectQty += d.iqcDefectQty;
            }
          }
          sqmNotUniqueData[0].lotQty = qty.lotQty;
          sqmNotUniqueData[0].sampleQty = qty.sampleQty;
          sqmNotUniqueData[0].iqcDefectQty = qty.iqcDefectQty;
          if (sqmNotUniqueData.filter(n => n.result === 'Accept').length === sqmNotUniqueData.length) {
            sqmNotUniqueData[0].result = 'Accept';
          } else {
            sqmNotUniqueData[0].result = 'No Accept';
          }
          Object.assign(cacheReport[index], sqmNotUniqueData[0]);
        }
      }

      cacheReport.sort(this.manufaturerInputService.sortByDateCode); // 同一料號按dateCode排序
      for (let index = 0; index < cacheReport.length; index++) {
        // echart需要參數
        optionParam.date.push(new Date(cacheReport[index].dateCode).toLocaleDateString());

        if (operationData.filter(o => o.partNumberVendorId === cacheReport[index].partNumberVendorId && o.partNumberVendorRecordId === cacheReport[index].partNumberVendorRecordId).length > 0) {
          const actualRTY = cacheReport[index].materialActualYield; // 記錄料號當天的實際生產良率
          const operation = operationData.filter(o => o.partNumberVendorRecordId === cacheReport[index].partNumberVendorRecordId);

          for (let index = 0; index < operation.length; index++) {
            operation[index]['sqmTargetYieldShow'] = Math.round(operation[index].sqmTargetYield * 10000) / 100;
            operation[index]['vendorTargetYieldShow'] = Math.round(operation[index].vendorTargetYield * 10000) / 100;
            // 如果有Input 並且Actual小於MP Goal or C4之前不良數大於0 則mark red
            operation[index]['markRed'] = operation[index].order === operation.length ? (operation[index].vendorTargetYieldId && operation[index].sqmTargetYield && actualRTY < operation[index].sqmTargetYield ? true : false) : (operation[index].vendorTargetYieldId &&
              operation[index].input && Math.round((operation[index].output / operation[index].input) * 10000) / 10000 < operation[index].sqmTargetYield ||
              (!operation[index].sqmTargetYield &&
                operation[index].input - operation[index].output > 0))
              ? true
              : false;
            if (operation[index].input === 0 && operation[index].output === 0) { // 不計算該製程的良率
              operation[index]['actual'] = 0;
            }
            if (operation[index].operationName === 'RTY') {
              operation[index]['actual'] = actualRTY;
            }
          }
          cacheReport[index]['dataSet'] = operation;
          this.manufaturerInputService.sort(cacheReport[index]['dataSet'], x => x['order']);
          cacheReport[index]['sqmTargetYield'] = cacheReport[index]['dataSet'].find(d => d.operationName === 'RTY').sqmTargetYield;
          cacheReport[index]['factoryDefectRate'] = (!cacheReport[index].factoryDefectQty || !cacheReport[index].inputQty) ? 0 : Math.round((cacheReport[index].factoryDefectQty / cacheReport[index].inputQty) * 10000) / 100;
          cacheReport[index]['iqcDefectRate'] = (!cacheReport[index].iqcDefectQty || !cacheReport[index].sampleQty) ? 0 : Math.round((cacheReport[index].iqcDefectQty / cacheReport[index].sampleQty) * 10000) / 100;
          // 廠商端: 如果RTY的Actual小於MP Goal則mark red
          cacheReport[index]['vendorYieldColor'] =
            !!cacheReport[index].materialActualYield ? (cacheReport[index].materialActualYield < cacheReport[index].sqmTargetYield
              ? { backgroundColor: 'red', color: '#ccc' }
              : {}) : { backgroundColor: 'red', color: '#ccc' };

          cacheReport[index]['factoryYieldColor'] =
            cacheReport[index].inputQty && cacheReport[index].factoryDefectQty > 0 ? { backgroundColor: 'red', color: '#ccc' } : {};

          cacheReport[index]['iqcYieldColor'] = cacheReport[index].result && cacheReport[index].iqcDefectQty > 0 ? { backgroundColor: 'red', color: '#ccc' } : {};

        }
        optionParam.factoryDefectRate.push(cacheReport[index]['factoryDefectRate']);
        optionParam.iqcDefectRate.push(cacheReport[index]['iqcDefectRate']);
        optionParam.vendorDefectRate.push(Math.round((1 - cacheReport[index].materialActualYield) * 10000) / 100);
      }
      const option = this.getBadQuantityChart(optionParam);
      return {
        dataSet: cacheReport,
        option: option
      };
    }));
  }

  // 工廠端材料不良查詢
  getFactoryData(validateForm: FormGroup) {
    let plantIds = [];
    const PlantMapping = this.PlantMapping.filter(p => p['Plant'] === validateForm.value.plant);
    for (let index = 0; index < PlantMapping.length; index++) {
      const plantId = `${'F'}${PlantMapping[index]['PlantCode']}`
      if (!plantIds.includes(plantId)) {
        plantIds.push(plantId);
      }
    }
    const date1 = moment(new Date(validateForm.value.rangePicker[0]).getTime()).format('YYYY-MM-DD');
    const date2 = moment(new Date(validateForm.value.rangePicker[1]).getTime()).format('YYYY-MM-DD');
    return this.materialYieldRateApi.find({
      where: {
        materialId: validateForm.value.partNumber,
        plantId: { inq: plantIds },
        customer: validateForm.value.customer,
        modelFamily: validateForm.value.projectCode,
        model: validateForm.value.projectName,
        manufactureDate: { between: [date1, date2] }
      }
    }).pipe(map(FAdata => {
      for (let index = 0; index < FAdata.length; index++) {
        const plantCode = FAdata[index]['plantId'].toString().substr(1, 3);
        FAdata[index]['plantId'] = this.PlantMapping.find(p => p['PlantCode'] === plantCode)['Plant'];
      }
      return FAdata;
    }));
  }

  // 工廠端Top issue查詢
  getFactoryIssue(data) {
    let plantIds = [];
    const PlantMapping = this.PlantMapping.filter(p => p['Plant'] === data.plant);
    for (let index = 0; index < PlantMapping.length; index++) {
      const plantId = `${'F'}${PlantMapping[index]['PlantCode']}`
      if (!plantIds.includes(plantId)) {
        plantIds.push(plantId);
      }
    }
    return this.materialIssueApi.find({
      where: {
        manufactureDate: data.dateCode,
        plantId: { inq: plantIds },
        materialId: data.partNumber,
        modelFamily: data.projectCode,
        model: data.projectName
      }
    });
  }
  /**
   * 繪製 Report 折線圖
   *
   * @param {*} param
   * @returns
   * @memberof MrrMaterialReportService
   */
  getBadQuantityChart(param) {
    const showDay = param.date.length > 7 ? 7 : param.date.length;
    const per = 100 / param.date.length;
    const option = {
      title: {
        text: param.title,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      legend: {
        data: [
          '工廠端不良率Y/R（%）',
          '外驗端不良率Y/R（%）',
          '廠商端不良率Y/R（%）',
        ],
        left: 'right',
        top: 'top',
        orient: 'vertical'
      },
      grid: {
        left: '3%',
        right: '15%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: param.date
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} %'
        }
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 100 - (showDay - 1) * per,
          end: 100
        },
        {
          type: 'inside',
          realtime: true,
          start: 100 - (showDay - 1) * per,
          end: 100
        }
      ],
      color: ['rgb(60, 144, 247)', 'rgb(0, 102, 255)', 'rgb(255, 195, 0)'],
      series: [
        {
          symbolSize: 8,
          name: '工廠端不良率Y/R（%）',
          type: 'line',
          hoverAnimation: false,
          data: param.factoryDefectRate,
          label: {
            show: true,
            position: 'top'
          }
        },
        {
          symbolSize: 8,
          name: '外驗端不良率Y/R（%）',
          type: 'line',
          hoverAnimation: false,
          data: param.iqcDefectRate,
          label: {
            show: true,
            position: 'bottom'
          }
        },
        {
          symbolSize: 8,
          name: '廠商端不良率Y/R（%）',
          type: 'line',
          hoverAnimation: false,
          data: param.vendorDefectRate,
          label: {
            show: true,
            position: 'left'
          }
        }
      ]
    };
    return option;
  }
}
