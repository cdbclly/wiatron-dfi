import { Component, OnInit, ViewChild } from '@angular/core';
import { CpkChartComponent } from '../shared/charts/cpk-chart/cpk-chart.component';
import { DefectLossChartComponent } from '../shared/charts/defect-loss-chart/defect-loss-chart.component';
import { RetryRateChartComponent } from '../shared/charts/retry-rate-chart/retry-rate-chart.component';
import { TestTimeChartComponent } from '../shared/charts/test-time-chart/test-time-chart.component';
import { AteTemperatureChartComponent } from '../shared/charts/ate-temperature-chart/ate-temperature-chart.component';
import { ActivatedRoute } from '@angular/router';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { FacpkChartComponent } from '../shared/charts/facpk-chart/facpk-chart.component';
import { YieldRateChartComponent } from '../shared/charts/yield-rate-chart/yield-rate-chart.component';
import { AssemblyDefecChartComponent } from '../shared/charts/assembly-defec-chart/assembly-defec-chart.component';

@Component({
  selector: 'app-history-analyze-report',
  templateUrl: './history-analyze-report.component.html',
  styleUrls: ['./history-analyze-report.component.scss']
})
export class HistoryAnalyzeReportComponent implements OnInit {

  cur_site;
  cur_plant;
  cur_section;
  cur_line;
  cur_mdname;
  cur_item;
  cur_model;
  cur_st;
  cur_bt;
  project;
  datefrom;
  dateFormat;
  dateto;
  options;
  dateRangeFrom;
  dateRangeTo;
  cur_MachineModel;
  cur_upn;
  @ViewChild('cpkChart')
  cpkChart: CpkChartComponent;
  @ViewChild('defectChart')
  defectChart: DefectLossChartComponent;
  @ViewChild('retryRateChart')
  retryRateChart: RetryRateChartComponent;
  @ViewChild('testTimeChart')
  testTimeChart: TestTimeChartComponent;
  @ViewChild('ateTemperature')
  ateTemperature: AteTemperatureChartComponent;
  @ViewChild('yieldRateChart')
  yieldRateChart: YieldRateChartComponent;
  @ViewChild('facpkChart')
  facpkChart: FacpkChartComponent;
  @ViewChild('assemblyChart')
  assemblyChart: AssemblyDefecChartComponent;

    constructor(private activatedRoute: ActivatedRoute, private dataService: LineDataServiceService) {
     const queryPars = this.activatedRoute.queryParams['_value'];
    //  debugger;
      console.log(queryPars);
          if (queryPars.stage) {
            this.cur_section = queryPars.stage;
          } else {
            this.cur_line = queryPars.line;
          this.cur_mdname = queryPars.item;
          this.project = queryPars.project;
          if (this.project === 'QMCPK001') {
            this.project = 'rf cpk';
          } else if (this.project === 'QMFAIL001') {
            this.project = 'fpyr';
          } else if (this.project === 'QMRETRY001') {
            this.project = 'retry rate';
          } else if (this.project === 'QMTIME001') {
            this.project = 'test time';
          } else if (this.project === 'QMATE001') {
            this.project = 'ATE Temperature';
          } else if (this.project === 'QMCPK003') {
            this.project = 'assy fixturecpk';
          } else if (this.project === 'QMYR001') {
            this.project = 'yield_rate';
          } else if (this.project === 'QMRR001') {
            this.project = 'fixture retry rate';
          } else {
            this.project = 'rf cpk';
          }
            this.dataService.getSectionByLine(this.cur_line, queryPars.site, queryPars.plant).subscribe(res => {
              this.cur_section = res;
              this.cur_section = this.cur_section[0]['section']['name'];
          console.log(this.cur_section, queryPars.stage);
          this.cur_plant = queryPars.plant;
          this.cur_site = String(queryPars.site).toUpperCase();
          // this.project = queryPars.project;
          // if (this.project === 'QMCPK001') {
          //   this.project = 'rf cpk';
          // } else if (this.project === 'QMFAIL001') {
          //   this.project = 'fpyr';
          // } else if (this.project === 'QMRETRY001') {
          //   this.project = 'retry rate';
          // } else if (this.project === 'QMTIME001') {
          //   this.project = 'test time';
          // } else if (this.project === 'QMATE001') {
          //   this.project = 'ATE Temperature';
          // } else if (this.project === 'QMCPK003') {
          //   this.project = 'assy fixturecpk';
          // } else if (this.project === 'QMYR001') {
          //   this.project = 'yield_rate';
          // } else {
          //   this.project = 'rf cpk';
          // }
          this.datefrom = parseInt(queryPars.datefrom, 0) - 600000;
          this.dateto = parseInt(queryPars.datefrom, 0) + 600000; // 往后推10分鐘
          this.cur_model = queryPars.model;
          this.cur_MachineModel = queryPars.MachineModel;
          this.cur_item  = queryPars.fixId;
          this.cur_bt = String(queryPars.tdname).replace(/％20/g, ' ');
          this.cur_st = String(queryPars.mdname).replace(/％20/g, ' ');
          this.cur_upn = queryPars.upn ? queryPars.upn : 'NA';
            });
          }
          console.log(this.cur_bt, this.cur_st);
    // });
  }

  ngOnInit() {
  }

  async queryOp (options) {
    console.log(options);
    // debugger;
    if (this.cpkChart) {
      this.cpkChart.queryOp(options, 'history');
    }
    if (this.defectChart) {
      this.defectChart.queryOp(options, 'history');
    }
    if (this.retryRateChart) {
      this.retryRateChart.queryOp(options, 'history');
    }
    if (this.testTimeChart) {
      this.testTimeChart.queryOp(options, 'history');
    }
    if (this.ateTemperature) {
      this.ateTemperature.queryOp(options, 'history');
    }
    if (this.facpkChart) {
      this.facpkChart.queryOp(options, 'history');
    }
    if (this.yieldRateChart) {
      this.yieldRateChart.queryOp(options, 'history');
    }
    if (this.assemblyChart) {
      this.assemblyChart.queryOp(options, 'history');
    }
    console.log(options);
  }

  getOptions(type, result: Date) {
    if (type === 'dateTo') {
      this.dateto = result ? result.getTime() : undefined;
    }
    if (type === 'dateFrom') {
      this.datefrom = result ? result.getTime() : undefined;
    }
    // if (type === 'cur_date') {
    //   if (result.length > 0) {
    //     this.datefrom = result[0].getTime();
    //     this.dateto = result[1].getTime();
    //   } else {
    //     this.datefrom = undefined;
    //     this.dateto = undefined;
    //   }
    // }
    // if (type === 'project') {
    // }
  }

}
