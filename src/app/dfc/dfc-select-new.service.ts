import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { ProcessApi, BasicModelApi, StageApi, GroupModelApi, V_ProjectSelectApi, MemberApi } from '@service/dfc_sdk/sdk';
import { map } from 'rxjs/operators';
import { ProductApi } from '@service/dfi-sdk';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class DfcSelectNewService {
  private PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));

  constructor(
    private vProjectSelectApi: V_ProjectSelectApi,
    private productApi: ProductApi,
    private processApi: ProcessApi,
    private basicModelApi: BasicModelApi,
    private groupModelApi: GroupModelApi,
    private stageApi: StageApi,
    private memberApi: MemberApi
  ) { }

  /**
   * 獲取廠別信息
   *
   * @returns {Observable<any>}
   * @memberof DfcSelectNewService
   */
  getPlant(): Observable<any> {
    const plant = this.PlantMapping.reduce((p, t) => {
      if (!p['temp'].includes(t['Plant'])) {
        p['temp'].push(t['Plant']);
        p['list'].push({ Value: t['Plant'], Label: t['PlantName'] });
      }
      return p;
    }, { temp: [], list: [] });
    const list = plant['list'].sort((a, b) => a.Label > b.Label ? 1 : -1);
    return of(list);
  }

  /**
   * 產品下拉框
   *
   * @returns
   * @memberof DfcSelectNewService
   */
  getProductType(): Observable<any> {
    return this.productApi.find().pipe(map(datas => {
      const list = [];
      datas.forEach(data => {
        list.push({ Value: data['id'], Label: data['id'] });
      });
      return list;
    }));
  }

  /**
   * 製程
   *
   * @returns {Observable<any>}
   * @memberof DfcSelectNewService
   */
  getProcess(): Observable<any> {
    return this.processApi.find().pipe(map(datas => {
      const list = [];
      datas.forEach(data => {
        list.push({ Value: data['ProcessCode'], Label: data['Name'] });
      });
      return list;
    }));
  }

  /**
   * 獲取BU信息
   *
   * @param {*} [plant]
   * @param {*} [bu]
   * @returns {Observable<any>}
   * @memberof DfcSelectNewService
   */
  getBU(plant?, bu?, currentStage?: boolean): Observable<any> {
    const query: any = {
      'where': {
        'and': [
        ]
      },
      'fields': ['BU']
    };
    if (!!plant) {
      query.where.and.push({ 'Plant': plant });
    }
    if (!!bu) {
      query.where.and.push({ 'BU': { 'like': bu + '%' } });
    }
    if (currentStage) {
      query.where.and.push({ 'CurrentStage': { 'neq': 'EX' } });
    }
    return this.vProjectSelectApi.find(query).pipe(map(datas => {
      const list = datas.reduce((p, t) => {
        if (!!t['BU'] && !p['temp'].includes(t['BU'])) {
          p['temp'].push(t['BU']);
          p['list'].push({ Value: t['BU'], Label: t['BU'] });
        }
        return p;
      }, { 'temp': [], 'list': [] });
      return list['list'];
    }));
  }

  /**
   * 獲取客戶
   *
   * @param {*} [plant]
   * @param {*} [bu]
   * @param {*} [custom]
   * @returns {Observable<any>}
   * @memberof DfcSelectNewService
   */
  getCustom(plant?, bu?, custom?, currentStage?: boolean): Observable<any> {
    const query: any = {
      'where': {
        'and': [
        ]
      },
      'fields': ['Customer']
    };
    if (!!plant) {
      query.where.and.push({ 'Plant': plant });
    }
    if (!!bu) {
      query.where.and.push({ 'BU': bu });
    }
    if (!!custom) {
      query.where.and.push({ 'Customer': { 'like': custom.trim() + '%' } });
    }
    if (currentStage) {
      query.where.and.push({ 'CurrentStage': { 'neq': 'EX' } });
    }
    return this.vProjectSelectApi.find(query).pipe(map(datas => {
      const list = datas.reduce((p, t) => {
        if (!!t['Customer'] && !p['temp'].includes(t['Customer'])) {
          p['temp'].push(t['Customer']);
          p['list'].push({ Value: t['Customer'], Label: t['Customer'] });
        }
        return p;
      }, { 'temp': [], 'list': [] });
      return list['list'];
    }));
  }

  /**
   * Project Code 下拉框
   *
   * @param {*} [plant]
   * @param {*} [bu]
   * @param {*} [custom]
   * @param {*} [productType]
   * @param {*} [proCode]
   * @param {boolean} [status]  是否筛选 status只为0的内容
   * @returns {Observable<any>}
   * @memberof DfcSelectNewService
   */
  getProCode(plant?, bu?, custom?, productType?, proCode?, status?: boolean, currentStage?: boolean): Observable<any> {
    const query: any = {
      'where': {
        'and': [
        ]
      },
      'fields': ['ProjectCodeID', 'ProjectCode', 'ProjectNameID', 'ProjectName'],
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
    if (currentStage) {
      query.where.and.push({ 'CurrentStage': { 'neq': 'EX' } });
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
   * Project Name值 并關聯出 對應的Project Code
   *
   * @param {*} [plant]
   * @param {*} [bu]
   * @param {*} [custom]
   * @param {*} [productType]
   * @param {*} [proName]
   * @param {boolean} [status] 是否筛选 status只为0的内容
   * @returns {Observable<any>}
   * @memberof DfcSelectNewService
   */
  getProName(plant?, bu?, custom?, productType?, proName?, status?: boolean, currentStage?: boolean): Observable<any> {
    const query: any = {
      'where': {
        'and': [
        ]
      },
      'fields': ['ProjectCodeID', 'ProjectCode', 'ProjectNameID', 'ProjectName', 'CurrentStage', 'Plant'],
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
    if (!!proName) {
      query.where.and.push({ 'ProjectName': { 'like': proName.trim() + '%' } });
    }
    if (status) {
      query.where.and.push({ 'Status': 0 });
    }
    if (currentStage) {
      query.where.and.push({ 'CurrentStage': { 'neq': 'EX' } });
    }
    return this.vProjectSelectApi.find(query).pipe(map(datas => {
      const list = datas.reduce((p, t) => {
        if (!p['temp'].includes(t['ProjectNameID'])) {
          p['temp'].push(t['ProjectNameID']);
          if (t['ProjectCode'].includes('DMA-')) {
            p['res']['proName'].push({ Value: t['ProjectNameID'], Label: t['Plant'] + '-' + t['ProjectName'] });
          } else {
            p['res']['proName'].push({ Value: t['ProjectNameID'], Label: t['ProjectName'] });
          }
          p['res']['proCode'][t['ProjectNameID']] = { Value: t['ProjectCodeID'], Label: t['ProjectCode'] };
          p['res']['currentStage'][t['ProjectNameID']] = t['CurrentStage'];
        }
        return p;
      }, { 'temp': [], 'res': { 'proName': [], 'proCode': {}, 'currentStage': {} } });
      return list['res'];
    }));
  }

  /**
   * model下拉框
   *
   * @param {*} [proName]
   * @param {*} [model]
   * @returns {Observable<any>}
   * @memberof DfcSelectNewService
   */
  getModel(proName?, model?, groupFlag?: boolean): Observable<any> {
    const queryBasicModel: any = {
      'where': {
        'and': [
        ]
      },
      'fields': ['modelId', 'modelName'],
      'limit': 200
    };
    if (!!proName) {
      queryBasicModel.where.and.push({ 'projectNameId': proName });
    }
    if (!!model) {
      queryBasicModel.where.and.push({ 'modelName': { 'like': model.trim() + '%' } });
    }
    if (groupFlag) {
      const queryGroupModel: any = {
        'where': {
          'and': [
          ]
        },
        'fields': ['groupModelId', 'groupModelName'],
        'limit': 200
      };
      if (!!proName) {
        queryGroupModel.where.and.push({ 'projectNameId': proName });
      }
      if (!!model) {
        queryGroupModel.where.and.push({ 'groupModelName': { 'like': model + '%' } });
      }
      return forkJoin(
        this.basicModelApi.find(queryBasicModel),
        this.groupModelApi.find(queryGroupModel)
      ).pipe(map(datas => {
        // BasicModel
        let list = datas[0].reduce((p, t) => {
          if (!p['temp'].includes(('B-' + t['modelId']))) {
            p['temp'].push(('B-' + t['modelId']));
            p['res']['list'].push({ Value: ('B-' + t['modelId']), Label: t['modelName'] });
          }
          if (!p['res']['def']) {
            p['res']['def'] = ('B-' + t['modelId']);
          }
          return p;
        }, { 'temp': [], 'res': { 'list': [], 'def': '' } });
        // GroupModel
        list = datas[1].reduce((p, t) => {
          if (!p['temp'].includes(('G-' + t['groupModelId']))) {
            p['temp'].push(('G-' + t['groupModelId']));
            p['res']['list'].push({ Value: ('G-' + t['groupModelId']), Label: t['groupModelName'] });
          }
          if (!p['res']['def']) {
            p['res']['def'] = ('G-' + t['groupModelId']);
          }
          return p;
        }, list);
        return list['res'];
      }));
    } else {
      return this.basicModelApi.find(queryBasicModel).pipe(map(datas => {
        const list = datas.reduce((p, t) => {
          if (!p['temp'].includes(t['modelId'])) {
            p['temp'].push(t['modelId']);
            p['res']['list'].push({ Value: t['modelId'], Label: t['modelName'] });
          }
          if (!p['res']['def']) {
            p['res']['def'] = t['modelId'];
          }
          return p;
        }, { 'temp': [], 'res': { 'list': [], 'def': '' } });
        return list['res'];
      }));
    }
  }

  /**
   * C階段下拉框
   *
   * @param {*} model
   * @returns {Observable<any>}
   * @memberof DfcSelectNewService
   */
  getStage(model): Observable<any> {
    if (!!model) {
      return this.stageApi.find({
        'where': { 'ModelID': model },
        'order': 'StageID asc'
      }).pipe(map(datas => {
        const list = datas.reduce((p, t) => {
          if (t['Stage'] === 'RFQ') {
            p['list'].splice(0, 0, { Value: t['StageID'], Label: t['Stage'] });
          } else {
            p['list'].push({ Value: t['StageID'], Label: t['Stage'] });
          }
          p['list'] = p['list'].slice();
          return p;
        }, { 'list': [] });
        return list['list'];
      }));
    } else {
      return of([]);
    }
  }

  /**
   * 獲取 Member下拉框
   *
   * @param {*} [name]
   * @returns {Observable<any>}
   * @memberof DfcSelectNewService
   */
  getMember(name?): Observable<any> {
    return this.memberApi.find({
      'where': {
        'or': [
          { 'EmpID': { 'like': (!name ? '' : name) + '%' } },
          { 'Name': { 'like': (!name ? '' : name) + '%' } },
          { 'EName': { 'like': (!name ? '' : name) + '%' } }
        ]
      },
      'limit': 20,
      'fields': ['EmpID', 'Name', 'EName']
    }).pipe(map(datas => {
      return datas.map(data => {
        return {
          Value: data['EmpID'],
          Label: data['EName'] + '\t' + data['Name'] + '\t' + data['EmpID']
        };
      });
    }));
  }
}
