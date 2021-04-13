import { MatomoInjector, MatomoTracker } from 'ngx-matomo';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { DatePipe } from '@angular/common';
import { CPKSliding, Detail, CPKTubling } from '../../../../model/CPK';
import { GlobalService } from '@service/skyeye/global.service';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';

@Component({
  selector: 'app-cpk-chart',
  templateUrl: './cpk-chart.component.html',
  styleUrls: ['./cpk-chart.component.scss']
})
export class CpkChartComponent implements OnInit, OnDestroy {
  isShowNormalDis = false;
  isVisible1 = false;
  isVisible1_1 = false;
  footer1 = null;
  footer1_1 = null;
  cancelOK1 = false;
  cancelOK1_1 = false;
  isVisible2 = false;
  isVisible2_2 = false;
  footer2 = null;
  footer2_2 = null;
  cancelOK2 = false;
  cancelOK2_2 = false;
  project = 'rf cpk';
  cur_site;
  cur_plant;
  cur_line;
  cur_section;
  cur_mdname;
  cur_model;
  cur_bt;
  cur_st;
  timer;
  cur_item;
  datefrom;
  dateto;
  detailTable_sliding: {}[] = [];
  detailTable_tubling: {}[] = [];
  sliding_list: {};
  tubling_list: {};
  detailTable_sliding_total: {}[] = [];
  detailTable_tubling_total: {}[] = [];
  detailNo_sliding: string;
  dateX_array: {}[] = [];
  data_cpk: {}[] = [];
  cpkSliding_array: CPKSliding[] = [];
  cpkTumbling_array: CPKTubling[] = [];
  data_cpk2: {}[] = [];
  dataX_array2: {}[] = [];
  show_box1 = false;
  show_box2 = false;
  line_chart_sliding;
  line_chart_tubling;
  abnormalPointSliding: {}[] = [];
  abnormalPointTubling: {}[] = [];
  sliding_abnormal_num: number;
  tubling_abnormal_num: number;
  cur_upn;
  comment = [];
  normalDistribution; // 正态分布图
  lowerlimit;
  upperlimit;
  normalDisData;
  normalDisData1;
  averageDis;
  standardDev;
  constructor(private esService: EsDataServiceService,
    private globals: GlobalService,
    private datePipe: DatePipe,
    private dataService: LineDataServiceService,
    private message: NzMessageService,
    private excelService: ExcelToolService,
    private readonly matomoTracker: MatomoTracker,
    private readonly matomoInjector: MatomoInjector
  ) {
    // this.matomoInjector.init('https://matomo.wistron.com/', 24);
  }

  ngOnInit() {
    this.matomoTracker.trackPageView('cpkEchartPage');
  }

   queryOp (options, type?) {
    console.log(this.timer);
    clearInterval(this.timer);
    console.log(options);
    // debugger;
    this.cur_site = options['cur_site'];
    this.cur_plant = options['cur_plant'];
    this.cur_section = options['cur_section'];
    this.cur_line = options['cur_line'];
    this.cur_mdname = options['cur_mdname'];
    this.cur_model = options['cur_model'];
    this.cur_item = options['cur_item'];
    this.cur_st = options['cur_st'];
    this.cur_bt = options['cur_bt'];
    this.datefrom = options['datefrom'];
    this.dateto = options['dateto'];
    this.cur_upn = options['upn'];
    // const stageMapping = await this.dataService.getStageMapping();
    // console.log(stageMapping);
    // await this.getCKPLine('tumbling-count-cpk', this.data_cpk2, this.dataX_array2, this.cpkTumbling_array, this.cur_model, this.cur_item,
    // this.cur_st, this.cur_bt, this.datefrom, this.dateto);
    // await this.getCKPLine('sliding-count-cpk', this.data_cpk, this.dateX_array, this.cpkSliding_array, this.cur_model, this.cur_item,
    // this.cur_st, this.cur_bt, this.datefrom, this.dateto);
    if (type !== 'history') {
      this.getCKPLine('tumbling-count-cpk', this.data_cpk2, this.dataX_array2, this.cpkTumbling_array, this.cur_model, this.cur_upn, this.cur_item,
      this.cur_st, this.cur_bt, this.datefrom, this.dateto, false);
      // this.getCKPLine('sliding-count-cpk', this.data_cpk, this.dateX_array, this.cpkSliding_array, this.cur_model, this.cur_upn, this.cur_item,
      // this.cur_st, this.cur_bt, this.datefrom, this.dateto, false);
      this.timer = setInterval(async() => {
        // this.getCKPLine('sliding-count-cpk', this.data_cpk, this.dateX_array, this.cpkSliding_array, this.cur_model, this.cur_upn, this.cur_item,
        // this.cur_st, this.cur_bt, this.datefrom, this.dateto, false);
        this.getCKPLine('tumbling-count-cpk', this.data_cpk2, this.dataX_array2, this.cpkTumbling_array, this.cur_model, this.cur_upn, this.cur_item,
        this.cur_st, this.cur_bt, this.datefrom, this.dateto, false);
       }, 30000);
    } else {
      this.getCKPLine('tumbling-count-cpk', this.data_cpk2, this.dataX_array2, this.cpkTumbling_array, this.cur_model, this.cur_upn, this.cur_item,
      this.cur_st, this.cur_bt, this.datefrom, this.dateto, true);
      // this.getCKPLine('sliding-count-cpk', this.data_cpk, this.dateX_array, this.cpkSliding_array, this.cur_model, this.cur_upn, this.cur_item,
      // this.cur_st, this.cur_bt, this.datefrom, this.dateto, true);
    }
    console.log(this.timer);
  }

