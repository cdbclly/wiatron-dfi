import { Component, OnInit, OnDestroy } from '@angular/core';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { RetryRates, Detail } from '../../../../model/RetryRate';
import { GlobalService } from '@service/skyeye/global.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';

@Component({
  selector: 'app-retry-rate-chart',
  templateUrl: './retry-rate-chart.component.html',
  styleUrls: ['./retry-rate-chart.component.scss']
})
export class RetryRateChartComponent implements OnInit, OnDestroy {

  dataX_array: {}[] = [];
  data_retryRate: number[] = [];
  retryRate_item: RetryRates[] = [];
  detailTable_retry: {}[] = [];
  detailTable_total: {}[] = [];
  retry_list;
  line_chart;
  isVisible = false;
  footer = null;
  isVisible_1 = false;
  footer_1 = null;
  cur_site = 'WKS';
  cancelOK = false;
  cancelOK_1 = false;
  project = 'retry rate';
  cur_plant;
  cur_line;
  cur_section;
  cur_mdname;
  timer;
  cur_model;
  cur_item;
  datefrom;
  dateto;
  cur_upn; // 架构
  abnormalArr: {}[] = []; markLineX: {}[] = []; limit_arr: {} = undefined;
  constructor(private esService: EsDataServiceService,
    private datePipe: DatePipe,
    private globals: GlobalService,
    private activatedRoute: ActivatedRoute,
    private dataService: LineDataServiceService,
    private message: NzMessageService,
    private excelService: ExcelToolService
  ) { }

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
    this.cur_item = options['cur_item'];
    this.cur_model = options['cur_model'];
    this.datefrom = options['datefrom'];
    this.dateto = options['dateto'];
    this.cur_upn = options['upn'];
    console.log(options);
    if (type !== 'history') {
      this.getRetryRateLine('retry-rate', this.dataX_array,
    this.data_retryRate, this.retryRate_item, this.cur_model, this.cur_item, this.datefrom, this.dateto, this.cur_upn, false);
      this.timer = setInterval(async() => {
        this.getRetryRateLine('retry-rate', this.dataX_array, this.data_retryRate, this.retryRate_item, this.cur_model, this.cur_item, this.datefrom, this.dateto, this.cur_upn, false);
        }, 30000);
    } else {
      this.getRetryRateLine('retry-rate', this.dataX_array,
      this.data_retryRate, this.retryRate_item, this.cur_model, this.cur_item, this.datefrom, this.dateto, this.cur_upn, true);
    }
  }

  getRetryRateLine(type: string, dataX_array: {}[], data_retryRate: number[], retryRate_item: RetryRates[], cur_model, cur_item, datefrom, dateto, cur_upn, dateTag) {
    const abnormalArr = [];
    const markLineX = [];
    let limit_arr;
    // console.log(window.screen.availWidth, window.screen.availHeight);
    let esURL;
      if (this.cur_site !== 'WKS') {
        esURL = this.esService.getUrl(type + '/', '_' + this.cur_site.toLowerCase());
      } else {
        esURL = this.esService.getUrl(type + '/');
      }
    let date_range;
    let size;
    if (datefrom !== undefined && dateto !== undefined) {
      date_range = `"range": {
        "stopdate": {
          "lte": ${dateto},
          "gte": ${datefrom}
        }
      }`;
      size = `"size": 10000`;
    } else {
      date_range = `"range": {
        "stopdate": {
          "lte": "now"
        }
      }`;
      size = `"size": 10`;
    }
    let querys;
    querys = this.esService.getRetryRateQuerys(this.cur_site.toLowerCase(),
    this.cur_line.toUpperCase(),
    this.cur_mdname.toUpperCase(), this.cur_plant.toUpperCase(), cur_upn, cur_model, cur_item, date_range, size);
    console.log(querys);
    querys = JSON.parse(querys);
    console.log(querys);
    if (dataX_array !== undefined) {
      dataX_array.splice(0, dataX_array.length);
    }
    if (data_retryRate !== undefined) {
      data_retryRate.splice(0, data_retryRate.length);
    }
    if (retryRate_item !== undefined) {
      retryRate_item.splice(0, retryRate_item.length);
    }
    this.esService.postData(esURL, querys).subscribe(data => {
      console.log('测试 retry rate 查询到的数据\n', data);
      if (data['hits']['hits'].length > 500) {
        this.message.create('success', '查詢範圍過大，請重新選擇查詢日期');
        return;
      }
      for (let i = data['hits']['hits'].length - 1; i > -1; i--) {
        data_retryRate.push(data['hits']['hits'][i]._source.retryrate);
        const date_item = this.datePipe.transform(data['hits']['hits'][i]._source.stopdate, 'MM/dd HH:mm');
        // dataX_array.push(date_item);
        const item = new RetryRates();
        item.modelName = data['hits']['hits'][i]._source.modelname;
        item.stationLine = data['hits']['hits'][i]._source.stationline;
        item.stationType = data['hits']['hits'][i]._source.stationtype;
        item.stationName = data['hits']['hits'][i]._source.stationname;
        item.stationId = data['hits']['hits'][i]._source.stationid;
        item.upn = data['hits']['hits'][i]._source.upn ? data['hits']['hits'][i]._source.upn : '';
        item.retryrate = data['hits']['hits'][i]._source.retryrate;
        item.lowlimit = data['hits']['hits'][i]._source.lowerlimit;
        item.upperlimit = data['hits']['hits'][i]._source.upperlimit;
        item.stopdate = data['hits']['hits'][i]._source.stopdate;
        item.Details = data['hits']['hits'][i]._source.detail;
        if (item.upperlimit !== null && item.upperlimit < 300) {
          // debugger;
          if (item.retryrate > item.lowlimit || item.retryrate === item.lowlimit) {
            abnormalArr.push({name: 'retry rate', symbol: 'circle', symbolSize: 20, value: item.retryrate, yAxis: item.retryrate, xAxis: data['hits']['hits'].length - i - 1, itemStyle: {normal:
              {color: 'transparent', borderColor: '#dc143c', label: {show: false}}}});
            dataX_array.push({value: date_item, textStyle: {color: '#dc143c'}});
          } else {
            dataX_array.push({value: date_item});
          }
        } else {
          dataX_array.push({value: date_item});
        }
        retryRate_item.push(item);
      }
      if (retryRate_item.length > 0 && retryRate_item[0].upperlimit < 300) {
        limit_arr = {upper: retryRate_item[0].upperlimit, lower: retryRate_item[0].lowlimit};
      } else {
        limit_arr = {upper: undefined, lower: undefined};
      }
      console.log(limit_arr);
      dataX_array.push({value: ''});
      if (retryRate_item[0] !== undefined && retryRate_item[0].lowlimit > -300) {
        markLineX.push([{name: 'lower:' + retryRate_item[0].lowlimit, yAxis: retryRate_item[0].lowlimit, x: 70, label: {show: true}, itemStyle: {normal: {color: '#abc327'}}},
          {name: 'lower', yAxis: retryRate_item[0].lowlimit, xAxis: dataX_array.length - 1, itemStyle: {normal: {color: '#abc327'}}}]
          );
      }
      if (retryRate_item[0] !== undefined && retryRate_item[0].upperlimit < 300) {
        markLineX.push([{name: 'upper:' + retryRate_item[0].upperlimit, yAxis: retryRate_item[0].upperlimit, x: 70, label: {show: true}, itemStyle: {normal: {color: '#dc143c'}}},
          {name: 'upper', yAxis: retryRate_item[0].upperlimit, xAxis: dataX_array.length - 1, itemStyle: {normal: {color: '#dc143c'}}}]);
      }
    const abnormal_data = {
      num: abnormalArr.length,
      type: 'retry'
    };
    this.globals.AbnormalPot_subject.next(abnormal_data);
      this.options_line(abnormalArr, markLineX, limit_arr, dateTag);
    });
  }

  showModal(e): void {
    this.isVisible = true;
    let index;
    // debugger;
    // 確定chart圖書當前點擊的index
    console.log(e);
    if (e['data']['xAxis'] === undefined) {
      index = this.dataX_array.findIndex(x => { return x['value'] === e['name']});
    } else {
      index = e['data']['xAxis'];
    }
    // const index = this.dataX_array.findIndex(x => { return x['value'] === e['name']});
    console.log(this.dataX_array, e['name'].toString, index);
    if (this.retryRate_item[index]) {
      this.detailTable_total = [];
      this.retryRate_item[index].Details.forEach(detail => {
        const total = {
          mdname: detail['mdname'],
          tdname: detail['tdname'],
          result: this.retryRate_item[index].retryrate,
          detail: this.retryRate_item[index].Details,
          num: detail['unitserialnumber'].length,
          model: this.retryRate_item[index].modelName,
        line: this.retryRate_item[index].stationLine,
        stage: this.retryRate_item[index].stationType,
        fixture: this.retryRate_item[index].stationId,
        upper: this.retryRate_item[index].upperlimit,
        lower: this.retryRate_item[index].lowlimit,
        upn: this.retryRate_item[index].upn
        };
        this.detailTable_total.push(total);
      });
      console.log('整理的数据 ---- \n', this.detailTable_total);
    }
  }

  showSubDetail(detail) {
    // debugger;
    this.isVisible_1 = true;
    // console.log(detail['detail'], detail);
    this.detailTable_retry = detail['detail'].filter(res => res['mdname'] === detail['mdname'] && res['tdname'] === detail['tdname']);
    console.log(this.detailTable_retry, detail);
    this.retry_list = detail;
  }

  handleOk_1(): void {
    this.isVisible_1 = false;
  }

  handleCancel_1(): void {
    this.isVisible_1 = false;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  // hidden_box(e) {
  //   // e.stopPropagation();
  //   this.show_box = false;
  // }

  // StopBubble(event: Event) {
  //   event.stopPropagation();
  // }

  async options_line(abnormalArr, markLineX, limit_arr, dateTag) {
    const stageMapping = await this.dataService.getStageMapping(this.cur_mdname, this.cur_plant, this.cur_site);
    let text;
    if (stageMapping.length > 0) {
      text = `Retest Rate趨勢圖(${stageMapping[0]['chineseContrast']})`;
    } else {
      text = 'Retest Rate趨勢圖';
    }
    console.log(this.dataX_array);
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
        y2: 40,
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
        },
        formatter: 'value: {c}%'
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
            interval: 0
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
            formatter: '{value}%'
          },
          max: function(value) {
            // console.log(limit_arr);
            if (limit_arr !== undefined && limit_arr.upper > value.max) {
              return (limit_arr.upper === undefined || limit_arr.upper === null) ? (value.max + 0.3).toFixed(2) : limit_arr.upper;
            } else {
              return (value.max + 0.3).toFixed(2);
            }
          },
          min: function(value) {
            // console.log(limit_arr);
            if (limit_arr !== undefined && limit_arr.lower < value.min) {
              return (limit_arr.lower === undefined || limit_arr.lower === null) ? value.min : limit_arr.lower;
            } else {
              return value.min;
            }
          }
      },
      dataZoom: [
        {
          type: 'slider',
          show: dateTag,
          xAxisIndex: [0],
          top: '92%'
        }
      ],
      series: [{
          data: this.data_retryRate,
          type: 'line',
          itemStyle: {
            normal: {
              borderWidth: 7,
              borderColor: '#7EC0EE',
              color: '#7EC0EE',
               label: {
                show: true,
                position: 'top',
                color: 'black',
                formatter: '{c}%'
            }
            }
          },
          lineStyle: {
            normal: {
              width: 3,
              color: '#7EC0EE',
              shadowColor: 'rgba(126,192,238,0.5)',
              shadowBlur: 10,
              shadowOffsetY: 7
            }
          },
          smooth: true,
          markPoint : {
            data: abnormalArr
          },
          markLine: {
            silent: true,
            data: markLineX
          }
      }]
  };
  }

  downloadTotal(data, title) {
    if (data) {
      const downloadDatas = data.map (res => {
        return {
          '總測試不良項目': res['tdname'],
          '子測試不良項目': res['mdname'],
          'Retest Rate': res['result'],
          '测试数量': res['num']
        };
      });
      const colWidth = [];
      Object.keys(data[0]).forEach(element => {
        colWidth.push({wpx: 270});
      });
      const headerBgColor = '53868B';
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(downloadDatas)), title, colWidth, headerBgColor);
    }

  }

  downloadDetail(seriesData, dataInfo, title) {
    const data = [];
    const mergeArr = [];
    if (dataInfo) {
      if (seriesData.length > 0) {
        seriesData.forEach((row, index) => {
          // merge
          const merges = {};
          row['unitserialnumber'].forEach(number => {
            data.push({
              '機種': dataInfo['model'],
              '線別': dataInfo['line'],
              '架構': dataInfo['upn'],
              '站別': dataInfo['stage'],
              '治具編號': dataInfo['fixture'],
              '機台序列號': number.split(';*&')[0],
              '開始測試時間': number.split(';*&')[1] ? number.split(';*&')[1] : 'NA',
              '結束測試時間': number.split(';*&')[2] ? number.split(';*&')[2] : 'NA',
              '測試值': number.split(';*&')[3] ? number.split(';*&')[3] : 'NA',
              // '上限': (dataInfo['upper'] > 300 || dataInfo['upper'] === 300) ? '無設置' : dataInfo['upper'],
              // '下限': (dataInfo['lower'] < -300 || dataInfo['lower'] === -300) ? '無設置' : dataInfo['lower'],
              '測試值上限': number.split(';*&')[5] ? (number.split(';*&')[5] < 300 ? number.split(';*&')[5] : '無設置') : (dataInfo['upper'] < 300 ? dataInfo['upper'] : '無設置'),
              '測試值下限': number.split(';*&')[4] ? (number.split(';*&')[4] > -300 ? number.split(';*&')[4] : '無設置') : (dataInfo['lower'] > -300 ? dataInfo['lower'] : '無設置')
            });
          });
          for (let i = 0; i < Object.keys(data[0]).length; i++) {
            if (i !== 4) {
              mergeArr.push({s: { r: index + 1, c: i }, e: { r: row['unitserialnumber'].length , c: i } });
            }
          }
        });
        const colWidth = [];

        console.log('---------------- \n', mergeArr);

        Object.keys(data[0]).forEach((element, index) => {
          if (index === 4) {
            colWidth.push({wpx: 180});
          } else {
            colWidth.push({wpx: 120});
          }
        });
        const headerBgColor = '53868B';
        this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(data)), title, colWidth, headerBgColor);
      }
    }
  }


  ngOnDestroy() {
    clearInterval(this.timer);
    const abnormal_data = {
      num: null,
      type: 'none'
    };
    this.globals.AbnormalPot_subject.next(abnormal_data);
  }


}
