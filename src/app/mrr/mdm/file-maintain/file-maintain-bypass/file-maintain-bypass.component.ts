import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FileMaintainBypassService } from './file-maintain-bypass.service';
import { VendorProductDocumentApi, VendorDocumentApi, VendorDocumentCategoryApi, VendorDocumentSubCategoryApi } from '@service/mrr-sdk';
@Component({
  selector: 'app-file-maintain-bypass',
  templateUrl: './file-maintain-bypass.component.html',
  styleUrls: ['./file-maintain-bypass.component.scss']
})
export class FileMaintainBypassComponent implements OnInit {
  validateForm: FormGroup;
  isDisplayContent = false; // 開始默認不顯示table內容
  isSearchLoading = false; // 查詢loading
  isSaveLoading = false;  // 送出loading
  isEditButton = false; // 默認編輯按鈕不禁用
  isDisplayEdit = false; // 默認保存和取消按鈕不顯示
  isNonEditable = true;  // 編輯狀態時候的顯示
  plantNames = []; // plantName
  selectPlantName = []; // 下拉框的plantName
  bgNumber = []; // bg跨列數
  noHideWsd = true; // 是否隱藏wsd
  noHideWt = true;  // 是否隱藏wt
  plants = [];  // plant
  selectPlants; // 下拉框plant
  whichPlant;  // 管理人員屬於哪一個plant
  allListData = []; // 查詢的原始數據
  displayData = [];  // 整理后頁面顯示的數據
  oldSwitchValue = []; // 編輯之前的switchValue
  allPlants = [];
  vendorDocumentCategory; // 大分類選單
  vendorDocumentSubCategory; // 小分類
  disabledRadio = true;
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private fileMaintainBypassService: FileMaintainBypassService,
    private vendorProductDocumentApi: VendorProductDocumentApi,
    private vendorDocumentApi: VendorDocumentApi,
    private vendorDocumentCategoryApi: VendorDocumentCategoryApi,
    private vendorDocumentSubCategoryApi: VendorDocumentSubCategoryApi,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      plant: [null],
      radioValue: ['A'],
      category1: [null],
      category2: [null],
    });
    this.getSelectPlants();
    this.getAllProductDocument();
    this.getvendorDocumentCategory();
  }

  // 廠別下拉框獲取
  getSelectPlants() {
    this.selectPlants = [];
    this.vendorProductDocumentApi.getAllByPlant(null, null, null).subscribe(res => {
      for (const item of res.data[0]['listData']) {
        this.selectPlants.push(item['plant']);
      }
    });
  }

  // 獲取所有廠文件
  getAllProductDocument() {
    this.displayData = [];
    this.isDisplayContent = false;  // 默認不顯示table內容
    this.isEditButton = false;  // 默認可使用編輯按鈕
    const whichPlant = localStorage.getItem('DFC_Plant');  // F721
    let whichPlantName;
    const plantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
    for (const ps of plantMapping) {
      if (whichPlant === ps['Plant']) {
        whichPlantName = ps['PlantName'];
      }
    }
    this.vendorDocumentApi.getAllByName('').subscribe(ree => {
      this.vendorProductDocumentApi.getAllByPlant(this.validateForm.value.plant, Number(this.validateForm.value.category2), Number(this.validateForm.value.category1)).subscribe(res => {
        if (res.data.length !== 0) {
          for (const ee of ree.data) {
            if (!ee['isEnable']) {
              res.data = res.data.filter(a => a.name !== ee.name);
            }  // 如果禁用不顯示在頁面
          }
          for (const d1 of res.data) {
            for (const d2 of d1['listData']) {
              d2['checked'] = true;
              d2['isNonEditable'] = true;
              d2['defaultDisplay'] = true;
              if (d2['pass'] === 0) {
                d2['pass'] = false;
              } else {
                d2['pass'] = true;
              }
            }
          }
          // 選擇顯示狀態
          if (this.validateForm.value.plant) {
            if (this.validateForm.value.radioValue === 'B') {
              for (const t of res.data) {
                t['listData'] = t['listData'].filter(a => a.pass === false);
                if (t['listData'].length === 0) {
                  res.data = res.data.filter(a => a !== t);
                }
              }
            } else if (this.validateForm.value.radioValue === 'C') {
              for (const t of res.data) {
                t['listData'] = t['listData'].filter(a => a.pass === true);
                if (t['listData'].length === 0) {
                  res.data = res.data.filter(a => a !== t);
                }
              }
            }
          }
          // 如果查詢結果沒有資料
          if (res.data.length === 0) {
            this.isSearchLoading = false;
            return;
          }
          this.displayData = res.data;
          this.dealListOfData();
        } else {  // 如果查詢沒有資料
          this.isSearchLoading = false;
          return;
        }
      });
    });
  }

  // 處理數據
  dealListOfData() {
    //  按文件名分類
    this.plantNames = [];
    this.bgNumber = [];
    this.noHideWsd = true;
    this.noHideWt = true;
    for (const item of this.displayData) {
      item['listData'].sort(this.sortByBg);  // 排序
    }
    let wsdNumber = 0;
    let wtNumber = 0;
    for (let j = 0; j < this.displayData[0]['listData'].length; j++) {
      this.plantNames.push(this.displayData[0]['listData'][j]['plant']); // 獲取plantName數組
      if (this.displayData[0]['listData'][j]['bg'] === 'WSD') {
        wsdNumber++;
      } else {
        wtNumber++;
      }
    }
    this.bgNumber.push(wsdNumber, wtNumber);
    if (this.bgNumber[0] === 0) {
      this.noHideWt = false;
    } else if (this.bgNumber[1] === 0) {
      this.noHideWsd = false;
    }
    this.isSearchLoading = false;
    this.isDisplayContent = true;
  }

  // 按bg、plant排序
  sortByBg(a, b) {
    if (a['bg'] === b['bg']) {
      if (a['plant'] > b['plant']) {
        return 1;
      } else if (a['plant'] < b['plant']) {
        return -1;
      } else {
        return 0;
      }
    } else {
      if (a['bg'] < b['bg']) {
        return 1;
      } else {
        return -1;
      }
    }
  }

  // 獲取大分類
  getvendorDocumentCategory() {
    this.vendorDocumentCategoryApi.find().subscribe(res => {
      this.vendorDocumentCategory = res;
    });
  }

  // 大分類變化，獲取小分類
  firstCategoryChange(id) {
    if (id) {
      this.validateForm.controls['category2'].setValue(null);
      this.vendorDocumentSubCategoryApi.find({ where: { categoryId: id } }).subscribe(res => {
        this.vendorDocumentSubCategory = res;
      });
    }
  }

  // plant 變化
  plantChange(plant) {
    if (plant) {
      this.disabledRadio = false;
      this.validateForm.controls['category1'].setValue(null);
      this.validateForm.controls['category2'].setValue(null);
    } else {
      this.disabledRadio = true;
    }
  }

  // 查詢
  async query() {
    this.isSearchLoading = true;
    this.getAllProductDocument();
    const selectPlant = this.validateForm.value.plant;
    const whichSite = localStorage.getItem('Site');  // WCD
    const whichPlant = localStorage.getItem('DFC_Plant');  // F721
    let whichPlantName;
    const plantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
    for (const ps of plantMapping) {
      if (whichPlant === ps['Plant']) {
        whichPlantName = ps['PlantName'];
      }
    }
    if (selectPlant === whichSite || !selectPlant) {
      this.isEditButton = false;  // 可編輯
    } else if (selectPlant === whichPlantName) {
    } else {
      this.isEditButton = true;  // 禁用
    }
  }

  // 點擊編輯按鈕,checkbox為編輯狀態
  editByPassValue() {
    this.isEditButton = true;  // 禁用
    this.oldSwitchValue = [];
    const whichSite = localStorage.getItem('Site');
    const whichPlant = localStorage.getItem('DFC_Plant');
    let whichPlantName;
    let whichBg;
    let plantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
    plantMapping = plantMapping.filter(a => a.PlantName !== 'WZS-3A'); // 過濾掉WZS-3A，因為它與WZS-3的plant一樣
    for (const ps of plantMapping) {
      if (whichPlant === ps['Plant']) {
        whichPlantName = ps['PlantName'];
        if (whichSite === 'WKS') {
          whichBg = ps['bg'];
        }
      }
    }
    for (const data of this.displayData) {
      for (const d of data['listData']) {
        if (whichSite !== 'WKS') {
          if (d['plant'] === whichSite) {
            d.isNonEditable = false;  // 可編輯
            if (d.isNonEditable === false) {
              this.oldSwitchValue.push(d.pass);  // 取消還原
            }
          } else if (d['plant'] === whichPlantName) {
            d.isNonEditable = false;  // 可編輯
            if (d.isNonEditable === false) {
              this.oldSwitchValue.push(d.pass);  // 取消還原
            }
          }
        } else if (whichSite === 'WKS') {
          if (d['plant'] === 'WKS' && d['bg'] === 'WT') {
            d.isNonEditable = false;  // 可編輯
            if (d.isNonEditable === false) {
              this.oldSwitchValue.push(d.pass);  // 取消還原
            }
          }
        }
      }
    }
    this.isDisplayEdit = true;
  }

  // 保存修改的switchValue
  async saveByPassValue() {
    this.isSaveLoading = true;
    const saveData = [];
    for (const data of this.displayData) {
      for (const d of data['listData']) {
        if (d.isNonEditable === false) {
          saveData.push(d);
          d.isNonEditable = true;  // 恢復成非編輯狀態
        }
      }
    }
    this.fileMaintainBypassService.updateSwitchValue(saveData).subscribe(red => {
      this.isDisplayEdit = false;
      this.isEditButton = false;
      this.isSaveLoading = false;
      this.message.create('success', 'Successfully modified！');
    });
  }

  // 取消修改的switchValue
  cancelByPassValue() {
    for (let k = 0; k < this.displayData.length; k++) {
      for (const d of this.displayData[k]['listData']) {
        if (d.isNonEditable === false) {
          d.pass = this.oldSwitchValue[k];
          d.isNonEditable = true;  // 恢復成非編輯狀態
        }
      }
    }
    this.isDisplayEdit = false;
    this.isEditButton = false;
  }
}
