import { ModelMaterialFactorInterface } from './../../../../service/dfq_sdk/sdk/models/ModelMaterialFactor';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { YrGenerateService } from '../yr-generate.service';
import { ModelMaterialInterface } from '@service/dfq_sdk/sdk';
import { PercentPipe } from 'app/shared/percent.pipe';

@Component({
  selector: 'app-yr-compare',
  templateUrl: './yr-compare.component.html',
  styleUrls: ['./yr-compare.component.scss']
})
export class YrCompareComponent implements OnInit, OnChanges {

  material = '良率比對查看說明';
  @Input() isVisiblePic;
  @Input() yrCompareMaterialId;
  @Input() materialDetails;
  @Input() plantMatch;
  @Output() yrComCancel = new EventEmitter<any>();
  @Output() savedYrComCancel = new EventEmitter<any>();
  modalShow = false;
  factorTypes = [];
  factorIds = [];
  sameCustomer = [];
  difCustomer = [];
  changeYiedlRate: number;
  // 最優(同一客戶)
  fstSameFactors = [];
  fstSameModelUploads = [];
  secSameFactors = [];
  secSameModelUploads = [];
  // 最優(所有客戶)
  fstDifFactors = [];
  fstDifModelUploads = [];
  secDifFactors = [];
  secDifModelUploads = [];

  SameModelUploadsPlant: string;
  editButton = true;
  getIng = false;
  isNewFactors: boolean;
  userId: string;
  constructor(
    private yrGenerateService: YrGenerateService
  ) {
    this.userId = localStorage.getItem('$DFI$userID');
  }

  ngOnInit() {
    // this.material = 'Bezel';
  }

  ngOnChanges() {
    if (this.isVisiblePic) {
      if (this.materialDetails.id === this.materialDetails.originalId) {
        this.materialDetails.yieldRate = this.materialDetails.originalYieldRate;
      }
      this.sameCustomer.length = 0;
      this.difCustomer.length = 0;
      this.factorIds.length = 0;
      this.yrGenerateService.getFactorType(this.yrCompareMaterialId).subscribe(res => {
        this.factorTypes = res;
        this.yrGenerateService.getPreFactors(this.materialDetails.id).subscribe(async reso => {
          reso.forEach(element => {
            this.factorIds.push(element['factorId']);
          });
          // this.factorIds = reso['hits']['hits'][0]['_source']['factors'];
          const factorNames = [];
          for (let index = 0; index < this.factorIds.length; index++) {
            await this.yrGenerateService.getFactor(this.factorIds[index]).toPromise().then(resor => {
              // this.sortFactorType(resor);
              factorNames.push(resor[0]);

              if (index === this.factorIds.length - 1) {
                this.materialDetails.factors = factorNames;
                console.log('materialDetails', this.materialDetails);
                this.yrGenerateService.getEsByFactorIds(this.factorIds).subscribe(async resou => {
                  // 因子差異<=2
                  let similar = resou['hits']['hits'].filter(item => item._score >= this.factorIds.length - 2);
                  if (similar.length !== 0) {
                    for (let j = 0; j < similar.length; j++) {
                      await this.yrGenerateService.getModelUpload(similar[j]['_source'].modelMaterialId).toPromise().then(async r => {
                        similar[j]['_source'].modelUpload = r;
                        if (j === similar.length - 1) {
                          // 找相同客户&&不同客户
                          similar = similar.filter(item => item['_source'].modelUpload.length !== 0);
                          if (this.plantMatch) {
                            this.sameCustomer = similar.filter(data => data['_source'].modelUpload[0].customer === this.materialDetails.customer
                              && data['_source'].modelUpload[0].product === this.materialDetails.product
                              && data['_source'].modelUpload[0].materialName === this.materialDetails.material.name &&
                              (data['_source'].modelUpload[0].site + '-' + data['_source'].modelUpload[0].plant) === this.plantMatch);
                            this.difCustomer = similar.filter(data => data['_source'].modelUpload[0].customer !== this.materialDetails.customer
                              && data['_source'].modelUpload[0].product === this.materialDetails.product
                              && data['_source'].modelUpload[0].materialName === this.materialDetails.material.name &&
                              (data['_source'].modelUpload[0].site + '-' + data['_source'].modelUpload[0].plant) === this.plantMatch);
                          } else {
                            try {
                              this.sameCustomer = similar.filter(data => data['_source'].modelUpload[0].customer === this.materialDetails.customer
                                && data['_source'].modelUpload[0].product === this.materialDetails.product
                                && data['_source'].modelUpload[0].materialName === this.materialDetails.material.name);
                              this.difCustomer = similar.filter(data => data['_source'].modelUpload[0].customer !== this.materialDetails.customer
                                && data['_source'].modelUpload[0].product === this.materialDetails.product
                                && data['_source'].modelUpload[0].materialName === this.materialDetails.material.name);
                            } catch (error) {
                              console.log(error);
                            }

                          }
                          // console.log('same', this.sameCustomer);
                          // console.log('dif', this.difCustomer);
                          await this.sort(this.sameCustomer);
                          await this.sort(this.difCustomer);
                          if (this.sameCustomer.length === 1) {
                            this.fstSameFactors = this.sameCustomer[0]['_source'].factors;
                            this.fstSameModelUploads = this.sameCustomer[0]['_source'].modelUpload[0];
                          }
                          if (this.sameCustomer.length >= 2) {
                            this.fstSameFactors = this.sameCustomer[0]['_source'].factors;
                            this.fstSameModelUploads = this.sameCustomer[0]['_source'].modelUpload[0];
                            this.secSameFactors = this.sameCustomer[1]['_source'].factors;
                            this.secSameModelUploads = this.sameCustomer[1]['_source'].modelUpload[0];
                          }

                          if (this.difCustomer.length === 1) {
                            this.fstDifFactors = this.difCustomer[0]['_source'].factors;
                            this.fstDifModelUploads = this.difCustomer[0]['_source'].modelUpload[0];
                          }
                          if (this.difCustomer.length >= 2) {
                            this.fstDifFactors = this.difCustomer[0]['_source'].factors;
                            this.fstDifModelUploads = this.difCustomer[0]['_source'].modelUpload[0];
                            this.secDifFactors = this.difCustomer[1]['_source'].factors;
                            this.secDifModelUploads = this.difCustomer[1]['_source'].modelUpload[0];
                          }
                          this.modalShow = true;
                          // console.log('same', this.sameCustomer);
                          // console.log('dif', this.difCustomer);
                        }
                      });
                    }
                  } else {
                    this.modalShow = true;
                  }

                });
              }
            });
          }
        });

      });
    }
  }

