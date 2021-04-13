import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectMenuApi, ParameterSettingApi, ParameterSettingLogApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SystemParamPlantService {

  constructor(private http: HttpClient,
    private selectService: SelectMenuApi,
    private parameterSettingsService: ParameterSettingApi,
    private parameterSettingLogService: ParameterSettingLogApi
    ) { }

  // 根據site獲取廠商
  getFactorys(data?) {
    return this.selectService.getSelectMenu(data).pipe(map((res) => {

      console.log(res['result']['plant']);
      return res['result']['plant'];
    }));
  }

  getSites() {
    return this.selectService.getSelectMenu().pipe(map((res) => {

      console.log(res['result']['site']);
      return res['result']['site'];
    }));
  }

  // 取得表格內容
  getInfo(plant) {
    return this.parameterSettingsService.getInfo(plant).pipe(map((res => {
      return res['result'];
    })));
  }

  // 修改參數內容
  updateParameterSetting(data) {
    return this.parameterSettingsService.putSetting(data).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getSiteByPlant(plant) {
    return this.selectService.getSelectMenu({plant: plant}).pipe(map((res) => {
      return res['result']['site'][0];
    })).toPromise();
  }

  addParamterLog(item) {
    return this.parameterSettingLogService.upsert(item).subscribe(res => {
      console.log(res);
      return res;
    });
  }
}
