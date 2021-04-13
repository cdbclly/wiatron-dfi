import { Component, OnInit } from '@angular/core';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';
@Component({
  selector: 'app-smart-factory-kanban',
  templateUrl: './smart-factory-kanban.component.html',
  styleUrls: ['./smart-factory-kanban.component.scss']
})
export class SmartFactoryKanbanComponent implements OnInit {
  objectKeys = Object.keys;
  objectValue = Object.values;
  cur_title = 'PPK Monitor(Real-time)';
  titleGroup = ['PPK Monitor(By Monthly)', 'PPK Monitor(Real-time)', 'SPC Monitor'];
  siteInfos;
  cur_plant: string;
  plantGroup = [];
  cur_site: string;
  siteGroup = [];
  // cur_section: string;
  // sectionGroup = [];
  cur_line: string;
  lineGroup = [];
  cur_stage: string;
  stageGroup = [];
  cur_model: string;
  modelGroup = [];
  cur_btname: string;
  btnameGroup = [];
  cur_stname = [];
  stnameGroup = [];
  datefrom;
  dateto;
  dateInputFrom;
  dateInputTo;
  initEsData = [];
  filterEsData = [];
  queryButton = true;
  ppkEchartArr = [];
  spcEchartArr = [];
  allData = [];
  isShowArr = [];
  dic = {};
  isVisible = false;
  cancelOK = false;
  footer = null;
  downLoadData = [];
  curPagelog; // log的当前页面
  THwidth = ['120px', '120px', '120px', '180px', '120px', '120px', '120px', '120px', '120px', '120px', '120px'];
  constructor(
    private dataService: LineDataServiceService,
    private esService: EsDataServiceService,
    private message: NzMessageService,
    private datePipe: DatePipe,
    private excelService: ExcelToolService
  ) { }

  ngOnInit() {
    this.siteInfos = JSON.parse(localStorage.getItem('Skyeye_plantMapping'));
    this.siteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
  }

  selectTitle() {
    if (!this.cur_title) {
      this.cur_title = 'PPK Monitor(By Monthly)';
    }
    this.cur_site = '';
    this.cur_plant = '';
    this.plantGroup = [];
    // this.cur_section = '';
    // this.sectionGroup = [];
    this.cur_line = '';
    this.lineGroup = [];
    this.cur_stage = '';
    this.stageGroup = [];
    this.cur_model = '';
    this.modelGroup = [];
    this.cur_btname = '';
    this.btnameGroup = [];
    this.cur_stname = [];
    this.stageGroup = [];
    this.ppkEchartArr = [];
    this.spcEchartArr = [];
    this.isShowArr = [];
    this.queryButton = true;
    this.dateInputFrom = '';
    this.dateInputTo = '';
    this.dateto = undefined;
    this.datefrom = undefined;
  }

