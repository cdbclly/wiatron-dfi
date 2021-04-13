import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { YrGenerateService } from '../../yr-generate/yr-generate.service';
import { MaterialYrService } from '../material-yr-maintain/material-yr.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Utils } from 'app/dfq/utils';
import { BaseDataSigningService } from '../../signing/base-data-signing/base-data-signing.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-factor-details-modal',
  templateUrl: './factor-details-modal.component.html',
  styleUrls: ['./factor-details-modal.component.scss']
})
export class FactorDetailsModalComponent implements OnInit, OnChanges, OnDestroy {

  @Input() selectProduct;
  @Input() selectMaterialId;
  @Input() ModelMaterialUploadId: string;
  @Input() isVisible;
  @Input() uploadModelId;
  @Input() choiceSite;
  @Input() choicePlant;
  @Input() newCombine;

  @Output() modalVisible = new EventEmitter<any>();
  @Output() savedModalVisible = new EventEmitter<any>();


  factor = [];          // 每一条详情因子的id
  Factors = [];        // 表里所有详情的因子
  factorname = [];
  factorTypes = [];
  data;                 // es拿的因子资料
  names = [];           // 每一条详情的项目里所有的factorTypesnam
  factorTypesNames = [];    // 表里所有的factorTypesNames
  FactorTyeId = [];        // 排序后的FactorTyeId
  selectedFactorIds = [];   // 被選中的factorId
  esId = [];
  show = false;
  needEdit = false;
  Selectfactor = true;
  factorsDb = [];
  factorids = [];
  userId: string;
  destroy$ = new Subject();
  trans = {};



  constructor(
    private yrGenerateService: YrGenerateService,
    private materialYrService: MaterialYrService,
    private message: NzMessageService,
    private baseDataSigningService: BaseDataSigningService,
    private modalService: NzModalService,
    private translate: TranslateService
  ) {
    this.userId = localStorage.getItem('$DFI$userID');
  }

