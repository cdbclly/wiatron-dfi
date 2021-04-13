import { Component, OnInit, ViewChild } from '@angular/core';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { GlobalService } from '@service/skyeye/global.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FacpkChartComponent } from '../shared/charts/facpk-chart/facpk-chart.component';

@Component({
  selector: 'app-cntcpk',
  templateUrl: './cntcpk.component.html',
  styleUrls: ['./cntcpk.component.scss']
})
export class CntcpkComponent implements OnInit {

  cur_site = 'WKS';
  project = 'assy fixturecpk';
  cur_plant;
  cur_line;
  cur_section;
  cur_mdname;
  cur_model;
  cur_bt;
  cur_st;
  timer;
  cur_date;
  cur_MachineModel; // 治具类别
  cur_item;
  @ViewChild ('facpkChart') facpkChart: FacpkChartComponent;

  constructor(
    private esService: EsDataServiceService,
    private globals: GlobalService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe(queryPars => {
      console.log('queryPars 数据如下 \n', queryPars);
      this.cur_line = queryPars.line;
      this.cur_mdname = queryPars.item;
      this.cur_section = queryPars.stage;
      this.cur_plant = queryPars.plant;
      this.cur_site = queryPars.site;
      // 治具类别
      this.cur_MachineModel = queryPars.machineModel;
      this.cur_item = queryPars.fixId;
      this.cur_model = queryPars.model;
      this.cur_bt = queryPars.bt;
      this.cur_st = queryPars.st;
      console.log(queryPars.test);
    });
   }

   async ngOnInit() {
    // GlobalAbnormalNum.abnormal_num = -1;
     /*
     如果是从看板界面进入report界面就写入缓存
     */
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
    // 等待echart
    this.facpkChart.queryOp(options);
  }

}
