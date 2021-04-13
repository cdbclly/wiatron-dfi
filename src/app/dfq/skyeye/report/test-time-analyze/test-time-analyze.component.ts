import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { TestTimes, Detail, Limit } from '../../model/TestTime';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { DatePipe } from '@angular/common';
import { GlobalService } from '@service/skyeye/global.service';
import { ActivatedRoute } from '@angular/router';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { TestTimeChartComponent } from '../shared/charts/test-time-chart/test-time-chart.component';

@Component({
  selector: 'app-test-time-analyze',
  templateUrl: './test-time-analyze.component.html',
  styleUrls: ['./test-time-analyze.component.scss']
})
export class TestTimeAnalyzeComponent implements OnInit {

  dataX_array: string[] = [];
  data_testTime = [];
  testT_itemArray: TestTimes[] = [];
  detailTable_test: {}[] = [];
  detailTable_sub: {}[] = [];
  data_arr: number[] = [];
  data_map: Map<string, {}[]>;
  limit_arr: Limit;
  scatter_chart;
  cur_site = 'WKS';
  project = 'test time';
  cur_plant;
  cur_line;
  cur_section;
  cur_mdname;
  cur_model;
  cur_item;
  timer;
  modelArr = [];
  isVisible = false;
  footer = null;
  cancelOK = false;
  isVisible_1 = false;
  footer_1 = null;
  cancelOK_1 = false;
  cur_date;
  cur_upn;
  @ViewChild('testTimeChart')
  testTimeChart: TestTimeChartComponent;
  constructor(private esService: EsDataServiceService, private datePipe: DatePipe, private globals: GlobalService,
    private activatedRoute: ActivatedRoute, private dataService: LineDataServiceService) {
      this.activatedRoute.queryParams.subscribe(queryPars => {
        console.log(queryPars);
        this.cur_line = queryPars.line;
        this.cur_mdname = queryPars.item;
        this.cur_section = queryPars.stage;
        this.cur_plant = queryPars.plant;
        this.cur_site = queryPars.site;
        // 添加 架构 栏位
        this.cur_upn = queryPars.upn;
      });
    }

  ngOnInit() {
    // if (sessionStorage.getItem('aly_plant') !== null && sessionStorage.getItem('aly_section') !== null) {
    //   this.cur_site = sessionStorage.getItem('aly_site');
    //   this.cur_plant = sessionStorage.getItem('aly_plant');
    //   this.cur_section = sessionStorage.getItem('aly_section');
    //   this.cur_line = sessionStorage.getItem('aly_line');
    //   this.cur_mdname = sessionStorage.getItem('aly_mdname');
    // }
    if ((this.cur_plant !== undefined && this.cur_line !== undefined && this.cur_mdname !== undefined && this.cur_section !== undefined)) {
      sessionStorage.setItem('aly_site', this.cur_site);
      sessionStorage.setItem('aly_plant', this.cur_plant);
      sessionStorage.setItem('aly_section', this.cur_section);
      sessionStorage.setItem('aly_line', this.cur_line);
      sessionStorage.setItem('aly_mdname', this.cur_mdname);
  } else {
    if (sessionStorage.getItem('aly_plant') !== null && sessionStorage.getItem('aly_section') !== null) {
      this.cur_site = sessionStorage.getItem('aly_site');
      this.cur_plant = sessionStorage.getItem('aly_plant');
      this.cur_section = sessionStorage.getItem('aly_section');
      this.cur_line = sessionStorage.getItem('aly_line');
      this.cur_mdname = sessionStorage.getItem('aly_mdname');
    // this.queryOp(options);
    }
  }
  this.cur_date = new Date().getTime();
  }

  async queryOp (options) {
    this.cur_plant = options['cur_plant'];
    this.testTimeChart.queryOp(options);
    console.log('options ------- 数据 \n', options);
  }

  // async queryOp (options) {
  //   console.log(options);
  //   clearInterval(this.timer);
  //   this.cur_site = options['cur_site'];
  //   this.cur_plant = options['cur_plant'];
  //   this.cur_section = options['cur_section'];
  //   this.cur_line = options['cur_line'];
  //   this.cur_mdname = options['cur_mdname'];
  //   this.cur_model = options['cur_model'];
  //   this.cur_item = options['cur_item'];
  //   console.log(this.cur_model);
  //   this.getTestTimeScatter('test-time', this.dataX_array, this.data_testTime, this.testT_itemArray, this.data_map, this.limit_arr,
  //   this.data_arr, this.cur_model, this.cur_item);
  //   this.timer = setInterval(async() => {
  //     this.getTestTimeScatter('test-time', this.dataX_array, this.data_testTime, this.testT_itemArray, this.data_map, this.limit_arr,
  //     this.data_arr, this.cur_model, this.cur_item);
  //   }, 30000);
  //   if (this.dataX_array.length !== 0) {
  //     this.options_scatter(this.limit_arr, this.dataX_array);
  //   }
  //   console.log(this.limit_arr);
  //   console.log(this.dataX_array);
  // }

