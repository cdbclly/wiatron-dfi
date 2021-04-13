import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KpiReportService } from './kpi-report.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-kpi-report',
  templateUrl: './kpi-report.component.html',
  styleUrls: ['./kpi-report.component.scss']
})
export class KpiReportComponent implements OnInit {

  require = true;
  warningCloseRatePie;
  abnormalCloseRatePie;
  traceClosePie;
  materialPDDRLine;
  materialStopCountLine;
  stopLineRankBar;
  materialYRLine;
  icqThriftBar;
  sqmThriftBar;
  venderThriftBar;
  venderThriftData;

  // select
  cur_site;
  cur_plant;
  date_from;
  date_to;

  // 墨认时间
  dateMonthStart;
  dateMonthEnd;
  dateYearStart;
  dateYearEnd;
  dateLastMonthStart;
  dateLastMonthEnd;

  subject; // 标题

  constructor(
    private _service: KpiReportService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
      this.cur_site = params['cur_site'];
      this.cur_plant = params['cur_plant'];
      this.date_from = params['date_from'];
      this.date_to = params['date_to'];
      this.subject = params['subject'];
    });
  }

  ngOnInit() {
    const dateLastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime();
    const dateLastMonthEnd = new Date(`${moment().format('YYYY-MM-01 00:00:01')}`).getTime();
    this.subject = this.subject + ' 日期:' +  this.datePipe.transform(dateLastMonthStart, 'yyyy年MM月dd日') +
    '-' +  this.datePipe.transform(dateLastMonthEnd, 'yyyy年MM月dd日');
    this._service.getInitData(this.cur_site, this.cur_plant, Math.ceil(this.date_from / 1000), Math.ceil(this.date_to / 1000)).subscribe(
      res => {
        // debu
        this.warningCloseRatePie = this.wrapHollowPie(res['earlWarning'], '供應商材料預警結案率', '預警結案率');
        this.abnormalCloseRatePie = this.wrapHollowPie(res['abnormal'], '供應商材料Over Spec結案率', 'Over Spec 結案率');
        this.traceClosePie = this.wrapHollowPie(res['trace'], '緯創材料NG自動追溯結案率', '緯創材料NG追溯結案率');
        this.materialPDDRLine = this.wrapMaterialPDDRLine(res['drRate'], res['drBefore'], '緯創PD材料DR', ['Before', '緯創PD材料DR']);
        this.materialStopCountLine = this.wrapMaterialStopCountLine(res['stopNum'], res['stopNumBefore'], '緯創停線次數-材料', ['Before', '停線次數']);
        this.stopLineRankBar = this.wrapStopLineRankBar(res['stopNumRank'], '廠商停線排名', '廠商');
        this.materialYRLine = this.wrapMaterialYRLine(res['yrRate'], res['yrTarget'], '材料廠商端成品Y/R趨勢圖', ['target', 'Y/R']);
        if (res['saveInfo'].length === 3) {
          this.icqThriftBar = this.wrapThriftBar(res['saveInfo'].filter(result => result['type'] === 'iqc'), 'ICQ節省(人)', '');
          this.sqmThriftBar = this.wrapThriftBar(res['saveInfo'].filter(result => result['type'] === 'sqm'), 'SQM節省(人)', '');
          this.venderThriftBar = this.wrapThriftBar(res['saveInfo'].filter(result => result['type'] === 'vendor'), '廠商節省(人)', '');
        } else {
          this.icqThriftBar = null;
          this.sqmThriftBar = null;
          this.venderThriftBar = null;
          console.log(this.icqThriftBar);
        }
      }
    );
  }

  getDefaultDate() {
    // 本月
    this.dateMonthStart = new Date(`${moment().format('YYYY-MM-01 00:00:01')}`).getTime();
    this.dateMonthEnd = new Date().getTime();
   //  console.log(dateMonthStart, dateMonthEnd);
    // 本年
    this.dateYearStart = new Date(`${moment().format('YYYY-01-01 00:00:00')}`).getTime();
    this.dateYearEnd = new Date().getTime();
   //  console.log(dateYearStart, dateYearEnd);
    // 上个月
    this.dateLastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime();
    // const dateLastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() - 1,
    // new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate());
    this.dateLastMonthEnd = new Date(`${moment().format('YYYY-MM-01 00:00:01')}`).getTime();
   //  console.log(dateLastMonthStart, dateLastMonthEnd);
 }

 wrapHollowPie(rawData, title, seriesName) {
   // debugger;
   const dataArray = [];
   let sum = 0;
   let close = 0;
   for (const key in rawData) {
     if (rawData.hasOwnProperty(key)) {
       if (key === 'close') {
         dataArray.push({'value': rawData[key], 'name': key, itemStyle: {normal: {color: '#00B266'}}});
         close += rawData[key];
         sum += rawData[key];
       }
       if (key === 'ongoing') {
         dataArray.push({'value': rawData[key], 'name': key, itemStyle: {normal: {color: '#FFE500'}}});
         sum += rawData[key];
       }
       if (key === 'open') {
         dataArray.push({'value': rawData[key], 'name': key, itemStyle: {normal: {color: '#FF3300'}}});
         sum += rawData[key];
       }
     }
   }
   const seriesPie = {
     name: seriesName,
     itemStyle: {
       normal: {
         label: {
           show: true,
           position: 'center',
           formatter: close + '\n' + '——' + '\n' + sum,
           color: 'black'
         }
       }
     },
     type: 'pie',
    label: {
      show: false
    },
     radius : ['35%', '55%'],
     center: ['50%', '50%'],
     data: dataArray
   };
   const grid = {
     y: '1%',
     x: '1%',
     borderColor: 'white'
   };
   const legend = {
     orient: 'horizontal',
     x: 'center',
     y: 'bottom',
     data: ['close', 'ongoing', 'open'],
     textStyle: {
       color: 'black'
     }
   };
   return {
     title: title,
     series_name: seriesName,
     legend: legend,
     series: seriesPie,
     grid: grid,
     width: '33.3%',
     height: '12vw',
     display: 'inline-block'
   };
 }

 wrapMaterialPDDRLine(rawData, drBefore, title, legend: any[]) {
  const dataBefore = []; const dataPD = []; const dataX = []; const seriesArray = [];
  // debugger;
  rawData.forEach(ele => {
    dataX.push(ele['key']);
    // dataBefore.push(drBefore * 100);
    dataPD.push(ele['percent']);
  });
  console.log(dataBefore);
  seriesArray.push({
    name: legend[0],   // before
    type: 'line',
      data: undefined,
      itemStyle: {
        normal: {
           borderColor: '#9C27B0',
           borderWidth: 2,
           color: '#9C27B0',
           label: {
            show: false,
            position: 'top',
            color: 'black',
            formatter: '{c}%'
        }
        }
      },
      lineStyle: {
        normal: {
          color: '#9C27B0'
        }
      }
  },
  {
    name: legend[1],
    type: 'line',
      data: dataPD,
      itemStyle: {
        normal: {
           borderColor: '#00BCD4',
           borderWidth: 2,
           color: '#00BCD4',
           label: {
            show: false,
            position: 'top',
            color: 'black',
            formatter: '{c}%'
        }
        }
      },
      lineStyle: {
        normal: {
          color: '#00BCD4'
        }
      }
  }
);
const data_y = {
  type : 'value',
  axisLabel: {
    formatter: '{value}%'
  },
  min: function(value) {
    return (value.min -  0.01).toFixed(2);
  }
};
return {
  data_x: dataX,
  series: seriesArray,
  legend: legend,
  title: title,
  data_y: data_y,
  width: '100%',
  height: '12vw'
};
}

