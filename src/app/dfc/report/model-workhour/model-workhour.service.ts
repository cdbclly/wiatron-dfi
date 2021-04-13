import { Injectable } from '@angular/core';
import { ProjectCodeProfileApi, V_ProjectSummaryApi } from '@service/dfc_sdk/sdk';
@Injectable({
  providedIn: 'root'
})
export class ModelWorkhourService {

  constructor(
    private projectCodeProfileApi: ProjectCodeProfileApi,
    private vProjectSummaryApi: V_ProjectSummaryApi
  ) { }

  // 獲取BU下拉框
  async getBU(plant, bu): Promise<any> {
    const proCodeDatas = await this.projectCodeProfileApi.find({
      'include': {
        'relation': 'BU',
        'scop': {
          'fields': ['BU']
        }
      },
      'fields': ['ProfitCenter'],
      'where': {
        'Plant': plant
      }
    }).toPromise();
    const profitCenters = proCodeDatas.reduce((p, t) => {
      if (!!t['BU'] && t['BU']['BU'].toUpperCase().includes(bu.toUpperCase())) {
        if (!p['bu'].includes(t['BU']['BU'])) {
          p['bu'].push(t['BU']['BU']);
          p['select'].push({ Value: t['BU']['BU'], Label: t['BU']['BU'] });
        }
      }
      return p;
    }, { bu: [], select: [] });
    return profitCenters['select'];
  }

  // 獲取 客戶 下拉框
  async getCustom(plant, bu, custom): Promise<any> {
    const query: any = {
      'where': {
        'Plant': plant
      },
      'fields': ['Customer']
    };
    if (bu) {
      query.where['BU'] = bu;
    }
    if (custom) {
      query.where['Customer'] = { 'like': custom };
    }
    const proSummaryDatas = await this.vProjectSummaryApi.find(query).toPromise();
    console.log(proSummaryDatas);
    const res = proSummaryDatas.reduce((p, t) => {
      if (!p['custom'].includes(t['Customer'])) {
        p['custom'].push(t['Customer']);
        p['select'].push({ Value: t['Customer'], Label: t['Customer'] });
      }
      return p;
    }, { custom: [], select: [] });
    return res['select'];
  }
}
