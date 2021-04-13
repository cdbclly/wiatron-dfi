import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NewmodelMaintainService } from '../newmodel-maintain.service';
import { ModelTypeMappingApi, BasicModelApi, GroupModelApi } from '@service/dfc_sdk/sdk';
import { NzMessageService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-or-update-model',
  templateUrl: './add-or-update-model.component.html',
  styleUrls: ['./add-or-update-model.component.scss']
})
export class AddOrUpdateModelComponent implements OnInit {

  @Input() addModelVisible;
  @Input() editModel;
  @Input() productTypeSelect;

  @Output() cancelVisible = new EventEmitter<any>();
  // 顯示錯誤訊息
  showError = false;
  modelNameList = []; // 用於存放 現有Model, 以避免重名

  productTypeList;
  constructor(
    private modelTypeMappingApi: ModelTypeMappingApi,
    private basicModelApi: BasicModelApi,
    private groupModelApi: GroupModelApi,
    private newmodelMaintainService: NewmodelMaintainService,
    private message: NzMessageService
  ) {

  }

  ngOnInit() {
    // 下拉式productType
    this.productTypeList = this.modelTypeMappingApi.find({});

  }

  async addOrUpdateModel() {
    // 判斷FCST是否為數字
    if (this.editModel.FCST && this.editModel.FCST.length > 0 && !this.checkRate(this.editModel.FCST)) {
      this.showError = true;
      return;
    }
    // 判斷runIn是否為數字
    // if (this.editModel.runIn && this.editModel.runIn.length > 0 && !this.checkRate(this.editModel.runIn)) {

    //   this.showError = true;
    //   return;
    // }

    // 重新賦予物件，因為model & groupModel物件不同
    const modelObj = this.editModel.type === 1 ? {
      modelId: this.editModel.modelId,
      projectNameId: this.editModel.projectNameId,
      modelName: this.editModel.modelName,
      FCST: this.editModel.FCST,
      // runIn: this.editModel.runIn,
      remark: '',
      isMilitary: this.editModel.isMilitary
    } : {
        groupModelId: this.editModel.groupModelId,
        projectNameId: this.editModel.projectNameId,
        groupModelName: this.editModel.modelName,
        remark: '',
        isMilitary: this.editModel.isMilitary
      };

    if (!this.editModel.modelId && !this.editModel.groupModelId) {

      this.modelNameList = [];
      await this.newmodelMaintainService.getModel({projectNameId: this.editModel.projectNameId}).toPromise().then(modelData => {
        modelData.forEach(item => {
          this.modelNameList.push(item['modelName']);
        });
      });
      await this.newmodelMaintainService.getGroupModel({projectNameId: this.editModel.projectNameId}).toPromise().then(modelData => {
        modelData.forEach(item => {
          this.modelNameList.push(item['groupModelName']);
        });
      });
      console.log(this.modelNameList);
      if (this.modelNameList.includes(this.editModel.modelName.toLocaleUpperCase())) {
        this.message.create('error', 'Model Name重複！');
        return;
      }
      const obs = this.editModel.type === 1 ?
      this.basicModelApi.create(modelObj) :
      this.groupModelApi.create(modelObj);
      // add
      obs.subscribe(
        () => {
          this.cancel();
        }
      );
      return this.modelNameList;
    } else {
      // edit
      console.log(modelObj);
      const obs = this.editModel.type === 1 ?
        this.basicModelApi.upsert(modelObj) :
        this.groupModelApi.upsert(modelObj);
      obs.subscribe(
        () => {
          this.cancel();
        }
      );
    }
  }

  checkRate(value) {
    const re = /^[0-9]+.?[0-9]*/;
    if (!re.test(value)) {
      return false;
    }
    return true;
  }

  cancel() {
    this.cancelVisible.emit();
  }
}