wrapMaterialStopCountLine(rawData, stopNumBefore, title, legend: any[]) {
  const dataBefore = []; const dataCount = []; const dataX = []; const seriesArray = [];
  // if (rawData) {
  //   dataX = rawData['dataX'];
  //   dataBefore = rawData['dataBefore'];
  //   dataCount = rawData['dataCount'];
  // }
  rawData.forEach(ele => {
    dataBefore.push(stopNumBefore);
    dataCount.push(ele['count']);
    dataX.push(ele['month']);
  });
  // debugger;
  console.log(dataBefore);
  seriesArray.push({
    name: legend[0],
    type: 'line',
      data: dataBefore,
      itemStyle: {
        normal: {
           borderColor: '#9C27B0',
           borderWidth: 2,
           color: '#9C27B0',
           label: {
            show: false,
            position: 'top',
            color: 'black',
            formatter: '{c}%'
        }
        }
      },
      lineStyle: {
        normal: {
          color: '#9C27B0'
        }
      }
  },
  {
    name: legend[1],
    type: 'line',
      data: dataCount,
      itemStyle: {
        normal: {
           borderColor: '#00BCD4',
           borderWidth: 2,
           color: '#00BCD4',
           label: {
            show: false,
            position: 'top',
            color: 'black',
            formatter: '{c}%'
        }
        }
      },
      lineStyle: {
        normal: {
          color: '#00BCD4'
        }
      }
  }
);
const data_y = {
  type : 'value',
  axisLabel: {
    formatter: '{value}'
  },
  min: function(value) {
    return (value.min -  1).toFixed(2);
  }
};
return {
  data_x: dataX,
  series: seriesArray,
  legend: legend,
  title: title,
  data_y: data_y,
  width: '100%',
  height: '12vw'
};
}

