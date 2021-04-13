import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToolkitService } from '../../../../../imqm-common/service';
import { WistronMaintainService } from './wistron-maintain.service';
import { NzMessageService, NzI18nService, zh_TW, en_US } from 'ng-zorro-antd';
import { AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-wistron-maintain',
  templateUrl: './wistron-maintain.component.html',
  styleUrls: ['./wistron-maintain.component.scss']
})
export class WistronMaintainComponent implements OnInit, OnDestroy {

  cur_model;
  cur_partNo;
  cur_site;
  cur_plant;
  new_site;
  new_plant;
  new_model;
  new_partNo;
  new_mail;
  siteGroup;
  plantGroup;
  modelGroup;
  partNoGroup;
  mailGroup = [];
  mailFilteredOptions = []; // 邮件地址autocompelete
  wistronMailList: any[] = [];
  queryButton = true;
  isVisible = false;

  isAuthEdit = false; // 操作权限
  isAuthCreate = false;
  isAuthDel = false;
  isAllAuth = false;
  modalFooter = null;

   // 新增郵件
   validateForm: FormGroup;
   controlArray: Array<{ id: number, controlInstance: string }> = [];

  site = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['site'];
  plant = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant'];

  i = 1;
  editCache = {};

  trans = {};
  destroy$ = new Subject();
  sitePlantDic = {};

