import { map } from 'rxjs/operators';
import { ParameterSettingApi, V_MRR_BYLAW_DIMENSION_IMAGEApi } from '@service/imqm-sdk';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CpkCriteriaService {

  constructor(
    private parameterSettingApi: ParameterSettingApi,
    private imageApi: V_MRR_BYLAW_DIMENSION_IMAGEApi,
    private ipUrl: ParameterSettingApi
  ) { }

  // 获取cpk判定值
  getCpkSetting(data) {
    return this.parameterSettingApi.getDefaultValue('cpkCriteria', data).pipe(map((res => {
      return res['result'];
    })));
  }

  getImage(data) {
    return this.imageApi.getImage(data).pipe(map((res => {
      return res['result'];
    })));
  }

  getIp(data) {
    return this.ipUrl.getInfo(data).pipe(map((res => {
      return res['result'];
    })));
  }
}
