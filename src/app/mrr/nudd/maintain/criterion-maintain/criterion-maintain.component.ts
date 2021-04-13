import { Component, OnInit } from '@angular/core';
import { CriterionService } from './criterion.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
@Component({
  selector: 'app-criterion-maintain',
  templateUrl: './criterion-maintain.component.html',
  styleUrls: ['./criterion-maintain.component.scss']
})
export class CriterionMaintainComponent implements OnInit {
  // 這兩個是啥忘記了
  i = 0;
  j = 1;
  // 控制下面那一大坨顯示
  modelFlag = false;
  queryForm;
  processes = [];
  processClicked = '';
  processClickedName = '';
  addProcessFlag = false;
  isProcessConfirmLoading = false;
  risk = [];
  processForm = {
    'name': '',
    'dimensionId': 0
  };
  /** DESISGN */
  desisgnitem = [];
  desisgnClicked = '';
  desisgnClickName = '';
  desisgnItemFlag = false;
  addDesisgnitemFlag = false;
  isDesisgnitemConfirmLoading = false;
  desisgnForm = {
    'id': '',
    'name': '',
    'picturePath': '',
    'processTypeId': ''
  };
  /** POSITION */
  positions = [];
  positionClicked = '';
  positionClickedName = '';
  positionFlag = false;
  addPositionFlag = false;
  isPositionConfirmLoading = false;
  positionForm = {
    'name': '',
    'code': '',
    'designItemId': ''
  };
  /** POINT */
  points = [];
  pointFlag = false;
  addPointFlag = false;
  isPointConfirmLoading = false;
  pointForm = {
    'name': '',
    'sideId': ''
  };
  /** Risk */
  withDesisgnFlag = false;
  isWithDesisgnLoading = false;
  riskTable = ['技術風險', '規格是否可以完成', '流程風險', '供應鏈', '風險等級'];
  riskTableData = [];
  riskParam = [];
  radioValue = '0';
  judgeMode = false;
  designItem;
  judgeType;
  // 權限控制
  role: string;
  enableUse = false;
  SQMLeaderUse = false;
  // 可編輯項的參數
  updateTitle;
  itemName;
  updateNameFlag = false;
  updateName;
  clickProcessData;
  clickDesignItemData;
  clickSideData;
  addProcessItem;
  addDesignItem;
  addSideItem;
  constructor(
    private criterionService: CriterionService,
    private message: NzMessageService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    // 權限管控
    this.role = localStorage.getItem('$DFI$userRole');
    const roles = this.role.toUpperCase().split(',');
    if (roles.indexOf('SQM') !== -1 || roles.indexOf('IT') !== -1) {
      this.enableUse = true;
    }
    if (roles.indexOf('SQM LEADER') !== -1) {
      this.SQMLeaderUse = true;
      this.enableUse = true;
    }
  }
  onModelFlag(event) {
    this.modelFlag = event;
  }

  onQueryForm(event) {
    this.processes = [];
    this.queryForm = event;
    this.processForm.dimensionId = this.queryForm['dimension'];
    this.criterionService.getProcess(this.queryForm['dimension']).subscribe(res => {
      this.processes = res;
    });
    this.desisgnItemFlag = false;
    this.positionFlag = false;
    this.pointFlag = false;
  }

  isEnabledProcess(item) {
    this.criterionService.updateProcessType(item).subscribe(res => {
    });
  }

  isEnabledDesignItem(item) {
    this.criterionService.updateDesignItem(item).subscribe(res => {
    });
  }

  isEnabledPosition(item) {
    this.criterionService.updateSide(item).subscribe(res => {
    });
  }

