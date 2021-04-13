import { ModelMaterialFactorInterface } from './../../../../service/dfq_sdk/sdk/models/ModelMaterialFactor';
import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { YrGenerateService } from '../yr-generate.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { YrQueryService } from '../query-form/yr-query.service';
import { PercentPipe } from 'app/shared/percent.pipe';

@Component({
  selector: 'app-blank-model-factors',
  templateUrl: './blank-model-factors.component.html',
  styleUrls: ['./blank-model-factors.component.scss']
})
export class BlankModelFactorsComponent implements OnInit, OnChanges {

  @Input() blankModalMaterialId;
  @Input() blankmaterialDetails;
  @Input() isVisiblePic;
  @Input() blankModalMaterialName;
  @Input() plantMatch;
  @Output() blankModalCal = new EventEmitter<any>();
  @Output() savedblankModalCal = new EventEmitter<any>();
  modalShow = false;
  isCompleted = true;

  factorTypes = [];
  title: any;
  userId: string;

  constructor(
    private yrGenerateService: YrGenerateService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private yrQueryService: YrQueryService
  ) {
    this.userId = localStorage.getItem('$DFI$userID');
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.isVisiblePic) {
      this.title = this.blankModalMaterialName;
      this.yrGenerateService.getFactorType(this.blankModalMaterialId).subscribe(async res => {

        this.yrGenerateService.getPreFactors(this.blankmaterialDetails.id).subscribe(ree => {
          if (ree.length !== 0) {
            this.factorTypes = res;
            for (let index = 0; index < ree.length; index++) {
              this.factorTypes[index]['factorId'] = ree[index]['factorId'];
              this.factorTypes[index]['materialFactorId'] = ree[index]['id'];
            }
            this.modalShow = true;
          } else {
            this.factorTypes = res;
            this.modalShow = true;
          }
        });
      });
    }


  }

  save() {
    this.modalService.confirm({
      nzTitle: '<i>Save Alert</i>',
      nzContent: '<b>Do you Want to Save?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnOk: async () => {
        let count = 0;
        for (let j = 0; j < this.factorTypes.length; j++) {

          if (this.factorTypes[j].hasOwnProperty('factorId')) {
            count++;
          }
        }
        if (this.factorTypes.length !== count) {
          this.message.create('error', 'Please select all factors!');
          return;
        }

        this.isCompleted = false;
        const factorIds = [];
        for (let index = 0; index < this.factorTypes.length; index++) {
          factorIds.push(this.factorTypes[index].factorId);
          if (this.factorTypes[index].hasOwnProperty('materialFactorId')) {
            const form: ModelMaterialFactorInterface = {
              id: this.factorTypes[index]['materialFactorId'],
              modelMaterialId: this.blankmaterialDetails.id,
              factorId: this.factorTypes[index].factorId
            };
            await this.yrGenerateService.addFactorsRelation(form).toPromise().then(async res => {
              if (index === this.factorTypes.length - 1) {
                await this.yrGenerateService.getEsByFactorIds(factorIds).toPromise().then(async avg => {
                  const ids = [];
                  const match = avg['hits']['hits'].filter(item => item._score === factorIds.length);
                  if (match.length !== 0) {
                    for (let w = 0; w < match.length; w++) {
                      ids.push(match[w]['_source']['modelMaterialId']);
                    }
                    await this.yrQueryService.getBaseDataByIds(ids, this.plantMatch).toPromise().then(async rrr => {
                      // rrr为basedata(是否需要分厂别？)
                      let a = 0;
                      for (let y = 0; y < rrr.length; y++) {
                        a += rrr[y]['yieldRate'];
                      }
                      this.blankmaterialDetails.originalYieldRate = a / rrr.length;
                      await this.yrGenerateService.updateModelMaterial(this.blankmaterialDetails.id, {
                        yieldRate: (new PercentPipe().transform(this.blankmaterialDetails.originalYieldRate)).split('%')[0] / 100,
                        hasNewFactors: false
                      }).toPromise().then(r => {
                        // this.yrGenerateService.updateDiscussion(this.blankmaterialDetails.discussionId, {
                        //   pic: this.userId
                        // }).subscribe(final => {
                        this.isCompleted = true;
                        // 良率是自动获取还是手动维护?
                        this.savedHandleCancel();
                        // });

                      });
                    });
                  } else {
                    this.blankmaterialDetails.originalYieldRate = 0;
                    await this.yrGenerateService.updateModelMaterial(this.blankmaterialDetails.id, {
                      yieldRate: 0,
                      hasNewFactors: true
                    }).toPromise().then(r => {
                      // this.yrGenerateService.updateDiscussion(this.blankmaterialDetails.discussionId, {
                      //   pic: this.userId
                      // }).subscribe(final => {
                      this.isCompleted = true;
                      // 良率是自动获取还是手动维护?
                      this.savedHandleCancel();
                      // });

                    });
                  }
                });
              }
            });
          } else {
            const form: ModelMaterialFactorInterface = {
              modelMaterialId: this.blankmaterialDetails.id,
              factorId: this.factorTypes[index].factorId
            };
            await this.yrGenerateService.addFactorsRelation(form).toPromise().then(async res => {
              if (index === this.factorTypes.length - 1) {
                await this.yrGenerateService.getEsByFactorIds(factorIds).toPromise().then(async avg => {
                  const ids = [];
                  const match = avg['hits']['hits'].filter(item => item._score === factorIds.length);
                  if (match.length !== 0) {
                    for (let w = 0; w < match.length; w++) {
                      ids.push(match[w]['_source']['modelMaterialId']);
                    }
                    await this.yrQueryService.getBaseDataByIds(ids, this.plantMatch).toPromise().then(async rrr => {
                      // rrr为basedata(是否需要分厂别？)
                      let a = 0;
                      for (let y = 0; y < rrr.length; y++) {
                        a += rrr[y]['yieldRate'];
                      }
                      this.blankmaterialDetails.originalYieldRate = a / rrr.length;
                      await this.yrGenerateService.updateModelMaterial(this.blankmaterialDetails.id, {
                        yieldRate: (new PercentPipe().transform(this.blankmaterialDetails.originalYieldRate)).split('%')[0] / 100,
                        hasNewFactors: false
                      }).toPromise().then(r => {
                        // this.yrGenerateService.updateDiscussion(this.blankmaterialDetails.discussionId, {
                        //   pic: this.userId
                        // }).subscribe(final => {
                        this.isCompleted = true;
                        // 良率是自动获取还是手动维护?
                        this.savedHandleCancel();
                        // });

                      });
                    });
                  } else {
                    this.blankmaterialDetails.originalYieldRate = 0;
                    await this.yrGenerateService.updateModelMaterial(this.blankmaterialDetails.id, {
                      yieldRate: 0,
                      hasNewFactors: true
                    }).toPromise().then(r => {
                      // this.yrGenerateService.updateDiscussion(this.blankmaterialDetails.discussionId, {
                      //   pic: this.userId
                      // }).subscribe(final => {
                      this.isCompleted = true;
                      // 良率是自动获取还是手动维护?
                      this.savedHandleCancel();
                      // });

                    });
                  }
                });
              }
            });
          }
        }

      }
    });
  }

  Change() {
    console.log(this.factorTypes);
  }

  handleCancel() {
    this.modalShow = false;
    this.isVisiblePic = false;
    this.blankModalCal.emit(this.isVisiblePic);
  }

  savedHandleCancel() {
    if (this.isCompleted) {
      this.modalShow = false;
      this.isVisiblePic = false;
      this.savedblankModalCal.emit(this.blankmaterialDetails);
    }
  }

}
