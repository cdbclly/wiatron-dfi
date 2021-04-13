import { Component, OnInit, OnDestroy } from '@angular/core';
import { KpiBoardService } from './kpi-board.service';
import { ToolkitService } from '../../../../imqm-common/service';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NzI18nService, zh_TW, en_US } from 'ng-zorro-antd';

@Component({
  selector: 'app-kpi-board',
  templateUrl: './kpi-board.component.html',
  styleUrls: ['./kpi-board.component.scss']
})
export class KpiBoardComponent implements OnInit, OnDestroy {

  require = true;
  warningCloseRatePie;
  abnormalCloseRatePie;
  traceClosePie;
  materialPDDRLine;
  materialStopCountLine;
  stopLineRankBar;
  materialYRLine;
  icqThriftBar;
  sqmThriftBar;
  venderThriftBar;
  dataAlert;
  venderThriftData;
  subFormsList;

  // 墨认时间
  dateMonthStart;
  dateMonthEnd;
  dateYearStart;
  dateYearEnd;
  dateLastMonthStart;
  dateLastMonthEnd;
  yrTrendQueryType = { radio: 'global', select: '' };
  yrTrendPeriod = 'month';
  yrTrendTarget;
  defectLossAnalyze = {};

  // select
  cur_site;
  cur_plant;
  date_from;
  date_to;
  params;

  destroy$ = new Subject();
  trans: Object = {};

  constructor(
    private _service: KpiBoardService,
    private toolKits: ToolkitService,
    private translate: TranslateService,
    private nzI18nService: NzI18nService
    ) {
      this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(lang => {
        this.translate.get(['imq-kpi-vendorClose', 'imq-kpi-preWarnClose', 'imq-kpi-vendorOverSpecClose', 'imq-kpi-overSpecClose',
      'imq-kpi-ngAutoTraceClose', 'imq-kpi-ngTraceClose', 'imq-kpi-pddr', 'imq-closeR-autoTrace', 'imq-kpi-stopLineNum',
      'imq-kpi-drMonthly', 'imq-kpi-stoplineMaterial', 'imq-kpi-stopRankVendor', 'imq-kpi-yrTrendVendor',
      'imq-kpi-icq', 'imq-kpi-sqm', 'imq-kpi-supplierSaving', 'imq-supplier', 'imq-accu']).subscribe(res => {
        this.trans['vendorClose'] = res['imq-kpi-vendorClose'];
        this.trans['preWarnClose'] = res['imq-kpi-preWarnClose'];
        this.trans['vendorSpecClose'] = res['imq-kpi-vendorOverSpecClose'];
        this.trans['overSpecClose'] = res['imq-kpi-overSpecClose'];
        this.trans['ngAutoTraceClose'] = res['imq-kpi-ngAutoTraceClose'];
        this.trans['ngTraceClose'] = res['imq-kpi-ngTraceClose'];
        this.trans['pddr'] = res['imq-kpi-pddr'];
        this.trans['autoTrace'] = res['imq-closeR-autoTrace'];
        this.trans['stopLineNum'] = res['imq-kpi-stopLineNum'];
        this.trans['drMonthly'] = res['imq-kpi-drMonthly'];
        this.trans['stopLineM'] = res['imq-kpi-stoplineMaterial'];
        this.trans['stopRankV'] = res['imq-kpi-stopRankVendor'];
        this.trans['yrTrendV'] = res['imq-kpi-yrTrendVendor'];
        this.trans['icq'] = res['imq-kpi-icq'];
        this.trans['sqm'] = res['imq-kpi-sqm'];
        this.trans['supplierSaving'] = res['imq-kpi-supplierSaving'];
        this.trans['supplier'] = res['imq-supplier'];
        this.trans['accu'] = res['imq-accu'];
        if (lang.lang === 'en') {
          this.nzI18nService.setLocale(en_US);
        } else {
          this.nzI18nService.setLocale(zh_TW);
        }
        if (this.params) {
          this.query(this.params);
        }
       });
      });
    }

