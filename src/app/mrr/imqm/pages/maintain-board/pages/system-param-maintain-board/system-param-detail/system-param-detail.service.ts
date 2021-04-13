import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectMenuApi, ParameterSettingApi, ParameterSettingLogApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SystemParamDetailService {

  constructor(private http: HttpClient,
    private selectService: SelectMenuApi,
    private parameterSettingsService: ParameterSettingApi,
    private parameterSettingLogService: ParameterSettingLogApi
  ) { }

  // 根據site獲取廠商
  getFactorys(data?) {
    // return this.selectService.getSelectMenu(data).pipe(map((res) => {
    //   console.log(res['result']);
    //   return res['result'];
    // }));
    if (data) {
      return this.parameterSettingsService.find({where: {and: [{site: data['site']}, {plant: data['plant']}]}});
    } else {
      return this.parameterSettingsService.find();
    }
  }

  // 取得TABLE內容
  getParameterSetting(data) {
    return this.parameterSettingsService.getParametersetting(data).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  // 新增參數內容
  addParameterSetting(data) {
    return this.parameterSettingsService.createSetting(data).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  // 修改參數內容
  updateParameterSetting(data) {
    return this.parameterSettingsService.putSetting(data).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  // 刪除參數內容
  deleteParameterSetting(data) {
    // return this.parameterSettingsService.deleteSetting(data).subscribe(res => {
    //   console.log(res);
    //   if (res) {
    //     return res;
    //   } else {
    //     return null;
    //   }
    // });
    return this.parameterSettingsService.deleteSetting(data);
  }

  // 檢查參數內容是否存在
  checkParameterSetting(data) {
    return this.parameterSettingsService.ckeckHasSetting(data).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    })).toPromise();
  }

  addParamterLog(item) {
    return this.parameterSettingLogService.upsert(item).subscribe(res => {
      console.log(res);
      return res;
    });
  }

  deleteParamterLog(uuid) {
    return this.parameterSettingLogService.deleteSettingLog(uuid).subscribe(res => {
      return res;
    });
  }

  // 获取site plant
  getSitePlantGroup() {
    return this.selectService.find({fields: {site: true, plant: true}}).pipe(map((res) => {
      const siteInfoArr = [];
      const obj = {};
      return res.reduce((prev: any, next) => {
        obj[next['site'] + '-' + next['plant']] ? '' : obj[next['site'] + '-' + next['plant']] = true && prev.push({site: next['site'], plant: next['plant']});
        return prev;
      }, []);
    }));
  }

  // 获取下拉框内容
   // 獲取site 下拉框資料
   getSelectDatas(data?) {
    return this.selectService.getSelectMenu(data).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getParamsSelectData(data?) {
    return this.parameterSettingsService.getInfo(data).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  // 数组项去重
  cleanArrDuplicate(arr: any[]) {
    let arrTmp: any[] = Array.from(new Set(arr));
    arr.length = 0;
    arrTmp.map((item, index) => {
      arr[index] = item;
    });
    arrTmp = null;
  }
}
