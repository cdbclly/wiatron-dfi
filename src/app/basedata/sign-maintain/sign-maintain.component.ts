import { UploadInterface } from '../../service/dfc_sdk/sdk/models/Upload';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SignMaintainService } from './sign-maintain.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { copyStyles } from '@angular/animations/browser/src/util';
import { LOGGER_SERVICE_PROVIDER } from 'ng-zorro-antd/core/util/logger/logger.service';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sign-maintain',
  templateUrl: './sign-maintain.component.html',
  styleUrls: ['./sign-maintain.component.scss']
})
export class SignMaintainComponent implements OnInit, OnDestroy {
  // editCache: { [key: number]: any } = {};
  // listOfData: any[] = [];

  displayData;
  editOldForm;
  oldWorkflowSign;
  oldForm;
  models = ['DFC', 'DFQ', 'MRR'];
  selectedKey;
  selectedModel;
  workflowForms = [];
  // 存放下拉列表中的key
  keysForm = [];
  // 用來存放workflowFormMapping中的數據
  mappingTable = [];
  isVisible;
  isOkLoading;
  addModel;
  addKey;
  workflowFormId;
  isVisible1;
  isOkLoading1;
  addStage;
  addStageDesc;
  addPicId;
  addIsDynamic;
  workflowFormMappingId;
  isVisible2;
  isOkLoading2;
  mappingId;
  updateModel;
  updateKey;
  updateFormId;
  isVisible3;
  isOkLoading3;
  updateStage;
  updateStageDesc;
  updatePicId;
  updateIsDynamic;
  updateFkId;
  signatoryId;
  description = [];
  tableShow = false;
  modules = ['DFC', 'DFQ', 'MRR'];
  keyTips;
  workflowSignatory = [];
  innerTableShow = false;
  signShow = false;
  formDesc;
  signDescription: string;
  // i18n
  signModelTitle: string;
  addModelTitle: string;
  modifyModelTitle: string;
  destroy$ = new Subject();
  trans: Object = {};
  constructor(
    private service: SignMaintainService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    // 初始化I18N;
    this.translate.get(['base-data.add-information', 'base-data.modify-information', 'base-data.sign-off-maintenance-personnel']).subscribe(res => {
      this.signModelTitle = res['base-data.sign-off-maintenance-personnel'];
      this.addModelTitle = res['base-data.add-information'];
      this.modifyModelTitle = res['base-data.modify-information'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['base-data.add-information', 'base-data.modify-information', 'base-data.sign-off-maintenance-personnel']).subscribe(res => {
        this.signModelTitle = res['base-data.sign-off-maintenance-personnel'];
        this.addModelTitle = res['base-data.add-information'];
        this.modifyModelTitle = res['base-data.modify-information'];
      });
    });
    this.getWorkflowForm();
    this.getWorkflowFormMapping();
  }

  getWorkflowSign(data) {
    this.oldWorkflowSign = data;
    this.workflowFormMappingId = this.oldWorkflowSign['id'];
    for (let index = 0; index < this.displayData.length; index++) {
      if (this.displayData[index]['id'] === this.oldWorkflowSign['id']) {
        this.workflowSignatory = this.oldWorkflowSign['workflowSignatories'];
      }
    }
    this.signShow = true;

  }

  cancel() {
    this.signShow = false;
  }

  // 獲取workflowForm(是為了拿到它的model)
  getWorkflowForm() {
    this.service.getWorkflowForm({}).subscribe(res => {
      this.workflowForms = res;
    });
  }

  // 獲取workflowFormMapping裡面的數據，並把每一筆數據添加到mappingTable中
  getWorkflowFormMapping() {
    this.service.getWorkflowFormMapping(
      {
        include: [{
          relation: 'workflowSignatories'
        }, {
          relation: 'workflowForm'
        }]
      }
    ).subscribe(res => {
      this.mappingTable = res;
      this.displayData = res;
      this.tableShow = true;
    });


  }