  getCKPLine( type, data_cpk: {}[], dateX_array: {}[], cpkItem_array: CPKSliding[], mdname, cur_upn, cur_item, cur_st, cur_bt, datefrom, dateto, dateTag) {
    let querys;
    console.log(this.cur_bt, this.cur_st);
    const abnormalArr = [];
    const markLineX = [];
    let limit_arr;
    let date_range;
    let size;
    let esURL;
    if (this.cur_site !== 'WKS') {
      esURL = this.esService.getUrl(type + '/',  '_' + this.cur_site.toLowerCase());
    } else {
      esURL = this.esService.getUrl(type + '/');
    }
    if (datefrom !== undefined && dateto !== undefined) {
      date_range = `"range": {
        "stopdate": {
          "lte": ${dateto},
          "gte": ${datefrom}
        }
      }`;
      size = `"size": 10000`;
    } else {
      date_range = `"range": {
        "stopdate": {
          "lte": "now"
        }
      }`;
      size = `"size": 10`;
    }
    // if (type === 'sliding-count-cpk') {
    //   querys = this.esService.getQueryByCPKSliding(this.cur_site.toLowerCase(),
    //   this.cur_line.toUpperCase(),
    //   this.cur_mdname.toUpperCase(), this.cur_plant.toUpperCase(), mdname, cur_upn, cur_item, cur_st, cur_bt, date_range, size);
    // } else if (type === 'tumbling-count-cpk' ) {
    //   querys = this.esService.getQueryByCPKTumbling(this.cur_site.toLowerCase(),
    //   this.cur_line.toUpperCase(),
    //   this.cur_mdname.toUpperCase(), this.cur_plant.toUpperCase(), mdname, cur_upn, cur_item, cur_st, cur_bt, date_range, size);
    // }
    querys = this.esService.getQueryByCPKTumbling(this.cur_site.toLowerCase(),
    this.cur_line.toUpperCase(),
    this.cur_mdname.toUpperCase(), this.cur_plant.toUpperCase(), mdname, cur_upn, cur_item, cur_st, cur_bt, date_range, size);
    // debugger;
    console.log(esURL, querys);
  querys = JSON.parse(querys);
  console.log('rf_cpk  查询的语句 ## \n');
  console.log(querys);
  console.log('###################################### \n')
  if (data_cpk !== undefined) {
     data_cpk.splice(0, data_cpk.length);
  }
  if (dateX_array !== undefined) {
    dateX_array.splice(0, dateX_array.length);
  }
  if (cpkItem_array !== undefined) {
    cpkItem_array.splice(0, cpkItem_array.length);
  }
  console.log('查询到的url ------ \n', esURL);
    this.esService.postData(esURL, querys).subscribe(data => {
    console.log('********查询到的数据******** ## \n', data);

    console.log(data['hits']['hits'].length);
    if (data['hits']['hits'].length > 500) {
      this.message.create('success', '查詢範圍過大，請重新選擇查詢日期');
      return;
    }
    if (data['hits']['hits'].length > 0 && esURL.includes('tumbling-count-cpk') && data['hits']['hits'][0]._source.comment) {
      this.comment = data['hits']['hits'][0]._source.comment.split(',');
    }
    for (let i = data['hits']['hits'].length - 1; i > -1; i--) {
      data_cpk.push({value: data['hits']['hits'][i]._source.cpk});
      const date_item = this.datePipe.transform(data['hits']['hits'][i]._source.stopdate, 'MM/dd HH:mm');
      const item = new CPKSliding();
      item.modelName = data['hits']['hits'][i]._source.modelname;
      item.stationLine = data['hits']['hits'][i]._source.stationline;
      item.stationType = data['hits']['hits'][i]._source.stationtype;
      item.stationName = data['hits']['hits'][i]._source.stationname;
      item.stationId = data['hits']['hits'][i]._source.stationid;
      item.tdName = data['hits']['hits'][i]._source.tdname;
      item.mdName = data['hits']['hits'][i]._source.mdname;
      item.cpk = data['hits']['hits'][i]._source.cpk;
      item.lowerLimit = data['hits']['hits'][i]._source.lowerlimit;
      item.upperLimit = data['hits']['hits'][i]._source.upperlimit;
      item.goodLimit = data['hits']['hits'][i]._source.goodlimit;
      item.Details = data['hits']['hits'][i]._source.detail;
      item.upn = data['hits']['hits'][i]._source.upn;
      const aa = item.Details[0]['unitserialnumber'];
      if (item.upperLimit !== null && item.upperLimit < 300 ) {
        if (item.cpk < item.upperLimit) {
          abnormalArr.push({name: '異常點', symbol: 'circle', symbolSize: 20, value: item.cpk, yAxis: item.cpk, xAxis: data['hits']['hits'].length - i - 1, itemStyle: {normal:
            {color: 'transparent', borderColor: '#dc143c', label: {show: false}}}});
          dateX_array.push({value: date_item, textStyle: {color: '#dc143c'}});
        } else {
          dateX_array.push({value: date_item});
        }
      } else {
        dateX_array.push({value: date_item});
      }
      // console.log(aa);
      cpkItem_array.push(item);
    }

    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@v \n', cpkItem_array);

    dateX_array.push({value: ''});
      if (cpkItem_array[0] !== undefined && cpkItem_array[0].lowerLimit > -300) {
        markLineX.push([{name: 'lower:' + cpkItem_array[0].lowerLimit, yAxis: cpkItem_array[0].lowerLimit, x: 70, label: {show: true}, itemStyle: {normal: {color: '#abc327'}}},
          {name: 'lower', yAxis: cpkItem_array[0].lowerLimit, xAxis: dateX_array.length - 1, itemStyle: {normal: {color: '#abc327'}}}]
          );
          limit_arr = {upper: cpkItem_array[0].upperLimit, lower: cpkItem_array[0].lowerLimit};
      }
      if (cpkItem_array[0] !== undefined && cpkItem_array[0].upperLimit < 300) {
        markLineX.push([{name: 'upper:' + cpkItem_array[0].upperLimit, yAxis: cpkItem_array[0].upperLimit, x: 70, label: {show: true}, itemStyle: {normal: {color: '#dc143c'}}},
          {name: 'upper', yAxis: cpkItem_array[0].upperLimit, xAxis: dateX_array.length - 1, itemStyle: {normal: {color: '#dc143c'}}}]);
      }
    // if (type === 'sliding-count-cpk') {
    //   this.options_line(abnormalArr, markLineX, limit_arr, dateTag);
    //   this.sliding_abnormal_num = abnormalArr.length;
    // } else {
    //   this.option_line2(abnormalArr, markLineX, limit_arr, dateTag);
    //   this.tubling_abnormal_num = abnormalArr.length;
    // }
    this.option_line2(abnormalArr, markLineX, limit_arr, dateTag);
    this.tubling_abnormal_num = abnormalArr.length;
    if (!dateTag) {
      const abnormal_data = {
        num: this.sliding_abnormal_num + this.tubling_abnormal_num,
        type: 'cpk'
      };
      this.globals.AbnormalPot_subject.next(abnormal_data);
    }
    console.log(limit_arr);
  });
  }

