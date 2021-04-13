import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { DatePipe } from '@angular/common';
import { GlobalService } from '@service/skyeye/global.service';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';
import { FacpkModel,Detail } from 'app/dfq/skyeye/model/facpk';

@Component({
  selector: 'app-facpk-chart',
  templateUrl: './facpk-chart.component.html',
  styleUrls: ['./facpk-chart.component.scss']
})
export class FacpkChartComponent implements OnInit {
  isShowNormalDis = false;
  isVisible1 = false;
  isVisible1_1 = false;
  footer1 = null;
  footer1_1 = null;
  cancelOK1 = false;
  cancelOK1_1 = false;
  isVisible2 = false;
  isVisible2_2 = false;
  footer2 = null;
  footer2_2 = null;
  cancelOK2 = false;
  cancelOK2_2 = false;
  cur_site;
  cur_plant;
  cur_line;
  cur_section;
  cur_mdname;
  cur_model;
  cur_bt;
  cur_st;
  timer;
  cur_MachineModel: string;  // 治具类别
  cur_item;
  datefrom;
  dateto;
  detailTable_sliding: {}[] = [];
  detailTable_tubling: {}[] = [];
  sliding_list: {};
  tubling_list: {};
  detailTable_sliding_total: {}[] = [];
  detailTable_tubling_total: {}[] = [];
  detailNo_sliding: string;
  dateX_array: {}[] = [];
  data_cpk: {}[] = [];
  cpkSliding_array: FacpkModel[] = [];
  data_cpk2: {}[] = [];
  dataX_array2: {}[] = [];
  show_box1 = false;
  show_box2 = false;
  line_chart_sliding;
  normalDistribution; // 正态分布图
  line_chart_tubling;
  abnormalPointSliding: {}[] = [];
  abnormalPointTubling: {}[] = [];
  sliding_abnormal_num: number;
  tubling_abnormal_num: number;
  tableOne = []; // 弹出的第一层table数据
  tableTwo = []; // 弹出的第二层table数据
  comment = [];
  normalDisData = []; // 正态分布图数据
  normalDisData1 = []; // 计算得到的正态分布数据
  averageDis; // 正态分布图的期望
  standardDev; // 标准差
  lowerlimit;
  upperlimit;
  showCount = 0;


  constructor(
    private esService: EsDataServiceService,
    private globals: GlobalService,
    private datePipe: DatePipe,
    private dataService: LineDataServiceService,
    private message: NzMessageService,
    private excelService: ExcelToolService
  ) { }

  ngOnInit() {
  }

  queryOp (options, type?) {
    console.log(this.timer);
    clearInterval(this.timer);
    console.log( '传入echart的参数 ##', options);
    // debugger;
    this.cur_site = options['cur_site'];
    this.cur_plant = options['cur_plant'];
    this.cur_section = options['cur_section'];
    this.cur_line = options['cur_line'];
    this.cur_mdname = options['cur_mdname'];
    this.cur_model = options['cur_model'];
    this.cur_MachineModel = options['cur_MachineModel'];
    this.cur_item = options['cur_item'];
    this.cur_st = options['cur_st'];
    this.cur_bt = options['cur_bt'];
    this.datefrom = options['datefrom'];
    this.dateto = options['dateto'];



    if (type !== 'history') {
    this.getFACKPLine('fa_tumbling_cnt_cpk', this.data_cpk, this.dateX_array, this.cpkSliding_array, this.cur_model,this.cur_MachineModel, this.cur_item,
    this.cur_st, this.cur_bt, this.datefrom, this.dateto, false);
      this.timer = setInterval(async() => {
        this.getFACKPLine('fa_tumbling_cnt_cpk', this.data_cpk, this.dateX_array, this.cpkSliding_array, this.cur_model, this.cur_MachineModel, this.cur_item,
        this.cur_st, this.cur_bt, this.datefrom, this.dateto, false);
       }, 30000);
    } else {
      this.getFACKPLine('fa_tumbling_cnt_cpk', this.data_cpk, this.dateX_array, this.cpkSliding_array, this.cur_model, this.cur_MachineModel, this.cur_item,
      this.cur_st, this.cur_bt, this.datefrom, this.dateto, true);
    }
    console.log(this.timer);
  }


