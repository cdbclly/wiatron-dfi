import { filter } from 'rxjs/operators';
import { GlobalService } from './../../../../service/skyeye/global.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CPKSliding, Detail, CPKTubling } from '../../model/CPK';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CpkChartComponent } from '../shared/charts/cpk-chart/cpk-chart.component';
import { MatomoInjector, MatomoTracker } from 'ngx-matomo';

@Component({
  selector: 'app-cpk-analyze',
  templateUrl: './cpk-analyze.component.html',
  styleUrls: ['./cpk-analyze.component.scss']
})
export class CpkAnalyzeComponent implements OnInit {

  cur_site = 'WKS';
  project = 'rf cpk';
  cur_plant;
  cur_line;
  cur_section;
  cur_mdname;
  cur_model;
  cur_bt;
  cur_st;
  timer;
  cur_date;
  cur_item;
  cur_upn;
  @ViewChild('cpkChart')
  cpkChart: CpkChartComponent;
  constructor(private esService: EsDataServiceService, private globals: GlobalService,
    private datePipe: DatePipe, private activatedRoute: ActivatedRoute,
    private readonly matomoTracker: MatomoTracker,
    private readonly matomoInjector: MatomoInjector) {
      this.matomoInjector.init('https://matomo.wistron.com/', 24);

      this.activatedRoute.queryParams.subscribe(queryPars => {
        console.log(queryPars);
        this.cur_line = queryPars.line;
        this.cur_mdname = queryPars.item;
        this.cur_section = queryPars.stage;
        this.cur_plant = queryPars.plant;
        this.cur_site = queryPars.site;
        this.cur_item = queryPars.fixId;
        this.cur_model = queryPars.model;
        this.cur_bt = queryPars.bt;
        this.cur_st = queryPars.st;
        // 架构
        this.cur_upn = queryPars.upn;
        console.log(queryPars.test);
      });
     }

  async ngOnInit() {
    this.matomoTracker.trackPageView('cpkPage');

    // GlobalAbnormalNum.abnormal_num = -1;
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
    this.cur_plant = options['cur_plant'];
    this.cur_site = options['cur_site'];
    console.log(options);
    this.cpkChart.queryOp(options);
  }

}
