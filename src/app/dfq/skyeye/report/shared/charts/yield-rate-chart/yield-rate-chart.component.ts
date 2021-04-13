import { Component, OnInit } from '@angular/core';
import { YeildModel } from 'app/dfq/skyeye/model/yeild';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { GlobalService } from '@service/skyeye/global.service';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';


@Component({
  selector: 'app-yield-rate-chart',
  templateUrl: './yield-rate-chart.component.html',
  styleUrls: ['./yield-rate-chart.component.scss']
})
export class YieldRateChartComponent implements OnInit {

     // 厂别
   cur_site = 'WKS';
   cur_plant: string;  // 厂区
   cur_line: string;   // 线别
   cur_section: string;  // 制程
   cur_mdname: string;  // 站别
   cur_model: string;  // 机种
   cur_MachineModel: string;  // 治具类别
   cur_item: string; // 治具编号
   // 查询日期范围
   datefrom: any;
   dateto: any;
   timer: any;
   dataX_array: Array<any> = [];
  //  echart封装的数据模型
   yeildModel: Array<YeildModel> = [];
   data_loss: number[] = []; // 良率数组（每个点的y值）
   loss_itemArray: YeildModel[] = []; // 存入良率封装模型数据的数组
   line_chart; // echart 指定图表的配置项和数据
   column_chart; // 柱状图
   isVisible = false;
   isVisible_1 = false;
   detailTable_total: {}[] = []; // 第二层ui数据
   detailTable_loss: {}[] = []; // 第三次ui的数据，如：机台序列号
   defect_list; // 封装的模型数据
   tableUI = []; // 第三层UI下载数据
   columnModelData = []; // 柱状图数据
   comment: string;
   itemGroup = [];
   footer_1 = null;
   cancelOK_1 = false;
   cancelOK = false;
   footer = null;
  constructor(
    private dataService: LineDataServiceService,
    private esService: EsDataServiceService,
    private message: NzMessageService,
    private datePipe: DatePipe,
    private globals: GlobalService,
    private excelService: ExcelToolService
  ) { }

  ngOnInit() {
  }

  async queryOp(options: any, type?: any) {
    this.cur_site = options.cur_site;
    this.cur_plant = options.cur_plant;
    this.cur_section = options.cur_section;
    this.cur_line = options.cur_line;
    this.cur_mdname = options.cur_mdname;
    this.cur_model = options.cur_model;
    this.cur_MachineModel = options.cur_MachineModel;
    this.cur_item = options.cur_item;
    this.itemGroup = options.itemGroup;
    this.datefrom = options.datefrom;
    this.dateto = options.dateto;

    if (type !== 'history') {
      this.getYieldRateLine('yield_rate', this.dataX_array, this.data_loss, this.loss_itemArray, this.cur_model, this.cur_MachineModel, this.cur_item, this.datefrom, this.dateto, false);
      this.getYieldRateColumn('yield_rate', this.cur_model, this.cur_MachineModel, this.itemGroup, this.datefrom, this.dateto, false);
      this.timer = setInterval(async() => {
        this.getYieldRateLine('yield_rate', this.dataX_array, this.data_loss, this.loss_itemArray, this.cur_model, this.cur_MachineModel, this.cur_item, this.datefrom, this.dateto, false);
        this.getYieldRateColumn('yield_rate', this.cur_model, this.cur_MachineModel, this.itemGroup, this.datefrom, this.dateto, false);
      }, 30000);
    } else {
      this.getYieldRateLine('yield_rate', this.dataX_array, this.data_loss, this.loss_itemArray, this.cur_model, this.cur_MachineModel, this.cur_item, this.datefrom, this.dateto, true);
      this.getYieldRateColumn('yield_rate', this.cur_model, this.cur_MachineModel, this.itemGroup, this.datefrom, this.dateto, true);
    }
  }