  showbox_sliding(e) {
    this.detailTable_sliding_total = [];
    this.isVisible1 = true;
    // this.cur_dataIndex = e['dataIndex'];
    // console.log(e,  e['data']['xAxis']);
    let index;
    if (e['data']['xAxis'] === undefined) {
      index = this.dateX_array.findIndex(x => {return x['value'] === e['name']});
    } else {
      index = e['data']['xAxis'];
    }
    // this.detailTable_sliding = this.cpkSliding_array[e.dataIndex].Details;
    // this.detailNo_sliding = this.cpkSliding_array[e.dataIndex].mdName + '__' + this.cpkSliding_array[e.dataIndex].modelName;
    const detailTable_sliding_total = {name: this.cpkSliding_array[index].mdName,
    result: this.cpkSliding_array[index].Details[0]['mdstatus'],
    num: this.cpkSliding_array[index].Details.length,
    detail: this.cpkSliding_array[index].Details,
    model: this.cpkSliding_array[index].modelName,
    line: this.cpkSliding_array[index].stationLine,
    stage: this.cpkSliding_array[index].stationType,
    fixture: this.cpkSliding_array[index].stationId,
    upper: this.cpkSliding_array[index].upperLimit,
    lower: this.cpkSliding_array[index].lowerLimit,
    upn: this.cpkSliding_array[index].upn ? this.cpkSliding_array[index].upn : ''
    };
    this.detailTable_sliding_total.push(detailTable_sliding_total);
  }

