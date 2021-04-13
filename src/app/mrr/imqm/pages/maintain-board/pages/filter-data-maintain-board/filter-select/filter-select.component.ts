import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ImqmSelectService } from '../../../../../imqm-common/component/imqm-select/imqm-select.service';
import { FilterSelectService } from './filter-select.service';
import { ToolkitService } from '../../../../../imqm-common/service';
import * as moment from 'moment';
import { setSelectLocal, getSelectLocal, assignObjectEmpty } from '../../../../../imqm-common/toolKits/autoSelect';
import { SelectItems } from '../../../../../imqm-common/toolKits/model';
import { NzI18nService, zh_TW, en_US } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-filter-select',
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.scss']
})
export class FilterSelectComponent implements OnInit,OnDestroy {
 // cur_site;
 siteGroup;
 // cur_factory;
 factoryGroup;
 // cur_productCate;
 productCateGroup;
 // cur_customer;
 customerGroup;
 // cur_searchBy;
 // cur_model;
 modelGroup;
 // cur_factoryUser;
 factoryUserGroup;
 // cur_proName;
 proNameGroup;
 // cur_materialNo;
 materialNoGroups;
 // date_to;
 // date_from;
//  dateFormat = 'yyyy-MM-dd';
//  datefroms;
 isDisable = false;
 isDisableSearch = false;
 queryButton = true;
 isAllAuth = false;
 selectItem: SelectItems;
 @Input() onlyShowRequired;
 @Input() subject;
 @Output() queryOps = new EventEmitter<any>();
 site = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['site'];
 plant = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant'];

 $destroy = new Subject();

 constructor(
   private _service: FilterSelectService,
   private toolKits: ToolkitService,
   private nzI18nService: NzI18nService,
   private translate: TranslateService
   ) {
   this.selectItem = assignObjectEmpty(this.selectItem, ['cur_site', 'cur_plant', 'cur_productCate', 'cur_customer', 'cur_model', 'cur_vendor',
   'cur_proName', 'cur_materialNo']);
 }

