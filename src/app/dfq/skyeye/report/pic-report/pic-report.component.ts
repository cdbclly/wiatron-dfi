import { Component, OnInit } from '@angular/core';
import { PIC, AlertInfos } from './../../model/issuePIC';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';
import { ReportServiceService } from '@service/skyeye/report-service.service';

@Component({
  selector: 'app-pic-report',
  templateUrl: './pic-report.component.html',
  styleUrls: ['./pic-report.component.scss']
})
export class PicReportComponent implements OnInit {

  cur_site = [];
  plantGroup = [];
  cur_plant = [];
  cur_fun = [];
  cur_pic;
  picGroup = []; funGroup = []; siteGroup = [];
  select_pic;
  picItem: PIC;
  picItems: PIC[] = [];
  alertInfos: AlertInfos[] = [];
  status_char;
  filterData;
  initDataRaw;
  isSelectValid = true;

  alert_char;
  eff_char;
  tmp_arr;
  pageDivide = true;
  // nzScroll: {} = { x: '1110px'};
  THwidth = ['60px', '80px', '80px', '150px', '120px', '150px', '150px'];
  // alertTableW = window.screen.availWidth * 0.95;
  tableW = ['60px', '60px', '60px', '60px', '100px', '120px', '90px', '120px', '90px', '90px',
    '120px', '120px', '120px', '60px', '80px'];
  footer = null;
  isVisible = false;
  cancelOK = false;
  series_eff: {}[] = [];
  series_time: {}[] = [];
  series_status: {}[] = [];
  table_box = [];
  objectKeys = Object.keys;
  objectValue = Object.values;
  curPage; // 當前的頁數

  dateRangeFrom;
  dateRangeTo;
  dateInputFrom;
  dateInputTo;

  constructor(private reService: ReportServiceService, private datePipe: DatePipe,
    private excelService: ExcelToolService, private router: Router) { }

  async ngOnInit() {
  }

  changeStatus(type, event: Event) {
    switch (type) {
      case 'plant':
        this.tmp_arr = this.cur_plant;
        this.cur_plant = [];
        this.filterDatas();
        this.cur_plant = this.tmp_arr;
        this.plantGroup = this.reService.groupBy(this.filterData, 'plantId');
        break;
      case 'function':
        this.tmp_arr = this.cur_fun;
        this.cur_fun = [];
        this.filterDatas();
        this.cur_fun = this.tmp_arr;
        this.funGroup = this.reService.groupBy(this.filterData, 'picDepartment');
        break;
      case 'pic':
        this.tmp_arr = this.cur_pic;
        this.cur_pic = undefined;
        this.filterDatas();
        this.cur_pic = this.tmp_arr;
        if (this.cur_fun.length > 0 || this.cur_plant.length > 0) {
          this.picGroup = this.reService.groupBy(this.filterData, 'pic');
        }
        break;
    }
  }

  filterDatas() {
    this.filterData = this.initDataRaw;
    if (this.cur_site.length > 0) {
      this.filterData = this.filterData.filter(res => this.cur_site.indexOf(res['site']) !== -1);
    }
    if (this.cur_plant.length > 0) {
      this.filterData = this.filterData.filter(res => this.cur_plant.indexOf(res['plantId']) !== -1);
      // this.changeGroups('all');
    }
    if (this.cur_fun.length > 0) {
      this.filterData = this.filterData.filter(res => this.cur_fun.indexOf(res['picDepartment']) !== -1);
      // this.changeGroups('fun');
    }
    if (this.cur_pic !== '' && this.cur_pic !== undefined && this.cur_pic !== null) {
      this.filterData = this.filterData.filter(res => res['pic'] === this.cur_pic);
    }
  }


  async getOptions(result: Date, type) {
    if (type === 'cur_site') {
      this.cur_plant = [];
      this.cur_fun = [];
      this.cur_pic = undefined;
      this.filterDatas();
      this.filterData.forEach(res => {
        if (res['plantId'].indexOf('<') !== -1) {
          res['plantId'] = res['plantId'].substring(0, res['plantId'].indexOf('<'));
        }
      });
      this.plantGroup = this.reService.groupBy(this.filterData, 'plantId');
      console.log(this.filterData);
    }
    if (type === 'cur_plant') {
      this.cur_fun = [];
      this.cur_pic = undefined;
      console.log(this.cur_plant);
      this.filterDatas();
      console.log(this.filterData);
    }
    if (type === 'cur_fun') {
      this.cur_pic = undefined;
      this.filterDatas();
      console.log(this.filterData);
      console.log(this.alertInfos);
    }
    if (type === 'cur_pic') {
      if (this.cur_pic) {
        this.filterDatas();
        this.getCurPic();
      }

    }
    // if (type === 'cur_date') {
    //   if (result[0] !== undefined) {
    //     this.isSelectValid = false;
    //     this.initDataRaw = await this.reService.getTotalIssue(result[0].getTime(),
    //       result[1].getTime());
    //     this.filterData = this.initDataRaw;
    //     console.log(this.initDataRaw);
    //     this.siteGroup = this.reService.groupBy(this.initDataRaw, 'site');
    //     console.log(this.siteGroup);
    //     if (this.cur_pic && this.cur_site && this.cur_plant && this.cur_fun) {
    //       this.filterDatas();
    //       this.getCurPic();
    //     }
    //   } else {
    //     this.isSelectValid = true;
    //   }
    if (type === 'dateTo') {
      this.dateRangeTo = result ? result.getTime() : undefined;
      await this.selectTimeData();
    }
    if (type === 'dateFrom') {
      this.dateRangeFrom = result ? result.getTime() : undefined;
      await this.selectTimeData();
    }
  }