  ngOnInit() {
    this.translate.get(['imq-kpi-vendorClose', 'imq-kpi-preWarnClose', 'imq-kpi-vendorOverSpecClose', 'imq-kpi-overSpecClose',
    'imq-kpi-ngAutoTraceClose', 'imq-kpi-ngTraceClose', 'imq-kpi-pddr', 'imq-closeR-autoTrace', 'imq-kpi-stopLineNum',
    'imq-kpi-drMonthly', 'imq-kpi-stoplineMaterial', 'imq-kpi-stopRankVendor', 'imq-kpi-yrTrendVendor',
    'imq-kpi-icq', 'imq-kpi-sqm', 'imq-kpi-supplierSaving', 'imq-supplier', 'imq-accu']).subscribe(res => {
      this.trans['vendorClose'] = res['imq-kpi-vendorClose'];
      this.trans['preWarnClose'] = res['imq-kpi-preWarnClose'];
      this.trans['vendorSpecClose'] = res['imq-kpi-vendorOverSpecClose'];
      this.trans['overSpecClose'] = res['imq-kpi-overSpecClose'];
      this.trans['ngAutoTraceClose'] = res['imq-kpi-ngAutoTraceClose'];
      this.trans['ngTraceClose'] = res['imq-kpi-ngTraceClose'];
      this.trans['pddr'] = res['imq-kpi-pddr'];
      this.trans['autoTrace'] = res['imq-closeR-autoTrace'];
      this.trans['stopLineNum'] = res['imq-kpi-stopLineNum'];
      this.trans['drMonthly'] = res['imq-kpi-drMonthly'];
      this.trans['stopLineM'] = res['imq-kpi-stoplineMaterial'];
      this.trans['stopRankV'] = res['imq-kpi-stopRankVendor'];
      this.trans['yrTrendV'] = res['imq-kpi-yrTrendVendor'];
      this.trans['icq'] = res['imq-kpi-icq'];
      this.trans['sqm'] = res['imq-kpi-sqm'];
      this.trans['supplierSaving'] = res['imq-kpi-supplierSaving'];
      this.trans['supplier'] = res['imq-supplier'];
      this.trans['accu'] = res['imq-accu'];
      this.getDefaultDate();
     });
  }

  async query(params) {
    console.log(params);
    this.params = params;
    this.cur_site = params['cur_site'];
    this.cur_plant = params['cur_plant'];
    this.date_from = moment.unix(params['date_from'] / 1000).startOf('month').valueOf();
    this.date_to = moment.unix(params['date_to'] / 1000).endOf('month').valueOf();
    this.yrTrendQueryType.radio = 'global';
    this.yrTrendPeriod = 'month';
    // 当有选择时间的时候，截止日期由向上取整+1改为向下取整
    this._service.getInitData(this.cur_site, this.cur_plant, Math.floor(this.date_from / 1000), Math.floor(this.date_to / 1000)).subscribe(
      async res => {
        this.yrTrendTarget = [{ yrTarget: res['yrTarget'] }];
        this.warningCloseRatePie = this.wrapHollowPie(res['earlWarning'], this.trans['vendorClose'], this.trans['preWarnClose']);
        this.abnormalCloseRatePie = this.wrapHollowPie(res['abnormal'], this.trans['vendorSpecClose'], this.trans['overSpecClose']);
        this.traceClosePie = this.wrapHollowPie(res['trace'], this.trans['ngAutoTraceClose'], this.trans['ngTraceClose']);
        this.materialPDDRLine = await this.wrapMaterialPDDRLine(res['drRate'], res['drBefore'], this.trans['pddr'], ['Before', this.trans['pddr'], this.trans['drMonthly']]);
        this.materialStopCountLine = this.wrapMaterialStopCountLine(res['stopNum'], res['stopNumBefore'], this.trans['stopLineM'], ['Before', this.trans['stopLineNum']]);
        this.stopLineRankBar = this.wrapStopLineRankBar(res['stopNumRank'], this.trans['stopRankV'], this.trans['supplier']);
        this.materialYRLine = this.wrapMaterialYRLine(res['yrRate'], this.trans['yrTrendV'], ['target', 'Y/R'], this.yrTrendPeriod);
        // debugger;
        if (!this.date_from && !this.date_to) {
          this.icqThriftBar = this.wrapThriftBar(res['saveInfo'].filter(result => result['type'] === 'iqc'), this.trans['icq'], '');
          this.sqmThriftBar = this.wrapThriftBar(res['saveInfo'].filter(result => result['type'] === 'sqm'), this.trans['sqm'], '');
          this.venderThriftBar = this.wrapThriftBar(res['saveInfo'].filter(result => result['type'] === 'vendor'), this.trans['supplierSaving'], '');
        } else {
          this.icqThriftBar = null;
          this.sqmThriftBar = null;
          this.venderThriftBar = null;
          console.log(this.icqThriftBar);
        }
      }
    );
  }

