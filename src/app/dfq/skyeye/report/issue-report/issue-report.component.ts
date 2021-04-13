import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AlertInfos } from '../../model/issuePIC';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ReportServiceService } from '@service/skyeye/report-service.service';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';

@Component({
  selector: 'app-issue-report',
  templateUrl: './issue-report.component.html',
  styleUrls: ['./issue-report.component.scss']
})
export class IssueReportComponent implements OnInit {

  cur_site = [];
  cur_plant = [];
  cur_issue = []; cur_model = []; cur_fun = []; cur_line = []; cur_pic = []; cur_station = [];
  siteGroup = [];
  issue_status = false; plant_status = false; model_status = false;
  function_status = false; pic_status = false; station_status = false;
  date_status = false; line_status = false;
  issueGroup = []; plantGroup = []; modelGroup = []; funGroup = []; lineGroup = []; picGroup = []; stationGroup = [];
  initDataRaw;
  footer = null;
  isVisible = false;
  cancelOK = false;
  isSelectValid = true; // 標記下拉框是否可選
  filterData;
  status_char;
  status_name: string[] = []; status_value: number[] = [];
  pic_name: string[] = []; pic_value: number[] = [];
  type_name: string[] = []; type_value: number[] = [];
  pic_char;
  tmp_arr;
  type_char;
  curPage; // 當前的頁數
  alertTableW = window.screen.availWidth * 0.92;
  tableW = ['60px', '60px', '60px', '60px', '100px', '120px', '90px', '120px', '90px', '90px',
    '120px', '120px', '60px', '60px'];
  alertInfos: AlertInfos[] = [];
  alertInfoArr: AlertInfos[] = [];
  objectKeys = Object.keys;
  objectValue = Object.values;
  dateFormat = 'yyyy/MM/dd';
  dateRangeFrom;
  dateRangeTo;
  dateInputFrom;
  dateInputTo;

  constructor(private datePipe: DatePipe, private reService: ReportServiceService,
    private excelService: ExcelToolService, private router: Router) { }

  async ngOnInit() {
  }

  changeStatus(type, event) {
    // debugger;
    this.tmp_arr = [];
    switch (type) {
      case 'issue':
        this.tmp_arr = this.cur_issue;
        this.cur_issue = [];
        this.filterDatas();
        this.cur_issue = this.tmp_arr;
        this.issueGroup = this.reService.groupBy(this.filterData, 'functionType');
        console.log(this.filterData);
        break;
      case 'plant':
        this.tmp_arr = this.cur_plant;
        this.cur_plant = [];
        // debugger;
        this.filterDatas();
        this.cur_plant = this.tmp_arr;
        this.plantGroup = this.reService.groupBy(this.filterData, 'plantId');
        break;
      case 'model':
        this.tmp_arr = this.cur_model;
        this.cur_model = [];
        this.filterDatas();
        this.cur_model = this.tmp_arr;
        this.modelGroup = this.reService.groupBy(this.filterData, 'modelId');
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
        this.cur_pic = [];
        this.filterDatas();
        this.cur_pic = this.tmp_arr;
        this.picGroup = this.reService.groupBy(this.filterData, 'pic');
        break;
      case 'line':
        this.tmp_arr = this.cur_line;
        this.cur_line = [];
        this.filterDatas();
        this.cur_line = this.tmp_arr;
        this.lineGroup = this.reService.groupBy(this.filterData, 'line');
        break;
      case 'station':
        this.tmp_arr = this.cur_station;
        this.cur_station = [];
        this.filterDatas();
        this.cur_station = this.tmp_arr;
        this.stationGroup = this.reService.groupBy(this.filterData, 'stationId');
        break;
    }
  }