  showSubDetail_sliding(detail) {
    this.isVisible1_1  = true;
    console.log(detail);
    this.detailTable_sliding = detail['detail'];
    this.sliding_list = detail;
    // this.detailTable_sliding.push(detail);
  }

  showSubDetail_tubling(detail) {
    this.matomoTracker.trackEvent('cpkPage three', 'three', 'cpkPageEchartComponent', 5);

    this.isVisible2_2  = true;
    this.detailTable_tubling = detail['detail'];
    // this.detailTable_tubling.push(detail['detail']);
    this.tubling_list = detail;
    console.log(detail.detail)
    console.log('三界面获取的数据\n', this.detailTable_tubling);
  }

  showbox_tubling(e) {
    this.matomoTracker.trackEvent('cpkPage two', 'two', 'cpkPageEchartComponent', 5);

    // this.cur_dataIndex = e['dataIndex'];
    this.detailTable_tubling_total = [];
    this.isVisible2 = true;
    let index;
    if (e['data']['xAxis'] === undefined) {
      index = this.dataX_array2.findIndex(x => { return x['value'] === e['name']});
    } else {
      index = e['data']['xAxis'];
    }
    // console.log(e, e['data']['xAxis']);
    // this.detailTable_tubling = this.cpkTumbling_array[e.dataIndex].Details;
    // this.detailNo_sliding = this.cpkTumbling_array[e.dataIndex].mdName + '__' + this.cpkTumbling_array[e.dataIndex].modelName;
    const detailTable_tubling_total = {
      name: this.cpkTumbling_array[index].mdName,
      result: this.cpkTumbling_array[index].Details[0]['mdstatus'],
      num: this.cpkTumbling_array[index].Details.length,
      detail: this.cpkTumbling_array[index].Details,
      model: this.cpkTumbling_array[index].modelName,
      line: this.cpkTumbling_array[index].stationLine,
      stage: this.cpkTumbling_array[index].stationType,
      fixture: this.cpkTumbling_array[index].stationId,
      upper: this.cpkTumbling_array[index].upperLimit,
      lower: this.cpkTumbling_array[index].lowerLimit,
      upn: this.cpkTumbling_array[index].upn ? this.cpkTumbling_array[index].upn : ''
    };
    this.detailTable_tubling_total.push(detailTable_tubling_total);
    console.log(this.cpkTumbling_array[index].Details, this.cpkTumbling_array[index].Details[0]);
  }

  handleOk1(): void {
    this.isVisible1 = false;
  }

  handleOk1_1(): void {
    this.isVisible1_1 = false;
  }

  handleCancel2(): void {
    this.isVisible2 = false;
  }

  handleCancel2_2(): void {
    this.isVisible2_2 = false;
  }
  handleOk2(): void {
    this.isVisible2 = false;
  }

  handleOk2_2(): void {
    this.isVisible2_2 = false;
  }

  handleCancel1(): void {
    this.isVisible1 = false;
  }

