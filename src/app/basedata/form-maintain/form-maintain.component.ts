import { ProjectNameProfile } from '../../service/dfc_sdk/sdk/models/ProjectNameProfile';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { FormMaintainServiceService } from './form-maintain-service.service';

@Component({
  selector: 'app-form-maintain',
  templateUrl: './form-maintain.component.html',
  styleUrls: ['./form-maintain.component.scss']
})
export class FormMaintainComponent implements OnInit {
  name: string;
  workFlowForms = [];
  isVisible = false;
  isOkLoading = false;
  addName;
  addRoutingPath;
  addDescription;
  isVisible1 = false;
  isOkLoading1 = false;
  workflowFormId;
  updateName;
  updateRoutingPath;
  updateDescription;
  workFlowTemp: {}[];
  role;
  constructor(
    private service: FormMaintainServiceService,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {
    this.role = localStorage.getItem('$DFI$userRole');
  }

  ngOnInit() {
    this.getWorkflowForm();
  }
  onSearch(name) {
    if (name) {
      this.workFlowForms = this.workFlowForms.filter(item => item.name.includes(name));
    } else {
      this.workFlowForms = this.workFlowTemp;
      this.message.create('error', 'Please enter Name!');
    }
  }

  // 獲取
  getWorkflowForm() {
    this.service.getWorkflowForm().subscribe(res => {
      this.workFlowForms = res;
      this.workFlowTemp = res;
    });
  }

  // 添加
  showModal(): void {
    this.isVisible = true;
    this.addName = '';
    this.addRoutingPath = '';
    this.addDescription = '';
  }

  handleOk(): void {
    this.isOkLoading = true;
    const form = {
      name: this.addName,
      routingPath: this.addRoutingPath,
      description: this.addDescription
    };
    this.service.addForm(form).subscribe(
      res => {
        this.workFlowForms.push(res);
        this.isVisible = false;
        this.isOkLoading = false;
        this.message.create('success', '添加成功!');
      },
      err => {
        this.isVisible = false;
        this.isOkLoading = false;
        this.message.create('error', '添加失敗!');
      }
    );
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  // 刪除
  deleteForm(id) {
    this.service.deleteForm(id).subscribe(res => {
      this.message.create('success', '刪除成功!');
      this.workFlowForms = this.workFlowForms.filter(item => {
        return item.id !== id;
      });
    });
  }

  showDeleteConfirm(id): void {
    this.modalService.confirm({
      nzTitle: '是否删除此记录?',
      nzContent: '',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.deleteForm(id);
        this.getWorkflowForm();
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  // 修改
  showModal1(form): void {
    this.isVisible1 = true;
    this.workflowFormId = form.id;
    this.updateName = form.name;
    this.updateRoutingPath = form.routingPath;
    this.updateDescription = form.description;
  }

  handleOk1(): void {
    this.isOkLoading1 = true;
    const form = {
      id: this.workflowFormId,
      name: this.updateName,
      routingPath: this.updateRoutingPath,
      description: this.updateDescription
    };
    this.service.updateForm(form).subscribe(
      res => {
        this.workFlowForms.push(res);
        this.getWorkflowForm();
        this.isVisible1 = false;
        this.isOkLoading1 = false;
        this.message.create('success', '修改成功!');
      },
      err => {
        this.isVisible1 = false;
        this.isOkLoading1 = false;
        this.message.create('error', '修改失敗!');
      }
    );
  }

  handleCancel1(): void {
    this.isVisible1 = false;
  }
}
