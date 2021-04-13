import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { MrrDocSelectService } from 'app/mrr/doc/mrr-doc-select.service';
import { MrrDocAuthQuery, MrrDocAuthAdd, MrrDocAuthEdit } from './mrr-doc-auth';
import { MrrDocAuthService } from './mrr-doc-auth.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
@Component({
  selector: 'app-mrr-doc-auth',
  templateUrl: './mrr-doc-auth.component.html',
  styleUrls: ['./mrr-doc-auth.component.scss']
})
export class MrrDocAuthComponent implements OnInit, OnDestroy {
  objectKeys = Object.keys; // 方便遍歷 對象, 用於顯示
  querySelect = { ...MrrDocAuthQuery }; // 下拉框選項

  tableFlag = false; // 表格顯示標誌
  dataSet = [];
  actionEnabled = true; // Action按钮是否可用 true 可用, false 不可用
  editCache = {}; // 是否为编辑状态, 暂存 false, true
  editSelect = { ...MrrDocAuthEdit }; // 編輯狀態下拉框取值

  docType = ''; // 方便記錄選擇的文件類別
  productType = ''; // 方便記錄選擇的產品類別
  plant = ''; // 方便記錄選擇的廠別
  memberList = []; // 存儲member以防止多次查詢數據庫 造成loading太重
  docTypes = [];
  addParam = {
    addBtnFlag: false, // 新增按鈕是否顯示
    isAddVisible: false, // 新增彈框是否顯示
    addSaveFlag: false, // 新增內容是否可以保存
    addContent: { ...MrrDocAuthAdd }, // 新增彈框中的內容
    addStage: [ // 新增彈框中對Stage的選擇
      { label: 'C3', value: 'C3', checked: false },
      { label: 'C4', value: 'C4', checked: false },
      { label: 'C5', value: 'C5', checked: false }
    ],
    addPICUnit: '' // 新增PIC單位
  };

  deleteParam = {
    isDeleteVisible: false,
    isAfterDeleteVisible: false,
    proDocID: ''
  };
  // i18n
  destroy$ = new Subject();

