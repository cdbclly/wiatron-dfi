import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ImqmSelectService } from './imqm-select.service';
import { ToolkitService } from '../../service';
import * as moment from 'moment';
import { setSelectLocal, getSelectLocal, assignObjectEmpty } from '../../toolKits/autoSelect';
import { SelectItems } from '../../toolKits/model';
import { NzI18nService, zh_TW, en_US } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-imqm-select',
  templateUrl: './imqm-select.component.html',
  styleUrls: ['./imqm-select.component.scss']
})
export class ImqmSelectComponent implements OnInit, OnDestroy {

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
  dateFormat = 'yyyy-MM-dd';
  datefroms;
  isDisable = false;
  isDisableSearch = false;
  queryButton = true;
  isAllAuth = false;
  selectItem: SelectItems;
  @Input() specialStar;
  @Input() onlyShowRequired;
  @Input() subject;
  @Output() queryOps = new EventEmitter<any>();
  site = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['site'];
  plant = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant'];

  $destroy = new Subject();

  constructor(
    private _service: ImqmSelectService,
    private toolKits: ToolkitService,
    private nzI18nService: NzI18nService,
    private translate: TranslateService
    ) {
      // this.translate.onLangChange.pipe(takeUntil(this.$destroy)).subscribe(lang => {
      //   if (lang.lang === 'en') {
      //     this.nzI18nService.setLocale(en_US);
      //   } else {
      //     this.nzI18nService.setLocale(zh_TW);
      //   }
      // });
    this.selectItem = assignObjectEmpty(this.selectItem, ['cur_site', 'cur_plant', 'cur_productCate', 'cur_customer', 'cur_model', 'cur_vendor',
    'cur_proName', 'cur_searchBy', 'cur_materialNo']);
  }

