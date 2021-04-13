import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClsDfcMilitaryOrderQuery } from '../military-order-sign';
import { MilitaryOrderSignService } from '../military-order-sign.service';
@Component({
  selector: 'app-military-order-query',
  templateUrl: './military-order-query.component.html',
  styleUrls: ['./military-order-query.component.scss']
})
export class MilitaryOrderQueryComponent implements OnInit {
  @Input() queryValue: ClsDfcMilitaryOrderQuery;
  @Input() tabelHeight: string;
  @Input() modalWidth;
  option1 = {};
  option2 = {};
  option3 = {};
  pipData;

  // 表格相關
  dataSet = [];
  dataSetCache = [];
  nzWidthConfig = ['140px', '100px', '100px', '100px', '120px', '120px', '100px', '150px'];
  nzScroll: {} = { x: '930px' };

  // 彈出軍令狀簽核
  isSendSignVisible = false;
  isPrintVisible = false;
  printValue: {
    proNameID: any,
    formNo: any,
    signIDs: any
  };

  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['MilitaryOrderQuery']; // 页面上的用户权限
  transNotice = {};
  constructor(
    private militaryOrderSignService: MilitaryOrderSignService,
    private translate: TranslateService
  ) {
    // 初始化i18n;
    this.translate.get(['mrr.mrr-sign-off', 'military-order.not-start', 'military-order.not-sign', 'military-order.total', 'military-order.display', 'military-order.signing', 'military-order.signed']).subscribe(res => {
      this.transNotice['signOff'] = res['mrr.mrr-sign-off'];
      this.transNotice['notStart'] = res['military-order.not-start'];
      this.transNotice['notSign'] = res['military-order.not-sign'];
      this.transNotice['total'] = res['military-order.total'];
      this.transNotice['display'] = res['military-order.display'];
      this.transNotice['signing'] = res['military-order.signing'];
      this.transNotice['signed'] = res['military-order.signed'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.mrr-sign-off', 'military-order.not-start', 'military-order.not-sign', 'military-order.total', 'military-order.display', 'military-order.signing', 'military-order.signed']).subscribe(res => {
        this.transNotice['signOff'] = res['mrr.mrr-sign-off'];
        this.transNotice['notStart'] = res['military-order.not-start'];
        this.transNotice['notSign'] = res['military-order.not-sign'];
        this.transNotice['total'] = res['military-order.total'];
        this.transNotice['display'] = res['military-order.display'];
        this.transNotice['signing'] = res['military-order.signing'];
        this.transNotice['signed'] = res['military-order.signed'];
      });
    });
    this.militaryOrderSignService.queryTableObservable().subscribe(data => {
      this.dataSetCache = [];
      this.dataSet = data['dataSet'];
      this.dataSetCache.push(...data['dataSet']);
      this.pipData = data['pipData'];
      this.getOption();
    });
  }

  ngOnInit() {
    this.nzScroll = { x: '930px', y: this.tabelHeight };
  }

  getOption() {
    const other1 = this.pipData['1'] + this.pipData['2'];
    const other2 = this.pipData['0'] + this.pipData['2'];
    const other3 = this.pipData['0'] + this.pipData['1'];
    this.option1 = {
      series: [{
        name: this.transNotice['signOff'],
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
            formatter: function (params) {
              if (!params.data['name']) {
                return params.data['name'] + '\n' + params.data['value'];
              }
            }
          },
          emphasis: {
            show: false,
            textStyle: {
              fontSize: '20',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          { value: this.pipData['0'], name: this.transNotice['notStart'] },
          { value: other1, name: 'other' }
        ]
      }, {
        name: this.transNotice['display'],
        type: 'pie',
        selectedMode: 'single',
        radius: ['0', '0'],
        selectedOffset: 0,
        hoverOffset: 0,
        hoverAnimation: false,
        legendHoverLink: false,
        color: 'white',
        label: {
          normal: {
            position: 'center',
            color: 'black',
            fontSize: 20,
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          { value: 0, name: `${this.transNotice['notSign']}:` + this.pipData['0'] + `\n${this.transNotice['total']}:` + (this.pipData['0'] + this.pipData['1'] + this.pipData['2']) }
        ]
      }]
    };
    this.option2 = {
      series: [{
        name: this.transNotice['signOff'],
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: false,
            textStyle: {
              fontSize: '20',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          { value: this.pipData['1'], name: this.transNotice['signing'] },
          { value: other2, name: 'other' }
        ]
      }, {
        name: this.transNotice['display'],
        type: 'pie',
        selectedMode: 'single',
        radius: ['0', '0'],
        selectedOffset: 0,
        hoverOffset: 0,
        hoverAnimation: false,
        legendHoverLink: false,
        color: 'white',
        label: {
          normal: {
            position: 'center',
            color: 'black',
            fontSize: 20,
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          { value: 0, name: `${this.transNotice['signing']}:` + this.pipData['1'] + `\n${this.transNotice['total']}:` + (this.pipData['0'] + this.pipData['1'] + this.pipData['2']) }
        ]
      }]
    };
    this.option3 = {
      series: [{
        name: this.transNotice['signOff'],
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: false,
            textStyle: {
              fontSize: '20',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          { value: this.pipData['2'], name: this.transNotice['signed'] },
          { value: other3, name: 'other' }
        ]
      }, {
        name: this.transNotice['display'],
        type: 'pie',
        selectedMode: 'single',
        radius: ['0', '0'],
        selectedOffset: 0,
        hoverOffset: 0,
        hoverAnimation: false,
        legendHoverLink: false,
        color: 'white',
        label: {
          normal: {
            position: 'center',
            color: 'black',
            fontSize: 20,
            formatter: function (params) {
              if (!params.data['name']) {
                return params.data['name'] + '\n' + params.data['value'];
              }
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          { value: 0, name: `${this.transNotice['signed']}:` + this.pipData['2'] + `\n${this.transNotice['total']}:` + (this.pipData['0'] + this.pipData['1'] + this.pipData['2']) }
        ]
      }]
    };
  }

  // 編號點擊事件
  clickNo(data) {
    this.isPrintVisible = true;
    this.printValue = {
      proNameID: data['proNameID'],
      formNo: data['no'],
      signIDs: [data['signID'], data['signID2']]
    };
  }

  cancelPrint() {
    this.isPrintVisible = false;
  }

  // 軍令狀 未啟動
  startUp(datas) {
    this.isSendSignVisible = true;
    const queryValue = new ClsDfcMilitaryOrderQuery();
    queryValue.proName = datas['proNameID'];
    queryValue.plant = datas['plant'];
    queryValue.modelType = datas['modelType'];
    this.militaryOrderSignService.querySign(queryValue).then(data => {
      this.militaryOrderSignService.querySignPush(data);
    });
  }

  // 關閉彈窗
  cancelSendSign() {
    this.isSendSignVisible = false;
  }

  onChartEvent(event, status) {
    this.dataSet = [...this.dataSetCache];
    this.dataSet = this.dataSet.filter(data => data.status === status);
  }
}
