import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DfcSignHitoryParam } from 'app/shared/dfc-common';
import { ActivatedRoute } from '@angular/router';
import { TargetHourSignService } from '../target-hour-sign.service';

@Component({
  selector: 'app-target-hour-sign-child',
  templateUrl: './target-hour-sign-child.component.html',
  styleUrls: ['./target-hour-sign-child.component.scss']
})
export class TargetHourSignChildComponent implements OnInit, OnChanges {
  @ViewChild('DFCTargetSignDetail') dfcTargetSignDetail: ElementRef;
  @Output() pageroute = new EventEmitter();
  @Input() Processroute;
  // 傳給簽核共用component的參數
  page: number;
  signData: {
    signID: any,
    formNo: any,
    signData: any
  };
  dfcSignHitoryParam = new DfcSignHitoryParam();
  tableHeight;

  // 本頁自定義使用
  routeParam;
  applicationData = {
    deptCode: '',
    deptName: '',
    applicant: '',
    applyDate: '',
    site: '',
    plant: '',
    customer: '',
    modelType: '',
    proName: '',
    proCode: '',
    modelName: '',
    proPlant: '',
  };
  revokeFlag = false;
  dataSet = [];
  nzWidthConfig;
  nzScroll;
  option;

  constructor(
    private targetHourSignService: TargetHourSignService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.tableHeight = (this.dfcTargetSignDetail.nativeElement.offsetHeight - 185) + 'px';
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['Processroute'] && changes['Processroute'].currentValue) {
      this.dfcSignHitoryParam.btnAddSignFlag = true;
      this.dfcSignHitoryParam.btnAfterAddSignFlag = true;
      this.signData = {
        signID: this.Processroute.signID,
        formNo: this.Processroute.formNo,
        signData: []
      };
      this.query(this.Processroute.proNameID, this.Processroute.stageID, this.Processroute.processCode, this.Processroute.signID, this.Processroute.formNo);
    }
  }

  query(proNameID, stageID, process, signID, formNo) {
    this.signData = {
      signID: signID,
      formNo: formNo,
      signData: {}
    };
    this.targetHourSignService.queryDetail(proNameID, stageID, process, signID, formNo).then(datas => {
      this.applicationData = datas['data'];
      this.revokeFlag = datas['revokeFlag'];
      const echartDatas = datas['echartData'];
      this.getOption(echartDatas);
    });
  }

  getOption(echartData) {
    console.log(echartData);
    this.option = {
      color: ['rgba(60, 144, 247, 0.8)', 'rgba(85, 191, 192, 0.8)', 'rgba(0, 102, 255, 0.8)'],
      title: {
        text: this.applicationData.proPlant + '  ' + this.applicationData.modelName + ' ' + this.Processroute.process + '目標工時生成',
        x: 'center',
        textStyle: {
          color: 'rgb(0,102,255)',
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.7)',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params) {
          // for text color
          let res = '<div style="color:rgba(0, 0, 0, 0.5)">';
          res += '<strong>' + params[0].name + '</strong>';
          for (let i = 0, l = params.length; i < l; i++) {
            res += '<br/>' + params[i].seriesId + ' : ' + params[i].value;
          }
          res += '</div>';
          return res;
        }
      },
      legend: {
        x: 'left',
        data: echartData.legendData,
        y: '15px'
      },
      calculable: true,
      grid: {
        y: 80,
        y2: 40,
        x2: 40
      },
      xAxis: [
        {
          type: 'category',
          data: echartData.xAxisData
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: echartData.series
    };
  }

  // 点击
  approveClick(data) {
    if (data['msg'] === 'success') {
      this.query(this.Processroute.proNameID, this.Processroute.stageID, this.Processroute.processCode, this.Processroute.signID, this.Processroute.formNo);
    }
  }

  onChartEvent(event) {
    const processXAxis = this.option.xAxis[0]['data'][event['dataIndex']];
    if (this.Processroute.processCode === processXAxis['code']) {
      window.open('/dashboard/dfc/target-report/' + this.Processroute.stageID + '/' + this.Processroute.processCode);
    }
  }

  // goBcak
  goBack() {
    this.page = 0;
    this.pageroute.emit(this.page);
  }

  revoke() {
    this.targetHourSignService.revoke(this.signData.signID).subscribe(data => {
      this.revokeFlag = false;
    });
  }
}
