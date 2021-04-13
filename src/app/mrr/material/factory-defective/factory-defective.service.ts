import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import {
  NuddItemApi
} from '@service/mrr-sdk';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { MaterialYieldRateApi } from '@service/mrr-sdk/services/custom/MaterialYieldRate';
import { MaterialIssueApi } from '@service/mrr-sdk/services/custom/MaterialIssue';
@Injectable({
  providedIn: 'root'
})
export class FactoryDefectiveService {
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));

  constructor(
    private nuddItemService: NuddItemApi,
    private materialYieldRateApi: MaterialYieldRateApi,
    private materialIssueApi: MaterialIssueApi
  ) { }

  // FA不良查詢
  getFactoryData(validateForm: FormGroup) {
    let plantIds = [];
    const PlantMapping = this.PlantMapping.filter(p => p['Plant'] === validateForm.value.selectPlant);
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
        materialId: validateForm.value.selectPartNumber,
        plantId: { inq: plantIds },
        modelFamily: validateForm.value.selectProjectCode,
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

  // FA材料不良issue查詢與修改
  updateFactoryIssue(datas, type): Observable<any[]> {
    return forkJoin(
      datas.map(d => {
        let param: any = {};
        if (type === 'save') {
          param = {
            owner: d.owner ? d.owner : localStorage.getItem('$DFI$userID'),
            rootCause: d.rootCause,
            action: d.action,
            dueDate: d.dueDate,
            status: d.status, // SQM可修改狀態
            filePath: d.filePath
          };
        } else if (type === 'submit') {
          param = {
            owner: d.owner ? d.owner : localStorage.getItem('$DFI$userID'),
            rootCause: d.rootCause,
            action: d.action,
            dueDate: d.dueDate,
            status: 1, // SQM送出狀態為open
            filePath: d.filePath
          };
        }
        return this.materialIssueApi.patchAttributes(d.id, param);
      })
    );
  }

  getFactoryIssue(data) {
    let plantIds = [];
    const PlantMapping = this.PlantMapping.filter(p => p['Plant'] === data.plantId);
    for (let index = 0; index < PlantMapping.length; index++) {
      const plantId = `${'F'}${PlantMapping[index]['PlantCode']}`
      if (!plantIds.includes(plantId)) {
        plantIds.push(plantId);
      }
    }
    return this.materialIssueApi.find({
      where: {
        manufactureDate: data.manufactureDate,
        plantId: { inq: plantIds },
        materialId: data.materialId,
        modelFamily: data.modelFamily,
        model: data.model
      }
    }).pipe(map((res: any) => {
      for (let index = 0; index < res.length; index++) {
        if (this.PlantMapping.filter(p => p['PlantCode'] === res[index].plantId.substr(1, 3))) {
          res[index].plantId = this.PlantMapping.filter(p => p['PlantCode'] === res[index].plantId.substr(1, 3))[0].Plant;
        }
      }
      return res;
    }));
  }

  addFactoryIssue(form) {
    return this.materialIssueApi.create(form);
  }

  // link nudd 增 刪 查 
  getNuddItem(form) {
    return this.nuddItemService.find(form);
  }

  createNuddItem(form) {
    return this.nuddItemService.create(form);
  }

  updateNuddItem(form) {
    return this.nuddItemService.deleteById(form);
  }
}
