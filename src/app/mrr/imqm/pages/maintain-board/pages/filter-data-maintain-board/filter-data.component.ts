import { async } from '@angular/core/testing';
import { ImqmSelectService } from './../../../../imqm-common/component/imqm-select/imqm-select.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FilterDataService } from './filter-data.service';
import { SelectItems } from './../../../../imqm-common/toolKits/model';
import { getSelectLocal } from 'app/mrr/imqm/imqm-common/toolKits/autoSelect';
import { NzMessageService, NzI18nService, zh_TW, en_US } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToolkitService } from '../../../../imqm-common/service';
@Component({
  selector: 'app-filter-data',
  templateUrl: './filter-data.component.html',
  styleUrls: ['./filter-data.component.scss']
})
export class FilterDataComponent implements OnInit {

  //传给子组件
  subject = 'filtermaintaindata';
  require = false;

  selectItems: SelectItems;
  filterDataList: any[] = [];
  //选中数据的id
  selectId: any[] = [];

  isAuthDel = false;//删除权限
  trans = {};

  operating = false; //批量删除操作
  allChecked = false;
  disabledButton = true;
  checkedNumber = 0;
  indeterminate = false;

  site = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['site'];
  plant = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant'];
  userid = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['number'];
  destroy$ = new Subject();

  isModalVisible = false;
  add_site;
  add_plant;
  add_productCate;
  add_customer;
  add_model;
  add_vendor;
  add_proName;
  add_materialNo;
  add_barcode;
  add_switchValue;
  siteGroup = [];
  plantGroup = []
  queryButton = true;