  ngOnInit() {
    // 初始化I18N;
    this.translate.get(['dfq.select-all-factors', 'dfq.signing-please-do-not-modify', 'dfq.combination-already-exists']).subscribe(res => {
      this.trans['selectAllFactors'] = res['dfq.select-all-factors'];
      this.trans['signingNomodify'] = res['dfq.signing-please-do-not-modify'];
      this.trans['combinationExists'] = res['dfq.combination-already-exists'];
    });
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.select-all-factors', 'dfq.signing-please-do-not-modify', 'dfq.combination-already-exists']).subscribe(res => {
        this.trans['selectAllFactors'] = res['dfq.select-all-factors'];
        this.trans['signingNomodify'] = res['dfq.signing-please-do-not-modify'];
        this.trans['combinationExists'] = res['dfq.combination-already-exists'];
      });
    });
  }

  // 因子项目栏位，根据每一个條selectMaterialId查詢每一種物料的因子類型
  // input的值改变时调用！可以调用很多次
  async ngOnChanges() {
    this.factor = [];
    this.selectedFactorIds = [];
    if (this.isVisible) {
      const res = await this.yrGenerateService.getFactorType(this.selectMaterialId).toPromise();
      this.factorTypes = res;
      if (this.factor.length === 0) {
        for (const factorType of this.factorTypes) {
          this.selectedFactorIds.push(undefined);
        }
      }
      for (const factorType of this.factorTypes) {
        this.factorsDb = factorType.factors;
      }
      this.getFactorbyID();
    }

  }


  // 通过es拿因子和esId
  async getFactorbyID() {
    this.selectedFactorIds = [];
    const res = await this.yrGenerateService.getEsByModelMaterialId(this.ModelMaterialUploadId).toPromise();
    // console.log(res);

    this.data = res;
    if (res['hits']['hits'].length > 0) {
      this.factor = this.data.hits.hits[0]._source.factors;
      // 判断es里是否有因子给下拉框默认选项
      if (this.factor.length !== 0 && this.selectedFactorIds.length === 0) {
        for (const factor of this.factor) {
          this.selectedFactorIds.push(factor);
        }
      }
      this.esId = this.data.hits.hits[0]._id;
    }
    this.show = true;
    // console.log(this.selectedFactorIds);

  }

  // 点击编辑按钮显示下拉框
  edit() {
    this.needEdit = true;
    this.Selectfactor = false;
  }

  handleCancel(): void {
    // console.log('Button cancel clicked!');
    this.isVisible = false;
    this.show = false;
    this.modalVisible.emit(this.isVisible);
  }


  savedHandleCancel(): void {
    // console.log('Button cancel clicked!');
    this.isVisible = false;
    this.show = false;
    this.savedModalVisible.emit(this.isVisible);
  }


  Change(event, i) {
    // 选择的每一项因子存入数组并根据factorTypeId排序。
    // console.log(event);
    // console.log(i);
    // console.log(this.selectedFactorIds);


    this.selectedFactorIds[i] = event;
    console.log(this.selectedFactorIds);

  }



  async save() {
    if (this.factor.length == 0) {
      // 默认显示es取回来的factors
      // 判断是否每一个框都有选择值
      if (this.selectedFactorIds.filter(item => item).length < this.factorTypes.length) {
        this.message.create('error', this.trans['selectAllFactors']);
        return;
      } else {
        this.modalService.confirm({
          nzTitle: '<i>Save Alert</i>',
          nzContent: '<b>Do you Want to Save?</b>',
          nzOkText: 'Ok',
          nzCancelText: 'Cancel',
          // 绑定他的因子id传入数据库,根据factorTypeIds顺序更新数据
          nzOnOk: async () => {
            // 添加因子！！！！
            // 判断es里是否存在因子？
            // 不存在的话添加,如果存在就可以修改
            const addFactorName = await this.yrGenerateService.addEsData(this.ModelMaterialUploadId, this.selectedFactorIds).toPromise();
            // console.log(addFactorName);
            this.materialYrService.getBaseDataDuc(this.uploadModelId, this.selectMaterialId, this.choiceSite, this.choicePlant).subscribe(async ree => {
              // 有簽核歷史
              if (ree.length !== 0) {
                const change = await this.materialYrService.updateflow(ree[0]['id'], {
                  status: null,
                  current: null
                }).toPromise();
              }
              for (let m = 0; m < ree.length; m++) {
                this.materialYrService.updateModelMaterialUpload(ree[m]['id'], {
                  workflowId: null,
                  pic: this.userId
                }).subscribe(fia => {
                  this.savedHandleCancel();
                });
              }
            });
            // 修改后显示在lebel上,并关闭下拉框
            this.factor = [];
            this.factor = this.selectedFactorIds;
            this.needEdit = false;
            this.Selectfactor = true;
          }
        });
      }
    } else {
      this.modalService.confirm({
        nzTitle: '<i>Save Alert</i>',
        nzContent: '<b>Do you Want to Save?</b>',
        nzOkText: 'Ok',
        nzCancelText: 'Cancel',
        nzOnCancel: () => {
          this.needEdit = false;
          this.Selectfactor = true;
        },
        nzOnOk: async () => {
          this.baseDataSigningService.getflow('RFI物料良率:' + this.uploadModelId).subscribe(async resd => {
            // 簽核中,請勿修改!
            if (resd.length !== 0 && resd[0]['status'] == 0) {
              this.message.create('error', this.uploadModelId + this.trans['signingNomodify']);
              return;
            }
            // 修改
            // console.log(this.selectedFactorIds);
            const fir = await this.yrGenerateService.getEsByFactorIds(this.selectedFactorIds).toPromise();
            if (fir['hits'].hits.length !== 0) {
              const modelMaterials = [];
              for (let index = 0; index < fir['hits'].hits.length; index++) {
                if (fir['hits'].hits[index]['_score'] === this.selectedFactorIds.length) {
                  modelMaterials.push(fir['hits'].hits[index]['_source']['modelMaterialId']);
                }
              }
              if (modelMaterials.length !== 0) {
                this.materialYrService.getUploadsByIds(modelMaterials).subscribe(async ree => {
                  if (ree.filter(item => item['modelId'] === this.uploadModelId && item['materialId'] === this.selectMaterialId && item['siteId'] === this.choiceSite && item['plantId'] === this.choicePlant).length !== 0) {
                    this.message.create('error', this.trans['combinationExists']);
                    return;
                  } else {
                    const updateFactorName = await this.yrGenerateService.updateEsData(this.esId, this.ModelMaterialUploadId, this.selectedFactorIds).toPromise();
                    this.materialYrService.getMaterialFactorsByFac(this.selectedFactorIds).subscribe(resou => {
                      const modelIdGroup = Utils.groupBy(resou, 'modelMaterialId');
                      for (const key in modelIdGroup) {
                        if (modelIdGroup.hasOwnProperty(key)) {
                          // const element = object[key];
                          if (modelIdGroup[key].length === this.selectedFactorIds.length && this.newCombine.find(item => item['modelId'] === modelIdGroup[key][0]['modelMaterial']['modelId'] && item['site'] === modelIdGroup[key][0]['modelMaterial']['siteId'] && item['plant'] === modelIdGroup[key][0]['modelMaterial']['plantId'])) {
                            this.materialYrService.updateHasNewFactors(key, {
                              hasNewFactors: false
                            }).subscribe();
                          }
                        }
                      }
                    });
                    this.materialYrService.getBaseDataDuc(this.uploadModelId, this.selectMaterialId, this.choiceSite, this.choicePlant).subscribe(async ree => {
                      // 有簽核歷史
                      if (resd.length !== 0) {
                        const change = await this.materialYrService.updateflow(resd[0]['id'], {
                          status: null,
                          current: null
                        }).toPromise();
                      }
                      for (let m = 0; m < ree.length; m++) {
                        this.materialYrService.updateModelMaterialUpload(ree[m]['id'], {
                          workflowId: null,
                          pic: this.userId
                        }).subscribe(fia => {
                          this.savedHandleCancel();
                        });
                      }
                    });
                    // 修改后显示在lebel上,并关闭下拉框
                    this.factor = [];
                    this.factor = this.selectedFactorIds;
                    this.needEdit = false;
                    this.Selectfactor = true;
                  }
                });
              } else {
                const updateFactorName = await this.yrGenerateService.updateEsData(this.esId, this.ModelMaterialUploadId, this.selectedFactorIds).toPromise();
                this.materialYrService.getMaterialFactorsByFac(this.selectedFactorIds).subscribe(resou => {
                  const modelIdGroup = Utils.groupBy(resou, 'modelMaterialId');
                  for (const key in modelIdGroup) {
                    if (modelIdGroup.hasOwnProperty(key)) {
                      // const element = object[key];
                      if (modelIdGroup[key].length === this.selectedFactorIds.length && this.newCombine.find(item => item['modelId'] === modelIdGroup[key][0]['modelMaterial']['modelId'] && item['site'] === modelIdGroup[key][0]['modelMaterial']['siteId'] && item['plant'] === modelIdGroup[key][0]['modelMaterial']['plantId'])) {
                        this.materialYrService.updateHasNewFactors(key, {
                          hasNewFactors: false
                        }).subscribe();
                      }
                    }
                  }
                });
                this.materialYrService.getBaseDataDuc(this.uploadModelId, this.selectMaterialId, this.choiceSite, this.choicePlant).subscribe(async ree => {
                  // 有簽核歷史
                  if (resd.length !== 0) {
                    const change = await this.materialYrService.updateflow(resd[0]['id'], {
                      status: null,
                      current: null
                    }).toPromise();
                  }
                  for (let m = 0; m < ree.length; m++) {
                    this.materialYrService.updateModelMaterialUpload(ree[m]['id'], {
                      workflowId: null,
                      pic: this.userId
                    }).subscribe(fia => {
                      this.savedHandleCancel();
                    });
                  }
                });
                // 修改后显示在lebel上,并关闭下拉框
                this.factor = [];
                this.factor = this.selectedFactorIds;
                this.needEdit = false;
                this.Selectfactor = true;
              }
            } else {
              const updateFactorName = await this.yrGenerateService.updateEsData(this.esId, this.ModelMaterialUploadId, this.selectedFactorIds).toPromise();
              this.materialYrService.getMaterialFactorsByFac(this.selectedFactorIds).subscribe(resou => {
                const modelIdGroup = Utils.groupBy(resou, 'modelMaterialId');
                for (const key in modelIdGroup) {
                  if (modelIdGroup.hasOwnProperty(key)) {
                    // const element = object[key];
                    if (modelIdGroup[key].length === this.selectedFactorIds.length && this.newCombine.find(item => item['modelId'] === modelIdGroup[key][0]['modelMaterial']['modelId'] && item['site'] === modelIdGroup[key][0]['modelMaterial']['siteId'] && item['plant'] === modelIdGroup[key][0]['modelMaterial']['plantId'])) {
                      this.materialYrService.updateHasNewFactors(key, {
                        hasNewFactors: false
                      }).subscribe();
                    }
                  }
                }
              });
              this.materialYrService.getBaseDataDuc(this.uploadModelId, this.selectMaterialId, this.choiceSite, this.choicePlant).subscribe(async ree => {
                // 有簽核歷史
                if (resd.length !== 0) {
                  const change = await this.materialYrService.updateflow(resd[0]['id'], {
                    status: null,
                    current: null
                  }).toPromise();
                }
                for (let m = 0; m < ree.length; m++) {
                  this.materialYrService.updateModelMaterialUpload(ree[m]['id'], {
                    workflowId: null,
                    pic: this.userId
                  }).subscribe(fia => {
                    this.savedHandleCancel();
                  });
                }
              });
              // 修改后显示在lebel上,并关闭下拉框
              this.factor = [];
              this.factor = this.selectedFactorIds;
              this.needEdit = false;
              this.Selectfactor = true;
            }
          });
        }
      });
    }
  }

  // 方法，排序
  sortTotal(a, b) {
    return a.factorTypeIds - b.factorTypeIds;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