  ngOnInit() {
    // this.selectItem = assignObjectEmpty(this.selectItem, ['cur_site', 'cur_plant', 'cur_productCate', 'cur_customer', 'cur_model', 'cur_vendor',
    // 'cur_proName', 'cur_searchBy', 'cur_materialNo']);

    const sitePlantDic = JSON.parse(localStorage.getItem('$IMQM$SitePlan'));
    this.siteGroup = Object.keys(sitePlantDic);
    // const allRoles = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['26'];
    // this.isAllAuth = allRoles['read'];
    // if (this.isAllAuth) {
    //   this._service.getSelectDatas().subscribe(res => {
    //     this.siteGroup = res['site'];
    //   });
    // } else {
    //   console.log('非all权限的 site =\n', JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['site']);
    //   this.siteGroup = [this.site];
    // }
    // 自动带出上次查询条件
    this.selectItem = getSelectLocal(this.subject) && getSelectLocal(this.subject)[this.subject] ? getSelectLocal(this.subject)[this.subject] : this.selectItem;
    if (this.selectItem && this.selectItem.cur_site) {
      this.datefroms = [];
      this.datefroms[0] = new Date(this.selectItem.date_from);
      this.datefroms[1] = new Date(this.selectItem.date_to);
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

    // selectItem初始化赋值
    if (type === 'site') {
      assignObjectEmpty(this.selectItem, ['cur_plant', 'cur_productCate', 'cur_customer', 'cur_model', 'cur_vendor',
    'cur_proName', 'cur_searchBy', 'cur_materialNo']);
    const sitePlantDic = JSON.parse(localStorage.getItem('$IMQM$SitePlan'));
    this.factoryGroup = sitePlantDic[this.selectItem.cur_site];
      // if (this.isAllAuth) {
      //   this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site)).subscribe(res => {
      //     console.log('根据site 获取到的 plant 资料 \n', res, res['plant']);
      //     this.factoryGroup = res['plant'];
      //   });
      // } else {
      //   console.log('非all权限的 plant =\n',JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant']);
      //   this.factoryGroup = [this.plant];
      // }
      this.productCateGroup = [];
      this.customerGroup = [];
      this.modelGroup = [];
      this.factoryUserGroup = [];
      this.proNameGroup = [];
      this.materialNoGroups = [];
    }

    if (type === 'factory') {
      assignObjectEmpty(this.selectItem, ['cur_productCate', 'cur_customer', 'cur_model', 'cur_vendor',
      'cur_proName', 'cur_searchBy', 'cur_materialNo']);
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
      'cur_proName', 'cur_searchBy', 'cur_materialNo']);
      this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate)).subscribe(res => {
        this.customerGroup = res['customer'];
        this.modelGroup = [];
        this.factoryUserGroup = [];
        this.proNameGroup = [];
        this.materialNoGroups = [];
      });
    }

    if (type === 'searchBy') {
      assignObjectEmpty(this.selectItem, ['cur_model', 'cur_vendor', 'cur_proName',  'cur_materialNo']);
      if (this.selectItem.cur_searchBy !== 'predefined' && this.selectItem.cur_searchBy) {
        this.isDisable = true;
        this.isDisableSearch = false;
      } else if (!this.selectItem.cur_searchBy) {
        this.isDisableSearch = false;
        this.isDisable = false;
      } else {
        this.isDisable = false;
      }
    }

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
      assignObjectEmpty(this.selectItem, ['cur_proName', 'cur_materialNo']);
      this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate,
        this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor === '' ? undefined : this.selectItem.cur_vendor, this.selectItem.cur_proName)).subscribe(res => {
          console.log(res);
          // this.modelGroup = res['model'];
          // this.factoryUserGroup = res['vendor'];
          this.proNameGroup = res['productName'];
          this.materialNoGroups = res['partNumber'];
          // this.selectItem.cur_searchBy = 'predefined';
        });
      console.log(this.modelGroup);
    }

    if (type === 'factoryUser') {
      if (this.subject === 'downloadRowdata') {
        this.selectItem.cur_model = undefined;
      }
      // this.selectItem.cur_proName = undefined; this.selectItem.cur_proName = undefined; this.selectItem.cur_materialNo = undefined;
      assignObjectEmpty(this.selectItem, ['cur_model', 'cur_proName', 'cur_materialNo']);
      this.selectItem.cur_vendor = this.selectItem.cur_vendor === null ? undefined : this.selectItem.cur_vendor;
      this._service.getSelectDatas(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate,
        this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor === null ? undefined : this.selectItem.cur_vendor, this.selectItem.cur_proName)).subscribe(res => {
          this.modelGroup = res['model'];
          // this.factoryUserGroup = res['vendor'];
          this.proNameGroup = res['productName'];
          this.materialNoGroups = res['partNumber'];
          // this.selectItem.cur_searchBy = 'predefined';
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
          // this.selectItem.cur_searchBy = 'predefined';
        });
    }

    if (type === 'materialNo') {
      // this.selectItem.cur_searchBy = 'predefined';
      this.selectItem.cur_materialNo = this.selectItem.cur_materialNo === null ? undefined : this.selectItem.cur_materialNo;
    }
    if (type === 'cur_date') {
      console.log(this.datefroms);
      if (this.datefroms) {
        // this.date_from = this.datefroms[0].getTime();
        // this.date_to = this.datefroms[1].getTime();
        this.selectItem.date_from = new Date(moment(this.datefroms[0].getTime()).format('YYYY-MM-DD 00:00:00')).getTime();
        this.selectItem.date_to = new Date(moment(this.datefroms[1].getTime()).add(1, 'days').format('YYYY-MM-DD 00:00:00')).getTime();
        // 不做加1处理
        // this.selectItem.date_to = new Date(moment(this.datefroms[1].getTime()).format('YYYY-MM-DD 23:59:59')).getTime();
      } else {
        this.selectItem.date_from = undefined;
        this.selectItem.date_to = undefined;
      }
    }

    if (this.subject !== 'testItem' && this.selectItem.cur_site && this.selectItem.cur_plant && this.selectItem.cur_productCate && this.selectItem.cur_customer && this.selectItem.cur_searchBy && (this.datefroms || this.selectItem.date_from)) {
      if (this.selectItem.cur_searchBy === 'predefined' ) {
        // 当选择自定义的时候，供应商、机种、品名、料号必须选择一个，query按钮才能点击
        if (!(this.selectItem.cur_vendor || this.selectItem.cur_model || this.selectItem.cur_proName || this.selectItem.cur_materialNo)) {
          this.queryButton = true;
        } else {
          this.queryButton = false;
        }
      } else {
        this.queryButton = false;
      }
    }
    else if (this.subject === 'downloadRowdata' && (this.selectItem.cur_site && this.selectItem.cur_plant && this.selectItem.cur_productCate && this.selectItem.cur_customer
      && this.selectItem.cur_vendor && this.selectItem.cur_model && this.selectItem.cur_proName && this.selectItem.cur_materialNo && (this.datefroms || this.selectItem.date_from)) ) {
      this.queryButton = false;
    }
    else if ((this.subject === 'testItem' || this.subject === 'downloadRowdata') && (this.selectItem.cur_site && this.selectItem.cur_plant && this.selectItem.cur_productCate && this.selectItem.cur_customer &&
      this.selectItem.cur_vendor && this.selectItem.cur_model && this.selectItem.cur_proName && this.selectItem.cur_materialNo && (this.datefroms || this.selectItem.date_from)) ) {
        this.queryButton = false;
    } else {
      this.queryButton = true;
    }
  }

  query() {
    // 记录查询记录
    // const selectItem = {'cur_site': this.selectItem.cur_site, 'cur_factory': this.selectItem.cur_plant, 'cur_productCate': this.selectItem.cur_productCate,
    // 'cur_customer': this.selectItem.cur_customer, 'cur_searchBy': this.selectItem.cur_searchBy, 'cur_model': this.selectItem.cur_model, 'cur_factoryUser': this.selectItem.cur_vendor,
    // 'cur_proName': this.selectItem.cur_proName, 'cur_materialNo': this.selectItem.cur_materialNo, 'date_from': this.selectItem.date_from, 'date_to': this.selectItem.date_to};
    setSelectLocal(this.subject, this.selectItem);
    console.log('查询条件--- \n', this.selectItem);
    this.queryOps.emit(this.selectItem);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.$destroy.next();
    // this.$destroy.complete();
  }

}
