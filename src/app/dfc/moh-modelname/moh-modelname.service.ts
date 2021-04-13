import { Injectable } from '@angular/core';
import { ProjectCodeProfileApi } from '@service/dfc_sdk/sdk';

@Injectable({
  providedIn: 'root'
})
export class MohModelnameService {

  constructor(
    private projectCodeProfileApi: ProjectCodeProfileApi
  ) { }

  // 獲取BU下拉框
  async getBU(plant, bu): Promise<any> {
    console.log(plant);
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
}
