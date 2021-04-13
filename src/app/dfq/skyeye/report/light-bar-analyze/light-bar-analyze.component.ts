import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { GlobalService } from '@service/skyeye/global.service';
import { NzMessageService } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-light-bar-analyze',
  templateUrl: './light-bar-analyze.component.html',
  styleUrls: ['./light-bar-analyze.component.scss']
})
export class LightBarAnalyzeComponent implements OnInit {
  line_chart;
  spotEchartArr = [];
  downLoadExcelData = []; // 下载的数据
  timer;
  cur_site;
  siteInfos;
  siteGroup;
  cur_plant;
  plantGroup = [];
  cur_line;
  lineGroup = [];
  cur_section;
  cur_sectionId;
  sectionGroup = [];
  cur_item; // 治具編號
  cur_mdname;
  datefrom;
  dateto;
  datefromT; // 转化成日期形式
  dateToT; // 转化成日期形式
  itemGroup = [];
  mdGroup = [];
  cur_model;
  initEsData: {}[] = [];
  filterEsData: {}[] = [];
  modelGroup = [];
  modelArr = [];
  mdArr = [];
  objectKeys = Object.keys;
  objectValue = Object.values;
  queryButton = true;
  project = 'light_bar';
  isDMCLink = false;
  cur_date;
  upperLowerDic = {};
  startInput;
  endInput = 1500;
  public subject = new Subject();

  // 以下的参数为新数据结构的变量
  dateInputFrom;
  dateInputTo;
  dicSoprtArr = {}; // 每个治具编号对应的所有mdresult10
  sportArrDic = {}; // 每个治具编号对应的数据
  lineDic = {}; // 存入ma数据的折线
  nzdisabled = true; // 时间未选则其他条件皆不能选择
  isShowLineEchart = false;
  dataArr = [];
  constructor(
    private dataService: LineDataServiceService,
    private esService: EsDataServiceService,
    private globals: GlobalService,
    private message: NzMessageService,
    private datePipe: DatePipe,
    private excelService: ExcelToolService,
    private activatedRoute: ActivatedRoute
  ) {
    const queryPars = this.activatedRoute.queryParams['_value'];
    if (Object.keys(queryPars).length > 0) {
      this.cur_line = queryPars.line;
      this.cur_mdname = queryPars.item;
      this.project = queryPars.project;
      // this.project = 'light_bar';
      this.dataService.getSectionByLine(this.cur_line, queryPars.site, queryPars.plant).subscribe(res => {
        this.cur_section = res;
        this.cur_section = this.cur_section[0]['section']['name'];
        this.cur_plant = queryPars.plant;
        let timeNumber;
        if (queryPars.datefrom.length > 17) { // 从看板跳转过来的是时间日期格式
          // 日期转时间戳
          timeNumber = new Date(queryPars.datefrom).getTime();
        } else { // 从DMC链接过来的是时间戳格式
          timeNumber = parseInt(queryPars.datefrom, 0);
        }
        this.cur_site = String(queryPars.site).toUpperCase();
        this.datefrom = timeNumber - 600000;
        this.dateto = timeNumber + 600000; // 往后推10分鐘
        this.datefromT = this.numberToDate(this.datefrom, true);
        this.dateToT = this.numberToDate(this.dateto, true);
        this.cur_model = queryPars.model;
        this.cur_item = [queryPars.fixId];
        this.isDMCLink = true;
        this.selectStatus();
        // this.ngOnInit();
        this.dmcFun();
      });
    }
  }



