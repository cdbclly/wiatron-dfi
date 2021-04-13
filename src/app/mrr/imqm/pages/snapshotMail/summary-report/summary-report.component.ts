import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SummaryReportService } from './summary-report.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.scss']
})
export class SummaryReportComponent implements OnInit {

  materialProductYRRawData: any[] = []; // 供應商材料Yield Rate
  materialProductYRBarData; // 組裝 供應商材料Yield Rate echart的資料
  materialPDDRRawData: any[] = [];  // 緯創材料D/R
  materialPDDRBarData: {}; // 組裝 緯創材料D/R echart的資料
  materialNGRawData: any[] = []; // PD材料NG追溯
  materialNGBarData: {}; // PD材料NG追溯 echart
  materialAlertRawData: any[] = [];  // 材料廠商端異常/預警看板
  materialAlertBarData: {}; // 組裝 材料廠商端異常/預警看板 echart的資料
  defectLossAnalyze: {};  // 分析不良資料
  materialEarlyRawData;

  cur_site;
  cur_factory;
  cur_productCate;
  cur_customer;
  cur_searchBy;
  cur_model;
  cur_factoryUser;
  cur_proName;
  cur_materialNo;
  date_from;
  date_to;

  title; // mail推送标题
  subject;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _service: SummaryReportService,
    private datePipe: DatePipe
  ) {
    this.activatedRoute.queryParams.subscribe(queryPars => {
      console.log(queryPars);
      this.cur_site = queryPars['cur_site'];
      this.cur_factory = queryPars['cur_plant'];
      this.cur_productCate = queryPars['cur_productCate'];
      this.cur_customer = queryPars['cur_customer'];
      this.cur_searchBy = queryPars['cur_searchBy'];
      this.cur_model = queryPars['cur_model'];
      this.cur_factoryUser = queryPars['cur_factoryUser'];
      this.cur_proName = queryPars['cur_proName'];
      this.cur_materialNo = queryPars['cur_materialNo'];
      this.date_from = queryPars['date_from'];
      this.date_to = queryPars['date_to'];
      this.subject = queryPars['subject'];
    });
  }

  async ngOnInit() {
    this.title = this.cur_factory + '  ' + this.subject + '(Top機種/Top廠商)' + '     ' + this.datePipe.transform(this.date_from, 'yyyy-MM-dd') + '——' +
    this.datePipe.transform(this.date_to, 'yyyy-MM-dd');
    const faseData = await this._service.getBoardData(this.cur_searchBy, {site: this.cur_site, plant: this.cur_factory, customer: this.cur_customer, product: this.cur_productCate,
      model: this.cur_model, vendor: this.cur_factoryUser, productName: this.cur_proName, partNumber: this.cur_materialNo
     }, Math.ceil(this.date_from / 1000), Math.ceil(this.date_to / 1000));
     console.log(faseData);
    this.materialProductYRRawData = faseData['yrTopRate'];
    this.materialPDDRRawData = faseData['pdTopRate'];
    this.materialAlertRawData = faseData['abnormalList'];
    this.materialNGRawData = faseData['traceBackList'];
    this.materialEarlyRawData = faseData['earlyWarnList'];
    // this.defectLossAnalyze = faseData['defectAnanlyze'];
    this.materialProductYRBarData = await this.wrapMaterialYRPDChar(this.materialProductYRRawData, '供應商材料Yield Rate', 'Y/R', '100%');
    this.materialPDDRBarData = await this.wrapMaterialDRPDChar(this.materialPDDRRawData, '緯創材料D/R', 'D/R', '100%');
    this.materialAlertBarData = await this.wrapmaterialAlertChar(this.materialAlertRawData, this.materialEarlyRawData, '供應商Over Spec/預警看板', ['Over Spec次數', '預警次數'], '100%');
    this.materialNGBarData = await this.wrapmaterialNGChar(this.materialNGRawData, '緯創材料NG追溯', ['close', 'ongoing', 'open'], '100%');
    // this.materialEarlyRawData = faseData['earlyWarnList'];
  }

 // 顯示主頁'供應商材料Yield Rate 圖'和 緯創材料D/R
 async wrapMaterialYRPDChar(rowData, title, legend_name, char_width) {
  const data_x = Array(10).fill(''); const data_y = []; const target = [];
  let barData = {};
  const data_arr = []; // bar图图顶数据
  let yrTarget;
  // debugger;
  const yrTargetDef = await this._service.getYrTarget(this.cur_site, this.cur_factory, '*', '*');
  if (rowData) {
    for (let i = 0; i < rowData.length; i++) {
      const res = rowData[i];
      if (this.cur_searchBy === 'model') {
         yrTarget = await this._service.getYrTarget(this.cur_site, this.cur_factory, res['key'], '*');
      }
      if (this.cur_searchBy === 'partNumber') {
        yrTarget = await this._service.getYrTarget(this.cur_site, this.cur_factory, this.cur_model ? this.cur_model : '*', res['key']);
      }
      if (this.cur_searchBy === 'vendor') {
        yrTarget = await this._service.getYrTarget(this.cur_site, this.cur_factory, '*', '*');
      }
      res['target'] = yrTarget[0] ? yrTarget[0]['yrTarget'] : yrTargetDef[0]['yrTarget'];
      res['percent'] = parseFloat(res['percent']);
    // data_x.push(res['key']);
    if (this.cur_searchBy === 'partNumber') {
      data_x[i] = rowData[i]['key'];
      if (rowData[i]['key'].includes('.') && data_x[i].split('.').length === 3) {
        data_x[i] = data_x[i].split('.');
        data_x[i].splice(0, 1);
        data_x[i] = data_x[i].join(',');
        data_x[i] = data_x[i].replace(',', '.');
      }
    } else {
      data_x[i] = rowData[i]['key'];
    }
    let series_data;
    if (res['percent'] < res['target']) {
      data_arr.push({value: res['percent'], itemStyle: {normal: {color: '#fb928e'}}});
      series_data = {
        value: res['percent'],
        itemStyle: {
          normal: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: '#fe0c01',
              }, {
                offset: 0.5,
                color: '#fb928e'
              }, {
                offset: 1,
                color: '#fe0c01'
              }],
              globalCoord: false
          },
          label: {
            show: res['percent'] !== 0 ? true : false,
            formatter: '{c}%',
            position: 'inside',
                       textStyle: {
                           fontSize: 12,
                           color: 'white'
                       }
           }
          }
        }
      };
    } else {
      series_data = {
        value: res['percent'],
        itemStyle: {
          normal: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: '#038113',
              }, {
                offset: 0.5,
                color: '#60d26e'
              }, {
                offset: 1,
                color: '#038113'
              }],
              globalCoord: false
          },
          label: {
            show: res['percent'] !== 0 ? true : false,
            formatter: '{c}%',
            position: 'inside',
                       textStyle: {
                           fontSize: 12,
                           color: 'white'
                       }
           }
          }
        }
      };
    }
    target.push(res['target']);
    data_y.push(series_data);
  }
  }

  barData = {
    data_x: data_x,
    data_y: data_y,
    target: target,
    target_name: 'target',
    title: title,
    legend: legend_name,
    width: char_width,
    height: '14vw',
    search_type: this.cur_searchBy,
    data_arr: data_arr
  };
  return barData;
}

