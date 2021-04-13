import { Injectable } from '@angular/core';
import {
  ManufacturerApi,
  PartApi,
  PartNumberApi,
  PartNumberVendorApi,
  VendorApi,
  PlantCustomerApi,
  V_PlantProjectApi,
  MaterialYieldRateApi,
  View_LatestTargetYieldApi,
  PartNumberVendorRecordApi,
  View_ManufacturerMaterialYieldRateApi
} from '@service/mrr-sdk';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectStageApi, ProjectApi } from '@service/dfi-sdk';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { SqmsIqcDataApi } from '@service/mrr-sdk/services/custom/SqmsIqcData';

@Injectable({
  providedIn: 'root'
})
export class MrrMaterialSelectService {
  private PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  constructor(
    private manufacturerApi: ManufacturerApi,
    private projectStageApi: ProjectStageApi,
    private partApi: PartApi,
    private partNumberApi: PartNumberApi,
    private partNumberVendorApi: PartNumberVendorApi,
    private vendorApi: VendorApi,
    private plantCustomerApi: PlantCustomerApi,
    private sqmIqcDataApi: SqmsIqcDataApi,
    private view_LastestTargetYield: View_LatestTargetYieldApi,
    private projectApi: ProjectApi,
    private vPlantProjectApi: V_PlantProjectApi,
    private partNumberVendorRecordApi: PartNumberVendorRecordApi,
    private materialYieldRateApi: MaterialYieldRateApi,
    private view_ManufacturerMaterialYieldRate: View_ManufacturerMaterialYieldRateApi
  ) { }

  // 廠商良率達標情況
  async getVendorRecord(validateForm: FormGroup) {
    const dateRange = [];
    dateRange[0] = moment(new Date(validateForm.value.rangePicker[0]).getTime()).format('YYYY-MM-DD');
    dateRange[1] = moment(new Date(validateForm.value.rangePicker[1]).getTime()).format('YYYY-MM-DD');
    // 查找所選日期內 廠商有輸入的機種料號記錄
    const queryDate: any = {
      where: {
        and: [{
          dateCode: { between: dateRange }
        }]
      }
    };
    const vendorRecord = await this.partNumberVendorRecordApi.find(queryDate).toPromise();
    const list = vendorRecord.reduce((p, t) => {
      if (!p['partNumberVendorIds'].includes(t['partNumberVendorId'])) {
        p['partNumberVendorIds'].push(t['partNumberVendorId']);
      }
      return p;
    }, { partNumberVendorIds: [] });
    const queryRecord: any = {
      where: {
        and: [
          { partNumberVendorId: { inq: list['partNumberVendorIds'] } },
          { operation: 'RTY' },
          { stage: { inq: ['C5', 'C6'] } }
        ]
      }
    };
    // 查詢廠商端料號最近一次的生產良率狀況
    return this.view_LastestTargetYield.find(queryRecord).pipe(map(async (res: any) => {
      for (let index = 0; index < res.length; index++) {
        const queryParam = {
          fields: ['materialActualYield'],
          where: {
            dateCode: { between: dateRange },
            plant: res[index].plant,
            partNumberVendorId: res[index].partNumberVendorId,
            projectCode: res[index].projectCode,
            partId: res[index].partId,
            stage: res[index].stage
          },
          order: 'dateCode DESC',
          limit: 1
        };
        const data = await this.view_ManufacturerMaterialYieldRate.find(queryParam).toPromise();
        res[index]['vendorTargetYield'] = data.length > 0 ? data[0]['materialActualYield'] : null;
      }
      return res;
    }));
  }