  // async getTestTimeScatter(type: string, dataX_array: string[], data_testTime: any[], testT_itemArray: TestTimes[],
  //   data_map: Map<string, {}[]>, limit_arr: Limit, data_arr: number[], cur_model, cur_item) {
  //   let abnormal_count = 0;
  //   const esURL = this.esService.getUrl(type);
  //   const cur_date = new Date();
  //   this.modelArr = [];
  //   const querys = this.esService.getTestTimeQuerys(this.cur_site.toLowerCase(),
  //   this.cur_line.toUpperCase(),
  //   this.cur_mdname.toUpperCase(), this.cur_plant.toUpperCase(),
  //   cur_date.getTime() - 18000000, this.cur_model, cur_item);
  //   console.log(querys);
  //   if (data_testTime !== undefined) {
  //     data_testTime.splice(0, data_testTime.length);
  //   }
  //   if (dataX_array !== undefined) {
  //     dataX_array.splice(0, dataX_array.length);
  //   }
  //   if (testT_itemArray !== undefined) {
  //     testT_itemArray.splice(0, testT_itemArray.length);
  //   }
  //   if (data_map !== undefined) {
  //     data_map.clear();
  //   } else {
  //     data_map = new Map<string, {}[]>();
  //   }
  //   if (limit_arr !== undefined) {
  //     limit_arr = undefined;
  //   }
  //   if (data_arr !== undefined) {
  //     data_arr.splice(0, data_arr.length);
  //   }
  //   //  await this.esService.postData(esURL, querys).subscribe(data => {
  //     let data;
  //     try {
  //       data = await this.esService.postData(esURL, querys).toPromise();
  //       console.log(data, querys);
  //    for (let i = 0; i < data['aggregations']['sales_over_time']['buckets'].length; i++) {
  //      // 'HH:mm',只有大写HH才是24小时制，hh是12小时制
  //     const date_item = this.datePipe.transform(data['aggregations']['sales_over_time']['buckets'][i].key, 'MM/dd HH:mm');
  //     dataX_array.push(date_item);
  //     data['aggregations']['sales_over_time']['buckets'][i]['TopHits']['hits']['hits'].forEach(element => {
  //       limit_arr = new Limit();
  //       limit_arr.lowlimit = element._source.lowerlimit;
  //       limit_arr.meanlimit = element._source.mean;
  //       this.modelArr.push(element._source.modelname);
  //       limit_arr.upperlimit = element._source.upperlimit;
  //       element._source.detail.forEach(detail => {
  //         const arr = [];
  //         const item = [];
  //         data_arr.push(detail.testcycletime);
  //         arr.push(date_item);
  //         arr.push(detail.testcycletime);
  //         data_testTime.push(arr);
  //         let map_value: {}[] = data_map.get(date_item + detail.testcycletime.toString());
  //         if (map_value === undefined) {
  //           map_value = [];
  //         }
  //         const det = {
  //           test_long: detail.testcycletime,
  //           fix: element._source.stationid,
  //           model: element._source.modelname,
  //           line: element._source.stationline,
  //           station: element._source.stationtype,
  //           upper: element._source.upperlimit,
  //           mean: element._source.mean,
  //           lower: element._source.lowerlimit,
  //           test_time: detail.stopdate,
  //           unitNum: detail.unitserialnumber
  //         };
  //         map_value.push(det);
  //         data_map.set(date_item + detail.testcycletime.toString() , map_value);
  //       });
  //     });
  //    }
  //    data_map.forEach((value, key) => {
  //      console.log(value);
  //      if (value[0]['test_long'] > value[0]['upper'] || value[0]['test_long'] < value[0]['lower']) {
  //        abnormal_count ++;
  //      }
  //    });
  //    const abnormal_data = {
  //     num: abnormal_count,
  //     type: 'time'
  //   };
  //    this.globals.AbnormalPot_subject.next(abnormal_data);
  //    console.log(abnormal_count);
  //    this.data_map = data_map;
  //    this.limit_arr = limit_arr;
  //   //  this.modelArr = Array.from(new Set(this.modelArr)); // 去重
  //   //  console.log(this.modelArr);
  //   //  console.log(data_testTime);
  //   //  console.log(data_arr);
  //   // if (this.limit_arr) {
  //     dataX_array.push('');
  //     this.options_scatter(this.limit_arr, dataX_array);
  //   // }
  //   // });
  //   this.modelArr = Array.from(new Set(this.modelArr)); // 去重
  //   console.log(this.modelArr);
  //     } catch (e) {
  //       return;
  //     }
  // }


  // show_boxs(e) {
  //   // debugger;
  //   if (e.value !== undefined && e.value[0] !== undefined) {
  //     this.isVisible = true;
  //     const key = e.value[0] + e.value[1];
  //     const arr: {}[] = this.data_map.get(key);
  //     const total = {
  //       key: key,
  //       fix: arr[0]['fix'],
  //       long: arr[0]['test_long'],
  //       num: arr.length
  //     };
  //     this.detailTable_test = [total];
  //   }
  // }

  // showSubDetail(key) {
  //   this.isVisible_1 = true;
  //   const arr: {}[] = this.data_map.get(key);
  //   this.detailTable_sub = arr;

