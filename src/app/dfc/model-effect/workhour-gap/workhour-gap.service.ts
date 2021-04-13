import {
  Injectable
} from '@angular/core';
import {
  ModelOperationsApi,
  StageApi,
  ProcessApi,
  BasicModelApi,
  GroupModelApi
} from '@service/dfc_sdk/sdk';

@Injectable({
  providedIn: 'root'
})
export class WorkhourGapService {
  list;
  aaa;
  bbb;
  datas;
  top8;
  totleTime = 0;
  totleTarget = 0;

  constructor(
    private processApi: ProcessApi,
    private stageApi: StageApi,
    private modeloperationsApi: ModelOperationsApi,
    private basicModelApi: BasicModelApi,
    private groupModelApi: GroupModelApi
  ) { }

  async getdata(models, process, kind) {
    const res: any = {};
    const echartDatas: {
      name: string,
      id: string,
      data: number[]
    }[] = [];
    const echartParam: {
      legendData: string[],
      series: any[],
      xAxisData: any[]
    } = {
      legendData: [],
      series: [],
      xAxisData: []
    };
    // 1.區分是 默認全查 還是 by 動作 or 物料
    if (!process) { // 默認全查
      // 1.1.獲取所有的製成數據, 並做排序
      const processSort = ['D', 'DT', 'DP', 'LA', 'LT', 'LP', 'A', 'T', 'P'];
      const processAll = await this.processApi.find().toPromise().then(datas => {
        const res = [];
        processSort.forEach(ps => {
          const process = datas.find(p => p['ProcessCode'] === ps);
          echartParam.xAxisData.push(process['Name']);
          res.push(process);
        });
        echartParam.xAxisData.push('Total');
        return res;
      });
      // 1.2.獲取出所有的數據
      for (let index = 0; index < models.length; index++) {
        const model = models[index];
        const modeltype = model['model'].split('-'); // 將傳入的 model值 區分出是BasicModel 還是 GroupModel
        let reportData;
        if (modeltype[0] === 'G') {
          reportData = await this.groupModelApi.GetOpTimeReport(modeltype[1], model['cFlow']).toPromise().then(data => data).catch(error => console.log(error));
        } else {
          reportData = await this.basicModelApi.GetOpTimeReport(modeltype[1], model['cFlow'], true).toPromise().then(data => data).catch(error => console.log(error));
        }
        // 1.3.拼湊legndData數據
        const legendData = model['custom'] + ' ' + model['projectName'] + ' ' + model['modelName'] + ' ' + model['cFlow'];
        echartParam.legendData.push(legendData);
        // 1.4.定義一個變量 存放即將存入echartDatas中的數據
        const echartData = {
          name: legendData,
          id: legendData,
          data: []
        };
        let totalTime = 0;
        processSort.forEach(ps => {
          if (!!reportData['result']['operationTime'][ps]) {
            echartData.data.push(reportData['result']['operationTime'][ps]['costTime']);
            totalTime += reportData['result']['operationTime'][ps]['costTime'];
          } else {
            echartData.data.push(0);
          }
        });
        echartData.data.push(totalTime);
        // 1.5. 存放echartData數據
        echartDatas.push(echartData);
      }
    } else { // by 動作或物料
      const nameList: string[] = []; // 用於存放第一筆數據的 物料/動作(名稱)
      const modelDataSet: any = {}; // 用於存儲表格中的數據, group在單獨細分, 有modelID 為存儲, 數組格式的 工時
      // 2.1.區分group或是basic, group記錄所需要查找的basic 及數量
      for (let index = 0; index < models.length; index++) {
        const model = models[index];
        const modeltype = model['model'].split('-'); // 將傳入的 model值 區分出是BasicModel 還是 GroupModel
        // 初始化當前 modelDataSet
        modelDataSet[model['model']] = {
          'timesData': [],
          'child': []
        };
        const tempChildTimesData = [];
        if (nameList.length > 0) {
          nameList.forEach(n => {
            modelDataSet[model['model']]['timesData'].push(0);
            tempChildTimesData.push(0);
          });
        }
        let reportData = [];
        const groupChild: any = {};
        if (modeltype[0] === 'G') {
          const modelMappingDatas = await this.groupModelApi.getGroupModelMappings(modeltype[1]).toPromise().then((data: any[]) => data).catch(error => {
            console.log(error);
            return [];
          });
          for (let mapIndex = 0; mapIndex < modelMappingDatas.length; mapIndex++) {
            const mapping = modelMappingDatas[mapIndex];
            groupChild[mapping['groupModelMappingid']] = {
              'count': mapping['count'],
              'basicModel': mapping['modelId'],
              'report': []
            };
            groupChild[mapping['groupModelMappingid']]['report'] = await this.getReport(mapping['modelId'], model['cFlow'], process).then(datas => {
              return datas.map(d => {
                d['count'] = (!d['count'] ? 0 : d['count']) * mapping['count'];
                return d;
              });
            });
            reportData.push(...groupChild[mapping['groupModelMappingid']]['report']);
          }
        } else {
          reportData = await this.getReport(modeltype[1], model['cFlow'], process);
        }
        // by物料 或者 by動作, 對資料進行處理
        const byKindRes = this.getKindData(reportData, kind, nameList, modelDataSet[model['model']]['timesData']);
        const byKindDatas = byKindRes['data'];
        modelDataSet[model['model']]['timesData'] = byKindRes['timesData'];
        // 對劃分好的 物料 或者 動作 將其放入數組中, 以便排序  只用于第一個
        if (index === 0) {
          let list: {
            Name: string,
            Value: number
          }[] = [];
          for (const key in byKindDatas) {
            if (byKindDatas.hasOwnProperty(key)) {
              const value = byKindDatas[key];
              list.push({
                Name: key,
                Value: value
              });
            }
          }
          list = this.getListSort(list);
          list = this.getList(list);
          list.forEach(l => {
            nameList.push(l.Name);
            modelDataSet[model['model']]['timesData'].push(l.Value);
          });
        }
        if (modeltype[0] === 'G') {
          for (const key in groupChild) {
            if (groupChild.hasOwnProperty(key)) {
              const child = groupChild[key];
              const childKindRes = this.getKindData(child['report'], kind, nameList, [...tempChildTimesData]);
              modelDataSet[model['model']]['child'].push({
                'basicModel': child['basicModel'],
                'count': child['count'],
                'list': childKindRes['timesData']
              });
            }
          }
        }
        // 1.3.拼湊legndData數據
        const legendData = model['custom'] + ' ' + model['projectName'] + ' ' + model['modelName'] + ' ' + model['cFlow'];
        echartParam.legendData.push(legendData);
        // 1.4.定義一個變量 存放即將存入echartDatas中的數據
        echartDatas.push({
          name: legendData,
          id: legendData,
          data: modelDataSet[model['model']]['timesData']
        });
      }
      nameList.forEach((list, i) => {
        let ele = list.split('/')[0];
        ele = ele.split('&')[0];
        ele = ele.split('?')[0];
        nameList[i] = ele;
      });
      echartParam.xAxisData = [...nameList];
      res['nameList'] = nameList;
      res['modelDataSet'] = modelDataSet;
    }
    res['option'] = this.getOptions(echartDatas, echartParam, process, kind);
    return res;
  }