  // IQC外驗達標情況
  getSqmIqcRecord(validateForm: FormGroup) {
    //  SQM by PlantCode
    let plantIds = [];
    const PlantMapping = this.PlantMapping.filter(p => p['Plant'] === validateForm.value.plant);
    for (let index = 0; index < PlantMapping.length; index++) {
      const plantId = `${'F'}${PlantMapping[index]['PlantCode']}`
      if (!plantIds.includes(plantId)) {
        plantIds.push(plantId);
      }
    }

    let startDate = new Date(validateForm.value.rangePicker[0]);
    const endDate = new Date(validateForm.value.rangePicker[1]);
    const diffDay = (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24;
    // 初始化dateCode rule: 20200915
    const dates = [startDate.getFullYear() * 10000 + (startDate.getMonth() + 1) * 100 + startDate.getDate() + ''];
    const query: any = {
      where: {
        and: []
      }
    };
    if (validateForm.value.partNumber) {
      query.where.and.push({ materialId: validateForm.value.partNumber });
    }
    if (validateForm.value.manufacturer) {
      query.where.and.push({ manufacturerId: validateForm.value.manufacturer });
    }
    if (validateForm.value.plant) {
      query.where.and.push({ plantId: { inq: plantIds } });
    }
    for (let i = 0; i < diffDay; i++) {
      startDate.setDate(startDate.getDate() + 1);
      const dateString = startDate.getFullYear() * 10000 + (startDate.getMonth() + 1) * 100 + startDate.getDate() + '';
      dates.push(dateString);
    }
    query.where.and.push({ dateCode: { inq: dates } });
    return this.sqmIqcDataApi.find(query);
  }

  // FA材料達標情況
  getFactoryRecord(validateForm: FormGroup) {
    const dateRange = [];
    dateRange[0] = moment(new Date(validateForm.value.rangePicker[0]).getTime()).format('YYYY-MM-DD');
    dateRange[1] = moment(new Date(validateForm.value.rangePicker[1]).getTime()).format('YYYY-MM-DD');
    const query: any = {
      where: {
        manufactureDate: { between: dateRange }
      }
    };
    return this.materialYieldRateApi.find(query);
  }

  getProjectPartNumberGoal(validateForm) {
    return forkJoin([
      this.getVendorRecord(validateForm),
      this.getSqmIqcRecord(validateForm),
      this.getFactoryRecord(validateForm)
    ]).pipe(map(async (res: any) => {
      let jobs = [];
      // 廠商端
      const vendorData = await res[0].toPromise();
      for (let index = 0; index < vendorData.length; index++) {
        // IQC外驗端（SQMS）basic in mrr partNumber
        const sqmIqcData = res[1].filter(d => d['materialId'] === vendorData[index]['partNumber'].toString().trim());
        if (sqmIqcData.length >= 1) {
          if (sqmIqcData.filter(d => d['result'] === 'Accept').length === sqmIqcData.length) {
            vendorData[index]['resultPass'] = 1;
          } else {
            vendorData[index]['resultPass'] = 0;
          }
        } else {
          vendorData[index]['resultPass'] = null;
        }
        // 工廠端（SFCS）basic in mrr partNumber
        const factoryData = res[2].filter(d => d['materialId'] === vendorData[index]['partNumber'].toString().trim() && d['modelFamily'] === vendorData[index]['projectCode']);
        if (factoryData.length >= 1) {
          let inputQty = 0;
          let defectQty = 0;
          for (let index = 0; index < factoryData.length; index++) {
            inputQty += factoryData[index]['inputQty'];
            defectQty += factoryData[index]['defectQty'];
          }
          vendorData[index]['input'] = inputQty;
          vendorData[index]['defectQty'] = defectQty;
        } else {
          vendorData[index]['input'] = null;
          vendorData[index]['defectQty'] = null;
        }
        jobs.push(vendorData[index]);
      }
      return jobs;
    }));
  }
  /**
   * 獲取Site下拉框
   *
   * @returns {Observable<any>}
   * @memberof MrrDocSelectService
   */
  getSite(): Observable<any> {
    const site = this.PlantMapping.reduce(
      (p, t) => {
        if (!p['temp'].includes(t['Site'])) {
          p['temp'].push(t['Site']);
          p['list'].push({ Value: t['Site'], Label: t['Site'] });
        }
        return p;
      },
      { temp: [], list: [] }
    );
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
    const plant = this.PlantMapping.reduce(
      (p, t) => {
        if ((!site || t['Site'] === site) && !p['temp'].includes(t['Plant'])) {
          p['temp'].push(t['Plant']);
          p['list'].push({ Value: t['Plant'], Label: t['PlantName'] });
        }
        return p;
      },
      { temp: [], list: [] }
    );
    return of(plant['list']);
  }

  /**
   * 獲取產品下拉框
   *
   * @memberof MrrDocSelectService
   */
  getProductType(plant?): Observable<any> {
    const query: any = {
      fields: ['productType', 'projectCode', 'plant', 'moduleName', 'moduleEnabled', 'projectName'],
      where: {
        and: [
          { productType: { like: '%' } }
        ]
      }
    };
    if (plant && typeof plant === 'string') {
      query.where.and.push({ plant: plant });
    } else if (plant && plant.length > 0) {
      query.where.and.push({ plant: { inq: plant } });
    }
    return this.vPlantProjectApi.find(query).pipe(
      map(datas => {
        const list = datas.reduce(
          (p, t) => {
            if (!p['temp'].includes(t['productType'])) {
              p['temp'].push(t['productType']);
              p['list'].push(t['productType']);
            }
            return p;
          },
          { temp: [], list: [] }
        );
        return list['list'];
      })
    );
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
  getCustomer(plant?, customer?): Observable<any> {
    const query: any = {
      fields: ['customer'],
      where: {
        and: []
      }
    };
    if (plant && typeof plant === 'string') {
      query.where.and.push({ plant: plant });
    } else if (plant && plant.length > 0) {
      query.where.and.push({ plant: { inq: plant } });
    }
    if (customer) {
      query.where.and.push({ customer: { like: customer + '%' } });
    }
    return this.plantCustomerApi.find(query).pipe(
      map(datas => {
        const list = datas.reduce(
          (p, t) => {
            if (t['customer'] && !p['temp'].includes(t['customer'])) {
              p['temp'].push(t['customer']);
              p['list'].push(t['customer']);
            }
            return p;
          },
          { temp: [], list: [] }
        );
        return list['list'];
      })
    );
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
  getBu(plant?, productType?, customer?, bu?): Observable<any> {
    const query: any = {
      fields: ['bu', 'projectCode', 'plant', 'moduleName', 'moduleEnabled', 'projectName'],
      where: {
        and: []
      }
    };
    if (plant && typeof plant === 'string') {
      query.where.and.push({ plant: plant });
    } else if (plant && plant.length > 0) {
      query.where.and.push({ plant: { inq: plant } });
    }
    if (productType) {
      query.where.and.push({ productType: productType });
    }
    if (customer) {
      query.where.and.push({ customer: customer });
    }
    if (bu) {
      query.where.and.push({ bu: { like: bu + '%' } });
    }
    return this.vPlantProjectApi.find(query).pipe(
      map(datas => {
        const list = datas.reduce(
          (p, t) => {
            if (!p['temp'].includes(t['bu'])) {
              p['temp'].push(t['bu']);
              p['list'].push(t['bu']);
            }
            return p;
          },
          { temp: [], list: [] }
        );
        return list['list'];
      })
    );
  }

  /**
   * 获取Project Code下拉框
   *
   * @param {*} [plant]
   * @param {*} [productType]
   * @param {*} [customer]
   * @param {*} [proCode]
   * @returns {Observable<any>}
   * @memberof MrrDocSelectService
   */
  getProCode(plant?, productType?, customer?, proCode?): Observable<any> {
    const query: any = {
      where: {
        and: []
      }
    };
    if (plant && typeof plant === 'string') {
      query.where.and.push({ plant: plant });
    } else if (plant && plant.length > 0) {
      query.where.and.push({ plant: { inq: plant } });
    }
    if (productType) {
      query.where.and.push({ productType: productType });
    }
    if (customer) {
      query.where.and.push({ customer: customer });
    }
    if (proCode) {
      query.where.and.push({ projectCode: { like: proCode + '%' } });
    }
    return this.vPlantProjectApi.find(query).pipe(
      map(datas => {
        const list = datas.reduce(
          (p, t) => {
            if (!p['temp'].includes(t['projectCode'])) {
              p['temp'].push(t['projectCode']);
              p['list'].push(t['projectCode']);
            }
            return p;
          },
          { temp: [], list: [] }
        );
        return list['list'];
      })
    );
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
  getProName(
    plant?,
    productType?,
    customer?,
    proCode?,
    proName?
  ): Observable<any> {
    const query: any = {
      where: {
        and: []
      }
    };
    if (plant && typeof plant === 'string') {
      query.where.and.push({ plant: plant });
    } else if (plant && plant.length > 0) {
      query.where.and.push({ plant: { inq: plant } });
    }
    if (productType) {
      query.where.and.push({ productType: productType });
    }
    if (customer) {
      query.where.and.push({ customer: customer });
    }
    if (proCode) {
      query.where.and.push({ projectCode: proCode });
    }
    if (proName) {
      query.where.and.push({ projectName: { like: proName + '%' } });
    }
    return this.vPlantProjectApi.find(query).pipe(
      map(datas => {
        const list = datas.reduce(
          (p, t) => {
            if (!p['temp'].includes(t['projectName'])) {
              p['temp'].push(t['projectName']);
              p['list'].push({
                Value: t['projectName'],
                Label: t['projectName'],
                ProductType: t['productType'],
                CurrentStage: t['currentStage']
              });
            }
            return p;
          },
          { temp: [], list: [] }
        );
        return list['list'];
      })
    );
  }

  getProCodeByProName(
    mrrModuleName?,
    plant?,
    productType?,
    customer?,
    proName?,
    proCode?
  ): Observable<any> {
    const query: any = {
      where: {
        and: []
      }
    };
    if (plant && typeof plant === 'string') {
      query.where.and.push({ plant: plant });
    } else if (plant && plant.length > 0) {
      query.where.and.push({ plant: { inq: plant } });
    }
    if (productType) {
      query.where.and.push({ productType: productType });
    }
    if (customer) {
      query.where.and.push({ customer: customer });
    }
    if (proName) {
      query.where.and.push({ projectName: proName });
    }
    if (proCode) {
      query.where.and.push({ projectCode: { like: proCode + '%' } });
    }
    return this.vPlantProjectApi.find(query).pipe(
      map(datas => {
        datas = datas.filter(t => t['moduleName'] === mrrModuleName && t['moduleEnabled']);
        const list = datas.reduce(
          (p, t) => {
            if (!p['temp'].includes(t['projectCode'])) {
              p['temp'].push(t['projectCode']);
              p['list'].push(t['projectCode']);
            }
            return p;
          },
          { temp: [], list: [] }
        );
        return list['list'];
      })
    );
  }

  getProNameProCode(
    mrrModuleName?,
    plant?,
    productType?,
    customer?,
    proCode?,
    proName?,
  ): Observable<any> {
    const query: any = {
      where: {
        and: [{
          moduleName: mrrModuleName
        },
        {
          moduleEnabled: true
        }]
      }
    };
    if (plant) {
      query.where.and.push({ plant: plant });
    } else if (plant && plant.length > 0) {
      query.where.and.push({ plant: { inq: plant } });
    }
    if (productType) {
      query.where.and.push({ productType: productType });
    }
    if (customer && typeof customer === 'string') {
      query.where.and.push({ customer: customer });
    } else if (customer && customer.length > 0) {
      query.where.and.push({ customer: { inq: customer } });
    }
    if (proCode) {
      query.where.and.push({ projectCode: { like: proCode + '%' } });
    }
    if (proName) {
      query.where.and.push({ projectName: { like: proName + '%' } });
    }
    return this.vPlantProjectApi.find(query).pipe(
      map(datas => {
        const list = {
          list: {},
          dataSet: []
        };
        list['dataSet'] = datas;
        list['list'] = datas.reduce(
          (p, t) => {
            if (!p['ProjectCode'].includes(t['projectCode'])) {
              p['ProjectCode'].push(t['projectCode']);
            }
            if (!p['ProjectNameList'].includes(t['projectName'])) {
              p['ProjectNameList'].push(t['projectName']);
              p['ProjectName'].push({
                Value: t['projectName'],
                Label: t['projectName'],
                ProductType: t['productType'],
                CurrentStage: t['currentStage']
              });
            }
            return p;
          },
          { ProjectCode: [], ProjectName: [], ProjectNameList: [] }
        );
        return list;
      })
    );
  }
  /**
   * 通過 project Code 獲取 projectName
   *
   * @param {*} id
   * @returns {Observable<any>}
   * @memberof MrrMaterialSelectService
   */
  getProjectNameByProjectCode(id): Observable<any> {
    return this.projectApi
      .findById(id, {
        include: ['models']
      })
      .pipe(
        map(d => {
          return d['models'] ? d['models'].map(v => v.id) : [];
        })
      );
  }

  /**
   * 獲取 廠商 下拉框
   *
   * @param {*} [manufacturer]
   * @returns {Observable<any>}
   * @memberof MrrMaterialSelectService
   */
  getManufacturer(manufacturer?): Observable<any> {
    const query: any = {
      where: {
        and: []
      }
    };
    if (manufacturer) {
      query.where.and.push({ id: { like: manufacturer + '%' } });
    }
    return this.manufacturerApi.find(query).pipe(
      map(datas => {
        const list = datas.reduce(
          (p, t) => {
            if (!p['list'].includes(t['id'])) {
              p['list'].push(t['id']);
            }
            return p;
          },
          { list: [] }
        );
        return list['list'];
      })
    );
  }

  /**
   * 獲取 Stage
   *
   * @param {*} proCode
   * @returns {Observable<any>}
   * @memberof MrrMaterialSelectService
   */
  getStage(proCode): Observable<any> {
    return this.projectStageApi
      .find({
        where: {
          projectId: proCode
        }
      })
      .pipe(
        map(datas => {
          const list = datas.reduce(
            (p, t) => {
              p['list'].push(t['stageId']);
              return p;
            },
            { list: [] }
          );
          return list['list'];
        })
      );
  }

  /**
   * 獲取 Part
   *
   * @param {*} productType
   * @returns {Observable<any>}
   * @memberof MrrMaterialSelectService
   */
  getPart(productType): Observable<any> {
    return this.partApi
      .find({
        where: {
          productId: productType
        }
      })
      .pipe(
        map(datas => {
          const list = datas.reduce(
            (p, t) => {
              p['list'].push({ Value: t['id'], Label: t['name'] });
              return p;
            },
            { list: [] }
          );
          return list['list'];
        })
      );
  }

  /**
   * 獲取 Part Number
   *
   * @param {*} partId
   * @returns {Observable<any>}
   * @memberof MrrMaterialSelectService
   */
  getPartNumber(query): Observable<any> {
    return this.partNumberApi
      .find({
        where: query
      })
      .pipe(
        map(datas => {
          const list = datas.reduce(
            (p, t) => {
              if (!p['list'].includes(t['id'])) {
                p['list'].push(t['id']);
              }
              return p;
            },
            { list: [] }
          );
          return list['list'];
        })
      );
  }

  /**
   * 查詢 Vendor
   *
   * @param {*} [search]
   * @returns {Observable<any>}
   * @memberof MrrMaterialSelectService
   */
  getVendor(search): Observable<any> {
    return this.vendorApi.find({
      where: {
        id: { inq: search }
      },
      include: 'PartNumberVendors'
    });
  }

  /**
   * 通過 料號 獲取其他相關信息
   *
   * @param {*} [manufacturer]
   * @returns {Observable<any>}
   * @memberof MrrMaterialSelectService
   */
  getPartNumberInfo(partNumber): Observable<any> {
    const query: any = {
      where: {
        and: []
      },
      include: [
        {
          relation: 'partNumber',
          scope: {
            include: ['projects', 'part']
          }
        }
      ]
    };
    if (partNumber) {
      query.where.and.push({ partNumberId: partNumber });
    }
    return this.partNumberVendorApi.find(query).pipe(map((datas: any) => {
      datas = datas.filter(d => d.vendorId !== d.manufacturerId);
      const list = datas.reduce(
        (p, t) => {
          if (!p['partNumber'].includes(t['partNumberId'])) {
            p['partNumber'].push(t['partNumberId']);
          }
          if (!p['manufacturer'].includes(t['manufacturerId'])) {
            p['manufacturer'].push(t['manufacturerId']);
          }
          return p;
        },
        { partNumber: [], manufacturer: [] }
      );
      return {
        partNumbers: list['partNumber'],
        manufacturers: list['manufacturer'],
        dataSet: datas
      };
    }));
  }
}
