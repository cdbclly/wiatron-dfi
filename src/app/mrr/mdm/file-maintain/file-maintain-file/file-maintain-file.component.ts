import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder } from '@angular/forms';
import { VendorDocumentApi, PartNumberVendorFileApi, VendorProductDocumentApi, VendorDocumentSubCategoryApi, VendorDocumentCategoryApi } from '@service/mrr-sdk';
import * as moment from 'moment';
// MRR SDK
import { LoopBackConfig as NUDDLoopBackConfig } from '@service/mrr-sdk';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-file-maintain-file',
  templateUrl: './file-maintain-file.component.html',
  styleUrls: ['./file-maintain-file.component.scss']
})

export class FileMaintainFileComponent implements OnInit {
  validateForm: FormGroup;
  isSearchLoading = false; // 查詢按鈕的加載
  addOneFlag = false;  // 是否顯示新增model
  addFileName; // 新增的文件名
  isUpdateFileName = false;  // 是否可以修改該文件名
  editCache = {};  // 編輯狀態
  allListOptions = []; // 所有options
  fileSelectArr = []; // 搜索出來的options
  allOfData = [];  // 資料庫所有數據
  diasplayDatas = []; // 頁面綁定顯示的數據
  disabledData = []; // 除編輯狀態之外的其他數據
  // isDisplayContent = false;  // 數據處理結束再顯示table
  vendorDocumentCategory;  // 大分類下拉框
  vendorDocumentSubCategory; // 小分類下拉框
  allVendorDocumentSubCategory; // 所有小件分類
  addFirstCategory; // 新增的大分類
  addSecondCategory; // 新增的小分類
  confirmLoading;  // 新增按鈕的加載
  filterOption = () => true;
  transNotice = {};
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private vendorDocumentApi: VendorDocumentApi,
    private vendorProductDocumentApi: VendorProductDocumentApi,
    private partNumberVendorFileApi: PartNumberVendorFileApi,
    private vendorDocumentCategoryApi: VendorDocumentCategoryApi,
    private vendorDocumentSubCategoryApi: VendorDocumentSubCategoryApi,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.vendor-sop-name', 'mrr.vendor-select-must', 'mrr.vendor-exit-notice']).subscribe(res => {
      this.transNotice['sopName'] = res['mrr.vendor-sop-name'];
      this.transNotice['must'] = res['mrr.vendor-select-must'];
      this.transNotice['exitNotice'] = res['mrr.vendor-exit-notice'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.vendor-sop-name', 'mrr.vendor-select-must', 'mrr.vendor-exit-notice']).subscribe(res => {
        this.transNotice['sopName'] = res['mrr.vendor-sop-name'];
        this.transNotice['must'] = res['mrr.vendor-select-must'];
        this.transNotice['exitNotice'] = res['mrr.vendor-exit-notice'];
      });
    });
    this.validateForm = this.fb.group({
      fileName: [null],
    });
    this.getAllFiles();
  }

  // 如果不by文件名查詢，便默認顯示所有
  getAllFiles() {
    this.allListOptions = [];
    this.fileSelectArr = [];
    const fileArr = [];
    this.vendorDocumentCategoryApi.find().subscribe(res => {
      this.vendorDocumentSubCategoryApi.find().subscribe(ree => {
        this.vendorDocumentCategory = res;
        this.allVendorDocumentSubCategory = ree;
        this.vendorDocumentApi.getAllByName(this.validateForm.value.fileName).subscribe(res => {
          res.data.sort(this.sortByFileName);
          this.diasplayDatas = res.data;
          for (const data of this.diasplayDatas) {
            // 大分類顯示
            for (const category1 of this.vendorDocumentCategory) {
              if (data.vendorDocumentCategoryId === category1.id) {
                data['vendorDocumentCategoryName'] = category1.name;
              }
            }
            // 小分類顯示
            for (const category2 of this.allVendorDocumentSubCategory) {
              if (data.vendorDocumentSubCategoryId === category2.id) {
                data['vendorDocumentSubCategoryName'] = category2.name;
              }
            }
            data['edit'] = false;  // 初始化都能編輯
            data['isSwitchDisabled'] = true;  // 初始化禁用所有開關按鈕
            data['isEditDisabled'] = false; // 初始化都可以點選編輯按鈕
            data['isFileIuputDisabled'] = false; // 初始化都可以點選編輯按鈕
            data['createdDate'] = moment(new Date(data['createdDate'])).format('YYYY-MM-DD');  // 新增日期
            data['createUser'] = data['createdBy'] + ' : ' + data['site'] + ' : ' + data['userName'];  // 新增人員
            fileArr.push(data.name);
          }
          // 如果已經有上傳的資料，則不允許修改文件名
          this.partNumberVendorFileApi.find({
            where:
              { documentName: { inq: fileArr } }
          }).subscribe(res => {
            res.sort(this.sortByDocumentName);
            for (const data1 of this.diasplayDatas) {
              this.allListOptions.push(data1.name);   // 下拉選單所有options獲取
              this.fileSelectArr = this.allListOptions;
              for (const data2 of res) {
                if (data1['name'] === data2['documentName']) {
                  if (data2['path'] && data2['fileName']) {
                    data1['isFileIuputDisabled'] = true;
                  }
                }
              }
            }
            this.allOfData = this.diasplayDatas;
          });
        });
      });
    });
  }

  // 按DocumentName排序
  sortByDocumentName(a, b) {
    if (a['documentName'] > b['documentName']) {
      return 1;
    } else if (a['documentName'] < b['documentName']) {
      return -1;
    } else {
      return 0;
    }
  }

  sortByFileName(a, b) {
    if (a['name'] > b['name']) {
      return 1;
    } else if (a['name'] < b['name']) {
      return -1;
    } else {
      return 0;
    }
  }

  // 大分類變化，獲取小分類
  firstCategoryChange(id) {
    this.vendorDocumentSubCategoryApi.find({ where: { categoryId: id } }).subscribe(res => {
      this.vendorDocumentSubCategory = res;
    });
  }


  search(inputValue) {
    const reg = new RegExp(inputValue);
    const arr = [];
    for (let i = 0; i < this.allListOptions.length; i++) {
      if (reg.test(this.allListOptions[i])) {
        arr.push(this.allListOptions[i]);
      }
    }
    if (arr.length > 1) {
      arr.unshift('All');
    }
    this.fileSelectArr = arr;
  }

  selcetOption(option) {
    if (option[0] === 'All') {
      this.fileSelectArr = this.fileSelectArr.filter(a => a !== 'All');
      this.validateForm.controls['fileName'].setValue(this.fileSelectArr);
    }
  }

  // 查詢
  query() {
    const inputFileName = this.validateForm.value.fileName;
    if (!inputFileName) {
      this.diasplayDatas = this.allOfData;
    } else {
      const filterListData = [];
      this.allOfData.forEach(item => {
        if (inputFileName.includes(item.name)) {
          filterListData.push(item);
        }
      });
      this.diasplayDatas = filterListData;
      for (const d of this.diasplayDatas) {
        d['isSwitchDisabled'] = true;  // 初始化禁用所有開關按鈕
        d['isEditDisabled'] = false; // 初始化都可以點選編輯按鈕
      }
    }
  }

  // 新增
  addFile() {
    this.addOneFlag = true;
    this.addFileName = null;
    this.addFirstCategory = null;
    this.addSecondCategory = null;
  }

  // 確認新增
  addOne() {
    this.confirmLoading = true;
    let addFile = {};
    const date = new Date();
    const userId = localStorage.getItem('$DFI$userID');
    const isRepeat = this.allOfData.some(s => s.name === this.addFileName.trim());
    const plantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
    const whichSite = localStorage.getItem('DFC_Site');
    const whichPlant = localStorage.getItem('DFC_Plant');
    let whichPlantName;
    for (const list of plantMapping) {
      if (whichPlant === list['Plant']) {
        whichPlantName = list['PlantName'];
      }
    }
    // 查詢所有文件,如果添加文件名存在，則不重複添加
    if (!this.addFileName || !this.addFirstCategory) {
      this.message.create('error', this.transNotice['must']);
      this.confirmLoading = false;
      return;
    } else if (isRepeat === true) {
      this.message.create('error', `${this.addFileName}${this.transNotice['exitNotice']}`);
      this.confirmLoading = false;
      return;
    } else {
      addFile = {
        name: this.addFileName.trim(),
        isEnable: true,
        userName: localStorage.getItem('$DFI$userName'),
        site: localStorage.getItem('DFC_Site'),
        vendorDocumentCategoryId: this.addFirstCategory,
        vendorDocumentSubCategoryId: this.addSecondCategory,
        createdBy: userId,
        createdDate: date
      };
      const vendorDocumentCategoryName = this.vendorDocumentCategory.filter(a => a.id === this.addFirstCategory);
      const vendorDocumentSubCategoryName = this.vendorDocumentSubCategory.filter(a => a.id === this.addSecondCategory);
      this.vendorDocumentApi.addNewDocument(addFile).subscribe(res => {
        this.vendorProductDocumentApi.find({ where: { vendorDocumentId: res.data.id } }).subscribe(ree => {
          // 新增的文件，只有對應plant的pass為false,其餘為true
          let splant;
          let plantId;
          for (const data of ree) {
            if (whichSite === data['plant']) {
              splant = whichSite;
              plantId = data['id'];
            } else if (whichPlantName === data['plant']) {
              splant = whichPlantName;
              plantId = data['id'];
            }
          }
          const newData = ree.filter(a => a['id'] !== plantId);
          for (const list of newData) {
            const updateData = {
              id: list['id'],
              vendorDocumentId: list['vendorDocumentId'],
              plant: list['plant'],
              bg: list['bg'],
              pass: 1,
            };
            this.vendorProductDocumentApi.upsert(updateData).subscribe();
          }
          res.data['createdDate'] = moment(res.data['createdDate']).format('YYYY-MM-DD');
          res.data['createUser'] = res.data['createdBy'] + ' : ' + res.data['site'] + ' : ' + res.data['userName'];
          res.data['isSwitchDisabled'] = true;
          res.data['isEditDisabled'] = false;
          res.data['vendorDocumentCategoryId'] = this.addFirstCategory;
          res.data['vendorDocumentSubCategoryId'] = this.addSecondCategory;
          res.data['vendorDocumentCategoryName'] = vendorDocumentCategoryName[0].name;
          if (vendorDocumentSubCategoryName.length === 0) {
            res.data['vendorDocumentSubCategoryName'] = null;
          } else {
            res.data['vendorDocumentSubCategoryName'] = vendorDocumentSubCategoryName[0].name;
          }
          res['edit'] = false;
          this.diasplayDatas.push(res.data);
          this.diasplayDatas = this.diasplayDatas.slice();
          this.allOfData = this.diasplayDatas;
          this.confirmLoading = false;
          this.fileSelectArr.push(this.addFileName);   // 新增文件名放進搜索下拉框
          this.message.create('success', 'Added successfully！');
          this.addOneFlag = false;
        });
      });
    }
  }

  // 取消新增
  cancelAddOne() {
    this.addOneFlag = false;
  }

  // 開始編輯
  startEdit(data) {
    data.edit = true;
    data.isSwitchDisabled = false;
    this.disabledData = this.diasplayDatas.filter(a => a !== data);
    for (const item of this.disabledData) {
      item.isEditDisabled = true;
    }
  }

  // 保存編輯
  saveEdit(data) {
    const date = new Date();
    const userId = localStorage.getItem('$DFI$userID');
    const index = this.diasplayDatas.findIndex(item => item.id === data.id);
    for (const item of this.disabledData) {
      item.isEditDisabled = false;
    }  // 將非編輯狀態的編輯按鈕禁用
    data.edit = false;
    data.isSwitchDisabled = true;
    Object.assign(this.diasplayDatas[index], data);
    const updateData = {
      id: data.id,
      name: data.name,
      isEnable: data.isEnable,
      site: data.site,
      userName: data.userName,
      vendorDocumentSubCategoryId: data.vendorDocumentSubCategoryId,
      vendorDocumentCategoryId: data.vendorDocumentCategoryId,
      updatedDate: date,
      updatedBy: userId
    };
    this.vendorDocumentApi.updateDocument(updateData).subscribe();
  }

  // 取消編輯
  cancelEdit(data) {
    data.edit = false;
    data.isSwitchDisabled = true;
    for (const item of this.disabledData) {
      item.isEditDisabled = false;
    }
  }

  downSqmSop() {
    const token = localStorage.getItem('$DFI$token').toString();
    const apiURL = NUDDLoopBackConfig.getPath().toString();
    const container = 'mrrDoc';
    const fileUrl = apiURL + `/api/containers/${container}/download/${this.transNotice['sopName']}.pdf`;
    fetch(fileUrl, {
      method: 'GET',
      headers: new Headers({
        'content-Type': 'application/json;charset=UTF-8',
        Authorization: token
      })
    }).then(async res => await res.blob()).then(async (blob) => {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = URL.createObjectURL(blob);
      a.download = `${this.transNotice['sopName']}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
