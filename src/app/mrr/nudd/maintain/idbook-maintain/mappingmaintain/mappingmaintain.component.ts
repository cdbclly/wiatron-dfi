import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { IdbookMaintainService } from '../idbook-maintain.service';

@Component({
  selector: 'app-mappingmaintain',
  templateUrl: './mappingmaintain.component.html',
  styleUrls: ['./mappingmaintain.component.scss']
})
export class MappingmaintainComponent implements OnInit {
  operationList = [];
  materialList = [];
  process;
  processClick;
  processes = [];
  isLoading = false;
  operationLoad = false;
  materialLoad = false;
  saveFlag = false;
  @Input() data;
  @Input() formData;
  @Input() enableUse: boolean;
  @Input() SQMLeaderUse: boolean;
  constructor(public msg: NzMessageService,
    private message: NzMessageService,
    private service: IdbookMaintainService) {
  }

  ngOnInit(): void {
    this.getProcess();
  }

  query() {
    if (this.process == null || this.process === '') {
      this.message.create('error', 'Please enter process!');
      this.materialLoad = false;
      this.operationLoad = false;
      return;
    }
    this.processClick = {
      id: this.process.id,
      name: this.process.name,
      productId: this.process.productId,
      materials: this.process.materials,
      operations: this.process.operations
    };
    this.isLoading = true;
    this.materialLoad = false;
    this.operationLoad = false;
    this.getOperationData();
    this.getMaterialData();
  }

  // Operation
  getOperationData(): void {
    this.service.getOperations(this.formData.product).subscribe(res => {
      const ret = [];
      res.forEach(function (operation, i) {
        ret.push({
          key: i.toString(),
          title: `${operation['name']}`,
          description: operation,
          changeDirection: '',
          direction: 'left'
        });
      });
      this.service.getProcess(this.formData.product).subscribe(ProcessRes => {
        ProcessRes.forEach(item => {
          if (item.id === this.processClick.id) {
            this.processClick = {
              id: item.id,
              name: item.name,
              productId: item.productId,
              materials: item.materials,
              operations: item.operations
            };
          }
        });
        if (this.processClick['operations']) {
          const o = this.processClick['operations'];
          ret.forEach(function (operation) {
            o.forEach(opera => {
              if (operation['description'].id === opera.id) {
                operation.direction = 'right';
              }
            });
          });
        }
        this.operationList = ret;
        this.operationLoad = true;
        this.isLoading = false;
      });
    });
  }

  getMaterialData(): void {
    const ret = [];
    this.service.getMaterials(this.formData.product).subscribe(res => {
      res.forEach(function (material, i) {
        ret.push({
          key: i.toString(),
          title: `${material['desc']}`,
          description: material,
          changeDirection: '',
          direction: 'left'
        });
      });
      this.service.getProcess(this.formData.product).subscribe(ProcessRes => {
        ProcessRes.forEach(item => {
          if (item.id === this.processClick.id) {
            this.processClick = {
              id: item.id,
              name: item.name,
              productId: item.productId,
              materials: item.materials,
              operations: item.operations
            };
          }
        });
        if (this.processClick['materials']) {
          const m = this.processClick['materials'];
          ret.forEach(function (material) {
            m.forEach(mater => {
              if (material['description'].id === mater.id) {
                material.direction = 'right';
              }
            });
          });
        }
        this.materialList = ret;
        this.materialLoad = true;
        this.isLoading = false;
      });
    });
  }

  // 重置穿梭框
  reloadOperation(): void {
    this.getOperationData();
  }

  reloadMaterial(): void {
    this.getMaterialData();
  }

  changeOperation(ret: {}): void {
    ret['list'].filter(function (item) {
      item.changeDirection = ret['to'];
      return true;
    });
    this.saveFlag = true;
  }

  changeMaterial(ret: {}): void {
    ret['list'].filter(function (item) {
      item.changeDirection = ret['to'];
      return true;
    });
    this.saveFlag = true;
  }

  save() {
    // Operation
    const that = this;
    const processId = this.processClick.id;
    this.operationList.forEach(function (item) {
      if (item.changeDirection !== '') {
        if (item.changeDirection !== item.direction) {
          if (item.changeDirection === 'left') {
            that.service.findProcessOperation(processId, item.description.id).subscribe(
              res => {
                res.forEach(po => {
                  that.service.deleteProcessOperation(po['id']).subscribe(
                    delRes => {
                      item.direction = item.changeDirection;
                    }
                  );
                });
              });
          } else if (item.changeDirection === 'right') {
            that.service.createProcessOperation({
              processId: processId,
              operationId: item['description'].id
            }).subscribe(res => {
              item.direction = item.changeDirection;
            });
          }
        }
      }
    });
    // Material
    this.materialList.forEach(function (item) {
      if (item.changeDirection !== '') {
        if (item.changeDirection !== item.direction) {
          if (item.changeDirection === 'left') {
            that.service.findProcessMaterial(processId, item.description.id).subscribe(
              res => {
                res.forEach(po => {
                  that.service.deleteProcessMaterial(po['id']).subscribe(
                    delRes => {
                      item.direction = item.changeDirection;
                    }
                  );
                });
              });
          } else if (item.changeDirection === 'right') {
            that.service.createProcessMaterial({
              processId: processId,
              materialId: item['description'].id
            }).subscribe(res => {
              item.direction = item.changeDirection;
            });
          }
        }
      }
    });
    this.saveFlag = false;
  }

  getProcess() {
    this.service.getProcess(this.formData.product).subscribe(res => {
      this.processes = res;
    });
  }
}