  // key值規則
  getKeyTips() {
    this.formDesc = this.workflowForms.filter(item => item['id'] === this.workflowFormId)[0]['description'];
    if (this.formDesc === '[MRR]NUDD風險評估') {
      this.keyTips = 'Plant_Customer_Product';
    } else if (this.formDesc === '[DFQ]C4/C5 Meeting Review') {
      this.keyTips = 'BG_BU_Plant_Customer';
    } else if (this.formDesc === '[DFQ]獎懲規則簽核' || this.formDesc === '[DFQ]物料良率簽核' || this.formDesc === '[DFQ]目標良率生成簽核' || this.formDesc === '[DFQ]MB不良率簽核') {
      this.keyTips = 'Site_Product';
    } else if (this.formDesc === '[DFC]標準工時簽核') {
      this.keyTips = 'Standard_Product_ProcessCode';
    } else if (this.formDesc === '[DFC]目標工時簽核') {
      this.keyTips = 'Target _Plant_ProcessCode';
    } else if (this.formDesc === '[DFC]軍令狀') {
      this.keyTips = 'Military_Order_Plant/BU';
    } else if (this.formDesc === '[DFC]獎懲規則簽核') {
      this.keyTips = 'Reward_Rule';
    }
  }

  change() {
    this.keysForm = [];
    this.selectedKey = null; // 當model再次改變時，將前一次中的key置為空
    this.getSysForm();
  }

  // 根據所選Form，篩選表格數據
  getSysForm() {
    this.service.getWorkflowForm(
      {
        include: {
          relation: 'workflowFormMappings'
        },
        where: {
          id: this.selectedModel
        }
      })
      .subscribe(res => {
        console.log(res);
        for (let index = 0; index < res[0]['workflowFormMappings'].length; index++) {
          if (!this.keysForm.includes(res[0]['workflowFormMappings'][index]['key'])) {
            this.keysForm.push(res[0]['workflowFormMappings'][index]['key']);
          }
        }
      });
    console.log(this.displayData);

  }

  // 查詢所有
  onSearch() {
    if (this.selectedKey !== '' && this.selectedKey !== null) {
      this.displayData = this.mappingTable.filter(item => item.key === this.selectedKey && item.workflowFormId === this.selectedModel);
    } else if (this.selectedModel !== '' && this.selectedModel !== null) {
      this.displayData = this.mappingTable.filter(item => item.workflowFormId === this.selectedModel);
    } else {
      this.getWorkflowFormMapping();
    }
  }

  // 向workflowFormMapping中添加資料
  showModal(): void {
    this.isVisible = true;
    this.workflowFormId = '';
    this.addModel = '';
    this.addKey = '';
    this.keyTips = '';
  }

