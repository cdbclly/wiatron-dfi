import { setSelectLocal, getSelectLocal, assignObjectEmpty } from 'app/mrr/imqm/imqm-common/toolKits/autoSelect';
import { ToolkitService } from './../../../imqm-common/service/toolkit.service';
import { AutoTrackSelectService } from './../../manage-board/pages/close-rate-auto-track/auto-track-select/auto-track-select.service';
import { SelectItems } from './../../../imqm-common/toolKits/model';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  siteGroup;
  factoryGroup;
  productCateGroup;
  customerGroup;
  modelGroup;
  factoryUserGroup;
  proNameGroup;
  materialNoGroups;
  dateFormat;
  datefroms;
  selectItem: SelectItems;
  queryButton = true;
  isAllAuth = false; // all 權限
  @Input() subject;
  site = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['site'];
  plant = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant'];
  sitePlantDic = {};
  @Output() queryOps = new EventEmitter<any>();

  constructor(
    private _service: AutoTrackSelectService,
    private toolKits: ToolkitService
  ) {
    this.selectItem = assignObjectEmpty(this.selectItem, ['cur_site', 'cur_plant', 'cur_productCate', 'cur_customer', 'cur_model', 'cur_vendor',
    'cur_proName', 'cur_searchBy', 'cur_materialNo']);
   }

  ngOnInit() {
    this.sitePlantDic = JSON.parse(localStorage.getItem('$IMQM$SitePlan'));
    this.siteGroup = Object.keys(this.sitePlantDic);
    const allRoles = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['26'];
    this.isAllAuth = allRoles['read'];

    this.selectItem = getSelectLocal(this.subject) && getSelectLocal(this.subject)[this.subject] ? getSelectLocal(this.subject)[this.subject] : this.selectItem;
    console.log(this.selectItem);
    if (this.selectItem && this.selectItem.cur_site) {
      this.datefroms = [];
      this.datefroms[0] = new Date(this.selectItem.date_from);
      this.datefroms[1] = new Date(this.selectItem.date_to);
      this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate,
        this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor, this.selectItem.cur_proName, this.selectItem.cur_materialNo)).subscribe(res => {
        this.productCateGroup = res['product'];
        this.factoryGroup = res['plant'];
        this.customerGroup = res['customer'];
        this.modelGroup = res['model'];
        this.factoryUserGroup = res['vendor'];
        this.proNameGroup = res['productName'];
        this.materialNoGroups = res['partNumber'];
      });
      this.queryButton = false;
    }
  }


  async getOptions(type) {
    if (this.selectItem.cur_site && this.selectItem.cur_plant && this.selectItem.cur_productCate && this.selectItem.cur_customer && (this.datefroms || this.selectItem.date_from)) {
      this.queryButton = false;
    } else {
      this.queryButton = true;
    }
    if (type === 'site') {
      assignObjectEmpty(this.selectItem, ['cur_plant', 'cur_productCate', 'cur_customer', 'cur_model', 'cur_vendor',
    'cur_proName', 'cur_searchBy', 'cur_materialNo']);
      this.factoryGroup = this.sitePlantDic[this.selectItem.cur_site];
    }
    if (type === 'factory') {
      assignObjectEmpty(this.selectItem, ['cur_productCate', 'cur_customer', 'cur_model', 'cur_vendor',
      'cur_proName', 'cur_searchBy', 'cur_materialNo']);
      this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant)).subscribe(res => {
          this.productCateGroup = res['product'];
        });
    }
    if (type === 'productCate') {
      assignObjectEmpty(this.selectItem, ['cur_customer', 'cur_model', 'cur_vendor',
      'cur_proName', 'cur_searchBy', 'cur_materialNo']);
      this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate)).subscribe(res => {
        this.customerGroup = res['customer'];
      });
    }
    if (type === 'searchBy') {
      assignObjectEmpty(this.selectItem, ['cur_model', 'cur_vendor', 'cur_proName',  'cur_materialNo']);
    }
    if (type === 'customer') {
      assignObjectEmpty(this.selectItem, ['cur_model', 'cur_searchBy', 'cur_vendor', 'cur_proName',  'cur_materialNo']);
      this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate,
        this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor, this.selectItem.cur_proName)).subscribe(res => {
        // this.modelGroup = res['model'];
        this.factoryUserGroup = res['vendor'];
        // this.proNameGroup = res['productName'];
        // this.materialNoGroups = res['partNumber'];
      });
    }
    if (type === 'model') {
      // debugger;
      assignObjectEmpty(this.selectItem, ['cur_proName',  'cur_materialNo']);
      this.selectItem.cur_model = this.selectItem.cur_model === null ? undefined : this.selectItem.cur_model;
      this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate,
        this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor, this.selectItem.cur_proName)).subscribe(res => {
          // debugger;
          // this.modelGroup = res['model'];
          // this.factoryUserGroup = res['vendor'];
          this.proNameGroup = res['productName'];
          // this.materialNoGroups = res['partNumber'];
        });
    }
    if (type === 'factoryUser') {
      assignObjectEmpty(this.selectItem, ['cur_model', 'cur_proName',  'cur_materialNo']);
      this.selectItem.cur_vendor = this.selectItem.cur_vendor === null ? undefined : this.selectItem.cur_vendor;
      this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate,
        this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor === null ? undefined : this.selectItem.cur_vendor, this.selectItem.cur_proName)).subscribe(res => {
          this.modelGroup = res['model'];
          // this.factoryUserGroup = res['vendor'];
          // this.proNameGroup = res['productName'];
          // this.materialNoGroups = res['partNumber'];
        });
    }
    if (type === 'proName') {
      this.selectItem.cur_materialNo = undefined;
      this.selectItem.cur_proName = this.selectItem.cur_proName === null ? undefined : this.selectItem.cur_proName;
      this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate,
        this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor, this.selectItem.cur_proName === null ? undefined : this.selectItem.cur_proName)).subscribe(res => {
          this.modelGroup = res['model'];
          // this.factoryUserGroup = res['vendor'];
          // this.proNameGroup = res['productName'];
          this.materialNoGroups = res['partNumber'];
        });
    }
    if (type === 'materialNo') {
    }
    if (type === 'cur_date') {
      console.log(this.datefroms);
      if (this.datefroms) {
        this.selectItem.date_from = this.datefroms[0].getTime();
        this.selectItem.date_to = this.datefroms[1].getTime();
      } else {
        this.selectItem.date_from = undefined;
        this.selectItem.date_to = undefined;
      }
    }
  }

  query() {
  //   this.queryOps.emit({'cur_site': this.cur_site, 'cur_plant': this.cur_plant, 'cur_productCate': this.cur_productCate,
  // 'cur_customer': this.cur_customer, 'cur_searchBy': this.cur_searchBy, 'cur_model': this.cur_model, 'cur_vendor': this.cur_vendor,
  // 'cur_proName': this.cur_proName, 'cur_materialNo': this.cur_materialNo, 'date_from': this.date_from, 'date_to': this.date_to});
    setSelectLocal(this.subject, this.selectItem);
    // debugger
    console.log(this.selectItem)
    this.queryOps.emit(this.selectItem);
  }

}