  async dmcFun() {
    this.siteInfos = JSON.parse(localStorage.getItem('Skyeye_plantMapping'));
    this.siteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    // tslint:disable-next-line: no-shadowed-variable
    this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
      return res['Plant'];
    });
    await this.getESDatas('light_bar');
    this.filterData();
    this.mdGroup = this.dataService.groupBy(this.filterEsData, 'mdname');
    this.mdGroup = this.objectKeys(this.mdGroup);
    this.filterData();
    this.modelGroup = this.dataService.groupBy(this.filterEsData, 'model');
    this.modelGroup = this.objectKeys(this.modelGroup);
    this.filterData();
    this.itemGroup = this.dataService.groupBy(this.filterEsData, 'item');
    this.itemGroup = this.objectKeys(this.itemGroup);
    this.itemGroup = this.itemGroup.map(res => {
      if (res === '') {
        return 'NA';
      } else {
        return res;
      }
    });
    if (this.cur_model) {
      this.query();
      this.queryButton = false;
    }
  }


  async ngOnInit() {
    this.cur_date = new Date().getTime();
    this.siteInfos = JSON.parse(localStorage.getItem('Skyeye_plantMapping'));
    this.siteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    this.subject.pipe(debounceTime(500)).subscribe(() => {
      this.setMAMaxMin();
    }
  );
  }


  async getOptions(type) {
    this.isDMCFun();
    if (type === 'site') {
      this.cur_plant = undefined;
      this.plantGroup = [];
      this.cur_line = undefined;
      this.lineGroup = [];
      this.cur_mdname = undefined;
      this.mdGroup = [];
      this.cur_model = undefined;
      this.modelGroup = [];
      this.cur_item = [];
      this.itemGroup = [];
      this.queryButton = true;
      this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
        return res['Plant'];
      });
    }

    if (type === 'plant') {
      this.cur_line = undefined;
      this.lineGroup = [];
      this.cur_mdname = undefined;
      this.mdGroup = [];
      this.cur_model = undefined;
      this.modelGroup = [];
      this.cur_item = [];
      this.itemGroup = [];
      this.queryButton = true;
      if (this.cur_plant) {
        await this.getESDatas('light_bar');
      }
    }

    if (type === 'line') {
      this.cur_mdname = undefined;
      this.mdGroup = [];
      this.cur_model = undefined;
      this.modelGroup = [];
      this.cur_item = [];
      this.itemGroup = [];
      this.queryButton = true;
      this.mdGroup = [];
      await this.filterData();
      this.mdGroup = this.dataService.groupBy(this.filterEsData, 'mdname');
      this.mdGroup = this.objectKeys(this.mdGroup);
    }

    if (type === 'mdname') {
      this.cur_model = undefined;
      this.modelGroup = [];
      this.cur_item = [];
      this.itemGroup = [];
      this.queryButton = true;
      this.filterData();
      this.modelGroup = this.dataService.groupBy(this.filterEsData, 'model');
      this.modelGroup = this.objectKeys(this.modelGroup);
      console.log('modelGroup 数据 ===== \n', this.modelGroup);
    }

    if (type === 'model') {
      this.cur_item = [];
      this.itemGroup = [];
      if (this.cur_model === '' || this.cur_model === undefined) {
        this.cur_mdname = '';
      }
      this.queryButton = true;
      this.filterData();
      this.itemGroup = this.dataService.groupBy(this.filterEsData, 'item');
      this.itemGroup = this.objectKeys(this.itemGroup);
      this.itemGroup = this.itemGroup.map(res => {
        if (res === '') {
          return 'NA';
        } else {
          return res;
        }
      });
    }

    if (type === 'fixture') {
      if (this.cur_item.length === 0 || this.cur_item === undefined || this.cur_item === null) {
        this.queryButton = true;
      } else {
        if (this.cur_mdname && this.cur_model && this.cur_item) {
          this.queryButton = false;
        }
      }
    }
    this.selectStatus();
  }

  isDMCFun() {
    if (this.isDMCLink) {
      this.isDMCLink = false;
      this.datefrom = undefined;
      this.dateto = undefined;
      this.datefromT = undefined;
      this.dateToT = undefined;
    }
  }

  getOptionDate(result: Date, type) {
    this.isDMCFun();
    if (type === 'dateTo') {
      this.dateto = result ? result.getTime() : undefined;
      this.dateToT = this.numberToDate(this.dateto, true);
    }
    if (type === 'dateFrom') {
      this.datefrom = result ? result.getTime() : undefined;
      this.datefromT = this.numberToDate(this.datefrom, true);
    }


    if (this.datefrom && this.dateto) {

      this.line_chart = '';
      this.isShowLineEchart = false;
      this.dataArr = [];
      this.spotEchartArr = [];
      if (this.dateto - this.datefrom > 604800000) {
        this.datefrom = this.dateto - 604800000;
        this.datefromT = this.numberToDate(this.datefrom, true);
        // console.log(this.dateToT, this.datefromT)
      }
    }



    this.isDMCLink = false;
    this.cur_site = undefined;
    this.cur_plant = undefined;
    this.plantGroup = [];
    this.cur_line = undefined;
    this.lineGroup = [];
    this.cur_mdname = undefined;
    this.mdGroup = [];
    this.cur_model = undefined;
    this.modelGroup = [];
    this.cur_item = [];
    this.itemGroup = [];
    this.selectStatus();
  }


  selectStatus() {
    if (this.datefrom && this.dateto) {
      this.nzdisabled = false;
      if (this.cur_item.length > 0) {
        this.queryButton = false;
      } else {
        this.queryButton = true;
      }
    } else {
      this.nzdisabled = true;
      this.queryButton = true;
    }
  }

  filterData() {
    this.filterEsData = this.initEsData;
    if (this.cur_line !== undefined && this.cur_line !== null && this.cur_line !== '') {
      this.filterEsData = this.filterEsData.filter(res => res['line'] === this.cur_line);
    }

    if (this.cur_mdname !== undefined && this.cur_mdname !== null && this.cur_mdname !== '') {
      this.filterEsData = this.filterEsData.filter(res => res['mdname'] === this.cur_mdname);
    }
    if (this.cur_model !== undefined && this.cur_model !== null && this.cur_model !== '') {
      this.filterEsData = this.filterEsData.filter(res => res['model'] === this.cur_model);
    }
  }

  async getESDatas(type, op?) {
    this.mdArr = []; // 站别
    this.modelArr = [];
    this.initEsData = [];
    let date_range;
    let size;

    if (this.datefrom !== undefined && this.dateto !== undefined) {
      date_range = `"range": {
        "insertdt": {
          "lte": ${this.dateto},
          "gte": ${this.datefrom}
        }
      }`;
      size = `"size": 10000`;
    } else {
      date_range = `"range": {
        "insertdt": {
          "lte": ${new Date().getTime()}
        }
      }`;
      size = `"size": 10000`;
    }
    if (type === 'light_bar') {
      let esURL;
      if (this.cur_site !== 'WKS') {
        esURL = this.esService.getUrl(type + '/', '_' + this.cur_site.toLowerCase());
      } else {
        esURL = this.esService.getUrl(type + '/');
      }
      const querys = this.esService.getLightBarOp(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(), date_range, size);
      console.log('查询的条件\n', esURL, querys);
      const data = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
      // this.initEsData = data;
      console.log(' lightbar  查询到的数据 data ===== \n', data);
      for (let i = 0; i < data['hits']['hits'].length; i++) {
        this.lineGroup.push(data['hits']['hits'][i]._source.stationline);
        this.lineGroup = Array.from(new Set(this.lineGroup)); // 去重
        this.lineGroup = this.lineGroup.filter(function(e) {return e});
        const dataitem = {
          line: data['hits']['hits'][i]._source.stationline,
          mdname: data['hits']['hits'][i]._source.stationtype,
          model: data['hits']['hits'][i]._source.modelname,
          item: data['hits']['hits'][i]._source.stationid,
        };
        this.initEsData.push(dataitem);
      }
    }
  }

  async query(type?) {
    if (this.cur_item) {
      // 当没有选择结束时间，则默认为当前时间开始到前一天的当前时间；如果开始时间和结束时间跨度超过一周，则默认一周
      // 如果没有选择时间
      // if (this.dateto === undefined || this.datefrom === undefined) {
      //   // 获取当前时间戳
      //   this.dateto = new Date().getTime();
      //   this.datefrom = this.dateto - 24 * 3600 * 1000;
      //   this.dateToT = this.numberToDate(this.dateto, true);
      //   this.datefromT = this.numberToDate(this.datefrom, true);
      //   // console.log(this.dateto, this.datefrom)
      // }
      this.selectStatus();
      // if (this.dateto - this.datefrom > 604800000 || this.dateto - this.datefrom < 0) {
      //   this.datefrom = this.dateto - 604800000;
      //   this.datefromT = this.numberToDate(this.datefrom, true);
      //   // console.log(this.dateToT, this.datefromT)
      // }

      clearInterval(this.timer);
      if (type !== 'history') { // 如果是history 则为从DMC链接过来的
        this.getData();
        this.timer = setInterval(async () => {
          this.getData();
        }, 60000 * 10);
      } else {
        this.getData();
      }
    }
  }

  //  下载数据
  downloadDataFun(data, title) {
    if (data) {
      const downloadDatas = data.map(res => {
        return {
          '開始日期': res['startdate'],
          '結束日期': res['stopdate'],
          '廠別': res['site'],
          '廠區': res['plant'],
          '線別': res['stationline'],
          '機種': res['modelname'],
          '站別': res['stationtype'],
          '治具編號': res['stationid'],
          'BeforeKvalue': res['mdresult'],
          'MA值': res['ma']
        };
      });
      const colWidth = [];
      Object.keys(data[0]).forEach(element => {
        colWidth.push({ wpx: 150 });
      });
      const headerBgColor = '53868B';
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(downloadDatas)), title, colWidth, headerBgColor);
    }
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    clearInterval(this.timer);
    const abnormal_data = {
      num: null,
      type: 'none'
    };
    this.globals.AbnormalPot_subject.next(abnormal_data);
  }

  // 获取数据
  getData() {
    // 在查询es的数据时
    let itemStr = '';
    if (this.cur_item && this.cur_site) {
      if (typeof (this.cur_item) === 'string') {
        itemStr = this.cur_item;
      } else {
        itemStr = this.cur_item.join('","');
      }

      let esURL;
      if (this.cur_site !== 'WKS') {
        esURL = this.esService.getUrl('light_bar/', '_' + this.cur_site.toLowerCase());
      } else {
        esURL = this.esService.getUrl('light_bar/');
      }
      let date_range;
      let size;
      if (this.datefrom !== undefined && this.dateto !== undefined) {
        date_range = `"range": {
          "insertdt": {
            "lte": ${this.dateto},
            "gte": ${this.datefrom}
          }
        }`;
        size = `"size": 10000`;
      } else {
        date_range = `"range": {
          "insertdt": {
            "lte": ${new Date().getTime()}
          }
        }`;
        size = `"size": 5000`;
      }
      let querys;
      querys = this.esService.getQueryByLightBar(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(),
        this.cur_line.toUpperCase(), this.cur_mdname.toUpperCase(), this.cur_model, itemStr, date_range, size);
      console.log('---------------------------------------------- \n', querys);
      querys = JSON.parse(querys);
      this.esService.postData(esURL, querys).subscribe(data => {
        console.log('lightbar  查询到的数据\n', data);
        if (data['hits']['hits'].length > 10000) {
          this.message.create('success', '查詢範圍過大，請重新選擇查詢日期');
          return;
        }

        this.upperLowerDic = {};
        this.sportArrDic = {};
        this.dicSoprtArr = {};
        this.lineDic = {};
        if (data['hits']['hits'].length > 0) {
          this.isShowLineEchart = true;
          this.downLoadExcelData = [];
          for (let j = 0; j < this.cur_item.length; j++) {
            const tempArr = [];
            const tempSportArr = [];
            const lineMaArr = [];
            const tempUpperLowerDic = {};

            for (let i = data['hits']['hits'].length - 1; i > -1; i--) {
              if (data['hits']['hits'][i]._source.stationid === this.cur_item[j]) {
                // 存入每个治具编号对应的MA折线数据
                const tempLineMaArr = [];
                tempLineMaArr.push(data['hits']['hits'][i]._source.insertdt);
                tempLineMaArr.push(data['hits']['hits'][i]._source.ma);
                lineMaArr.push(tempLineMaArr);

                if (this.objectKeys(tempUpperLowerDic).length === 0) {
                  // 存入每个治具编号对应的上下限
                  tempUpperLowerDic['lowerlimit'] = data['hits']['hits'][i]._source.lowerlimit;
                  tempUpperLowerDic['upperlimit'] = data['hits']['hits'][i]._source.upperlimit;
                }
                for (let k = 0; k < data['hits']['hits'][i]._source.detail.length; k++) {
                  const arr = [];
                  arr.push(data['hits']['hits'][i]._source.detail[k].item_insertdt);
                  arr.push(Math.floor(data['hits']['hits'][i]._source.detail[k].mdresult * 100) / 100);
                  tempArr.push(arr);
                  tempSportArr.push(Math.floor(data['hits']['hits'][i]._source.detail[k].mdresult / 10) * 10);
                  // 下载的数据
                  const tempDownLoadDic = {};
                  tempDownLoadDic['startdate'] = this.datePipe.transform(data['hits']['hits'][i]._source.detail[k].startdate, 'yyyy-MM-dd HH:mm:ss');
                  tempDownLoadDic['stopdate'] = this.datePipe.transform(data['hits']['hits'][i]._source.detail[k].stopdate, 'yyyy-MM-dd HH:mm:ss');
                  tempDownLoadDic['site'] = data['hits']['hits'][i]._source.site;
                  tempDownLoadDic['plant'] = data['hits']['hits'][i]._source.plant;
                  tempDownLoadDic['stationline'] = data['hits']['hits'][i]._source.stationline;
                  tempDownLoadDic['modelname'] = data['hits']['hits'][i]._source.modelname;
                  tempDownLoadDic['stationtype'] = data['hits']['hits'][i]._source.stationtype;
                  tempDownLoadDic['stationid'] = data['hits']['hits'][i]._source.stationid;
                  tempDownLoadDic['mdresult'] = data['hits']['hits'][i]._source.detail[k].mdresult;
                  tempDownLoadDic['ma'] = data['hits']['hits'][i]._source.ma;
                  tempDownLoadDic['insertdt'] = data['hits']['hits'][i]._source.insertdt;
                  this.downLoadExcelData.push(tempDownLoadDic);

                }
              }
              this.sportArrDic[this.cur_item[j]] = tempArr;
              this.dicSoprtArr[this.cur_item[j]] = tempSportArr;
              this.lineDic[this.cur_item[j]] = lineMaArr;
              this.upperLowerDic[this.cur_item[j]] = tempUpperLowerDic;
            }
          }
        }

        if (this.isShowLineEchart) {
          console.log('整个数据对应的字典\n', this.sportArrDic);
          console.log('趋势图对应的所有数据\n', this.dicSoprtArr);
          console.log('每个线对应的ma折线数据\n', this.lineDic);
          console.log('每个线对应的 上下限 数据\n', this.upperLowerDic);
          console.log('下载的数据 \n', this.downLoadExcelData);
          // 获取所有处理过的mdresult
          const dicSportKeyArr = this.objectKeys(this.dicSoprtArr);
          const dicArr = [];
          for (let k = 0; k < dicSportKeyArr.length; k++) {
            const aim = [];
            for (let i = 0; i < this.dicSoprtArr[dicSportKeyArr[k]].length; i++) {
              // tslint:disable-next-line: no-shadowed-variable
              const temp = {};
              temp['value'] = this.dicSoprtArr[dicSportKeyArr[k]][i];
              temp['count'] = this.getSameValueCount(this.dicSoprtArr[dicSportKeyArr[k]], this.dicSoprtArr[dicSportKeyArr[k]][i]);
              aim.push(temp);
            }
            // 出去重复的mdresult数组
            let singleDataArr = [];
            const obj = {};
            // tslint:disable-next-line: no-shadowed-variable
            singleDataArr = aim.reduce((item: any, next) => {
              // tslint:disable-next-line: no-unused-expression
              obj[next.value] ? '' : obj[next.value] = true && item.push(next);
              return item;
            }, []);
            // 将数据按照cpk的数值从小到大排列
            singleDataArr.sort((a, b) => {
              return a.value - b.value;
            });
            dicArr[dicSportKeyArr[k]] = singleDataArr;
          }
          console.log('趋势图的最终数据 \n', dicArr);
          if (dicArr) {
            // 折线的颜色
            const colorArr = ['#000000', '#0000CC', '#006600', '#CC0000', '#CC9900', '#CC00FF', '#FF0099', '#8B4513'];
            const titleArr = this.objectKeys(dicArr);
            this.dataArr = [];
            for (let i = 0; i < this.objectKeys(dicArr).length; i++) {
              const itemArr = [];
              for (let j = 0; j < dicArr[this.objectKeys(dicArr)[i]].length; j++) {
                const tempArr = [];
                tempArr.push(dicArr[this.objectKeys(dicArr)[i]][j].value);
                tempArr.push(dicArr[this.objectKeys(dicArr)[i]][j].count);
                itemArr.push(tempArr);
              }
              this.dataArr.push(
                { itemStyle: { normal: { color: colorArr[i] } }, name: this.objectKeys(dicArr)[i], symbolSize: 5, type: 'line', smooth: true, showSymbol: true, data: itemArr }
              );
            }
            if (this.dataArr.length > 0) {
              this.lightBarLineChart(titleArr, this.dataArr);
            }
          }
          this.setMAMaxMin();
        }

      });
    }
  }

  setMAMaxMin() {
    this.spotEchartArr = [];
    for (let key = 0; key < this.cur_item.length; key++) {
      if (this.lineDic[this.cur_item[key]] && this.lineDic[this.cur_item[key]].length > 0) {
        const tempSportArr = [];
        const tempLineArr = [];
        this.sportArrDic[this.cur_item[key]].forEach(element => {
          if (element[1] < this.endInput) {
            tempSportArr.push(element);
          }
        });
        this.lineDic[this.cur_item[key]].forEach(element => {
          if (element[1] < this.endInput) {
            tempLineArr.push(element);
          }
        });

        // 获取每个治具编号对应的上下限
        const seriesData = [];
        if (this.upperLowerDic[this.cur_item[key]]['upperlimit'] <= this.endInput) {
          seriesData.push({
            name: '散点', data: tempSportArr, type: 'scatter', itemStyle: { normal: { color: '#000066' } }, symbolSize: 5,
            markLine: {
              silent: true, data: [
                { name: 'upper', yAxis: this.upperLowerDic[this.cur_item[key]]['upperlimit'], xAxis: 0, label: { show: true }, itemStyle: { normal: { color: '#dc143c' } } },
                { name: 'lower', yAxis: this.upperLowerDic[this.cur_item[key]]['lowerlimit'], xAxis: 0, itemStyle: { normal: { color: '#abc327' } } }]
            }
          },
            { name: '折线', data: tempLineArr, itemStyle: { normal: { color: '#800080' } }, type: 'line' });
        } else if (this.upperLowerDic[this.cur_item[key]]['lowerlimit'] > this.endInput) {
          seriesData.push({ name: '散点', data: tempSportArr, type: 'scatter', itemStyle: { normal: { color: '#000066' } }, symbolSize: 5 },
          { name: '折线', data: tempLineArr, itemStyle: { normal: { color: '#800080' } }, type: 'line' });
        } else {
          seriesData.push({
            name: '散点', data: tempSportArr, type: 'scatter', itemStyle: { normal: { color: '#000066' } }, symbolSize: 5,
            markLine: {
              silent: true, data: [
                { name: 'lower', yAxis: this.upperLowerDic[this.cur_item[key]]['lowerlimit'], xAxis: 0, itemStyle: { normal: { color: '#abc327' } } }]
            }
          },
            { name: '折线', data: tempLineArr, itemStyle: { normal: { color: '#800080' } }, type: 'line' });
        }
        this.spotEchartArr.push(this.lightBarSportChart('Light Bar MA值監控趨勢圖 -- ' + this.cur_item[key], seriesData, this.endInput));
      }
    }
  }


  setMaxMin() {
    if (this.endInput !== undefined && this.endInput) {
      this.subject.next();
    }
  }

  lightBarLineChart(titleArr: Array<string>, seriesData: any) {
    this.line_chart = {
      title: {
        text: 'Light Bar 光源流明度監控趨勢圖'
      },
      legend: {
        data: titleArr
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
        }
      },
      backgroundColor: 'rgba(255,255,255,0.7)',
      grid: {
        top: 70,
        bottom: 50
      },
      xAxis: {
        type: 'value',
        name: '測試值/LUX',
        nameTextStyle: {
          color: '#333'
        },
        scale: true
      },
      yAxis: {
        name: '機臺數量/pcs',
        type: 'value',
        nameTextStyle: {
          color: '#333'
        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0]
        }
      ],
      series: seriesData
    };
  }


  lightBarSportChart(title: any, seriesData: any, max) {
    const option = {
      title: {
        text: title
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      backgroundColor: 'rgba(255,255,255,0.7)',
      xAxis: {
        type: 'time',
        name: '时间',

      },
      yAxis: {
        type: 'value',
        name: '測試值/LUX',

        max: function (value) {
          return max;
        },
        // min: function (value) {
        //   return (min - 0.5).toFixed(2);
        // }

      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0]
        }
      ],
      series: seriesData
    };
    return option;
  }


  // 时间戳转日期
  numberToDate(number: any, second: boolean) {
    const date = new Date(number);
    const YY = date.getFullYear() + '-';
    const MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    const DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    const hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    const mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    const ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    if (second) {
      return YY + MM + DD + ' ' + hh + mm + ss;
    } else {
      return YY + MM + DD;
    }
  }

  getSameValueCount(arr, val) {
    const processArr = arr.filter(function (value) {
      return value === val;
    });
    return processArr.length;
  }

  isArrFunction(data) {
    return Object.prototype.toString.call(data) === '[object Array]';
  }
}