  handleOk() {
    this.isOkLoading = true;
    const form = {
      model: this.addModel,
      key: this.addKey,
      workflowFormId: this.workflowFormId
    };
    this.addKey = this.addKey.trim();
    if (this.addKey.toUpperCase()) {
      let flag;
      if (this.formDesc === '[DFQ]獎懲規則簽核' || this.formDesc === '[DFQ]物料良率簽核' || this.formDesc === '[DFQ]目標良率生成簽核' || this.formDesc === '[DFQ]MB不良率簽核' || this.formDesc === '[DFC]獎懲規則簽核') {
        flag = new RegExp(/^[a-zA-Z0-9-]+\_[a-zA-Z0-9-\s]+$/).test(this.addKey);
      } else if (this.formDesc === '[MRR]NUDD風險評估' || this.formDesc === '[DFC]標準工時簽核' || this.formDesc === '[DFC]目標工時簽核' || this.formDesc === '[DFC]軍令狀') {
        flag = new RegExp(/^([a-zA-Z0-9-]+\_){2}[a-zA-Z0-9-\s]+$/).test(this.addKey);
      } else if (this.formDesc === '[DFQ]C4/C5 Meeting Review') {
        flag = new RegExp(/^([a-zA-Z0-9-\s]+\_){3}[a-zA-Z0-9-\s]+$/).test(this.addKey);
      }
      if (!flag) {
        this.message.create('error', '請按照規則輸入key值！Please enter the key value according to the rules!');
        this.isOkLoading = false;
        return;
      } else {
        this.service.getKeyDescribe(this.workflowFormId, this.addKey).subscribe(res => {
          if (res[0]['workflowFormMappings'].length !== 0) {
            this.message.create('error', 'Key already exists, please re-enter!');
            this.isOkLoading = false;
            return;
          } else {
            this.service.addMappingForm(form).subscribe(
              result => {
                this.service.getWorkflowFormMapping(
                  {
                    include: [{
                      relation: 'workflowSignatories'
                    }, {
                      relation: 'workflowForm'
                    }],
                    where: {
                      id: result.id
                    }
                  }
                ).subscribe(ress => {
                  if (!!this.selectedModel || !!this.selectedKey) {
                    this.displayData.push(ress[0]);
                    this.displayData = this.displayData.slice();
                    this.mappingTable.push(ress[0]);
                    this.keysForm.push(ress[0]['key']);
                  } else if (!!this.selectedModel && !!this.selectedKey) {
                    this.displayData.push(ress[0]);
                    this.displayData = this.displayData.slice();
                    this.mappingTable.push(ress[0]);
                    this.keysForm.push(ress[0]['key']);
                  } else {
                    this.mappingTable.push(ress[0]);
                    this.displayData = this.mappingTable;
                    this.displayData = this.displayData.slice();
                  }
                  this.isVisible = false;
                  this.isOkLoading = false;
                  this.message.create('success', 'Added successfully!');
                },
                  err => {
                    this.isVisible = false;
                    this.isOkLoading = false;
                    this.message.create('error', 'add failed!');
                  });
              },
            );
          }
        });
      }
    } else {
      this.message.create('error', 'Please enter Key!');
      this.isOkLoading = false;
      return;
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  // 刪除workflowFormMapping
  delMappingForm(id) {
    this.service.delMappingForm(id).subscribe(res => {
      if (!!this.selectedModel || !!this.selectedKey) {
        const delDisplayData = this.displayData.filter(item => item.id === id);
        this.keysForm = this.keysForm.filter(item => item !== delDisplayData[0]['key']);
        this.displayData = this.displayData.filter(item => item.id !== id);
        this.displayData = this.displayData.slice();
        this.mappingTable = this.mappingTable.filter(item => item.id !== id);
      } else if (!!this.selectedModel && !!this.selectedKey) {
        const delDisplayData = this.displayData.filter(item => item.id === id);
        this.keysForm = this.keysForm.filter(item => item !== delDisplayData[0]['key']);
        this.displayData = this.displayData.filter(item => item.id !== id);
        this.displayData = this.displayData.slice();
        this.mappingTable = this.mappingTable.filter(item => item.id !== id);
      } else {
        this.mappingTable = this.mappingTable.filter(item => item.id !== id);
        this.displayData = this.mappingTable;
        this.displayData = this.displayData.slice();
      }
      this.message.create('success', 'successfully deleted!');
    });
    console.log(this.keysForm);
  }

  showDeleteConfirm(id): void {
    this.modalService.confirm({
      nzTitle: 'Whether to delete this record?',
      nzContent: '',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.delMappingForm(id);
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  // 編輯、修改workflowFormMapping
  showModal2(form): void {
    this.editOldForm = form;
    this.signDescription = form['workflowForm']['description'];
    this.isVisible2 = true;
    this.mappingId = form.id;
    this.updateModel = form.model;
    this.updateKey = form.key;
    this.workflowFormId = form.workflowFormId;
  }

  handleOk2(): void {
    this.isOkLoading2 = true;
    const form = {
      id: this.mappingId,
      model: this.updateModel,
      key: this.updateKey,
      workflowFormId: this.workflowFormId,
    };
    this.updateKey = this.updateKey.trim();
    if (this.updateKey.toUpperCase()) {
      let flag;
      if (this.signDescription === '[DFQ]獎懲規則簽核' || this.signDescription === '[DFQ]物料良率簽核' || this.signDescription === '[DFQ]目標良率生成簽核' || this.signDescription === '[DFQ]MB不良率簽核' || this.signDescription === '[DFC]獎懲規則簽核') {
        flag = new RegExp(/^[a-zA-Z0-9-]+\_[a-zA-Z0-9-]+$/).test(this.updateKey);
      } else if (this.signDescription === '[MRR]NUDD風險評估' || this.signDescription === '[DFC]標準工時簽核' || this.signDescription === '[DFC]目標工時簽核' || this.signDescription === '[DFC]軍令狀') {
        flag = new RegExp(/^([a-zA-Z0-9-]+\_){2}[a-zA-Z0-9-]+$/).test(this.updateKey);
      } else if (this.signDescription === '[DFQ]C4/C5 Meeting Review') {
        flag = new RegExp(/^([a-zA-Z0-9-\s]+\_){3}[a-zA-Z0-9-]+$/).test(this.updateKey);
      }
      if (!flag) {
        this.message.create('error', '請按照規則輸入key值！Please enter the key value according to the rules! ');
        this.isOkLoading2 = false;
        return;
      } else {
        this.service.getKeyDescribe(this.workflowFormId, this.updateKey).subscribe(res => {
          if (res[0]['workflowFormMappings'].length !== 0) {
            this.message.create('error', 'Key already exists, please re-enter!');
            this.isOkLoading2 = false;
            return;
          } else {
            this.service.updateMappingForm(form).subscribe(
              resu => {
                this.service.getWorkflowFormMapping(
                  {
                    include: [{
                      relation: 'workflowSignatories'
                    }, {
                      relation: 'workflowForm'
                    }],
                    where: {
                      id: resu['id']
                    }
                  }
                ).subscribe(ress => {
                  Object.assign(this.editOldForm, ress[0]);
                  this.isVisible2 = false;
                  this.isOkLoading2 = false;
                  this.message.create('success', 'Successfully modified!');
                });
              },
              err => {
                this.isVisible2 = false;
                this.isOkLoading2 = false;
                this.message.create('error', 'fail to edit!');
              });
          }
        });
      }
    } else {
      this.message.create('error', 'Please enter Key!');
      this.isOkLoading2 = false;
      return;
    }
  }

  handleCancel2(): void {
    this.isVisible2 = false;
  }

  // 向workflowSignatory中添加資料
  showModal1(): void {
    this.isVisible1 = true;
    this.addStage = '';
    this.addStageDesc = '';
    this.addPicId = '';
    this.addIsDynamic = '';
  }

  handleOk1(): void {
    this.isOkLoading1 = true;
    const form = {
      stage: this.addStage,
      stageDesc: this.addStageDesc,
      picId: this.addPicId,
      isDynamic: this.addIsDynamic,
      workflowFormMappingId: this.workflowFormMappingId
    };
    this.service.addSignForm(form).subscribe(res => {
      this.workflowSignatory.push(res);
      this.workflowSignatory = this.workflowSignatory.slice();
      this.isVisible1 = false;
      this.isOkLoading1 = false;
      this.message.create('success', 'Added successfully!');
    },
      err => {
        this.isVisible1 = false;
        this.isOkLoading1 = false;
        this.message.create('error', 'add failed!');
      });
  }

  handleCancel1(): void {
    this.isVisible1 = false;
  }

  // 編輯、修改workflowSignatory
  showModal3(form): void {
    this.oldForm = form;
    this.isVisible3 = true;
    this.signatoryId = form.id;      // 通過id獲取到唯一的那一筆資料
    this.updateStage = form.stage;
    this.updateStageDesc = form.stageDesc;
    this.updatePicId = form.picId;
    this.updateIsDynamic = form.isDynamic;
    this.workflowFormMappingId = form.workflowFormMappingId;
  }

  handleOk3() {
    this.isOkLoading3 = true;
    const form = {
      id: this.signatoryId,
      stage: this.updateStage,
      stageDesc: this.updateStageDesc,
      picId: this.updatePicId,
      isDynamic: this.updateIsDynamic,
      workflowFormMappingId: this.workflowFormMappingId,
    };
    this.service.updateSignForm(form).subscribe(
      res => {
        Object.assign(this.oldForm, res);
        this.isVisible3 = false;
        this.isOkLoading3 = false;
        this.message.create('success', 'Successfully modified');
      },
      err => {
        this.isVisible3 = false;
        this.isOkLoading3 = false;
        this.message.create('error', 'fail to edit!');
      });
  }

  handleCancel3(): void {
    this.isVisible3 = false;
  }

  // 刪除workflowSignatory
  delSignForm(data) {
    for (let index = 0; index < this.displayData.length; index++) {
      if (this.displayData[index]['id'] === this.oldWorkflowSign['id']) {
        this.service.delSignForm(data.id).subscribe(res => {
          this.displayData[index].workflowSignatories = this.workflowSignatory.filter(item => item['id'] !== data['id']);
          this.workflowSignatory = this.workflowSignatory.filter(item => item['id'] !== data['id']);
          this.message.create('success', 'successfully deleted!');
        });
      }
    }
  }

  showDeleteConfirm1(id): void {
    this.modalService.confirm({
      nzTitle: 'Whether to delete this record?',
      nzContent: '',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.delSignForm(id);
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  getAddPicId(ad) {
    if (!!ad) {
      this.addPicId = ad.EmpID;
    }
  }


  getUpdatePicId(update) {
    if (update) {
      this.updatePicId = update.EmpID;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