wrapStopLineRankBar(rowData, title, legend) {
  const dataX = []; const data = [];
  // if (rowData) {
  //   dataX = rowData['dataX'];
  // }
  rowData.map(res => {
    dataX.push(res['manufacturer']);
    data.push({
      value: res['count'],
      itemStyle: {
        normal: {
          color: '#C561D3'
        }
      }
    });
  });
  const seriesRank = {
    name: legend,
    type: 'bar',
    barWidth: '60%',
    data: data,
    itemStyle: {normal: {color: '#C561D3'}}
  };
  return {
    data_x: dataX,
    title: title,
    legend: '廠商',
    width: '100%',
    height: '12vw',
    series: [seriesRank]
  };
}

wrapMaterialYRLine(rawData, yrTarget, title, legend: any[]) {
  const target = []; const dataYr = []; const dataX = []; const seriesArray = [];
  // if (rawData) {
  //   dataX = rawData['dataX'];
  //   target = rawData['target'];
  //   dataYr = rawData['dataYr'];
  // }
  rawData.forEach(ele => {
    target.push(yrTarget);
    dataYr.push(ele['percent']);
    dataX.push(ele['key']);
  });
  seriesArray.push({
    name: legend[0],
    type: 'line',
      data: target,
      itemStyle: {
        normal: {
           borderColor: '#00B266',
           borderWidth: 2,
           color: '#00B266',
           label: {
            show: false,
            position: 'top',
            color: 'black',
            formatter: '{c}%'
        }
        }
      },
      lineStyle: {
        normal: {
          color: '#00B266'
        }
      }
  },
  {
    name: legend[1],
    type: 'line',
      data: dataYr,
      itemStyle: {
        normal: {
           borderColor: '#00BCD4',
           borderWidth: 2,
           color: '#00BCD4',
           label: {
            show: false,
            position: 'top',
            color: 'black',
            formatter: '{c}%'
        }
        }
      },
      lineStyle: {
        normal: {
          color: '#00BCD4'
        }
      }
  }
);
const data_y = {
  type : 'value',
  axisLabel: {
    formatter: '{value}%'
  },
  min: function(value) {
    return (value.min -  1).toFixed(2);
  }
};
return {
  data_x: dataX,
  series: seriesArray,
  legend: legend,
  title: title,
  data_y: data_y,
  width: '100%',
  height: '12vw'
};
}

wrapThriftBar(rowData, title, legend) {
  let dataX = []; let data = [];
  // debugger;
  if (rowData !== null) {
    dataX = ['Last Month', '累計'];
  data = [{
    value: rowData[0]['value'],
      itemStyle: {
        normal: {
          color: '#A368D5'
        }
      }
  },
  {
    value: rowData[0]['grandTotal'],
      itemStyle: {
        normal: {
          color: '#A368D5'
        }
      }
  }];
  }
  const seriesRank = {
    name: legend,
    type: 'bar',
    barWidth: '60%',
    data: data,
    itemStyle: {normal: {color: '#A368D5'}}
  };
  return {
    data_x: dataX,
    title: title,
    width: '33.3%',
    height: '12vw',
    series: [seriesRank],
    display: 'inline-block'
  };
}

}
