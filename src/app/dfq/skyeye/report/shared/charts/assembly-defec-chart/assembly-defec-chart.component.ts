import { Component, OnInit, OnDestroy } from '@angular/core';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
// import { RetryRates, Detail } from '../../../../model/RetryRate';
import { GlobalService } from '@service/skyeye/global.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';
import { FaRetestRate, Detail} from 'app/dfq/skyeye/model/faRetestRate';

@Component({
  selector: 'app-assembly-defec-chart',
  templateUrl: './assembly-defec-chart.component.html',
  styleUrls: ['./assembly-defec-chart.component.scss']
})
export class AssemblyDefecChartComponent implements OnInit {

  dataX_array: {}[] = [];
  data_retryRate: number[] = [];
  retryRate_item: FaRetestRate[] = [];
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
  project = 'fixture retry rate';
  cur_plant;
  cur_line;
  cur_section;
  cur_mdname;
  timer;
  cur_model;
  cur_MachineModel;
  cur_item;
  datefrom;
  dateto;
  abnormalArr: {}[] = [];
  markLineX: {}[] = [];
  limit_arr: {} = undefined;
  defect_list; // 封装的模型数据
  detailTable_loss: {}[] = []; // 第三次ui的数据，如：机台序列号
  tableUI = []; // 第三层UI下载数据
  comment: string;

  constructor(
    private esService: EsDataServiceService,
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
    this.cur_MachineModel = options.cur_MachineModel;
    this.cur_item = options['cur_item'];
    this.cur_model = options['cur_model'];
    this.datefrom = options['datefrom'];
    this.dateto = options['dateto'];
    console.log(options);
    if (type !== 'history') {
      this.getFaRetryRateLine('fa_retest_rate', this.dataX_array,
    this.data_retryRate, this.retryRate_item, this.cur_model, this.cur_MachineModel, this.cur_item, this.datefrom, this.dateto, false);
      this.timer = setInterval(async() => {
        this.getFaRetryRateLine('fa_retest_rate', this.dataX_array, this.data_retryRate, this.retryRate_item, this.cur_model, this.cur_MachineModel, this.cur_item, this.datefrom, this.dateto, false);
        }, 30000);
    } else {
      this.getFaRetryRateLine('fa_retest_rate', this.dataX_array,
      this.data_retryRate, this.retryRate_item, this.cur_model, this.cur_MachineModel, this.cur_item, this.datefrom, this.dateto, true);
    }
  }

