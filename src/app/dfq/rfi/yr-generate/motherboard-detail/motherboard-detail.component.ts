import { YrQueryService } from './../query-form/yr-query.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { switchMap, map } from 'rxjs/operators';
import { PartInterface, View_ModelMaterialPartInterface } from '@service/dfq_sdk/sdk';
import { YrGenerateService } from '../yr-generate.service';

@Component({
  selector: 'app-motherboard-detail',
  templateUrl: './motherboard-detail.component.html',
  styleUrls: ['./motherboard-detail.component.scss']
})
export class MotherboardDetailComponent implements OnInit, OnChanges {

  material = 'MB上所有物料良率明細';
  @Input() projectName;
  @Input() plant;
  @Input() product;
  @Input() isVisiblePic;
  @Input() mbYrEditId;
  @Input() mbDiscussionId;
  @Output() mBoardCancel = new EventEmitter<any>();
  @Output() savedMBoardCancel = new EventEmitter<any>();
  modalShow = false;
  showData: {}[];
  editCache: { [key: string]: any } = {};
  showPart: any;
  saved = false;
  userId: string;
  fresh = true;

  constructor(
    private modalService: NzModalService,
    private message: NzMessageService,
    private yrGenerateService: YrGenerateService,
    private yrQueryService: YrQueryService
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('$DFI$userID');
  }

  ngOnChanges() {
    if (this.isVisiblePic) {
      this.saved = false;
      this.yrQueryService.getMb(this.projectName, this.plant.split('-')[1], this.product).pipe(switchMap(
        (res) => {
          this.showData = res;
          this.modalShow = true;
          this.updateEditCache();
          return this.yrQueryService.getDfqMb(this.plant.split('-')[1], this.product);
        }),
        map(
          (ree) => {
            this.showPart = ree;
          }
        )
      ).subscribe();
    }
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.showData.findIndex(item => item['id'] === id);
    this.editCache[id] = {
      data: { ...this.showData[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    this.modalService.confirm({
      nzTitle: '<i>Save Alert</i>',
      nzContent: '<b>Do you Want to Save?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnCancel: () => { this.editCache[id].edit = false; },
      nzOnOk: async () => {
        let mbYield = 1;
        const index = this.showData.findIndex(item => item['id'] === id);
        if (this.showData.find(item => item['partId'] === this.editCache[id].data.partId)) {
          this.message.create('error', 'The item number already exists!');
          return;
        } else {
          this.yrGenerateService.updateProjectPart(this.editCache[id].data.id, this.editCache[id].data).pipe(
            switchMap(re => {
              return this.yrQueryService.getMb(this.projectName, this.plant.split('-')[1], this.product);
            }),
            switchMap((ree: View_ModelMaterialPartInterface[]) => {
              for (let j = 0; j < ree.length; j++) {
                mbYield *= ree[j]['totalYieldRate'];
              }
              this.yrGenerateService.updateDiscussion(this.mbDiscussionId, {
                // pic: this.userId,
                status: 1
              }).subscribe();
              return this.yrGenerateService.updateModelMaterial(this.mbYrEditId, {
                yieldRate: mbYield
              });
            }),
            map(() =>
              this.yrQueryService.getMbByPart(this.projectName, this.plant.split('-')[1], this.product, this.editCache[id].data.partId).subscribe(ree => {
                Object.assign(this.showData[index], ree[0]);
                this.message.create('success', 'Modification is successful, please modify EDM in time!');
                this.editCache[id].edit = false;
                this.saved = true;
              })
            )
          ).subscribe();
        }
      }
    });
  }

  updateEditCache(): void {
    this.showData.forEach(item => {
      this.editCache[item['id']] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  handleCancel() {
    this.modalShow = false;
    this.isVisiblePic = false;
    if (this.saved) {
      this.savedMBoardCancel.emit(this.isVisiblePic);
    } else {
      this.mBoardCancel.emit(this.isVisiblePic);
    }
  }

}