  handleCancel1_1(): void {
    this.isVisible1_1 = false;
  }

  async option_line2(abnormalArr, markLineX, limit_arr, dateTag) {
    const stageMapping = await this.dataService.getStageMapping(this.cur_mdname, this.cur_plant, this.cur_site);
    const TestItemMapping = await this.dataService.getTestItemMapping(this.cur_plant, this.cur_site, this.cur_bt, this.cur_st).toPromise();
    console.log(stageMapping);
    let text;
    if (stageMapping.length > 0 && TestItemMapping.length > 0) {
      text = `一、CPK定量型監控:每生产100PCS则计算一次CPK(${stageMapping[0]['chineseContrast']} : ${TestItemMapping[0]['chineseContrast']})`;
    } else {
      text = '一、CPK定量型監控:每生产100PCS则计算一次CPK';
    }
    this.line_chart_tubling = {
      title : {
        text: `${text}`,
        x: 'left',
        textStyle: {
          color: 'black',
        }
      },
      grid: {
        y: 70,
        y2: 30,
        x: 70
      },
      backgroundColor: 'rgba(255,255,255,0.7)',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.7)',
        axisPointer: {
          type: 'shadow'
        },
        formatter: 'cpk <br/> {b}   {c}',
        textStyle: {
            color: 'black'
        }
    },
    calculable : true,
      xAxis: {
          type: 'category',
          data: this.dataX_array2,
          axisLine: {
            lineStyle: {
              width: 1,
              color: 'black'
            }
          },
          axisLabel: {
            interval: 0
          },
          triggerEvent: true
      },
      yAxis: {
          type: 'value',
          splitLine: {
            show: true
          },
          axisLine: {
            lineStyle: {
              width: 1,
              color: 'black'
            }
          },
          max: function(value) {
            // console.log(limit_arr);
            if (limit_arr !== undefined && limit_arr.upper > value.max) {
              return limit_arr.upper === undefined ? value.max : limit_arr.upper;
            } else {
              return (value.max + 0.3).toFixed(2);
            }
          },
          min: function(value) {
            // console.log(limit_arr);
            if (limit_arr !== undefined && limit_arr.lower < value.min) {
              return limit_arr.lower === undefined ? value.min : limit_arr.lower;
            } else {
              return value.min;
            }
          }
      },
      dataZoom: [
        {
          type: 'slider',
          show: dateTag,
          xAxisIndex: [0],
          top: '92%'
        }
      ],
      series: [{
          name: 'cpk',
          data: this.data_cpk2,
          type: 'line',
          lineStyle: {
            normal: {
              width: 3,
              color: '#7EC0EE',
              shadowColor: 'rgba(126,192,238,0.5)',
              shadowBlur: 10,
              shadowOffsetY: 7
            }
          },
          itemStyle: {
            normal: {
              borderWidth: 7,
              borderColor: '#7EC0EE',
              color: '#7EC0EE',
               label: {
                show: true,
                position: 'top',
                color: 'black'
            }
            }
          },
          smooth: true,
          markPoint : {
            data: abnormalArr
          },
          markLine: {
            silent: true,
            data: markLineX
          }
      }]
  };
  }

//   async options_line(abnormalArr, markLineX, limit_arr, dateTag) {
//     const stageMapping = await this.dataService.getStageMapping(this.cur_mdname, this.cur_plant, this.cur_site);
//     const TestItemMapping = await this.dataService.getTestItemMapping(this.cur_plant, this.cur_site, this.cur_bt, this.cur_st).toPromise();
//     console.log(stageMapping);
//     let text;
//     if (stageMapping.length > 0 && TestItemMapping.length > 0) {
//       text = `一、CPK實時型監控:每生产1PCS则计算一次CPK(${stageMapping[0]['chineseContrast']} : ${TestItemMapping[0]['chineseContrast']})`;
//     } else {
//       text = '一、CPK實時型監控:每生产1PCS则计算一次CPK';
//     }
//     this.line_chart_sliding = {
//       title : {
//         text: `${text}`,
//         x: 'left',
//         textStyle: {
//           color: 'black',
//         }
//       },
//       grid: {
//         y: 70,
//         y2: 40,
//         x: 70
//       },
//       backgroundColor: 'rgba(255,255,255,0.7)',
//       tooltip: {
//         trigger: 'axis',
//         backgroundColor: 'rgba(255,255,255,0.7)',
//         axisPointer: {
//           type: 'shadow'
//         },
//         formatter: 'cpk <br/> {b} - {c}',
//         textStyle: {
//             color: 'black'
//         }
//     },
//     calculable : true,
//       xAxis: {
//           type: 'category',