  /**
   * 獲取到Stage 再獲取出詳細的機種工時信息
   *
   * @param {*} ModelID
   * @param {*} Stage
   * @returns
   * @memberof WorkhourGapService
   */
  async getReport(ModelID, Stage, process) {
    const stages = await this.stageApi.find({
      'where': {
        'and': [{
          'ModelID': ModelID
        },
        {
          'Stage': Stage
        }
        ]
      }
    }).toPromise().then(datas => {
      if (datas.length > 0) {
        return datas[0]['StageID'];
      } else {
        return null;
      }
    });
    // 查詢出對應的詳細工時
    return this.modeloperationsApi.ModelOpTime(stages, process).toPromise().then(data => data['data']).catch(error => {
      console.log(error);
      return [];
    });
  }

  getKindData(reportData, kind, nameList, timesData) {
    const res = reportData.reduce((p, t) => {
      if (kind === '物料') {
        if (!!t['material']) {
          if (!p[t['material']]) {
            p[t['material']] = 0;
          }
          p[t['material']] += (!t['costtime'] ? 0 : t['costtime']) * (!t['count'] ? 0 : t['count']);
          if (nameList.includes(t['material'])) {
            const indexOfNameList = nameList.indexOf(t['material']);
            timesData[indexOfNameList] += (!t['costtime'] ? 0 : t['costtime']) * (!t['count'] ? 0 : t['count']);
          } else {
            timesData[(nameList.length - 1)] += (!t['costtime'] ? 0 : t['costtime']) * (!t['count'] ? 0 : t['count']);
          }
        }
      } else {
        if (!!t['action']) {
          if (!p[t['action']]) {
            p[t['action']] = 0;
          }
          p[t['action']] += (!t['costtime'] ? 0 : t['costtime']) * (!t['count'] ? 0 : t['count']);
          if (nameList.includes(t['action'])) {
            const indexOfNameList = nameList.indexOf(t['action']);
            timesData[indexOfNameList] += (!t['costtime'] ? 0 : t['costtime']) * (!t['count'] ? 0 : t['count']);
          } else {
            timesData[(nameList.length - 1)] += (!t['costtime'] ? 0 : t['costtime']) * (!t['count'] ? 0 : t['count']);
          }
        }
      }
      return p;
    }, {});
    return {
      data: res,
      timesData: timesData
    }
  }