  all_switchValue = false;
  allSwitchTranslate1;
  allSwitchTranslate2;
  constructor(
    private translate: TranslateService,
    private nzI18nService: NzI18nService,
    private toolkitService: ToolkitService,
    private messageService: NzMessageService,
    private _service: FilterDataService,
    private service: ImqmSelectService
  ) {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.translate.get(['imq-mt-successDel', 'imq-mt-failDel', 'imq-mt-delDataIsNull', 'imq-mt-failAdd', 'imq-hasData', 'imq-allSwitch1', 'imq-allSwitch2']).subscribe(res => {
        this.trans['successDel'] = res['imq-mt-successDel'];
        this.trans['failDel'] = res['imq-mt-failDel'];
        this.trans['delDataIsNull'] = res['imq-mt-delDataIsNull'];
        this.trans['failAdd'] = res['imq-mt-failAdd'];
        this.trans['has'] = res['imq-hasData'];
        this.trans['on'] = res['imq-allSwitch2'];
        this.trans['off'] = res['imq-allSwitch1']
        if (lang.lang === 'en') {
          this.nzI18nService.setLocale(en_US);
        } else {
          this.nzI18nService.setLocale(zh_TW);
        }
        this.ngOnInit();
      });
    });
  }

  ngOnInit() {
    this.translate.get(['imq-mt-successDel', 'imq-mt-failDel', 'imq-mt-delDataIsNull', 'imq-mt-failAdd', 'imq-hasData', 'imq-allSwitch1', 'imq-allSwitch2']).subscribe(res => {
      this.trans['successDel'] = res['imq-mt-successDel'];
      this.trans['failDel'] = res['imq-mt-failDel'];
      this.trans['delDataIsNull'] = res['imq-mt-delDataIsNull'];
      this.trans['failAdd'] = res['imq-mt-failAdd'];
      this.trans['has'] = res['imq-hasData'];
      this.trans['on'] = res['imq-allSwitch2'];
      this.trans['off'] = res['imq-allSwitch1']
      //获取子组件上一次筛选栏位值筛选数据进行初始化显示
      // const lastSelectItem = getSelectLocal(this.subject);
      // console.log(lastSelectItem);
      // if (lastSelectItem) {
      //   this.query(lastSelectItem[this.subject]);
      // };
      const roles = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['29'];
      this.isAuthDel = roles['delete'];
      //初始化根据用户的site和plant显示资料
      this.filterDataList = [];
      this._service.getFilterDataByUserinfo(this.site, this.plant).subscribe(res => {
        this.allOpen(res);
        this.filterDataList = res;
      })
    });
  }

  // 判断全选switch是否全部打开
  allOpen(res) {
    if (res.filter(item => item['isBarcode'] === 0)['length'] === 0) {
      this.all_switchValue = true;
    } else {
      this.all_switchValue = false;
    }
  }

  async query(params) {
    if (params) {
      this.selectItems = params;
      let searchCondition;

      searchCondition = {
        where: {
          and: [
            { site: this.selectItems.cur_site },
            { plant: this.selectItems.cur_plant },
            { product: this.selectItems.cur_productCate },
            { customer: this.selectItems.cur_customer, },
            { model: this.selectItems.cur_model },
            { vendor: this.selectItems.cur_vendor },
            { productName: this.selectItems.cur_proName },
            { partNumber: this.selectItems.cur_materialNo }
          ]
        }
      };

      this._service.getFilterDataBySearch(searchCondition)
        .subscribe(res => {
          this.allOpen(res);
          this.filterDataList = res;
        });
    }
  }

  public deleteData(id?) {
    let uId = this.userid; //当前登录用户的id
    this.selectId = [];
    let result;

    if (id) {   //点击删除图标时
      this.selectId.push(id)
    } else {    //选择多条数据时
      this.filterDataList.forEach(data => {
        if (data.checked === true) {
          this.selectId.push(data.id)
        }
      });
    }
    // let idString;
    // idString=this.selectId.toString();
    if (this.selectId.length === 0) {
      this.messageService.create('warning', this.trans['failDel']);
    } else {
      result = this._service.deleteMaintainDataById(this.selectId, uId);
      if (result) {
        this.selectId.forEach(key => {
          this.filterDataList = this.filterDataList.filter(item => item.id !== key);
        });
        this.messageService.create('success', this.trans['successDel']);
        this.refreshStatus();
      } else {
        this.messageService.create('warning', this.trans['failDel']);
      }
    }

  }

  refreshStatus(): void {
    const allChecked = this.filterDataList.every(value => value.checked === true);
    const allUnChecked = this.filterDataList.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.filterDataList.some(value => value.checked);
    this.checkedNumber = this.filterDataList.filter(value => value.checked).length;
    this.allOpen(this.filterDataList);
  }

  //全选
  checkAll(value: boolean): void {
    this.filterDataList.forEach(data => data.checked = value);
    this.refreshStatus();
  }

  currentPageDataChange($event): void {
    this.filterDataList = $event;
  }


  // Modal按下Cancel按鈕後的事件
  handleModalCancel(): void {
    this.isModalVisible = false;
  }


  add() {
    this.isModalVisible = true;
    const sitePlantDic = JSON.parse(localStorage.getItem('$IMQM$SitePlan'));
    this.siteGroup = Object.keys(sitePlantDic);

    // //  初始化数据
    // this.add_site = undefined;
    // this.add_plant = undefined;
    // this.add_productCate = undefined;
    // this.add_customer = undefined;
    // this.add_model = undefined;
    // this.add_vendor = undefined;
    // this.add_proName = undefined;
    // this.add_materialNo = undefined;
    // this.add_barcode = false;
  }

  selectItem(item) {
    if (item === 'site') {
      this.service.getSelectDatas(this.toolkitService.assembleSelectObject(this.add_site)).subscribe(res => {
        this.plantGroup = res['plant'];
      });
    }
    this.btnCanClick();
  }

  addInput(data) {
    this.btnCanClick();
  }

  btnCanClick() {
    if (this.add_site && this.add_plant && this.add_productCate && this.add_customer && this.add_model && this.add_vendor && this.add_proName && this.add_materialNo) {
      if (this.add_productCate.trim() && this.add_customer.trim() && this.add_model.trim() && this.add_vendor.trim() && this.add_proName.trim() && this.add_materialNo.trim()) {
        this.queryButton = false;
      } else {
        this.queryButton = true;
      }
    } else {
      this.queryButton = true;
    }
  }

  addSwitchValue(data) {
    // console.log('switch = \n', data)
  }


  handleModalOk() {
    if (this.add_site && this.add_plant && this.add_productCate && this.add_customer && this.add_model && this.add_vendor && this.add_proName && this.add_materialNo) {
      if (this.add_productCate.trim() && this.add_customer.trim() && this.add_model.trim() && this.add_vendor.trim() && this.add_proName.trim() && this.add_materialNo.trim()) {
        const data = {
          site: this.add_site,
          plant: this.add_plant,
          product: this.add_productCate.trim(),
          customer: this.add_customer.trim(),
          model: this.add_model.trim(),
          vendor: this.add_vendor.trim(),
          productName: this.add_proName.trim(),
          partNumber: this.add_materialNo.trim(),
          isBarcode: this.add_switchValue ? 1 : 0,
          updatedUser: localStorage.getItem('$DFI$userID'),
          updatedTime: new Date().getTime(),
          id: 'menu_' + new Date().getTime()
        }

        // 检测数据库中是否存在当前新增的数据
        const searchCondition = {
          where: {
            and: [
              { site: data.site },
              { plant: data.plant },
              { product: data.product },
              { customer: data.customer },
              { model: data.model },
              { vendor: data.vendor },
              { productName: data.productName },
              { partNumber: data.partNumber }
            ]
          }
        };

        this._service.getFilterDataBySearch(searchCondition)
          .subscribe(async res => {
            if (res['length'] === 0) {
              const newData = await this._service.addOneData(data);
              // console.log(newData)
              if (newData) {
                // 数据新增成功
                this.allOpen([newData])
                this.filterDataList = [newData];
              } else {
                // 数据新增失败
                this.messageService.create('error', this.trans['failAdd']);
              }

              this.isModalVisible = false;
            } else {
              // 数据已存在
              this.messageService.create('error', this.trans['has']);
              this.isModalVisible = false;
            }
          });
      }
    }
  }

  async allSwitchValue(data) {
    if (data) {
      // 全部打开
      for (const item of this.filterDataList) {
        item['isBarcode'] = 1;
      }
    } else {
      // 全部关闭
      for (const item of this.filterDataList) {
        item['isBarcode'] = 0;
      }
    }
    await this._service.updateMany(this.filterDataList);
  }

   switchValue(data, key) {
    const updateData = {
      customer: data['customer'],
      id: data['id'],
      isBarcode: data['isBarcode'] ? 1 : 0,
      model: data['model'],
      partNumber: data['partNumber'],
      plant: data['plant'],
      product: data['product'],
      productName: data['productName'],
      site: data['site'],
      updatedTime: new Date().getTime(),
      updatedUser: localStorage.getItem('$DFI$userID'),
      vendor: data['vendor']
    }
    this._service.updateData(updateData).subscribe(result => {
      console.log(result);
      // 找到更改的数据
      this.filterDataList[key]['isBarcode'] = data['isBarcode'] ? 1 : 0;
      this.allOpen(this.filterDataList);
    });
  }

}
