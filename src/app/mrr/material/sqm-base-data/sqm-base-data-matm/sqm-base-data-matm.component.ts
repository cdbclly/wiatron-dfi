import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { ProjectPartNumberApi } from '@service/mrr-sdk/services/custom/ProjectPartNumber';
import { VendorProductDocumentApi } from '@service/mrr-sdk/services/custom/VendorProductDocument';
import { ManufacturerApi, PartNumberVendorApi, V_PlantProjectApi, View_ModelResultApi } from '@service/mrr-sdk/services';
// MRR SDK
import { LoopBackConfig as NUDDLoopBackConfig } from '@service/mrr-sdk';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-sqm-base-data-matm',
  templateUrl: './sqm-base-data-matm.component.html',
  styleUrls: ['./sqm-base-data-matm.component.scss']
})

export class SqmBaseDataMatmComponent implements OnInit {
  validateForm: FormGroup;
  addvalidateForm: FormGroup;
  plants;
  plantBgs;
  projectCodes = [];
  isSearchLoading = false;  // 查詢按鈕的loading
  hasProject = false; // 當加載出project才啟用查詢按鈕
  addOneFlag = false;
  addOneFlag2 = false;
  allofListData;  // 展開的第一層資料
  allofListData2;  // 展開的第二層資料
  displayExpand1 = true;  // 默認顯示第一層展開按鈕
  displayExpand2 = true;  // 默認顯示第二層展開按鈕
  projectId;  // 新增料號時需要用到的projectId
  editCache = {};  // 編輯狀態
  editCache2 = {};  // 編輯狀態
  formData = [];
  projectCodeArr = []; // 表單部分的 projectCode下拉選單
  allProjectCodeOptions = [];
  projectNameArr = [];  // 表單部分的projectName下拉選單
  allProjectNameOptions = [];
  tempProjectNames = [];
  selectPartNoArr = [];
  selectGendescArr = [];  // 品名下拉框
  selectManufacturerArr = [];
  selectManufacturerArr2 = [];
  passArr = ['不使用', '使用中'];
  approveValidationArr = ['通過', '不通過'];
  showData = [];  // table內容
  disabledEditData1 = []; // 非編輯狀態的資料
  disabledEditData2 = [];
  isUsed = []; // 雙向綁定是否使用過
  // 新增
  addPartNo; // 新增的partNumber
  addManufacture;  // 新增的廠商
  displayUsed = false; // 若沒有曾使用的資料，則不顯示使用中
  isConfirmLoading = false;  // 提交按鈕的加載
  isConfirmLoading2 = false;
  isSubmitButton = false;
  // 編輯
  isSelectPass = false;
  isSelectManufacturer = false;
  isEditMufr = true;
  isSelectfailDesc = false;
  isSelectApprove = false;
  firstShowData;  // 第一層資料
  partNumbers = [];  // 根據project撈出的料號及品名
  filterOption = () => true;   // 聲明
  transNotice = {};
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private projectPartNumberApi: ProjectPartNumberApi,
    private partNumberVendorApi: PartNumberVendorApi,
    private vendorProductDocumentApi: VendorProductDocumentApi,
    private v_PlantProjectApi: V_PlantProjectApi,
    private view_ModelResult: View_ModelResultApi,
    private manufacturerApi: ManufacturerApi,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.vendor-boom', 'mrr.vendor-fail', 'mrr.vendor-pass',
      'mrr.vendor-invalid', 'mrr.vendor-valid', 'mrr.vendor-isUse', 'mrr.vendor-isInvalid', 'mrr.vendor-using', 'mrr.vendor-not-use',
      'mrr.vendor-signing', 'mrr.vendor-sign-fail', 'mrr.vendor-no-handle', 'mrr.vendor-skip', 'mrr.vendor-product-name', 'mrr.vendor-number',
      'mrr.vendor-select-must', 'mrr.vendor-sop-name']).subscribe(res => {
        this.transNotice['boom'] = res['mrr.vendor-boom'];
        this.transNotice['fail'] = res['mrr.vendor-fail'];
        this.transNotice['pass'] = res['mrr.vendor-pass'];
        this.transNotice['invalid'] = res['mrr.vendor-invalid'];
        this.transNotice['valid'] = res['mrr.vendor-valid'];
        this.transNotice['isInvalid'] = res['mrr.vendor-isInvalid'];
        this.transNotice['isUse'] = res['mrr.vendor-isUse'];
        this.transNotice['using'] = res['mrr.vendor-using'];
        this.transNotice['notUse'] = res['mrr.vendor-not-use'];
        this.transNotice['noHandle'] = res['mrr.vendor-no-handle'];
        this.transNotice['signing'] = res['mrr.vendor-signing'];
        this.transNotice['signFail'] = res['mrr.vendor-sign-fail'];
        this.transNotice['skip'] = res['mrr.vendor-skip'];
        this.transNotice['productName'] = res['mrr.vendor-product-name'];
        this.transNotice['vendorNumber'] = res['mrr.vendor-number'];
        this.transNotice['must'] = res['mrr.vendor-select-must'];
        this.transNotice['sopName'] = res['mrr.vendor-sop-name'];
      });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.vendor-boom', 'mrr.vendor-fail', 'mrr.vendor-pass',
        'mrr.vendor-invalid', 'mrr.vendor-valid', 'mrr.vendor-isUse', 'mrr.vendor-isInvalid', 'mrr.vendor-using', 'mrr.vendor-not-use',
        'mrr.vendor-signing', 'mrr.vendor-sign-fail', 'mrr.vendor-no-handle', 'mrr.vendor-skip', 'mrr.vendor-product-name', 'mrr.vendor-number',
        'mrr.vendor-select-must', 'mrr.vendor-sop-name']).subscribe(res => {
          this.transNotice['boom'] = res['mrr.vendor-boom'];
          this.transNotice['fail'] = res['mrr.vendor-fail'];
          this.transNotice['pass'] = res['mrr.vendor-pass'];
          this.transNotice['invalid'] = res['mrr.vendor-invalid'];
          this.transNotice['valid'] = res['mrr.vendor-valid'];
          this.transNotice['isInvalid'] = res['mrr.vendor-isInvalid'];
          this.transNotice['isUse'] = res['mrr.vendor-isUse'];
          this.transNotice['using'] = res['mrr.vendor-using'];
          this.transNotice['notUse'] = res['mrr.vendor-not-use'];
          this.transNotice['noHandle'] = res['mrr.vendor-no-handle'];
          this.transNotice['signing'] = res['mrr.vendor-signing'];
          this.transNotice['signFail'] = res['mrr.vendor-sign-fail'];
          this.transNotice['skip'] = res['mrr.vendor-skip'];
          this.transNotice['productName'] = res['mrr.vendor-product-name'];
          this.transNotice['vendorNumber'] = res['mrr.vendor-number'];
          this.transNotice['must'] = res['mrr.vendor-select-must'];
          this.transNotice['sopName'] = res['mrr.vendor-sop-name'];
        });
    });
    this.validateForm = this.fb.group({
      plant: [null, [Validators.required]],
      projectName: [null, []],
      projectCode: [null, []],
    });
    this.getPlants();
  }

  // 廠區下拉框
  getPlants() {
    this.hasProject = false;
    this.plants = [];
    this.vendorProductDocumentApi.getAllByPlant(null, null, null).subscribe(res => {
      if (res.data.length) {
        this.plantBgs = res.data[0]['listData'];
        for (const p of res.data[0]['listData']) {
          this.plants.push(p['plant']);
        }
      } else {
        return;
      }
    });
  }

  // 廠別聯動查詢projectCode
  plantChange(plant) {
    this.hasProject = false;
    this.projectCodeArr = [];
    this.projectNameArr = [];
    this.validateForm.controls['projectCode'].setValue(null);   // 當第二次去選擇plant時，先清空projectCode
    this.validateForm.controls['projectName'].setValue(null);
    this.projectPartNumberApi.getProjectCodeByPlant(plant).subscribe(res => {
      // 只留下moduleName為vendorFile並且为moduleEnabled為true的projectCode
      this.formData = res.result;
      for (const data of res.result) {
        this.projectCodeArr.push(data['projectCode']);
        this.projectNameArr.push(data['projectName']);
      }
      this.allProjectCodeOptions = this.projectCodeArr;
      this.allProjectNameOptions = this.projectNameArr;
      if (this.projectCodeArr.length !== 0 && this.projectNameArr.length !== 0) {
        this.hasProject = true;
      }
    });
  }

  projectNameChange(projectName) {
    if (projectName) {
      this.validateForm.controls['projectCode'].setValue(null);
      const projectCodes = [];
      if (projectName[0] === 'All') {
        this.projectNameArr = this.projectNameArr.filter(a => a !== 'All');
        this.validateForm.controls['projectName'].setValue(this.projectNameArr);
      }
      for (let k = 0; k < this.formData.length; k++) {
        if (this.validateForm.value.projectName.includes(this.formData[k].projectName)) {
          projectCodes.push(this.formData[k].projectCode);
        }
        if (k === this.formData.length - 1) {
          this.validateForm.controls['projectCode'].setValue(projectCodes);
        }
      }
    }
  }

  search(inputValue) {
    const reg = new RegExp(inputValue);
    const arr = [];
    for (let i = 0; i < this.allProjectNameOptions.length; i++) {
      if (reg.test(this.allProjectNameOptions[i])) {
        arr.push(this.allProjectNameOptions[i]);
      }
    }   // 正則表達的模糊查詢
    if (arr.length > 1) {
      arr.unshift('All');
    }
    this.projectNameArr = arr;
  }

  query() {
    this.isSearchLoading = true;
    let listOfAllData;
    const projectArr = [];
    const plantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
    const selectPlant = this.validateForm.value.plant;
    const projectCodes = [];
    const plant1 = [];
    for (const ps of plantMapping) {  // 根據選擇的廠別找到對應的plant
      if (ps['Site'] === selectPlant || ps['PlantName'] === selectPlant) {
        plant1.push(ps['Plant']);
      }
    }
    if (this.validateForm.value.projectCode && this.validateForm.value.projectCode.length !== 0) {
      for (const item of this.validateForm.value.projectCode) {
        projectArr.push(item);
      }
    } else {
      for (const li of this.projectCodeArr) {
        projectArr.push(li);
      }
    }
    this.v_PlantProjectApi.find({  // 撈取projectCode層資料
      where: {
        projectCode: { inq: projectArr },
        plant: { inq: plant1 }
      }
    }).subscribe(req => {
      // 去掉重複的prjectCode的資料
      listOfAllData = [];
      for (let i = 0; i < req.length; i++) {
        let flag = true;
        let temp = req[i];
        for (let j = 0; j < listOfAllData.length; j++) {
          if (temp['projectCode'] === listOfAllData[j].projectCode) {
            flag = false;
            break;
          }
        }
        if (flag) {
          listOfAllData.push(temp);
        }
      }
      const pros = [];
      for (const item of listOfAllData) {
        pros.push(item.projectCode);
      }
      this.view_ModelResult.find({
        where: { project: { inq: pros } }
      }).subscribe(rdd => {
        for (const list of listOfAllData) {
          list['displayExpand1'] = true; // project層添加是否顯示擴展按鈕
          for (const list2 of rdd) {
            if (list2['project'] === list['projectCode']) {
              if (list2['status'] === 0) {
                list2['status'] = this.transNotice['noHandle'];
              } else if (list2['status'] === 1) {
                list2['status'] = this.transNotice['signing'];
              } else if (list2['status'] === 2) {
                list2['status'] = this.transNotice['pass'];
              } else if (list2['status'] === 3) {
                list2['status'] = this.transNotice['signFail'];
              }
              list['nudd'] = list2['status'];
            } else {
              list['nudd'] = null;
            }
          }
        }
        for (const tem of listOfAllData) {
          projectCodes.push(tem['projectCode']);
        }
        const parameter = { projectIdList: projectCodes };  // 查詢第二層資料所需要的參數
        this.projectPartNumberApi.getPartNumberList(parameter).subscribe(red => {
          if (red.data.length !== 0) {
            for (const list1 of listOfAllData) {
              for (const list2 of red.data) {
                if (list1['projectCode'] === list2['projectId']) {
                  list1['listData'] = list2['listData'];
                  list1['listData'].sort(this.sortByBg);
                  for (const list3 of list2['listData']) {
                    if (list3['pass']) {
                      list3['pass'] = this.transNotice['notUse'];
                    } else {
                      list3['pass'] = this.transNotice['using'];
                    }
                    if (list3['valid']) {
                      list3['partNumberValid'] = this.transNotice['valid'];
                    } else {
                      list3['partNumberValid'] = this.transNotice['invalid'];
                    }
                    // 如果某料號沒有廠商，則將廠商層的資料清掉
                    for (let k = 0; k < list3['listData'].length; k++) {
                      if (list3['listData'][k]['manufacturerId'] === null) {
                        list3['listData'].splice(k, 1);
                      }
                    }
                    list3['manLength'] = list3['listData'].length;  // 廠商數量
                    list3['displayExpand2'] = true; // 料號層添加是否顯示擴展按鈕
                  }
                }
              }
            }
          }
          this.showData = listOfAllData;
          this.getmanufacturer(); // 下拉框廠商
          this.updateEditCache();
          this.updateEditCache2();
          this.isSearchLoading = false;
        });
      });
    });
  }

  sortByBg(a, b) {
    if (a['pass'] === b['pass']) {
      if (a['valid'] > b['valid']) {
        return 1;
      } else if (a['valid'] < b['valid']) {
        return -1;
      } else {
        return 0;
      }
    } else {
      if (a['pass'] > b['pass']) {
        return 1;
      } else {
        return -1;
      }
    }
  }

  // 廠商（查詢規則是什麼）待確認
  getmanufacturer() {
    this.manufacturerApi.find().subscribe(res => {
      this.selectManufacturerArr = res;
    });
  }

  // 展示時候
  nzExpandChange(data) {
    this.selectGendescArr = [];
    if (data.expand) {
      for (const list of this.showData) {
        if (list['projectCode'] !== data.projectCode) {
          list['displayExpand1'] = false;
        }
      }
      this.allofListData = data;
    } else {
      for (const list of this.showData) {
        list['displayExpand1'] = true;
      }
    }
    // 下拉框料號
    const ptNo = [];
    if (data.listData) {
      for (const item of data.listData) {
        ptNo.push(item.partNumberId);
      }
    }
    this.projectPartNumberApi.getPartNumbers(data.projectCode).subscribe(res => {
      this.partNumbers = res.data;
      const allSelectPartNos = [];
      for (const list of res.data) {
        allSelectPartNos.push(list.partnumber);
        if (list.gendesc !== null) {
          this.selectGendescArr.push(list.gendesc);
        }
      }
      this.selectPartNoArr = allSelectPartNos.filter(a => !ptNo.some(b => b === a));
    });
  }

  nzExpandChange2(data, data1) {
    if (data1.expand) {
      this.allofListData2 = data1;
      for (const list of data.listData) {
        if (list['partNumberId'] !== data1.partNumberId) {
          list['displayExpand2'] = false;
        }
      }
    } else {
      for (const list of data.listData) {
        list['displayExpand2'] = true;
      }
    }
  }

  // 第二層編輯
  startEdit(data, data1) {
    this.editCache[data1.id].edit = true;
    if (data1.pass === this.transNotice['notUse']) {   // 當pass值為Y
      this.isSelectPass = true;
    } else {
      this.isSelectPass = false;
    }
    this.disabledEditData1 = data['listData'].filter(a => a.id !== data1.id);  // 同層其他資料不能編輯
    for (const item of this.disabledEditData1) {
      item.isEditDisabled = true;
    }
    for (const list of data1.listData) {   // 第二層不能編輯
      list.isEditDisabled = true;
    }
  }

  // 當PASS為Y
  selectPassChange(e) {
    if (e === this.transNotice['notUse']) {
      this.isSelectPass = true;
    } else {
      this.isSelectPass = false;
    }
  }

  saveEdit(data, data1) {
    this.editCache[data1.id].edit = false;
    const userId = localStorage.getItem('$DFI$userID');
    const date = new Date();
    for (const item of this.disabledEditData1) {
      item.isEditDisabled = false;
    }  // 取消禁用非編輯狀態的編輯按鈕
    for (const list of data1.listData) {   // 第二層恢復編輯
      list.isEditDisabled = false;
    }
    const newProjectPartNumber = {
      id: data1.id,
      plant: this.validateForm.value.plant,
      projectId: data.projectCode,
      partNumberId: data1.partNumberId,
      source: data1.source,
      pass: this.editCache[data1.id].data.pass,
      gendesc: this.editCache[data1.id].data.gendesc,
      createBy: data1.partNumberCreateBy,
      updateBy: localStorage.getItem('$DFI$userID'),
      updateDate: date
    };
    if (this.editCache[data1.id].data.pass === this.transNotice['notUse']) {
      newProjectPartNumber.pass = 1;
    } else if (this.editCache[data1.id].data.pass === this.transNotice['using'] || this.editCache[data1.id].data.pass === null) {
      newProjectPartNumber.pass = 0;
    }
    this.projectPartNumberApi.upsert(newProjectPartNumber).subscribe(res => {
      if (res['pass']) {
        res['pass'] = this.transNotice['notUse'];
      } else {
        res['pass'] = this.transNotice['using'];
      }
      res['partNumberUpdateBy'] = userId;  // 修改人工號
      Object.assign(data1, res);
      this.message.create('success', 'Successfully modified！');
    });
  }

  cancelEdit(data, data1) {
    this.editCache[data1.id].edit = false;
    for (const item of this.disabledEditData1) {
      item.isEditDisabled = false;
    }  // 取消禁用非編輯狀態的編輯按鈕
    for (const list of data1.listData) {   // 第二層恢復編輯
      list.isEditDisabled = false;
    }
  }

  // 第三層編輯
  startEdit2(data1, data2) {
    if (!data2.manufacturerId) {
      this.editCache2[data2.partNumberVendorId].data.manufacturerId = null;
    }
    this.editCache2[data2.partNumberVendorId].edit = true;
    for (const list of this.showData) {   // 編輯第三層的時候，禁用第一層的編輯按鈕
      if (list.listData) {
        for (const list2 of list.listData) {
          list2.isEditDisabled = true;
        }
      }
    }
    if (data1.pass === this.transNotice['notUse']) {
      this.isSelectManufacturer = true;
      this.isSelectfailDesc = true;
      this.isSelectApprove = true;
    } else if (data1.pass === this.transNotice['using']) {
      if (data2.failDesc) {
        this.isSelectApprove = true;
      } else {
        this.isSelectApprove = false;
        this.isSelectManufacturer = false;
        this.isSelectfailDesc = false;
      }
    }
    if (data2.manufacturerId && data2.manufacturerId !== '') {   // 如果已存在廠商，則不能再修改廠商
      this.isSelectManufacturer = true;
    }
    this.disabledEditData2 = data1['listData'].filter(a => a.id !== data2.partNumberVendorId);
    for (const item of this.disabledEditData2) {
      item.isEditDisabled = true;
    }
  }

  // 當存在FailDesc
  selectFailChange(data, e) {
    if (e) {   // 如果有fail說明,approve為NG
      this.editCache2[data.partNumberVendorId].data.approveValidation = this.transNotice['fail'];
      this.isSelectApprove = true;
    } else {
      this.isSelectApprove = false;
      this.editCache2[data.partNumberVendorId].data.approveValidation = null;
    }
  }

  saveEdit2(data1, data2) {
    const userId = localStorage.getItem('$DFI$userID');
    const date = new Date();
    this.editCache2[data2.partNumberVendorId].edit = false;
    for (const item of this.disabledEditData2) {
      item.isEditDisabled = false;
    }  // 取消禁用非編輯狀態的編輯按鈕
    for (const list of this.showData) {   // 編輯第三層的時候，禁用第一層的編輯按鈕
      if (list.listData) {
        for (const list2 of list.listData) {
          list2.isEditDisabled = false;
        }
      }
    }
    this.partNumberVendorApi.find({ where: { id: data2.partNumberVendorId } }).subscribe(ff => { // containerName
      const newManufacturer = {
        id: data2.partNumberVendorId,
        projectPartNumberId: data1.id,
        partNumberId: data1.partNumberId,
        vendorId: this.editCache2[data2.partNumberVendorId].data.manufacturerId,
        manufacturerId: this.editCache2[data2.partNumberVendorId].data.manufacturerId,
        failDesc: this.editCache2[data2.partNumberVendorId].data.failDesc,
        approveValidation: this.editCache2[data2.partNumberVendorId].data.approveValidation,
        containerName: ff[0]['containerName'],
        createBy: data2.vendorCreateBy,
        updateBy: localStorage.getItem('$DFI$userID'),
        updateDate: date
      };
      this.partNumberVendorApi.upsert(newManufacturer).subscribe(res => {
        res['vendorUpdateBy'] = userId;   // 修改人工號
        Object.assign(data2, res);
        this.message.create('success', 'Successfully modified！');
      });
    });
  }

  cancelEdit2(data1, data2) {
    this.editCache2[data2.partNumberVendorId].edit = false;
    for (const item of this.disabledEditData2) {
      item.isEditDisabled = false;
    }  // 取消禁用非編輯狀態的編輯按鈕
    for (const list of this.showData) {   // 編輯第三層的時候，禁用第一層的編輯按鈕
      if (list.listData) {
        for (const list2 of list.listData) {
          list2.isEditDisabled = false;
        }
      }
    }
  }

  // 新增model
  addOne(data) {
    this.addOneFlag = true;
    this.displayUsed = false;
    this.addManufacture = null;
    this.addPartNo = null;
    this.projectId = data.projectCode;
  }

  // 是否使用過
  partNoChange(e) {
    this.isUsed = [];
    this.displayUsed = false;
    this.isConfirmLoading = false;
    if (e) {
      this.isConfirmLoading = true;
      this.projectPartNumberApi.checkPartNumberUsed(e).subscribe(res => {
        this.isUsed = res.data[0];
        if (this.isUsed) {
          this.displayUsed = true; // 有曾使用過的記錄，默認使用中為Y，後續不行為
        } else {
          this.displayUsed = false;
        }
        this.isConfirmLoading = false;
      });
    }
  }

  handleCancel() {
    this.addOneFlag = false;
  }

  // 確認提交
  handleOk() {
    this.isConfirmLoading = true;
    const date = new Date();
    if (!this.addPartNo || !this.addManufacture) {
      this.message.create('error', this.transNotice['must']);
      this.isConfirmLoading = false;
      return;
    }
    const newProjectPartNumber = {
      projectId: this.projectId,
      partNumberId: this.addPartNo,
      plant: this.validateForm.value.plant,
      createBy: localStorage.getItem('$DFI$userID')
    };
    if (this.isUsed) {  // 如果存在有使用,pass值默認為1
      newProjectPartNumber['pass'] = 1;
    } else {
      newProjectPartNumber['pass'] = 0;
    }
    this.projectPartNumberApi.addProjectPartNumber(newProjectPartNumber).subscribe(red => {  // 新增料號
      const partNumberlist = { partNumberList: [newProjectPartNumber.partNumberId] };
      this.projectPartNumberApi.checkPartNumberValid(partNumberlist).subscribe(ree => {  // 料號是否失效
        if (ree.result[0]['valid'] === 0) {
          red.result['valid'] = 0;
          red.result['partNumberValid'] = this.transNotice['invalid'];
        } else {
          red.result['valid'] = 1;
          red.result['partNumberValid'] = this.transNotice['valid'];
        }
        if (this.isUsed) {  // 如果存在有使用,pass值默認為Y
          red.result['used'] = this.isUsed;
          red.result['pass'] = this.transNotice['notUse'];
        } else {
          red.result['pass'] = this.transNotice['using'];
        }
        // 新增料號時，將品名帶出來
        const partnumberGendesc = this.partNumbers.filter(a => a.partnumber === this.addPartNo);
        red.result['gendesc'] = partnumberGendesc[0]['gendesc'];
        red.result['part'] = null;
        red.result['isEditDisabled'] = false;
        red.result['partNumberCreateBy'] = localStorage.getItem('$DFI$userID');
        for (const data1 of this.showData) {
          if (data1.projectCode === this.allofListData.projectCode) {
            if (!data1['listData']) {
              data1['listData'] = [];
              data1['listData'].push(red['result']);
            } else {
              data1['listData'].push(red['result']);
            }
            data1['listData'] = data1['listData'].slice();
          }
        }
        this.showData = this.showData.slice();
        this.updateEditCache();
        const newManufacturer = {
          projectId: this.allofListData.projectCode,
          projectPartNumberId: red.result.id,
          partNumberId: newProjectPartNumber.partNumberId,
          manufacturerId: this.addManufacture,
          vendorId: this.addManufacture,
          failDesc: null,
          approveValidation: null,
          createBy: localStorage.getItem('$DFI$userID'),
          createDate: date
        };
        this.partNumberVendorApi.create(newManufacturer).subscribe(res => {  // 新增廠商
          const plantBg = this.plantBgs.filter(a => a.plant === this.validateForm.value.plant);
          const vendorFileData = {
            projectId: this.allofListData.projectCode,
            partNumberId: newProjectPartNumber.partNumberId,
            partNumberVendorId: res['id'],
            manufacturerId: this.addManufacture,
            plant: plantBg[0].plant,
            bg: plantBg[0].bg,
            createBy: localStorage.getItem('$DFI$userID')
          };
          this.projectPartNumberApi.initialPartNumberVendorFiles(vendorFileData).subscribe(rr => {  // 初始化廠商文件
            res['partNumberVendorId'] = res['id'];
            res['isEditDisabled'] = false;
            res['vendorCreateBy'] = localStorage.getItem('$DFI$userID');
            for (const data of this.showData) {
              if (data.projectCode === newManufacturer.projectId) {
                if (data['listData']) {
                  for (const data1 of data['listData']) {
                    if (data1['projectId'] === this.projectId) {
                      data1['manLength'] = 1; // 新增廠商數量為1
                    }
                    data1['displayExpand2'] = true;
                    if (data1.id === newManufacturer.projectPartNumberId) {
                      delete res['id'];
                      delete res['createBy'];
                      delete res['createDate'];
                      delete res['partNumberId'];
                      delete res['projectId'];
                      delete res['vendorId'];
                      delete res['projectPartNumberId'];
                      if (!data1['listData']) {
                        data1['listData'] = [];
                        data1['listData'].push(res);
                      } else {
                        data1['listData'].push(res);
                      }
                      data1['listData'] = data1['listData'].slice();
                    }
                  }
                }
              }
            }
            this.showData = this.showData.slice();
            this.addOneFlag = false;
            this.updateEditCache();
            this.updateEditCache2();
            this.message.create('success', 'Added successfully！');
            this.isConfirmLoading = false;
          });
        });
      });
    });
  }

  Change(e) {
    this.addManufacture = e;
  }

  // 新增廠商
  addOne2(data) {
    this.addOneFlag2 = true;
    this.addManufacture = null;
    const mauArr = [];
    for (const item of data.listData) {
      mauArr.push(item['manufacturerId']);
    }
    this.selectManufacturerArr2 = this.selectManufacturerArr.filter(a => !mauArr.some(b => b === a.id));
  }

  handleOk2() {
    this.isConfirmLoading2 = true;
    const date = new Date();
    let passStatus;
    const newManufacturer = {
      projectId: this.allofListData.projectCode,
      projectPartNumberId: this.allofListData2.id,
      partNumberId: this.allofListData2.partNumberId,
      manufacturerId: this.addManufacture,
      vendorId: this.addManufacture,
      failDesc: null,
      approveValidation: null,
      createBy: localStorage.getItem('$DFI$userID'),
      createDate: date
    };
    this.partNumberVendorApi.create(newManufacturer).subscribe(res => {
      if (this.allofListData2.pass === this.transNotice['using']) {
        passStatus = 0;
      } else {
        passStatus = 1;
      }
      const newPlantData = {
        id: this.allofListData2.id,
        projectId: this.allofListData.projectCode,
        partNumberId: this.allofListData2.partNumberId,
        source: this.allofListData2.source,
        pass: passStatus,
        plant: this.validateForm.value.plant,
        gendesc: this.allofListData2.gendesc,
        createDate: this.allofListData2.createDate,
        createBy: this.allofListData2.createBy,
        updateDate: this.allofListData2.updateDate,
        updateBy: this.allofListData2.updateBy,
      };
      this.projectPartNumberApi.upsert(newPlantData).subscribe(ree => {  // 系統撈出的料號，新增廠商時把plant存入projectPartNumber
        const plantBg = this.plantBgs.filter(a => a.plant === this.validateForm.value.plant);
        const vendorFileData = {
          projectId: this.allofListData.projectCode,
          partNumberId: this.allofListData2.partNumberId,
          partNumberVendorId: res['id'],
          manufacturerId: this.addManufacture,
          plant: plantBg[0].plant,
          bg: plantBg[0].bg,
          createBy: localStorage.getItem('$DFI$userID')
        };
        this.projectPartNumberApi.initialPartNumberVendorFiles(vendorFileData).subscribe(rr => {  // 初始化廠商文件
          res['partNumberVendorId'] = res['id'];
          res['isEditDisabled'] = false;
          res['vendorCreateBy'] = localStorage.getItem('$DFI$userID');
          for (const data of this.showData) {
            if (data.projectCode === newManufacturer.projectId) {
              for (const data1 of data['listData']) {
                if (this.allofListData2.partNumberId === data1.partNumberId) {
                  data1['manLength'] = data1['manLength'] + 1; // 廠商數量加1
                }
                if (data1.id === newManufacturer.projectPartNumberId) {
                  delete res['id'];
                  delete res['createBy'];
                  delete res['createDate'];
                  delete res['partNumberId'];
                  delete res['projectId'];
                  delete res['vendorId'];
                  delete res['projectPartNumberId'];
                  data1['listData'].push(res);
                  data1['listData'] = data1['listData'].slice();
                }
              }
            }
          }
          this.showData = this.showData.slice();
          this.isConfirmLoading2 = false;
          this.updateEditCache();
          this.updateEditCache2();
          this.addOneFlag2 = false;
          this.message.create('success', 'Added successfully！');

        });
      });
    });
  }

  handleCancel2() {
    this.addOneFlag2 = false;
  }

  // 第一層資料頁碼改變
  firstPageIndexChange(e) {
    if (e) {
      for (const data of this.showData) {
        data.expand = false;
        data.displayExpand1 = true;
      }
    }
  }

  // 第二層資料頁碼改變
  secondPageIndexChange(e) {
    if (e) {
      for (let i = 0; i < this.showData.length; i++) {
        if (this.showData[i]['listData']) {
          for (let k = 0; k < this.showData[i]['listData'].length; k++) {
            this.showData[i]['listData'][k]['expand'] = false;
            this.showData[i]['listData'][k]['displayExpand2'] = true;
          }
        }
      }
    }
  }

  // 初始化編輯狀態
  updateEditCache(): void {
    for (const data1 of this.showData) {
      if (data1['listData']) {
        data1['listData'].forEach(item => {
          this.editCache[item.id] = {
            edit: false,
            data: { ...item }
          };
        });
      }
    }
  }

  updateEditCache2(): void {
    for (const data1 of this.showData) {
      if (data1['listData']) {
        for (const data2 of data1['listData']) {
          data2['listData'].forEach(item => {
            this.editCache2[item.partNumberVendorId] = {
              edit: false,
              data: { ...item }
            };
          });
        }
      }
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

