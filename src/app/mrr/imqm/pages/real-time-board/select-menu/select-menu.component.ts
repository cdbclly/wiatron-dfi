import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SelectMenuService } from './select-menu.service';
import { ToolkitService } from '../../../imqm-common/service';
import { SelectItems } from 'app/mrr/imqm/imqm-common/toolKits/model';
import { setSelectLocal, getSelectLocal, assignObjectEmpty } from 'app/mrr/imqm/imqm-common/toolKits/autoSelect';

@Component({
  selector: 'app-select-menu',
  templateUrl: './select-menu.component.html',
  styleUrls: ['./select-menu.component.scss']
})
export class SelectMenuComponent implements OnInit {

  @Input() cur_site;
  siteGroup = [];
  @Input() cur_plant;
  plantGroup = [];
  siteInfos;
  queryButton = true;
  selectItem: SelectItems;
  @Input() subject;
  // tslint:disable-next-line:no-output-rename
  @Output('queryOption') queryOps = new EventEmitter<any>();
  sitePlantDic = {};
  constructor(
    private _service: SelectMenuService,
    private toolService: ToolkitService
  ) {
    this.selectItem = assignObjectEmpty(this.selectItem, ['cur_site', 'cur_plant', 'cur_productCate', 'cur_customer', 'cur_model', 'cur_vendor',
    'cur_proName', 'cur_searchBy', 'cur_materialNo']);
   }

  async ngOnChanges(changes: SimpleChanges) {
    this.selectItem.cur_site = this.selectItem.cur_site ? this.selectItem.cur_site : 'WKS';
    this.selectItem.cur_plant = this.selectItem.cur_plant ? this.selectItem.cur_plant : 'WKS-P1';
  }

  ngOnInit() {
    // 自动带出上次查询条件
    // debugger
    this.selectItem = getSelectLocal(this.subject) && getSelectLocal(this.subject)[this.subject] ? getSelectLocal(this.subject)[this.subject] : this.selectItem;
    if (this.selectItem && this.selectItem.cur_site) {
      // 获取site
    //   this._service.getSitePlantGroup().toPromise().then(res => {
    //     this.siteInfos = res;
    //     this.siteGroup = Object.keys(this.toolService.groupBy(res, 'site'));
    //     this.plantGroup = Object.keys(this.toolService.groupBy(this.siteInfos.filter(site => site['site'] === this.cur_site), 'plant'));
    //     this.queryButton = false;
    // });
    }
    // 获取site
    this.sitePlantDic = JSON.parse(localStorage.getItem('$IMQM$SitePlan'));
    this.siteGroup = Object.keys(this.sitePlantDic);
    if (this.selectItem.cur_site) {
      this.plantGroup = this.sitePlantDic[this.selectItem.cur_site];
    } else {
      this.plantGroup = [];
    }
    this.queryButton = false;
    console.log('厂商界面获取 site/plan 数据\n', this.siteGroup, this.plantGroup);
    // this._service.getSitePlantGroup().toPromise().then(res => {
    //   debugger
    //   this.siteInfos = res;
    //   this.siteGroup = Object.keys(this.toolService.groupBy(res, 'site'));
    //   this.plantGroup = Object.keys(this.toolService.groupBy(this.siteInfos.filter(site => site['site'] === this.selectItem.cur_site), 'plant'));
    //   this.queryButton = false;
    // });
  }

  getOptions(type) {
    switch (type) {
      case 'site':
        assignObjectEmpty(this.selectItem, ['cur_plant', 'cur_productCate', 'cur_customer', 'cur_model', 'cur_vendor',
        'cur_proName', 'cur_searchBy', 'cur_materialNo']);
        this.plantGroup = this.sitePlantDic[this.selectItem.cur_site];
        // this.plantGroup = Object.keys(this.toolService.groupBy(this.siteInfos.filter(res => res['site'] === this.selectItem.cur_site), 'plant'));
        (this.selectItem.cur_plant && this.selectItem.cur_site) ? this.queryButton = false : this.queryButton = true;
        break;
      case 'plant':
        assignObjectEmpty(this.selectItem, ['cur_productCate', 'cur_customer', 'cur_model', 'cur_vendor',
        'cur_proName', 'cur_searchBy', 'cur_materialNo']);
      (this.selectItem.cur_plant && this.selectItem.cur_site) ? this.queryButton = false : this.queryButton = true;
        break;
      default:
        this.queryButton = true;
        break;
    }
  }

  query() {
    setSelectLocal(this.subject, this.selectItem);
    this.queryOps.emit(this.selectItem);
  }

}
