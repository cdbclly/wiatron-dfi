import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectCodeProfileApi, MOHDefaultConditionApi, OperationLogApi, MOHConditionApi, StageApi } from '@service/dfc_sdk/sdk';

@Injectable({
  providedIn: 'root'
})
export class MohParameterService {

  private static modelFieldNotPercented = ['SMTCT', 'RunIn', 'SMTMan', 'SMTMonthDay', 'SMTDayHour', 'DIPCT', 'DIPMan', 'DIPDayHour', 'DIPMonthDay', 'LCMCT', 'LCMMan', 'LCMMonthDay', 'LCMDayHour', 'FACT',
    'FAMan', 'FAMonthDay', 'FADayHour'];
  private static plantFieldNotPercented = ['SMTMan', 'RunIn', 'SMTMonthDay', 'SMTDayHour', 'DIPCT', 'DIPMan', 'DIPDayHour', 'DIPMonthDay', 'LCMCT', 'LCMMan', 'LCMMonthDay', 'LCMDayHour', 'FACT',
    'FAMan', 'FAMonthDay', 'FADayHour'];
  private static booleanField = ['PCBAType', 'LCMType', 'FAType'];
  constructor(
    private projectCodeProfileApi: ProjectCodeProfileApi,
    private mohDefaultConditionApi: MOHDefaultConditionApi,
    private mohConditionApi: MOHConditionApi,
    private operationLogApi: OperationLogApi,
    private stageApi: StageApi
  ) { }