  getFACKPLine( type, data_cpk: {}[], dateX_array: {}[], cpkItem_array: FacpkModel[], mdname, cur_MachineModel, cur_item, cur_st, cur_bt, datefrom, dateto, dateTag) {
    let querys;
    console.log(this.cur_bt, this.cur_st);
    const abnormalArr = [];
    const markLineX = [];
    let limit_arr;
    let date_range;
    let size;
    let esURL;
    if (this.cur_site !== 'WKS') {
      esURL = this.esService.getUrl(type + '/',  '_' + this.cur_site.toLowerCase());
    } else {
      esURL = this.esService.getUrl(type + '/');
    }
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
    if (type === 'fa_tumbling_cnt_cpk') {
      querys = this.esService.getQueryByFACPKSliding(this.cur_site.toLowerCase(),
      this.cur_line.toUpperCase(),
      this.cur_mdname.toUpperCase(), this.cur_plant.toUpperCase(), mdname, cur_MachineModel, cur_item, cur_st, cur_bt, date_range, size);
    }

    console.log(esURL, querys);
  // querys = JSON.parse(querys);
  console.log('fa_tumbling_cnt_cpk  查询的语句 ## \n');
  console.log(querys);
  if (data_cpk !== undefined) {
     data_cpk.splice(0, data_cpk.length);
  }
  if (dateX_array !== undefined) {
    dateX_array.splice(0, dateX_array.length);
  }
  if (cpkItem_array !== undefined) {
    cpkItem_array.splice(0, cpkItem_array.length);
  }
    this.esService.postData(esURL, querys).subscribe(data => {
    console.log('facpk ===fa_tumbling_cnt_cpk ##@@查询到的数据 === \n', data);
    if (data['hits']['hits'].length > 500) {
      this.message.create('success', '查詢範圍過大，請重新選擇查詢日期');
      return;
    }
    // 显示辅助信息
    if (data['hits']['hits'].length > 0 && data['hits']['hits'][0]._source.comment) {
      this.comment = data['hits']['hits'][0]._source.comment.split(',');
      this.showCount = data['hits']['hits'][0]._source.detail.length;
    }
    this.normalDisData = [];
    for (let i = data['hits']['hits'].length - 1; i > -1; i--) {
      // const disData = {};
      // disData['cpk'] =  data['hits']['hits'][i]._source.cpk;
      // disData['count'] =  data['hits']['hits'][i]._source.detail.length;
      // this.normalDisData.push(disData);
      data_cpk.push({value: data['hits']['hits'][i]._source.cpk});
      // 时间
      const date_item = this.datePipe.transform(data['hits']['hits'][i]._source.executiontime, 'MM/dd HH:mm');
      const item = new FacpkModel();
      // 机种
      item.modelName = data['hits']['hits'][i]._source.Model;
      // 线别
      item.stationLine = data['hits']['hits'][i]._source.line;
      // 站别
      item.stationType = data['hits']['hits'][i]._source.MachineStation;
      // 暂定为治具类别
      item.stationName = data['hits']['hits'][i]._source.MachineModel;
      // 治具编号
      item.stationId = data['hits']['hits'][i]._source.MachineSN;
      // 压头编号
      item.tdName = data['hits']['hits'][i]._source.tdname;
      // 监控项目
      item.mdName = data['hits']['hits'][i]._source.mdname;
      // cpk的结果
      item.cpk = data['hits']['hits'][i]._source.cpk;
      item.lowerLimit = data['hits']['hits'][i]._source.lowerlimit;
      item.upperLimit = data['hits']['hits'][i]._source.upperlimit;
      // 暂定为commnet
      item.goodLimit = data['hits']['hits'][i]._source.comment;
      item.Details = data['hits']['hits'][i]._source.detail;
      // const aa = item.Details[0]['unitserialnumber'];
      if (item.upperLimit !== null && item.upperLimit < 300 ) {
        if (item.cpk < item.upperLimit) {
          abnormalArr.push({name: '異常點', symbol: 'circle', symbolSize: 20, value: item.cpk, yAxis: item.cpk, xAxis: data['hits']['hits'].length - i - 1, itemStyle: {normal:
            {color: 'transparent', borderColor: '#dc143c', label: {show: false}}}});
          dateX_array.push({value: date_item, textStyle: {color: '#dc143c'}});
        } else {
          dateX_array.push({value: date_item});
        }
      } else {
        dateX_array.push({value: date_item});
      }
      cpkItem_array.push(item);
    }
    console.log('数据模型 === 数组 ## \n', cpkItem_array);
    dateX_array.push({value: ''});
      if (cpkItem_array[0] !== undefined && cpkItem_array[0].lowerLimit > -300) {
        markLineX.push([{name: 'lower:' + cpkItem_array[0].lowerLimit, yAxis: cpkItem_array[0].lowerLimit, x: 70, label: {show: true}, itemStyle: {normal: {color: '#abc327'}}},
          {name: 'lower', yAxis: cpkItem_array[0].lowerLimit, xAxis: dateX_array.length - 1, itemStyle: {normal: {color: '#abc327'}}}]
          );
          limit_arr = {upper: cpkItem_array[0].upperLimit, lower: cpkItem_array[0].lowerLimit};
      }
      if (cpkItem_array[0] !== undefined && cpkItem_array[0].upperLimit < 300) {
        markLineX.push([{name: 'upper:' + cpkItem_array[0].upperLimit, yAxis: cpkItem_array[0].upperLimit, x: 70, label: {show: true}, itemStyle: {normal: {color: '#dc143c'}}},
          {name: 'upper', yAxis: cpkItem_array[0].upperLimit, xAxis: dateX_array.length - 1, itemStyle: {normal: {color: '#dc143c'}}}]);
      }


    if (type === 'fa_tumbling_cnt_cpk') {
      this.options_line(abnormalArr, markLineX, limit_arr, dateTag);
      this.sliding_abnormal_num = abnormalArr.length;
    }
    if (!dateTag) {
      const abnormal_data = {
        num: this.sliding_abnormal_num + this.tubling_abnormal_num,
        type: 'assy fixturecpk'
      };
      this.globals.AbnormalPot_subject.next(abnormal_data);
    }
    console.log(limit_arr);
  });
  }