  async selectTimeData() {
    if (this.dateRangeTo && this.dateRangeFrom) {
      this.isSelectValid = false;
        this.initDataRaw = await this.reService.getTotalIssue(this.dateRangeFrom, this.dateRangeTo);
        this.filterData = this.initDataRaw;
        console.log(this.initDataRaw);
        this.siteGroup = this.reService.groupBy(this.initDataRaw, 'site');
        console.log(this.siteGroup);
        if (this.cur_pic && this.cur_site && this.cur_plant && this.cur_fun) {
          this.filterDatas();
          this.getCurPic();
        }
    } else {
      this.isSelectValid = true;
    }
  }

  getCurPic() {
    const data_series = [];
    this.series_status = [];
    this.series_time = [];
    this.series_eff = [];
    const data_series_time = [];
    const data_series_alert = [];
    console.log(this.cur_pic);
    if (this.cur_pic === null || this.cur_pic === undefined) {
      this.filterDatas();
      this.picItems = [];
    } else {
      this.alertInfos = [];
      this.picItems = [];
      this.picItem = new PIC();
      // 查询api
      // const picItem = await this.reService.getPICDetail(this.cur_pic[0], new Date().getTime() - 604800000,
      // new Date().getTime());
      const picItem = this.filterData.filter(res => this.cur_pic === res['pic']);
      if (picItem[0] !== undefined) {
        console.log(picItem);
        this.picItem.name = picItem[0]['picName'];
        this.picItem.certification = picItem[0]['picCertitfication'];
        this.picItem.dept = picItem[0]['picDepartment'];
        this.picItem.seniority = picItem[0]['seniority'];
        this.picItem.jobLevel = picItem[0]['picJobLevel'];
        this.picItem.p6sigma = picItem[0]['pic6Sigma'];
        this.picItem.supervisor = picItem[0]['picSupervisor'];
        this.picItem.open = 0; this.picItem.ongoing = 0; this.picItem.close = 0;
        this.picItem.handleAlertTime1 = 0; this.picItem.handleAlertTime2 = 0; this.picItem.handleAlertTime3 = 0;
        this.picItem.closeAlertTime1 = 0; this.picItem.closeAlertTime2 = 0; this.picItem.closeAlertTime3 = 0;
        const picGroupStatus = this.reService.groupBy(picItem, 'status');
        console.log(picGroupStatus);
        for (const key in picGroupStatus) {
          if (picGroupStatus.hasOwnProperty(key)) {
            let series_status: {};
            if (key.toString() === '2') {
              series_status = { name: 'close', value: picGroupStatus[key] };
              this.picItem.close = picGroupStatus[key].length;
            } else if (key.toString() === '0') {
              series_status = { name: 'open', value: picGroupStatus[key] };
              this.picItem.open = picGroupStatus[key].length;
            } else if (key.toString() === '3') {
              series_status = { name: 'ongoing', value: picGroupStatus[key] };
              this.picItem.ongoing = picGroupStatus[key].length;
            }
            this.series_status.push(series_status);
            picGroupStatus[key].forEach(pic => {
              let series_time: {};
              let series_eff: {};
              this.alertInfos.push(this.loadAlertInfos(pic));
              console.log(this.alertInfos);
              const tt = parseInt(pic['receiptTime'], 0) - parseInt(pic['warningTime'], 0);
              if (tt < 600000) {
                series_time = { name: '<10m', value: this.loadAlertInfos(pic) };
                this.picItem.handleAlertTime1++;
              } else if (tt > 1800000) {
                series_time = { name: '>30m', value: this.loadAlertInfos(pic) };
                this.picItem.handleAlertTime3++;
              } else {
                series_time = { name: '10m~30m', value: this.loadAlertInfos(pic) };
                this.picItem.handleAlertTime2++;
              }
              this.series_time.push(series_time);
              const et = parseInt(pic['receiptTime'], 0) - parseInt(pic['warningTime'], 0);
              console.log(et, parseInt(pic['receiptTime'], 0), parseInt(pic['warningTime'], 0));
              if (et > 7200000) {
                series_eff = { name: '>2H', value: this.loadAlertInfos(pic) };
                this.picItem.closeAlertTime3++;
              } else if (et < 1800000) {
                series_eff = { name: '<0.5H', value: this.loadAlertInfos(pic) };
                this.picItem.closeAlertTime1++;
              } else {
                series_eff = { name: '0.5~2H', value: this.loadAlertInfos(pic) };
                this.picItem.closeAlertTime2++;
              }
              this.series_eff.push(series_eff);
            });
          }
        }
        if (this.picItem.close > 0) {
          data_series.push({ value: this.picItem.close, name: 'close', itemStyle: { normal: { color: '#339933' } } });
        }
        if (this.picItem.ongoing > 0) {
          data_series.push({ value: this.picItem.ongoing, name: 'ongoing', itemStyle: { normal: { color: '#FFFF00' } } });
        }
        if (this.picItem.open > 0) {
          data_series.push({ value: this.picItem.open, name: 'open', itemStyle: { normal: { color: '#FF3300' } } });
        }
        if (this.picItem.handleAlertTime1 > 0) {
          data_series_time.push({ value: this.picItem.handleAlertTime1, name: '<10m', itemStyle: { normal: { color: '#FFFF00' } } });
        }
        if (this.picItem.handleAlertTime2 > 0) {
          data_series_time.push({ value: this.picItem.handleAlertTime2, name: '10m~30m', itemStyle: { normal: { color: '#339933' } } });
        }
        if (this.picItem.handleAlertTime3 > 0) {
          data_series_time.push({ value: this.picItem.handleAlertTime3, name: '>30m', itemStyle: { normal: { color: '#FF3300' } } });
        }
        if (this.picItem.closeAlertTime1 > 0) {
          data_series_alert.push({ value: this.picItem.closeAlertTime2, name: '0.5~2H', itemStyle: { normal: { color: '#FFFF00' } } });
        }
        if (this.picItem.closeAlertTime2 > 0) {
          data_series_alert.push({ value: this.picItem.closeAlertTime1, name: '<0.5H', itemStyle: { normal: { color: '#339933' } } });
        }
        if (this.picItem.closeAlertTime3 > 0) {
          data_series_alert.push({ value: this.picItem.closeAlertTime3, name: '>2H', itemStyle: { normal: { color: '#FF3300' } } });
        }
        this.picItems.push(this.picItem);
      }
      this.filterDatas();
      console.log(this.filterData);
      console.log(this.alertInfos);
      this.getAlertTimeCircle(data_series_time);
      this.getCircleChar_status(data_series);
      console.log(data_series);
      this.getEffcientCircle(data_series_alert);
    }
  }

