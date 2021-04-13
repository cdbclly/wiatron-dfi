import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NewmodelMaintainService } from '../newmodel-maintain.service';
@Component({
  selector: 'app-add-group-model',
  templateUrl: './add-group-model.component.html',
  styleUrls: ['./add-group-model.component.scss']
})
export class AddGroupModelComponent implements OnInit, OnChanges {

  @Input() addGroupModelVisible;
  @Input() groupModelMappingSelect;
  @Input() editGroupModel;
  @Input() modifyType; // 表明是 新增 / 修改
  @Output() cancelVisible = new EventEmitter<any>();
  selectedValue;
  number = false;
  value = 0;

  constructor(
    private newmodelMaintainService: NewmodelMaintainService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['modifyType'] && changes['modifyType'].currentValue) {
      if (this.modifyType === '修改') {
        this.value = this.editGroupModel['count'];
        this.selectedValue = this.editGroupModel['modelName'];
      }
    }
  }

  addOrUpdateModel() {
    if (this.editGroupModel) {
      // add
      this.newmodelMaintainService.addGroupModelMapping(
        {
          groupModelId: this.editGroupModel.groupModelId,
          count: this.value,
          modelId: this.selectedValue.modelId
        }
      ).subscribe(
        () => {
          this.cancel();
        }
      );
    }
  }

  editOrUpdateModel() {
    this.newmodelMaintainService.editGroupModelMapping(this.editGroupModel['groupModelMappingid'], {
      count: this.value
    }).subscribe(res => {
      this.cancel();
    });
  }

  cancel() {
    this.cancelVisible.emit();
  }

  checkRate() {
    const re = /^[0-9]+.?[0-9]*/;
    if (!re.test(this.value.toString())) {
      this.number = false;
    }
    if (this.value > 0 && this.selectedValue) {
      this.number = true;
    } else {
      this.number = false;
    }
  }

  handleCancel() {
    this.selectedValue = null;
    this.value = 0;
    this.cancelVisible.emit();
  }

  handleOk() {
    // add
    this.handleCancel();
  }
}