 ngOnInit() {
   const roles = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['29'];
   const allRoles = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['26'];
   this.isAllAuth = allRoles['read'];
   if (this.isAllAuth) {
     this._service.getSelectDatas().subscribe(res => {
       this.siteGroup = res['site'];
     });
   } else {
     this.siteGroup = [this.site];
   }
   // 自动带出上次查询条件
   this.selectItem = getSelectLocal(this.subject) && getSelectLocal(this.subject)[this.subject] ? getSelectLocal(this.subject)[this.subject] : this.selectItem;
   if (this.selectItem && this.selectItem.cur_site) {
    //  this.datefroms = [];
    //  this.datefroms[0] = new Date(this.selectItem.date_from);
    //  this.datefroms[1] = new Date(this.selectItem.date_to);
     this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site)).subscribe(res => {
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
   if (this.selectItem.cur_site && this.selectItem.cur_plant && this.selectItem.cur_productCate && this.selectItem.cur_customer ) {
     this.queryButton = false;
   }else {
     this.queryButton = true;
   }
   if (type === 'site') {
     assignObjectEmpty(this.selectItem, ['cur_plant', 'cur_productCate', 'cur_customer', 'cur_model', 'cur_vendor',
   'cur_proName', 'cur_materialNo']);
     if (this.isAllAuth) {
       this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site)).subscribe(res => {
         this.factoryGroup = res['plant'];
       });
     } else {
       this.factoryGroup = [this.plant];
     }
     this.productCateGroup = [];
     this.customerGroup = [];
     this.modelGroup = [];
     this.factoryUserGroup = [];
     this.proNameGroup = [];
     this.materialNoGroups = [];
   }
   if (type === 'factory') {
     assignObjectEmpty(this.selectItem, ['cur_productCate', 'cur_customer', 'cur_model', 'cur_vendor',
     'cur_proName',  'cur_materialNo']);
     this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant)).subscribe(res => {
         this.productCateGroup = res['product'];
         this.customerGroup = [];
         this.modelGroup = [];
         this.factoryUserGroup = [];
         this.proNameGroup = [];
         this.materialNoGroups = [];
       });
   }
   if (type === 'productCate') {
     assignObjectEmpty(this.selectItem, ['cur_customer', 'cur_model', 'cur_vendor',
     'cur_proName', 'cur_materialNo']);
     this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate)).subscribe(res => {
       this.customerGroup = res['customer'];
       this.modelGroup = [];
       this.factoryUserGroup = [];
       this.proNameGroup = [];
       this.materialNoGroups = [];
     });
   }
  //  if (type === 'searchBy') {
  //    assignObjectEmpty(this.selectItem, ['cur_model', 'cur_vendor', 'cur_proName',  'cur_materialNo']);
  //    if (this.selectItem.cur_searchBy !== 'partNumber' && this.selectItem.cur_searchBy) {
  //      this.isDisable = true;
  //      this.isDisableSearch = false;
  //    } else if (!this.selectItem.cur_searchBy) {
  //      this.isDisableSearch = false;
  //      this.isDisable = false;
  //    } else {
  //      this.isDisable = false;
  //    }
  //  }
   if (type === 'customer') {
     assignObjectEmpty(this.selectItem, ['cur_model', 'cur_vendor', 'cur_proName', 'cur_materialNo']);
     this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate,
       this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor, this.selectItem.cur_proName)).subscribe(res => {
       this.modelGroup = res['model'];
       this.factoryUserGroup = res['vendor'];
       this.proNameGroup = res['productName'];
       this.materialNoGroups = res['partNumber'];
     });
   }
   if (type === 'model') {
     this.selectItem.cur_model = this.selectItem.cur_model === null ? undefined : this.selectItem.cur_model;
     assignObjectEmpty(this.selectItem, ['cur_vendor', 'cur_proName', 'cur_materialNo']);
     this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate,
       this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor === '' ? undefined : this.selectItem.cur_vendor, this.selectItem.cur_proName)).subscribe(res => {
         console.log(res);
         // this.modelGroup = res['model'];
         this.factoryUserGroup = res['vendor'];
         this.proNameGroup = res['productName'];
         this.materialNoGroups = res['partNumber'];
        //  this.selectItem.cur_searchBy = 'partNumber';
       });
     console.log(this.modelGroup);
   }
   if (type === 'factoryUser') {
     // this.selectItem.cur_proName = undefined; this.selectItem.cur_proName = undefined; this.selectItem.cur_materialNo = undefined;
     assignObjectEmpty(this.selectItem, ['cur_proName', 'cur_materialNo']);
     this.selectItem.cur_vendor = this.selectItem.cur_vendor === null ? undefined : this.selectItem.cur_vendor;
     this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate,
       this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor === null ? undefined : this.selectItem.cur_vendor, this.selectItem.cur_proName)).subscribe(res => {
         // this.modelGroup = res['model'];
         // this.factoryUserGroup = res['vendor'];
         this.proNameGroup = res['productName'];
         this.materialNoGroups = res['partNumber'];
        //  this.selectItem.cur_searchBy = 'partNumber';
       });
   }
   if (type === 'proName') {
     this.selectItem.cur_materialNo = undefined;
     this.selectItem.cur_proName = this.selectItem.cur_proName === null ? undefined : this.selectItem.cur_proName;
     console.log(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate,
       this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor, this.selectItem.cur_proName));
     this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate,
       this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor, this.selectItem.cur_proName === null ? undefined : this.selectItem.cur_proName)).subscribe(res => {
         // this.modelGroup = res['model'];
         // this.factoryUserGroup = res['vendor'];
         // this.proNameGroup = res['productName'];
         this.materialNoGroups = res['partNumber'];
        //  this.selectItem.cur_searchBy = 'partNumber';
       });
   }
   if (type === 'materialNo') {
    //  this.selectItem.cur_searchBy = 'partNumber';
     this.selectItem.cur_materialNo = this.selectItem.cur_materialNo === null ? undefined : this.selectItem.cur_materialNo;
   }
   
 }

 query() {
   setSelectLocal(this.subject, this.selectItem);
   //将查询栏位值传给父组件
   this.queryOps.emit(this.selectItem);
 }

 ngOnDestroy(): void {
   //Called once, before the instance is destroyed.
   //Add 'implements OnDestroy' to the class.
   // this.$destroy.next();
   // this.$destroy.complete();
 }


}
