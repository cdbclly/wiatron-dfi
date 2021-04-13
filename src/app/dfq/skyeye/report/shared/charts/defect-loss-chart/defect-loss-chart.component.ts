import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { ActivatedRoute } from '@angular/router';
import { DefectLoss, Detail } from 'app/dfq/skyeye/model/DefectLoss';
import { GlobalService } from '@service/skyeye/global.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';

@Component({
  selector: 'app-defect-loss-chart',
  templateUrl: './defect-loss-chart.component.html',
  styleUrls: ['./defect-loss-chart.component.scss']
})
export class DefectLossChartComponent implements OnInit, OnDestroy {

  cur_site = 'WKS';
  isVisible = false;
  footer = null;
  cancelOK = false;
  isVisible_1 = false;
  footer_1 = null;
  cancelOK_1 = false;
  detailTable_total: {}[] = [];
  detail_list: {}[] = [];
  project = 'fpyr';
  cur_model;
  cur_plant;
  cur_line;
  cur_section;
  cur_mdname;
  cur_item;
  timer;
  // upn;
  dataX_array: {}[] = [];
  data_loss: number[] = [];
  loss_itemArray: DefectLoss[] = [];
  detailTable_loss: {}[] = [];
  defect_list = [];
  line_chart;
  datefrom;
  dateto;
  constructor(private dataService: LineDataServiceService,
    private esService: EsDataServiceService,
    private datePipe: DatePipe,
    private globals: GlobalService,
    private activatedRoute: ActivatedRoute,
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
    this.cur_model = options['cur_model'];
    this.cur_item = options['cur_item'];
    this.datefrom = options['datefrom'];
    this.dateto = options['dateto'];
    // this.upn = options['upn'];
    if (type !== 'history') {
      this.getDefectLossLine('fpyr', this.dataX_array, this.data_loss, this.loss_itemArray, this.cur_model, this.datefrom, this.dateto, false);
      this.timer = setInterval(async() => {
        this.getDefectLossLine('fpyr', this.dataX_array, this.data_loss, this.loss_itemArray, this.cur_model,  this.datefrom, this.dateto, false);
      }, 30000);
    } else {
      this.getDefectLossLine('fpyr', this.dataX_array, this.data_loss, this.loss_itemArray, this.cur_model,  this.datefrom, this.dateto, true);
    }
  }

  show_boxs(e) {
    this.isVisible = true;
    let index;
    if (e['data']['xAxis'] === undefined) {
      index = this.dataX_array.findIndex(x => { return x['value'] === e['name']});
    } else {
      index = e['data']['xAxis'];
    }
    this.detailTable_total = [];
    this.loss_itemArray[index].Details.forEach(detail => {
      const total = {
        mdname: detail['mdname'],
        tdname: detail['tdname'],
        result: this.loss_itemArray[index].failrate,
        detail: this.loss_itemArray[index].Details,
        num: detail['item_detail'].length,
        model: this.loss_itemArray[index].modelName,
      line: this.loss_itemArray[ index].stationLine,
      stage: this.loss_itemArray[index].stationType,
      upper: this.loss_itemArray[index].upperlimit,
      lower: this.loss_itemArray[index].lowlimit
      };
      console.log(this.loss_itemArray[index].Details[0]);
      this.detailTable_total.push(total);
    });
  }

