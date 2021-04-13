import { Injectable } from '@angular/core';
import { ProjectCodeProfileApi, BasicModelApi, GroupModelApi, GroupModel, BasicModel, GroupModelMappingApi, TargetOperationSignApi, V_ProjectSelectApi } from '@service/dfc_sdk/sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewmodelMaintainService {

  constructor(
    private projectCodeProfileApi: ProjectCodeProfileApi,
    private basicModelApi: BasicModelApi,
    private groupModelApi: GroupModelApi,
    private groupModelMappingApi: GroupModelMappingApi,
    private targetOperationSignApi: TargetOperationSignApi,
    private vProjectSelectApi: V_ProjectSelectApi
  ) { }

  /**
   * Project Code
   *
   * @param {*} [plant]
   * @param {*} [bu]
   * @param {*} [custom]
   * @param {*} [productType]
   * @param {*} [proCode]
   * @param {boolean} [status]
   * @returns {Observable<any>}
   * @memberof NewmodelMaintainService
   */
  getProCode(plant?, bu?, custom?, productType?, proCode?, status?: boolean): Observable<any> {
    const query: any = {
      'where': {
        'and': [
        ]
      },
      'fields': ['ProjectCodeID', 'ProjectCode'],
      'limit': 200
    };
    if (!!plant) {
      query.where.and.push({ 'Plant': plant });
    }
    if (!!bu) {
      query.where.and.push({ 'BU': bu });
    }
    if (!!custom) {
      query.where.and.push({ 'Customer': custom });
    }
    if (!!productType) {
      query.where.and.push({ 'ModelType': productType });
    }
    if (!!proCode) {
      query.where.and.push({ 'ProjectCode': { 'like': proCode.trim() + '%' } });
    }
    if (status) {
      query.where.and.push({ 'Status': 0 });
    }
    return this.vProjectSelectApi.find(query).pipe(map(datas => {
      const list = datas.reduce((p, t) => {
        if (!p['temp'].includes(t['ProjectCodeID'])) {
          p['temp'].push(t['ProjectCodeID']);
          p['res'].push({ Value: t['ProjectCodeID'], Label: t['ProjectCode'] });
        }
        return p;
      }, { 'temp': [], 'res': [] });
      return list['res'];
    }));
  }

  /**
   * Project Name 下拉框
   *
   * @param {*} [plant]
   * @param {*} [bu]
   * @param {*} [custom]
   * @param {*} [productType]
   * @param {*} [proCode]
   * @param {*} [proName]
   * @param {boolean} [status]
   * @returns {Observable<any>}
   * @memberof NewmodelMaintainService
   */
  getProName(plant?, bu?, custom?, productType?, proCode?, proName?, status?: boolean): Observable<any> {
    const query: any = {
      'where': {
        'and': [
        ]
      },
      'fields': ['ProjectNameID', 'ProjectName', 'ProjectCodeID', 'ProjectCode'],
      'limit': 200
    };
    if (!!plant) {
      query.where.and.push({ 'Plant': plant });
    }
    if (!!bu) {
      query.where.and.push({ 'BU': bu });
    }
    if (!!custom) {
      query.where.and.push({ 'Customer': custom });
    }
    if (!!productType) {
      query.where.and.push({ 'ModelType': productType });
    }
    if (!!proCode) {
      query.where.and.push({ 'ProjectCodeID': proCode });
    }
    if (!!proName) {
      query.where.and.push({ 'ProjectName': { 'like': proName.trim() + '%' } });
    }
    if (status) {
      query.where.and.push({ 'Status': 0 });
    }
    return this.vProjectSelectApi.find(query).pipe(map(datas => {
      const list = datas.reduce((p, t) => {
        if (!p['temp'].includes(t['ProjectNameID'])) {
          p['temp'].push(t['ProjectNameID']);
          p['res']['proName'].push({ Value: t['ProjectNameID'], Label: t['ProjectName'] });
          p['res']['proCode'][t['ProjectNameID']] = { Value: t['ProjectCodeID'], Label: t['ProjectCode'] };
        }
        return p;
      }, { 'temp': [], 'res': { 'proName': [], 'proCode': {} } });
      return list['res'];
    }));
  }

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

  getModel(where): Observable<BasicModel[]> {
    return this.basicModelApi.find(
      {
        where: where,
        include: [{
          'relation': 'stages',
          'scope': {
            'where': {
              'Stage': 'RFQ'
            },
            'include': [{
              'relation': 'targetOperationSigns',
              'scope': {
                'include': ['workflow'],
                'order': 'id asc'
              }
            }]
          }
        }]
      }
    )
  }

  getGroupModel(where): Observable<GroupModel[]> {
    return this.groupModelApi.find(
      {
        where: where
      }
    );
  }

  getGroupModelMapping(groupModelId) {
    return this.groupModelMappingApi.find(
      {
        where: {
          groupModelId: groupModelId
        }
      }
    );
  }

  deleteModel(id) {
    return this.basicModelApi.deleteById(id);
  }

  deleteGroupModel(id) {
    return this.groupModelApi.deleteById(id);
  }

  addGroupModelMapping(data) {
    return this.groupModelMappingApi.create(data);
  }
  editGroupModelMapping(id, data) {
    return this.groupModelMappingApi.patchAttributes(id, data);
  }

  deleteGroupModelMapping(id) {
    return this.groupModelMappingApi.deleteById(id);
  }

}
