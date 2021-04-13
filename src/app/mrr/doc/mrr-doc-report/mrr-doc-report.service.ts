import { Injectable } from '@angular/core';
import { NewModelDocumentApi } from '@service/mrr-sdk';
import { BusinessUnitApi } from '@service/dfi-sdk';
@Injectable({
  providedIn: 'root'
})
export class MrrDocReportService {

  transNotice = {};
  constructor(
    private newModelDocumentApi: NewModelDocumentApi,
    private BusinessUnit: BusinessUnitApi
  ) { }

  /**
   * 查詢數據
   *
   * @param {*} plant
   * @param {*} productType
   * @param {*} customer
   * @param {*} bu
   * @param {*} startDate
   * @param {*} endDate
   * @param {*} stage
   * @returns {Observable<any>}
   * @memberof MrrDocReportService
   */
  async querySummaryData(plant, productType, customer, bu, startDate, endDate, stage) {
    const datas = await this.newModelDocumentApi.summary(plant, productType, customer, bu, startDate, endDate, stage).toPromise().then(d => d).catch(error => console.log(error));
    return datas;
  }
  // 用於轉換bu
  getBU(businessGroupId) {
    return this.BusinessUnit.find({
      where: {
        businessGroupId: businessGroupId
      },
      fields: ['id']
    });
  }