  showbox_sliding(e) {
    this.detailTable_sliding_total = [];
    this.isVisible1 = true;
    let index;
    if (e['data']['xAxis'] === undefined) {
      index = e.dataIndex;
    } else {
      index = e['data']['xAxis'];
    }

  // 第二层UI数据
    this.tableOne = [];
    const temp = {};
    temp['mdname'] = this.cpkSliding_array[index].mdName;
    temp['status'] = this.cpkSliding_array[index].Details[0].status;
    temp['count'] = this.cpkSliding_array[index].Details['length'];
    temp['string'] = 'Link';
    temp['model'] = this.cpkSliding_array[index].modelName; // 机种
    temp['line'] = this.cpkSliding_array[index].stationLine; // 线别
    temp['machineStation'] = this.cpkSliding_array[index].stationType;  // 站别
    temp['machineSN'] = this.cpkSliding_array[index].stationId; // 治具编号
    temp['detail'] = this.cpkSliding_array[index].Details;
    this.tableOne.push(temp);
  }

  showSubDetail_sliding(data) {
    this.isVisible1_1  = true;
    this.tableTwo = [];
    for (let i = 0; i < data.detail.length; i++) {
      const temp = {};
      temp['model'] = data.model; // 机种
      temp['line'] = data.line; // 线别
      temp['machineStation'] = data.machineStation;  // 站别
      temp['machineSN'] = data.machineSN; // 治具编号

      temp['ProductionSN'] = data.detail[i].ProductionSN;
      temp['StartTime'] = this.datePipe.transform(data.detail[i].StartTime, 'yyyy/MM/dd HH:mm:ss');
      temp['EndTime'] = this.datePipe.transform(data.detail[i].EndTime, 'yyyy/MM/dd HH:mm:ss');
      temp['result'] = data.detail[i].result;
      temp['item_lowerlimit'] = data.detail[i].item_lowerlimit;
      temp['item_upperlimit'] = data.detail[i].item_upperlimit;
      this.tableTwo.push(temp);
    }

    // this.detailTable_sliding.push(detail);
  }


  showSubDetail_tubling(detail) {
    this.isVisible2_2  = true;
    this.detailTable_tubling = detail['detail'];
    this.tubling_list = detail;
  }