  // }

  // handleOk(): void {
  //   this.isVisible = false;
  // }

  // handleCancel(): void {
  //   this.isVisible = false;
  // }

  // handleOk_1(): void {
  //   this.isVisible_1 = false;
  // }

  // handleCancel_1(): void {
  //   this.isVisible_1 = false;
  // }

  // async options_scatter(limit_arr, dataX_array) {
  //   let max;
  //   let min;
  //   let mean;
  //   const stageMapping = await this.dataService.getStageMapping(this.cur_mdname, this.cur_plant, this.cur_site);
  //   if (this.data_arr.length > 0) {
  //      max = this.data_arr.reduce((a, b) => a > b ? a : b) + 1;
  //      min = this.data_arr.reduce((a, b) => a < b ? a : b) - 1;
  //      let sum = 0;
  //      this.data_arr.forEach(element => {
  //        sum = sum + element;
  //      });
  //      mean = sum / this.data_arr.length;
  //   }
  //   let text;
  //   if (stageMapping.length > 0) {
  //     text = `測試時間趨勢圖(${stageMapping[0]['chineseContrast']})`;
  //   } else {
  //     text = '測試時間趨勢圖';
  //   }
  //   this.scatter_chart = {
  //     title : {
  //       text: `${text}`,
  //       x: 'left',
  //       textStyle: {
  //         color: 'black',
  //       }
  //     },
  //     grid: {
  //       top: 45,
  //       left: 60
  //     },
  //     backgroundColor: 'rgba(255,255,255,0.7)',
  //     xAxis: {
  //       data: this.dataX_array,
  //       splitLine: {
  //         show: true
  //       },
  //       axisLine: {
  //         lineStyle: {
  //           width: 1,
  //           color: 'black'
  //         }
  //       },
  //         axisLabel: {
  //           interval: 0
  //         },
  //       boundaryGap: false,
  //       min: -1
  //     },
  //     yAxis: {
  //       axisLine: {
  //         lineStyle: {
  //           width: 1,
  //           color: 'black'
  //         }
  //       },
  //       min: function(value) {
  //         if (limit_arr !== undefined && limit_arr.lowlimit < value.min) {
  //           return limit_arr.lowlimit === undefined ? (value.min - 5).toFixed(0) : limit_arr.lowlimit;
  //         } else {
  //           return (value.min + 1).toFixed(0);
  //         }
  //       },
  //       max: function(value) {
  //         console.log(limit_arr);
  //         if (limit_arr !== undefined && limit_arr.upperlimit > value.max) {
  //           return limit_arr.upperlimit === undefined ? (value.max + 1).toFixed(0) : limit_arr.upperlimit;
  //         } else {
  //           return (value.max + 1).toFixed(0);
  //         }
  //       }
  //     },
  //     series: [{
  //         symbolSize: 20,
  //         symbol: 'diamond',
  //         data: this.data_testTime,
  //         itemStyle: {
  //           normal: {
  //             color: 'rgb(60,144,247)'
  //           }
  //         },
  //         type: 'scatter',
  //         markLine : {
  //           clickable: false,
  //           silent: true,
  //           data : [[
  //             { name : 'upper',
  //             xAxis: -1, yAxis: this.limit_arr === undefined || this.limit_arr.upperlimit === undefined ? 0 : this.limit_arr.upperlimit, lineStyle: {
  //               normal: {
  //                 color: '#00bd56',
  //                 width: 1
  //               }
  //             }},
  //             { name : 'upper', xAxis: dataX_array.length - 1, yAxis: this.limit_arr === undefined || this.limit_arr.upperlimit === undefined ? 0 : this.limit_arr.upperlimit,
  //           }
  //          ],
  //          [
  //           { name : 'mean',
  //           xAxis: -1, yAxis: this.limit_arr === undefined || this.limit_arr.meanlimit === undefined ? 0 : this.limit_arr.meanlimit},
  //           { name : 'mean', xAxis: dataX_array.length - 1, yAxis: this.limit_arr === undefined || this.limit_arr.meanlimit === undefined ? 0 : this.limit_arr.meanlimit,
  //           lineStyle: {
  //             normal: {
  //               color: '#ffd700',
  //               width: 1
  //             }
  //           }}
  //          ],
  //          [
  //           { name : 'lower', xAxis: -1, yAxis: this.limit_arr === undefined || this.limit_arr.lowlimit === undefined ? 0 : this.limit_arr.lowlimit,
  //           lineStyle: {
  //             normal: {
  //               color: '#dc143c',
  //               width: 1
  //             }
  //           }},
  //           { name : 'lower', x: window.screen.availWidth * 0.76, yAxis: this.limit_arr === undefined || this.limit_arr.lowlimit === undefined ? 0 : this.limit_arr.lowlimit}
  //          ]]
  //        }
  //     }]
  // };
  // }

  // ngOnDestroy() {
  //   clearInterval(this.timer);
  //   const abnormal_data = {
  //     num: null,
  //     type: 'none'
  //   };
  //   this.globals.AbnormalPot_subject.next(abnormal_data);
  // }

}