async wrapMaterialDRPDChar(rowData, title, legend_name, char_width) {
  const data_x = Array(10).fill('');  const data_y = []; const target = [];
  let barData = {};
  const data_arr = [];
  for (let i = 0; i < rowData.length; i++) {
    // 獲取target預設值
    rowData[i]['percent'] = parseFloat(rowData[i]['percent']);
    // data_x.push(res['key']);
    if (this.cur_searchBy === 'partNumber') {
      const info = await this._service.getSelectInfoByPartNo(rowData[i]['key']);
      info[0]['count'] = rowData[i]['count'];
      data_x[i] = rowData[i]['key'];
      if (rowData[i]['key'].includes('.') && data_x[i].split('.').length === 3) {
        data_x[i] = data_x[i].split('.');
        data_x[i].splice(0, 1);
        data_x[i] = data_x[i].join(',');
        data_x[i] = data_x[i].replace(',', '.');
      }
    } else {
      data_x[i] = rowData[i]['key'];
    }
    data_arr.push({value: rowData[i]['percent'], itemStyle: {normal: {color: '#60d26e'}}});
    let series_data;
      series_data = {
        value: rowData[i]['percent'],
        itemStyle: {
          normal: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: '#038113',
              }, {
                offset: 0.5,
                color: '#60d26e'
              }, {
                offset: 1,
                color: '#038113'
              }],
              globalCoord: false
          },
          label: {
            show: rowData[i]['percent'] !== 0 ? true : false,
            formatter: '{c}%',
            position: 'inside',
                       textStyle: {
                           fontSize: 12,
                           color: 'white'
                       }
           }
          }
        }
      };
    data_y.push(series_data);
  }

  barData = {
    data_x: data_x,
    data_y: data_y,
    target: target,
    target_name: 'target',
    title: title,
    legend: legend_name,
    width: char_width,
    height: '14vw',
    search_type: 'vendor',
    data_arr: data_arr,
    mainColor: '#038113'
  };
  return barData;
}

