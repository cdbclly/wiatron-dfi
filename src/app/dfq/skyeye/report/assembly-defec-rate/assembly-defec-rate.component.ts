import { Component, OnInit, ViewChild } from '@angular/core';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { GlobalService } from '@service/skyeye/global.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AssemblyDefecChartComponent } from '../shared/charts/assembly-defec-chart/assembly-defec-chart.component';

@Component({
  selector: 'app-assembly-defec-rate',
  templateUrl: './assembly-defec-rate.component.html',
  styleUrls: ['./assembly-defec-rate.component.scss']
})
export class AssemblyDefecRateComponent implements OnInit {

  cur_site = 'WKS';
  project = 'fixture retry rate';
  cur_plant;
  cur_line;
  cur_section;
  cur_mdname;
  cur_model;
  timer;
  cur_date;
  cur_MachineModel; // 治具类别
  cur_item;
  @ViewChild ('assemblyChart') assemblyChart: AssemblyDefecChartComponent;
  constructor(
    private esService: EsDataServiceService,
    private globals: GlobalService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe(queryPars => {
      console.log(queryPars);
      this.cur_line = queryPars.line;
      this.cur_mdname = queryPars.item;
      this.cur_section = queryPars.stage;
      this.cur_plant = queryPars.plant;
      this.cur_site = queryPars.site;

      this.cur_MachineModel = queryPars.machineModel;

      this.cur_item = queryPars.fixId;
      this.cur_model = queryPars.model;
      // this.cur_bt = queryPars.bt;
      // this.cur_st = queryPars.st;
      console.log(queryPars.test);
    });
  }

  async ngOnInit() {
    // GlobalAbnormalNum.abnormal_num = -1;
      if ((this.cur_plant !== undefined && this.cur_line !== undefined && this.cur_mdname !== undefined && this.cur_section !== undefined)) {
        sessionStorage.setItem('aly_site', this.cur_site);
        sessionStorage.setItem('aly_plant', this.cur_plant);
        sessionStorage.setItem('aly_section', this.cur_section);
        sessionStorage.setItem('aly_line', this.cur_line);
        sessionStorage.setItem('aly_mdname', this.cur_mdname);
        /*
        sessionStorage.setItem('aly_machineModel', this.cur_machineModel);
        */
    } else {
      if (sessionStorage.getItem('aly_plant') !== null && sessionStorage.getItem('aly_section') !== null) {
        this.cur_site = sessionStorage.getItem('aly_site');
        this.cur_plant = sessionStorage.getItem('aly_plant');
        this.cur_section = sessionStorage.getItem('aly_section');
        this.cur_line = sessionStorage.getItem('aly_line');
        this.cur_mdname = sessionStorage.getItem('aly_mdname');
         /*
        sessionStorage.getItem('aly_machineModel');
        */
      // this.queryOp(options);
      }
    }
    this.cur_date = new Date().getTime();
  }

  async queryOp (options) {
    this.cur_plant = options['cur_plant'];
    this.cur_site = options['cur_site'];
    this.assemblyChart.queryOp(options);
  }
}