  showFormList(detail, type) {
    // debugger;
    if (type === 'warning') {
      this._service.getEarlyWarningFormList({site: this.cur_site, plant: this.cur_plant,
        status: detail['name'] === 'close' ? 'close' : detail['name']}, this.date_from ? Math.ceil(this.date_from / 1000) : Math.ceil(this.dateMonthStart / 1000),
      this.date_to ? Math.ceil(this.date_to / 1000) : Math.ceil(this.dateMonthEnd / 1000)).subscribe(res => {
        res.forEach(element => {
          element['objName'] = 'earlyWarn';
          element['expand'] = false;
        });
        this.dataAlert = res;
      });
    }
    if (type === 'abnormal') {
      this._service.getAbnormalFormList({site: this.cur_site, plant: this.cur_plant,
        status: detail['name'] === 'close' ? 'close' : detail['name']}, this.date_from ? Math.ceil(this.date_from / 1000) : Math.ceil(this.dateMonthStart / 1000),
      this.date_to ? Math.ceil(this.date_to / 1000) : Math.ceil(this.dateMonthEnd / 1000)).subscribe(res => {
        res.forEach(element => {
          element['objName'] = 'abnormal';
          element['expand'] = false;
        });
        this.dataAlert = res;
      });
    }
    if (type === 'trace') {
      this._service.getTraceFormList({site: this.cur_site, plant: this.cur_plant,
        status: detail['name'] === 'close' ? 'close' : detail['name']}, this.date_from ? Math.ceil(this.date_from / 1000) : Math.ceil(this.dateMonthStart / 1000),
      this.date_to ? Math.ceil(this.date_to / 1000) : Math.ceil(this.dateMonthEnd / 1000)).subscribe(res => {
        res.forEach(element => {
          element['objName'] = 'traceBack';
          element['expand'] = false;
        });
        this.dataAlert = res;
      });
    }
  }

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

