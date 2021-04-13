import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '@service/skyeye/global.service';
import { NzMessageService } from 'ng-zorro-antd';
import { AteTemperatureChartService } from './ate-temperature-chart.service';
import { MqttConnServiceService } from '@service/skyeye/mqtt-conn-service.service';
import { Subscription } from 'rxjs';
import { denodeify } from 'q';

@Component({
  selector: 'app-ate-temperature-chart',
  templateUrl: './ate-temperature-chart.component.html',
  styleUrls: ['./ate-temperature-chart.component.scss']
})
export class AteTemperatureChartComponent implements OnInit, OnDestroy {

  cur_site;
  isVisible = false;
  footer = null;
  cancelOK = false;
  isVisible_1 = false;
  footer_1 = null;
  cancelOK_1 = false;
  detailTable_total: {}[] = [];
  detail_list: {}[] = [];
  project = 'ATE Temperature';
  // cur_model;
  cur_plant;
  cur_line;
  cur_section;
  cur_mdname;  // 站名
  timer;
  // fixtureArr = [];
  dataX_array: {}[] = [];
  data_ateTemp: {}[] = []; // series obj 数组
  ateTemp_itemArray = [];
  detailTable_loss: {}[] = [];
  defect_list;
  line_chart;
  datefrom;
  dateto;
  tag; // 标记是否是历史页面查询
  dashBoards = {}; // 實時溫度charts
  subscript: Subscription;
  _mqttService = new MqttConnServiceService();
  temperatureSet; // 各治具的實時溫度
  objectKeys = Object.keys;
  objectValue = Object.values;
  // line color sets
  color = ['#FFD700', '#B23AEE', '#87CEFF', '#FFA07A', '#00FF7F', '#FFDAB9'];
  colorShadow = [ 'rgba(255,215,0,0.5)', 'rgba(178,58,238,0.5)', 'rgba(135,206,255,0.5)', 'rgba(255,160,122,0.5)', 'rgba(0,255,127,0.5)',  'rgba(255,218,185, 0.8)'];

  constructor(private dataService: LineDataServiceService, private esService: EsDataServiceService,
    private datePipe: DatePipe, private globals: GlobalService, private activatedRoute: ActivatedRoute,
    private message: NzMessageService,
    private _service: AteTemperatureChartService) { }

  ngOnInit() {
  }

  async queryOp (options, type?) {
    clearInterval(this.timer);
    console.log(options);
    this.cur_site = options['cur_site'];
    this.cur_plant = options['cur_plant'];
    this.cur_section = options['cur_section'];
    this.cur_line = options['cur_line'];
    this.cur_mdname = options['cur_mdname'];
    // this.cur_model = options['cur_model'];
    this.datefrom = options['datefrom'];
    this.dateto = options['dateto'];
    // this.tag = options['tag'];
    if (type !== 'history') {
      this.getATETempLine('temperature', this.dataX_array, this.data_ateTemp, this.ateTemp_itemArray, this.datefrom, this.dateto, true);
      this.timer = setInterval(async() => {
        this.getATETempLine('temperature', this.dataX_array, this.data_ateTemp, this.ateTemp_itemArray, this.datefrom, this.dateto, true);
      }, 30000);
    } else {
      this.getATETempLine('temperature', this.dataX_array, this.data_ateTemp, this.ateTemp_itemArray, this.datefrom, this.dateto, true);
    }
    // build儀錶盤資料 --> MQTT
    // debugger;
    if (type !== 'history') {
      this.temperatureSet = {};
      console.log(JSON.parse(localStorage.getItem('mqtt_host')), JSON.parse(localStorage.getItem('mqtt_host'))[this.cur_site]);
       // 组装line, stage
       if (this.subscript) {
        this.subscript.unsubscribe();
        this._mqttService.unsubscribeAllTopics();
        this._mqttService.DisConn();
      }
      await this._mqttService.initMqttClient(JSON.parse(localStorage.getItem('mqtt_host'))[this.cur_site], parseInt(localStorage.getItem('mqtt_port'), 0), this._mqttService.generateUUID());
      await this.realTimeTemperature();
    }
  }

