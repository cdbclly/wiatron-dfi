import { Component, OnInit, OnDestroy } from '@angular/core';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MqttConnServiceService } from '@service/skyeye/mqtt-conn-service.service';
import { ReportServiceService } from '@service/skyeye/report-service.service';
import { DatePipe } from '@angular/common';
import { MorouteApi } from '@service/skyeye_sdk';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';



@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {

  constructor(private lineDataService: LineDataServiceService,
    private router: Router,
    private aroute: ActivatedRoute,
    private reportService: ReportServiceService,
    private datePipe: DatePipe,
    private morouteService: MorouteApi,
    private esService: EsDataServiceService
  ) {
      this.aroute.queryParams.subscribe(async params => {
        if (params['site'] && params['plant']) {
          sessionStorage.setItem('site', params['site']);
          sessionStorage.setItem('plant', params['plant']);
          sessionStorage.setItem('section', 'DIP');
        }
      });
     }

  plantGroup = [];
  sectionGroup = [];
  siteGroup = [];
  siteInfos = [];
  cur_site;
  cur_plant;
  img_plant;
  img_site;
  cur_section;
  cur_sectionId;
  objectKeys = Object.keys;
  objectValue = Object.values;
  layoutMap: Map<string, any>; // 存放UI线体结构
  stationMap: Map<string, string>; // 站别线别映射
  layoutInfos;
  subscript: Subscription;
  overall: any;
  timer;
  isLoading = false;
  queryButton = true;
  status_num: number[] = [];
  alertItems = []; // 當前站別的報警事件清單
  liTagCount = 0;
  _mqttService = new MqttConnServiceService();
  cur_upn;
  async ngOnInit() {
    // 获取站别mapping
    if (!this.stationMap && !localStorage.getItem('stationMap')) {
      await this.doMappingStation();
      localStorage.setItem('stationMap', JSON.stringify(Array.from(this.stationMap)));
    } else {
      this.stationMap = this.stationMap ? this.stationMap : new Map(JSON.parse(localStorage.getItem('stationMap')));
    }
    this.siteInfos = JSON.parse(localStorage.getItem('Skyeye_plantMapping'));
    this.siteGroup = this.lineDataService.groupBy(this.siteInfos, 'Site');
    console.log(this.siteGroup, this.siteInfos);
    if (sessionStorage.getItem('site') && sessionStorage.getItem('plant') && sessionStorage.getItem('section')) {
      this.cur_site = sessionStorage.getItem('site');
      this.cur_plant = sessionStorage.getItem('plant');
      this.cur_section = sessionStorage.getItem('section');
      this.autoQuery();
    }

    // 超过2小时把绿灯变灰灯
    this.timer = setInterval((): void => {
      console.log('layoutInfos 的数据=== \n', this.layoutInfos);
      if (this.layoutInfos) {
        for (const line in this.layoutInfos) {
          if (this.layoutInfos.hasOwnProperty(line)) {
            for (let index = 0; index < this.layoutInfos[line]['stage'].length; index++) {
              if ((new Date().getTime() - this.layoutInfos[line]['stage'][index]['evt_dt']) > 7200000) {
                if (this.layoutInfos[line]['stage'][index]['status'] !== 'Red' && this.layoutInfos[line]['stage'][index]['status'] !== 'Yellow') {
                      this.layoutInfos[line]['stage'][index]['status'] = 'Gray';
                }
              }
            }
          }
        }
      }
    }, 12000);
  }

  async autoQuery() {
    this.siteInfos = JSON.parse(localStorage.getItem('Skyeye_plantMapping'));
    this.siteGroup = this.lineDataService.groupBy(this.siteInfos, 'Site');
    this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
      return res['Plant'];
    });
    this.lineDataService.getSectionsByPlant(this.cur_plant).subscribe(res => {
      this.sectionGroup = res.map(section => {
        return section;
      });
    });
    await this._mqttService.initMqttClient(JSON.parse(localStorage.getItem('mqtt_host'))[this.cur_site], parseInt(localStorage.getItem('mqtt_port'), 0), this._mqttService.generateUUID());
    this.query();
    this.queryButton = false;
  }

  async getOptions(type) {
    if (type === 'site') {
      this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
        return res['Plant'];
      });
      this.cur_plant = undefined;
      this.cur_section = undefined;
      this._mqttService.DisConn();
      // 重新建立Mqtt連接
      console.log(JSON.parse(localStorage.getItem('mqtt_host')), JSON.parse(localStorage.getItem('mqtt_host'))[this.cur_site]);
      await this._mqttService.initMqttClient(JSON.parse(localStorage.getItem('mqtt_host'))[this.cur_site], parseInt(localStorage.getItem('mqtt_port'), 0), this._mqttService.generateUUID());
    }
    if (type === 'plant') {
      this.lineDataService.getSectionsByPlant(this.cur_plant).subscribe(res => {
        this.sectionGroup = res.map(section => {
          return section;
        });
        console.log(this.sectionGroup);
      });
      this.cur_section = undefined;
    }
    if (this.cur_site && this.cur_plant && this.cur_section) {
      sessionStorage.setItem('site', this.cur_site);
      sessionStorage.setItem('plant', this.cur_plant);
      sessionStorage.setItem('section', this.cur_section);
      this.queryButton = false;
    } else {
      this.queryButton = true;
    }
  }

  async query() {
    this.img_plant = this.cur_plant;
    this.img_site = this.cur_site;
    const layout = {};
    // 组装line, stage
    if (this.subscript) {
      // 取消订阅
      this.subscript.unsubscribe();
      this._mqttService.unsubscribeAllTopics();
    }
    this.isLoading = true;
    console.log(this.cur_site, this.cur_plant, this.cur_section);
    if (!this.layoutMap) {
      this.layoutMap = new Map<string, Map<string, {}>>();
    }
    // if (!this.layoutMap.get(this.cur_site + '-' + this.cur_plant + '-' + this.cur_section)) {
    //   layout = await this.buildLineData();
    //   this.layoutMap.set(this.cur_site + '-' + this.cur_plant + '-' + this.cur_section, layout);
    //   console.log('this.layoutMap == \n', this.layoutMap);
    //   this.isLoading = false;
    // } else {
    //   this.isLoading = false;
    // }
    await this.buildLineData(layout, 'query');
    this.isLoading = false;
    console.log(this.layoutMap.get(this.cur_site + '-' + this.cur_plant + '-' + this.cur_section));
    await this.init_kanban();
    this.liTagCount = 0;
    for (const line in this.layoutMap.get(this.cur_site + '-' + this.cur_plant + '-' + this.cur_section)) {
      if (this.layoutMap.get(this.cur_site + '-' + this.cur_plant + '-' + this.cur_section).hasOwnProperty(line)) {
        const stageObj = this.layoutMap.get(this.cur_site + '-' + this.cur_plant + '-' + this.cur_section)[line];
        this.liTagCount = this.liTagCount + Object.keys(stageObj['stage']).length;
      }
    }
    console.log( 'liTagCount:' + this.liTagCount);
  }

  // 点击图片展示详情
  async goDetail(line, item) {
    const issuelist = await this.reportService.getStatusCode(this.cur_site.toLowerCase(), this.cur_plant, line, item);
    console.log('详细数据 ### \n' , issuelist);
    this.alertItems = [];
    const alertItems = [];
    if (issuelist.hasOwnProperty('0')) {
      for (const index in issuelist) {
        if (issuelist.hasOwnProperty(index) && (issuelist[index]['eventId'] === 'QMCPK001' || issuelist[index]['eventId'] === 'QMFAIL001'
            || issuelist[index]['eventId'] === 'QMRETRY001' || issuelist[index]['eventId'] === 'QMATE001'
            || issuelist[index]['eventId'] === 'QMCPK003' || issuelist[index]['eventId'] === 'QMYR001'
            || issuelist[index]['eventId'] === 'QMRR001' || issuelist[index]['eventId'] === 'QMLIBAR001') ) {
          const alert = issuelist[index];
          console.log('alert 内容如下 \n', alert);
          let testArray;
          let bt;
          let st;
          let upn;
          if (alert['eventId'] === 'QMCPK003') { // 組裝設備CPK監控
            testArray = alert['evtvalue8'].replace('%28', '(').split('(') ;
            bt = testArray[0];
            st = testArray[1].replace('%29', ')').substring(0, testArray[1].indexOf(')'));
          } else if (alert['eventId'] === 'QMCPK001') { // CPK值提示
            testArray = alert['evtvalue8'].replace('%28', '(').split('(') ;
            bt = testArray[0];
            st = testArray[1].replace('%29', ')').substring(0, testArray[1].indexOf(')'));
          } else {
            testArray = ['', ''];
            bt = testArray[0];
            st = testArray[1];
          }
          // const testArray = alert['eventId'] === 'QMCPK001' ? alert['evtvalue7'].split('(') : ['', ''];
          // const bt = testArray[0];
          // const st = testArray[1].substring(0, testArray[1].indexOf(')'));

          // 如果eventID对应的是 测试retry rate 和 rf cpk,则添加架构栏位
          if (alert['eventId'] === 'QMRETRY001' || alert['eventId'] === 'QMCPK001' || alert['eventId'] === 'QMTIME001') {
            upn = testArray['evtvalue4'] ? testArray['evtvalue4'] : 'NA'; // 架构栏位
          } else {
            upn = '';
          }
          alertItems.push({
            active: false,
            disabled: false,
            // title: this.getEventName(alert['eventId']) + '       ' + this.datePipe.transform(alert['STime'], 'yyyy-MM-dd HH:mm:ss'),
            name: this.getEventName(alert['eventId']),
            eventId: alert['eventId'],
            status: this.getEventStatus(alert['status']),
            machineModel: (alert['eventId'] === 'QMCPK003' || alert['eventId'] === 'QMYR001' || alert['eventId'] === 'QMRR001') ?  alert['evtvalue5'] : '', // 治具类别
            fixId: (alert['eventId'] === 'QMCPK003' || alert['eventId'] === 'QMYR001' || alert['eventId'] === 'QMRR001' || alert['eventId'] === 'QMRETRY001' || alert['eventId'] === 'QMCPK001') ?  alert['evtvalue6'] :  alert['evtvalue5'] ,
            model: alert['evtvalue3'],
            line: line,
            item: item,
            sTime: this.datePipe.transform(alert['STime'], 'yyyy-MM-dd HH:mm:ss'),
            bt: bt,
            st: st,
            upn: upn,
            datefrom: alert['evtvalue7']
          });
        }
      }
      // alterItems 去重
          // this.alertItems.reverse();
          const obj = {};
          this.alertItems = alertItems.reduce((cur, next) => {
          obj[next.eventId] ?  '' : obj[next.eventId] = true && cur.push(next);
          return cur; }, []);

          console.log('alertItems === ## \n', this.alertItems);
      } else { // 無異常直接跳轉不良率report
        this.router.navigate(['/dashboard/skyeye/report/defectLossAnalyze'], {
          queryParams: {
            line: line, item: item, stage: this.cur_section, plant: this.cur_plant,
            site: this.cur_site
          }
        });
      }
  }

  goReport(info) {
    switch (info['eventId']) {
      case 'QMCPK001':
       this.router.navigate(['/dashboard/skyeye/report/cpkAnalyze'], {
              queryParams: {
                line: info['line'], item: info['item'], stage: this.cur_section, plant: this.cur_plant,
                site: this.cur_site, fixId: info['fixId'], model: info['model'], bt: info['bt'], st: info['st']
              }
            });
       break;
      case 'QMFAIL001':
       this.router.navigate(['/dashboard/skyeye/report/defectLossAnalyze'], {
              queryParams: {
                line: info['line'], item: info['item'], stage: this.cur_section, plant: this.cur_plant,
                site: this.cur_site, fixId: info['fixId'], model: info['model']
              }
            });
       break;
      case 'QMRETRY001':
       this.router.navigate(['/dashboard/skyeye/report/retryRateAnalyze'], {
              queryParams: {
                line: info['line'], item: info['item'], stage: this.cur_section, plant: this.cur_plant,
                site: this.cur_site, fixId: info['fixId'], model: info['model']
              }
            });
       break;
      case 'QMTIME001':
       this.router.navigate(['/dashboard/skyeye/report/testTimeAnalyze'], {
              queryParams: {
                line: info['line'], item: info['item'], stage: this.cur_section, plant: this.cur_plant,
                site: this.cur_site, fixId: info['fixId'], model: info['model'], upn: info['upn']
              }
            });
       break;
      case 'QMATE001':
       this.router.navigate(['/dashboard/skyeye/report/ateTemperatureReport'], {
          queryParams: {line: info['line'], item: info['item'], stage: this.cur_section, plant: this.cur_plant,
              site: this.cur_site,  model: info['model']}});
       break;

       case 'QMCPK003':
        this.router.navigate(['/dashboard/skyeye/report/cntcpk'], {
               queryParams: {
                 line: info['line'], item: info['item'], stage: this.cur_section, plant: this.cur_plant,
                 site: this.cur_site, fixId: info['fixId'], model: info['model'], bt: info['bt'], st: info['st'], machineModel: info['machineModel']
               }
             });
        break;
        case 'QMYR001':
          this.router.navigate(['/dashboard/skyeye/report/yieldAnalyze'], {
                 queryParams: {
                   line: info['line'], item: info['item'], stage: this.cur_section, plant: this.cur_plant,
                   site: this.cur_site, fixId: info['fixId'], model: info['model'], machineModel: info['machineModel']
                 }
               });
          break;

        case 'QMRR001':
          this.router.navigate(['/dashboard/skyeye/report/assemblyDefecRate'], {
                  queryParams: {
                    line: info['line'], item: info['item'], stage: this.cur_section, plant: this.cur_plant,
                    site: this.cur_site, fixId: info['fixId'], model: info['model'], machineModel: info['machineModel']
                  }
                });
          break;

          case 'QMLIBAR001':  // WKS P5_Light Bar光源強度偏離異常通知
            this.router.navigate(['/dashboard/skyeye/report/lightBarAnalyze'], {
                    queryParams: {
                      line: info['line'], item: info['item'], plant: this.cur_plant, datefrom: info['datefrom'],
                      site: this.cur_site, fixId: info['fixId'], model: info['model']
                    }
                  });
            break;


      default:
       this.router.navigate(['/dashboard/skyeye/report/retryRateAnalyze'], {
            queryParams: {
              line: info['line'], item: info['item'], stage: this.cur_section, plant: this.cur_plant,
              site: this.cur_site
            }
          });
       break;
    }
  }
  getEventName(eventId) {
    switch (eventId) {
      case 'QMCPK001':
       return 'CPK值提示';
      case 'QMFAIL001':
       return 'FPYR監控';
      case 'QMRETRY001':
       return 'retry rate';
      case 'QMTIME001':
       return '測試時間';
      case 'QMATE001':
       return 'ATE溫度監控';
      case 'QMCPK003':
       return '組裝設備CPK監控';
      case 'QMYR001':
       return 'Yield Rate監控';
      case 'QMRR001':
      return 'Fixture Retest Rate監控';
      case 'QMLIBAR001':
       return 'Light Bar光源流明度監控';
      default:
       return '';

    }
  }

  getEventStatus(status) {
    switch (status) {
      case 0:
       return 'open';
      case 2:
       return 'closed';
      default:
       return 'onGoing';
    }
  }


  private subscribeTopics(site: string, plant: string): void {
    const topic = site.toLowerCase() + JSON.parse(localStorage.getItem('mqtt_topics'))['machineInfo'] + plant.toUpperCase() + '/#';
    console.log('topic ====== ', topic);
    if (!this._mqttService) {
      this._mqttService = new MqttConnServiceService();
    }
    this._mqttService.subscribeTopic([
      { name: topic, option: null }
    ]);
  }

  async init_kanban() {
    // layoutInfos 看板数据
    // this.layoutInfos = this.layoutMap.get(this.cur_site + '-' + this.cur_plant + '-' + this.cur_section);
    console.log('layoutInfos 看板数据 \n', this.layoutInfos);
    // 订阅MQTT topic
    this.subscribeTopics(this.cur_site, this.cur_plant);
    this.subscript = await this._mqttService.listenMessage().subscribe(resMessage => {
      console.log(resMessage.payloadString);
      const res = JSON.parse(resMessage.payloadString);
      const stageIndex =  this.layoutInfos[res.stationline] && this.layoutInfos[res.stationline]['stage'].indexOf(this.layoutInfos[res.stationline]['stage'].filter(item => item['name'] === res.stationtype)[0]);
      if (this.layoutInfos && this.layoutInfos[res.stationline] && stageIndex && stageIndex !== -1) {
        this.layoutInfos[res.stationline]['stage'][stageIndex]['status'] = res.status;
        this.layoutInfos[res.stationline]['stage'][stageIndex]['evt_dt'] = res.evt_dt;
        if (new Date().getTime() - res.evt_dt > 7200000) {
          if (res.status !== 'Red' && res.status !== 'Yellow') {
            this.layoutInfos[res.stationline]['stage'][stageIndex]['status'] = 'Gray';
          }
        }
      }
      // console.log(this.layoutInfos);
      // 确定页面站点数量
    }, error => {
      console.error(error);
    });
  }

  // async buildLineData() {
    // const lineMap = {};
    // this.cur_sectionId = await this.lineDataService.getSectionId(this.cur_plant, this.cur_section);
    // this.cur_sectionId = this.cur_sectionId[0]['id'];
    // const lineArray_temp = await this.lineDataService.getLinesBySection(this.cur_sectionId);
    // for (let i = 0; i < lineArray_temp.length; i++) {
    //   const item = await this.lineDataService.getStationByLine(lineArray_temp[i]['id']);
    //   const stage = {};
    //   item.forEach(res_item => {
    //     stage[res_item['type']] = { name: res_item['type'], desc: res_item['name'], status: 'Gray', evt_dt: new Date().getTime() };
    //   });
    //   const lineItem = { name: lineArray_temp[i]['name'], stage: stage, id: lineArray_temp[i]['id'] };
    //   lineMap[lineArray_temp[i]['name']] = lineItem;
    // }
    // return lineMap;
  // }

  async callLineData(layoutObj, queryTag?) {
    await this.morouteService.find({where: { and: [{ PLANT: this.cur_plant }, {MFG: this.cur_section === 'DIP' ? 'PCB' : this.cur_section}]}}).toPromise().then(async res => {
      // 显示线别UI的情况：1.通过查询按钮点击的且DB里有资料的会显示（进入if语句）。2.自动刷新页面，再次呼叫 API，若 res 无资料,则继续显示上一个 5 分支的资料（不会进入 if 语句）
      if ( (res instanceof Array && ((!queryTag && res.length !== 0)) || queryTag  )) {
        // 将 DB 查出的当前生产的线体资料和 ES 里前 30 天的数据做对比，取交集
        const maxAggSize = 200;  // ES 聚合查询最大笔数
        const options = `
        {
          "match": {"site": "${this.cur_site}"}
        },
        {
          "match": {"plant": "${this.cur_plant}"}
        }`;
        const filter = `
        ,"filter": {
          "range": {
            "stopdate": {"lte": "now", "gte": "now-30d"}
          }
        }`;
        const size = `,"size": 0 `;
        const aggs = `
        ,"aggs": {
            "byLine": {
              "terms": {"field": "stationline.raw", "size": ${maxAggSize}},
              "aggs": {
                "byStation": {
                  "terms": {"field": "stationtype.raw", "size": ${maxAggSize}}
                }
              }
            }
          }`;
        let esURL;
        if (this.cur_site !== 'WKS') {
          esURL = this.esService.getUrl('',  '_' + this.cur_site.toLowerCase());
        } else {
          esURL = this.esService.getUrl('');
        }
        // if (res instanceof Array) {
        // 分组
        const lineGroup = this.lineDataService.groupBy(res, 'LINE');
         // 处理 ES 中的资料
        // console.log(JSON.parse(this.esService.ES_DSL_Template(options, filter, '', size, aggs)));
        await this.handleESData(esURL, JSON.parse(this.esService.ES_DSL_Template(options, filter, '', size, aggs)), lineGroup, layoutObj);
        console.log(layoutObj);
        // 建议 layoutObjByOrder 用数组表示
        const layoutObjByOrder = {};
        // 对线别排序
        Object.keys(layoutObj).sort(this.compare.bind(this)).forEach(line => layoutObjByOrder[line] = layoutObj[line]);
        this.layoutMap.set(this.cur_site + '-' + this.cur_plant + '-' + this.cur_section, layoutObjByOrder);
        this.layoutInfos = this.layoutMap.get(this.cur_site + '-' + this.cur_plant + '-' + this.cur_section);
      }
    });
  }

  async handleESData(url, query, lineGroup, layoutObj) {
    const newLineGroup = {};
    await this.esService.postData(url, query).toPromise().then(data => {
      console.log(data, lineGroup);
      const lines = Object.keys(lineGroup);
      for (let index = 0; index < data['aggregations']['byLine']['buckets'].length; index++) {
        const newLines = data['aggregations']['byLine']['buckets'][index];
        if (lines.includes(newLines['key'])) {
          newLineGroup[newLines['key']] = lineGroup[newLines['key']];
          // 筛选 line arr 中 qty 最大的
          const lineQtyMax = newLineGroup[newLines['key']] instanceof Array ? this.getObjMaxValue(newLineGroup[newLines['key']], 'QTY') : newLines['key'];
          // 筛选 line arr 中 qty 最小的
          const lineQtyMin = newLineGroup[newLines['key']] instanceof Array ? this.getObjMinValue(newLineGroup[newLines['key']], 'QTY') : newLines['key'];
          // 比较 // 获取 route 最长的项
          newLineGroup[newLines['key']] = lineQtyMax === lineQtyMin ?
          newLineGroup[newLines['key']].filter(ress => ress['ROUTE'].length === this.getObjMaxValueLength(newLineGroup[newLines['key']], 'ROUTE'))[0]
          : newLineGroup[newLines['key']].filter(resss => resss['QTY'] === lineQtyMax)[0];
          // 拼资料格式
          // 1.切割 route，两个字符为一组,若是奇数个，则将最后一个字符单独为一项，如："A1A2A34" -> ["A1", "A2", "A3", "4"]
          // lineItem[0]['ROUTE'] = lineItem[0]['ROUTE'].split('').reduce((pre, cur, index, arr) => {arr[index - 1] && (index % 2 !== 0 ) ?  pre.push(arr[index - 1] + cur) : arr[index - 1] && index === arr.length - 1 ? pre.push(cur) : pre;  return pre; }, []);
          const newStages = [];
          // const stageObj = {};
          for (let i = 0; i < newLines['byStation']['buckets'].length; i++) {
            const newStage = newLines['byStation']['buckets'][i]['key'];
            let cur_stage_index = newLineGroup[newLines['key']]['ROUTE'].indexOf(newStage);
            if (cur_stage_index !== -1 || newStage === 'ATS') {
              // 站别排序，根据DB中 route 顺序排
              // ATS 特殊站索引站处理
              cur_stage_index = cur_stage_index !== -1 ? cur_stage_index : newLines['byStation']['buckets'].length;
              newStages.push({index: cur_stage_index, name: newStage, desc: this.stationMap.get(this.cur_plant + '-' + this.cur_section  + '-' + newLines['byStation']['buckets'][i]['key']), status: 'Gray', evt_dt: new Date().getTime()});
              // newStations.push(newLines['byStation']['buckets'][i]['key']);
            }
          }
          if (newStages.length !== 0) {
            // 站别排序;
            // 特殊站处理：例如 ATE 站要排在 TT 站后，TV 站前，否则排最后
            // const compareStage = this.compareStagePre(newStages);
            newStages.sort(this.compareStagePre(newStages, 'ATS', 'TT', 'TV'));
            console.log(newStages);
            newLineGroup[newLines['key']]['stage'] = newStages;
            layoutObj[newLines['key']] = newLineGroup[newLines['key']];
          }
          // newLineGroup[newLines['key']]['ROUTE'] = newStations;
        }
      }
    });
  }

  async buildLineData(layoutObj, queryTag?) {

    // call api, 根据 plant, mfg,wiporno=true 查
    await this.callLineData(layoutObj, queryTag);
    setInterval(async() => {
      layoutObj = {};
      await this.callLineData(layoutObj, queryTag);
    }, 300000);
  }

  // tools 将大写字母和十进制数字的组合转化为 自定义的36进制数字
  ConvertTo36Num(source: string) {
    let sum = 0;
    source.split('').forEach((item, i) => {
      if (Object.is(Number.parseInt(item), NaN) && (item.charCodeAt(0) < 91 || item.charCodeAt(0) > 64)) {
        sum += (item.charCodeAt(0) - 55) * Math.pow(36, source.length - i - 1);
      }
      if (!Object.is(Number.parseInt(item), NaN)) {
        sum += Number.parseInt(item) * Math.pow(36, source.length - 1 - i);
      }
    });
    return sum;
  }

  // 按照数组对象中某个属性值进行排序
  compare(a, b) {
    return (this.ConvertTo36Num(a) - this.ConvertTo36Num(b));
  }

  compareStagePre(newStages, specStage?, preStage?, lastStage?) {
    // specStage 站特殊处理，要排在 preStage 站后，lastStage 站前，否则排最后
    const specialStageIndex = newStages.indexOf(newStages.filter(item => item['name'] === specStage)[0]);
    const preStageIndex = newStages.indexOf(newStages.filter(item => item['name'] === preStage)[0]);
    const lastStageIndex = newStages.indexOf(newStages.filter(item => item['name'] === lastStage)[0]);
    if (specialStageIndex !== -1) {
      newStages[specialStageIndex]['index'] = preStageIndex !== -1 ? newStages[preStageIndex]['index'] + 0.1 : lastStageIndex !== -1 ?
      newStages[lastStageIndex]['index'] - 0.1 : newStages[specialStageIndex]['index'];
    }
    return function compareStage(a, b) {
      return a['index'] - b['index'];
    }
  }

  // 返回 object[key] 中最大值
  getObjMaxValue(obj, compareKey) {
    return Math.max.apply(Math, obj.map(item => item[compareKey] ));
  }

  // 返回的是最长 ROUTE 的 length 值
  getObjMaxValueLength(obj, compareKey) {
    return Math.max.apply(Math, obj.map(item => item[compareKey].length ));
  }

  getObjMinValue(obj, compareKey) {
    return Math.min.apply(Math, obj.map(item => item[compareKey] ));
  }

  // 将所有站别做映射
  async doMappingStation() {
    await this.lineDataService.getAllNodes().then(res => {
      this.stationMap = new Map();
      console.log(res);
      if (Array.isArray(res)) {
        for (const line of res) {
          for (const station of line['stations']) {
            this.stationMap.set(line['section']['plantId'] + '-' + line['section']['name'] +  '-' + station['type'], station['name']);
          }
        }
        console.log(this.stationMap);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
    this._mqttService.DisConn();
    clearInterval(this.timer);
  }
}