  private sort(datas: any[]) {
    for (let i = 0; i < datas.length - 1; i++) {
      for (let j = 0; j < datas.length - 1 - i; j++) {
        if (datas[j]['_source'].modelUpload[0].yieldRate < datas[j + 1]['_source'].modelUpload[0].yieldRate) {
          const t = datas[j];
          datas[j] = datas[j + 1];
          datas[j + 1] = t;
        }
      }
    }
  }

  Change() {
    this.isNewFactors = false;
    this.getIng = true;
    setTimeout(() => {
      const factorIds = [];
      for (let index = 0; index < this.materialDetails.factors.length; index++) {
        factorIds.push(this.materialDetails.factors[index].id);
      }
      // console.log(factorIds);
      this.yrGenerateService.getEsByFactorIds(factorIds).subscribe(async res => {
        let same = res['hits']['hits'].filter(item => item._score === this.factorIds.length);
        if (same.length !== 0) {
          for (let j = 0; j < same.length; j++) {
            await this.yrGenerateService.getModelUpload(same[j]['_source'].modelMaterialId).toPromise().then(r => {
              same[j]['_source'].modelUpload = r;
              if (j === same.length - 1) {
                same = same.filter(item => item['_source'].modelUpload.length !== 0);
                if (this.plantMatch) {
                  const sameYield = same.filter(data =>
                    data['_source'].modelUpload[0].product === this.materialDetails.product
                    && data['_source'].modelUpload[0].materialName === this.materialDetails.material.name &&
                    (data['_source'].modelUpload[0].site + '-' + data['_source'].modelUpload[0].plant) === this.plantMatch);
                  let i = 0;
                  for (let k = 0; k < sameYield.length; k++) {
                    i += sameYield[k]['_source'].modelUpload[0].yieldRate;
                  }

                  this.materialDetails.yieldRate = i / sameYield.length;
                  this.getIng = false;
                } else {

                  const sameYield = same.filter(data =>
                    data['_source'].modelUpload[0].product === this.materialDetails.product
                    && data['_source'].modelUpload[0].materialName === this.materialDetails.material.name);
                  if (sameYield.length !== 0) {
                    let i = 0;
                    for (let k = 0; k < sameYield.length; k++) {
                      i += sameYield[k]['_source'].modelUpload[0].yieldRate;
                    }

                    this.materialDetails.yieldRate = i / sameYield.length;
                  } else {
                    this.materialDetails.yieldRate = 0;
                  }

                  this.getIng = false;
                }

              }
            });
          }
        } else {
          this.isNewFactors = true;
          this.materialDetails.yieldRate = 0;
          this.getIng = false;
        }

      }
      );
    }, 1000);

  }

  save() {
    const form = {
      siteId: this.materialDetails.site,
      plantId: this.materialDetails.plant,
      materialId: this.materialDetails.material.id,
      yieldRate: (new PercentPipe().transform(this.materialDetails.yieldRate)).split('%')[0] / 100,
      modelId: this.materialDetails.modelId,
      hasNewFactors: this.isNewFactors
    };
    this.yrGenerateService.addModelMaterial(form).subscribe(async res => {
      this.materialDetails.id = res.id;
      for (let index = 0; index < this.materialDetails.factors.length; index++) {
        const relationForm: ModelMaterialFactorInterface = {
          modelMaterialId: res.id,
          factorId: this.materialDetails.factors[index].id
        };
        await this.yrGenerateService.addFactorsRelation(relationForm).toPromise().then(reso => {
          console.log(reso);
          if (index === this.materialDetails.factors.length - 1) {
            // 修改PIC
            this.yrGenerateService.getDiscussionByMId(res.id).subscribe(rel => {
              this.materialDetails.discussionId = rel['id'];
              this.yrGenerateService.updateDiscussion(rel['id'], {
                status: 1,
                pic: this.userId
              }).subscribe(final => {
                this.editButton = true;
                this.savedHandleCancel();
              });
            });


          }
        });
      }

    });
  }

  edit() {
    this.editButton = false;
  }

  handleCancel() {
    if (this.materialDetails.id === this.materialDetails.originalId) {
      this.materialDetails.yieldRate = 0;
    }
    this.editButton = true;
    this.modalShow = false;
    this.isVisiblePic = false;
    this.yrComCancel.emit(this.isVisiblePic);
  }

  savedHandleCancel() {
    this.editButton = true;
    this.modalShow = false;
    this.isVisiblePic = false;
    this.savedYrComCancel.emit(this.materialDetails);
  }

}