  showDetail(type, event) {
    console.log(event);
    this.table_box = [];
    if (type === 'alert') {
      // this.table_box_alert = this.data_series_alert.filter(res => res['name'] === event.name);
      console.log(this.series_time);
      this.table_box = this.series_time.filter(res => res['name'] === event.name);
      this.table_box = this.table_box.map(v => v['value']);
      console.log(this.table_box.map(v => v['value']));
    }
    if (type === 'status') {
      let table_box = [];
      table_box = this.series_status.filter(res => res['name'] === event.name);
      console.log(this.series_status);
      table_box = table_box[0]['value'];
      table_box.forEach(element => {
        this.table_box.push(this.loadAlertInfos(element));
      });
      console.log(this.table_box);
    }
    if (type === 'eff') {
      this.table_box = this.series_eff.filter(res => res['name'] === event.name);
      this.table_box = this.table_box.map(v => v['value']);
      console.log(this.table_box.map(v => v['value']));
      // console.log(this.series_eff);
    }
    this.isVisible = true;
    // console.log(this.filterData);
    // console.log(this.alertInfos);
    console.log(event);
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  downloadFile() {
    if (this.alertInfos.length > 0) {
      this.excelService.exportAsExcelFile(this.alertInfos, 'pic_issues');
    }
  }

  loadAlertInfos(pic) {
    const alertInfo = new AlertInfos();
    alertInfo.lineId = pic['line'];
    alertInfo.modelId = pic['modelId'];
    alertInfo.stationId = pic['stationId'];
    alertInfo.warningInfo = pic['desc'];
    alertInfo.equipNo = pic['fxid'];
    alertInfo.rootInfo = '';
    alertInfo.action = pic['comment'];
    alertInfo.comment = '';
    if (parseInt(pic['status'], 0) === 2) {
      alertInfo.status = 'close';
    } else if (parseInt(pic['status'], 0) === 0) {
      alertInfo.status = 'open';
    } else if ((parseInt(pic['status'], 0) === 3)) {
      alertInfo.status = 'onGoing';
    } else {
      alertInfo.status = pic['status'];
    }
    alertInfo.occurTime = this.datePipe.transform(pic['warningTime'], 'yyyy-MM-dd HH:mm:ss');
    alertInfo.handleTime = this.datePipe.transform(pic['receiptTime'], 'yyyy-MM-dd HH:mm:ss');
    if (pic['endingTime'] === 0) {
      alertInfo.endingTime = '未結案';
    } else {
      alertInfo.endingTime = this.datePipe.transform(pic['endingTime'], 'yyyy-MM-dd HH:mm:ss');
    }
    alertInfo.dept = pic['picDepartment'];
    alertInfo.pic = pic['picName'];
    alertInfo.decision = pic['decision'];
    alertInfo.picReasonDesc = pic['picReasonDesc'];
    return alertInfo;
  }

  getCircleChar_status(data_series) {
    if (this.picItem !== null) {
      this.status_char = {
        title: {
          text: 'Total issue status',
          x: 'center',
          textStyle: {
            color: 'black',
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          backgroundColor: 'rgba(255,255,255,0.7)',
          textStyle: {
            color: 'black'
          }
        },
        backgroundColor: 'rgba(255,255,255,0.7)',
        grid: {
          y: '1%',
          x: '1%',
          borderColor: 'white'
        },
        legend: {
          orient: 'horizontal',
          x: 'left',
          top: '7%',
          left: '5%',
          data: ['close', 'ongoing', 'open'],
          textStyle: {
            color: 'black'
          }
        },
        series: [
          {
            name: 'Total issue status',
            type: 'pie',
            radius: ['49%', '67%'],
            avoidLabelOverlap: false,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  textStyle: {
                    fontSize: '15',
                    fontWeight: 'bold',
                    color: 'black',
                    textBorderColor: 'auto'
                  },
                  position: 'inside',
                  formatter: '{d}%'
                }
              }
            },
            label: {
              show: false
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: data_series
          }
        ]
      };
    }
  }
  getAlertTimeCircle(data_series) {
    console.log(data_series);
    if (this.picItem !== null) {
      this.alert_char = {
        title: {
          text: '结案时间统计',
          x: 'center',
          textStyle: {
            color: 'black',
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          backgroundColor: 'rgba(255,255,255,0.7)',
          textStyle: {
            color: 'black'
          }
        },
        backgroundColor: 'rgba(255,255,255,0.7)',
        grid: {
          y: '1%',
          x: '1%',
          borderColor: 'white'
        },
        legend: {
          orient: 'horizontal',
          x: 'left',
          top: '7%',
          left: '5%',
          data: ['<10m', '10m~30m', '>30m'],
          textStyle: {
            color: 'black'
          }
        },
        series: [
          {
            name: '结案时间统计',
            type: 'pie',
            radius: ['49%', '67%'],
            avoidLabelOverlap: false,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  textStyle: {
                    fontSize: '15',
                    fontWeight: 'bold',
                    color: 'black',
                    textBorderColor: 'auto'
                  },
                  position: 'inside',
                  formatter: '{d}%'
                }
              }
            },
            label: {
              show: false
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: data_series
          }
        ]
      };
    }
  }

  getEffcientCircle(data_series) {
    if (this.picItem !== null) {
      this.eff_char = {
        title: {
          text: 'Efficiency',
          x: 'center',
          textStyle: {
            color: 'black',
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          backgroundColor: 'rgba(255,255,255,0.7)',
          textStyle: {
            color: 'black'
          }
        },
        backgroundColor: 'rgba(255,255,255,0.7)',
        grid: {
          y: '1%',
          x: '1%',
          borderColor: 'white'
        },
        legend: {
          orient: 'horizontal',
          x: 'left',
          top: '7%',
          left: '5%',
          data: ['<0.5H', '0.5~2H', '>2H'],
          textStyle: {
            color: 'black'
          }
        },
        series: [
          {
            name: 'Efficiency',
            type: 'pie',
            radius: ['49%', '67%'],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  textStyle: {
                    fontSize: '15',
                    fontWeight: 'bold',
                    color: 'black',
                    textBorderColor: 'auto'
                  },
                  position: 'inside',
                  formatter: '{d}%'
                }
              }
            },
            label: {
              show: false
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: data_series
          }
        ]
      };
    }
  }

}