//           data: this.dateX_array,
//           axisLine: {
//             lineStyle: {
//               width: 1,
//               color: 'black'
//             }
//           }
//       },
//       yAxis: {
//           type: 'value',
//           splitLine: {
//             show: true
//           },
//           axisLine: {
//             lineStyle: {
//               width: 1,
//               color: 'black'
//             }
//           },
//           max: function(value) {
//             // console.log(limit_arr);
//             if (limit_arr !== undefined && limit_arr.upper > value.max) {
//               return limit_arr.upper === undefined ? (value.max + 0.3).toFixed(2) : limit_arr.upper;
//             } else {
//               return (value.max + 0.3).toFixed(2);
//             }
//           },
//           min: function(value) {
//             // console.log(limit_arr);
//             if (limit_arr !== undefined && limit_arr.lower < value.min) {
//               return limit_arr.lower === undefined ? value.min : limit_arr.lower;
//             } else {
//               return value.min;
//             }
//           }
//       },
//       dataZoom: [
//         {
//           type: 'slider',
//           show: dateTag,
//           xAxisIndex: [0]
//         }
//       ],
//       series: [{
//           name: 'cpk',
//           data: this.data_cpk,
//           type: 'line',
//           lineStyle: {
//             normal: {
//               width: 3,
//               color: '#7EC0EE',
//               shadowColor: 'rgba(126,192,238,0.5)',
//               shadowBlur: 10,
//               shadowOffsetY: 7
//             }
//           },
//           itemStyle: {
//             normal: {
//               borderWidth: 7,
//               borderColor: '#7EC0EE',
//               color: '#7EC0EE',
//                label: {
//                 show: true,
//                 position: 'top',
//                 color: 'black'
//             }
//             }
//           },
//           smooth: true,
//           markPoint : {
//             data: abnormalArr
//           },
//           markLine: {
//             silent: true,
//             data: markLineX
//           }
//       }]
//   };
// }

downloadTotal(data, title) {
  if (data) {
    const downloadDatas = data.map (res => {
      return {
        '監控項目': res['name'],
        '測試結果': res['result'],
        '测试数量': res['num']
      };
    });
    const colWidth = [];
    Object.keys(data[0]).forEach(element => {
      colWidth.push({wpx: 270});
    });
    const headerBgColor = '53868B';
    this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(downloadDatas)), title, colWidth, headerBgColor);
  }
}

downloadDetail(seriesData, dataInfo, title) {
  console.log(seriesData);
  console.log(dataInfo);
  const data = [];
  const mergeArr = [];
  if (dataInfo) {
    if (seriesData.length > 0) {
      seriesData.forEach((row, index) => {
        data.push({
          '機種': dataInfo['model'],
          '線別': dataInfo['line'],
          '架構': dataInfo['upn'],
          '站別': dataInfo['stage'],
          '治具編號': dataInfo['fixture'],
          '機台序列號': row['unitserialnumber'],
          '開始測試時間': this.datePipe.transform(row['item_startdate'], 'yyyy/MM/dd HH:mm:ss') ? this.datePipe.transform(row['item_startdate'], 'yyyy/MM/dd HH:mm:ss')  : 'NA',
          '結束測試時間': this.datePipe.transform(row['item_stopdate'], 'yyyy/MM/dd HH:mm:ss') ? this.datePipe.transform(row['item_stopdate'], 'yyyy/MM/dd HH:mm:ss')  : 'NA',
          '測試值': row['mdresult'],
          '測試值上限': seriesData[0]['mdupperlimit'] ? (seriesData[0]['mdupperlimit'] < 300 ? seriesData[0]['mdupperlimit'] : '無設置') : (dataInfo['upper'] < 300 ? dataInfo['upper'] : '無設置'),
          '測試值下限': seriesData[0]['mdlowerlimit'] ? (seriesData[0]['mdlowerlimit'] > -300 ? seriesData[0]['mdlowerlimit'] : '無設置') : (dataInfo['lower'] > -300 ? dataInfo['lower'] : '無設置')
        });
      });
      const colWidth = [];
      Object.keys(data[0]).forEach((element, index) => {
        if (index === 4) {
          colWidth.push({wpx: 180});
        } else {
          colWidth.push({wpx: 180});
        }
      });
      const headerBgColor = '53868B';
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(data)), title, colWidth, headerBgColor);
    }
  }
}