// 顯示首頁材料廠商端異常/預警看板
async wrapmaterialAlertChar(rowData, earlyData, title, legend_name, char_width) {
  const data_x = Array(10).fill(''); const data_alert = []; const data_abnormal = []; const target = [];
  const series = [];
  let barData = {};
   // 存放柱形图图顶的资料
   const abnormalTops = []; const alertTops = [];
  // debugger;
  if (rowData) {
    for (let i = 0; i < rowData.length; i ++) {
      // debugger;
      abnormalTops.push({value: rowData[i]['count'],
    itemStyle: {
      normal: {
        color: '#fb928e'
      }
  }});
  if (this.cur_searchBy === 'partNumber') {
    data_x[i] = rowData[i]['name'];
    if (rowData[i]['name'].includes('.') && data_x[i].split('.').length === 3) {
      data_x[i] = data_x[i].split('.');
      data_x[i].splice(0, 1);
      data_x[i] = data_x[i].join(',');
      data_x[i] = data_x[i].replace(',', '.');
    }
  } else {
    data_x[i] = rowData[i]['name'];
  }
      // data_x.push(rowData[i]['name']);
      const series_abnormal = {
        value: rowData[i]['count'],
        itemStyle: {
          normal: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: '#fe0c01',
              }, {
                offset: 0.5,
                color: '#fb928e'
              }, {
                offset: 1,
                color: '#fe0c01'
              }],
              globalCoord: false
          },
          label: {
            show: rowData[i]['count'] !== 0 ? true : false,
            position: 'inside',
                       textStyle: {
                           fontSize: 12,
                           color: 'white'
                       }
           }
          }
        }
      };
      const earlys = await this._service.getEarlyListByVendor(this.cur_site, this.cur_factory, rowData[i]['name'], Math.ceil(this.date_from / 1000), Math.ceil(this.date_to / 1000));
      alertTops.push({value: earlys['result'].length > 0 ? earlys['result'][0]['count'] : 0,
        itemStyle: {
          normal: {
            color: '#FFC409'
          }
      }});
      data_alert.push({
        value: earlys['result'].length > 0 ? earlys['result'][0]['count'] : 0,
        itemStyle: {
          normal: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: '#DEA900',
              }, {
                offset: 0.5,
                color: '#FFC409'
              }, {
                offset: 1,
                color: '#DEA900'
              }],
              globalCoord: false
          },
          label: {
            show: earlys['result'].length > 0 ? true : false,
            position: 'inside',
                       textStyle: {
                           fontSize: 12,
                           color: 'white'
                       }
           }
          }
        }
      });
      data_abnormal.push(series_abnormal);
    }
  }
  // if (earlyData) {
  //   earlyData.map(res => {
  //     const series_alert = {
  //       value: res['count'],
  //       itemStyle: {
  //         normal: {
  //           color: '#FFE500'
  //         }
  //       }
  //     };
  //     data_alert.push(series_alert);
  //   });
  // }
  const abnormal = {
    name: legend_name[0],
    type: 'bar',
    data: data_abnormal,
    barWidth: '40%',
    z: 12,
    tooltip : {
      backgroundColor: 'rgba(255,255,255,0.7)',
      textStyle: {
        color: 'black'
    }
    },
    itemStyle: {
      normal: {
  color: {
    type: 'bar',
    colorStops: [{
      offset: 0,
      color: '#fe0c01',
    }, {
      offset: 0.5,
      color: '#fb928e'
    }, {
      offset: 1,
      color: '#fe0c01'
    }],
    globalCoord: false
}
      }
    }
  };
  const alert = {
    name: legend_name[1],
    type: 'bar',
    data: data_alert,
    barWidth: '40%',
    z: 12,
    tooltip : {
      backgroundColor: 'rgba(255,255,255,0.7)',
      textStyle: {
        color: 'black'
    }
    },
    itemStyle: {
      normal: {
  color: {
    type: 'bar',
    colorStops: [{
      offset: 0,
      color: '#DEA900',
    }, {
      offset: 0.5,
      color: '#FFC409'
    }, {
      offset: 1,
      color: '#DEA900'
    }],
    globalCoord: false
}
      }
    }
  };
  series.push(abnormal);
  series.push(alert);
  series.push({
    name: legend_name[0],
    type: 'pictorialBar',
    symbolSize: ['50%', 10],
    symbolOffset: ['-65%', -5],
    symbolPosition: 'end',
    silent: true,
    label: {
        normal: {
            show: false,
            position: 'top',
            formatter: '{c}%'
        }
    },
    data: abnormalTops,
    tooltip: {
      showContent: false
    }
});
series.push({
  name: legend_name[1],
  type: 'pictorialBar',
  symbolSize: ['50%', 10],
  symbolOffset: ['65%', -5],
  symbolPosition: 'end',
  silent: true,
  data: alertTops,
  tooltip: {
    showContent: false
  }
});
  barData = {
    data_x: data_x,
    title: title,
    legend: legend_name,
    width: char_width,
    height: '14vw',
    series: series
  };
  return barData;
}

 // 顯示首頁PD材料PD追溯
 async wrapmaterialNGChar(rowData, title, legend_name, char_width) {
  const dataX = Array(10).fill(''); const dataNg = []; const close = []; const onGoing = []; const open = [];
 const data_arr = []; // 总数
 const data_close = []; // close的数量
 const data_onGoing = [];
 if (rowData) {
  for (let i = 0; i < rowData.length; i++) {
    // dataX.push(res['name']);
    if (this.cur_searchBy === 'partNumber') {
      const info = await this._service.getSelectInfoByPartNo(rowData[i]['name']);
      dataX[i] = rowData[i]['name'];
      if (rowData[i]['name'].includes('.') && dataX[i].split('.').length === 3) {
        dataX[i] = dataX[i].split('.');
        dataX[i].splice(0, 1);
        dataX[i] = dataX[i].join(',');
        dataX[i] = dataX[i].replace(',', '.');
      }
    } else {
      dataX[i] = rowData[i]['name'];
    }
    data_arr.push({value: rowData[i]['close'] + rowData[i]['ongoing'] + rowData[i]['open'], itemStyle: {normal: {color:
      rowData[i]['open'] !== 0 ? '#fb928e' : rowData[i]['ongoing'] !== 0 ? '#FFC409' : '#60d26e'
    }}});
    if (rowData[i]['close'] !== 0) {
      data_close.push({value: rowData[i]['close'], itemStyle: {normal: {color: '#FFC409'}}});
    }
    if (rowData[i]['ongoing'] !== 0 ) {
      data_onGoing.push({value: rowData[i]['close'] + rowData[i]['ongoing'], itemStyle: {normal: {
  color: {
    type: 'bar',
    colorStops: [{
      offset: 0,
      color: '#fe0c01',
    }, {
      offset: 0.5,
      color: '#fb928e'
    }, {
      offset: 1,
      color: '#fe0c01'
    }],
    globalCoord: false
}
      }}});
    }
    close.push({value: rowData[i]['close'], itemStyle: {normal: {label: {
      show: rowData[i]['close'] !== 0 ? true : false,
      position: 'inside',
                 textStyle: {
                     fontSize: 12,
                     color: 'white'
                 }
     }}} });
    onGoing.push({value: rowData[i]['ongoing'], itemStyle: {normal: {label: {show: rowData[i]['ongoing'] !== 0 ? true : false,
    position: 'inside',
                 textStyle: {
                     fontSize: 12,
                     color: 'white'
                 }
   }}} });
    open.push({value: rowData[i]['open'], itemStyle: {normal: {label: {show: rowData[i]['open'] !== 0 ? true : false,
    position: 'inside',
                 textStyle: {
                     fontSize: 12,
                     color: 'white'
                 }
   }}} });
  }
 }
  const seriesClose = {
    name: 'close',
    type: 'bar',
    stack: 'PDNG',
    barWidth: '50%',
    z: 12,
    itemStyle: {
      normal: {
        color: {
          type: 'bar',
          colorStops: [{
            offset: 0,
            color: '#038113',
          }, {
            offset: 0.5,
            color: '#60d26e'
          }, {
            offset: 1,
            color: '#038113'
          }],
          globalCoord: false
      }
    }
    },
    data: close,
    tooltip : {
      backgroundColor: 'rgba(255,255,255,0.7)',
      textStyle: {
        color: 'black'
    }
    }
  };
  dataNg.push(seriesClose);
  const seriesOngoing = {
    name: 'ongoing',
    type: 'bar',
    stack: 'PDNG',
    barWidth: '50%',
    z: 12,
    itemStyle: {
      normal: {
        color: {
          type: 'bar',
          colorStops: [{
            offset: 0,
            color: '#DEA900'
          }, {
            offset: 0.5,
            color: '#FFC409'
          }, {
            offset: 1,
            color: '#DEA900'
          }],
          globalCoord: false
      }
    }
  },
    data: onGoing,
    tooltip : {
      backgroundColor: 'rgba(255,255,255,0.7)',
      textStyle: {
        color: 'black'
    }
    }
  };
  dataNg.push(seriesOngoing);
  const seriesOpen = {
    name: 'open',
    type: 'bar',
    stack: 'PDNG',
    barWidth: '50%',
    z: 12,
    itemStyle: {
      normal: {
          color: {
            type: 'bar',
            colorStops: [{
              offset: 0,
              color: '#fe0c01',
            }, {
              offset: 0.5,
              color: '#fb928e'
            }, {
              offset: 1,
              color: '#fe0c01'
            }],
            globalCoord: false
        }
      }
  },
    data: open,
    tooltip : {
      backgroundColor: 'rgba(255,255,255,0.7)',
      textStyle: {
        color: 'black'
    }
    }
  };
  dataNg.push(seriesOpen);
  dataNg.push(
    {
      name: '',
      type: 'pictorialBar',
      stack: 'PDNG',
      symbolSize: ['62%', 10],
      symbolOffset: [0, -5],
      symbolPosition: 'end',
      silent: true,
      label: {
          normal: {
              show: false,
              position: 'top',
              formatter: '{c}%'
          }
      },
      data: data_arr,
      tooltip: {
        showContent: false
      }
    }
  );
  dataNg.push(
    {
      name: '',
      type: 'pictorialBar',
      tooltip: {
        showContent: false
      },
      stack: 'PDNG',
      symbolSize: ['62%', 10],
      symbolOffset: [0, -5],
      symbolPosition: 'end',
      silent: true,
      label: {
          normal: {
              show: false,
              position: 'top',
              formatter: '{c}%'
          }
      },
      data: data_close
    }
  );
  dataNg.push(
    {
      name: '',
      type: 'pictorialBar',
      stack: 'PDNG',
      symbolSize: ['62%', 10],
      symbolOffset: [0, -5],
      symbolPosition: 'end',
      silent: true,
      label: {
          normal: {
              show: false,
              position: 'top',
              formatter: '{c}%'
          }
      },
      data: data_onGoing,
      tooltip: {
        showContent: false
      }
    }
  );
  const barData = {
    title: title,
    legend: legend_name,
    data_x: dataX,
    seriesData: dataNg,
    width: char_width,
    height: '14vw'
  };
  return barData;
 }
}