  // 訂閱TOPIC
  private subscribeTopics(site: string, plant: string, line: string, station: string): void {
    const topic = site.toLowerCase() + JSON.parse(localStorage.getItem('mqtt_topics'))['realTimeTemperature']  + plant.toUpperCase() + '/' + line.toUpperCase() + '/' + station.toUpperCase() + '/#';
    console.log(topic);
    this._mqttService.subscribeTopic([
      { name: topic, option: null }
    ]);
  }


  // 處理實時溫度資料
  async realTimeTemperature() {
    // this.subscribeTopics(this.cur_site, this.cur_plant, this.cur_line, this.cur_mdname);
    this.dashBoards = {};
    await this.subscribeTopics(this.cur_site, this.cur_plant, this.cur_line, this.cur_mdname);
    this.subscript = await this._mqttService.listenMessage().subscribe( resMessage => {
      // console.log(resMessage.payloadString);
      const res = JSON.parse(resMessage.payloadString);
      if (res.site.toLowerCase() === this.cur_site.toLowerCase() && res.plant.toUpperCase() === this.cur_plant.toUpperCase()
      && res.stationline === this.cur_line && res.stationtype === this.cur_mdname) {
        // 刪除接收到超過5分鐘的儀錶盤
        if (new Date().getTime() - res.executiontime > 300000) {
          if (this.dashBoards.hasOwnProperty(res.stationid)) {
            delete this.dashBoards[res.stationid];
          }
        } else {
          console.log(resMessage.payloadString);
          this.temperatureSet[res.stationid] = res.mdresult;
          const chart = this.buildATEDashBoard(res.stationid, res.mdresult);
          this.dashBoards[res.stationid] = chart;
          console.log(this.dashBoards);
        }
      }
    });
  }