  // 獲取廠別下拉框
  async getProCodePlant(PlantMapping): Promise<any> {
    const datas = await this.projectCodeProfileApi.GetPlant().toPromise();
    const list = [];
    datas.forEach(data => {
      if (!data['plant']) {
        list.push({ Value: data['plant'], Label: '无' });
      } else {
        const label = PlantMapping.find(plantMapData => plantMapData['Plant'] === data['plant']);
        list.push({ Value: data['plant'], Label: label['PlantName'] });
      }
    });
    return list;
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

  // 廠別 參數 查詢
  async queryPlantParam(plant, plantMapping): Promise<any> {
    let queryData;
    await this.mohDefaultConditionApi.findById(plant).toPromise()
      .then(d => {
        queryData = d
      }).catch(e => {
        console.log(e);
      });
    if (!queryData) {
      await this.mohDefaultConditionApi.create({ 'Plant': plant }).toPromise().then(d => queryData = d).catch(e => console.log(e));
    }
    const dataSet = [];
    let index = 1;
    for (const key in DfcMOHParamMapping) {
      if (DfcMOHParamMapping.hasOwnProperty(key)) {
        const paramData = DfcMOHParamMapping[key];
        if (MohParameterService.booleanField.includes(key)) {
          dataSet.push({
            No: index,
            Plant: plantMapping['PlantName'],
            PlantID: plant,
            TypeFlag: true,
            Type: key,
            TypeValue: paramData['Msg'],
            MohParam: (!queryData[key]) ? false : queryData[key],
            SetValue: (!queryData[key]) ? queryData[paramData['Select'][0]] : queryData[paramData['Select'][1]]
          });
          index++;
        } else if (MohParameterService.plantFieldNotPercented.includes(key)) {
          dataSet.push({
            No: index,
            Plant: plantMapping['PlantName'],
            PlantID: plant,
            TypeFlag: false,
            Type: key,
            MohParam: paramData,
            SetValue: queryData[key]
          });
          index++;
        } else if (!['SMTCT'].includes(key)) {
          dataSet.push({
            No: index,
            Plant: plantMapping['PlantName'],
            PlantID: plant,
            TypeFlag: false,
            Type: key,
            MohParam: paramData,
            SetValue: (queryData[key] * 100)
          });
          index++;
        }
      }
    }
    return dataSet;
  }

  // 廠別 參數 保存
  savePlantParam(editCache, dataSet): Promise<any> {
    const updataParam = editCache['Type'];
    const updataData = {};
    const logData = {};
    if (MohParameterService.booleanField.includes(updataParam)) {
      updataData[updataParam] = editCache['MohParam'];
      logData[updataParam] = dataSet['MohParam'];
      const dfcMohParam = DfcMOHParamMapping[updataParam]['Select'];
      const mohParam = dfcMohParam[(editCache['MohParam'] ? 1 : 0)];
      updataData[mohParam] = editCache['SetValue'];
      logData[mohParam] = dataSet['SetValue'];
    } else if (MohParameterService.plantFieldNotPercented.includes(updataParam)) {
      updataData[updataParam] = editCache['SetValue'];
      logData[updataParam] = dataSet['SetValue'];
    } else {
      updataData[updataParam] = editCache['SetValue'] / 100;
      logData[updataParam] = dataSet['SetValue'] / 100;
    }
    updataData['Plant'] = editCache['PlantID'];
    // 存入 操作信息
    let logMsg = 'update\t廠別: ' + editCache['PlantID'] + '\t' + localStorage.getItem('$DFI$userName') +
      '\nby廠別  修改信息, 如下:\n' +
      editCache['MohParam'] + '(' + updataParam + '):\n' +
      logData[updataParam] + ' -> ' + updataData[updataParam];
    if (MohParameterService.booleanField.includes(updataParam)) {
      const dfcMohParam = DfcMOHParamMapping[updataParam]['Select'];
      const mohParam = dfcMohParam[editCache['MohParam']];
      logMsg += '\n' + logData[mohParam] + ' -> ' + updataData[mohParam];
    }
    return this.mohDefaultConditionApi.patchOrCreate(updataData).toPromise()
      .then(data => {
        this.operationLogApi.create({
          userID: localStorage.getItem('$DFI$userID'),
          APname: 'MOH參數資料維護',
          data: logMsg
        }).subscribe(rs => console.log(rs), error => console.log(error));
        return { 'result': 'success', 'data': data };
      }).catch(error => {
        return { 'result': 'fail', 'msg': error };
      });
  }

  // 機種 參數 查詢
  async queryModelParam(queryValue: {
    plant: string,
    bu: string,
    customer: string,
    productType: string,
    proCode: string,
    proName: string,
    modelName: string,
    stage?: string
  }, plantMap): Promise<any> {
    const mohConditionDatas = await this.mohConditionApi.GetList(
      queryValue.plant ? queryValue.plant : '',
      queryValue.bu ? queryValue.bu : '',
      queryValue.customer ? queryValue.customer : '',
      queryValue.productType ? queryValue.productType : '',
      queryValue.proCode ? queryValue.proCode : '',
      queryValue.proName ? queryValue.proName : '',
      queryValue.modelName ? queryValue.modelName : '',
      queryValue.stage ? queryValue.stage : ''
    ).toPromise();
    let index = 0;
    let dataSets: {}[] = [];
    const promises: Promise<any>[] = [];
    mohConditionDatas.forEach(mohConditionData => {
      index++;
      const dataSet = {};
      const promise: Promise<any> = this.stageApi.findById(mohConditionData['StageID'], {
        'include': {
          'basicModel': {
            'relation': 'projectNameProfile',
            'scope': {
              'include': [
                { 'militaryOrders': 'workflow' },
                { 'projectCodeProfile': 'BU' }
              ]
            }
          }
        }
      }).toPromise().catch(error => console.log(error));
      promises.push(promise);
      dataSet['No'] = index;
      dataSet['StageID'] = mohConditionData['StageID'];
      dataSet['Stage'] = mohConditionData['Stage'];
      dataSet['Plant'] = mohConditionData['Plant'];
      dataSet['PlantMap'] = plantMap;
      dataSet['BU'] = mohConditionData['BU'];
      dataSet['Customer'] = mohConditionData['Customer'];
      dataSet['ModelType'] = mohConditionData['ProductType'];
      dataSet['ProjectCode'] = mohConditionData['ProjectCode'];
      dataSet['ProjectName'] = mohConditionData['ProjectName'];
      dataSet['ModelName'] = mohConditionData['ModelName'];
      dataSet['ExRateNTD'] = mohConditionData['ExRateNTD'];
      dataSet['ExRateRMB'] = mohConditionData['ExRateRMB'];
      dataSet['RunIn'] = mohConditionData['RunIn'];
      dataSet['EditFlag'] = true;
      for (const key in DfcMOHParamMapping) {
        if (DfcMOHParamMapping.hasOwnProperty(key)) {
          const paramMapping = DfcMOHParamMapping[key];
          if (MohParameterService.booleanField.includes(key)) {
            const valueIndex = !mohConditionData[key] ? 0 : 1;
            dataSet[key] = {
              Select: mohConditionData[key],
              Value: mohConditionData[paramMapping['Select'][valueIndex]]
            };
          } else if (MohParameterService.modelFieldNotPercented.includes(key)) {
            dataSet[key] = mohConditionData[key];
          } else {
            dataSet[key] = (mohConditionData[key] * 100);
          }
        }
      }
      dataSets.push(dataSet);
    });
    dataSets = await this.queryMilitaryOrders(promises, dataSets);
    return dataSets;
  }

  queryMilitaryOrders(promises, dataSets) {
    return Promise.all(promises).then((resDatas: any[]) => {
      const militaryDatas = resDatas.filter(d => !!d['basicModel'] && !!d['basicModel']['projectNameProfile'] &&
        !!d['basicModel']['projectNameProfile']['militaryOrders'] && !!d['basicModel']['projectNameProfile']['militaryOrders']['workflow']);
      dataSets.forEach(dataSet => {
        // 判斷軍令狀資料是否可編輯
        const militaryData = militaryDatas.find(d => d.StageID === dataSet['StageID']);
        if (!!militaryData && dataSet['Stage'] === 'RFQ') {
          dataSet['EditFlag'] = false;
        }
      });
      return dataSets;
    }).catch(e => {
      console.log(e);
      return dataSets;
    });
  }

  // 机种 參數 保存
  saveModelParam(editCache, dataSet, plant): Promise<any> {
    const updataID = editCache['StageID'];
    const updataData = {};
    // 存入 操作信息
    let logMsg = 'update\t廠別: ' + plant + '\t' + localStorage.getItem('$DFI$userName') +
      '\nProjectCode: ' + editCache['ProjectCode'] +
      '\tProjectName: ' + editCache['ProjectName'] + '\tStageID: ' + updataID +
      '\nby機種  修改信息, 如下:\n';

    for (const key in DfcMOHParamMapping) {
      if (DfcMOHParamMapping.hasOwnProperty(key)) {
        const paramMapping = DfcMOHParamMapping[key];
        if (MohParameterService.booleanField.includes(key)) {
          updataData[key] = editCache[key]['Select'];
          logMsg += key + ': ' + dataSet[key]['Select'] + ' -> ' + editCache[key]['Select'] + '\n';
          const valueIndex = !editCache[key]['Select'] ? 0 : 1;
          updataData[paramMapping['Select'][valueIndex]] = editCache[key]['Value'];
          logMsg += paramMapping['Select'][valueIndex] + ': ' + dataSet[key]['Value'] + ' -> ' + editCache[key]['Value'] + '\n';
        } else if (MohParameterService.modelFieldNotPercented.includes(key)) {
          updataData[key] = editCache[key];
          logMsg += key + ': ' + dataSet[key] + ' -> ' + editCache[key] + '\n';
        } else {
          updataData[key] = parseFloat(editCache[key]) / 100;
          logMsg += key + ': ' + (parseFloat(dataSet[key]) / 100) + ' -> ' + (parseFloat(editCache[key]) / 100) + '\n';
        }
      }
    }
    return this.mohConditionApi.patchAttributes(updataID, updataData).toPromise()
      .then(data => {
        this.operationLogApi.create({
          userID: localStorage.getItem('$DFI$userID'),
          APname: 'MOH參數資料維護',
          data: logMsg
        }).subscribe(rs => console.log(rs), error => console.log(error));
        return { 'result': 'success', 'data': data };
      }).catch(error => {
        return { 'result': 'fail', 'msg': error };
      });
  }

  // 機種信息上傳 log記錄
  modelUploadLog(plant, res) {
    // 將操作信息存入緩存
    const logMsg = 'upload\t廠別: ' + plant + '\t' + localStorage.getItem('$DFI$userName') +
      '\n上傳文件信息, 如下:\n' + JSON.stringify(res);
    this.operationLogApi.create({
      userID: localStorage.getItem('$DFI$userID'),
      APname: 'MOH參數資料維護',
      data: logMsg
    }).subscribe(rs => console.log(rs), error => console.log(error));
  }
}

/**
 * DFC MOH参数页面需要用到的Mapping关系
 */
export const DfcMOHParamMapping = { // 廠別頁面需要用的 對應關係
  'SMTCT': 'SMT C.T.',
  'RunIn': 'Runin人力',
  'SMTMan': 'SMT Online 人力(人)',
  'PCBAOfflineRatio': 'PCBA Offline Ratio(%)',
  'SMTProductionRate': 'SMT生產力',
  'SMTYield': 'SMT良率',
  'SMTMonthDay': 'SMT 月工作天數',
  'SMTDayHour': 'SMT 日工時',
  'PCBAType': {
    'Msg': 'DIP',
    'Select': ['DIPCT', 'DIPMan']
  }, // 为单选框 0---CT  需要填写 DIPCT 数据, 1---人力  需要填写 DIPMan
  'DipBalance': 'DIP 線平衡率(%)',
  'DIPProductionRate': 'DIP生產力',
  'DIPYield': 'DIP良率(%)',
  'DIPMonthDay': 'DIP 月工作天數',
  'DIPDayHour': 'DIP 日工時',

  'LCMType': {
    'Msg': 'LCM',
    'Select': ['LCMCT', 'LCMMan']
  }, // 为单选框 0---CT  需要填写 LCMCT 数据, 1---人力  需要填写 LCMMan

  'LCMOfflineRatio': 'LCM Offline Ratio(%)',
  'LCMBalance': 'LCM 線平衡率(%)',
  'LCMProductionRate': 'LCM生產力',
  'LCMYield': 'LCM良率(%)',
  'LCMMonthDay': 'LCM 月工作天數',
  'LCMDayHour': 'LCM 日工時',

  'FAType': {
    'Msg': 'FA',
    'Select': ['FACT', 'FAMan']
  }, // 为单选框 0---CT  需要填写 FACT 数据, 1---人力  需要填写 FAMan
  'FAOfflineRatio': 'FA Offline Ratio(%)',
  'FABalance': 'FA 線平衡率(%)',
  'FAProductionRate': 'FA生產力(%)',
  'FAYield': 'FA良率(%)',
  'FAMonthDay': 'FA月工作天數(天)',
  'FADayHour': 'FA 日工時'
};
