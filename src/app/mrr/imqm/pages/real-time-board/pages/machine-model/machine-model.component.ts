import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolkitService } from '../../../../imqm-common/service';
import { MachineModelService } from './machine-model.service';
import * as moment from 'moment';
import { getSelectLocal } from 'app/mrr/imqm/imqm-common/toolKits/autoSelect';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-machine-model',
  templateUrl: './machine-model.component.html',
  styleUrls: ['./machine-model.component.scss']
})
export class MachineModelComponent implements OnInit, OnDestroy {

  // 傳送進來的原始資料
  materialProductYRRawData: any[] = []; // 供應商材料Yield Rate
  materialPDDRRawData: any[] = [];  // 緯創材料D/R
  materialAbnormalRawData: any[] = [];  // 材料廠商端Over Spec看板
  materialEarlyWarningRawData: any[] = [];  // 材料廠商端預警看板
  materialNGRawData: any[] = []; // PD材料NG追溯
  // Chart上會需要的資料
  materialProductYRBarData: {} = {}; // 組裝 供應商材料Yield Rate echart的資料
  materialPDDRBarData: {} = {}; // 組裝 緯創材料D/R echart的資料
  materialAlertBarData: {} = {}; // 組裝 供應商Over Spec/預警看板 echart的資料
  materialNGBarData: {} = {}; // PD材料NG追溯 echart
  defectLossAnalyze: {};
  // 彈出視窗相關變數
  dataYr;
  dataDr;
  dataAlert;
  dataNg;

  popModelYr;

  // auth
  isAuthAll = false;

  // Over Spec,預警,追溯的二階彈出框
  subFormsList;
  subject = 'RT-model';

   // 当前登录者的site, plant
   site = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['site'];
   plant = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant'];
   startDate;
   endDate;

  timer; // 刷新頁面用計時器
  selectItem;
  //   // i18n
  // supplierYr = '供應商材料Yield Rate';
  // materialDr = '緯創材料Defect Rate';
  // ngTrack = '纬创追溯';
  // specPrewarn = '供應商Over Spec/預警看板';
  // preWarnCount = '預警次數';
  // overSpecCount = 'overSpec 次數';
  // overSpecAnalyze = 'Over Spec分析';

   // i18n
   destroy$ = new Subject();
   trans: Object = {};

  constructor(
    private route: ActivatedRoute,
    private toolService: ToolkitService,
    private _service: MachineModelService,
    private translate: TranslateService
  ) {
    // 獲取raw data
    this.materialProductYRRawData = this.route.snapshot.data['injectResolve']['yieldRateData'];
    this.materialPDDRRawData = this.route.snapshot.data['injectResolve']['pdDrData'];
    this.materialAbnormalRawData = this.route.snapshot.data['injectResolve']['abnormalData'];
    this.materialEarlyWarningRawData = this.route.snapshot.data['injectResolve']['earlyWarningData'];
    this.materialNGRawData = this.route.snapshot.data['injectResolve']['ngData'];
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(async cur => {
      this.translate.get(['imq-realTime-supplierYr', 'imq-realTime-materialDr', 'imq-realTime-ngTrack', 'imq-realTime-specPrewarn',
      'imq-realTime-preWarnCount', 'imq-realTime-overSpecCount', 'imq-yr-overSpecAlys']).subscribe(res => {
        this.trans['supplierYr'] = res['imq-realTime-supplierYr'];
        this.trans['materialDr'] = res['imq-realTime-materialDr'];
        this.trans['ngTrack'] = res['imq-realTime-ngTrack'];
        this.trans['specPrewarn'] = res['imq-realTime-specPrewarn'];
        this.trans['preWarnCount'] = res['imq-realTime-preWarnCount'];
        this.trans['overSpecCount'] = res['imq-realTime-overSpecCount'];
        this.trans['overSpecAnalyze'] = res['imq-yr-overSpecAlys'];
      this.ngOnInit();
      });
    });
  }