handleCanceldis() {
  this.isShowNormalDis = false;
}

handleOkdis() {
  this.isShowNormalDis = false;
}


// 定量型监控正态分布图
showNormalDistibution(data) {
  if (!(data.detail && data.detail[0].item_startdate)) {
    return;
  }
  // console.log('点击link 获取的数据 \n', data)

      // 获取上下限
      this.lowerlimit = data.detail[0].mdlowerlimit > -300 ? data.detail[0].mdlowerlimit : 'NA' ;
      this.upperlimit = data.detail[0].mdupperlimit < 300 ? data.detail[0].mdupperlimit : 'NA';
      // console.log('上下限数据 === \n' ,this.lowerlimit,this.upperlimit);

      const arr = [];
      for (let i = 0; i < data.detail.length; i++) {
        arr.push(data.detail[i].mdresult);
      }
      const aim = [];
      for (let i = 0; i < arr.length; i++) {
        const temp = {};
        temp['value'] = arr[i];
        temp['count'] = this.getSameValueCount(arr, arr[i]);
        aim.push(temp);
      }

      // 将上下限放入aim
      if (this.lowerlimit !== 'NA') {
        aim.push({value: this.lowerlimit, count: 0});
      }
      if (this.upperlimit !== 'NA') {
        aim.push({value: this.upperlimit, count: 0});
      }

      // 去除重复数据
      this.normalDisData = [];
      const obj = {};
      // tslint:disable-next-line: no-shadowed-variable
      this.normalDisData = aim.reduce(( item: any, next) => {
        // tslint:disable-next-line: no-unused-expression
        obj[next.value] ? '' : obj[next.value] = true && item.push(next);
        return item;
      }, []);

       // 将数据按照cpk的数值从小到大排列
       this.normalDisData.sort((a, b) => {
        return a.value - b.value;
      });
      // console.log('排序后的数据 ## \n', this.normalDisData);

        // 需要的数据
      this.normalDisData1 = [];
      let xData = [];
      let yData = [];

      for (let i = 0; i < this.normalDisData.length; i++) {
        xData.push(this.normalDisData[i].value);
        yData.push(this.normalDisData[i].count);
      }
      // 获取count最大值
      const lineTop = Math.max(...yData);
      this.isShowNormalDis = true;
      // 计算平均数
      this.averageDis = this.average(this.normalDisData, 'value', 'count');
      // console.log('平均数 = \n', this.averageDis);
      // 计算标准差
      this.standardDev = this.standardDeviation(this.normalDisData, this.averageDis, 'value', 'count');
      // console.log('计算标准差 = \n', this.standardDev);

      const mean = this.averageDis;
      const low = this.averageDis - this.standardDev * 3;
      const up = this.averageDis + this.standardDev * 3;

      yData = this.addParam1(xData, low.toFixed(2), yData);
      yData = this.addParam1(xData, mean.toFixed(2), yData);
      yData = this.addParam1(xData, up.toFixed(2), yData);

      xData = this.addParam(xData, low.toFixed(2));
      xData = this.addParam(xData, mean.toFixed(2));
      xData = this.addParam(xData, up.toFixed(2));
      for (let i = 0; i < xData.length; i++) {
        this.normalDisData1.push(this.normalDistributionData(xData[i], this.averageDis, this.standardDev).toFixed(2))
      }

      const markLineY = [];
      // markLineX.push([{name: 'lower:' + cpkItem_array[0].lowerLimit, yAxis: cpkItem_array[0].lowerLimit, x: 70, label: {show: true}, itemStyle: {normal: {color: '#abc327'}}},
      // {name: 'lower', yAxis: cpkItem_array[0].lowerLimit, xAxis: dateX_array.length - 1, itemStyle: {normal: {color: '#abc327'}}}]);

      // markLineX.push([{name: 'upper:' + cpkItem_array[0].upperLimit, yAxis: cpkItem_array[0].upperLimit, x: 70, label: {show: true}, itemStyle: {normal: {color: '#dc143c'}}},
      // {name: 'upper', yAxis: cpkItem_array[0].upperLimit, xAxis: dateX_array.length - 1, itemStyle: {normal: {color: '#dc143c'}}}]);

      if (this.lowerlimit !== 'NA') {
          markLineY.push([{name: 'lower' + this.lowerlimit, yAxis: 0, xAxis: xData.indexOf(this.lowerlimit) , itemStyle: {normal: {color: '#abc327'}}},
          {name: 'lower:', xAxis: xData.indexOf(this.lowerlimit) , yAxis: lineTop, label: {show: true}, itemStyle: {normal: {color: '#abc327'}}}]);
      }

      if (this.upperlimit !== 'NA') {
        markLineY.push([{name: 'upper' + this.upperlimit, yAxis: 0, xAxis: xData.indexOf(this.upperlimit)  , itemStyle: {normal: {color: '#dc143c'}}},
        {name: 'upper:', xAxis: xData.indexOf(this.upperlimit)  , yAxis: lineTop, label: {show: true}, itemStyle: {normal: {color: '#dc143c'}}}]);
      }

      // console.log('markLine: =============@# \n',markLineY);

      // 绘制正态分布图
      this.normalDistribution = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              crossStyle: {
                  color: '#999'
              }
          }
      },
      grid: {
        y: 70,
        y2: 40,
        x: 70
      },
      xAxis: [
          {
              type: 'category',
              data: xData,
              axisPointer: {
                  type: 'shadow'
              }
          }
      ],
      yAxis: [
          {
              name: '数量',
          },
          {
              name: '正态分布值',
          }
      ],
      series: [
          {
              name: 'Test Count',
              type: 'bar',
              data: yData,
              markLine: {
                silent: true,
                data: markLineY
              }
          },
          {
              name: 'Actual Capacity',
              type: 'line',
              yAxisIndex: 1,
              data: this.normalDisData1
          }
      ]
      };
}