  async getOptions(result: Date, type) {
    this.status_name = []; this.status_value = [];
    this.pic_name = []; this.pic_value = [];
    this.type_name = []; this.type_value = [];
    if (type === 'cur_site') {
      this.cur_plant = [];
      this.cur_issue = [];
      this.cur_model = [];
      this.cur_line = [];
      this.cur_fun = [];
      this.cur_station = [];
      this.cur_pic = [];
      this.filterDatas();
      console.log(this.filterData);
      // 去掉plantId中含有的<a href>
      this.filterData.forEach(res => {
        if (res['plantId'].indexOf('<') !== -1) {
          res['plantId'] = res['plantId'].substring(0, res['plantId'].indexOf('<'));
        }
      });
      this.plantGroup = this.reService.groupBy(this.filterData, 'plantId');
    }
    if (type === 'cur_issue') {
      console.log(this.cur_plant);
      this.filterDatas();
      console.log(this.filterData);
      this.buildStatusChar(this.filterData);
      this.buildPICChar(this.filterData);
      this.buildTypeChar(this.filterData);
      this.filterData.forEach(element => {
        this.alertInfos.push(this.loadAlertInfos(element));
      });
    }
    if (type === 'cur_plant') {
      this.cur_issue = [];
      this.cur_model = [];
      this.cur_line = [];
      this.cur_fun = [];
      this.cur_station = [];
      this.cur_pic = [];
      console.log(this.cur_plant);
      this.filterDatas();
      console.log(this.filterData);
      this.buildStatusChar(this.filterData);
      this.buildPICChar(this.filterData);
      this.buildTypeChar(this.filterData);
    }
    if (type === 'cur_model') {
      this.filterDatas();
      console.log(this.filterData);
      console.log(this.alertInfos);
      this.buildStatusChar(this.filterData);
      this.buildPICChar(this.filterData);
      this.buildTypeChar(this.filterData);
    }
    if (type === 'cur_fun') {
      this.filterDatas();
      console.log(this.filterData);
      console.log(this.alertInfos);
      this.buildStatusChar(this.filterData);
      this.buildPICChar(this.filterData);
      this.buildTypeChar(this.filterData);
    }
    if (type === 'cur_line') {
      this.filterDatas();
      console.log(this.filterData);
      this.buildStatusChar(this.filterData);
      this.buildPICChar(this.filterData);
      this.buildTypeChar(this.filterData);
    }
    if (type === 'cur_pic') {
      this.filterDatas();
      console.log(this.filterData);
      console.log(this.alertInfos);
      this.buildStatusChar(this.filterData);
      this.buildPICChar(this.filterData);
      this.buildTypeChar(this.filterData);
    }
    if (type === 'cur_station') {
      this.filterDatas();
      console.log(this.filterData);
      console.log(this.alertInfos);
      this.buildStatusChar(this.filterData);
      this.buildPICChar(this.filterData);
      this.buildTypeChar(this.filterData);
    }
    // if (type === 'cur_date') {
    //   console.log('From: ', result[0], ', to: ', result[1]);
    //   if (result[0] !== undefined && result[0] !== null) {
    //     this.isSelectValid = false;
    //     // debugger;
    //     this.initDataRaw = await this.reService.getTotalIssue(result[0].getTime(),
    //       result[1].getTime());
    //     this.siteGroup = [];
    //     console.log(this.initDataRaw);
    //     if (this.cur_site && this.cur_plant) {
    //       this.filterDatas();
    //       this.buildStatusChar(this.filterData);
    //       this.buildPICChar(this.filterData);
    //       this.buildTypeChar(this.filterData);
    //     }
    //     this.siteGroup = this.reService.groupBy(this.initDataRaw, 'site');
    //   } else {
    //     this.isSelectValid = true;
    //   }
    // }
    if (type === 'dateTo') {
      this.dateRangeTo = result ? result.getTime() : undefined;
      await this.selectTimeData();
    }
    if (type === 'dateFrom') {
      this.dateRangeFrom = result ? result.getTime() : undefined;
      await this.selectTimeData();
    }
    console.log(this.cur_issue, this.cur_plant);
  }

  async selectTimeData() {
    if (this.dateRangeTo && this.dateRangeFrom) {
      this.isSelectValid = false;
      this.initDataRaw = await this.reService.getTotalIssue(this.dateRangeFrom,
        this.dateRangeTo);
        console.log('=====================\n', this.initDataRaw);
      this.siteGroup = [];
      console.log(this.initDataRaw);
      if (this.cur_site && this.cur_plant) {
        this.filterDatas();
        this.buildStatusChar(this.filterData);
        this.buildPICChar(this.filterData);
        this.buildTypeChar(this.filterData);
      }
      this.siteGroup = this.reService.groupBy(this.initDataRaw, 'site');
    } else {
      this.isSelectValid = true;
    }
  }

  downloadFile() {
    this.alertInfos = [];
    this.filterData.forEach(element => {
      this.alertInfos.push(this.loadAlertInfos(element));
    });
    this.excelService.exportAsExcelFile(this.alertInfos, 'Issue_report');
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
    alertInfo.dept = pic['picDepartment'];
    alertInfo.pic = pic['picName'];
    alertInfo.decision = pic['decision'];
    alertInfo.picReasonDesc = pic['picReasonDesc'];
    return alertInfo;
  }