  // 刻畫實時溫度儀錶盤
  buildATEDashBoard(fixId, tData) {
    const dashChart = {
      title : {
        text: fixId,
        x: 'center',
        y: 'bottom',
        textStyle: {
          color: 'black',
        }
      },
      // backgroundColor: 'rgba(255,255,255,0.7)',
      calculable : true,
      tooltip : {
        formatter: '{a} <br/>{b} : {c}℃',
        backgroundColor: 'rgba(255,255,255,0.7)',
        textStyle: {
          color: 'black'
        }
    },
    series: [
      {
        name: 'ATE實時溫度',
        type: 'gauge',
        splitNumber: 10,       // 分割段数，默认为5
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: [[0.45, '#228b22'], [0.5, '#FFE500'], [1, '#ff4500']],
                width: 8
            }
        },
        axisTick: {            // 坐标轴小标记
            splitNumber: 10,   // 每份split细分多少段
            length : 12,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
                color: 'auto'
            }
        },
        axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
            }
        },
        splitLine: {           // 分隔线
            show: true,        // 默认显示，属性show控制显示与否
            length : 30,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
            }
        },
        pointer : {
            width : 5
        },
        title : {
            show : true,
            offsetCenter: [0, '-40%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder'
            }
        },
        detail : {
            formatter: '{value}℃',
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto',
                fontWeight: 'bolder',
                fontSize: 16
            }
        },
        data: [{value: tData, name: '℃'}]
    }
    ]
    };
    return dashChart;
  }

  async getATETempLine(type: string, dataX_array: {}[], data_ateTemp: {}[], ateTemp_itemArray: any[], datefrom, dateto, dateTag) {
    console.log(dateTag);
    // this.fixtureArr = [];
    const markLineX = [];
    let abnormalSum = 0;
    const legend = [];
    dataX_array = [];
    ateTemp_itemArray = [];
    let esURL;
    if (this.cur_site !== 'WKS') {
      esURL = this.esService.getUrl(type + '/',  '_' + this.cur_site.toLowerCase());
    } else {
      esURL = this.esService.getUrl(type + '/');
    }
    let date_range;
    let size;
    if (datefrom !== undefined && dateto !== undefined) {
      date_range = `"range": {
        "executiontime": {
          "lte": ${dateto},
          "gte": ${datefrom}
        }
      }`;
      size = `"size": 10000`;
    } else {
      date_range = `"range": {
        "executiontime": {
          "lte": "now"
        }
      }`;
      size = `"size": 10`;
    }
    // let limit_arr;
    let querys;
    querys = this._service.getATETemperature(this.cur_site.toLowerCase(),
      this.cur_line.toUpperCase(),
      this.cur_mdname.toUpperCase(), this.cur_plant.toUpperCase(), date_range, size);
      console.log(querys);
      querys = JSON.parse(querys);
    if (data_ateTemp !== undefined) {
      data_ateTemp.splice(0, data_ateTemp.length);
   }
   if (dataX_array !== undefined) {
     dataX_array.splice(0, dataX_array.length);
   }
   if (ateTemp_itemArray !== undefined) {
    ateTemp_itemArray.splice(0, dataX_array.length);
   }
    const data = await this.esService.postData(esURL, querys).toPromise();
     console.log(data['aggregations']['fixIdGroup']['buckets'].length);
     if (data['aggregations']['fixIdGroup']['buckets'].length > 500) {
      this.message.create('success', '查詢範圍過大，請重新選擇查詢日期');
      return;
    }

    let tempX = [];
    for (let i = 0; i < data['aggregations']['fixIdGroup']['buckets'].length; i++ ) {
      data['aggregations']['fixIdGroup']['buckets'][i]['TopHits']['hits']['hits'].forEach(item => {
        // const date_item = this.datePipe.transform(item._source.stopdate, 'MM/dd HH:mm');
        const date_item = item._source.executiontime;
        tempX.push(date_item);
      });
    }
     tempX = Array.from(new Set(tempX));
     // 按时间升序排序
     tempX = tempX.sort((a, b) => a - b);
     // 注，set可以去重，但是不可以去掉obj类型，所以后面还需再转化一下类型
     dataX_array = tempX.map(res => {
       return {value: this.datePipe.transform(res, 'MM/dd HH:mm')};
     });
    //  debugger;
    // 新增一个x，为了让markLine显示不会和最后一笔资料重叠
    dataX_array.push('');
    let upperlimit;
    if (data['aggregations']['fixIdGroup']['buckets'].length > 0) {
      upperlimit = data['aggregations']['fixIdGroup']['buckets'][0]['TopHits']['hits']['hits'][0]._source.upperlimit;
    }
     if (upperlimit && upperlimit < 300) {
      markLineX.push([{name: 'upper:' + upperlimit, yAxis: upperlimit, x: 70, label: {show: true}, itemStyle: {normal: {color: '#dc143c'}}},
        {name: 'upper', yAxis: upperlimit, xAxis: dataX_array.length - 1, itemStyle: {normal: {color: '#dc143c'}}}]);
      markLineX.push([{name: 'warning:' + 45, yAxis: 45, x: 70, label: {show: true}, itemStyle: {normal: {color: '#abc327'}}},
        {name: 'warning', yAxis: 45, xAxis: dataX_array.length - 1, itemStyle: {normal: {color: '#abc327'}}}]);
     }
     this.dataX_array = dataX_array;
     for (let i = 0; i < data['aggregations']['fixIdGroup']['buckets'].length; i++) {
      const seriesData = [];
      // 初始化seriesData, 保证x和实际资料一一对应
      tempX.forEach(x => {
        seriesData.push('');
      });
      const abnormalArr = [];
      legend.push(data['aggregations']['fixIdGroup']['buckets'][i].key);
      data['aggregations']['fixIdGroup']['buckets'][i]['TopHits']['hits']['hits'].forEach(esItem => {
        const index = tempX.indexOf(esItem._source.executiontime);
        if (index !== -1) {
          seriesData[index] = esItem._source.average;
        }
        // seriesData.push(esItem._source.average);
        const item = {};
        item['modelName'] = esItem._source.modelname;
        item['tationLine'] = esItem._source.stationline;
        item['stationType'] = esItem._source.stationtype;
        item['stationid'] = esItem._source.stationid;
        item['average'] = esItem._source.average;
        item['executiontime'] = esItem._source.executiontime;
        item['upperlimit'] = esItem._source.upperlimit;
        item['lowerlimit'] = 45;
        // if (esItem._source.upperlimit && esItem._source.upperlimit < 300) {
          if (esItem._source.average > 45 || esItem._source.average === 45) {
            abnormalArr.push({name: '超標溫度', symbol: 'circle', symbolSize: 20, value: esItem._source.average, yAxis: esItem._source.average,
            xAxis: index, itemStyle: {normal:
              {color: 'transparent', borderColor: '#dc143c', label: {show: false}}}});
            dataX_array[index] = {value: this.datePipe.transform(esItem._source.executiontime, 'MM/dd HH:mm'), textStyle: {color: '#dc143c'}};
            abnormalSum = abnormalSum + 1;
          }
        // }
        ateTemp_itemArray.push(item);
      });
      let markLine;
      if (i === 0) {
        markLine = {
          silent: true,
          data: markLineX
        };
      } else {
        markLine = undefined;
      }
      const seriesItem = {
        name: data['aggregations']['fixIdGroup']['buckets'][i].key,
        type: 'line',
        data: seriesData,
        color: this.color[i % 6],
        itemStyle: {
          normal: {
             borderWidth: 7,
             borderColor: this.color[i % 6],
             label: {
              show: true,
              position: 'right',
              color: 'black',
              formatter: '{c}℃'
          },
          color: this.color[i % 6],
          }
        },
        lineStyle: {
          normal: {
            width: 3,
            color: this.color[i % 6],
            shadowColor: this.colorShadow[i % 6],
            shadowBlur: 10,
            shadowOffsetY: 7
        }
        },
        smooth: true,
        markPoint: {
          data: abnormalArr
        },
        markLine: markLine
        };
      data_ateTemp.push(seriesItem);
     }
     const limit_arr = {upper: ateTemp_itemArray.length > 0 ? ateTemp_itemArray[0]['upperlimit'] : undefined, lower: undefined};

    this.ateTemp_itemArray = ateTemp_itemArray;
    if (!dateTag) {
      const abnormal_data = {
        num: abnormalSum,
        type: 'ateTemp'
      };
      this.globals.AbnormalPot_subject.next(abnormal_data);
    }
    this.options_line(data_ateTemp, markLineX, limit_arr, dateTag, legend);
  }

  async options_line(data_ateTemp, markLineX, limit_arr, dateTage, legend) {
    const stageMapping = await this.dataService.getStageMapping(this.cur_mdname, this.cur_plant, this.cur_site);
    console.log(stageMapping);
    let text;
    if (stageMapping.length > 0) {
      text = `ATE温度监控趨勢圖(${stageMapping[0]['chineseContrast']})`;
    } else {
      text = 'ATE温度监控趨勢圖';
    }
    this.line_chart = {
      title : {
        text: `${text}`,
        x: 'left',
        textStyle: {
          color: 'black',
        }
      },
      grid: {
        y: 70,
        y2: 75,
        x: 70
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        backgroundColor: 'rgba(255,255,255,0.7)',
        textStyle: {
          color: 'black'
        }
    },
    legend: {
      data: legend,
      orient: 'horizontal',
      x: 'right'
    },
    backgroundColor: 'rgba(255,255,255,0.7)',
    calculable : true,
      xAxis: {
          type: 'category',

          data: this.dataX_array,
          axisLine: {
            lineStyle: {
              width: 1,
              color: 'black'
            }
          },
          axisLabel: {
            interval: 0,
            rotate: 60
          }
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
          axisLabel: {
            formatter: '{value}℃'
          },
          max: function(value) {
            // console.log(limit_arr);
            if (limit_arr !== undefined && limit_arr.upper > value.max) {
              return limit_arr['upper'] === undefined ? (value.max + 2).toFixed(2) : limit_arr['upper'];
            } else {
              return (value.max + 2).toFixed(2);
            }
          },
          min: function(value) {
            // console.log(limit_arr);
            if (limit_arr !== undefined && limit_arr.lower < value.min) {
              return limit_arr['lower'] === undefined ? value.min : limit_arr['lower'];
            } else {
              return (value.min - 2).toFixed(2);
            }
          }

      },
      dataZoom: [
        {
          type: 'slider',
          show: dateTage,
          xAxisIndex: [0],
          top: '92%'
        }
      ],
      series: data_ateTemp
  };
  // debugger;
  console.log(this.line_chart);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
    this._mqttService.DisConn();
    const abnormal_data = {
      num: null,
      type: 'none'
    };
    this.globals.AbnormalPot_subject.next(abnormal_data);
  }

}