  async ngOnInit() {
    this.translate.get(['imq-realTime-supplierYr', 'imq-realTime-materialDr', 'imq-realTime-ngTrack', 'imq-realTime-specPrewarn',
    'imq-realTime-preWarnCount', 'imq-realTime-overSpecCount', 'imq-yr-overSpecAlys']).subscribe(async res => {
      this.trans['supplierYr'] = res['imq-realTime-supplierYr'];
      this.trans['materialDr'] = res['imq-realTime-materialDr'];
      this.trans['ngTrack'] = res['imq-realTime-ngTrack'];
      this.trans['specPrewarn'] = res['imq-realTime-specPrewarn'];
      this.trans['preWarnCount'] = res['imq-realTime-preWarnCount'];
      this.trans['overSpecCount'] = res['imq-realTime-overSpecCount'];
      this.trans['overSpecAnalyze'] = res['imq-yr-overSpecAlys'];
      let data;
      const lastSelectItem = getSelectLocal(this.subject);
      const roles = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['26'];
      this.isAuthAll = roles['read'];
      this.getCurDate();
      if (lastSelectItem && lastSelectItem[this.subject]) {
        this.queryOp(lastSelectItem[this.subject]);
      } else {
        // 刷新頁面的計時器
      this.timer = setInterval(async () => {
        this.getCurDate();
        data = await this._service.getInitData();
        this.materialProductYRRawData = data['yieldRateData'];
        this.materialPDDRRawData = data['pdDrData'];
        this.materialAbnormalRawData = data['abnormalData'];
        this.materialEarlyWarningRawData = data['earlyWarningData'];
        this.materialNGRawData = data['ngData'];

        this.materialProductYRBarData = await this.wrapMaterialYRPDChar(this.materialProductYRRawData, this.translate['supplierYr'], 'Y/R', '100%');
        this.materialPDDRBarData = await this.wrapMaterialYRPDChar(this.materialPDDRRawData, this.trans['materialDr'], 'D/R', '100%');
        this.materialAlertBarData = await this.wrapmaterialAlertChar(this.materialAbnormalRawData, this.materialEarlyWarningRawData, this.trans['specPrewarn'], [this.trans['overSpecCount'], this.trans['preWarnCount']], '100%');
        this.materialNGBarData = await this.wrapmaterialNGChar(this.materialNGRawData, this.trans['ngTrack'], ['close', 'ongoing', 'open'], '100%');
      }, 1800000);

      // 將資料包裝成chart使用的物件
      this.materialProductYRBarData = await this.wrapMaterialYRPDChar(this.materialProductYRRawData, this.trans['supplierYr'], 'Y/R', '100%');
      this.materialPDDRBarData = await this.wrapMaterialYRPDChar(this.materialPDDRRawData, this.trans['materialDr'], 'D/R', '100%');
      this.materialAlertBarData = await this.wrapmaterialAlertChar(this.materialAbnormalRawData, this.materialEarlyWarningRawData, this.trans['specPrewarn'], [this.trans['overSpecCount'], this.trans['preWarnCount']], '100%');
      this.materialNGBarData = await this.wrapmaterialNGChar(this.materialNGRawData, this.trans['ngTrack'], ['close', 'ongoing', 'open'], '100%');
      }
    });
  }

