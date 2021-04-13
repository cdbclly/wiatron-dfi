import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MqttConnServiceService } from '@service/skyeye/mqtt-conn-service.service';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { Subscription } from 'rxjs';
import { SkyeyeBoardService } from './skyeye-board.service';
import { IPieChartOption } from '../../../components/pie-chart/pie-chart';
import { MorouteApi } from '@service/skyeye_sdk';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { PlantNamePipe } from 'app/shared/pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-skyeye-board',
  templateUrl: './skyeye-board.component.html',
  styleUrls: ['./skyeye-board.component.scss']
})
export class SkyeyeBoardComponent implements OnInit, OnDestroy {

  @Input() mqttHost;
  @Input() curPlant;
  @Input() curSite;
  subscript: Subscription;
  layoutInfos: {};
  layoutMap: Map<string, {}>;
  plantMapping;
  option: IPieChartOption;
  _mqttService = new MqttConnServiceService();
  timer;

  chartItem: {} = {};

  constructor(
    private lineService: LineDataServiceService,
    private _service: SkyeyeBoardService,
    private morouteService: MorouteApi,
    private esService: EsDataServiceService,
    private router: Router,
    private plantName: PlantNamePipe
  ) { }

  async ngOnInit() {
    // 饼图初始化
    this.option = {
      title: '',
      subtext: 0 + '\n' + '─────' + '\n' + 0,
      data: [
        {
          name: this.curSite + '-' + this.curPlant,
          value: 0,
          itemStyle: {
            color: 'rgba(248, 244, 244, 0.973)'
          }
        },
        {
          name: this.curSite + '-' + this.curPlant,
          value: 0,
          itemStyle: {
            color: 'rgba(248, 244, 244, 0.973)'
          }
        }
      ],
      height: '160px',
      width: '160px'
    };
    this.option.title = await this.plantName.transform(this.curPlant);
    await this._mqttService.initMqttClient(this.mqttHost, parseInt(localStorage.getItem('mqtt_port'), 0), this._mqttService.generateUUID());
    this.layoutMap = new Map<string, {}>();
    this.layoutInfos = await this.buildLineData();
    await this.buildPieChart(this.option);
    await this.initMqttData(this.option);
    this.timer = setInterval(() => {
      this.buildPieChart(this.option);
    }, 120000);
  }

  goKanban(parmas) {
    // console.log(detail);
    const site = parmas.name.split('-')[0];
    const plant = parmas.name.split('-')[1];
    // const url = location.origin + '/dashboard/skyeye/skanban' + '?site=' + site + '&plant=' + plant;
    this.router.navigateByUrl('/dashboard/skyeye/skanban' + '?site=' + site + '&plant=' + plant);
    // window.location.href = url;
  }

  async buildPieChart(param: IPieChartOption) {
    let normalNum = 0;
    this.layoutMap.forEach((value, key) => {
      if (new Date().getTime() - value['evt_dt'] > 7200000) {
        value['status'] = 'Gray';
      }
      if (value['status'] === 'Green') {
        normalNum++;
      }
    });
    const topValue = normalNum;
    const downValue = this.layoutMap.size - normalNum;
    param.subtext = topValue + '\n' + '─────' + '\n' + this.layoutMap.size;
    param.data = [...param.data];
    param.data[0]['value'] = topValue;
    param.data[1]['value'] = downValue;
  }
  private subscribeTopics(): void {
    const topic = this.curSite.toLowerCase() + JSON.parse(localStorage.getItem('mqtt_topics'))['machineInfo'] + this.curPlant.toUpperCase() + '/#';
    this._mqttService.subscribeTopic([
      { name: topic, option: null }
    ]);
  }