  /**
   * 用於排序
   *
   * @param {{ Name: string, Value: number }[]} list
   * @returns {{ Name: string, Value: number }[]}
   * @memberof WorkhourGapService
   */
  getListSort(list: {
    Name: string,
    Value: number
  }[]): {
    Name: string,
    Value: number
  }[] {
    list = list.sort((a, b) => {
      return a.Value < b.Value ? 1 : -1;
    });
    list = list.filter(data => {
      return data.Value !== 0;
    });
    return list;
  }
  /**
   * 用於 取前8, 多餘為Others
   *
   * @param {{ Name: string, Value: number }[]} list
   * @returns {{ Name: string, Value: number }[]}
   * @memberof WorkhourGapService
   */
  getList(list: {
    Name: string,
    Value: number
  }[]): {
    Name: string,
    Value: number
  }[] {
    if (list.length > 9) {
      let values = 0;
      for (let index = 9; index < list.length; index++) {
        const data = list[index];
        values += data.Value;
      }
      list.splice(9, (list.length - 9));
      list.push({
        Name: 'Others',
        Value: values
      });
    } else {
      list.push({
        Name: 'Others',
        Value: 0
      });
    }
    return list;
  }

  // 獲取echart option
  getOptions(tempDatas: {
    name: string,
    id: string,
    data: number[]
  }[], echartParam: {
    legendData: string[],
    series: any[],
    xAxisData: any[]
  }, process, kind) {
    const colorList = [
      'rgba(60, 144, 247, 1)', 'rgba(85, 191, 192, 1)', 'rgb(0, 102, 255)', 'rgb(34, 107, 218)', 'rgb(0, 69, 173)',
      'rgb(2, 50, 121)', 'rgb(44, 81, 138)', 'rgb(24, 54, 100)', 'rgb(115, 156, 218)', 'rgb(121, 124, 129)'
    ];
    tempDatas.forEach(tempData => {
      const indexOfName = echartParam.legendData.indexOf(tempData.name);
      const index = indexOfName + echartParam.legendData.length;
      echartParam.series[index] = {
        name: tempData.name,
        id: tempData.id,
        type: 'bar',
        itemStyle: {
          normal: {
            color: colorList[indexOfName],
            label: {
              show: true,
              position: 'top',
              formatter: function (p) {
                return p.value.toFixed(2);
              }
            }
          }
        },
        data: tempData.data
      };
    });
    const xAxis: any = {
      type: 'category',
      data: echartParam.xAxisData
    };
    if (!!process && kind === '物料') {
      xAxis['splitLine'] = {
        show: false
      };
      xAxis['axisLabel'] = {
        show: true,
        rotate: 315
      };
    }
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.7)',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params) {
          // for text color
          let res = '<div style="color:rgba(0, 0, 0, 0.5)">';
          res += '<strong>' + params[0].name + '</strong>';
          for (let i = 0, l = params.length; i < l; i++) {
            res += '<br/>' + params[i].seriesId + ' : ' + params[i].value;
          }
          res += '</div>';
          return res;
        }
      },
      legend: {
        x: 'left',
        data: echartParam.legendData
      },
      calculable: true,
      grid: {
        y: 80,
        y2: 40,
        x2: 40
      },
      xAxis: [xAxis],
      yAxis: [{
        type: 'value'
      }],
      series: echartParam.series
    };
    return option;
  }
}