  showSubDetail(detail) {
    this.isVisible_1 = true;
    const data = detail['detail'][0];
    this.defect_list = [];
    if (data['item_detail'].length > 0) {
      for (let i = 0; i < data['item_detail'].length; i++) {
        const dic = {};
        dic['modelName'] = this.loss_itemArray[0].modelName;
        dic['stationLine'] = this.loss_itemArray[0].stationLine;
        dic['stationType'] = this.loss_itemArray[0].stationType;
        dic['stationid'] = data['item_detail'][i].stationid;
        // dic['upn'] = this.loss_itemArray[0].upn;
        dic['unitserialnumber'] = data['item_detail'][i].unitserialnumber;
        dic['item_startdate'] = data['item_detail'][i].item_startdate;
        dic['item_stopdate'] = data['item_detail'][i].item_stopdate;
        dic['mdresult'] = data['item_detail'][i].mdresult;
        dic['mdupperlimit'] = data['item_detail'][i].mdupperlimit;
        dic['mdlowerlimit'] = data['item_detail'][i].mdlowerlimit;
        dic['mdstatus'] = data['item_detail'][i].mdstatus;
        this.defect_list.push(dic);
      }
    }
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk_1(): void {
    this.isVisible_1 = false;
  }

  handleCancel_1(): void {
    this.isVisible_1 = false;
  }

  async getDefectLossLine(type: string, dataX_array: {}[], data_loss: number[], loss_itemArray: DefectLoss[], model,  datefrom, dateto, dateTag) {
    const abnormalArr = [];
    const markLineX = [];
    console.log(dateTag);
    loss_itemArray = [];
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
    let limit_arr;
    let querys;
    querys = this.esService.getDefectLoss(this.cur_site.toLowerCase(),
      this.cur_line.toUpperCase(),
      this.cur_mdname.toUpperCase(), this.cur_plant.toUpperCase(), model,  date_range, size);
      console.log(querys);
      querys = JSON.parse(querys);
    if (data_loss !== undefined) {
      data_loss.splice(0, data_loss.length);
   }
   if (dataX_array !== undefined) {
     dataX_array.splice(0, dataX_array.length);
   }
   if (loss_itemArray !== undefined) {
    loss_itemArray.splice(0, dataX_array.length);
   }
    const data = await this.esService.postData(esURL, querys).toPromise();
     if (data['hits']['hits'].length > 500) {
      this.message.create('success', '查詢範圍過大，請重新選擇查詢日期');
      return;
    }
     for (let i = data['hits']['hits'].length - 1; i > -1; i--) {
       data_loss.push(data['hits']['hits'][i]._source.fpyr);
       const date_item = this.datePipe.transform(data['hits']['hits'][i]._source.stopdate, 'MM/dd HH:mm');
       const item = new DefectLoss();
       item.modelName = data['hits']['hits'][i]._source.modelname;
      //  item.upn = data['hits']['hits'][i]._source.upn;
       item.stationLine = data['hits']['hits'][i]._source.stationline;
       item.stationType = data['hits']['hits'][i]._source.stationtype;
       item.stationName = data['hits']['hits'][i]._source.stationname;
       item.failrate = data['hits']['hits'][i]._source.fpyr;
       item.lowlimit = data['hits']['hits'][i]._source.lowerlimit;
       item.upperlimit = data['hits']['hits'][i]._source.upperlimit;
       item.stopdate = data['hits']['hits'][i]._source.stopdate;
       item.Details = data['hits']['hits'][i]._source.detail;
      if (item.upperlimit !== null && item.upperlimit < 300) {
        if (item.failrate < item.upperlimit || item.failrate === item.upperlimit) {
          abnormalArr.push({name: 'FPYR', symbol: 'circle', symbolSize: 20, value: item.failrate, yAxis: item.failrate, xAxis: data['hits']['hits'].length - i - 1, itemStyle: {normal:
            {color: 'transparent', borderColor: '#dc143c', label: {show: false}}}});
          dataX_array.push({value: date_item, textStyle: {color: '#dc143c'}});
        } else {
          dataX_array.push({value: date_item});
        }
      } else {
        dataX_array.push({value: date_item});
      }
       loss_itemArray.push(item);
     }
     dataX_array.push({value: ''});
    if (loss_itemArray[0] !== undefined && loss_itemArray[0].lowlimit > -300) {
      console.log(window.screen.width, window.screenX, window.screen.availWidth);
      limit_arr = {upper: loss_itemArray[0].upperlimit, lower: loss_itemArray[0].lowlimit};
      markLineX.push([{name: 'lower:' + loss_itemArray[0].lowlimit, yAxis: loss_itemArray[0].lowlimit, x: 70, label: {show: true}, itemStyle: {normal: {color: '#abc327'}}},
        {name: 'lower', yAxis: loss_itemArray[0].lowlimit, xAxis: dataX_array.length - 1, itemStyle: {normal: {color: '#abc327'}}}]
        );
      }
    if (loss_itemArray[0] !== undefined && loss_itemArray[0].upperlimit < 300) {
      markLineX.push([{name: 'upper:' + loss_itemArray[0].upperlimit, yAxis: loss_itemArray[0].upperlimit, x: 70, label: {show: true}, itemStyle: {normal: {color: '#dc143c'}}},
        {name: 'upper', yAxis: loss_itemArray[0].upperlimit, xAxis: dataX_array.length - 1, itemStyle: {normal: {color: '#dc143c'}}}]);
    }
     this.loss_itemArray = loss_itemArray;
    if (!dateTag) {
      const abnormal_data = {
        num: abnormalArr.length,
        type: 'defect'
      };
      this.globals.AbnormalPot_subject.next(abnormal_data);
    }
     this.options_line(abnormalArr, markLineX, limit_arr, dateTag);
  }

  async options_line(abnormalArr, markLineX, limit_arr, dateTage) {
    const stageMapping = await this.dataService.getStageMapping(this.cur_mdname, this.cur_plant, this.cur_site);
    let text;
    console.log(dateTage);
    if (stageMapping.length > 0) {
      text = `測試第一次通過率監控(${stageMapping[0]['chineseContrast']})`;
    } else {
      text = '測試第一次通過率監控';
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
              color: 'black',
            }
          },
          axisLabel: {
            formatter: '{value}%'
          },
          max: function(value) {
            // console.log(limit_arr);
            if (limit_arr !== undefined && limit_arr.upper > value.max) {
              return limit_arr.upper === undefined ? (value.max).toFixed(2) : limit_arr.upper;
            } else {
              return (value.max).toFixed(2);
            }
          },
          min: function(value) {
            // console.log(limit_arr);
            if (limit_arr !== undefined && limit_arr.lower < value.min) {
              return limit_arr.lower === undefined ? value.min : limit_arr.lower;
            } else {
              return value.min;
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
      series: [{
          name: 'defect loss',
          data: this.data_loss,
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
          'YPYR': res['result'],
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

  downloadDetail(dataInfo, title) {
    if (dataInfo) {
      const downloadDatas = dataInfo.map (res => {
        return {
          '機種': res.modelName,
          '線別': res.stationLine,
          '站別': res.stationType,
          '治具編號': res.stationid,
          // '架構': res.upn,
          '機台序列號': res.unitserialnumber,
          '開始測試時間': this.datePipe.transform(res.item_startdate, 'yyyy/MM/dd HH:mm:ss'),
          '結束測試時間': this.datePipe.transform(res.item_stopdate, 'yyyy/MM/dd HH:mm:ss'),
          '测试值': res.mdresult,
          '测试值上限': res.mdupperlimit,
          '测试值下限': res.mdlowerlimit,
          '測試結果': res.mdstatus
        };
      });
      const colWidth = [];
      Object.keys(dataInfo[0]).forEach((element, index) => {
        if (index === 5) {
          colWidth.push({wpx: 180});
        } else {
          colWidth.push({wpx: 130});
        }
      });
      const headerBgColor = '53868B';
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(downloadDatas)), title, colWidth, headerBgColor);
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
