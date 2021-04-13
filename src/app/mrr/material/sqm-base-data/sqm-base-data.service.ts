import { ExternalUserApi } from './../../../service/mrr-sdk/services/custom/ExternalUser';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  View_LatestTargetYieldApi,
  OperationApi,
  PartNumberVendorApi,
  SqmTargetYieldApi,
  VendorApi,
  PartNumberApi,
  ProjectPartNumberApi,
  V_PlantProjectApi,
  ManufacturerPICApi
} from '@service/mrr-sdk';
import { Observable, forkJoin, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ProjectCodeProfileApi } from '@service/dfc_sdk/sdk';
import { ProjectApi } from '@service/dfi-sdk';

@Injectable({
  providedIn: 'root'
})
export class SqmBaseDataService {
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));

  constructor(
    private vLatestTargetYieldApi: View_LatestTargetYieldApi,
    private vPlantProjectApi: V_PlantProjectApi,
    private operationApi: OperationApi,
    private partNumberVendorApi: PartNumberVendorApi,
    private sqmTargetYieldApi: SqmTargetYieldApi,
    private vendorApi: VendorApi,
    private partNumberApi: PartNumberApi,
    private projectCodeProfileApi: ProjectCodeProfileApi,
    private projectPartNumberApi: ProjectPartNumberApi,
    private manufacturerPIC: ManufacturerPICApi,
    private externalUserApi: ExternalUserApi,
    private projectApi: ProjectApi
  ) { }

  // 獲取ProjectCode PLMStatus
  getProjectStatus(projectCode) {
    return this.projectApi.find({
      where: {
        id: projectCode
      }
    }).pipe(map(d => {
      d = d.length > 0 ? d[0]['PLMStatus'] : null;
      return d;
    }));
  }
  /**
   * 機種料號維護信息 表格數據查詢
   *
   * @param {FormGroup} validateForm
   * @returns {Observable<any>}
   * @memberof SqmBaseDataService
   */
  getPartsDataSet(validateForm: FormGroup): Observable<any> {
    return this.vLatestTargetYieldApi.find({
      where: {
        partNumber: validateForm.value.partNumber,
        manufacturer: validateForm.value.manufacturer ? validateForm.value.manufacturer : undefined,
        plant: validateForm.value.plant ? validateForm.value.plant : undefined,
        customer: validateForm.value.customer ? validateForm.value.customer : undefined,
        projectCode: validateForm.value.projectCode,
        projectName: validateForm.value.projectName ? validateForm.value.projectName : undefined,
        partId: validateForm.value.part ? validateForm.value.part : undefined,
        stage: validateForm.value.stage
      },
      order: 'order asc'
    }).pipe(map(data => {
      const result = [];
      const dataSet: any = data.reduce((p, t) => {
        if (!p[t['partNumberVendorId']]) {
          p[t['partNumberVendorId']] = [];
        }
        p[t['partNumberVendorId']].push(t);
        return p;
      }, {});
      for (const partNumberVendorId in dataSet) {
        if (dataSet.hasOwnProperty(partNumberVendorId)) {
          for (let index = 0; index < dataSet[partNumberVendorId].length; index++) {
            dataSet[partNumberVendorId][index]['sqmTargetYieldShow'] = Math.round(dataSet[partNumberVendorId][index]['sqmTargetYield'] * 10000) / 100;
            dataSet[partNumberVendorId][0]['rowspan'] = true;
            dataSet[partNumberVendorId][0]['rowspanLength'] = dataSet[partNumberVendorId].length;
            result.push(dataSet[partNumberVendorId][index]);
          }
        }
      }
      return result;
    }));
  }

  getMaintainProject(
    partNumber?,
    manufacturer?,
    plant?,
    customer?,
    proCode?,
    proName?): Observable<any> {
    const query: any = {
      where: {
        and: []
      }
    };
    query.where.and.push({ operation: 'RTY' });
    if (partNumber) {
      query.where.and.push({ partNumber: partNumber });
    }
    if (manufacturer) {
      query.where.and.push({ manufacturer: manufacturer });
    }
    if (plant) {
      query.where.and.push({ plant: plant });
    }
    if (customer) {
      query.where.and.push({ customer: customer });
    }
    if (proCode) {
      query.where.and.push({ projectCode: { like: proCode + '%' } });
    }
    if (proName) {
      query.where.and.push({ projectName: { like: proName + '%' } });
    }
    return this.vLatestTargetYieldApi.find(query).pipe(
      map(datas => {
        const list = {
          list: {},
          dataSet: []
        };
        list['dataSet'] = datas;
        list['list'] = datas.reduce(
          (p, t) => {
            if (!p['PartNumber'].includes(t['partNumber'])) {
              p['PartNumber'].push(t['partNumber']);
            }
            if (!p['Manufacturer'].includes(t['manufacturer'])) {
              p['Manufacturer'].push(t['manufacturer']);
            }
            if (!p['ProjectCode'].includes(t['projectCode'])) {
              p['ProjectCode'].push(t['projectCode']);
            }
            if (!p['ProjectNameList'].includes(t['projectName'])) {
              p['ProjectNameList'].push(t['projectName']);
              p['ProjectName'].push({
                Value: t['projectName'],
                Label: t['projectName'],
                ProductType: t['product'],
                CurrentStage: t['stage']
              });
            }
            return p;
          },
          { PartNumber: [], Manufacturer: [], ProjectCode: [], ProjectName: [], ProjectNameList: [] }
        );
        return list;
      })
    );;
  }
  /**
   * 查詢 Operation
   *
   * @param {*} [productType]
   * @returns {Observable<any>}
   * @memberof SqmBaseDataService
   */
  getOperation(productType?): Observable<any> {
    const query = {
      where: {
        and: []
      }
    };
    if (productType) {
      query.where.and.push({ productId: productType });
    }
    return this.operationApi.find(query);
  }

  getVendor(vendorCode): Observable<any> {
    return this.vendorApi.findById(vendorCode, {
      include: ['PartNumberVendors']
    });
  }

  /**
   * 機種料號維護信息 設定 addModel 初始值
   *
   * @param {FormGroup} validateForm
   * @param {{flag: boolean, vendorCode: string}} vendor
   * @param {*} productType
   * @returns {Observable<PartsAddModelSelectValue>}
   * @memberof SqmBaseDataService
   */
  setPartsAddModelSelectValue(
    validateForm: FormGroup,
    vendor: { flag: boolean; vendorCode: string },
    productType
  ): Observable<any> {
    return forkJoin([
      this.setPartsAddModelTransferList(validateForm, productType),
      vendor.flag ? this.getVendor(vendor.vendorCode) : of(''),
      this.getPartsDataSet(validateForm)
    ]).pipe(
      map(res => {
        return {
          partNumber: validateForm.value.partNumber,
          plant: res[2] && res[2].length > 0 ? res[2][0]['plant'] : validateForm.value.plant,
          manufacturer: res[2] && res[2].length > 0 ? res[2][0]['manufacturer'] : validateForm.value.manufacturer,
          vendorCode: vendor.flag ? vendor.vendorCode : null,
          vendorName: vendor.flag ? res[1]['name'] : null,
          partNumberVendorId:
            vendor.flag && res[1]['PartNumberVendors']
              ? res[1]['PartNumberVendors'][0]['id']
              : null,
          customer: res[2] && res[2].length > 0 ? res[2][0]['customer'] : validateForm.value.customer,
          projectCode: validateForm.value.projectCode,
          projectName: res[2] && res[2].length > 0 ? res[2][0]['projectName'] : validateForm.value.projectName,
          stage: validateForm.value.stage,
          part: res[2] && res[2].length > 0 ? res[2][0]['partId'] : validateForm.value.part,
          operationList: res[0].operationList,
          transferList: res[0].transferList
        };
      })
    );
  }

  /**
   *
   *
   * @param {FormGroup} validateForm
   * @param {*} productType
   * @returns {Observable<any>}
   * @memberof SqmBaseDataService
   */
  setPartsAddModelTransferList(
    validateForm: FormGroup,
    productType
  ): Observable<any> {
    return forkJoin([
      this.getOperation(productType),
      this.getPartsDataSet(validateForm)
    ]).pipe(
      map(res => {
        const operationList = [];
        const transferList = []; // 穿梭框中的值
        const operation = [];

        // 1.處理 operationList 數據, 及 transferList 右邊數據
        res[1].forEach(dataSet => {
          operationList.push({
            order: dataSet.order,
            operationId: dataSet.operationId,
            sqmTargetYield: dataSet.sqmTargetYield,
            sqmTargetYieldShow: dataSet.sqmTargetYieldShow
          });
          transferList.push({
            key: dataSet.operationId.toString(),
            title: dataSet.operation,
            direction: 'right',
            checked: false,
            order: dataSet.order,
            operationId: dataSet.operationId,
            operation: dataSet.operation,
            sqmTargetYield: dataSet.sqmTargetYield,
            sqmTargetYieldShow: dataSet.sqmTargetYieldShow
          });
          operation.push(dataSet.operationId);
        });
        // 2.處理 transferList 左邊數據
        res[0].forEach(data => {
          if (!operation.includes(data['id'])) {
            transferList.push({
              key: data['id'].toString(),
              title: data['name'],
              direction: 'left',
              checked: false,
              order: null,
              operationId: data['id'],
              operation: data['name'],
              sqmTargetYield: null,
              sqmTargetYieldShow: null
            });
          }
        });
        return {
          operationList: operationList,
          transferList: transferList
        };
      })
    );
  }

  /**
   * 放入 Process序號/目標良率調整 table 中的数据
   *
   * @param {*} ret
   * @param {*} operationList
   * @returns {any[]}
   * @memberof SqmBaseDataService
   */
  setPartsAddOrderModelData(ret, operationList): any[] {
    if (ret) {
      if (ret['to'] === 'right') {
        ret['list'].forEach(l => {
          operationList.push({
            order: operationList.length + 1,
            operationId: l.operationId,
            sqmTargetYield: l.sqmTargetYield,
            sqmTargetYieldShow: Math.round(l.sqmTargetYield * 10000) / 100
          });
        });
      }
      if (ret['to'] === 'left') {
        const operationIds = ret['list'].map(d => d.operationId);
        const tempOperation = operationList.filter(o => !operationIds.includes(o.operationId));
        let operationSet = [];
        for (let index = 0; index < tempOperation.length; index++) {
          operationSet.push({
            order: operationSet.length + 1,
            operationId: tempOperation[index]['operationId'],
            sqmTargetYield: tempOperation[index]['sqmTargetYield'],
            sqmTargetYieldShow: Math.round(tempOperation[index]['sqmTargetYield'] * 10000) / 100
          });
        }
        operationList = operationSet;
      }
    }
    return operationList;
  }

  /**
   * Process順序調整
   *
   * @param {any[]} operationList
   * @param {*} index1
   * @param {*} index2
   * @returns
   * @memberof SqmBaseDataService
   */
  movePartsAddOrderModelData(operationList: any[], index1, index2) {
    const data1 = operationList[index1];
    const data2 = operationList[index2];
    operationList[index1] = data2;
    operationList[index2] = data1;
    return operationList.map((d, i) => {
      d.order = i + 1;
      return d;
    });
  }

  saveSqmTargetYield(partNumberVendorOperationId, sqmTargetYield) {
    return this.sqmTargetYieldApi.create({
      partNumberVendorOperationId: partNumberVendorOperationId,
      yield: sqmTargetYield
    });
  }

  /**
   * 保存OperationList - Process順序調整之後 存入數據庫中
   *
   * @param {*} partNumberVendorId
   * @param {*} plantId
   * @param {*} stageId
   * @param {any[]} operationList
   * @returns
   * @memberof SqmBaseDataService
   */
  savePartsAddOrderList(
    partNumberVendorId: any,
    plantId: any,
    stageId: any,
    operationList: any[]
  ) {
    return this.partNumberVendorApi.updateOperationList(
      partNumberVendorId,
      plantId,
      stageId,
      operationList
    );
  }

  /**
   * 保存 Operation List - 暫不存入庫中, 返回至 上一層 Model中, 更新 transferList中的 信息, 以便 帶入序號 及 目標良率
   *
   * @param {any[]} operationList
   * @param {any[]} transferList
   * @returns {any[]}
   * @memberof SqmBaseDataService
   */
  savePartsAddOrderModel(
    operationList: any[],
    transferList: any[],
    ret?: any[]
  ): Observable<any[]> {
    let res = [{
      operationList: []
    },
    {
      transferList: []
    }
    ];
    for (let index = 0; index < operationList.length; index++) {
      operationList[index]['sqmTargetYield'] = Math.round(operationList[index]['sqmTargetYieldShow'] * 100) / 10000;
    }
    res[0]['operationList'] = operationList;
    for (let index = 0; index < transferList.length; index++) {
      const oData = operationList.find(d => d.operationId === transferList[index]['operationId']);
      if (oData) {
        transferList[index]['direction'] = 'right';
        transferList[index]['order'] = oData.order;
        transferList[index]['sqmTargetYield'] = Math.round(oData.sqmTargetYieldShow * 100) / 10000;
        transferList[index]['sqmTargetYieldShow'] = oData.sqmTargetYieldShow;
      } else {
        transferList[index]['direction'] = 'left';
        transferList[index]['order'] = null;
        transferList[index]['sqmTargetYield'] = null;
        transferList[index]['sqmTargetYieldShow'] = null;
      }
    }
    res[1]['transferList'] = transferList;
    res[1]['transferList'].sort(this.sortByOrder);
    return of(res);
  }

  sortByOrder(a, b) {
    return a.order - b.order;
  }

  savePartsAddModel(
    btnType,
    param: {
      partNumberVendorId?: any;
      plantId?: any;
      stageId?: any;
      operationList: any;
      srcStageId?: any;
      partNumberId?: any;
      partId?: any;
      vendorId?: any;
      manufacturerId?: any;
      projectCode?: any;
      vendorName?: any;
    }
  ): Observable<any> {
    const updateOperationList = (
      partNumberVendorId,
      plantId,
      stageId,
      operationList
    ) => {
      return this.partNumberVendorApi.updateOperationList(
        partNumberVendorId,
        plantId,
        stageId,
        operationList
      );
    };
    switch (btnType) {
      case 'add': {
        return this.partNumberVendorApi
          .patchOrCreateBaseData(
            param.partNumberId,
            param.partId,
            param.vendorId,
            param.vendorName,
            param.manufacturerId,
            param.projectCode
          )
          .pipe(
            mergeMap(v => {
              return updateOperationList(
                v.id,
                param.plantId,
                param.stageId,
                param.operationList
              );
            })
          );
      }
      case 'copy': {
        return this.partNumberVendorApi
          .copyOperationList(
            param.partNumberVendorId,
            param.plantId,
            param.srcStageId,
            param.partNumberVendorId,
            param.plantId,
            param.stageId
          )
          .pipe(
            mergeMap(v => {
              return updateOperationList(
                param.partNumberVendorId,
                param.plantId,
                param.stageId,
                param.operationList
              );
            })
          );
      }
      case 'order': {
        return updateOperationList(
          param.partNumberVendorId,
          param.plantId,
          param.stageId,
          param.operationList
        );
      }
      default:
        break;
    }
    return of({ error: '存入 类别错误！' });
  }

  /**
   * 跳轉 DFC 新機種信息維護頁面, 查詢出 跳轉所帶的參數
   *
   * @param {*} plant
   * @param {*} projectCode
   * @param {*} projectName
   * @returns {Observable<any>}
   * @memberof SqmBaseDataService
   */
  queryDfcProjectInfo(plant, projectCode, projectName): Observable<any> {
    return this.projectCodeProfileApi
      .find({
        where: {
          Plant: plant,
          ProjectCode: projectCode
        },
        include: ['projectNames']
      })
      .pipe(
        map(proCodes => {
          const res = {
            Plant: plant,
            ProNameId: null,
            ProCodeId: null
          };
          for (let index = 0; index < proCodes.length; index++) {
            const proCode = proCodes[index];
            for (let j = 0; j < proCode['projectNames'].length; j++) {
              const proName = proCode['projectNames'][j];
              if (proName['ProjectName'] === projectName) {
                res.ProNameId = proName['ProjectNameID'];
                res.ProCodeId = proName['ProjectCodeID'];
              }
            }
          }
          return res;
        })
      );
  }

  /**
   * 獲取料號相關信息
   *
   * @param {*} partNumber
   * @param {*} [routeData]
   * @returns {Observable<any>}
   * @memberof SqmBaseDataService
   */
  getExternalInfo(partNumber, plantId, routeData?: any): Observable<any> {
    return forkJoin([
      this.partNumberApi.getExternalInfo(partNumber, plantId),
      this.getViewLatestYR(plantId, partNumber)
    ]).pipe(
      map(res => {
        res[0]['PLM_allpart'].forEach(data => {
          if (!data['plants'].includes(plantId)) {
            res[0]['PLM_allpart'] = [];
          }
        });
        let routeDataRes = {
          flag: true,
          msg: ''
        };
        if (routeData) {
          delete routeData.data.value.partNumber;
          delete routeData.data.value.stage;
          delete routeData.data.value.partNumberVendor;
          routeDataRes = this.checkRouteData(
            res[0],
            routeData.data.value,
            routeData.data.select.parts,
            partNumber,
            routeDataRes
          );
        }
        const partNumberAMPLReduce = res[0]['AMPL'].reduce(
          (p, t) => {
            if (!p['manufacturerList'].includes(t['MANUFACTURER'])) {
              p['manufacturerList'].push(t['MANUFACTURER']);
            }
            if (!p['vendorCodeList'][t['VENDORID']]) {
              p['vendorCodeList'].push(t['VENDORID']);
            }
            if (!p['manufacturerRelation'][t['MANUFACTURER']]) {
              p['manufacturerRelation'][t['MANUFACTURER']] = [];
            }
            p['manufacturerRelation'][t['MANUFACTURER']].push({
              vendorCode: t['VENDORID'],
              vendorName: t['VENDORNAME']
            });
            return p;
          },
          { manufacturerList: [], vendorCodeList: [], manufacturerRelation: {} }
        );
        const partNumberPLMReduce = res[0]['PLM_allpart'].reduce(
          (p, t) => {
            t['plants'].forEach(plant => {
              if (plant === plantId) {
                t['plants'] = [];
                t['plants'].push(plant);
                if (!p['plant'].includes(plant)) {
                  p['plant'].push(plant);
                  const plantFind = this.PlantMapping.find(
                    d => d.Plant === plant
                  );
                  p['plantList'].push({
                    Value: plantFind['Plant'],
                    Label: plantFind['PlantName']
                  });
                }
                if (!p['plantRelation'][plant]) {
                  p['plantRelation'][plant] = {
                    customerList: [],
                    customerRelation: {}
                  };
                }
                if (
                  !p['plantRelation'][plant]['customerList'].includes(
                    t['customer']
                  )
                ) {
                  p['plantRelation'][plant]['customerList'].push(t['customer']);
                }
                if (
                  !p['plantRelation'][plant]['customerRelation'][t['customer']]
                ) {
                  p['plantRelation'][plant]['customerRelation'][
                    t['customer']
                  ] = { projectCodeList: [], projectCodeRelation: {} };
                }

                if (
                  !p['plantRelation'][plant]['customerRelation'][t['customer']][
                    'projectCodeList'
                  ].includes(t['projectCode'])
                ) {
                  p['plantRelation'][plant]['customerRelation'][t['customer']][
                    'projectCodeList'
                  ].push(t['projectCode']);
                }
                if (
                  !p['plantRelation'][plant]['customerRelation'][t['customer']][
                  'projectCodeRelation'
                  ][t['projectCode']]
                ) {
                  p['plantRelation'][plant]['customerRelation'][t['customer']][
                    'projectCodeRelation'
                  ][t['projectCode']] = {
                    projectName: {
                      Value: t['projectName'],
                      Label: t['projectName'],
                      ProductType: t['productType'],
                      CurrentStage: ''
                    },
                    productType: t['productType'],
                    parts: t['parts']
                      ? t['parts'].map(d => {
                        return { Value: d['id'], Label: d['name'] };
                      })
                      : []
                  };
                }
              }
            });
            return p;
          },
          { plant: [], plantList: [], plantRelation: {} }
        );
        return {
          res: res,
          partNumberAMPLReduce: partNumberAMPLReduce,
          partNumberPLMReduce: partNumberPLMReduce,
          routeDataRes: routeDataRes
        };
      })
    );
  }

  /**
   * 檢查 路由過來的參數 是否 在 getExternalInfo 中有返回值
   *
   * @param {*} extInfo
   * @param {*} routeData
   * @param {*} partNumber
   * @param {*} res
   * @returns {{ flag: boolean, msg: string }}
   * @memberof SqmBaseDataService
   */
  checkRouteData(
    extInfo,
    routeData,
    parts,
    partNumber,
    res
  ): { flag: boolean; msg: string } {
    const setMsg = msgInfo => {
      return '該料號: ' + partNumber + ' 下, 無 ' + msgInfo + ' 的關聯信息！';
    };

    const mapping = {
      manufacturer: 'MANUFACTURER',
      plant: 'plants',
      customer: 'customer',
      projectCode: 'projectCode',
      projectName: 'projectName',
      part: 'parts',
      vendor: 'VENDORID'
    };

    if (extInfo['AMPL'].length < 1 && res.flag) {
      res.flag = false;
      res.msg = setMsg(routeData.data.manufacturer);
    } else if (extInfo['PLM_allpart'].length < 1 && res.flag) {
      const plantFind = this.PlantMapping.find(
        d => d.Plant === routeData.data.plant
      );
      res.flag = false;
      res.msg = setMsg(plantFind['PlantName']);
    } else if (res.flag) {
      for (const key in routeData) {
        if (routeData.hasOwnProperty(key) && res.flag) {
          let rd = routeData[key];
          let find;
          if (['manufacturer', 'vendor'].includes(key)) {
            find = extInfo['AMPL'].find(f => f[mapping[key]] === rd);
          } else {
            if (key === 'plant') {
              find = extInfo['PLM_allpart'].find(f =>
                f[mapping[key]].includes(rd)
              );
              const plantFind = this.PlantMapping.find(d => d.Plant === rd);
              rd = plantFind['PlantName'];
            } else if (key === 'part') {
              find = extInfo['PLM_allpart'].find(f =>
                f[mapping[key]].some(s => s.id === rd)
              );
              rd = parts.find(f => f.id === rd)['name'];
            } else {
              find = extInfo['PLM_allpart'].find(f => f[mapping[key]] === rd);
            }
          }
          if (!find) {
            res.flag = false;
            res.msg = setMsg(rd);
            break;
          }
        }
      }
    }

    return res;
  }
  // 查找當前料號SQM是否維護過
  getViewLatestYR(plantId, partNumber) {
    return this.vLatestTargetYieldApi.find({
      where: {
        plant: plantId,
        partNumber: partNumber
      }
    });
  }

  getProjectByPartNumberId(partNumberId): Observable<any> {
    return this.projectPartNumberApi
      .find({
        where: {
          partNumberId: partNumberId
        },
        include: [{ project: 'models' }],
        order: 'id asc'
      })
      .pipe(
        map((datas: any[]) => {
          const dataSet = datas.reduce((p, t) => {
            if (t['project'] && t['project']['models']) {
              t['project']['models'].forEach(model => {
                const date = new Date(t['createDate']);
                p.push({
                  projectCode: t['projectId'],
                  projectName: model['id'],
                  createDate:
                    date.toLocaleDateString() + ' ' + date.toLocaleTimeString(),
                  createBy: t['createBy']
                });
              });
            }
            return p;
          }, []);
          return dataSet;
        })
      );
  }

  getProject(plant, productType, proCode, search?): Observable<any> {
    const query: any = {
      where: {
        and: [
          { plant: plant },
          { productType: productType },
          { projectCode: { nin: proCode } }
        ]
      },
      fields: ['projectName', 'projectCode', 'moduleName', 'moduleEnabled']
    };
    if (search) {
      query.where.and.push({
        or: [
          { projectCode: { like: search + '%' } },
          { projectName: { like: search + '%' } }
        ]
      });
    }
    return this.vPlantProjectApi.find(query);
  }

  savePartNumberPro(partNumberId, projectCode, empId): Observable<any> {
    return this.projectPartNumberApi.patchOrCreate({
      projectId: projectCode,
      partNumberId: partNumberId,
      createDate: new Date(),
      createBy: empId
    });
  }

  addManufacturerPIC(form) {
    return this.manufacturerPIC.create(form);
  }

  getManufacturerPIC() {
    return this.manufacturerPIC.find();
  }

  updateManufacturerPIC(form) {
    return this.manufacturerPIC.upsert(form);
  }

  getExternalUser(form) {
    return this.externalUserApi.find({
      where: {
        manufacturerId: form
      }
    });
  }

  addExternalUser(form) {
    return this.externalUserApi.create(form);
  }

  updatePassword(form) {
    return this.externalUserApi.updateAttributes(form.username, form);
  }

  getPartNumberVendor(form) {
    return this.partNumberVendorApi.find({
      where: {
        manufacturerId: form
      }
    });
  }
}