  buildStatusChar(filterData) {
    if (filterData) {
      const statusInfo = this.reService.groupBy(filterData, 'status');
      const series = [];
      for (const key in statusInfo) {
        if (statusInfo.hasOwnProperty(key)) {
          if (key.toString() === '2') {
            this.status_name.push('close');
            this.status_value.push(statusInfo[key].length);
            const sdata = { value: statusInfo[key].length, name: 'close', itemStyle: { normal: { color: '#339933' } } };
            series.push(sdata);
          }
          if (key.toString() === '0') {
            this.status_name.push('open');
            this.status_value.push(statusInfo[key].length);
            const sdata = { value: statusInfo[key].length, name: 'open', itemStyle: { normal: { color: '#FF3300' } } };
            series.push(sdata);
          }
          if (key.toString() === '3') {
            this.status_name.push('onGoing');
            this.status_value.push(statusInfo[key].length);
            const sdata = { value: statusInfo[key].length, name: 'onGoing', itemStyle: { normal: { color: '#FFFF00' } } };
            series.push(sdata);
          }
        }
      }
      // console.log(this.status_name);
      this.getCircleChar_status(series);
    }
  }

  buildPICChar(filterData) {
    if (filterData) {
      const deptInfo = this.reService.groupBy(filterData, 'picDepartment');
      const series = [];
      for (const key in deptInfo) {
        if (deptInfo.hasOwnProperty(key)) {
          this.pic_name.push(key);
          this.pic_value.push(deptInfo[key].length);
          const sdata = { value: deptInfo[key].length, name: key };
          series.push(sdata);
          // console.log(sdata);
        }
      }
      this.getCircleChar_pic(series);
    }
  }
  getRandomColor() {
    return 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 10) + ')';
  }

  showDetail(type, event) {
    let status;
    let filterDatas = [];
    this.alertInfoArr = [];
    console.log(event);
    if (type === 'status') {
      if (event.name === 'onGoing') {
        status = 3;
      } else if (event.name === 'close') {
        status = 2;
      } else if (event.name === 'open') {
        status = 0;
      }
      filterDatas = this.filterData.filter(res => res['status'] === status);
    }
    if (type === 'pic') {
      filterDatas = this.filterData.filter(res => res['picDepartment'] === event.name);
    }
    if (type === 'type') {
      if (event.name === '測試工具版本') {
        status = 'QMMO001';
      }
      if (event.name === '測試CPK') {
        status = 'QMCPK002';
      }
      if (event.name === 'FPYR') {
        status = 'QMFAIL001';
      }
      if (event.name === '測試Retest Rate') {
        status = 'QMRETRY001';
      }
      if (event.name === '測試CPK') {
        status = 'QMCPK001';
      }
      if (event.name === '測試時間') {
        status = 'QMTIME001';
      }
      if (event.name === '測試工具版本') {
        status = 'QMMO002';
      }
      if (event.name === 'ATE溫度') {
        status = 'QMATE001';
      }
      if (event.name === 'FA Y.R') {
        status = 'QMYR001';
      }
      if (event.name === 'Light bar雙波峰') {
        status = 'QMLIBAR002';
      }
      if (event.name === 'Raw Data') {
        status = 'F232QMRAW001';
      }
      if (event.name === 'FA Retest Rate') {
        status = 'QMRR001';
      }
      if (event.name === 'FA CPK') {
        status = 'QMCPK003';
      }
      if (event.name === 'Light bar') {
        status = 'QMLIBAR001';
      }
      filterDatas = this.filterData.filter(res => res['functionType'] === status);
    }
    filterDatas.forEach(element => {
      this.alertInfoArr.push(this.loadAlertInfos(element));
    });
    console.log(this.alertInfoArr);
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }



  buildTypeChar(filterData) {
    if (filterData) {
      const typeInfo = this.reService.groupBy(filterData, 'functionType');
      const series = [];
      for (const key in typeInfo) {
        if (typeInfo.hasOwnProperty(key)) {
          let types;
          if (key === 'QMMO001') {
            types = '測試工具版本';
          } else if (key === 'QMCPK002') {
            types = '測試CPK';
          } else if (key === 'QMFAIL001') {
            types = 'FPYR';
          } else if (key === 'QMRETRY001') {
            types = '測試Retest Rate';
          } else if (key === 'QMTIME001') {
            types = '測試時間';
          } else if (key === 'QMCPK001') {
            types = '測試CPK';
          } else if (key === 'QMMO002') {
            types = '測試工具版本';
          } else if (key === 'QMATE001') {
            types = 'ATE溫度';
          } else if (key === 'QMYR001') {
            types = 'FA Y.R';
          } else if (key === 'QMLIBAR002') {
            types = 'Light bar雙波峰';
          } else if (key === 'F232QMRAW001') {
            types = 'Raw Data';
          } else if (key === 'QMRR001') {
            types = 'FA Retest Rate';
          } else if (key === 'QMCPK003') {
            types = 'FA CPK';
          } else if (key === 'QMLIBAR001') {
            types = 'Light bar';
          }
          this.type_name.push(types);
          this.type_value.push(typeInfo[key].length);
          const sdata = { value: typeInfo[key].length, name: types };
          series.push(sdata);
          console.log(sdata);
        }
      }

      console.log('------------- \n', this.type_name)
      this.getCircleChar_type(series);
    }
  }

  filterDatas() {
    console.log(this.cur_plant.length, this.cur_issue.length, this.cur_model.length, this.cur_fun.length, this.cur_line.length,
      this.cur_pic.length, this.cur_station.length);
    this.filterData = this.initDataRaw;
    // debugger;
    if (this.cur_site.length > 0) {
      this.filterData = this.filterData.filter(res => this.cur_site.indexOf(res['site']) !== -1);
    }
    if (this.cur_issue.length > 0) {
      this.filterData = this.filterData.filter(res => this.cur_issue.indexOf(res['functionType']) !== -1);
      // this.changeGroups('all');
    }
    if (this.cur_plant.length > 0) {
      this.filterData = this.filterData.filter(res => this.cur_plant.indexOf(res['plantId']) !== -1);
      // this.changeGroups('all');
    }
    if (this.cur_model.length > 0) {
      this.filterData = this.filterData.filter(res => this.cur_model.indexOf(res['modelId']) !== -1);
    }
    if (this.cur_fun.length > 0) {
      this.filterData = this.filterData.filter(res => this.cur_fun.indexOf(res['picDepartment']) !== -1);
      // this.changeGroups('fun');
    }
    if (this.cur_line.length > 0) {
      this.filterData = this.filterData.filter(res => this.cur_line.indexOf(res['line']) !== -1);
      // this.cangeGroups('line');
    }
    if (this.cur_pic.length > 0) {
      this.filterData = this.filterData.filter(res => this.cur_pic.indexOf(res['pic']) !== -1);
    }
    if (this.cur_station.length > 0) {
      this.filterData = this.filterData.filter(res => this.cur_station.indexOf(res['stationId']) !== -1);
    }
  }

  getCircleChar_pic(series_data) {
    this.pic_char = {
      title: {
        text: 'PIC',
        x: 'center',
        textStyle: {
          color: 'black',
        }
      },
      // color: ['#866ec7', '#82acff', '#8f71ff', '#fdcb6e', '#b7fbff', '#fff3b1', '#ab93c9', '#d698b9', '#7f1874'],
      // color: ['#FF9966', '#336699', '#CC6699', '#FFCC99', '#CCCCCC', '#FF6666', '#666699', '#FFFF99', '#CC9999'],
      color: ['#CC9999', '#FFFF99', '#666699', '#FF6666', '#CCCCCC', '#FFCC99', '#FF9933', '#336699', '#FF9966'],
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
        data: this.pic_name,
        textStyle: {
          color: 'black'
        }
      },
      series: [
        {
          name: 'PIC',
          type: 'pie',
          radius: ['49%', '67%'],
          avoidLabelOverlap: false,
          label: {
            show: false
          },
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
          labelLine: {
            normal: {
              show: false
            }
          },
          data: series_data
        }
      ]
    };
  }

  getCircleChar_status(series) {
    this.status_char = {
      // title: {
      //   text: 'Status',
      //   x: 'center',
      //   textStyle: {
      //     color: 'black',
      //   }
      // },
      // color: ['#CC9999', '#FFFF99', '#666699', '#FF6666', '#CCCCCC', '#FFCC99', '#FF9933', '#336699', '#FF9966'],
      // tooltip: {
      //   trigger: 'item',
      //   formatter: '{a} <br/>{b}: {c} ({d}%)',
      //   backgroundColor: 'rgba(255,255,255,0.7)',
      //   textStyle: {
      //     color: 'black'
      //   }
      // },
      // backgroundColor: 'rgba(255,255,255,0.7)',
      // grid: {
      //   y: '1%',
      //   x: '1%',
      //   borderColor: 'white'
      // },
      // legend: {
      //   orient: 'horizontal',
      //   x: 'left',
      //   top: '7%',
      //   left: '5%',
      //   data: this.status_name,
      //   textStyle: {
      //     color: 'black'
      //   }
      // },
      // series: [
      //   {
      //     name: 'STATUS',
      //     type: 'pie',
      //     radius: ['49%', '67%'],
      //     avoidLabelOverlap: false,
      //     itemStyle: {
      //       normal: {
      //         label: {
      //           show: true,
      //           textStyle: {
      //             fontSize: '15',
      //             fontWeight: 'bold',
      //             color: 'black',
      //             textBorderColor: 'auto'
      //           },
      //           position: 'inside',
      //           formatter: '{d}%'
      //         }
      //       }
      //     },
      //     label: {
      //       normal: {
      //         show: false
      //       }
      //     },
      //     labelLine: {
      //       normal: {
      //         show: false
      //       }
      //     },
      //     data: series
      //   }
      // ]

      title: {
        text: 'Status',
        x: 'center',
        textStyle: {
          color: 'black',
        }
      },
      color: ['#CC9999', '#FFFF99', '#666699', '#FF6666', '#CCCCCC', '#FFCC99', '#FF9933', '#336699', '#FF9966'],
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
        data: this.status_name,
        textStyle: {
          color: 'black'
        }
      },
      series: [
        {
          name: 'STATUS',
          type: 'pie',
          radius: ['49%', '67%'],
          avoidLabelOverlap: false,
          label: {
            show: false
          },
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
          labelLine: {
            normal: {
              show: false
            }
          },
          data: series
        }
      ]
    };
  }

  getCircleChar_type(series_data) {
    this.type_char = {
      // title: {
      //   text: 'Type',
      //   x: 'center',
      //   textStyle: {
      //     color: 'black',
      //   }
      // },
      // color: ['#CC9999', '#FFFF99', '#666699', '#FF6666', '#CCCCCC', '#FFCC99', '#FF9933', '#336699', '#FF9966'],
      // tooltip: {
      //   trigger: 'item',
      //   formatter: '{a} <br/>{b}: {c} ({d}%)',
      //   backgroundColor: 'rgba(255,255,255,0.7)',
      //   textStyle: {
      //     color: 'black'
      //   }
      // },
      // backgroundColor: 'rgba(255,255,255,0.7)',
      // grid: {
      //   y: '7%',
      //   x: '1%',
      //   borderColor: 'white'
      // },
      // legend: {
      //   orient: 'horizontal',
      //   x: 'left',
      //   top: '7%',
      //   left: '5%',
      //   data: this.type_name,
      //   textStyle: {
      //     color: 'black'
      //   }
      // },
      // series: [
      //   {
      //     name: 'TYPE',
      //     type: 'pie',
      //     radius: ['49%', '67%'],
      //     avoidLabelOverlap: false,
      //     itemStyle: {
      //       normal: {
      //         label: {
      //           show: true,
      //           textStyle: {
      //             fontSize: '15',
      //             fontWeight: 'bold',
      //             color: 'black',
      //             textBorderColor: 'auto'
      //           },
      //           position: 'inside',
      //           formatter: '{d}%'
      //         }
      //       }
      //     },
      //     label: {
      //       normal: {
      //         show: false
      //       }
      //     },
      //     labelLine: {
      //       normal: {
      //         show: false
      //       }
      //     },
      //     data: series_data
      //   }
      // ]
      title: {
        text: 'Type',
        x: 'center',
        textStyle: {
          color: 'black',
        }
      },
      color: ['#CC9999', '#FFFF99', '#666699', '#FF6666', '#CCCCCC', '#FFCC99', '#FF9933', '#336699', '#FF9966'],
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
        y: '7%',
        x: '1%',
        borderColor: 'white'
      },
      legend: {
        orient: 'horizontal',
        x: 'left',
        top: '7%',
        left: '5%',
        data: this.type_name,
        textStyle: {
          color: 'black'
        }
      },
      series: [
        {
          name: 'TYPE',
          type: 'pie',
          radius: ['49%', '67%'],
          avoidLabelOverlap: false,
          label: {
            show: false
          },
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
          labelLine: {
            normal: {
              show: false
            }
          },
          data: series_data
        }
      ]
    };
  }

}
