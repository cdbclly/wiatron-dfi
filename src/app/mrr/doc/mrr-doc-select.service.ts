import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberApi } from '@service/dfc_sdk/sdk';
import { V_PlantProjectApi, DocumentTypeApi, ProductDocument, ProductDocumentApi } from '@service/mrr-sdk';


@Injectable({
  providedIn: 'root'
})
export class MrrDocSelectService {

  private PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));

  constructor(
    private vPlantProjectApi: V_PlantProjectApi,
    private documentTypeApi: DocumentTypeApi,
    private memberApi: MemberApi,
    private productDocumentApi: ProductDocumentApi
  ) { }

  /**
   * 獲取Site下拉框
   *
   * @returns {Observable<any>}
   * @memberof MrrDocSelectService
   */
  getSite(): Observable<any> {
    const site = this.PlantMapping.reduce((p, t) => {
      if (!p['temp'].includes(t['Site'])) {
        p['temp'].push(t['Site']);
        p['list'].push({ Value: t['Site'], Label: t['Site'] });
      }
      return p;
    }, { temp: [], list: [] });
    return of(site['list']);
  }

  /**
   * 獲取Plant下拉框
   *
   * @param {*} [site]
   * @returns {Observable<any>}
   * @memberof MrrDocSelectService
   */
  getPlant(site?): Observable<any> {
    const plant = this.PlantMapping.reduce((p, t) => {
      if ((!site || t['Site'] === site) && !p['temp'].includes(t['Plant'])) {
        p['temp'].push(t['Plant']);
        p['list'].push({ Value: t['Plant'], Label: t['Plant'] });
      }
      return p;
    }, { temp: [], list: [] });
    return of(plant['list']);
  }

  /**
   * 獲取產品下拉框
   *
   * @memberof MrrDocSelectService
   */
  getProductType(mrrModuleName, plant?): Observable<any> {
    const query: any = {
      'fields': ['productType', 'moduleName', 'moduleEnabled'],
      'where': {
        'and': [
          { 'productType': { 'like': '%' } },
          { 'currentStage': { 'neq': 'EX' } }
        ]
      }
    };
    if (plant && typeof (plant) === 'string') {
      query.where.and.push({ 'plant': plant });
    } else if (plant && plant.length > 0) {
      query.where.and.push({ 'plant': { 'inq': plant } });
    }
    return this.vPlantProjectApi.find(query).pipe(map(datas => {
      datas = datas.filter(a => a['moduleName'] === mrrModuleName && a['moduleEnabled']);
      const list = datas.reduce((p, t) => {
        if (!p['temp'].includes(t['productType'])) {
          p['temp'].push(t['productType']);
          p['list'].push({ Value: t['productType'], Label: t['productType'] });
        }
        return p;
      }, { 'temp': [], 'list': [] });
      return list['list'];
    }));
  }

  /**
   * 客戶別下拉框  可搜索使用
   *
   * @param {*} [plant]
   * @param {*} [productType]
   * @param {*} [customer]
   * @returns {Observable<any>}
   * @memberof MrrDocSelectService
   */
  getCustomer(mrrModuleName, plant?, productType?, customer?): Observable<any> {
    const query: any = {
      'fields': ['customer', 'moduleName', 'moduleEnabled'],
      'where': {
        'and': [
          { 'currentStage': { 'neq': 'EX' } }
        ]
      }
    };
    if (typeof (plant) === 'string' && !!plant) {
      query.where.and.push({ 'plant': plant });
    } else if (plant.length > 0) {
      query.where.and.push({ 'plant': { 'inq': plant } });
    }
    if (productType) {
      query.where.and.push({ 'productType': productType });
    }
    if (customer) {
      query.where.and.push({ 'customer': { 'like': customer + '%' } });
    }
    return this.vPlantProjectApi.find(query).pipe(map(datas => {
      datas = datas.filter(a => a['moduleName'] === mrrModuleName && a['moduleEnabled']);
      const list = datas.reduce((p, t) => {
        if (!p['temp'].includes(t['customer'])) {
          p['temp'].push(t['customer']);
          p['list'].push({ Value: t['customer'], Label: t['customer'] });
        }
        return p;
      }, { 'temp': [], 'list': [] });
      return list['list'];
    }));
  }

  /**
   * 獲取BU下拉框
   *
   * @param {*} [plant]
   * @param {*} [productType]
   * @param {*} [customer]
   * @param {*} [bu]
   * @returns {Observable<any>}
   * @memberof MrrDocSelectService
   */
  getBu(mrrModuleName, plant?, productType?, customer?, bu?): Observable<any> {
    const query: any = {
      'fields': ['bu', 'moduleName', 'moduleEnabled'],
      'where': {
        'and': [
          { 'currentStage': { 'neq': 'EX' } }
        ]
      }
    };
    if (typeof (plant) === 'string' && plant) {
      query.where.and.push({ 'plant': plant });
    } else if (plant.length > 0) {
      query.where.and.push({ 'plant': { 'inq': plant } });
    }
    if (productType) {
      query.where.and.push({ 'productType': productType });
    }
    if (customer) {
      query.where.and.push({ 'customer': customer });
    }
    if (bu) {
      query.where.and.push({ 'bu': { 'like': bu + '%' } });
    }
    return this.vPlantProjectApi.find(query).pipe(map(datas => {
      datas = datas.filter(a => a['moduleName'] === mrrModuleName && a['moduleEnabled']);
      const list = datas.reduce((p, t) => {
        if (!p['temp'].includes(t['bu'])) {
          p['temp'].push(t['bu']);
          p['list'].push({ Value: t['bu'], Label: t['bu'] });
        }
        return p;
      }, { 'temp': [], 'list': [] });
      return list['list'];
    }));
  }

  /**
   * 獲取Project Code下拉框
   *
   * @param {*} [plant]
   * @param {*} [productType]
   * @param {*} [customer]
   * @param {*} [proCode]
   * @returns {Observable<any>}
   * @memberof MrrDocSelectService
   */
  getProCode(mrrModuleName, plant?, productType?, customer?, proCode?, proName?): Observable<any> {
    const query: any = {
      'fields': ['projectCode', 'moduleName', 'moduleEnabled'],
      'where': {
        'and': [
          { 'currentStage': { 'neq': 'EX' } }
        ]
      }
    };
    if (plant) {
      query.where.and.push({ 'plant': plant });
    }
    if (productType) {
      query.where.and.push({ 'productType': productType });
    }
    if (customer) {
      query.where.and.push({ 'customer': customer });
    }
    if (proCode) {
      query.where.and.push({ 'projectCode': proCode });
    }
    if (proName) {
      query.where.and.push({ 'projectName': proName });
    }
    return this.vPlantProjectApi.find(query).pipe(map(datas => {
      datas = datas.filter(a => a['moduleName'] === mrrModuleName && a['moduleEnabled']);
      const list = datas.reduce((p, t) => {
        if (!p['temp'].includes(t['projectCode'])) {
          p['temp'].push(t['projectCode']);
          p['list'].push({ Value: t['projectCode'], Label: t['projectCode'] });
        }
        return p;
      }, { 'temp': [], 'list': [] });
      return list['list'];
    }));
  }

  /**
   * 獲取機種下拉框
   *
   * @param {*} [plant]
   * @param {*} [productType]
   * @param {*} [customer]
   * @param {*} [proCode]
   * @param {*} [proName]
   * @returns {Observable<any>}
   * @memberof MrrDocSelectService
   */
  getProName(mrrModuleName, plant?, productType?, customer?, proCode?, proName?): Observable<any> {
    const query: any = {
      'fields': ['projectName', 'moduleName', 'moduleEnabled'],
      'where': {
        'and': [
          { 'currentStage': { 'neq': 'EX' } }
        ]
      }
    };
    if (plant) {
      query.where.and.push({ 'plant': plant });
    }
    if (productType) {
      query.where.and.push({ 'productType': productType });
    }
    if (customer) {
      query.where.and.push({ 'customer': customer });
    }
    if (proCode) {
      query.where.and.push({ 'projectCode': proCode });
    }
    if (proName) {
      query.where.and.push({ 'projectName': proName });
    }
    return this.vPlantProjectApi.find(query).pipe(map(datas => {
      datas = datas.filter(a => a['moduleName'] === mrrModuleName && a['moduleEnabled']);
      const list = datas.reduce((p, t) => {
        if (!p['temp'].includes(t['projectName'])) {
          p['temp'].push(t['projectName']);
          p['list'].push({ Value: t['projectName'], Label: t['projectName'] });
        }
        return p;
      }, { 'temp': [], 'list': [] });
      return list['list'];
    }));
  }

  /**
   * 獲取 文件類別 下拉框
   *
   * @returns {Observable<any>}
   * @memberof MrrDocSelectService
   */
  getDocTypeSelect(): Observable<any> {
    return this.documentTypeApi.find({}).pipe(map(data => {
      return data.map(p => {
        return { Value: p['typeId'], Label: p['typeName'] };
      });
    }));
  }

  /**
   * 搜索User
   *
   * @param {*} [user]
   * @returns {Observable<any>}
   * @memberof MrrDocSelectService
   */
  getUserAllSelect(user?): Observable<any> {
    return this.memberApi.find({
      'where': {
        'or': [
          { Group: { like: '%' + (!user ? '' : user) + '%' } },
          { Name: { like: '%' + (!user ? '' : user) + '%' } },
          { EName: { like: '%' + (!user ? '' : user) + '%' } },
          { Site: { like: '%' + (!user ? '' : user) + '%' } },
          { Plant: { like: '%' + (!user ? '' : user) + '%' } },
          { Role: { like: '%' + (!user ? '' : user) + '%' } },
          { EmpID: { like: '%' + (!user ? '' : user) + '%' } }
        ]
      },
      'fields': ['EmpID', 'Name', 'EName'],
      'limit': 20
    }).pipe(map(members => {
      return members.map(member => {
        return {
          'Label': member['EName'],
          'Value': member['EmpID'],
          'Show': member['EmpID'] + '\t' + member['Name'] + '\t' + member['EName']
        };
      });
    }));
  }
  getTypeDocument(plant, productType): Observable<ProductDocument[]> {
    return this.productDocumentApi.find({
      where: {
        plant: plant,
        productId: productType
      },
      include: { 'document': 'documentType' }
    }
    );
  }
}
