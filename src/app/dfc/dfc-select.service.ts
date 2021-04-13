import { Injectable } from '@angular/core';
import { ProjectCodeProfileApi, ModelTypeMappingApi, ProcessApi, ProjectNameProfileApi, MemberApi } from '@service/dfc_sdk/sdk';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DfcSelectService {

  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  constructor(
    private projectCodeProfileApi: ProjectCodeProfileApi,
    private projectNameProfileApi: ProjectNameProfileApi,
    private modelTypeMappingApi: ModelTypeMappingApi,
    private processApi: ProcessApi,
    private memberApi: MemberApi
  ) { }

  /**
   * 獲取廠別下拉框
   *
   * @returns {Promise<any>}
   * @memberof DfcSelectService
   */
  getPlantSelect(): Promise<any> {
    return this.projectCodeProfileApi.GetPlant().toPromise().then(datas => {
      const plantList = [];
      datas.forEach(data => {
        if (!data['plant']) {
          plantList.push({ Value: data['plant'], Label: '无' });
        } else {
          const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === data['plant']);
          plantList.push({ Value: data['plant'], Label: plantMap['PlantName'] });
        }
      });
      return plantList;
    });
  }

  /**
   * 獲取產品下拉框的值
   *
   * @returns {Promise<any>}
   * @memberof DfcSelectService
   */
  getModelTypeSelect(): Promise<any> {
    return this.modelTypeMappingApi.find({}).toPromise().then(datas => {
      const list = [];
      datas.forEach(data => {
        list.push({ Value: data['ModelType'], Label: data['ModelType'] });
      });
      return list;
    });
  }

  /**
   * 獲取製程下拉框的值
   *
   * @returns {Promise<any>}
   * @memberof DfcSelectService
   */
  getProcessSelect(): Promise<any> {
    return this.processApi.find({}).toPromise().then(datas => {
      const list = [];
      datas.forEach(data => {
        list.push({ Value: data['ProcessCode'], Label: data['Name'] });
      });
      return list;
    });
  }

  /**
   * 獲取BU下拉框
   *
   * @param {*} plant
   * @param {*} bu
   * @param {boolean} multiple  true--多選, false--單選
   * @returns {Promise<any>}
   * @memberof DfcSelectService
   */
  getBUSelect(plant, bu, multiple: boolean): Promise<any> {
    let query;
    if (multiple) {
      query = {
        'include': {
          'relation': 'BU',
          'scop': {
            'fields': ['BU']
          }
        },
        'fields': ['ProfitCenter'],
        'where': {
          'Plant': { 'inq': plant }
        }
      };
    } else {
      query = {
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
      };
    }
    return this.projectCodeProfileApi.find(query).toPromise().then(proCodeDatas => {
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
    });
  }

  /**
   * 獲取客戶下拉框
   *
   * @param {string} custom
   * @param {any} plant
   * @param {any} bu
   * @param {boolean} multiple true--多選, false--單選
   * @returns {Promise<any>}
   * @memberof DfcSelectService
   */
  getCustomerSelect(custom: string, plant: any, bu: any, multiple: boolean): Promise<any> {
    let query;
    if (multiple) {
      query = {
        'include': {
          'relation': 'BU',
          'scop': {
            'fields': ['BU']
          }
        },
        'fields': ['Customer', 'ProfitCenter'],
        'where': {
          'and': [
            { 'Plant': { 'inq': plant } },
            { 'Customer': { 'like': '%' + custom + '%' } }
          ]
        }
      };
    } else {
      query = {
        'include': {
          'relation': 'BU',
          'scop': {
            'fields': ['BU']
          }
        },
        'fields': ['Customer', 'ProfitCenter'],
        'where': {
          'and': [
            { 'Plant': plant },
            { 'Customer': { 'like': '%' + custom + '%' } }
          ]
        }
      };
    }
    return this.projectCodeProfileApi.find(query).toPromise().then(datas => {
      const list = datas.reduce((p, t) => {
        if ((!bu) || (!!bu && (!!t['BU'] && bu.includes(t['BU']['BU'])))) {
          if (!p['temp'].includes(t['Customer']) && !!t['Customer']) {
            p['temp'].push(t['Customer']);
            p['customer'].push({ Value: t['Customer'], Label: t['Customer'] });
          }
        }
        return p;
      }, { 'customer': [], 'temp': [] });
      return list['customer'];
    });
  }

  /**
   * 獲取ProjectCode下拉框
   *
   * @param {string} proCode
   * @param {{plant: any, bu?: any, custom?: any, modelType?: any}} selectValue
   * @param {boolean} multiple true--多選, false--單選
   * @returns {Promise<any>}
   * @memberof DfcSelectService
   */
  getProCodeSelect(proCode: string, selectValue: { plant: any, bu?: any, custom?: any, modelType?: any }, multiple: boolean): Promise<any> {
    let query;
    if (multiple) {
      query = {
        'include': { 'relation': 'BU' },
        'fields': ['ProjectCode', 'ProjectCodeID', 'ProfitCenter'],
        'where': {
          'and': [
            { 'Plant': { 'inq': selectValue.plant } },
            { 'ProjectCode': { 'like': proCode + '%' } }
          ]
        },
        'limit': 20
      };
      if (!!selectValue.custom && selectValue.custom.length > 0) {
        query.where.and.push({ 'Customer': { 'inq': selectValue.custom } });
      }
      if (!!selectValue.modelType && selectValue.modelType.length > 0) {
        query.where.and.push({ 'ModelType': { 'inq': selectValue.modelType } });
      }
    } else {
      query = {
        'include': { 'relation': 'BU' },
        'fields': ['ProjectCode', 'ProjectCodeID', 'ProfitCenter'],
        'where': {
          'and': [
            { 'Plant': selectValue.plant },
            { 'ProjectCode': { 'like': proCode + '%' } },
            { 'Customer': { 'like': (!selectValue.custom ? '' : selectValue.custom) + '%' } },
            { 'ModelType': { 'like': (!selectValue.modelType ? '' : selectValue.modelType) + '%' } }
          ]
        },
        'limit': 20
      };
    }
    return this.projectCodeProfileApi.find(query).toPromise().then(datas => {
      const list = datas.reduce((p, t) => {
        if ((!selectValue.bu) || (!!selectValue.bu && (!!t['BU'] && selectValue.bu.includes(t['BU']['BU'])))) {
          if (!p['temp'].includes(t['ProjectCodeID']) && !!t['ProjectCodeID']) {
            p['temp'].push(t['ProjectCodeID']);
            p['proCode'].push({ Value: t['ProjectCodeID'], Label: t['ProjectCode'] });
          }
        }
        return p;
      }, { 'proCode': [], 'temp': [] });
      return list['proCode'];
    });
  }

  /**
   * 獲取ProjectName下拉框
   *
   * @param {*} proName
   * @param {{plant: any, proCode?: any, bu?: any, custom?: any, modelType?: any}} selectValue
   * @param {boolean} multiple true--多選, false--單選
   * @returns {Promise<any>}
   * @memberof DfcSelectService
   */
  async getProNameSelect(proName, selectValue: { plant: any, proCode?: any, bu?: any, custom?: any, modelType?: any }, multiple: boolean): Promise<any> {
    let proCode = selectValue.proCode;
    if (!proCode || proCode.length === 0) {
      let proCodeQuery;
      if (multiple) {
        proCodeQuery = {
          'include': { 'relation': 'BU' },
          'where': {
            'and': [
              { 'Plant': { 'inq': selectValue.plant } }
            ]
          },
          'fields': ['ProjectCodeID', 'ProfitCenter'],
          'limit': 50
        };
        if (!!selectValue.custom && selectValue.custom.length > 0) {
          proCodeQuery.where.and.push({ 'Customer': { 'inq': selectValue.custom } });
        }
        if (!!selectValue.modelType && selectValue.modelType.length > 0) {
          proCodeQuery.where.and.push({ 'ModelType': { 'inq': selectValue.modelType } });
        }
      } else {
        proCodeQuery = {
          'include': { 'relation': 'BU' },
          'where': {
            'and': [
              { 'Plant': selectValue.plant },
              { 'Customer': { 'like': (!selectValue.custom ? '' : selectValue.custom) + '%' } },
              { 'ModelType': { 'like': (!selectValue.modelType ? '' : selectValue.modelType) + '%' } }
            ]
          },
          'fields': ['ProjectCodeID', 'ProfitCenter'],
          'limit': 50
        };
      }
      const proCodeData = await this.projectCodeProfileApi.find(proCodeQuery).toPromise();
      proCode = [];
      proCodeData.forEach(data => {
        if (!selectValue.bu || (!!selectValue.bu && (!!data['BU'] && selectValue.bu.includes(data['BU']['BU'])))) {
          proCode.push(data['ProjectCodeID']);
        }
      });
    }
    const query = {
      'where': {
        'and': [
          { 'ProjectCodeID': { 'inq': proCode } },
          { 'ProjectName': { 'like': proName + '%' } }
        ]
      },
      'fields': ['ProjectName', 'ProjectNameID'],
      'limit': 20
    };
    return this.projectNameProfileApi.find(query).toPromise().then(datas => {
      const list = datas.reduce((p, t) => {
        if (!p['temp'].includes(t['ProjectNameID']) && !!t['ProjectNameID']) {
          p['temp'].push(t['ProjectNameID']);
          p['select'].push({ Value: t['ProjectNameID'], Label: t['ProjectName'] });
        }
        return p;
      }, { 'select': [], 'temp': [] });
      return list['select'];
    });
  }

  getUserSelect(name?): Observable<any> {
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