  async initMqttData(param: IPieChartOption) {
    if (this.subscript) {
      this.subscript.unsubscribe();
      this._mqttService.unsubscribeAllTopics();
    }
    // debugger;
    if (!this.subscript) {
      this.subscribeTopics();
    }
    this.subscript = await this._mqttService.listenMessage().subscribe(resMessage => {
      if (resMessage) {
        const res = JSON.parse(resMessage.payloadString);
        // console.log(res);
        this.layoutInfos = this.layoutInfos as object;
        if (this.layoutInfos.hasOwnProperty(res.stationline) && (this.layoutInfos[res.stationline]['stage'] as object).hasOwnProperty(res.stationtype)) {
          this.layoutInfos[res.stationline]['stage'][res.stationtype]['status'] = res.status;
          this.layoutInfos[res.stationline]['stage'][res.stationtype]['evt_dt'] = res.evt_dt;
          if (new Date().getTime() - res.evt_dt > 7200000) {
            if (res.status !== 'Red' && res.status !== 'Yellow') {
              this.layoutInfos[res.stationline]['stage'][res.stationtype]['status'] = 'Gray';
            }
          }
          this.layoutMap.set(this.layoutInfos[res.stationline]['name'] + '-' + this.layoutInfos[res.stationline]['stage'][res.stationtype]['name'],
            { status: this.layoutInfos[res.stationline]['stage'][res.stationtype]['status'], evt_dt: res.evt_dt });
        }
        // 统计layoutInfos的灯号分布
        let pass = 0;
        this.layoutMap.forEach((value, key) => {
          if (value['status'] === 'Green') {
            pass++;
          }
        });
        const total = this.layoutMap.size;
        if (total === 0) {
          param.data[0] = {
            name: this.curSite + '-' + this.curPlant,
            value: total,
            itemStyle: {
              color: 'rgba(248, 244, 244, 0.973)'
            }
          };
        } else {
          param.subtext = pass + '\n' + '─────' + '\n' + this.layoutMap.size,
            param.data[0] = {
              name: this.curSite + '-' + this.curPlant,
              value: pass,
              itemStyle: {
                color: 'green'
              }
            };
          param.data[1] = {
            name: this.curSite + '-' + this.curPlant,
            value: total - pass,
            itemStyle: {
              color: 'red'
            }
          };
        }
        param.data = [...param.data];
        // param.merge = JSON.stringify(mergeParam);
      }
    });
  }

  async buildLineData() {
    let lineMap = {};
    lineMap = await this.morouteService.find({ where: { PLANT: this.curPlant } }).toPromise().then(async res => {
      if (res instanceof Array) {
        // 将 DB 查出的当前生产的线体资料和 ES 里前 30 天的数据做对比，取交集
        const maxAggSize = 200;  // ES 聚合查询最大笔数
        const options = `
        {
          "match": {"site": "${this.curSite}"}
        },
        {
          "match": {"plant": "${this.curPlant}"}
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
        if (this.curSite !== 'WKS') {
          esURL = this.esService.getUrl('', '_' + this.curSite.toLowerCase());
        } else {
          esURL = this.esService.getUrl('');
        }
        // 分组
        const lineGroup = this.lineService.groupBy(res, 'LINE');
        await this.handleESData(esURL, JSON.parse(this.esService.ES_DSL_Template(options, filter, '', size, aggs)), lineGroup, lineMap);
        return lineMap;
      }
    });
    return lineMap;
  }

  async handleESData(url, query, lineGroup, lineMap) {
    const newLineGroup = {};
    await this.esService.postData(url, query).toPromise().then(data => {
      const lines = Object.keys(lineGroup);
      for (let index = 0; index < data['aggregations']['byLine']['buckets'].length; index++) {
        const newLines = data['aggregations']['byLine']['buckets'][index];
        const stage = {};
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
          for (let i = 0; i < newLines['byStation']['buckets'].length; i++) {
            const newStage = newLines['byStation']['buckets'][i]['key'];
            const cur_stage_index = newLineGroup[newLines['key']]['ROUTE'].indexOf(newStage);
            if (cur_stage_index !== -1 || newStage === 'ATS') {
              stage[newStage] = { name: newStage, desc: '', status: 'Gray', evt_dt: new Date().getTime() };
              this.layoutMap.set(newLines['key'] + '-' + newStage, { status: 'Gray', evt_dt: new Date().getTime() });
            }
          }
          const lineItem = { name: newLines['key'], stage: stage, id: index };
          lineMap[newLines['key']] = lineItem;
        }
      }
    });
  }

  // 返回 object[key] 中最大值
  getObjMaxValue(obj, compareKey) {
    return Math.max.apply(Math, obj.map(item => item[compareKey]));
  }

  // 返回的是最长 ROUTE 的 length 值
  getObjMaxValueLength(obj, compareKey) {
    return Math.max.apply(Math, obj.map(item => item[compareKey].length));
  }

  getObjMinValue(obj, compareKey) {
    return Math.min.apply(Math, obj.map(item => item[compareKey]));
  }


  ngOnDestroy(): void {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
    this._mqttService.DisConn();
    clearInterval(this.timer);
  }

}