  isEnabledPoint(item) {
    this.criterionService.updatePoint(item).subscribe(res => {
    });
  }
  // 點擊修改工藝名
  clickProcessName(item) {
    if (item['designItems'].length > 0) {
      this.updateNameFlag = false;
      this.clickProcess(item);
    } else {
      for (const dimensionId in item) {
        if (item.hasOwnProperty(dimensionId)) {
          this.updateTitle = '修改工藝名';
          this.itemName = '工藝';
        }
      }
      this.updateNameFlag = true;
      this.updateName = item['name'];
    }
    this.clickProcessData = item;
  }
  // 點擊修改項目名
  clickDesignItemName(item) {
    if (item['sides'].length > 0) {
      this.updateNameFlag = false;
      this.clickDesisgnItem(item);
    } else {
      for (const processTypeId in item) {
        if (item.hasOwnProperty(processTypeId)) {
          this.updateTitle = '修改項目名';
          this.itemName = '項目';
        }
      }
      this.updateNameFlag = true;
      this.updateName = item['name'];
    }
    this.clickDesignItemData = item;
  }
  // 點擊修改位置名
  clickSideName(item) {
    if (item['points'].length > 0) {
      this.updateNameFlag = false;
      this.clickPosition(item);
    } else {
      for (const designItemId in item) {
        if (item.hasOwnProperty(designItemId)) {
          this.updateTitle = '修改位置名';
          this.itemName = '位置';
        }
      }
      this.updateNameFlag = true;
      this.updateName = item['name'];
    }
    this.clickSideData = item;
  }
  // 修改保存
  updateOk() {
    this.updateName = this.updateName.trim();
    if (this.updateName) {
      if (this.itemName === '工藝') {
        this.criterionService.getProcessData({
          where: {
            id: this.clickProcessData.id,
            name: this.updateName
          }
        }).subscribe(res => {
          if (res.length !== 0) {
            this.message.create('error', 'This processType name already exists, please re-enter！');
            return;
          } else {
            this.criterionService.updateProcessType({ 'id': this.clickProcessData.id, 'name': this.updateName, 'dimensionId': this.clickProcessData.dimensionId, 'enabled': this.clickProcessData.enabled }).subscribe(data => {
              Object.assign(this.clickProcessData, data);
              this.processClickedName = this.updateName;
              this.message.create('success', 'Successfully modified！');
              this.updateNameFlag = false;
            });
          }
        });
      } else if (this.itemName === '項目') {
        this.criterionService.getDesignItemData({
          where: {
            id: this.clickDesignItemData.id,
            name: this.updateName
          }
        }).subscribe(res => {
          if (res.length !== 0) {
            this.message.create('error', 'This item name already exists, please re-enter！');
            return;
          } else {
            this.criterionService.updateDesignItem({ 'id': this.clickDesignItemData.id, 'name': this.updateName, 'enabled': this.clickDesignItemData.enabled, 'picturePath': this.clickDesignItemData.picturePath, 'processTypeId': this.clickDesignItemData.processTypeId }).subscribe(data => {
              Object.assign(this.clickDesignItemData, data);
              this.desisgnClickName = this.updateName;
              this.message.create('success', 'Successfully modified！');
              this.updateNameFlag = false;
            });
          }
        });
      } else if (this.itemName === '位置') {
        this.criterionService.getSideData({
          where: {
            id: this.clickSideData.id,
            name: this.updateName
          }
        }).subscribe(res => {
          if (res.length !== 0) {
            this.message.create('error', 'This position name aAlready exists, please re-enter！');
            return;
          } else {
            this.criterionService.updateSide({ 'id': this.clickSideData.id, 'name': this.updateName, 'enabled': this.clickSideData.enabled, 'code': this.clickSideData.code, 'designItemId': this.clickSideData.designItemId }).subscribe(data => {
              Object.assign(this.clickSideData, data);
              this.message.create('success', 'Successfully modified！');
              this.updateNameFlag = false;
            });
          }
        });
      }
    } else {
      this.message.create('error', 'Please enter a name！');
      return;
    }
  }

  updateCancel() {
    this.updateNameFlag = false;
  }

  // PROCESS
  clickProcess(item) {
    if (item['designItems'].length === 0) {
      this.addProcessItem = item;
    }
    if (item['enabled']) {
      this.criterionService.getDesisgnItem(item['id']).subscribe(res => {
        this.desisgnitem = res;
        this.desisgnForm.processTypeId = item['id'];
        this.processClicked = item['id'];
        this.processClickedName = item['name'];
        this.desisgnItemFlag = true;
        this.positionFlag = false;
        this.pointFlag = false;
      });
    } else {
      this.desisgnItemFlag = false;
      this.positionFlag = false;
      this.pointFlag = false;
    }
  }
  addProcesses() {
    this.addProcessFlag = true;
  }

  processModelOk(): void {
    if (this.processForm.name === '') {
      this.message.create('error', 'Please enter the processType');
      return;
    }
    let flag = true;
    this.processes.forEach(process => {
      if (process.name === this.processForm.name) {
        flag = false;
      }
    });
    if (flag) {
      this.isProcessConfirmLoading = true;
      this.criterionService.addProcess(this.processForm)
        .subscribe(
          res => {
            res['designItems'] = [];
            this.addProcessItem = res;
            this.processes.push(this.addProcessItem);
            this.message.create('success', 'Added successfully！');
          });
      setTimeout(() => {
        this.addProcessFlag = false;
        this.isProcessConfirmLoading = false;
        // this.processForm.id = '';
        this.processForm.name = '';
      }, 200);
    } else {
      this.message.create('error', 'Adding failed, there has been a duplicate process！');
      this.isProcessConfirmLoading = false;
    }
  }