  async getOptions(type) {
    if (type === 'site') {
      this.cur_plant = '';
      this.plantGroup = [];
      // this.cur_section = '';
      // this.sectionGroup = [];
      this.cur_line = '';
      this.lineGroup = [];
      this.cur_stage = '';
      this.stageGroup = [];
      this.cur_model = '';
      this.modelGroup = [];
      this.queryButton = true;
      if (this.cur_title === 'SPC Monitor') {
        this.cur_btname = '';
        this.btnameGroup = [];
        this.cur_stname = [];
        this.stnameGroup = [];
      }
      this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
        return res['Plant'];
      });
    }

    if (type === 'plant') {
      // this.cur_section = '';
      // this.sectionGroup = [];
      this.cur_line = '';
      this.lineGroup = [];
      this.cur_stage = '';
      this.stageGroup = [];
      this.cur_model = '';
      this.modelGroup = [];
      this.queryButton = true;
      if (this.cur_title === 'SPC Monitor') {
        this.cur_btname = '';
        this.btnameGroup = [];
        this.cur_stname = [];
        this.stnameGroup = [];
      }

      if (this.cur_plant) {
        if (this.cur_title === 'PPK Monitor(Real-time)') {
          await this.getESDatas('ctq_ppk_monitor');
        } else if (this.cur_title === 'PPK Monitor(By Monthly)') {
          await this.getESDatas('ctq_monthly_ppk');
        } else {
          await this.getESDatas('ctq_spc_monitor');
        }
      }
      // this.dataService.getSectionsByPlant(this.cur_plant).subscribe(res => {
      //   this.sectionGroup = res.map(section => {
      //     return section;
      //   });
      //   this.sectionGroup = this.sectionGroup.filter(sec => sec !== null);
      // });
    }

    // if (type === 'section') {
    //   this.cur_line = '';
    //   this.lineGroup = [];
    //   this.cur_stage = '';
    //   this.stageGroup = [];
    //   this.cur_model = '';
    //   this.modelGroup = [];
    //   if (this.cur_title === 'SPC Monitor') {
    //     this.cur_btname = '';
    //     this.btnameGroup = [];
    //     this.cur_stname = [];
    //     this.stnameGroup = [];
    //   }
    //   this.queryButton = true;
    //   if (this.cur_plant) {
    //     if (this.cur_title === 'PPK Monitor(Real-time)') {
    //       await this.getESDatas('ctq_ppk_monitor');
    //     } else if (this.cur_title === 'PPK Monitor(By Monthly)') {
    //       await this.getESDatas('ctq_monthly_ppk');
    //     } else {
    //       await this.getESDatas('ctq_spc_monitor');
    //     }
    //   }
    // }

    if (type === 'line') {
      this.cur_stage = '';
      this.stageGroup = [];
      this.cur_model = '';
      this.modelGroup = [];
      if (this.cur_title === 'SPC Monitor') {
        this.cur_btname = '';
        this.btnameGroup = [];
        this.cur_stname = [];
        this.stnameGroup = [];
      }
      this.queryButton = true;
      await this.filterData();
      this.stageGroup = this.dataService.groupBy(this.filterEsData, 'stage');
      this.stageGroup = this.objectKeys(this.stageGroup);
    }

    if (type === 'stage') {
      this.cur_model = '';
      this.modelGroup = [];
      if (this.cur_title === 'SPC Monitor') {
        this.cur_btname = '';
        this.btnameGroup = [];
        this.cur_stname = [];
        this.stnameGroup = [];
      }
      this.queryButton = true;
      await this.filterData();
      this.modelGroup = this.dataService.groupBy(this.filterEsData, 'model');
      this.modelGroup = this.objectKeys(this.modelGroup);
    }

    if (type === 'model') {
      if (this.cur_title === 'SPC Monitor') {
        this.cur_btname = '';
        this.btnameGroup = [];
        this.cur_stname = [];
        this.stnameGroup = [];
        this.queryButton = true;
        await this.filterData();
        this.btnameGroup = this.dataService.groupBy(this.filterEsData, 'tdname');
        this.btnameGroup = this.objectKeys(this.btnameGroup);
      } else {
        if (this.cur_model && this.cur_model !== undefined && this.cur_model !== null) {
          this.queryButton = false;
        } else {
          this.queryButton = true;
        }
      }
    }

    if (type === 'bt' && this.cur_title === 'SPC Monitor') {
      this.cur_stname = [];
      this.stnameGroup = [];
      this.queryButton = true;
      await this.filterData();
      this.stnameGroup = this.dataService.groupBy(this.filterEsData, 'mdname');
      this.stnameGroup = this.objectKeys(this.stnameGroup);
    }

    if (type === 'st' && this.cur_title === 'SPC Monitor') {
      if (this.datefrom && this.dateto && this.cur_stname.length > 0) {
        this.queryButton = false;
      } else {
        this.queryButton = true;
      }
    }
  }

  getOptionDate(result: Date, type) {
    if (this.cur_title === 'SPC Monitor') {
      if (type === 'dateTo') {
        this.dateto = result ? result.getTime() : undefined;
      }
      if (type === 'dateFrom') {
        this.datefrom = result ? result.getTime() : undefined;
      }
      if (this.datefrom && this.dateto && this.cur_stname.length > 0) {
        this.queryButton = false;
      } else {
        this.queryButton = true;
      }
    } else if (this.cur_title === 'PPK Monitor(By Monthly)') {
      if (type === 'dateTo') {
        const dateTo = result ? result.getTime() : undefined;
        this.dateto = this.numberToDate(dateTo, true);
      }
      if (type === 'dateFrom') {
        const dateFrom = result ? result.getTime() : undefined;
        this.datefrom = this.numberToDate(dateFrom, false);
      }
    } else {
      if (type === 'dateTo') {
        this.dateto = result ? result.getTime() : undefined;
      }
      if (type === 'dateFrom') {
        this.datefrom = result ? result.getTime() : undefined;
      }
    }
  }

  async getESDatas(type) {
    let date_range;
    let size;
    // 如果有时间范围
    if (this.datefrom && this.dateto && this.datefrom !== undefined && this.dateto !== undefined) {
      date_range = `"range": {
            "executiontime": {
              "lte": ${this.dateto},
              "gte": ${this.datefrom}
            }
          }`;
      size = `"size": 10000`;
    } else {
      date_range = `"range": {
            "executiontime": {
              "lte": "now"
            }
          }`;
      size = `"size": 10000`;
    }
    let esURL;
    if (this.cur_site !== 'WKS') {
      esURL = this.esService.getUrl(type + '/', '_' + this.cur_site.toLowerCase());
    } else {
      esURL = this.esService.getUrl(type + '/');
    }
    const querys = this.esService.getPPKRealTimeOp(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(), date_range, size);
    const data = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
    console.log('从es中查出来的站别数据 === \n');
    console.log(esURL, querys);
    console.log(data);
    for (let i = 0; i < data['hits']['hits'].length; i++) {
      this.lineGroup.push(data['hits']['hits'][i]._source.stationline);
      this.lineGroup = Array.from(new Set(this.lineGroup)); // 去重
      const dataitem = {
        line: data['hits']['hits'][i]._source.stationline,
        stage: data['hits']['hits'][i]._source.stationtype,
        model: data['hits']['hits'][i]._source.modelname,
        tdname: data['hits']['hits'][i]._source.tdname,
        mdname: data['hits']['hits'][i]._source.mdname
      };
      this.initEsData.push(dataitem);
    }
  }

  filterData() {
    this.filterEsData = this.initEsData;
    if (this.cur_line !== undefined && this.cur_line !== null && this.cur_line !== '') {
      this.filterEsData = this.filterEsData.filter(res => res['line'] === this.cur_line);
    }

    if (this.cur_stage !== undefined && this.cur_stage !== null && this.cur_stage !== '') {
      this.filterEsData = this.filterEsData.filter(res => res['stage'] === this.cur_stage);
    }

    if (this.cur_model !== undefined && this.cur_model !== null && this.cur_model !== '') {
      this.filterEsData = this.filterEsData.filter(res => res['model'] === this.cur_model);
    }

    if (this.cur_btname !== undefined && this.cur_btname !== null && this.cur_btname !== '') {
      this.filterEsData = this.filterEsData.filter(res => res['tdname'] === this.cur_btname);
    }
  }

  query() {
    let URL;
    if (this.cur_title === 'PPK Monitor(Real-time)') {
      URL = 'ctq_ppk_monitor/';
    } else if (this.cur_title === 'PPK Monitor(By Monthly)') {
      URL = 'ctq_monthly_ppk/';
    } else {
      URL = 'ctq_spc_monitor/';
    }
    this.getData(URL);
  }

  async getData(dataUrl) {
    let esURL;
    if (this.cur_site !== 'WKS') {
      esURL = this.esService.getUrl(dataUrl, '_' + this.cur_site.toLowerCase());
    } else {
      esURL = this.esService.getUrl(dataUrl);
    }
    let date_range;
    let size;
    if (this.datefrom !== undefined && this.dateto !== undefined) {
      date_range = `"range": {
          "executiontime": {
            "lte": ${this.dateto},
            "gte": ${this.datefrom}
          }
        }`;
      size = `"size": 10000`;
    } else {
      date_range = `"range": {
          "executiontime": {
            "lte": ${new Date().getTime()}
          }
        }`;
      size = `"size": 10000`;
    }
    let querys;
    if (this.cur_title !== 'SPC Monitor') {
      querys = this.esService.getQueryByPPKRealTime(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(),
        this.cur_line.toUpperCase(), this.cur_stage.toUpperCase(), this.cur_model, date_range, size);
    } else {
      const itemStr = this.cur_stname.join('","');
      querys = this.esService.getQueryBySPC(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(),
        this.cur_line.toUpperCase(), this.cur_stage.toUpperCase(), this.cur_model, this.cur_btname, itemStr, date_range, size);
    }
    console.log('查询条件 \n', esURL, querys);
    querys = JSON.parse(querys);
    const stageMapping = await this.dataService.getStageMapping(this.cur_stage, this.cur_plant, this.cur_site);
    this.esService.postData(esURL, querys).subscribe(data => {
      console.log('  查询到的数据\n', data);
      if (data['hits']['hits'].length > 2000) {
        this.message.create('success', 'The query range is too large, please select the query date again.');
        return;
      }
      this.allData = [];
      this.ppkEchartArr = [];
      this.spcEchartArr = [];
      if (data['hits']['hits'].length > 0) {
        if (this.cur_title !== 'SPC Monitor') {
          for (let i = data['hits']['hits'].length - 1; i > -1; i--) {
            const tempDic = {};
            tempDic['executiontime'] = data['hits']['hits'][i]._source.executiontime;
            tempDic['usl'] = data['hits']['hits'][i]._source.mdupperlimit;
            tempDic['lsl'] = data['hits']['hits'][i]._source.mdlowerlimit;
            tempDic['max'] = data['hits']['hits'][i]._source.max;
            tempDic['min'] = data['hits']['hits'][i]._source.min;
            tempDic['mean'] = data['hits']['hits'][i]._source.mean;
            tempDic['sigma'] = data['hits']['hits'][i]._source.sigma;
            tempDic['pp'] = data['hits']['hits'][i]._source.pp;
            tempDic['ppk'] = data['hits']['hits'][i]._source.ppk; // y轴对应的数值
            tempDic['goal'] = data['hits']['hits'][i]._source.goal;
            tempDic['tdname'] = data['hits']['hits'][i]._source.tdname;
            tempDic['mdname'] = data['hits']['hits'][i]._source.mdname;
            tempDic['detail'] = data['hits']['hits'][i]._source.detail;
            tempDic['flag'] = data['hits']['hits'][i]._source.flag;
            tempDic['mdupperlimit'] = data['hits']['hits'][i]._source.mdupperlimit;
            tempDic['mdlowerlimit'] = data['hits']['hits'][i]._source.mdlowerlimit;
            tempDic['model'] = data['hits']['hits'][0]._source.modelname;
            tempDic['line'] = data['hits']['hits'][0]._source.stationline;
            tempDic['stage'] = data['hits']['hits'][0]._source.stationtype;
            if (this.cur_title === 'PPK Monitor(By Monthly)' && data['hits']['hits'][i]._source.result === 'ok') {
              const strMonth = data['hits']['hits'][i]._source.month;
              tempDic['month'] = this.numberToEnmonth(strMonth.substring(strMonth.length - 2));
              this.allData.push(tempDic);
            }
            if (this.cur_title === 'PPK Monitor(Real-time)') {
              this.allData.push(tempDic);
            }
          }
          this.dic = this.dataService.groupBy(this.allData, 'flag');
          // console.log('----------------------- \n', this.dic);
          // 如果选择了时间就不进行取各种组合的前14个点
          if (!this.datefrom || !this.dateto) {
            const keys = this.objectKeys(this.dic);
            for (let k = 0; k < keys.length; k++) {
              if (this.cur_title === 'PPK Monitor(Real-time)') {
                if (this.dic[keys[k]].length > 14) {
                  this.dic[keys[k]] = this.dic[keys[k]].splice(0, 14);
                }
              }
              if (this.cur_title === 'PPK Monitor(By Monthly)') {
                if (this.dic[keys[k]].length > 12) {
                  this.dic[keys[k]] = this.dic[keys[k]].splice(0, 12);
                }
              }
            }
            // console.log('未选时间截取各个组合的前12/14个点 --------\n', this.dic);
          }
          // 处理echart循环数据
          this.ppkEchartArr = [];
          const keysArr = this.objectKeys(this.dic);
          for (let i = 0; i < keysArr.length; i++) {
            this.isShowArr.push(true);
            const seriesData = [];
            const markPointData = [];
            const markLinex = [];
            const xData = [];
            let max;
            let min;
            let goal;
            const tempDicc = this.dic[keysArr[i]];
            for (let k = 0; k < tempDicc.length; k++) {
              if (markLinex.length < 1) {
                goal = tempDicc[0].goal;
                markLinex.push({ yAxis: goal, label: { show: true, formatter: 'Goal' + goal.toString() }, itemStyle: { normal: { color: '#abc327' } } });
              }
              if (goal > tempDicc[k].ppk) {
                markPointData.push({
                  name: tempDicc[k].flag, symbol: 'circle', symbolSize: 20, yAxis: tempDicc[k].ppk, xAxis: k, itemStyle: {
                    normal: { color: 'transparent', borderColor: '#dc143c', label: { show: false } }
                  }
                });
              }
              if (max) {
                max = max > tempDicc[k].ppk ? max : tempDicc[k].ppk;
              } else {
                max = tempDicc[k].ppk > goal ? tempDicc[k].ppk : goal;
              }
              if (min) {
                min = min < tempDicc[k].ppk ? min : tempDicc[k].ppk;
              } else {
                min = tempDicc[k].ppk < goal ? tempDicc[k].ppk : goal;
              }
              // if (this.cur_title !== 'PPK Monitor(By Monthly)') {
              //   const tempArr = [];
              //   tempArr.push(tempDicc[k].executiontime);
              //   tempArr.push(tempDicc[k].ppk);
              //   tempArr.push(tempDicc[k].usl.toString());
              //   tempArr.push(tempDicc[k].lsl.toString());
              //   tempArr.push(tempDicc[k].max.toString());
              //   tempArr.push(tempDicc[k].min.toString());
              //   tempArr.push(tempDicc[k].mean.toString());
              //   tempArr.push(tempDicc[k].sigma.toString());
              //   tempArr.push(tempDicc[k].pp.toString());
              //   tempArr.push(tempDicc[k].ppk.toString());
              //   tempArr.push(tempDicc[k].flag);
              //   seriesData.push(tempArr);
              // }
              // if (this.cur_title === 'PPK Monitor(By Monthly)') {
              //   const tempDicm = {};
              //   tempDicm['value'] = tempDicc[k].ppk;
              //   tempDicm['usl'] = tempDicc[k].usl;
              //   tempDicm['lsl'] = tempDicc[k].lsl;
              //   tempDicm['max'] = tempDicc[k].max;
              //   tempDicm['min'] = tempDicc[k].min;
              //   tempDicm['mean'] = tempDicc[k].mean;
              //   tempDicm['sigma'] = tempDicc[k].sigma;
              //   tempDicm['pp'] = tempDicc[k].pp;
              //   tempDicm['flag'] = tempDicc[k].flag;
              //   tempDicm['executiontime'] = tempDicc[k].executiontime;
              //   seriesData.push(tempDicm);
              //   xData.push(tempDicc[k].month);
              // }
              const tempDicm = {};
              tempDicm['value'] = tempDicc[k].ppk;
              tempDicm['usl'] = tempDicc[k].usl;
              tempDicm['lsl'] = tempDicc[k].lsl;
              tempDicm['max'] = tempDicc[k].max;
              tempDicm['min'] = tempDicc[k].min;
              tempDicm['mean'] = tempDicc[k].mean;
              tempDicm['sigma'] = tempDicc[k].sigma;
              tempDicm['pp'] = tempDicc[k].pp;
              tempDicm['flag'] = tempDicc[k].flag;
              tempDicm['executiontime'] = tempDicc[k].executiontime;
              if (this.cur_title !== 'PPK Monitor(By Monthly)') {
                xData.push(this.datePipe.transform(tempDicm['executiontime'], 'MM/dd HH:mm'));
              } else {
                xData.push(tempDicc[k].month);
              }
              seriesData.push(tempDicm);
            }
            this.ppkEchartArr.push(this.ppkechart(seriesData, markPointData, markLinex, stageMapping, max, min, xData));
          }
        } else {
          for (let i = data['hits']['hits'].length - 1; i > -1; i--) {
            const tempDic = {};
            tempDic['model'] = data['hits']['hits'][0]._source.modelname;
            tempDic['line'] = data['hits']['hits'][0]._source.stationline;
            tempDic['stage'] = data['hits']['hits'][0]._source.stationtype;
            tempDic['detail'] = data['hits']['hits'][i]._source.detail;
            tempDic['tdname'] = data['hits']['hits'][i]._source.tdname;
            tempDic['mdname'] = data['hits']['hits'][i]._source.mdname;
            tempDic['flag'] = data['hits']['hits'][i]._source.flag;
            tempDic['executiontime'] = data['hits']['hits'][i]._source.executiontime;
            tempDic['xbar'] = data['hits']['hits'][i]._source.xbar;
            tempDic['xbar_lcl'] = data['hits']['hits'][i]._source.xbar_lcl;
            tempDic['xbar_target'] = data['hits']['hits'][i]._source.xbar_target;
            tempDic['xbar_ucl'] = data['hits']['hits'][i]._source.xbar_ucl;
            tempDic['range'] = data['hits']['hits'][i]._source.range;
            tempDic['range_lcl'] = data['hits']['hits'][i]._source.range_lcl;
            tempDic['range_ucl'] = data['hits']['hits'][i]._source.range_ucl;
            this.allData.push(tempDic);
          }
          this.dic = this.dataService.groupBy(this.allData, 'flag');
          // console.log('整理的数据 ---  \n', this.dic);
          // 处理echart循环数据
          this.spcEchartArr = [];
          const keysArr = this.objectKeys(this.dic);
          for (let i = 0; i < keysArr.length; i++) {
            this.isShowArr.push(true);
            const seriesDataX = [];
            const markPointDataX = [];
            const markLineX = [];
            let maxX;
            let minX;
            let x_ucl;
            let x_lcl;
            const seriesDataR = [];
            const markPointDataR = [];
            const markLineR = [];
            let maxR;
            let minR;
            let r_ucl;
            let r_lcl;
            const xData = [];
            const tempDic1 = this.dic[keysArr[i]];
            for (let k = 0; k < tempDic1.length; k++) {
              // 画线
              if (markLineX.length < 1) {
                x_ucl = tempDic1[k].xbar_ucl;
                x_lcl = tempDic1[k].xbar_lcl;
                markLineX.push({ yAxis: x_ucl, label: { show: true, formatter: 'UCL' + x_ucl.toString() }, itemStyle: { normal: { color: '#FF0000' } } });
                markLineX.push({ yAxis: tempDic1[k].xbar_target, label: { show: true, formatter: 'CL' + tempDic1[k].xbar_target.toString() }, itemStyle: { normal: { color: '#2E8B57' } } });
                markLineX.push({ yAxis: x_lcl, label: { show: true, formatter: 'LCL' + x_lcl.toString() }, itemStyle: { normal: { color: '#FF0000' } } });
              }
              if (markLineR.length < 1) {
                r_ucl = tempDic1[k].range_ucl;
                r_lcl = tempDic1[k].range_lcl;
                markLineR.push({ yAxis: r_ucl, label: { show: true, formatter: 'UCL' + r_ucl.toString() }, itemStyle: { normal: { color: '#FF0000' } } });
                markLineR.push({ yAxis: r_lcl, label: { show: true, formatter: 'LCL' + r_lcl.toString() }, itemStyle: { normal: { color: '#FF0000' } } });
              }
              // 获取异常点
              if (x_ucl < tempDic1[k].xbar || x_lcl > tempDic1[k].xbar) {
                markPointDataX.push({
                  name: tempDic1[k].flag, symbol: 'circle', symbolSize: 5, yAxis: tempDic1[k].xbar, xAxis: k, itemStyle: {
                    normal: { color: 'transparent', borderColor: '#dc143c', label: { show: false } }
                  }
                });
              }
              if (r_ucl < tempDic1[k].range || r_lcl > tempDic1[k].range) {
                markPointDataR.push({
                  name: tempDic1[k].flag, symbol: 'circle', symbolSize: 5, yAxis: tempDic1[k].range, xAxis: k, itemStyle: {
                    normal: { color: 'transparent', borderColor: '#dc143c', label: { show: false } }
                  }
                });
              }
              // 获取最直
              if (maxX) {
                maxX = maxX > tempDic1[k].xbar ? maxX : tempDic1[k].xbar;
              } else {
                maxX = tempDic1[k].xbar > x_ucl ? tempDic1[k].xbar : x_ucl;
              }
              if (minX) {
                minX = minX < tempDic1[k].xbar ? minX : tempDic1[k].xbar;
              } else {
                minX = tempDic1[k].xbar < x_lcl ? tempDic1[k].xbar : x_lcl;
              }

              if (maxR) {
                maxR = maxR > tempDic1[k].range ? maxR : tempDic1[k].range;
              } else {
                maxR = tempDic1[k].range > r_ucl ? tempDic1[k].range : r_ucl;
              }
              if (minR) {
                minR = minR < tempDic1[k].range ? minR : tempDic1[k].range;
              } else {
                minR = tempDic1[k].range < r_lcl ? tempDic1[k].range : r_lcl;
              }
              // const tempArrX = [];
              // tempArrX.push(element.executiontime);
              // tempArrX.push(element.xbar);
              // tempArrX.push(element.flag);
              // seriesDataX.push(tempArrX);
              const dicX = {};
              dicX['value'] = tempDic1[k].xbar;
              dicX['executiontime'] = tempDic1[k].executiontime;
              dicX['flag'] = tempDic1[k].flag;
              seriesDataX.push(dicX);
              // const tempArrR = [];
              // tempArrR.push(element.executiontime);
              // tempArrR.push(element.range);
              // tempArrR.push(element.flag);
              // seriesDataR.push(tempArrR);
              const dicR = {};
              dicR['value'] = tempDic1[k].range;
              dicR['executiontime'] = tempDic1[k].executiontime;
              dicR['flag'] = tempDic1[k].flag;
              seriesDataR.push(dicR);
              xData.push(this.datePipe.transform(tempDic1[k].executiontime, 'MM/dd HH:mm'));
            }
            this.spcEchartArr.push(this.spcechart(stageMapping, seriesDataX, seriesDataR, markLineX, markLineR, markPointDataX, markPointDataR, maxX, minX, maxR, minR, xData));
          }
        }
      }
    });
  }


  // 以时间戳获取选中年月的第一天和最后一天
  numberToDate(number: any, isLastDate: boolean) {
    const date = new Date(number);
    const YY = Number(date.getFullYear());
    const MM = Number((date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1));
    const DD = Number((date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()));
    if (isLastDate) {
      const dateNumber = new Date(YY, MM, 0).getDate();
      return new Date(YY + '-' + MM + '-' + dateNumber).getTime();
    } else {
      return new Date(YY + '-' + MM + '-' + 1).getTime();
    }
  }


  numberToEnmonth(str: string) {
    if (str === '01') {
      return 'Jan';
    }
    if (str === '02') {
      return 'Feb';
    }
    if (str === '03') {
      return 'Mar';
    }
    if (str === '04') {
      return 'Apr';
    }
    if (str === '05') {
      return 'May';
    }
    if (str === '06') {
      return 'Jun';
    }
    if (str === '07') {
      return 'Jul';
    }
    if (str === '08') {
      return 'Aug';
    }
    if (str === '09') {
      return 'Sep';
    }
    if (str === '10') {
      return 'Oct';
    }
    if (str === '11') {
      return 'Nov';
    }
    if (str === '12') {
      return 'Dec';
    }
  }


  isShow(key) {
    if (this.isShowArr[key]) {
      this.isShowArr[key] = false;
    } else {
      this.isShowArr[key] = true;
    }
  }

  ppkechart(seriesData, markPointData, markLinex, stageMapping, max, min, xData) {
    let title: String;
    let xType;
    let xName;
    if (this.cur_title === 'PPK Monitor(Real-time)') {
      // xType = 'time';
      xType = 'category';
      xName = 'Time';
      if (stageMapping.length > 0 && stageMapping[0]['englishContrast'] !== null) {
        title = `Real-Time PPK Monitor: random sampling 100pcs to calculate PPK / Shift(${stageMapping[0]['englishContrast']}:${seriesData[0]['flag']})`;
      } else {
        title = 'Real-Time PPK Monitor: random sampling 100pcs to calculate PPK / Shift';
      }
    } else if (this.cur_title === 'PPK Monitor(By Monthly)') {
      xType = 'category';
      xName = 'Month';
      if (stageMapping.length > 0 && stageMapping[0]['englishContrast'] !== null) {
        title = `Monthly PPK Monitor: random sampling 100pcs to calculate PPK / month(${stageMapping[0]['englishContrast']}:${seriesData[0].flag})`;
      } else {
        title = 'Monthly PPK Monitor: random sampling 100pcs to calculate PPK / month';
      }
    }
    const option = {
      title: {
        text: title,
        show: false
      },
      grid: {
        y: 70,
        y2: 60,
        x: 70
      },
      tooltip: {
        trigger: 'axis',
        // axisPointer: {
        //   type: 'shadow'
        // },
        backgroundColor: 'rgba(255,255,255,0.7)',
        axisPointer: {
          type: 'shadow',
          crossStyle: {
            color: '#999'
          }
        },
        textStyle: {
          color: 'black',
          fontSize: 10
        },
        formatter: function (params) {
          params = params;
          let value = '';
          // if (xName === 'Time') {
          //   for (let i = 0; i < params.length; i++) {
          //     const currentItemData = params[i].data;
          //     value = '<span style="color: black; display:block;background-color:grey; margin-top:5px">' + 'Statistical Indicator' + '</span>' + 'USL: ' + currentItemData[2] + '<br>'
          //       + 'LSL: ' + currentItemData[3] + '<br>' + 'Max: ' + currentItemData[4] + '<br>' + 'Min: ' + currentItemData[5] + '<br>' + 'Mean: ' + currentItemData[6] + '<br>'
          //       + 'σ: ' + currentItemData[7] + '<span style="color: black; display:block;background-color:grey; margin-top:5px">' + 'Process Capability' + '</span>'
          //       + 'Pp: ' + currentItemData[8] + '<br>' + 'PPK: ' + currentItemData[9];
          //   }
          // } else {
          //   const data = params[0].data;
          //   value = '<span style="color: black; display:block;background-color:grey; margin-top:5px">' + 'Statistical Indicator' + '</span>' + 'USL: ' + data['usl'] + '<br>'
          //     + 'LSL: ' + data['lsl'] + '<br>' + 'Max: ' + data['max'] + '<br>' + 'Min: ' + data['min'] + '<br>' + 'Mean: ' + data['mean'] + '<br>'
          //     + 'σ: ' + data['sigma'] + '<span style="color: black; display:block;background-color:grey; margin-top:5px">' + 'Process Capability' + '</span>'
          //     + 'Pp: ' + data['pp'] + '<br>' + 'PPK: ' + data['value'];
          // }
          const data = params[0].data;
          value = '<span style="color: black; font-size:15px; display:block;background-color:grey; margin-top:5px">' + 'Statistical Indicator' + '</span>' + 'USL: ' + data['usl'] + '<br>'
            + 'LSL: ' + data['lsl'] + '<br>' + 'Max: ' + data['max'] + '<br>' + 'Min: ' + data['min'] + '<br>' + 'Mean: ' + data['mean'] + '<br>'
            + 'σ: ' + data['sigma'] + '<span style="color: black; font-size: 15px; display:block;background-color:grey; margin-top:5px">' + 'Process Capability' + '</span>'
            + 'Pp: ' + data['pp'] + '<br>' + 'PPK: ' + data['value'];
          return value;
        }
      },
      backgroundColor: 'rgba(255,255,255,0.7)',
      xAxis: {
        type: xType,
        name: xName,
        nameTextStyle: {
          color: '#333'
        },
        data: xData,
        scale: true,
        axisLabel: {
          'interval': 0,
          rotate: 40
        },
      },
      yAxis: {
        name: 'Value',
        type: 'value',
        nameTextStyle: {
          color: '#333'
        },
        max: function (value) {
          return (max + 0.5).toFixed(2);
        },
        min: function (value) {
          return (min - 0.5).toFixed(2);
        }
      },
      series: [{
        symbolSize: 3,
        itemStyle: {
          normal: {
            borderWidth: 5,
            borderColor: '#7EC0EE',
            color: '#7EC0EE',
            label: {
              show: true,
              position: 'top',
              color: 'black',
            }
          }
        },
        data: seriesData,
        type: 'line',
        smooth: true,
        showSymbol: true,
        markPoint: {
          data: markPointData,
        },
        markLine: {
          silent: true,
          data: markLinex
        }
      }],
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          inside: false
        }
      ],
    };
    return option;
  }

  spcechart(stageMapping, seriesDataX, seriesDataR, markLineX, markLineR, markPointDataX, markPointDataR, maxX, minX, maxR, minR, xData) {
    const option = {
      title: [{
        left: 'center',
        text: `${seriesDataX[0]['flag']}  Average(X chart)`
      }, {
        top: '55%',
        left: 'center',
        text: `${seriesDataX[0]['flag']}  Range(R chart)`
      }],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          crossStyle: {
            color: '#999'
          }
        },
      },
      backgroundColor: 'rgba(255,255,255,0.7)',
      xAxis: [{
        type: 'category',
        data: xData,
        axisLabel: {
          'interval': 0,
          rotate: 40
        },
      }, {
        type: 'category',
        data: xData,
        gridIndex: 1,
        axisLabel: {
          'interval': 0,
          rotate: 40
        },
      }],
      yAxis: [{
        type: 'value',
        splitLine: { show: false },
        max: function (value) {
          return (maxX + 0.5).toFixed(2);
        },
        min: function (value) {
          return (minX - 0.5).toFixed(2);
        }
      }, {
        type: 'value',
        splitLine: { show: false },
        max: function (value) {
          return (maxR + 0.5).toFixed(2);
        },
        min: function (value) {
          return (minR - 0.5).toFixed(2);
        },
        gridIndex: 1
      }],
      grid: [{
        bottom: '60%'
      }, {
        top: '65%'
      }],
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          disabled: false,
          bottom: '50%'
        },
        {
          type: 'slider',
          show: true,
          xAxisIndex: [1],
          inside: false
        }
      ],
      series: [
        {
          markLine: { data: markLineX, silent: true },
          markPoint: { data: markPointDataX },
          itemStyle: {
            normal: {
              borderWidth: 5,
              borderColor: '#7EC0EE',
              color: '#7EC0EE',
              label: {
                show: true,
                position: 'top',
                color: 'black',
              }
            }
          },
          type: 'line',
          showSymbol: true,
          data: seriesDataX,
          color: 'blue',
        },
        {
          markPoint: { data: markPointDataR },
          markLine: { data: markLineR, silent: true },
          itemStyle: {
            normal: {
              borderWidth: 5,
              borderColor: '#7EC0EE',
              color: '#7EC0EE',
              label: {
                show: true,
                position: 'top',
                color: 'black',
              }
            }
          },
          type: 'line',
          showSymbol: true,
          data: seriesDataR,
          color: 'green',
          xAxisIndex: 1,
          yAxisIndex: 1,
        }]
    };
    return option;
  }


  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  show_boxs(e) {
    this.isVisible = true;
    let flag;
    let xAxis;
    let index;
    if (e['data']['name']) { // 此处点击的是带圈的点
      flag = e['data']['name'];
      xAxis = e['data']['xAxis'];
      // if (this.cur_title === 'SPC Monitor') {
      //   index = this.dic[flag].findIndex(e => e.executiontime === xAxis);
      // } else {
      //   index = xAxis;
      // }
      index = xAxis;
    } else {
      // if (this.cur_title === 'PPK Monitor(Real-time)') {
      //   flag = e['data'][10];
      //   xAxis = e['data'][0];
      // } else if (this.cur_title === 'PPK Monitor(By Monthly)') {
      //   flag = e['data'].flag;
      //   xAxis = e['data'].executiontime;
      // }
      if (this.cur_title !== 'SPC Monitor') {
        flag = e['data'].flag;
        xAxis = e['data'].executiontime;
        index = this.dic[flag].findIndex(e => e.executiontime === xAxis);
      } else {
        flag = e['data']['flag'];
        xAxis = e['data']['executiontime'];
        index = this.dic[flag].findIndex(e => e.executiontime === xAxis);
      }
    }

    if (index > -1) {
      const dataArr = this.dic[flag][index];
      this.downLoadData = [];
      dataArr['detail'].forEach(element => {
        const tempDic = {};
        tempDic['model'] = dataArr.model;
        tempDic['line'] = dataArr.line;
        tempDic['stage'] = dataArr.stage;
        tempDic['unitserialnumber'] = element.unitserialnumber;
        tempDic['tdname'] = dataArr.tdname;
        tempDic['mdname'] = dataArr.mdname;
        tempDic['startdate'] = this.datePipe.transform(element.startdate, 'yyyy/MM/dd HH:mm:ss');
        tempDic['stopdate'] = this.datePipe.transform(element.stopdate, 'yyyy/MM/dd HH:mm:ss');
        tempDic['mdresult'] = element.mdresult;
        if (this.cur_title === 'SPC Monitor') {
          tempDic['mdupperlimit'] = element.mdupperlimit;
          tempDic['mdlowerlimit'] = element.mdlowerlimit;
        } else {
          tempDic['mdupperlimit'] = dataArr.mdupperlimit;
          tempDic['mdlowerlimit'] = dataArr.mdlowerlimit;
        }
        this.downLoadData.push(tempDic);
      });
    }
  }

  downloadTotal() {
    if (this.downLoadData.length > 0) {
      const downloadDatas = this.downLoadData.map(res => {
        return {
          'Model Name': res.model,
          'Line': res.line,
          'Stage': res.stage,
          'Serial Number': res.unitserialnumber,
          'Test Item': res.tdname,
          'Sub Test Item': res.mdname,
          'Start Test Date': res.startdate,
          'End Test Date': res.stopdate,
          'Test Value': res.mdresult,
          'UpperLimit': res.mdupperlimit,
          'LowerLimit': res.mdlowerlimit
        };
      });
      const colWidth = [];
      Object.keys(this.downLoadData[0]).forEach((element, index) => {
        if (index === 3 || index === 4) {
          colWidth.push({ wpx: 180 });
        } else {
          colWidth.push({ wpx: 130 });
        }
      });
      const headerBgColor = '53868B';
      let downLoadTitle;
      if (this.cur_title === 'PPK Monitor(By Monthly)') {
        downLoadTitle = 'PPK Monitor(By Monthly)';
      } else if (this.cur_title === 'PPK Monitor(Real-time)') {
        downLoadTitle = 'PPK Monitor(Real-time)';
      } else {
        downLoadTitle = 'SPC Monitor';
      }
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(downloadDatas)), downLoadTitle, colWidth, headerBgColor);
    }
  }
}