  createPie(datas, stage, reachRate, noData, reach, notReach) {
    let data;
    if (stage.length > 0) {
      data = stage.reduce((p, t) => {
        if (!p[t]) {
          p[t] = datas.data[t];
        }
        return p;
      }, {});
    } else {
      data = {
        C3: datas.data['C3'],
        C4: datas.data['C4'],
        C5: datas.data['C5'],
        C6: datas.data['C6']
      };
    }
    const res = [];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const stageData = data[key];
        let goal = 0;
        let ungoal = 0;
        const goalProName = {};
        const ungoalProName = {};
        for (const plantKey in stageData) {
          if (stageData.hasOwnProperty(plantKey)) {
            const plantData = stageData[plantKey];
            goal += plantData['goal'].length;
            ungoal += plantData['ungoal'].length;
            goalProName[plantKey] = plantData['goal'];
            ungoalProName[plantKey] = plantData['ungoal'];
          }
        }
        const param = {
          titleText: `${key} ${reachRate}`,
          dataTopValue: (goal !== 0 || ungoal !== 0) ? (goal / (goal + ungoal)) : 0,
          dataSecondName: goal + '',
          dataFourName: (goal + ungoal) + '',
          dataDownValue: (goal !== 0 || ungoal !== 0) ? (ungoal / (goal + ungoal)) : 0,
          goalProName: goalProName,
          ungoalProName: ungoalProName,
          stage: key,
          noData: noData,
          reach: reach,
          notReach: notReach,
        };
        let option;
        if (!goal && !ungoal) {
          option = this.getPieOptionNoData(param);
        } else {
          option = this.getPieOption(param);
        }
        res.push(option);
      }
    }
    return res;
  }

  async createList(datas, stage, noSet, plant, product, uploadFile) {
    let res = [];
    for (let unModelIndex = 0; unModelIndex < datas['data']['ungoalModel'].length; unModelIndex++) {
      const ungoalModelData = datas['data']['ungoalModel'][unModelIndex];
      const unDocReduce = ungoalModelData['ungoalDocument'].reduce((p, c) => {
        if (!p[c['PICUnit']]) {
          p[c['PICUnit']] = [];
        }
        p[c['PICUnit']].push(c);
        return p;
      }, {});
      const dueDate = new Date(ungoalModelData[(ungoalModelData['currentStage'] === 'EX' ? 'C6' : ungoalModelData['currentStage'])]);
      const nowDate = new Date();
      const time = nowDate.getTime() - dueDate.getTime();
      const delayedDay = Math.round(Number(time / (1000 * 60 * 60 * 24))); // 逾期天數
      // 如果沒選stage就默認顯示全部，如果是當前選擇的stage就添加進來
      if (stage.length === 0) {
        stage = ['C3', 'C4', 'C5', 'C6'];
      }
      for (let index = 0; index < stage.length; index++) {
        if (stage[index].includes(ungoalModelData['stage'])) {
          let flag = false;
          for (const key in unDocReduce) {
            if (unDocReduce.hasOwnProperty(key)) {
              flag = true;
              const unDocR = unDocReduce[key];
              res.push({
                stage: ungoalModelData['stage'],
                plant: ungoalModelData['plant'],
                proName: ungoalModelData['projectName'],
                ungoalFileCount: unDocR.length,
                delayedDay: delayedDay,
                role: key
              });
            }
          }
          if (!flag) {
            const PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
            const plantMapping = PlantMapping.find(data => data.Plant === ungoalModelData['plant']);
            res.push({
              stage: ungoalModelData['stage'],
              plant: ungoalModelData['plant'],
              proName: ungoalModelData['projectName'],
              ungoalFileCount: 0,
              delayedDay: delayedDay,
              role: `${noSet}(${plant}: '${plantMapping.PlantName}', ${product}: '${ungoalModelData['productType']}')${uploadFile}`
            });
          }
        }
      }
    }
    const stageArry = ['RFQ', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
    res = this.getSetSort(res, stageArry);
    return res;
  }

  // 饼图绘制
  private getPieOption(param: any): {} {
    const option = {
      'title': {
        'textStyle': {
          'fontSize': 16,
          'color': '#000000',
          'fontWeight': 'normal'
        },
        'text': param.titleText,
        'subtextStyle': {
          'color': '#000000',
          'fontWeight': 'bold',
          'fontSize': 14
        },
        'x': 'center',
        'y': '5px'
      },
      'backgroundColor': '#e5e5e5',
      'series': [{
        'type': 'pie',
        'center': [
          '50%',
          '60%'
        ],
        'radius': [
          '50%',
          '70%'
        ],
        label: {
          show: true,
          position: 'center',
          formatter: (param.dataSecondName !== undefined ? param.dataSecondName : 'N/A') + '\n' + '─────' + '\n' + (param.dataFourName !== undefined ? param.dataFourName : 'N/A'),
          fontWeight: 'bold',
          fontSize: 18,
          color: 'black'
        },
        'animation': false,
        'silent': false,
        'data': [{
          'name': 'Top',
          'value': param.dataTopValue,
          'proNames': param.goalProName,
          'popTitle': param.reach,
          'stageID': param.stage,
          'itemStyle': {
            'normal': {
              'color': '#05ac9c',
              'label': {
                'show': false,
                'position': 'center',
                'textStyle': {}
              }
            }
          }
        },
        {
          'name': '',
          'value': param.dataDownValue,
          'proNames': param.ungoalProName,
          'popTitle': param.notReach,
          'stageID': param.stage,
          'itemStyle': {
            'normal': {
              'color': 'rgba(212, 48, 48, 1)',
              'label': {
                'show': false,
                'position': 'center'
              }
            }
          }
        }
        ]
      }]
    };
    return option;
  }

  // 暫無數據饼图绘制
  getPieOptionNoData(param: any): {} {
    const option = {
      'title': {
        'textStyle': {
          'fontSize': 16,
          'color': '#000000',
          'fontWeight': 'normal'
        },
        'text': param.titleText,
        'subtextStyle': {
          'color': '#000000',
          'fontWeight': 'bold',
          'fontSize': 14
        },
        'x': 'center',
        'y': '5px'
      },
      'backgroundColor': '#e5e5e5',
      'series': [{
        'type': 'pie',
        'center': [
          '50%',
          '60%'
        ],
        'radius': [
          '50%',
          '70%'
        ],
        'labelLine': {
          'show': false
        },
        'animation': false,
        'silent': false,
        'itemStyle': {
          'normal': {}
        },
        label: {
          show: true,
          position: 'center',
          formatter: param.noData,
          fontWeight: 'bold',
          fontSize: 18,
          color: 'black'
        },
        'data': [
          {
            'name': param.noData,
            'value': 0,
            'itemStyle': {
              'normal': {
                'color': 'rgba(248, 244, 244, 0.973)',
                'label': {
                  'show': false,
                  'position': 'center',
                  'textStyle': {
                    'color': 'black',
                    'fontWeight': 'bold',
                    'fontSize': 12
                  }
                }
              }
            }
          }
        ]
      }]
    };
    return option;
  }

  // 用於排序
  private getSetSort(dataSet, sortArry: any[]) {
    const temp = dataSet.reduce((p, t) => {
      if (!p[t['stage']]) {
        p[t['stage']] = {};
      }
      if (!p[t['stage']][t['plant']]) {
        p[t['stage']][t['plant']] = {};
      }
      if (!p[t['stage']][t['plant']][t['proName']]) {
        p[t['stage']][t['plant']][t['proName']] = [];
      }
      p[t['stage']][t['plant']][t['proName']].push(t);
      return p;
    }, {});
    const res = [];
    sortArry.forEach(sort => {
      if (!!temp[sort]) {
        for (const plantKey in temp[sort]) {
          if (temp[sort].hasOwnProperty(plantKey)) {
            const plantProName = temp[sort][plantKey];
            for (const proNameKey in plantProName) {
              if (plantProName.hasOwnProperty(proNameKey)) {
                const proNames = plantProName[proNameKey];
                proNames.forEach(proName => {
                  res.push(proName);
                });
              }
            }
          }
        }
      }
    });
    return res;
  }
}