getSameValueCount(arr, val) {
  const processArr = arr.filter(function(value) {
    return value === val;
  });
  return processArr.length;
}


average(arr, key1, key2) {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    count = count + arr[i][key2];
    sum = sum + arr[i][key1] * arr[i][key2];
  }
  return parseFloat((sum / count).toFixed(2));
}


standardDeviation(arr, average, key1, key2) {
  let count = 0;
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    count = count + arr[i][key2];
    sum = sum + ((arr[i][key1] - average) * (arr[i][key1] - average)) * arr[i][key2];
  }
  return parseFloat(Math.sqrt((sum / count)).toFixed(2));
}

addParam(arr, target1) {
  let flag = false;
  const target = parseFloat(target1);
  if (target < parseFloat(arr[0])) {
      arr.unshift(target);
      return arr;
  }

  if (target > parseFloat(arr[arr.length - 1])) {
      arr.push(target);
      return arr;
  }
  for (var i = 0; i < arr.length; i++) {
      if (parseFloat(arr[i]) > target) {
          if (arr[i - 1] === target) {
              flag = true;
          }
          break;
      }
  }
  if (flag) {
      return arr;
  } else {
      arr.splice(i, 0, target);
      return arr;
  }
 }

 addParam1(arr, target1, aimArr) {
  let flag = false;
  const target = parseFloat(target1);
  if (target < parseFloat(arr[0])) {
    aimArr.unshift(0);
      return aimArr;
  }

  if (target > parseFloat(arr[arr.length - 1])) {
    aimArr.push(0);
      return aimArr;
  }
  for (var i = 0; i < arr.length; i++) {
      if (parseFloat(arr[i]) > target) {
          if (arr[i - 1] === target) {
              flag = true;
          }
          break;
      }
  }
  if (flag) {
      return aimArr;
  } else {
    aimArr.splice(i, 0, 0);
      return aimArr;
  }
 }


 normalDistributionData(x, aver, standDev) {
  if (standDev !== 0) {
    return ((1 / Math.sqrt(2 * Math.PI) * standDev) * Math.exp(-1 * ((x - aver) * (x - aver)) / (2 * standDev * standDev)));
  } else {
    return 0 ;
  }
}


ngOnDestroy() {
  clearInterval(this.timer);
  const abnormal_data = {
    num: null,
    type: 'none'
  };
  this.globals.AbnormalPot_subject.next(abnormal_data);
}

}