  showNormalDistibution(data) {

    // 获取上下限
    this.lowerlimit = data.detail[0].item_lowerlimit;
    this.upperlimit = data.detail[0].item_upperlimit;
    // console.log('上下限数据 === \n' ,this.lowerlimit,this.upperlimit);

    const arr = [];
    for (let i = 0; i < data.detail.length; i++) {
      arr.push(data.detail[i].result);
    }
    const aim = [];
    for (let i = 0; i < arr.length; i++) {
      const temp = {};
      temp['value'] = arr[i];
      temp['count'] = this.getSameValueCount(arr, arr[i]);
      aim.push(temp);
    }

    // 将上下限放入aim
    aim.push({value: this.lowerlimit, count: 0});
    aim.push({value: this.upperlimit, count: 0});

    // 去除重复数据
    this.normalDisData = [];
    const obj = {};
    // tslint:disable-next-line: no-shadowed-variable
    this.normalDisData = aim.reduce(( item: any, next) => {
      // tslint:disable-next-line: no-unused-expression
      obj[next.value] ? '' : obj[next.value] = true && item.push(next);
      return item;
    }, []);

     // 将数据按照cpk的数值从小到大排列
     this.normalDisData.sort((a, b) => {
      return a.value - b.value;
    });
    // console.log('排序后的数据 ## \n', this.normalDisData);

      // 需要的数据
    this.normalDisData1 = [];
    let xData = [];
    const yData = [];

    for (let i = 0; i < this.normalDisData.length; i++) {
      xData.push(this.normalDisData[i].value);
      yData.push(this.normalDisData[i].count);
    }

    // 获取count最大值
    const lineTop = Math.max(...yData);
    this.isShowNormalDis = true;
    // 计算平均数
    this.averageDis = this.average(this.normalDisData, 'value', 'count');
    // console.log('平均数 = \n', this.averageDis);
    // 计算标准差
    this.standardDev = this.standardDeviation(this.normalDisData, this.averageDis, 'value', 'count');
    // console.log('计算标准差 = \n', this.standardDev);

    const mean = this.averageDis;
    const low = this.averageDis - this.standardDev * 3;
    const up = this.averageDis + this.standardDev * 3;

    xData = this.addParam(xData, low.toFixed(2));
    xData = this.addParam(xData, mean.toFixed(2));
    xData = this.addParam(xData, up.toFixed(2));
    for (let i = 0; i < xData.length; i++) {
      this.normalDisData1.push(this.normalDistributionData(xData[i], this.averageDis, this.standardDev).toFixed(2))
    }

    const markLineY = [];
    // markLineX.push([{name: 'lower:' + cpkItem_array[0].lowerLimit, yAxis: cpkItem_array[0].lowerLimit, x: 70, label: {show: true}, itemStyle: {normal: {color: '#abc327'}}},
    // {name: 'lower', yAxis: cpkItem_array[0].lowerLimit, xAxis: dateX_array.length - 1, itemStyle: {normal: {color: '#abc327'}}}]);

    // markLineX.push([{name: 'upper:' + cpkItem_array[0].upperLimit, yAxis: cpkItem_array[0].upperLimit, x: 70, label: {show: true}, itemStyle: {normal: {color: '#dc143c'}}},
    // {name: 'upper', yAxis: cpkItem_array[0].upperLimit, xAxis: dateX_array.length - 1, itemStyle: {normal: {color: '#dc143c'}}}]);

    markLineY.push([{name: 'lower' + this.lowerlimit, yAxis: 0, xAxis: xData.indexOf(this.lowerlimit) , itemStyle: {normal: {color: '#abc327'}}},
    {name: 'lower:', xAxis: xData.indexOf(this.lowerlimit) , yAxis: lineTop, label: {show: true}, itemStyle: {normal: {color: '#abc327'}}}]);

    markLineY.push([{name: 'upper' + this.upperlimit, yAxis: 0, xAxis: xData.indexOf(this.upperlimit)  , itemStyle: {normal: {color: '#dc143c'}}},
    {name: 'upper:', xAxis: xData.indexOf(this.upperlimit)  , yAxis: lineTop, label: {show: true}, itemStyle: {normal: {color: '#dc143c'}}}]);

    // console.log('markLine: =============@# \n',markLineY);

    // 绘制正态分布图
    this.normalDistribution = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    grid: {
      y: 70,
      y2: 40,
      x: 70
    },
    xAxis: [
        {
            type: 'category',
            data: xData,
            axisPointer: {
                type: 'shadow'
            }
        }
    ],
    yAxis: [
        {
            name: '数量',
        },
        {
            name: '正态分布值',
        }
    ],
    series: [
        {
            name: 'Test Count',
            type: 'bar',
            data: yData,
            markLine: {
              silent: true,
              data: markLineY
            }
        },
        {
            name: 'Actual Capacity',
            type: 'line',
            yAxisIndex: 1,
            data: this.normalDisData1
        }
    ]
    };
  }

  handleCanceldis() {
    this.isShowNormalDis = false;
  }

  handleOkdis() {
    this.isShowNormalDis = false;
  }

  handleOk1(): void {
    this.isVisible1 = false;
  }

  handleOk1_1(): void {
    this.isVisible1_1 = false;
  }

  handleCancel2(): void {
    this.isVisible2 = false;
  }

  handleCancel2_2(): void {
    this.isVisible2_2 = false;
  }
  handleOk2(): void {
    this.isVisible2 = false;
  }

  handleOk2_2(): void {
    this.isVisible2_2 = false;
  }

  handleCancel1(): void {
    this.isVisible1 = false;
  }

  handleCancel1_1(): void {
    this.isVisible1_1 = false;
  }






  async options_line(abnormalArr, markLineX, limit_arr, dateTag) {
    const stageMapping = await this.dataService.getStageMapping(this.cur_mdname, this.cur_plant, this.cur_site);
    const TestItemMapping = await this.dataService.getTestItemMapping(this.cur_plant, this.cur_site, this.cur_bt, this.cur_st).toPromise();
    console.log(stageMapping);
    let text;
    if (stageMapping.length > 0 && TestItemMapping.length > 0) {
      text = `CPK定量型監控:每生产100PCS则计算一次CPK(${stageMapping[0]['chineseContrast']} : ${TestItemMapping[0]['chineseContrast']})`;
    } else {
      text = 'CPK定量型監控:每生产100PCS则计算一次CPK';
    }
    this.line_chart_sliding = {
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
      backgroundColor: 'rgba(255,255,255,0.7)',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.7)',
        axisPointer: {
          type: 'shadow'
        },
        formatter: 'cpk <br/> {b} - {c}',
        textStyle: {
            color: 'black'
        }
    },
    calculable : true,
      xAxis: {
          type: 'category',

          data: this.dateX_array,
          axisLine: {
            lineStyle: {
              width: 1,
              color: 'black'
            }
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
          max: function(value) {
            // console.log(limit_arr);
            if (limit_arr !== undefined && limit_arr.upper > value.max) {
              return limit_arr.upper === undefined ? (value.max + 0.3).toFixed(2) : limit_arr.upper;
            } else {
              return (value.max + 0.3).toFixed(2);
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
          show: dateTag,
          xAxisIndex: [0]
        }
      ],
      series: [{
          name: 'cpk',
          data: this.data_cpk,
          type: 'line',
          lineStyle: {
            normal: {
              width: 3,
              color: '#7EC0EE',
              shadowColor: 'rgba(126,192,238,0.5)',
              shadowBlur: 10,
              shadowOffsetY: 7
            }
          },
          itemStyle: {
            normal: {
              borderWidth: 7,
              borderColor: '#7EC0EE',
              color: '#7EC0EE',
               label: {
                show: true,
                position: 'top',
                color: 'black'
            }
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
        '監控項目': res['mdname'],
        '測試結果': res['status'],
        '测试数量': res['count'],
        '正態分佈圖': res['string']
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



downloadDetail(data, title) {
  if (data) {
    const downloadDatas = data.map (res => {
      return {
        '機種': res.model,
        '線別': res.line,
        '站別': res.machineStation,
        '治具編號': res.machineSN,
        '機台序列號': res.ProductionSN,
        '開始測試時間': res.StartTime,
        '結束測試時間': res.EndTime,
        '测试值': res.result,
        '測試值上限': res.item_upperlimit,
        '測試值下限': res.item_lowerlimit
      };
    });
    const colWidth = [];
    Object.keys(data[0]).forEach(element => {
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



average(arr, key1, key2) {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    count = count + arr[i][key2];
    sum = sum + arr[i][key1] * arr[i][key2];
  }
  return parseFloat((sum / count).toFixed(2));
}

standardDeviation(arr, average, key1, key2) {
  let count = 0;
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    count = count + arr[i][key2];
    sum = sum + ((arr[i][key1] - average) * (arr[i][key1] - average)) * arr[i][key2];
  }
  return parseFloat(Math.sqrt((sum / count)).toFixed(2));
}

normalDistributionData(x, aver, standDev) {
  if (standDev !== 0) {
    return ((1 / Math.sqrt(2 * Math.PI) * standDev) * Math.exp(-1 * ((x - aver) * (x - aver)) / (2 * standDev * standDev)));
  } else {
    return 0 ;
  }
}

  getSameValueCount(arr, val) {
    const processArr = arr.filter(function(value) {
      return value === val;
    });
    return processArr.length;
  }

   addParam(arr, target1) {
     let flag = false;
     const target = parseFloat(target1);
     if (target < parseFloat(arr[0])) {
         arr.unshift(target);
         return arr;
     }

     if (target > parseFloat(arr[arr.length - 1])) {
         arr.push(target);
         return arr;
     }
     for (var i = 0; i < arr.length; i++) {
         if (parseFloat(arr[i]) > target) {
             if (arr[i - 1] === target) {
                 flag = true;
             }
             break;
         }
     }
     if (flag) {
         return arr;
     } else {
         arr.splice(i, 0, target);
         return arr;
     }
    }
}