    // 接受下拉框传来的资料
  async queryOp(params) {
    this.selectItem = params;
    this.site = params['cur_site'];
    this.plant = params['cur_plant'];
    clearInterval(this.timer);
    this.getCurDate();
    const data = await this._service.getInitData(this.site, this.plant);
    this.materialProductYRRawData = data['yieldRateData'];
    this.materialPDDRRawData = data['pdDrData'];
    this.materialAbnormalRawData = data['abnormalData'];
    this.materialEarlyWarningRawData = data['earlyWarningData'];
    this.materialNGRawData = data['ngData'];
    this.timer = setInterval(async () => {
      this.getCurDate();
      const datas = await this._service.getInitData(this.site, this.plant);
      this.materialProductYRRawData = datas['yieldRateData'];
      this.materialPDDRRawData = datas['pdDrData'];
      this.materialAbnormalRawData = datas['abnormalData'];
      this.materialEarlyWarningRawData = datas['earlyWarningData'];
      this.materialNGRawData = datas['ngData'];

      this.materialProductYRBarData = await this.wrapMaterialYRPDChar(this.materialProductYRRawData, this.trans['supplierYr'], 'Y/R', '100%');
      this.materialPDDRBarData = await this.wrapMaterialYRPDChar(this.materialPDDRRawData, this.trans['materialDr'], 'D/R', '100%');
      this.materialAlertBarData = await this.wrapmaterialAlertChar(this.materialAbnormalRawData, this.materialEarlyWarningRawData, this.trans['specPrewarn'], [this.trans['overSpecCount'], this.trans['preWarnCount']], '100%');
      this.materialNGBarData = await this.wrapmaterialNGChar(this.materialNGRawData, this.trans['ngTrack'], ['close', 'ongoing', 'open'], '100%');
    }, 1800000);

    // 將資料包裝成chart使用的物件
    this.materialProductYRBarData = await this.wrapMaterialYRPDChar(this.materialProductYRRawData, this.trans['supplierYr'], 'Y/R', '100%');
    this.materialPDDRBarData = await this.wrapMaterialYRPDChar(this.materialPDDRRawData, this.trans['materialDr'], 'D/R', '100%');
    this.materialAlertBarData = await this.wrapmaterialAlertChar(this.materialAbnormalRawData, this.materialEarlyWarningRawData, this.trans['specPrewarn'], [this.trans['overSpecCount'], this.trans['preWarnCount']], '100%');
    this.materialNGBarData = await this.wrapmaterialNGChar(this.materialNGRawData, this.trans['ngTrack'], ['close', 'ongoing', 'open'], '100%');
  }

     // 更新当前页面的起始时间
     getCurDate() {
      const curTime = new Date().getTime();
      const day8 = new Date(`${moment().format('YYYY-MM-DD 08:00:00')}`).getTime();
      const night8 = new Date(`${moment().format('YYYY-MM-DD 20:00:00')}`).getTime();
      if (curTime > day8 && curTime < night8 ) {
        this.startDate = day8;
        this.endDate = night8;
      } else {
        this.startDate = night8;
        this.endDate = new Date(`${moment().add(1, 'days').format('YYYY-MM-DD 08:00:00')}`).getTime();
      }
      // for test
    // this.startDate = 1561958176000;
    // this.endDate = 1564636576000;
    }

