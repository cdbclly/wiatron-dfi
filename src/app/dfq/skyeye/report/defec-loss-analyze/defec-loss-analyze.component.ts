import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DefectLossChartComponent } from '../shared/charts/defect-loss-chart/defect-loss-chart.component';

@Component({
  selector: 'app-defec-loss-analyze',
  templateUrl: './defec-loss-analyze.component.html',
  styleUrls: ['./defec-loss-analyze.component.scss']
})
export class DefecLossAnalyzeComponent implements OnInit {

  cur_site = 'WKS';
  project = 'fpyr';
  cur_model;
  cur_plant;
  cur_line;
  cur_section;
  cur_mdname;
  cur_item;
  timer;
  cur_date;
  @ViewChild('defectChart')
  defectChart: DefectLossChartComponent;
  constructor(private activatedRoute: ActivatedRoute) {
        this.activatedRoute.queryParams.subscribe(queryPars => {
          console.log(queryPars);
          this.cur_line = queryPars.line;
          this.cur_mdname = queryPars.item;
          this.cur_model = queryPars.model;
          this.cur_section = queryPars.stage;
          this.cur_plant = queryPars.plant;
          this.cur_site = queryPars.site;
        });
    }

  ngOnInit() {
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
    }
  }
  this.cur_date = new Date().getTime();
  }

  async queryOp (options) {
    this.cur_plant = options['cur_plant'];
    this.cur_site = options['cur_site'];
    this.defectChart.queryOp(options);
  }

  // async queryOp (options) {
  //   clearInterval(this.timer);
  //   this.cur_site = options['cur_site'];
  //   this.cur_plant = options['cur_plant'];
  //   this.cur_section = options['cur_section'];
  //   this.cur_line = options['cur_line'];
  //   this.cur_mdname = options['cur_mdname'];
  //   this.cur_model = options['cur_model'];
  //   this.cur_item = options['cur_item'];
  //   this.getDefectLossLine('defect-loss', this.dataX_array, this.data_loss, this.loss_itemArray, this.cur_model, this.cur_item);
  //   this.timer = setInterval(async() => {
  //     this.getDefectLossLine('defect-loss', this.dataX_array, this.data_loss, this.loss_itemArray, this.cur_model, this.cur_item);
  //   }, 30000);
  //   // this.options_line();
  // }

  // show_boxs(e) {
  //   this.isVisible = true;
  //   let index;
  //   if (e['data']['xAxis'] === undefined) {
  //     index = this.dataX_array.findIndex(x => { return x['value'] === e['name']});
  //   } else {
  //     index = e['data']['xAxis'];
  //   }
  //   // console.log(e, e['data']['xAxis']);
  //   this.detailTable_total = [];
  //   this.loss_itemArray[index].Details.forEach(detail => {
  //     const total = {
  //       mdname: detail['mdname'],
  //       tdname: detail['tdname'],
  //       result: this.loss_itemArray[index].failrate,
  //       detail: this.loss_itemArray[index].Details,
  //       num: detail['unitserialnumber'].length,
  //       model: this.loss_itemArray[index].modelName,
  //     line: this.loss_itemArray[ index].stationLine,
  //     stage: this.loss_itemArray[index].stationType,
  //     fixture: this.loss_itemArray[index].stationId,
  //     upper: this.loss_itemArray[index].upperlimit,
  //     lower: this.loss_itemArray[index].lowlimit
  //     };
  //     console.log(this.loss_itemArray[index].Details[0]);
  //     this.detailTable_total.push(total);
  //   });
  // }

  // showSubDetail(detail) {
  //   this.isVisible_1 = true;
  //   this.detailTable_loss = detail['detail'].filter(res => res['mdname'] === detail['mdname'] && res['tdname'] === detail['tdname']);
  //   this.defect_list = detail;
  // }

  // handleOk(): void {
  //   this.isVisible = false;
  // }

  // handleCancel(): void {
  //   this.isVisible = false;
  // }

  // show_boxs_1(e) {
  //   this.isVisible = true;
  //   this.detailTable_loss = this.loss_itemArray[e.dataIndex].Details;
  // }

  // handleOk_1(): void {
  //   this.isVisible_1 = false;
  // }

  // handleCancel_1(): void {
  //   this.isVisible_1 = false;
  // }

  // async getDefectLossLine(type: string, dataX_array: {}[], data_loss: number[], loss_itemArray: DefectLoss[], model, item) {
  //   const abnormalArr = [];
  //   const markLineX = [];
  //   // this.fixtureArr = [];
  //   loss_itemArray = [];
  //   const esURL = this.esService.getUrl(type);
  //   let limit_arr;
  //   const querys = this.esService.getDefectLoss(this.cur_site.toLowerCase(),
  //     this.cur_line.toUpperCase(),
  //     this.cur_mdname.toUpperCase(), this.cur_plant.toUpperCase(), model, item);
  //     console.log(querys);
  //   if (data_loss !== undefined) {
  //     data_loss.splice(0, data_loss.length);
  //  }
  //  if (dataX_array !== undefined) {
  //    dataX_array.splice(0, dataX_array.length);
  //  }
  //  if (loss_itemArray !== undefined) {
  //   loss_itemArray.splice(0, dataX_array.length);
  //  }
  // //  this.esService.postData(esURL, querys).subscribe(data => {
  //   const data = await this.esService.postData(esURL, querys).toPromise();
  //    console.log(data);
  //    for (let i = data['hits']['hits'].length - 1; i > -1; i--) {
  //      data_loss.push(data['hits']['hits'][i]._source.failrate);
  //      const date_item = this.datePipe.transform(data['hits']['hits'][i]._source.stopdate, 'MM/dd HH:mm');
  //      const item = new DefectLoss();
  //      item.modelName = data['hits']['hits'][i]._source.modelname;
  //      item.stationLine = data['hits']['hits'][i]._source.stationline;
  //      item.stationType = data['hits']['hits'][i]._source.stationtype;
  //      item.stationName = data['hits']['hits'][i]._source.stationname;
  //      item.stationId = data['hits']['hits'][i]._source.stationid;
  //      item.failrate = data['hits']['hits'][i]._source.failrate;
  //      item.lowlimit = data['hits']['hits'][i]._source.lowerlimit;
  //      item.upperlimit = data['hits']['hits'][i]._source.upperlimit;
  //      item.stopdate = data['hits']['hits'][i]._source.stopdate;
  //      item.Details = data['hits']['hits'][i]._source.detail;
  //     //  this.fixtureArr.push(item.stationId);
  //     if (item.upperlimit !== null && item.upperlimit < 300) {
  //       if (item.failrate > item.lowlimit || item.failrate === item.lowlimit) {
  //         abnormalArr.push({name: '不良率', symbol: 'circle', symbolSize: 20, value: item.failrate, yAxis: item.failrate, xAxis: data['hits']['hits'].length - i - 1, itemStyle: {normal:
  //           {color: 'transparent', borderColor: '#dc143c', label: {show: false}}}});
  //         dataX_array.push({value: date_item, textStyle: {color: '#dc143c'}});
  //       } else {
  //         dataX_array.push({value: date_item});
  //       }
  //     } else {
  //       dataX_array.push({value: date_item});
  //     }
  //      loss_itemArray.push(item);
  //    }
  //    dataX_array.push({value: ''});
  //   if (loss_itemArray[0] !== undefined && loss_itemArray[0].lowlimit > -300) {
  //     console.log(window.screen.width, window.screenX, window.screen.availWidth);
  //     limit_arr = {upper: loss_itemArray[0].upperlimit, lower: loss_itemArray[0].lowlimit};
  //     markLineX.push([{name: 'lower:' + loss_itemArray[0].lowlimit, yAxis: loss_itemArray[0].lowlimit, x: 70, label: {show: true}, itemStyle: {normal: {color: '#abc327'}}},
  //       {name: 'lower', yAxis: loss_itemArray[0].lowlimit, xAxis: dataX_array.length - 1, itemStyle: {normal: {color: '#abc327'}}}]
  //       );
  //   }
  //   if (loss_itemArray[0] !== undefined && loss_itemArray[0].upperlimit < 300) {
  //     markLineX.push([{name: 'upper:' + loss_itemArray[0].upperlimit, yAxis: loss_itemArray[0].upperlimit, x: 70, label: {show: true}, itemStyle: {normal: {color: '#dc143c'}}},
  //       {name: 'upper', yAxis: loss_itemArray[0].upperlimit, xAxis: dataX_array.length - 1, itemStyle: {normal: {color: '#dc143c'}}}]);
  //   }
  //    console.log(loss_itemArray);
  //    this.loss_itemArray = loss_itemArray;
  //   //  this.fixtureArr = loss_itemArray;
  //   // this.abnormalArr = abnormalArr;
  //   const abnormal_data = {
  //     num: abnormalArr.length,
  //     type: 'defect'
  //   };
  //   this.globals.AbnormalPot_subject.next(abnormal_data);
  //    this.options_line(abnormalArr, markLineX, limit_arr);
  // //  });
  // }

  // async options_line(abnormalArr, markLineX, limit_arr) {
  //   const stageMapping = await this.dataService.getStageMapping(this.cur_mdname, this.cur_plant, this.cur_site);
  //   let text;
  //   if (stageMapping.length > 0) {
  //     text = `不良率趨勢圖(${stageMapping[0]['chineseContrast']})`;
  //   } else {
  //     text = '不良率趨勢圖';
  //   }
  //   this.line_chart = {
  //     title : {
  //       text: `${text}`,
  //       x: 'left',
  //       textStyle: {
  //         color: 'black',
  //       }
  //     },
  //     grid: {
  //       y: 70,
  //       y2: 30,
  //       x: 70
  //     },
  //     tooltip: {
  //       trigger: 'item',
  //       axisPointer: {
  //           type: 'shadow'
  //       },
  //       backgroundColor: 'rgba(255,255,255,0.7)',
  //       textStyle: {
  //         color: 'black'
  //       },
  //       formatter: 'value: {c}%'
  //   },
  //   backgroundColor: 'rgba(255,255,255,0.7)',
  //   calculable : true,
  //     xAxis: {
  //         type: 'category',

  //         data: this.dataX_array,
  //         axisLine: {
  //           lineStyle: {
  //             width: 1,
  //             color: 'black'
  //           }
  //         },
  //         axisLabel: {
  //           interval: 0
  //         }
  //     },
  //     yAxis: {
  //         type: 'value',
  //         splitLine: {
  //           show: true
  //         },
  //         axisLine: {
  //           lineStyle: {
  //             width: 1,
  //             color: 'black',
  //           }
  //         },
  //         axisLabel: {
  //           formatter: '{value}%'
  //         },
  //         max: function(value) {
  //           // console.log(limit_arr);
  //           if (limit_arr !== undefined && limit_arr.upper > value.max) {
  //             return limit_arr.upper === undefined ? (value.max + 0.3).toFixed(2) : limit_arr.upper;
  //           } else {
  //             return (value.max + 0.3).toFixed(2);
  //           }
  //         },
  //         min: function(value) {
  //           // console.log(limit_arr);
  //           if (limit_arr !== undefined && limit_arr.lower < value.min) {
  //             return limit_arr.lower === undefined ? value.min : limit_arr.lower;
  //           } else {
  //             return value.min;
  //           }
  //         }
  //     },
  //     series: [{
  //         name: 'defect loss',
  //         data: this.data_loss,
  //         type: 'line',
  //         itemStyle: {
  //           normal: {
  //              borderColor: 'rgb(60,144,247)',
  //              borderWidth: 2,
  //              label: {
  //               show: true,
  //               position: 'top',
  //               color: 'black',
  //               formatter: '{c}%'
  //           }
  //           }
  //         },
  //         lineStyle: {
  //           normal: {
  //             color: 'rgb(60,144,247)'
  //           }
  //         },
  //         markPoint : {
  //           data: abnormalArr
  //         },
  //         markLine: {
  //           silent: true,
  //           data: markLineX
  //         }
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
