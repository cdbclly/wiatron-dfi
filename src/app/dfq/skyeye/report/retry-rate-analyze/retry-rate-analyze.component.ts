import { GlobalService } from './../../../../service/skyeye/global.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RetryRates, Detail } from '../../model/RetryRate';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { RetryRateChartComponent } from '../shared/charts/retry-rate-chart/retry-rate-chart.component';


@Component({
  selector: 'app-retry-rate-analyze',
  templateUrl: './retry-rate-analyze.component.html',
  styleUrls: ['./retry-rate-analyze.component.scss']
})
export class RetryRateAnalyzeComponent implements OnInit {

  cur_site = 'WKS';
  cancelOK = false;
  cancelOK_1 = false;
  project = 'retry rate';
  cur_plant;
  cur_line;
  cur_section;
  cur_mdname;
  timer;
  cur_model;
  cur_item;
  cur_date;
  abnormalArr: {}[] = []; markLineX: {}[] = []; limit_arr: {} = undefined;
  cur_upn;
  @ViewChild('retryRateChart')
  retryRateChart: RetryRateChartComponent;
  constructor(private esService: EsDataServiceService, private datePipe: DatePipe, private globals: GlobalService,
    private activatedRoute: ActivatedRoute, private dataService: LineDataServiceService) {
      this.activatedRoute.queryParams.subscribe(queryPars => {
        console.log(queryPars);
        this.cur_line = queryPars.line;
        this.cur_mdname = queryPars.item;
        this.cur_section = queryPars.stage;
        this.cur_plant = queryPars.plant;
        this.cur_site = queryPars.site;
        // 架构
        this.cur_upn = queryPars.upn;

      });
    }

  ngOnInit() {
    // if (sessionStorage.getItem('aly_plant') !== null && sessionStorage.getItem('aly_section') !== null) {
    //   this.cur_site = sessionStorage.getItem('aly_site');
    //   this.cur_plant = sessionStorage.getItem('aly_plant');
    //   this.cur_section = sessionStorage.getItem('aly_section');
    //   this.cur_line = sessionStorage.getItem('aly_line');
    //   this.cur_mdname = sessionStorage.getItem('aly_mdname');
    // }
    if ((this.cur_plant !== undefined && this.cur_line !== undefined && this.cur_mdname !== undefined && this.cur_section !== undefined)) {
      sessionStorage.setItem('aly_site', this.cur_site);
      sessionStorage.setItem('aly_plant', this.cur_plant);
      sessionStorage.setItem('aly_section', this.cur_section);
      sessionStorage.setItem('aly_line', this.cur_line);
      sessionStorage.setItem('aly_mdname', this.cur_mdname);
  } else {
    if (sessionStorage.getItem('aly_plant') !== null && sessionStorage.getItem('aly_section') !== null) {
      this.cur_site = sessionStorage.getItem('aly_site');
      this.cur_plant = sessionStorage.getItem('aly_plant');
      this.cur_section = sessionStorage.getItem('aly_section');
      this.cur_line = sessionStorage.getItem('aly_line');
      this.cur_mdname = sessionStorage.getItem('aly_mdname');
    // this.queryOp(options);
    }
  }
  this.cur_date = new Date().getTime();
}

async queryOp (options) {
  console.log('查询条件对应的数据======== \n', options);
  this.cur_plant = options['cur_plant'];
  this.cur_site = options['cur_site'];
  this.retryRateChart.queryOp(options);
}
}
