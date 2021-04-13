import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { KpiBoardSelectServiceService } from './kpi-board-select-service.service';
import * as moment from 'moment';
import { ToolkitService } from '../../../../../imqm-common/service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-kpi-board-select',
  templateUrl: './kpi-board-select.component.html',
  styleUrls: ['./kpi-board-select.component.scss']
})
export class KpiBoardSelectComponent implements OnInit {

  cur_factory;
  factoryGroup;
  site;
  cur_site;
  dateFormat = 'yyyy-MM';
  datefroms;
  siteInfos;
  date_from;
  date_to;
  isAllAuth = false;
  sitePlantDic = {};
  @Output() queryOps = new EventEmitter<any>();
  constructor(
    private _service: KpiBoardSelectServiceService,
    private toolService: ToolkitService,
    private datePipe: DatePipe
    ) { }

  ngOnInit() {
    // 当前登录者的site, plant
    const roles = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['26'];
    this.isAllAuth = roles['read'];
    this.site = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['site'];
    if (sessionStorage.getItem('kpi-datefrom')) {
      this.date_from = this.datePipe.transform(sessionStorage.getItem('kpi-datefrom'), 'yyyy-MM');
      this.date_to = this.datePipe.transform(sessionStorage.getItem('kpi-dateto'), 'yyyy-MM');
    }

    this.sitePlantDic = JSON.parse(localStorage.getItem('$IMQM$SitePlan'));
    // 获取当前登陆者能看到的所有的plant
    const siteGroup = Object.keys(this.sitePlantDic);
    const tempPlantArr = [];
    for (const site of siteGroup) {
      tempPlantArr.push.apply(tempPlantArr, this.sitePlantDic[site]);
    }
    this.factoryGroup = tempPlantArr;
    this.cur_factory = sessionStorage.getItem('kpi-plant') ? sessionStorage.getItem('kpi-plant') : JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant'];
    this.query();
    // 根據site獲取廠別資料
    // if (this.isAllAuth) {
    //   this._service.getSitePlantGroup().subscribe(res => {
    //     this.siteInfos = res;
    //     this.factoryGroup = Object.keys(this.toolService.groupBy(res, 'plant'));
    //     this.cur_factory = sessionStorage.getItem('kpi-plant') ? sessionStorage.getItem('kpi-plant') : 'WKS-P1';
    //     this.query();
    //   });
    // } else {
    //   this._service.getSelectDatas({site: this.site}).subscribe(res => {
    //     this.factoryGroup = res['plant'];
    //     this.cur_factory = sessionStorage.getItem('kpi-plant') ? sessionStorage.getItem('kpi-plant') : JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant'];
    //     this.query();
    //   });
    // }
  }

  getOptions(type) {

  }

  query() {
    let dateto;
    let datefrom;
    if (this.date_from && this.date_to) {
      console.log(this.date_from instanceof Date);
      datefrom = this.date_from instanceof Date ? this.date_from.getTime() : new Date(this.date_from).getTime();
      dateto = this.date_from instanceof Date ? this.date_to.getTime() : new Date(this.date_to).getTime();
      // 保留上次查詢記錄
      sessionStorage.setItem('kpi-datefrom', datefrom);
      sessionStorage.setItem('kpi-dateto', dateto);
      sessionStorage.setItem('kpi-plant', this.cur_factory);
    } else {
      datefrom = sessionStorage.getItem('kpi-datefrom') ? sessionStorage.getItem('kpi-datefrom') : undefined;
      dateto = sessionStorage.getItem('kpi-dateto') ? sessionStorage.getItem('kpi-dateto') : undefined;
    }
    sessionStorage.setItem('kpi-plant', this.cur_factory);
    // 根據factory 查找site
    this.queryOps.emit({'cur_site': sessionStorage.getItem('kpi-plant').substring(0, 3), 'cur_plant': sessionStorage.getItem('kpi-plant'), 'date_from': datefrom, 'date_to': dateto});
    // this.queryOps.emit({'cur_site': this.isAllAuth ? this.siteInfos.filter(res => res['plant'] === this.cur_factory)[0]['site'] : this.site, 'cur_plant': sessionStorage.getItem('kpi-plant'), 'date_from': datefrom, 'date_to': dateto});
  }

}