  constructor(
    private _service: WistronMaintainService,
    private toolKits: ToolkitService,
    private messageService: NzMessageService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private nzI18nService: NzI18nService
    ) {
      this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(lang => {
        this.translate.get(['imq-mt-incompleteInfo', 'imq-mt-dataDuplicate', 'imq-mt-failModify', 'imq-mt-successModify']).subscribe(res => {
          this.trans['incompleteInfo'] = res['imq-mt-incompleteInfo'];
          this.trans['dataDuplicate'] = res['imq-mt-dataDuplicate'];
          this.trans['failModify'] = res['imq-mt-failModify'];
          this.trans['successModify'] = res['imq-mt-successModify'];
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
    this.translate.get(['imq-mt-incompleteInfo', 'imq-mt-dataDuplicate', 'imq-mt-failModify', 'imq-mt-successModify']).subscribe(ress => {
      this.trans['incompleteInfo'] = ress['imq-mt-incompleteInfo'];
      this.trans['dataDuplicate'] = ress['imq-mt-dataDuplicate'];
      this.trans['failModify'] = ress['imq-mt-failModify'];
      this.trans['successModify'] = ress['imq-mt-successModify'];
      const roles = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['9'];
      const allRole = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['26'];
      this.isAuthEdit = roles['edit'];
      this.isAuthCreate = roles['create'];
      this.isAuthDel = roles['delete'];
      this.isAllAuth = allRole['read'];
      // if (this.isAllAuth) {
      //   this._service.getSelectList({}).subscribe(res => {
      //     this.siteGroup = res['site'];
      //   });
      // } else {
      //   this._service.getSelectList({site: this.site, plant: this.plant}).subscribe(res => {
      //     this.siteGroup = res['site'];
      //     this.plantGroup = res['plant'];
      //     this.modelGroup = res['model'];
      //   });
      // }
      this.sitePlantDic = JSON.parse(localStorage.getItem('$IMQM$SitePlan'));
      this.siteGroup = Object.keys(this.sitePlantDic);

      this.validateForm = this.fb.group({
        model: [''],
        partNumber: [''],
        plant: [''],
        site: [''],
        email: this.fb.group({})
      });
    });
  }

  getOptions(type, value?) {
    if (type === 'cur_site') {
      // this._service.getSelectList(this.toolKits.assembleSelectObject(this.cur_site, undefined, undefined, undefined, undefined)).subscribe(res => {
      //   this.plantGroup = res['plant'];
      // });
      this.plantGroup = this.sitePlantDic[this.cur_site];

      this.cur_plant = undefined;
      this.cur_model = undefined;
      this.cur_partNo = undefined;
    }
    if (type === 'cur_plant') {
      this._service.getSelectList(this.toolKits.assembleSelectObject(this.cur_site, this.cur_plant, undefined, undefined, undefined)).subscribe(res => {
        this.modelGroup = res['model'];
      });
      this.cur_model = undefined;
      this.cur_partNo = undefined;
    }
    if (type === 'cur_model') {
      this._service.getSelectList(this.toolKits.assembleSelectObject(this.cur_site ? this.cur_site : this.site,
        this.cur_plant ? this.cur_plant : this.plant, undefined, undefined, this.cur_model)).subscribe(res => {
        this.partNoGroup = res['partNumber'];
      });
      this.cur_partNo = undefined;
    }
    // if (type === 'new_site') {
    //   this._service.getSelectList(this.toolKits.assembleSelectObject(this.new_site, undefined, undefined, undefined, undefined,
    //     undefined)).subscribe(res => {
    //       this.plantGroup = res['plant'];
    //     });
    //     this.new_plant = undefined;
    //     this.new_partNo = undefined;
    //     this.new_model = undefined;
    //     this.new_mail = undefined;
    // }
    // if (type === 'new_plant') {
    //   this._service.getSelectList(this.toolKits.assembleSelectObject(this.new_site, this.new_plant, undefined, undefined, undefined,
    //     undefined)).subscribe(res => {
    //       this.modelGroup = res['model'];
    //     });
    //     this._service.getMailGroup(this.new_site, this.new_plant).subscribe(mail => {
    //       this.mailGroup = Array.from(new Set(mail));
    //       this.mailFilteredOptions = this.mailGroup;
    //       console.log(mail);
    //     });
    //     this.new_partNo = undefined;
    //     this.new_model = undefined;
    //     this.new_mail = undefined;
    // }
    // if (type === 'new_model') {
    //   this._service.getSelectList(this.toolKits.assembleSelectObject(this.new_site ? this.new_site : this.site,
    //     this.new_plant ? this.new_plant : this.plant, undefined, undefined, this.new_model)).subscribe(res => {
    //     this.partNoGroup = res['partNumber'];
    //   });
    //   this.new_partNo = undefined;
    // }
    // if (this.cur_model) {
    //   this.queryButton = false;
    // } else {
    //   this.queryButton = true;
    // }
    switch (type) {
      case 'site':
      this._service.getSelectList(this.toolKits.assembleSelectObject(this.validateForm.get('site').value, undefined, undefined, undefined, undefined,
          undefined)).subscribe(res => {
            this.plantGroup = res['plant'];
      });
      this.validateForm.get('plant').setValue(undefined);
      this.validateForm.get('model').setValue(undefined);
      this.validateForm.get('partNumber').setValue(undefined);
      break;
    case 'plant':
      this._service.getSelectList(this.toolKits.assembleSelectObject(this.validateForm.get('site').value,
      this.validateForm.get('plant').value, undefined, undefined, undefined,
      undefined)).subscribe(res => {
          this.modelGroup = res['model'];
      });
      this._service.getMailGroup(this.new_site, this.new_plant).subscribe(mail => {
        this.mailGroup = Array.from(new Set(mail));
        this.mailFilteredOptions = this.mailGroup;
        console.log(mail);
      });
      this.validateForm.get('model').setValue(undefined);
      this.validateForm.get('partNumber').setValue(undefined);
      break;
    case 'model':
      this._service.getSelectList(this.toolKits.assembleSelectObject(this.validateForm.get('site').value ? this.validateForm.get('site').value : this.site,
      this.validateForm.get('plant').value ? this.validateForm.get('plant').value : this.plant,
      undefined, undefined, this.validateForm.get('model').value)).subscribe(res => {
          this.partNoGroup = res['partNumber'];
      });
      this.validateForm.get('partNumber').setValue(undefined);
      break;
    default:
      break;
    }
     if (this.cur_model) {
      this.queryButton = false;
    } else {
      this.queryButton = true;
    }
  }

  query() {
    this._service.getMailMaintainData({site: this.site, type: 'wistron', plant: this.plant, model: this.cur_model,
    partNumber: this.cur_partNo ? this.cur_partNo : undefined}).subscribe(res => {
      this.wistronMailList = res;
      console.log(this.wistronMailList);
      if (this.wistronMailList) {
        this.updateEditCache(this.wistronMailList);
      }
    });
  }

  startEdit(key): void {
    this.editCache[ key ].edit = true;
  }


  cancelEdit(key): void {
    this.editCache[ key ].edit = false;
  }

  saveEdit(key): void {
    const index = this.wistronMailList.findIndex(item => item.id === key);
    this._service.updateMailData(this.editCache[ key ].data).subscribe(res => {
      if (res) {
        this.wistronMailList[ index ] = this.editCache[ key ].data;
        this.messageService.create('success', this.trans['successModify']);
      } else {
        this.messageService.create('error', this.trans['failModify']);
      }
    });
    this.editCache[ key ].edit = false;
  }

  sureDelete(id) {
    // 執行刪除
    if (id) {
      this._service.deleteMailData(id);
      this.wistronMailList = this.wistronMailList.filter(item => item.id !== id);
    }
  }

  updateEditCache(dataSet: any[]): void {
    dataSet.forEach(item => {
      if (!this.editCache[ item.id ]) {
        this.editCache[ item.id ] = {
          edit: false,
          data: item
        };
      }
    });
  }

  showModal(): void {
    this.isVisible = true;
    this.addField();
  }

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = (this.controlArray.length > 0) ? this.controlArray[ this.controlArray.length - 1 ].id + 1 : 0;

    const control = {
      id,
      controlInstance: `mail${id}`
    };
    const index = this.controlArray.push(control);
    console.log(this.controlArray[ this.controlArray.length - 1 ]);
    // this.validateForm.get('email').addControl();
    this.mailForm.addControl(this.controlArray[ index - 1 ].controlInstance, new FormControl(null, Validators.required));
    // this.validateForm.addControl();
  }

  get mailForm() {
    return this.validateForm.get('email') as FormGroup;
  }

  removeField(i: { id: number, controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.controlArray.length > 1) {
      const index = this.controlArray.indexOf(i);
      this.controlArray.splice(index, 1);
      console.log(this.controlArray);
      this.mailForm.removeControl(i.controlInstance);
    }
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[ i ].markAsDirty();
        this.validateForm.controls[ i ].updateValueAndValidity();
      }
    }
    // 將郵件轉化成數組
    let mails = Object.keys(this.validateForm.get('email').value).map(key => this.validateForm.get('email').value[key]);
    console.log(mails); // 郵件數組
    mails = Array.from(new Set(this.toolKits.flattenArray(mails)));
    this.handleOk(this.validateForm.get('site').value, this.validateForm.get('plant').value, this.validateForm.get('model').value,
    this.validateForm.get('partNumber').value, mails);
  }


  async handleOk(site?, plant?, model?, partNo?, mails?: string[]) {
  if ((mails || mails.length > 0) && model && site && plant) {
      this.isVisible = false;
      const maillist = [];
      for (let i = 0; i < mails.length; i++) {
        const obj = {
          'eMail': mails[i],
          'id': '',
          'model': model,
          'partNumber': partNo ? partNo : null,
          'plant': plant,
          'site': site,
          'type': 'wistron',
          'vendor': null
    };
    // 检查是否重复
    const item = await this._service.checkDuplicate(obj);
      if (item.length > 0) {
        this.messageService.create('error', this.trans['dataDuplicate']);
        return;
      } else {
        maillist.push(obj);
      }
   }
   this._service.addNewMailSets(maillist).subscribe(res => {
    this.wistronMailList = this.wistronMailList.concat(res);
    this.updateEditCache(this.wistronMailList);
  });
  } else {
   this.messageService.create('error', this.trans['incompleteInfo']);
  }
}

  handleCancel(): void {
    this.isVisible = false;
  }

  onInput(value: string): void {
    this.mailFilteredOptions = this.mailGroup
    .filter(option => option.toLowerCase().indexOf(value.toLowerCase()) === 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
 }

}