  processModelCancel() {
    this.addProcessFlag = false;
    // this.processForm.id = '';
    this.processForm.name = '';
  }
  // Desisgn
  clickDesisgnItem(item) {
    if (item['sides'].length === 0) {
      this.addDesignItem = item;
    }
    if (item['enabled']) {
      this.criterionService.getSide(item['id']).subscribe(res => {
        this.positions = res;
        this.positionForm.designItemId = item['id'];
        this.desisgnClicked = item['id'];
        this.desisgnClickName = item['name'];
        this.positionFlag = true;
        this.pointFlag = false;
      });
    } else {
      this.positionFlag = false;
      this.pointFlag = false;
    }
  }

  addDesisgn() {
    this.addDesisgnitemFlag = true;
  }

  desisgnModelOk(): void {
    if (this.desisgnForm.id === '') {
      this.message.create('error', 'Please enter the item code！');
      return;
    } else if (this.desisgnForm.name === '') {
      this.message.create('error', 'Please enter the item name！');
      return;
    } else if (this.desisgnForm.processTypeId === '') {
      this.message.create('error', 'Please enter the code！');
      return;
    }
    this.isDesisgnitemConfirmLoading = true;
    this.criterionService.addDesisgnItem(this.desisgnForm)
      .subscribe(
        res => {
          if (res.processTypeId === this.processClicked) {
            this.addProcessItem['designItems'].push(res);
            res['sides'] = [];
            this.addDesignItem = res;
            this.desisgnitem.push(this.addDesignItem);
          }
          this.message.create('success', 'Added successfully！');
        },
        err => {
          this.message.create('error', 'Adding failed, item code already exists！');
        });
    setTimeout(() => {
      this.desisgnForm.id = '';
      this.desisgnForm.name = '';
      this.desisgnForm.picturePath = '';
      this.addDesisgnitemFlag = false;
      this.isDesisgnitemConfirmLoading = false;
    }, 700);
  }

  desisgnModelCancel() {
    this.addDesisgnitemFlag = false;
    this.desisgnForm.id = '';
    this.desisgnForm.name = '';
    this.desisgnForm.picturePath = '';
  }

  // 風險評分判定方式
  showJudgeMode() {
    if (this.radioValue === '0') {
      this.judgeMode = true;
    } else if (this.radioValue === '1') {
      this.judgeMode = false;
    }
  }
  // RISK
  clickWithDesisgnModel(data) {
    this.criterionService.getDesignItem(data.id).subscribe(res => {
      if (res[0]['isFactNumeric']) {
        this.radioValue = '1';
      } else {
        this.radioValue = '0';
      }
      this.showJudgeMode();
    });
    this.withDesisgnFlag = true;
    this.designItem = data;
    this.criterionService.getRisk(data.id)
      .subscribe(
        res => {
          this.risk = res;
          this.riskTableData = [];
          if (res === [] || res.length < 20) {
            for (let i = 0; i < 5; i++) {
              const array = [];
              for (let j = 0; j < 5; j++) {
                if (j !== 4) {
                  array.push({
                    'name': this.riskTable[j],
                    'level': i + 1,
                    'maximum': null,
                    'minimum': null,
                    'designItemId': data.id
                  });
                } else if (j === 4) {
                  array.push(i + 1);
                }
              }
              this.riskTableData.push(array);
            }
          } else if (res.length === 20) {
            for (let i = 0; i < 5; i++) {
              const array = [];
              for (let j = 0; j < 5; j++) {
                if (j !== 4) {
                  array.push(this.getRisk(this.riskTable[j], i + 1));
                } else if (j === 4) {
                  array.push(i + 1);
                }
              }
              this.riskTableData.push(array);
            }
          }
        });
  }
  WithDesisgnModelOk(): void {
    this.isWithDesisgnLoading = true;
    // 判斷選擇的哪種判定方式
    if (this.radioValue === '1') {
      this.designItem['isFactNumeric'] = true;
      this.criterionService.updateDesignItem(this.designItem).subscribe();
    } else {
      this.designItem['isFactNumeric'] = false;
      this.criterionService.updateDesignItem(this.designItem).subscribe();
      this.riskTableData.forEach((riskTr) => {
        for (let i = 0; i < 4; i++) {
          if (riskTr[i].maximum === '') {
            riskTr[i].maximum = null;
          } else if (riskTr[i].minimum === '') {
            riskTr[i].minimum = null;
          }
          this.criterionService.addRisk(riskTr[i]).toPromise().then();
        }
      });
    }
    setTimeout(() => {
      this.withDesisgnFlag = false;
      this.isWithDesisgnLoading = false;
    }, 700);
  }

  WithDesisgnModelCancel() {
    this.withDesisgnFlag = false;
    this.riskTableData = [];
  }

  getRisk(text, index) {
    let data;
    this.risk.forEach(r => {
      if (r.name === (text) && r.level === index) {
        data = r;
        return;
      }
    });
    return data;
  }