  trans;
  constructor(
    private mrrDocSelectService: MrrDocSelectService,
    private mrrDocAuthService: MrrDocAuthService,
    private message: NzMessageService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化I18N;
    this.translate.get(['dfq.dfq-plant', 'dfq.dfq-product', 'authority-maintain.file-category', 'mrr.document-docName-rule']).subscribe(res => {
      this.querySelect.plant.style.label = res['dfq.dfq-plant'];
      this.querySelect.productType.style.label = res['dfq.dfq-product'];
      this.querySelect.doc.style.label = res['authority-maintain.file-category'];
      this.trans = res['mrr.document-docName-rule'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.dfq-plant', 'dfq.dfq-product', 'dfq.dfq-cflow', 'authority-maintain.file-category', 'mrr.document-docName-rule']).subscribe(res => {
        this.querySelect.plant.style.label = res['dfq.dfq-plant'];
        this.querySelect.productType.style.label = res['dfq.dfq-product'];
        this.querySelect.doc.style.label = res['authority-maintain.file-category'];
        this.trans = res['mrr.document-docName-rule'];
      });
    });
    this.initPlantSelect();
    this.initDocSelect();
    this.getMemberList();
  }

  // 產品別下拉框
  initPlantSelect() {
    this.mrrDocSelectService.getPlant().subscribe(data => this.querySelect.plant.select.selectList = data);
    // 監聽下拉框的值改變
    const changePlantList = (plant?) => {
      return of(plant);
    };
    const plantList$: Observable<string[]> = this.querySelect.plant.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changePlantList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    plantList$.subscribe(datas => {
      this.querySelect.productType.select.selectList = [];
      this.productTypeSelect('productDocument', datas);
    });
  }

  // 產品別下拉框
  productTypeSelect(mrrModuleName, plant) {
    this.mrrDocSelectService.getProductType(mrrModuleName, plant).subscribe(data => this.querySelect.productType.select.selectList = data);
  }

  // 文件類別下拉框
  initDocSelect() {
    this.mrrDocSelectService.getDocTypeSelect().subscribe(data => {
      this.querySelect.doc.select.selectList = data;
      for (let index = 0; index < this.querySelect.doc.select.selectList.length; index++) {
        if (!this.docTypes.includes(this.querySelect.doc.select.selectList[index]['Label'])) {
          this.docTypes.push(this.querySelect.doc.select.selectList[index]['Label']);
        }
      }
    });
  }

  // 獲取MemberList
  getMemberList() {
    this.mrrDocAuthService.getMemberList().subscribe(datas => this.memberList = datas);
  }

  initEditSelect() {
    const search = {};
    for (const key in this.editSelect) {
      if (this.editSelect.hasOwnProperty(key)) {
        search[key] = {};
        search[key]['listFn'] = (user?) => {
          return of({ key: key, data: user });
        };
        search[key]['list$'] = this.editSelect[key].search$.asObservable().pipe(debounceTime(500)).pipe(switchMap(search[key]['listFn']));
        // 搜索相關查詢
        // 下拉框的值改變后，更改下一個下拉框中的值
        search[key]['list$'].subscribe(datas => {
          this.userSelect(datas.key, datas.data); // 改變的值
        });
        this.userSelect(key);
      }
    }
  }

  userSelect(key, user?) {
    this.editSelect[key]['list'] = [];
    for (let index = 0; index < this.memberList.length; index++) {
      const member = this.memberList[index];
      if (!user || (!!user && member.Label.toUpperCase().includes(user.toLocaleUpperCase())
        || member.Name.toUpperCase().includes(user.toLocaleUpperCase())
        || member.Value.toUpperCase().includes(user.toLocaleUpperCase()))) {
        this.editSelect[key]['list'].push(member);
      }
      if (this.editSelect[key]['list'].length === 10) {
        break;
      }
    }
  }

  // 查詢
  query() {
    this.dataSet = [];
    this.docType = '';
    this.productType = '';
    this.mrrDocAuthService.queryTable(this.querySelect.plant.value, this.querySelect.productType.value, this.querySelect.doc.value).then(datas => {
      this.dataSet = datas;
      this.tableFlag = true;
      this.addParam.addBtnFlag = true;
      const doc = this.querySelect.doc.select.selectList.find(docName => docName['Value'] === this.querySelect.doc.value);
      this.docType = doc['Label'];
      this.productType = this.querySelect.productType.value;
      this.plant = this.querySelect.plant.value;
      this.updateEditCache();
    });
    this.initEditSelect();
  }

  // 将编辑状态 初始化
  updateEditCache() {
    this.editCache = {};
    this.dataSet.forEach(item => {
      if (!this.editCache[item.proDocID]) {
        this.editCache[item.proDocID] = {
          edit: false,
          data: { ...item }
        };
      }
    });
  }

  // 下拉框
  selectChange(value, index, proDocID, key) {
    if (key === 'PIC') {
      if (value.length > 0) {
        const picRole = this.memberList.find(d => d.Value === (value.length > 1 && !value[0] ? value[1] : value[0]));
        this.dataSet[index]['PICUnit'] = picRole ? picRole.Role : '';
        this.editCache[proDocID].data['PICUnit'] = picRole ? picRole.Role : '';
      }
    }
  }

  // 點擊新增按鈕
  addBtn() {
    this.addParam.isAddVisible = true;
  }

  // 點擊新增保存按鈕
  add() {
    const fileName = this.addParam.addContent['docName']['value'];
    if (fileName.trim().toUpperCase().indexOf('BOM') !== -1 || this.docTypes.includes(fileName.trim())) {
      this.message.create('error', this.trans);
      this.addParam.addContent['docName']['value'] = '';
      return;
    }
    this.mrrDocAuthService.addSave(this.addParam.addContent, this.addParam.addStage, this.addParam.addPICUnit, this.productType, this.querySelect.plant.value, this.querySelect.doc.value).then(data => {
      this.message.create(data['flag'], data['msg']);
      this.query();
      this.cancelAdd();
    });
  }

  // 取消新增
  cancelAdd() {
    this.addParam.isAddVisible = false;
    this.addParam.addSaveFlag = false;
    this.addParam.addPICUnit = '';
    for (const key in this.addParam.addContent) {
      if (this.addParam.addContent.hasOwnProperty(key)) {
        this.addParam.addContent[key].value = '';

      }
    }
  }

  // 輸入框值改變
  addValueChange(value, key) {
    let flag = true;
    for (const keyContent in this.addParam.addContent) {
      if (this.addParam.addContent.hasOwnProperty(keyContent)) {
        const addContent = this.addParam.addContent[keyContent];
        if (addContent.redFlag) {
          flag = (flag && (!!addContent.value));
        }
      }
    }
    if (!this.productType || !this.docType) {
      flag = false;
    }
    this.addParam.addSaveFlag = flag;
    if (key === 'PIC') {
      if (value.length > 0) {
        const picRole = this.memberList.find(d => d.Value === value[0]);
        this.addParam.addPICUnit = picRole.Role;
      }
    }
  }

  // 開始編輯
  startEdit(proDocID) {
    this.editCache[proDocID].edit = true;
    this.actionEnabled = false;
    // 向下拉框中添加目前選中的人員
    for (const key in this.editSelect) {
      if (this.editSelect.hasOwnProperty(key)) {
        const member = this.memberList.find(data => data['Value'] === this.editCache[proDocID].data[key]);
        if (!!member) {
          this.editSelect[key].list.push(member);
        }
      }
    }
  }

  // 保存編輯信息
  saveEdit(proDocID) {
    const editCache = { ...this.editCache[proDocID].data };
    delete editCache['proDocID'];
    delete editCache['docName'];
    delete editCache['docID'];
    this.mrrDocAuthService.editSave(editCache, proDocID).subscribe(data => {
      this.message.create('success', 'Saved successfully！');
      this.cancelEdit(proDocID);
      this.query();
    }, error => {
      this.message.create('error', 'Save failed！');
      this.cancelEdit(proDocID);
    });
  }

  // 取消編輯
  cancelEdit(key) {
    this.editCache[key].edit = false;
    this.actionEnabled = true;
  }

  // 刪除
  deleteBtn(proDocID) {
    this.deleteParam.isDeleteVisible = true;
    this.deleteParam.proDocID = proDocID;
  }

  // 取消刪除
  cancelDelete(event: EventEmitter<boolean>) {
    if (event) {
      this.deleteParam.isDeleteVisible = false;
      this.deleteParam.proDocID = '';
    }
  }

  // 確認刪除
  delete(event: EventEmitter<boolean>) {
    if (event) {
      this.mrrDocAuthService.delete(this.deleteParam.proDocID).subscribe(data => {
        this.deleteParam.isAfterDeleteVisible = true;
        setTimeout(() => {
          this.deleteParam.isAfterDeleteVisible = false;
        }, 1000);
        this.deleteParam.isDeleteVisible = false;
        this.deleteParam.proDocID = '';
        this.query();
      }, error => {
        this.message.create('error', error['message']);
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