        // this.subFormsList = {form: form, rawData: res[0]['rawData'], date: new Date().getTime()};
      });
    }
  }

  async showVenderThriftDetail(detail) {
    this._service.getVendorSaveInfo(this.cur_site, this.cur_plant).subscribe(res => {
      this.venderThriftData = res;
    });
  }

  getDefaultDate() {
     // 本月
     this.dateMonthStart = new Date(`${moment().format('YYYY-MM-01 00:00:01')}`).getTime();
     this.dateMonthEnd = new Date().getTime();
    //  console.log(dateMonthStart, dateMonthEnd);
     // 本年
     this.dateYearStart = new Date(`${moment().format('YYYY-01-01 00:00:00')}`).getTime();
     this.dateYearEnd = new Date().getTime();
    //  console.log(dateYearStart, dateYearEnd);
     // 上个月
     this.dateLastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime();
     // const dateLastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() - 1,
     // new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate());
     this.dateLastMonthEnd = new Date(`${moment().format('YYYY-MM-01 00:00:01')}`).getTime();
    //  console.log(dateLastMonthStart, dateLastMonthEnd);
  }

  async detailAnalyze(detail, isYrTrend = false) {
    // 呼叫API
    const downLoadSelect = {
      site: this.cur_site,
      plant: this.cur_plant,
      customer: undefined,
      product: undefined,
      model: undefined,
      vendor: undefined,
      productName: undefined,
      partNumber: undefined,
      date_from: this.date_from,
      date_to: this.date_to,
      selectDate: {
        date_from: this.date_from ? this.date_from : moment().add(-1, 'year').add(1, 'month').startOf('month').valueOf(),
        date_to: this.date_to ? this.date_to : moment().endOf('month').valueOf()
      }
    };
    console.log(detail);
    if (isYrTrend) {
      let startMonthDate, endMonthDate;
      switch (this.yrTrendPeriod) {
        case 'day':
          startMonthDate = moment(detail['time']).startOf('day').valueOf();
          endMonthDate = moment(detail['time']).endOf('day').valueOf();
          break;
        case 'week':
          startMonthDate = moment(detail['time']).startOf('isoWeek').valueOf();
          endMonthDate = moment(detail['time']).endOf('isoWeek').valueOf();
          break;
        case 'month':
          startMonthDate = moment(detail['time']).startOf('month').valueOf();
          endMonthDate = moment(detail['time']).endOf('month').valueOf();
          break;
        default:
          break;
      }
      downLoadSelect.date_from = startMonthDate;
      downLoadSelect.date_to = endMonthDate;

      switch (this.yrTrendQueryType.radio) {
        case 'global':
          this._service.getDefectLoass({
            site: this.cur_site, plant: this.cur_plant
          }, startMonthDate, endMonthDate).subscribe(res => {
            detail['preTitle'] = detail['data']['seriesName'];
            this.defectLossAnalyze = { detail: detail, drAnalyze: res, downloadSelect: downLoadSelect, isYrTrend: isYrTrend };
          });
          break;
        case 'detail':
          this._service.getDefectLoass({
            site: this.cur_site, plant: this.cur_plant,
            vendor: this.yrTrendQueryType.select === 'vendor' ? detail['data']['seriesName'] : undefined,
            model: this.yrTrendQueryType.select === 'model' ? detail['data']['seriesName'] : undefined,
            partNumber: this.yrTrendQueryType.select === 'partNumber' ? detail['data']['seriesName'] : undefined
          }, startMonthDate, endMonthDate).subscribe(res => {
            detail['preTitle'] = detail['data']['seriesName'];
            downLoadSelect[this.yrTrendQueryType.select] = detail['preTitle'];
            this.defectLossAnalyze = { detail: detail, drAnalyze: res, downloadSelect: downLoadSelect, isYrTrend: isYrTrend };
          });
          break;
        default:
          break;
      }
    }
  }

  wrapHollowPie(rawData, title, seriesName) {
    // debugger;
    const dataArray = [];
    let sum = 0;
    let close = 0;
    for (const key in rawData) {
      if (rawData.hasOwnProperty(key)) {
        if (key === 'close') {
          dataArray.push({'value': rawData[key], 'name': 'close', itemStyle: {color: '#00B266'}});
          close += rawData[key];
          sum += rawData[key];
        }
        if (key === 'ongoing') {
          dataArray.push({'value': rawData[key], 'name': 'ongoing', itemStyle:  {color: '#FFE500'}});
          sum += rawData[key];
        }
        if (key === 'open') {
          dataArray.push({'value': rawData[key], 'name': 'open', itemStyle:  {color: '#FF3300'}});
          sum += rawData[key];
        }
      }
    }
    const seriesPie = {
      name: seriesName,
      label: {
        show: true,
        position: 'center',
        formatter: close + '\n' + '——' + '\n' + sum,
        color: 'black'
      },
      type: 'pie',
      radius : ['35%', '55%'],
      center: ['50%', '50%'],
      data: dataArray
    };
    const grid = {
      y: '1%',
      x: '1%',
      borderColor: 'white'
    };
    const legend = {
      orient: 'horizontal',
      x: 'center',
      y: 'bottom',
      data: ['close', 'ongoing', 'open'],
      textStyle: {
        color: 'black'
      }
    };
    return {
      title: title,
      series_name: seriesName,
      legend: legend,
      series: seriesPie,
      grid: grid,
      width: '33.3%',
      height: '12vw',
      display: 'inline-block'
    };
  }

  async wrapMaterialPDDRLine(rawData, drBefore, title, legend: any[]) {
    const dataBefore = []; const dataPD = []; const dataX = []; const seriesArray = [];
    const target = [];
    const drTargetDef = await this._service.getTarget('average', this.cur_site, this.cur_plant, '*', '*');
    rawData.forEach(ele => {
      if (ele['count'] !== 0) {
        dataX.push(ele['key']);
        // dataBefore.push(drBefore * 100);
        target.push(drTargetDef[0]['drMonthlyAverage']);
        dataPD.push(ele['percent']);
      }
    });
    console.log(dataBefore);
    seriesArray.push(

    {
      name: legend[1],
      type: 'line',
        data: dataPD,
        itemStyle: {
          normal: {
             borderColor: '#00BCD4',
             borderWidth: 2,
             color: '#00BCD4',
             label: {
              show: false,
              position: 'top',
              color: 'black',
              formatter: '{c}%'
          }
          }
        },
        lineStyle: {
          normal: {
            color: '#00BCD4'
          }
        }
    },
    {
      // target
      name: legend[2],
      type: 'line',
        data: target,
        itemStyle: {
          normal: {
             borderColor: '#66CD00',
             borderWidth: 2,
             color: '#66CD00',
             label: {
              show: false,
              position: 'top',
              color: 'black',
              formatter: '{c}%'
          }
          }
        },
        lineStyle: {
          normal: {
            color: '#66CD00'
          }
        }
    }
  );
   const tooltip =  {
     trigger: 'axis',
     backgroundColor: 'rgba(255,255,255,0.7)',
     axisPointer: {
       type: 'shadow'
     },
     textStyle: {
       color: 'black'
     },
     formatter: '{a0}: {c0}% <br/> {a1}: {c1}%'
   };
  const data_y = {
    type : 'value',
    axisLabel: {
      formatter: '{value}%'
    },
    min: function(value) {
      return (value.min -  0.01).toFixed(2);
    }
  };
  return {
    data_x: dataX,
    series: seriesArray,
    legend: legend,
    title: title,
    data_y: data_y,
    width: '100%',
    height: '12vw',
    target: target,
    formatter: false,
    tooltip: tooltip
  };
  }

  wrapMaterialStopCountLine(rawData, stopNumBefore, title, legend: any[]) {
    const dataBefore = []; const dataCount = []; const dataX = []; const seriesArray = [];
    // if (rawData) {
    //   dataX = rawData['dataX'];
    //   dataBefore = rawData['dataBefore'];
    //   dataCount = rawData['dataCount'];
    // }
    rawData.forEach(ele => {
      if (moment(ele['month']).valueOf() > 1572624000000) {
        dataBefore.push(stopNumBefore);
        dataCount.push(ele['count']);
        dataX.push(ele['month']);
      }
    });
    // debugger;
    console.log(dataBefore);
    seriesArray.push({
      name: legend[0],
      type: 'line',
        data: dataBefore,
        itemStyle: {
          normal: {
             borderColor: '#9C27B0',
             borderWidth: 2,
             color: '#9C27B0',
             label: {
              show: false,
              position: 'top',
              color: 'black',
              formatter: '{c}%'
          }
          }
        },
        lineStyle: {
          normal: {
            color: '#9C27B0'
          }
        }
    },
    {
      name: legend[1],
      type: 'line',
        data: dataCount,
        itemStyle: {
          normal: {
             borderColor: '#00BCD4',
             borderWidth: 2,
             color: '#00BCD4',
             label: {
              show: false,
              position: 'top',
              color: 'black',
              formatter: '{c}%'
          }
          }
        },
        lineStyle: {
          normal: {
            color: '#00BCD4'
          }
        }
    }
  );
  const data_y = {
    type : 'value',
    axisLabel: {
      formatter: '{value}'
    },
    min: function(value) {
      return (value.min - 0.1 * (value.min)).toFixed(2);
    }
  };
  return {
    data_x: dataX,
    series: seriesArray,
    legend: legend,
    title: title,
    data_y: data_y,
    width: '100%',
    height: '12vw',
    formatter: false
  };
  }

  wrapStopLineRankBar(rowData, title, legend) {
    const dataX = []; const data = [];
    // if (rowData) {
    //   dataX = rowData['dataX'];
    // }
    const toolTip = [];
    rowData.map(res => {
      dataX.push(res['manufacturer']);
      data.push({
        value: res['count'],
        itemStyle: {
          normal: {
            color: '#C561D3'
          }
        }
      });
    });
    const seriesRank = {
      name: legend,
      type: 'bar',
      barWidth: '60%',
      data: data,
      itemStyle: {normal: {color: '#C561D3'}}
    };
    return {
      data_x: dataX,
      title: title,
      legend: this.trans['supplier'],
      width: '100%',
      height: '12vw',
      series: [seriesRank],
      toolTip: toolTip
    };
  }

  wrapMaterialYRLine(rawData, title, legend: any[], period) {
    const target = []; const dataYr = []; const dataX = []; const timeYr = []; const seriesArray = [];
    const allPeriod = period === 'week' ? 'allWeek' : 'allDay';
    // if (rawData) {
    //   dataX = rawData['dataX'];
    //   target = rawData['target'];
    //   dataYr = rawData['dataYr'];
    // }
    rawData[allPeriod].forEach(ele => {
      if (ele['count'] !== 0) {
        target.push(this.yrTrendTarget[0].yrTarget);
        dataYr.push(ele['percent']);
        dataX.push(ele['key'] + (period === 'week' ? `\n${ele['week']}` : ''));
        timeYr.push(ele['time']);
      }
    });
    seriesArray.push({
      name: legend[0],
      type: 'line',
        data: target,
        itemStyle: {
          normal: {
             borderColor: '#00B266',
             borderWidth: 2,
             color: '#00B266',
             label: {
              show: false,
              position: 'top',
              color: 'black',
              formatter: '{c}%'
          }
          }
        },
        lineStyle: {
          normal: {
            color: '#00B266'
          }
        }
    },
    {
      name: legend[1],
      type: 'line',
        data: dataYr,
        itemStyle: {
          normal: {
             borderColor: '#00BCD4',
             borderWidth: 2,
             color: '#00BCD4',
             label: {
              show: false,
              position: 'top',
              color: 'black',
              formatter: '{c}%'
          }
          }
        },
        lineStyle: {
          normal: {
            color: '#00BCD4'
          }
        }
    }
  );
  const dataZoom = [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0]
    }
  ];
  const data_y = {
    type : 'value',
    axisLabel: {
      formatter: '{value}%'
    },
    min: function(value) {
      return (value.min -  1).toFixed(2);
    }
  };

  const tooltip =  {
    trigger: 'axis',
    backgroundColor: 'rgba(255,255,255,0.7)',
    axisPointer: {
      type: 'shadow'
    },
    textStyle: {
      color: 'black'
    },
    formatter: '{a0}: {c0}% <br/> {a1}: {c1}%'
  };
  return {
    data_x: dataX,
    series: seriesArray,
    legend: legend,
    dataZoom: dataZoom,
    title: title,
    data_y: data_y,
    width: '100%',
    height: '12vw',
    formatter: false,
    tooltip: tooltip,
    time: timeYr
  };
  }

  wrapMaterialYRLineByGroup(rawData, title, legend: any[], period) {
    const target = []; const dataYr = []; const dataX = []; const timeYr = []; const seriesArray = [];
    const lineColor = ['#00B266', '#00BCD4', '#339933', '#FFC107', '#9C27B0', '#61a0a8', '#c23531', '#2f4554', '#d48265', '#91c7ae', '#749f83', '#a274ab', '#d968ae'];
    const toolTip = [];

    rawData.forEach((ele, index) => {
      const dataYrPercent = [];
      ele['data'].forEach(res => {
        dataYrPercent.push(res['percent']);
        if (index === 0) {
          target.push(this.yrTrendTarget[0].yrTarget);
          dataX.push(res['key'] + (period === 'week' ? `\n${res['week']}` : ''));
          timeYr.push(res['time']);
        }
      });
      dataYr.push(dataYrPercent);
    });
    target.forEach((res, index) => {
      const toolTip_obj = { 'target': res };
      legend.forEach((item, idx) => {
        if (idx !== 0) {
          toolTip_obj[item] = dataYr[idx - 1][index];
        }
      });
      toolTip.push(toolTip_obj);
    });
    seriesArray.push({
      name: legend[0],
      type: 'line',
        data: target,
        itemStyle: {
          normal: {
             borderColor: lineColor[0],
             borderWidth: 2,
             color: lineColor[0],
             label: {
              show: false,
              position: 'top',
              color: 'black',
              formatter: '{c}%'
          }
          }
        },
        lineStyle: {
          normal: {
            color: lineColor[0]
          }
        }
    }
  );
  legend.forEach((item, index) => {
    if (index !== 0) {
      seriesArray.push(
        {
          name: item,
          type: 'line',
            data: dataYr[index - 1],
            itemStyle: {
              normal: {
                 borderColor: lineColor[index],
                 borderWidth: 2,
                 color: lineColor[index],
                 label: {
                  show: false,
                  position: 'top',
                  color: 'black',
                  formatter: '{c}%'
              }
              }
            },
            lineStyle: {
              normal: {
                color: lineColor[index]
              }
            }
        }
      );
    }
  });
  const dataZoom = [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0]
    }
  ];
  const data_y = {
    type : 'value',
    axisLabel: {
      formatter: '{value}%'
    },
    min: function(value) {
      return (value.min -  1).toFixed(2);
    }
  };

  return {
    data_x: dataX,
    series: seriesArray,
    legend: legend,
    dataZoom: dataZoom,
    title: title,
    data_y: data_y,
    width: '100%',
    height: '12vw',
    formatter: true,
    toolTip: toolTip,
    time: timeYr
  };
  }

  wrapThriftBar(rowData, title, legend) {
    let dataX = []; let data = [];
    // debugger;
    dataX = ['Last Month', this.trans['accu']];
    if (rowData.length > 0) {
    data = [{
      value: rowData[0]['value'].toFixed(2),
        itemStyle: {
          normal: {
            color: '#A368D5'
          }
        }
    },
    {
      value: rowData[0]['grandTotal'].toFixed(2),
        itemStyle: {
          normal: {
            color: '#A368D5'
          }
        }
    }];
    }
    const seriesRank = {
      name: legend,
      type: 'bar',
      barWidth: '60%',
      data: data,
      itemStyle: {normal: {color: '#A368D5'}}
    };
    return {
      data_x: dataX,
      title: title,
      width: '33.3%',
      height: '12vw',
      series: [seriesRank],
      display: 'inline-block'
    };
  }

  onChangeYrTrendQueryType(value) {
    this.yrTrendQueryType = value;
    this.onChangeYrTrendPeriod(this.yrTrendPeriod);
  }

  onChangeYrTrendPeriod(value) {
    this.yrTrendPeriod = value;
    let legend;
    switch (this.yrTrendQueryType.radio) {
      case 'global':
        legend = ['target', 'Y/R'];
        switch (this.yrTrendPeriod) {
          case 'day':
            this._service.getYrTrend(this.cur_site, this.cur_plant, this.date_from, this.date_to).subscribe(async res => {
              this.materialYRLine = this.wrapMaterialYRLine(res, this.trans['yrTrendV'], legend, this.yrTrendPeriod);
            });
            break;
          case 'week':
            this._service.getWeekTrend(this.cur_site, this.cur_plant, this.date_from, this.date_to).subscribe(async res => {
              this.materialYRLine = this.wrapMaterialYRLine(res, this.trans['yrTrendV'], legend, this.yrTrendPeriod);
            });
            break;
          case 'month':
            this._service.getMonthShiftTrend(this.cur_site, this.cur_plant, this.date_from, this.date_to).subscribe(async res => {
              this.materialYRLine = this.wrapMaterialYRLine(res, this.trans['yrTrendV'], legend, this.yrTrendPeriod);
            });
            break;
          default:
            break;
        }
        break;
      case 'detail':
        this._service.getTrendByGroup(
        this.yrTrendQueryType.select, this.yrTrendPeriod,
        { site: this.cur_site, plant: this.cur_plant },
        this.date_from, this.date_to).subscribe(async res => {
          legend = res.map(item => item.key);
          legend.unshift('target');
          this.materialYRLine = this.wrapMaterialYRLineByGroup(res, this.trans['yrTrendV'], legend, this.yrTrendPeriod);
        });
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
 }

}