  // 获取折线图模型数据
  async getYieldRateLine(type: string, dataX_array: {}[], data_loss: number[], loss_itemArray: YeildModel[], model, machineModel, item, datefrom, dateto, dateTag) {
    const abnormalArr = [];
    const markLineX = [];
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
    let limit_arr;
    let querys;
    querys = this.esService.getYieldRate(this.cur_site.toLowerCase(),
      this.cur_line.toUpperCase(),
      this.cur_mdname.toUpperCase(), this.cur_plant.toUpperCase(), model, machineModel, item, date_range, size);
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
  //  this.esService.postData(esURL, querys).subscribe(data => {
    const data = await this.esService.postData(esURL, querys).toPromise();
    console.log('查询到的 URL \n', esURL);
    console.log('从 es  中查询到 折线图 的数据 \n', data);
     if (data['hits']['hits'].length > 500) {
      this.message.create('success', '查詢範圍過大，請重新選擇查詢日期');
      return;
    }
    if (data['hits']['hits'].length > 0) {
      this.comment = data['hits']['hits'][0]._source.Model.comment;
    }

    this.columnModelData = [];
     for (let i = data['hits']['hits'].length - 1; i > -1; i--) {
       data_loss.push(data['hits']['hits'][i]._source.yieldrate);
       const date_item = this.datePipe.transform(data['hits']['hits'][i]._source.executiontime, 'MM/dd HH:mm');
       // tslint:disable-next-line: no-shadowed-variable
       const item = new YeildModel();
      //  const column = {};
       item.modelName = data['hits']['hits'][i]._source.Model;
       item.stationLine = data['hits']['hits'][i]._source.line;
       item.stationType = data['hits']['hits'][i]._source.MachineStation;
       item.stationName = data['hits']['hits'][i]._source.MachineModel;
       item.stationId = data['hits']['hits'][i]._source.MachineSN;
       item.yieldrate = data['hits']['hits'][i]._source.yieldrate;
       item.lowlimit = data['hits']['hits'][i]._source.lowerlimit;
       item.upperlimit = data['hits']['hits'][i]._source.upperlimit;
       item.executiontime = data['hits']['hits'][i]._source.executiontime;
       item.Details = data['hits']['hits'][i]._source.detail;

      if (item.upperlimit !== null && item.upperlimit < 300) {
        if (item.yieldrate < item.lowlimit || item.yieldrate === item.lowlimit) {
          abnormalArr.push({name: '良率', symbol: 'circle', symbolSize: 20, value: item.yieldrate, yAxis: item.yieldrate, xAxis: data['hits']['hits'].length - i - 1, itemStyle: {normal:
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
    //  this.fixtureArr = loss_itemArray;
    // this.abnormalArr = abnormalArr;
    if (!dateTag) {
      const abnormal_data = {
        num: abnormalArr.length,
        type: 'yield_rate'
      };
      this.globals.AbnormalPot_subject.next(abnormal_data);
    }
     this.options_line(abnormalArr, markLineX, limit_arr, dateTag);
  }


  //  获取柱状图数据
  async getYieldRateColumn(type: string, model, machineModel, itemGroup, datefrom, dateto, dateTag) {
     // 获取柱状图需要的数据
     const columnData = [];
    let allData = [];
    for (let key = 0; key < itemGroup.length; key ++) {
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
      querys = this.esService.getYieldRateColumn(this.cur_site.toLowerCase(),
      this.cur_line.toUpperCase(),
      this.cur_mdname.toUpperCase(), this.cur_plant.toUpperCase(), model, machineModel, itemGroup[key], date_range, size);
      console.log(querys);
      querys = JSON.parse(querys);
      const data = await this.esService.postData(esURL, querys).toPromise();
      console.log('查询到的 URL \n', esURL);
      console.log('从 es  中查询到 柱状图 的数据 \n', data);
       if (data['hits']['hits'].length > 500) {
        this.message.create('success', '查詢範圍過大，請重新選擇查詢日期');
        return;
      }
      allData = allData.concat(data['hits']['hits']);
    }
    console.log('========================= \n', allData)
      for (let i = 0; i < allData.length; i++) {
        const column = {};
        column['MachineSN'] = allData[i]._source.MachineSN;
        column['yieldrate'] = allData[i]._source.yieldrate;
        column['lowerlimit'] = allData[i]._source.lowerlimit;
        // column['executiontime'] = data['hits']['hits'][i]._source.executiontime;
        if (column['yieldrate'] < column['lowerlimit']) {
          column['color'] = 'red';
        } else {
          column['color'] = 'green';
        }
        columnData.push(column);
      }

      // columnData.sort(this.sortBy('executiontime', false));
      // 取第一个数据，删除重复数据
      this.columnModelData = [];
      const obj = {};
      // tslint:disable-next-line: no-shadowed-variable
      this.columnModelData = columnData.reduce(( item: any, next) => {
        // tslint:disable-next-line: no-unused-expression
        obj[next.MachineSN] ? '' : obj[next.MachineSN] = true && item.push(next);
        return item;
      }, []);


      // 如果治具编号没有对应的数据，需要将这个特殊的治具编号加入柱状图中
      if (this.itemGroup.length > 0 && (this.itemGroup.length > this.columnModelData.length)) {
        // 检测治具编号没有对应的数据
        const arr = [];
        for (let i = 0; i < this.columnModelData.length; i++) {
          arr.push(this.columnModelData[i].MachineSN);
        }
        let list = [];
        // tslint:disable-next-line: no-shadowed-variable
        list = this.itemGroup.filter( item => {
            return arr.indexOf(item) === -1;
        });
        // 加入空治具编号
        if (list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            const column = {};
            column['MachineSN'] = list[i];
            column['yieldrate'] = 0;
            column['lowerlimit'] = 0;
            column['color'] = 'red';
            this.columnModelData.push(column);
          }
        }
      }
      if (allData.length > 0) {
        this.options_column(this.columnModelData, dateTag);
      }
    }



  // 绘折线echart
  async options_line(abnormalArr, markLineX, limit_arr, dateTage) {
    const stageMapping = await this.dataService.getStageMapping(this.cur_mdname, this.cur_plant, this.cur_site);
    let text: string;
    if (stageMapping.length > 0) {
      text = `Yield Rate趨勢圖(${stageMapping[0]['chineseContrast']}):`;
    } else {
      text = 'Yield Rate趨勢圖:';
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
      dataZoom: [ // 折叠x轴
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



  // 绘制柱状图
  async options_column(data:any, dateTag) {
    const stageMapping = await this.dataService.getStageMapping(this.cur_mdname, this.cur_plant, this.cur_site);
    let text: string;
    const goal = data[0].lowerlimit;
    // x轴数据
    const xData = [];
    // y轴数据
    const yData = [];
    // 条状图颜色
    const colors = [];
    for (let i = 0; i < data.length; i++) {
      xData.push(data[i].MachineSN);
      yData.push(data[i].yieldrate);
      colors.push(data[i].color);
    }
    xData.push('');
    const markLineC = [];
    markLineC.push([{name: 'Goal:' + goal + '%', yAxis: goal, x: 70, label: {show: true}, itemStyle: {normal: {color: '#dc143c'}}},
    {name: 'upper', yAxis: goal, xAxis: xData.length - 1, itemStyle: {normal: {color: '#dc143c'}}}]);


    if (stageMapping.length > 0) {
      text = `Yield Rate枢纽分析图(${stageMapping[0]['chineseContrast']}):`;
    } else {
      text = 'Yield Rate枢纽分析图:';
    }
    this.column_chart = {
      title : {
        text: `${text}`,
        x: 'left',
        textStyle: {
          color: 'black',
        }
      },
      grid: {
        y: 70,
        y2: 60,
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
          data: xData,
          axisLabel: {
            interval: 0,
            rotate: 20
         }
      },
      yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          },
      },
      dataZoom: [ // 折叠x轴
        {
          type: 'slider',
          show: dateTag,
          xAxisIndex: [0],
          top: '92%'
        }
      ],
      series: [{
          data: yData,
          type: 'bar',
          barWidth: '20%',
          itemStyle: {
            // 通常情况下：
            normal: {
　　　　　　　 // 每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function (params) {
                const colorList = colors;
                return colorList[params.dataIndex];
              }
            },
            // 鼠标悬停时：
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(10, 100, 30, 1)'
            }
          },
          markLine: {
            silent: true,
            data: markLineC
          }
      }]
    };
  }








  show_boxs(e) {
    this.isVisible = true;
    let index;
    if (e['data']['xAxis'] === undefined) {
      index = e.dataIndex;
    } else {
      index = e['data']['xAxis'];
    }

    this.detailTable_total = [];
    this.loss_itemArray[index].Details.forEach(detail => {
      const total = {
        model: this.loss_itemArray[index].modelName,
        line: this.loss_itemArray[ index].stationLine,
        stage: this.loss_itemArray[index].stationType,
        fixture: this.loss_itemArray[index].stationId,

        tdname: detail.tdname,
        mdname: detail.mdname,
        yield: this.loss_itemArray[index].yieldrate,
        num: detail['item_detail'].length,
        item_detail: detail['item_detail'],
      };
      this.detailTable_total.push(total);
    });
  }


  // 这个detail就是封装的模型数据
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


  downloadTotal(data, title) {
    if (data) {
      const downloadDatas = data.map (res => {
        return {
          '壓頭編號': res['tdname'],
          '監控項目': res['mdname'],
          'Yield Rate': res['yield'],
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








  // downloadDetail(seriesData, dataInfo, title) {
  //   const data = [];
  //   const mergeArr = [];
  //   if (dataInfo) {
  //     if (seriesData.length > 0) {
  //       seriesData.forEach((row, index) => {
  //         // merge
  //         const merges = {};
  //         row['unitserialnumber'].forEach(number => {
  //           data.push({
  //             '機種': dataInfo['model'],
  //             '線別': dataInfo['line'],
  //             '站別': dataInfo['stage'],
  //             '治具編號': dataInfo['fixture'],
  //             '機台序列號': number,
  //             '上限': (dataInfo['upper'] > 300 || dataInfo['upper'] === 300) ? '無設置' : dataInfo['upper'],
  //             '下限': (dataInfo['lower'] < -300 || dataInfo['lower'] === -300) ? '無設置' : dataInfo['lower'],
  //           });
  //         });
  //         for (let i = 0; i < Object.keys(data[0]).length; i++) {
  //           if (i !== 4) {
  //             mergeArr.push({s: { r: index + 1, c: i }, e: { r: row['unitserialnumber'].length , c: i } });
  //           }
  //         }
  //       });
  //       const colWidth = [];
  //       Object.keys(data[0]).forEach((element, index) => {
  //         if (index === 4) {
  //           colWidth.push({wpx: 180});
  //         } else {
  //           colWidth.push({wpx: 120});
  //         }
  //       });
  //       const headerBgColor = '53868B';
  //       this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(data)), title, colWidth, headerBgColor, mergeArr);
  //     }
  //   }
  // }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    clearInterval(this.timer);
    const abnormal_data = {
      num: null,
      type: 'none'
    };
    this.globals.AbnormalPot_subject.next(abnormal_data);
  }

}