  // 顯示主頁'供應商材料Yield Rate 圖'和 緯創材料D/R
  async wrapMaterialYRPDChar(rowData, title, legend_name, char_width) {
    const data_x = Array(10).fill(''); const data_y = []; const target = [];
    let barData = {}; const data_arr = [];
    const toolTip_vm = [];
    // def target
    const yrTargetDef = await this._service.getYrTarget(this.site, this.plant, '*', '*');
    // console.log(yrTarget[0]['yrTarget']);
    // debugger;
    // 將資料整理成chart物件的格式
    for (let i = 0; i < rowData.length; i++) {
      // by model获取 target
      const yrTarget = await this._service.getYrTarget(this.site, this.plant, rowData[i]['key'], '*');
      rowData[i]['target'] = yrTarget.length > 0 ? yrTarget[0]['yrTarget'] : yrTargetDef.length > 0 ? yrTargetDef[0]['yrTarget'] : undefined;
      rowData[i]['percent'] = parseFloat(rowData[i]['percent']);
      data_x[i] = rowData[i]['key'];
      let series_data;
      toolTip_vm.push(rowData[i]);
      if (legend_name === 'Y/R') {
        if ( rowData[i]['percent'] < rowData[i]['target']) {
          data_arr.push({value: rowData[i]['percent'].toString().includes('.') ?  rowData[i]['percent'].toFixed(1) : rowData[i]['percent'], itemStyle: {color: '#fb928e'}});
        series_data = {
          value: rowData[i]['percent'].toString().includes('.') ?  rowData[i]['percent'].toFixed(1) : rowData[i]['percent'],
          itemStyle: {
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
            },
            label: {
              show: rowData[i]['percent'] !== 0 ? true : false,
              formatter: '{c}%',
              position: 'inside',
              fontSize: 12,
              color: 'white'
             }
        };
      } else {
        data_arr.push({value: rowData[i]['percent'].toString().includes('.') ?  rowData[i]['percent'].toFixed(1) : rowData[i]['percent'], itemStyle: {color: '#60d26e'}});
        series_data = {
          value: rowData[i]['percent'].toString().includes('.') ?  rowData[i]['percent'].toFixed(1) : rowData[i]['percent'],
          itemStyle: {
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
          },
          label: {
            show: rowData[i]['percent'] !== 0 ? true : false,
            formatter: '{c}%',
            position: 'inside',
            fontSize: 12,
            color: 'white'
           }
        };
      } } else {
        data_arr.push({value: rowData[i]['percent'].toString().includes('.') ?  rowData[i]['percent'].toFixed(1) : rowData[i]['percent'], itemStyle: {color: '#fb928e'}});
        series_data = {
          value: rowData[i]['percent'].toString().includes('.') ?  rowData[i]['percent'].toFixed(1) : rowData[i]['percent'],
          itemStyle: {
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
          },
          label: {
            show: rowData[i]['percent'] !== 0 ? true : false,
            formatter: '{c}%',
            position: 'inside',
            fontSize: 12,
            color: 'white'
           }
        };
      }
      target.push(rowData[i]['target']);
      data_y.push(series_data);
    }

    // 將資料填入chart物件內
    barData = {
      data_x: data_x,
      data_y: data_y,
      target: legend_name === 'D/R' ? undefined : target,
      target_name: legend_name === 'D/R' ? undefined : 'target',
      title: title,
      legend: legend_name,
      width: char_width,
      height: '14vw',
      search_type: 'vendor',
      data_arr: data_arr,
      toolTip_vm: toolTip_vm,
      toolTip_position: [10, 240]
    };
    return barData;
  }