  clickRisk(x, y) {
    // console.log(this.riskTableData[x][y]);
  }
  // Position
  clickPosition(item) {
    if (item['points'].length === 0) {
      this.addSideItem = item;
    }
    if (item['enabled']) {
      this.criterionService.getPoint(item['id']).subscribe(res => {
        this.points = res;
        this.pointForm.sideId = item['id'];
        this.positionClicked = item['id'];
        this.positionClickedName = item['name'];
        this.pointFlag = true;
      });
    } else {
      this.pointFlag = false;
    }
  }

  addPositions() {
    this.addPositionFlag = true;
  }

  positionsModelOk(): void {
    if (this.positionForm.name === '') {
      this.message.create('error', 'Please enter position');
      return;
    } else if (this.positionForm.code === '') {
      this.message.create('error', 'Please enter the code！');
      return;
    } else if (this.positionForm.designItemId === '') {
      this.message.create('error', 'Please enter the item code！');
      return;
    }
    let flag = false;
    this.positions.forEach(p => {
      const param = this.positionForm.name + this.positionForm.code;
      if (param === p.name + p.code) {
        flag = true;
        this.message.create('error', param + 'already exists！');
      }
    });
    if (flag) {
      return;
    }
    this.isPositionConfirmLoading = true;
    this.criterionService.addSide(this.positionForm)
      .subscribe(
        res => {
          if (res['designItemId'] === this.desisgnClicked) {
            this.addDesignItem['sides'].push(res);
            res['points'] = [];
            this.addSideItem = res;
            this.positions.push(this.addSideItem);
          }
          this.message.create('success', 'Added successfully！');
        });
    setTimeout(() => {
      this.addPositionFlag = false;
      this.isPositionConfirmLoading = false;
      this.positionForm.code = '';
      this.positionForm.name = '';
      this.positionForm.designItemId = this.desisgnClicked;
    }, 700);
  }

  positionsModelCancel() {
    this.addPositionFlag = false;
    this.positionForm.code = '';
    this.positionForm.name = '';
    this.positionForm.designItemId = this.desisgnClicked;
  }

  // POINT
  addPoint() {
    this.addPointFlag = true;
  }
  pointModelOk(): void {
    const reg = /^[0-9]$/;
    if (this.pointForm.name === '') {
      this.message.create('error', 'Please enter the code！');
      return;
    } else if (!reg.test(this.pointForm.name)) {
      this.message.create('error', 'The code entered must be a number from 0 to 9！');
      return;
    }
    let flag = false;
    this.points.forEach(p => {
      if (p.name === this.pointForm.name) {
        flag = true;
      }
    });
    if (flag) {
      this.message.create('error', 'The input code has been duplicated！');
      return;
    }
    this.isPointConfirmLoading = true;
    this.criterionService.addPoint(this.pointForm)
      .subscribe(
        res => {
          if (res.sideId === this.positionClicked) {
            this.addSideItem['points'].push(res);
            this.points.push(res);
          }
          this.message.create('success', 'Added successfully！');
        });
    setTimeout(() => {
      this.addPointFlag = false;
      this.isPointConfirmLoading = false;
      this.pointForm.name = '';
      this.pointForm.sideId = this.positionClicked;
    }, 700);
  }

  pointModelCancel() {
    this.addPointFlag = false;
    this.pointForm.name = '';
    this.pointForm.sideId = this.positionClicked;
  }

  add() {
  }

  delPoint(point) {
    this.modalService.confirm({
      nzTitle: 'Are you sure to delete this record？',
      nzContent: '',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        const id = point.id;
        this.criterionService.deletePoint(id).subscribe(res => {
          this.points = this.points.filter(function (item) {
            return item.id !== id;
          });
          this.message.create('success', 'Successfully deleted！');
        });
      },
      nzCancelText: 'No'
    });
  }

  delPosition(position) {
    this.modalService.confirm({
      nzTitle: 'Are you sure to delete this record？',
      nzContent: '',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        const id = position.id;
        this.criterionService.deleteSide(id).subscribe(res => {
          this.positions = this.positions.filter(function (item) {
            return item.id !== id;
          });
          this.message.create('success', 'Successfully deleted！');
          this.pointFlag = false;
        });
      },
      nzCancelText: 'No'
    });
  }

  delDesisgnItem(desisgnItem) {
    this.modalService.confirm({
      nzTitle: 'Are you sure to delete this record？',
      nzContent: '',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        const id = desisgnItem.id;
        this.criterionService.deleteDesignItem(id).subscribe(res => {
          this.desisgnitem = this.desisgnitem.filter(function (item) {
            return item.id !== id;
          });
          this.message.create('success', 'Successfully deleted！');
          this.pointFlag = false;
          this.positionFlag = false;
        });
      },
      nzCancelText: 'No'
    });
  }
}
