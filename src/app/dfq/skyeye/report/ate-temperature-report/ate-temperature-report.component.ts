import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AteTemperatureChartComponent } from '../shared/charts/ate-temperature-chart/ate-temperature-chart.component';

@Component({
  selector: 'app-ate-temperature-report',
  templateUrl: './ate-temperature-report.component.html',
  styleUrls: ['./ate-temperature-report.component.scss']
})
export class AteTemperatureReportComponent implements OnInit {

  cur_site;
  project = 'ATE Temperature';
  cur_model;
  cur_plant;
  cur_line;
  cur_section;
  cur_mdname; // 站別名稱
  cur_item;
  timer;
  cur_date;
  @ViewChild('ateTempChart')
  ateTempChart: AteTemperatureChartComponent;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(queryPars => {
      console.log(queryPars);
      this.cur_line = queryPars.line;
      this.cur_mdname = queryPars.item;
      this.cur_section = queryPars.stage;
      this.cur_plant = queryPars.plant;
      this.cur_site = queryPars.site;
    });
   }

  ngOnInit() {
    // debugger;
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
    }
  }
  this.cur_date = new Date().getTime();
  }

  async queryOp (options) {
    this.cur_plant = options['cur_plant'];
    this.cur_site = options['cur_site'];
    this.ateTempChart.queryOp(options);
  }

}