  // 顯示首頁供應商Over Spec/預警看板
  async wrapmaterialAlertChar(abnormalData, earlyData, title, legend_name, char_width) {
    const data_x = Array(10).fill(''); const data_alert = []; const data_abnormal = []; const target = [];
    const series = []; const abnormalTops = []; const alertTops = [];
    let barData = {};

    // 將資料整理成chart物件的格式
    for (let i = 0; i < abnormalData.length; i ++) {
      // debugger;
      data_x[i] = abnormalData[i]['name'];
      abnormalTops.push({value: abnormalData[i]['count'],
      itemStyle: {
        color: '#fb928e'
    }});
      const series_abnormal = {
        value: abnormalData[i]['count'],
        itemStyle: {
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
        },
        label: {
          show: abnormalData[i]['count'] !== 0 ? true : false,
          position: 'inside',
          fontSize: 12,
          color: 'white'
         }
      };
      const earlys = await this._service.getEarlyListByModel(this.site, this.plant, abnormalData[i]['name'], Math.ceil(this.startDate / 1000), Math.ceil(this.endDate / 1000));
      alertTops.push({value: earlys['result'].length > 0 ? earlys['result'][0]['count'] : 0,
      itemStyle: {
        color: '#FFC409'
    }});
      data_alert.push({
        value: earlys['result'].length > 0 ? earlys['result'][0]['count'] : 0,
        itemStyle: {
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
          },
          label: {
            show: earlys['result'][0] && earlys['result'][0]['count'] !== 0 ? true : false,
            position: 'inside',
            fontSize: 12,
            color: 'white'
           }
      });
      data_abnormal.push(series_abnormal);
    }

      // go-live 新增逻辑，如果無異常數據但預警有，會顯示預警資料，若有異常資料，則以異常為主
      if (abnormalData.length === 0 && earlyData.length !== 0) {
        for (let j = 0; j < earlyData.length; j++) {
          data_x[j] = earlyData[j]['name'];
          alertTops.push({value: earlyData[j]['count'],
          itemStyle: {
            color: '#FFC409'
        }});
        data_alert.push({
          value: earlyData[j]['count'],
          itemStyle: {
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
          },
          label: {
            show: earlyData.length > 0 ? true : false,
            position: 'inside',
            fontSize: 12,
            color: 'white'
           }
        });
        }
      }

    const abnormal = {
      name: legend_name[0],
      type: 'bar',
      data: data_abnormal,
      barWidth: '40%',
      z: 12,
      tooltip : {
        backgroundColor: 'rgba(255,255,255,1)',
        textStyle: {
          color: 'black'
      }
      },
      itemStyle: {
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
      }}
    };
    const alert = {
      name: legend_name[1],
      type: 'bar',
      data: data_alert,
      barWidth: '40%',
      z: 12,
      tooltip : {
        backgroundColor: 'rgba(255,255,255,1)',
        textStyle: {
          color: 'black'
      }
      },
      itemStyle: {
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
        show: false,
        position: 'top',
        formatter: '{c}%'
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

    // 將資料填入chart物件內
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
  wrapmaterialNGChar(rowData, title, legend_name, char_width) {
    const dataX = Array(10).fill(''); const dataNg = []; const close = []; const onGoing = []; const open = [];
    let barData = {};
    const data_arr = []; // 用于画柱形图顶数据的总数
    const data_close = []; // 同理，close的数量
    const data_onGoing = []; // 同理
    const toolTip = [];

    // 將資料整理成chart物件的格式
    rowData.map((res, index) => {
      toolTip.push(res['info']);
      dataX[index] = res['name'];
      data_arr.push({value: res['close'] + res['ongoing'] + res['open'], itemStyle: {color:
        res['open'] !== 0 ? '#fb928e' : res['ongoing'] !== 0 ? '#FFC409' : '#60d26e'
      }});
      if (res['close'] !== 0 && res['ongoing'] !== 0) {
        data_close.push({value: res['close'], itemStyle:  {color: '#FFC409'}});
      }
      if (res['ongoing'] !== 0 && res['open'] !== 0) {
        data_onGoing.push({value: res['close'] + res['ongoing'], itemStyle: {
    color: '#fb928e'
        }});
      }
      close.push({value: res['close'],  label: {
        show: res['close'] !== 0 ? true : false,
        position: 'inside',
        fontSize: 12,
        color: 'white'
       }});
      onGoing.push({value: res['ongoing'], label: {show: res['ongoing'] !== 0 ? true : false,
      position: 'inside',
      fontSize: 12,
      color: 'white'
      }});
      open.push({value: res['open'], label: {show: res['open'] !== 0 ? true : false,
      position: 'inside',
      fontSize: 12,
      color: 'white'
     }});
    });
    const seriesClose = {
      name: 'close',
      type: 'bar',
      stack: 'PDNG',
      barWidth: '50%',
      z: 12,
      itemStyle: {
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
      }},
      data: close,
      tooltip : {
        backgroundColor: 'rgba(255,255,255,1)',
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
      }},
      data: onGoing,
      tooltip : {
        backgroundColor: 'rgba(255,255,255,1)',
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
      }},
      data: open,
      tooltip : {
        backgroundColor: 'rgba(255,255,255,1)',
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
          show: false,
          position: 'top',
          formatter: '{c}%'
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
          show: false,
          position: 'top',
          formatter: '{c}%'
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
          show: false,
          position: 'top',
          formatter: '{c}%'
        },
        data: data_onGoing,
        tooltip: {
          showContent: false
        }
      }
    );

    // 將資料填入chart物件內
    barData = {
      title: title,
      legend: legend_name,
      data_x: dataX,
      seriesData: dataNg,
      width: char_width,
      toolTip: toolTip,
      height: '14vw'
    };
    console.log(barData);
    return barData;
  }

  async detailAnalyze(detail) {
    const downLoadSelect = {
      site: this.selectItem.cur_site,
      plant: this.selectItem.cur_plant,
      customer: this.selectItem.cur_customer,
      product: this.selectItem.cur_productCate,
      model: this.selectItem.cur_model,
      vendor: this.selectItem.cur_vendor,
      productName: this.selectItem.cur_proName,
      partNumber: this.selectItem.cur_materialNo,
      date_from: this.selectItem.date_from,
      date_to: this.selectItem.date_to
    };
    this.getFromToTime(downLoadSelect);
    // 呼叫API
    const temp_partNumber_index = detail['data']['dataIndex'];
    const temp_partNumber = this.popModelYr[temp_partNumber_index]['key'];
    detail['preTitle'] = temp_partNumber;
    downLoadSelect.model = detail['vendor'];
    downLoadSelect.partNumber = detail['preTitle'];
    this._service.getDefectLossAnalyze(this.site, this.plant, detail['model'], this.startDate, this.endDate, temp_partNumber).subscribe(res => {
      this.defectLossAnalyze = {detail: detail, drAnalyze: res, downloadSelect: downLoadSelect};
    });
  }

  // 顯示'供應商材料Yield Rate'的彈出框
  async showSubDetailYR(detail, legend) {
    const downLoadSelect = {
      site: this.selectItem.cur_site,
      plant: this.selectItem.cur_plant,
      customer: this.selectItem.cur_customer,
      product: this.selectItem.cur_productCate,
      model: this.selectItem.cur_model,
      vendor: this.selectItem.cur_vendor,
      productName: this.selectItem.cur_proName,
      partNumber: this.selectItem.cur_materialNo,
      date_from: this.selectItem.date_from,
      date_to: this.selectItem.date_to
    };
    this.getFromToTime(downLoadSelect);
    // 獲取預設target
    const yrTargetDef = await this._service.getYrTarget('WKS', 'WKS-P1', '*', '*');
    // 根據點擊的廠商獲取料號YR
    // console.log(detail);
    const toolTip = [];
    downLoadSelect.model = detail['data']['name'];
    this._service.getPartNumYrByModel(this.site, this.plant, detail['data']['name'], this.startDate, this.endDate).subscribe(res => {
      this._service.getDefectLossAnalyze(this.site, this.plant, detail['data']['name'], this.startDate, this.endDate).subscribe(async def => {
        const targetArr = [];
        // debugger;
        for (let i = 0; i < res.length; i++) {
          const yrTarget = await this._service.getYrTarget(this.site, this.plant, detail['data']['name'], res[i]['key']);
          targetArr.push(yrTarget.length > 0 ? yrTarget[0]['yrTarget'] : yrTargetDef.length > 0 ? yrTargetDef[0]['yrTarget'] : undefined);
          // const info = await this._service.getSelectInfoByPartNo(res[i]['key']);
          // info[0]['count'] = res[i]['count'];
          toolTip.push(res[i]['info']);
        }
        this.popModelYr = res;
        this.dataYr = {detail: {vendorYr: res, tooltip: toolTip, defectLoss: def, search_type: 'partNumber'}, preTitle: detail['data']['name'], title: this.trans['supplierYr'], legend: legend, titlePie: this.trans['overSpecAnalyze'], target: targetArr, downloadSelect: downLoadSelect};
        console.log(this.dataYr);
      });
    });
  }

  // 顯示子層'緯創材料D/R'的彈出框
  async showSubDetailPD(detail, legend, titlePie) {
    const toolTip = [];
    this._service.getPartNumYrBymodelDR(this.site, this.plant, detail['data']['name'], this.startDate, this.endDate).subscribe(async res => {
      for (let i = 0; i < res.length; i++) {
        toolTip.push(res[i]['info']);
      }
      this.dataDr = {detail: {vendorDr: res, toolTip: toolTip, search_type: 'partNumber'}, preTitle: detail['data']['name'], title: this.trans['materialDr'], legend: legend, titlePie: titlePie, target: null};
    });
  }

  // 顯示預警圖的彈出框
  async showSubDetailAlert(detail) {
    if (detail['seriesName'] === this.trans['overSpecCount']) {
      this._service.getAbnormalList(this.site, this.plant, detail['name'],  Math.ceil(this.startDate / 1000), Math.ceil(this.endDate / 1000)).subscribe(res => {
        // console.log(res);
        res.forEach(element => {
          element['objName'] = 'abnormal';
          element['expand'] = false;
        });
        this.dataAlert = res;
      });
    }
    if (detail['seriesName'] === this.trans['preWarnCount']) {
      this._service.getEarlyWarningList(this.site, this.plant, detail['name'], Math.ceil(this.startDate / 1000), Math.ceil(this.endDate / 1000)).subscribe(res => {
        res.forEach(element => {
          element['objName'] = 'earlyWarn';
          element['expand'] = false;
        });
        this.dataAlert = res;
      });
    }
    console.log(this.dataAlert);
  }

  // 顯示PD NG圖的彈出框
  async showSubDetailNG(detail) {
    this._service.getTraceBackList(this.site, this.plant, detail['name'], detail['seriesName'], Math.ceil(this.startDate / 1000), Math.ceil(this.endDate / 1000)).subscribe(res => {
      res.forEach(element => {
        element['objName'] = 'traceBack';
        element['expand'] = false;
      });
      this.dataNg = res;
    });
  }

  // 顯示subFormList
  showFormDetail(form) {
    console.log(form);
    if (form['objName'] === 'earlyWarn') {
      this._service.getEarlyWarnRawDataBySN(form['number']).subscribe(res => {
        this.subFormsList = {form: form, rawData: res[0]['rawData'], date: new Date().getTime()};
      });
    }
    if (form['objName'] === 'abnormal') {
      this._service.getAbnormalRawDataBySN(form['number']).subscribe(result => {

        const res = result['rawData'];
        const tempData = JSON.parse(res[0]['rawData']);
        tempData['headerField'] = result['headerField'];
        this.subFormsList = {form: form, rawData: JSON.stringify(tempData), date: new Date().getTime()};

        // this.subFormsList = {form: form, rawData: res[0]['rawData'], date: new Date().getTime()};
      });
    }
    if (form['objName'] === 'traceBack') {
      this._service.getTraceBackRawDataBySN(form['number']).subscribe(result => {

        const res = result['rawData'];
        const tempData = JSON.parse(res[0]['rawData']);
        tempData[0]['headerField'] = result['headerField'];
        form['sn'] = res[0]['unitSerialNumber'];
        this.subFormsList = {form: form, rawData: JSON.stringify(tempData), date: new Date().getTime()};

        // form['sn'] = res[0]['unitSerialNumber'];
        // this.subFormsList = {form: form, rawData: res[0]['rawData'], date: new Date().getTime()};
      });
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.destroy$.next();
    this.destroy$.complete();
   }

   getFromToTime(downLoadSelect) {
    const curTime = new Date().getTime();
    const day8 = new Date(`${moment().format('YYYY-MM-DD 08:00:00')}`).getTime();
    const night8 = new Date(`${moment().format('YYYY-MM-DD 20:00:00')}`).getTime();
    let startDate;
    let endDate;
    if (curTime > day8 && curTime < night8 ) {
      startDate = day8;
      endDate = night8;
    } else {
      startDate = night8;
      endDate = new Date(`${moment().add(1, 'days').format('YYYY-MM-DD 08:00:00')}`).getTime();
    }
    downLoadSelect.date_from = startDate;
    downLoadSelect.date_to = endDate;
   }
}