  getFaRetryRateLine(type: string, dataX_array: {}[], data_retryRate: number[], retryRate_item: FaRetestRate[], cur_model, machineModel, cur_item, datefrom, dateto, dateTag) {
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
    let querys;
    querys = this.esService.getFaRetryRateQuerys(this.cur_site.toLowerCase(),
    this.cur_line.toUpperCase(),
    this.cur_mdname.toUpperCase(), this.cur_plant.toUpperCase(), cur_model, machineModel, cur_item, date_range, size);
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
      console.log(data['hits']['hits'].length);
      if (data['hits']['hits'].length > 500) {
        this.message.create('success', '查詢範圍過大，請重新選擇查詢日期');
        return;
      }
      if (data['hits']['hits'].length > 0) {
        this.comment = data['hits']['hits'][0]._source.Model.comment;
      }
      console.log('查询到的 URL \n', esURL);
      console.log('从 es  中查询到 组装治具retest rate 的数据 \n', data);

      for (let i = data['hits']['hits'].length - 1; i > -1; i--) {
        data_retryRate.push(data['hits']['hits'][i]._source.retestrate);
        const date_item = this.datePipe.transform(data['hits']['hits'][i]._source.executiontime, 'MM/dd HH:mm');
        // dataX_array.push(date_item);
        const item = new FaRetestRate();
        item.modelName = data['hits']['hits'][i]._source.Model;
        item.stationLine = data['hits']['hits'][i]._source.line;
        item.stationType = data['hits']['hits'][i]._source.MachineStation;
        item.stationName = data['hits']['hits'][i]._source.MachineModel;
        item.stationId = data['hits']['hits'][i]._source.MachineSN;
        item.retestrate = data['hits']['hits'][i]._source.retestrate;
        item.lowlimit = data['hits']['hits'][i]._source.lowerlimit;
        item.upperlimit = data['hits']['hits'][i]._source.upperlimit;
        item.executiontime = data['hits']['hits'][i]._source.executiontime;
        item.Details = data['hits']['hits'][i]._source.detail;

        if (item.upperlimit !== null && item.upperlimit < 300) {
          // debugger;
          if (item.retestrate > item.lowlimit || item.retestrate === item.lowlimit) {
            abnormalArr.push({name: 'retry rate', symbol: 'circle', symbolSize: 20, value: item.retestrate, yAxis: item.retestrate, xAxis: data['hits']['hits'].length - i - 1, itemStyle: {normal:
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
      type: 'fixture retry rate'
    };
    this.globals.AbnormalPot_subject.next(abnormal_data);
      this.options_line(abnormalArr, markLineX, limit_arr, dateTag);
    });
  }

  showSubDetail(detail) {
    this.isVisible_1 = true;
    this.defect_list = detail.item_detail;
    this.detailTable_loss = detail;
    this.tableUI = [];
    for (let i = 0; i < this.defect_list.length; i++) {
     const temp = {};
     temp['model'] = this.defect_list[i].ProductionSN.split(';*&')[1] ? this.defect_list[i].ProductionSN.split(';*&')[0] : detail.model;
     temp['line'] = this.defect_list[i].ProductionSN.split(';*&')[1] ? this.defect_list[i].ProductionSN.split(';*&')[1] : detail.line;
     temp['stage'] = this.defect_list[i].ProductionSN.split(';*&')[2] ? this.defect_list[i].ProductionSN.split(';*&')[2] : detail.stage;
     temp['fixture'] = this.defect_list[i].ProductionSN.split(';*&')[3] ? this.defect_list[i].ProductionSN.split(';*&')[3] : detail.fixture;
     temp['ProductionSN'] = this.defect_list[i].ProductionSN.split(';*&')[4] ? this.defect_list[i].ProductionSN.split(';*&')[4] : this.defect_list[i].ProductionSN;
     temp['StartTime'] = this.datePipe.transform(this.defect_list[i].StartTime, 'yyyy/MM/dd HH:mm:ss');
     temp['EndTime'] = this.datePipe.transform(this.defect_list[i].EndTime, 'yyyy/MM/dd HH:mm:ss');
     temp['result'] = this.defect_list[i].result;
     temp['item_upperlimit'] = this.defect_list[i].item_upperlimit;
     temp['item_lowerlimit'] = this.defect_list[i].item_lowerlimit;
     this.tableUI.push(temp);
    }
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


  showModal(e): void {
    this.isVisible = true;
    let index;
    // debugger;
    // 確定chart圖書當前點擊的index
    console.log('当前点击的是那个点\n', e);
    if (e['data']['xAxis'] === undefined) {
      index = e.dataIndex;
    } else {
      index = e['data']['xAxis'];
    }
    // const index = this.dataX_array.findIndex(x => { return x['value'] === e['name']});
    console.log(this.dataX_array);
    console.log('===============\n', e['name'].toString);
    console.log('index = ' + index);
    if (this.retryRate_item[index]) {
      this.detailTable_total = [];
      this.retryRate_item[index].Details.forEach(detail => {
        const total = {
        //   mdname: detail['mdname'],
        //   tdname: detail['tdname'],
        //   result: this.retryRate_item[index].retestrate,
        //   detail: this.retryRate_item[index].Details,
        //   num: detail['unitserialnumber'].length,
        //   model: this.retryRate_item[index].modelName,
        // line: this.retryRate_item[index].stationLine,
        // stage: this.retryRate_item[index].stationType,
        // fixture: this.retryRate_item[index].stationId,
        // upper: this.retryRate_item[index].upperlimit,
        // lower: this.retryRate_item[index].lowlimit
        model: this.retryRate_item[index].modelName,
        line: this.retryRate_item[ index].stationLine,
        stage: this.retryRate_item[index].stationType,
        fixture: this.retryRate_item[index].stationId,

        tdname: detail.tdname,
        mdname: detail.mdname,
        retestrate: this.retryRate_item[index].retestrate,
        num: detail['item_detail'].length,
        item_detail: detail['item_detail'],
        };
        this.detailTable_total.push(total);
      });
    }
  }



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
          '壓頭編號': res['tdname'],
          '測試不良項目': res['mdname'],
          'Retest Rate': res['retestrate'],
          '測試數量': res['num']
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

  downloadDetail(title) {
    if (this.tableUI) {
      const downloadDatas = this.tableUI.map (res => {
        return {
          '機種': res.model,
          '線別': res.line,
          '站別': res.stage,
          '治具編號': res.fixture,
          '機台序列號': res.ProductionSN,
          '開始測試時間': res.StartTime,
          '結束測試時間': res.EndTime,
          '测试值': res.result,
          '测试值上限': res.item_upperlimit,
          '测试值下限': res.item_lowerlimit
        };
      });
      const colWidth = [];
      Object.keys(this.tableUI[0]).forEach(element => {
        colWidth.push({wpx: 150});
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
}
