import { ModelMaterialInterface, DiscussionInterface } from '@service/dfq_sdk/sdk';
import { YrQueryService } from './yr-query.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { DfqYrCompareQuerySelect, DfqYrCompareQueryStyle, ClsYrCompareSelect } from 'app/dfq/rfi/yr-generate/query-form/query-form';
import { NzMessageService } from 'ng-zorro-antd';
import { YrGenerateService } from '../yr-generate.service';
import { map, debounceTime } from 'rxjs/operators';
import { PercentPipe } from 'app/shared/percent.pipe';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { NewmaterialService } from '../../maintain/newmaterial-yr-maintain/newmaterial.service';
@Component({
  selector: 'app-query-form',
  templateUrl: './query-form.component.html',
  styleUrls: ['./query-form.component.scss']
})
export class QueryFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() modelTypes;
  @Input() plants;
  @Input() bus;
  @Input() tableShow;
  @Input() enableProduce = false;
  @Output() queryFrom = new EventEmitter<any>();
  @Input() params;
  queryStyle = DfqYrCompareQueryStyle;
  querySelect = DfqYrCompareQuerySelect;
  selectValue: ClsYrCompareSelect = {
    plant: '',
    bu: '',
    modelType: '',
    proCode: '',
    proName: '',
    cFlow: 'RFQ',
    similarModel: '',
    blankModel: ''
  };
  siteModels: any[];
  plantMatch: string = undefined;
  checkPlantMatch = false;
  tableModels = [];
  url: string;
  customer: any;
  viewModels = [];
  updateFactor = false;
  dfqMaterials = [];
  canProduce = false;
  isComplete = true;
  isCompleted = true;
  queryLoading = false;
  stageId: any;
  blankDfcDatas = [];
  blankStageId: any;
  makeData = [];
  mbId: any;
  mbYield: number;
  choiceModelData = [];
  doingStageId: any;
  doingModelDfcData = [];
  queryEnable = false;
  hasMb: boolean;
  userId: string;
  similarModel: string;
  similarPlant: string;
  blankHasDfcData = true;
  isBlank = false;
  viewModelMaterial = [];
  divide = false;
  noMb = false;
  updateBlankFactor = false;
  blankGetDfc = false;
  blankDfqMaterials = [];
  search$ = new Subject<any>();
  showProName = { selectList: [] };
  // i18n
  destroy$ = new Subject();
  trans: Object = {};

  constructor(
    private yrQueryService: YrQueryService,
    private messageService: NzMessageService,
    private yrGenerateService: YrGenerateService,
    private newMaterialYrService: NewmaterialService,
    private translate: TranslateService

  ) {
    this.userId = localStorage.getItem('$DFI$userID');
  }

  ngOnChanges() {
    if (this.tableShow) {
      this.queryLoading = false;
    }
    // 初始化I18N;
    this.translate.get(['dfq.dfq-plant', 'dfq.dfq-product', 'dfq.dfq-cflow', 'dfq.rfi-similar-model', 'dfq.prediction-model-DFC-noData', 'dfq.product-factor-template-does-not-maintain-MB']).subscribe(res => {
      this.queryStyle.plant.label = res['dfq.dfq-plant'];
      this.queryStyle.modelType.label = res['dfq.dfq-product'];
      this.queryStyle.cFlow.label = res['dfq.dfq-cflow'];
      this.queryStyle.similarModel.label = res['dfq.rfi-similar-model'];
      this.trans['predictionDFCData'] = res['dfq.prediction-model-DFC-noData'];
      this.trans['notMaintainMB'] = res['dfq.product-factor-template-does-not-maintain-MB'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.dfq-plant', 'dfq.dfq-product', 'dfq.dfq-cflow', 'dfq.rfi-similar-model', 'dfq.prediction-model-DFC-noData', 'dfq.product-factor-template-does-not-maintain-MB']).subscribe(res => {
        this.queryStyle.plant.label = res['dfq.dfq-plant'];
        this.queryStyle.modelType.label = res['dfq.dfq-product'];
        this.queryStyle.cFlow.label = res['dfq.dfq-cflow'];
        this.queryStyle.similarModel.label = res['dfq.rfi-similar-model'];
        this.trans['predictionDFCData'] = res['dfq.prediction-model-DFC-noData'];
        this.trans['notMaintainMB'] = res['dfq.product-factor-template-does-not-maintain-MB'];
      });
    });
  }

  plantMatchChange() {
    if (!this.checkPlantMatch) {
      this.plantMatch = undefined;
      this.changePlantMatch();
    }
  }

  ngOnInit() {
    this.querySelect.proName.searchChange$.pipe(debounceTime(200), map((res: String) => {
      const reg = new RegExp(`${res.toUpperCase()}`);
      this.showProName.selectList = res ? this.querySelect.proName.selectList.filter(item => reg.test(item.Value.toUpperCase())) : this.querySelect.proName.selectList;
    })).subscribe();
    if (this.params['sitePlant']) {
      this.selectValue.plant = this.params['sitePlant'];
      this.selectValue.modelType = this.params['product'];
      this.getModel();
      this.selectValue.proCode = this.params['projectCode'];
      this.selectValue.proName = this.params['projectName'];
      this.query();
    }
    this.url = location.origin + '/dashboard/dfc/standart-document';
    this.bus.forEach(element => {
      this.querySelect.bu.selectList.push({
        Value: element.id, Label: element.id
      });
    });
    this.modelTypes.forEach(element => {
      this.querySelect.modelType.selectList.push({
        Value: element.id, Label: element.id
      });
    });
    this.plants.forEach(element => {
      this.querySelect.plant.selectList.push({
        Value: element.siteId + '-' + element.id, Label: element.siteId + '-' + element.id
      });
    });
  }

  changePlantMatch() {
    this.querySelect.similarModel.selectList = [];
    if (this.selectValue.modelType) {
      if (this.plantMatch) {
        this.yrQueryService.getBaseDataBySite(this.plantMatch, this.selectValue.modelType).subscribe(res => {
          res.forEach(element => {
            if (this.querySelect.similarModel.selectList.filter(item => item.Value === (element['plant'] + '-' + element['modelId'])).length === 0) {
              this.querySelect.similarModel.selectList.push({
                Value: element['plant'] + '-' + element['modelId'], Label: element['plant'] + '-' + element['modelId']
              });
            }
          });
        });
      } else {
        this.yrQueryService.getBaseData(this.selectValue.modelType).subscribe(res => {
          res.forEach(element => {
            if (this.querySelect.similarModel.selectList.filter(item => item.Value === (element['plant'] + '-' + element['modelId'])).length === 0) {
              this.querySelect.similarModel.selectList.push({
                Value: element['plant'] + '-' + element['modelId'], Label: element['plant'] + '-' + element['modelId']
              });
            }
          });
        });
      }
    }
  }

  getModel() {
    let plant;
    if (this.selectValue.plant) {
      plant = this.selectValue.plant.split('-')[1];
    }
    this.selectValue.proCode = '';
    this.selectValue.proName = '';
    this.querySelect.proName.selectList = [];
    this.querySelect.proCode.selectList = [];
    this.viewModels.length = 0;
    this.querySelect.similarModel.selectList = [];
    if (this.selectValue.plant && this.selectValue.modelType) {
      //  獲取機種和ProjectCode下拉框的值從 ProjectCodeProfile和ProjectNameProfile
      this.yrGenerateService.getRFiModel(plant, this.selectValue.modelType, null).subscribe(res => {
        const model = res.ProjectModel['model'];
        const project = res.ProjectModel['project'];
        for (let index = 0; index < model.length; index++) {
          this.querySelect.proName.selectList.push({
            Value: model[index], Label: model[index]
          });
        }
        for (let index = 0; index < project.length; index++) {
          this.querySelect.proCode.selectList.push({
            Value: project[index], Label: project[index]
          });
        }
        this.showProName.selectList = this.querySelect.proName.selectList;
        // 相似机种
        this.yrQueryService.getBaseData(this.selectValue.modelType).subscribe(resu => {
          resu.forEach(element => {
            if (this.querySelect.similarModel.selectList.filter(item => item.Value === (element['plant'] + '-' + element['modelId'])).length === 0) {
              this.querySelect.similarModel.selectList.push({
                Value: element['plant'] + '-' + element['modelId'], Label: element['plant'] + '-' + element['modelId']
              });
            }
          });
        });
      });
    }
  }

  changeProjectCode() {
    this.enableProduce = false;
    this.blankHasDfcData = true;
    this.queryEnable = false;
    this.mbYield = 1;
    this.yrQueryService.getDfcFactors(this.selectValue.proName, this.selectValue.plant.split('-')[1]).subscribe(res => {
      if (res.length !== 0) {
        this.blankDfcDatas = res;
      } else {
        this.messageService.create('warning', this.trans['predictionDFCData']);
        this.blankHasDfcData = false;
        this.queryLoading = false;
      }
      this.checkMB();
    });
  }

  changeProjectName() {
    this.enableProduce = false;
    this.blankHasDfcData = true;
    this.queryEnable = false;
    this.mbYield = 1;
    this.selectValue.proCode = '';
    if (this.selectValue.proName) {
      this.newMaterialYrService
        .getProjectId(this.selectValue.proName)
        .subscribe(proCode => {
          if (proCode.length) {
            this.selectValue.proCode = proCode[0].projectId;
            this.yrQueryService.getDfcFactors(this.selectValue.proName, this.selectValue.plant.split('-')[1]).subscribe(resu => {
              if (resu.length !== 0) {
                this.blankDfcDatas = resu;
              } else {
                this.messageService.create('warning', this.trans['predictionDFCData']);
                this.blankHasDfcData = false;
                this.queryLoading = false;
              }
              this.checkMB();
            });
          }
        });
    }
  }

  private checkMB() {
    this.yrQueryService.getCustomer(this.selectValue.proCode).subscribe(res => {
      this.customer = res[0]['customerId'];
      this.hasMb = false;
      this.yrQueryService.getMb(this.selectValue.proName, this.selectValue.plant.split('-')[1], this.selectValue.modelType).subscribe(reso => {
        if (reso.length !== 0) {
          this.hasMb = true;
          for (let index = 0; index < reso.length; index++) {
            this.mbYield *= reso[index]['totalYieldRate'];
          }
          this.yrQueryService.getMaterialId('MB', this.selectValue.modelType).subscribe(ress => {
            if (ress.length === 0) {
              this.messageService.create('error', this.trans['notMaintainMB']);
              return;
            } else {
              this.mbId = ress[0]['id'];
              this.queryEnable = true;
              this.query();
            }
          });
        } else {
          this.queryEnable = true;
          this.query();
        }
      });
    });
  }

  query() {
    if (!this.selectValue.plant) {
      this.messageService.create('error', '請選擇廠別!');
      return;
    } else if (!this.selectValue.modelType) {
      this.messageService.create('error', '請選擇產品!');
      return;
    } else if (!this.selectValue.proName) {
      this.messageService.create('error', '請選擇機種!');
      return;
    }
    this.yrQueryService.getViewAllModel(this.selectValue.plant.split('-')[0], this.selectValue.plant.split('-')[1], this.selectValue.proName).subscribe(res => {
      this.viewModelMaterial = res;
      if (res.length > 0) {
        this.enableProduce = true;
        this.queryLoading = true;
      } else {
        this.enableProduce = true;
        this.queryLoading = false;
        this.divide = true;
      }
      for (let j = 0; j < res.length; j++) {
        if (res[j]['status'] !== 0) {
          this.enableProduce = false;
        }
        this.yrQueryService.getMaterialFactorById(res[j]['id']).subscribe(resu => {
          if (resu.length === 0 && res[j]['material']['name'] !== 'MB') {
            this.isBlank = true;
          }
        });
      }
      const form = {
        plant: this.selectValue.plant,
        product: this.selectValue.modelType,
        projectCode: this.selectValue.proCode,
        projectName: this.selectValue.proName,
        customer: this.customer,
        bu: this.selectValue.bu,
        similarModel: this.similarModel,
        plantMatch: this.plantMatch,
        mbId: this.mbId
      };
      this.queryFrom.emit(form);
    });
  }

  changeSimilarModel() {
    if (this.selectValue.similarModel) {
      this.canProduce = false;
      this.similarPlant = this.selectValue.similarModel.split('-')[0];
      const mol = [];
      for (let index = 1; index < this.selectValue.similarModel.split('-').length; index++) {
        mol.push(this.selectValue.similarModel.split('-')[index]);
      }
      this.similarModel = mol.join('-');
      this.yrQueryService.getUploadData(this.plantMatch, this.selectValue.modelType, this.similarModel).subscribe(async res => {
        this.dfqMaterials.length = 0;
        const baseData = res;
        for (let index = 0; index < baseData.length; index++) {
          await this.yrGenerateService.getEsByModelMaterialId(baseData[index]['id']).toPromise().then(async reso => {
            await this.yrQueryService.getFactorName(reso['hits']['hits'][0]['_source']['factors']).toPromise().then(async ress => {
              await this.yrGenerateService.getFactorType(baseData[index]['materialId']).toPromise().then(ree => {
                const factors = [];
                // factor匹配factorType
                for (let k = 0; k < ress.length; k++) {
                  factors.push(ress[k]['name']);
                }
                this.dfqMaterials.push({
                  esId: reso['hits']['hits'][0]['_id'],
                  materialName: baseData[index],
                  factors: factors,
                  factorTypes: ree
                });
                if (index === baseData.length - 1) {
                  this.canProduce = true;
                }
              });
            });
          });
        }
      });
    }
  }

  async getDFCData() {
    this.updateFactor = true;
    // 替換因子名
    for (let index = 0; index < this.dfqMaterials.length; index++) {
      for (let j = 0; j < this.dfqMaterials[index]['factorTypes'].length; j++) {
        const dfc = this.blankDfcDatas.find(item => item.Material === this.dfqMaterials[index]['materialName']['materialName']
          && item.Factor === this.dfqMaterials[index]['factorTypes'][j]['name']);
        if (dfc) {
          await this.yrQueryService.getFactorIdSingle(dfc.FactorDetailActural, this.dfqMaterials[index]['factorTypes'][j]['id']).toPromise().then(ree => {
            if (ree.length === 0) {
              // this.message.create('error', 'DFC -' + dfc.FactorDetailActural + '- 因子不存在于DFQ因子模板中!');
              // this.updateFactor = false;
              // return;
            } else {
              this.dfqMaterials[index]['factors'][j] = dfc.FactorDetailActural;
            }
            if (index === this.dfqMaterials.length - 1 && this.dfqMaterials[index]['factorTypes'].length - 1 === j) {
              this.updateFactor = false;
              this.messageService.create('success', '獲取DFC資料成功!');
              console.log('替换DFC后', this.dfqMaterials);
            }
          });
        } else {
          if (index === this.dfqMaterials.length - 1 && this.dfqMaterials[index]['factorTypes'].length - 1 === j) {
            this.updateFactor = false;
            this.messageService.create('success', '獲取DFC資料成功!');
            console.log('替换DFC后', this.dfqMaterials);
          }
        }
      }
    }
  }

  async produceSim() {
    this.isComplete = false;
    for (let index = 0; index < this.dfqMaterials.length; index++) {
      const factorTypeIds = [];
      for (let n = 0; n < this.dfqMaterials[index]['factors'].length; n++) {
        factorTypeIds.push(this.dfqMaterials[index]['factorTypes'][n]['id']);
      }
      // try {
      await this.yrQueryService.getFactorId(this.dfqMaterials[index]['factors'], factorTypeIds).then(async res => {
        // 一一找出factor
        await res.toPromise().then(async r => {
          this.dfqMaterials[index].factorIds = [];
          for (let k = 0; k < r.length; k++) {
            this.dfqMaterials[index].factorIds.push(r[k]['id']);
          }
          if (index === this.dfqMaterials.length - 1) {
            const savedData = [];
            for (let index = 0; index < this.dfqMaterials.length; index++) {
              for (let j = 0; j < this.dfqMaterials[index]['factors'].length; j++) {
                if (j === this.dfqMaterials[index]['factors'].length - 1) {
                  await this.yrGenerateService.addModelMaterial({
                    materialId: this.dfqMaterials[index]['materialName']['materialId'],
                    yieldRate: (new PercentPipe().transform(this.dfqMaterials[index]['materialName']['yieldRate'])).split('%')[0] / 100,
                    modelId: this.selectValue.proName,
                    siteId: this.selectValue.plant.split('-')[0],
                    plantId: this.selectValue.plant.split('-')[1]
                  }).toPromise().then(async reso => {
                    // 添加pic
                    this.yrQueryService.getDiscussion(reso['id']).subscribe(disc => {
                      const form: DiscussionInterface = {
                        pic: this.userId,
                        desc: '',
                        duedate: null,
                        status: 0
                      };
                      this.yrGenerateService.updateDiscussion(disc['id'], form).subscribe();
                    });

                    savedData.push(reso);
                    for (let l = 0; l < this.dfqMaterials[index]['factors'].length; l++) {
                      try {
                        await this.yrGenerateService.addFactorsRelation({
                          modelMaterialId: reso.id,
                          factorId: this.dfqMaterials[index]['factorIds'][l]
                        }).toPromise().then(async result => {
                          if (index === this.dfqMaterials.length - 1 && l === this.dfqMaterials[index]['factors'].length - 1) {
                            for (let z = 0; z < this.dfqMaterials.length; z++) {
                              await this.yrGenerateService.getEsByFactorIds(this.dfqMaterials[z].factorIds).toPromise().then(async avg => {
                                const ids = [];
                                const match = avg['hits']['hits'].filter(item => item._score === this.dfqMaterials[z].factors.length);
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
                                    if (rrr.length === 0) {
                                      this.dfqMaterials[z].newYield = 0;
                                    } else {
                                      this.dfqMaterials[z].newYield = a / rrr.length;
                                    }
                                    if (z === this.dfqMaterials.length - 1) {
                                      for (let m = 0; m < this.dfqMaterials.length; m++) {
                                        const id = savedData.find(i => i.materialId === this.dfqMaterials[m]['materialName']['materialId']).id;
                                        await this.yrGenerateService.updateModelMaterial(id, {
                                          yieldRate: (new PercentPipe().transform(this.dfqMaterials[m].newYield)).split('%')[0] / 100
                                        }).toPromise().then(r => {
                                          if (m === this.dfqMaterials.length - 1) {
                                            if (this.mbId && this.hasMb) {
                                              this.yrGenerateService.addModelMaterial({
                                                materialId: this.mbId,
                                                yieldRate: (new PercentPipe().transform(this.mbYield)).split('%')[0] / 100,
                                                modelId: this.selectValue.proName,
                                                siteId: this.selectValue.plant.split('-')[0],
                                                plantId: this.selectValue.plant.split('-')[1]
                                              }).subscribe(mb => {
                                                // 添加pic
                                                this.yrQueryService.getDiscussion(mb['id']).subscribe(disc => {
                                                  const sform: DiscussionInterface = {
                                                    pic: this.userId,
                                                    desc: '',
                                                    duedate: null,
                                                    status: 0
                                                  };
                                                  this.yrGenerateService.updateDiscussion(disc['id'], sform).subscribe(last => {
                                                    this.isComplete = true;
                                                    this.enableProduce = false;
                                                    this.query();
                                                  });
                                                });
                                              });
                                            } else {
                                              this.isComplete = true;
                                              this.enableProduce = false;
                                              this.query();
                                            }
                                          }
                                        });
                                      }

                                    }
                                  });
                                } else {
                                  this.dfqMaterials[z].newYield = 0;
                                  if (z === this.dfqMaterials.length - 1) {
                                    for (let m = 0; m < this.dfqMaterials.length; m++) {
                                      const id = savedData.find(i => i.materialId === this.dfqMaterials[m]['materialName']['materialId']).id;
                                      await this.yrGenerateService.updateModelMaterial(id, {
                                        yieldRate: (new PercentPipe().transform(this.dfqMaterials[m].newYield)).split('%')[0] / 100,
                                        hasNewFactors: true
                                      }).toPromise().then(r => {
                                        if (m === this.dfqMaterials.length - 1) {
                                          if (this.mbId && this.hasMb) {
                                            this.yrGenerateService.addModelMaterial({
                                              materialId: this.mbId,
                                              yieldRate: (new PercentPipe().transform(this.mbYield)).split('%')[0] / 100,
                                              modelId: this.selectValue.proName,
                                              siteId: this.selectValue.plant.split('-')[0],
                                              plantId: this.selectValue.plant.split('-')[1]
                                            }).subscribe(mb => {
                                              // 添加pic
                                              this.yrQueryService.getDiscussion(mb['id']).subscribe(disc => {
                                                const sform: DiscussionInterface = {
                                                  pic: this.userId,
                                                  desc: '',
                                                  duedate: null,
                                                  status: 0
                                                };
                                                this.yrGenerateService.updateDiscussion(disc['id'], sform).subscribe(last => {
                                                  this.isComplete = true;
                                                  this.enableProduce = false;
                                                  this.query();

                                                });
                                              });
                                            });
                                          } else {
                                            this.isComplete = true;
                                            this.enableProduce = false;
                                            this.query();
                                          }

                                        }
                                      });
                                    }
                                  }
                                }

                              });
                            }
                          }
                        });
                      } catch (error) {
                        console.log(this.dfqMaterials[index]['factorIds'][l]);
                      }
                    }
                  });
                }
              }
            }
          }
        });
      });
    }
  }

  getBlankDFCData() {
    this.blankGetDfc = true;
    this.updateBlankFactor = true;
    this.yrQueryService.getMaterialByProduct(this.selectValue.modelType).subscribe(async ress => {
      ress.forEach(element => {
        element['factors'] = [];
      });
      for (let index = 0; index < ress.length; index++) {
        for (let j = 0; j < ress[index]['factorTypes'].length; j++) {
          const dfc = this.blankDfcDatas.find(item => item.Material === ress[index]['name']
            && item.Factor === ress[index]['factorTypes'][j]['name']);
          if (dfc) {
            await this.yrQueryService.getFactorIdSingle(dfc.FactorDetailActural, ress[index]['factorTypes'][j]['id']).toPromise().then(ree => {
              if (ree.length === 0) {
                ress[index]['factors'][j] = '無因子';
              } else {
                ress[index]['factors'][j] = dfc.FactorDetailActural;
              }
              if (index === ress.length - 1 && j === ress[index]['factorTypes'].length - 1) {
                this.blankDfqMaterials = ress;
                this.updateBlankFactor = false;
                this.messageService.create('success', '獲取DFC資料成功!');
                console.log('空白替换DFC后', ress);
              }
            });
          } else {
            ress[index]['factors'][j] = '無因子';
            if (index === ress.length - 1 && j === ress[index]['factorTypes'].length - 1) {
              this.blankDfqMaterials = ress;
              this.updateBlankFactor = false;
              this.messageService.create('success', '獲取DFC資料成功!');
              console.log('空白替换DFC后', ress);
            }
          }
        }
      }
    });
  }

  async produceBlank() {
    if (this.blankGetDfc) {
      this.isCompleted = false;
      for (let index = 0; index < this.blankDfqMaterials.length; index++) {
        const factorTypeIds = [];
        for (let n = 0; n < this.blankDfqMaterials[index]['factors'].length; n++) {
          factorTypeIds.push(this.blankDfqMaterials[index]['factorTypes'][n]['id']);
        }
        // try {
        await this.yrQueryService.getFactorId(this.blankDfqMaterials[index]['factors'], factorTypeIds).then(async res => {
          // 一一找出factor
          await res.toPromise().then(async r => {
            try {
              this.blankDfqMaterials[index].factorIds = [];
              for (let k = 0; k < r.length; k++) {
                this.blankDfqMaterials[index].factorIds.push(r[k]['id']);
              }
            } catch (error) {
              this.messageService.create('error', error);
            }
            if (index === this.blankDfqMaterials.length - 1) {
              const savedData = [];
              for (let index = 0; index < this.blankDfqMaterials.length; index++) {
                for (let j = 0; j < this.blankDfqMaterials[index]['factors'].length; j++) {
                  if (j === this.blankDfqMaterials[index]['factors'].length - 1) {
                    await this.yrGenerateService.addModelMaterial({
                      materialId: this.blankDfqMaterials[index]['id'],
                      yieldRate: '0',
                      hasNewFactors: false,
                      modelId: this.selectValue.proName,
                      siteId: this.selectValue.plant.split('-')[0],
                      plantId: this.selectValue.plant.split('-')[1]
                    }).toPromise().then(async reso => {
                      // 添加pic
                      this.yrQueryService.getDiscussion(reso['id']).subscribe(disc => {
                        const form: DiscussionInterface = {
                          pic: this.userId,
                          desc: '',
                          duedate: null,
                          status: 0
                        };
                        this.yrGenerateService.updateDiscussion(disc['id'], form).subscribe();
                      });
                      savedData.push(reso);
                      for (let l = 0; l < this.blankDfqMaterials[index]['factors'].length; l++) {
                        await this.yrGenerateService.addFactorsRelation({
                          modelMaterialId: reso.id,
                          factorId: this.blankDfqMaterials[index]['factorIds'][l]
                        }).toPromise().then(async result => {
                          if (index === this.blankDfqMaterials.length - 1 && l === this.blankDfqMaterials[index]['factors'].length - 1) {
                            for (let z = 0; z < this.blankDfqMaterials.length; z++) {
                              await this.yrGenerateService.getEsByFactorIds(this.blankDfqMaterials[z].factorIds).toPromise().then(async avg => {
                                const ids = [];
                                const match = avg['hits']['hits'].filter(item => item._score === this.blankDfqMaterials[z].factors.length);
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
                                    if (rrr.length === 0) {
                                      this.blankDfqMaterials[z].newYield = 0;
                                    } else {
                                      this.blankDfqMaterials[z].newYield = a / rrr.length;
                                    }
                                    if (z === this.blankDfqMaterials.length - 1) {
                                      for (let m = 0; m < this.blankDfqMaterials.length; m++) {
                                        const id = savedData.find(i => i.materialId === this.blankDfqMaterials[m]['id']).id;
                                        await this.yrGenerateService.updateModelMaterial(id, {
                                          yieldRate: (new PercentPipe().transform(this.blankDfqMaterials[m].newYield)).split('%')[0] / 100
                                        }).toPromise().then(r => {
                                          if (m === this.blankDfqMaterials.length - 1) {
                                            if (this.mbId && this.hasMb) {
                                              this.yrGenerateService.addModelMaterial({
                                                materialId: this.mbId,
                                                yieldRate: (new PercentPipe().transform(this.mbYield)).split('%')[0] / 100,
                                                modelId: this.selectValue.proName,
                                                siteId: this.selectValue.plant.split('-')[0],
                                                plantId: this.selectValue.plant.split('-')[1]
                                              }).subscribe(mb => {
                                                // 添加pic
                                                this.yrQueryService.getDiscussion(mb['id']).subscribe(disc => {
                                                  const sform: DiscussionInterface = {
                                                    pic: this.userId,
                                                    desc: '',
                                                    duedate: null,
                                                    status: 0
                                                  };
                                                  this.yrGenerateService.updateDiscussion(disc['id'], sform).subscribe(last => {
                                                    this.isComplete = true;
                                                    this.enableProduce = false;
                                                    this.query();
                                                  });
                                                });
                                              });
                                            } else {
                                              this.isComplete = true;
                                              this.enableProduce = false;
                                              this.query();
                                            }
                                          }
                                        });
                                      }
                                    }
                                  });
                                } else {
                                  this.blankDfqMaterials[z].newYield = 0;
                                  if (z === this.blankDfqMaterials.length - 1) {
                                    for (let m = 0; m < this.blankDfqMaterials.length; m++) {
                                      const id = savedData.find(i => i.materialId === this.blankDfqMaterials[m]['id']).id;
                                      await this.yrGenerateService.updateModelMaterial(id, {
                                        yieldRate: (new PercentPipe().transform(this.blankDfqMaterials[m].newYield)).split('%')[0] / 100,
                                        hasNewFactors: true
                                      }).toPromise().then(r => {
                                        if (m === this.blankDfqMaterials.length - 1) {
                                          if (this.mbId && this.hasMb) {
                                            this.yrGenerateService.addModelMaterial({
                                              materialId: this.mbId,
                                              yieldRate: (new PercentPipe().transform(this.mbYield)).split('%')[0] / 100,
                                              modelId: this.selectValue.proName,
                                              siteId: this.selectValue.plant.split('-')[0],
                                              plantId: this.selectValue.plant.split('-')[1]
                                            }).subscribe(mb => {
                                              // 添加pic
                                              this.yrQueryService.getDiscussion(mb['id']).subscribe(disc => {
                                                const sform: DiscussionInterface = {
                                                  pic: this.userId,
                                                  desc: '',
                                                  duedate: null,
                                                  status: 0
                                                };
                                                this.yrGenerateService.updateDiscussion(disc['id'], sform).subscribe(last => {
                                                  this.isComplete = true;
                                                  this.enableProduce = false;
                                                  this.query();
                                                });
                                              });
                                            });
                                          } else {
                                            this.isComplete = true;
                                            this.enableProduce = false;
                                            this.query();
                                          }
                                        }
                                      });
                                    }
                                  }
                                }
                              });
                            }
                          }
                        });
                      }
                    });
                  }
                }
              }
            }
          });
        });
      }
    } else {
      this.isCompleted = false;
      this.yrQueryService.getMaterialByProduct(this.selectValue.modelType).subscribe(async ress => {
        for (let index = 0; index < ress.length; index++) {
          const form: ModelMaterialInterface = {
            materialId: ress[index]['id'],
            yieldRate: '0',
            modelId: this.selectValue.proName,
            hasNewFactors: false,
            siteId: this.selectValue.plant.split('-')[0],
            plantId: this.selectValue.plant.split('-')[1]
          };
          await this.yrGenerateService.addModelMaterial(form).toPromise().then(ree => {
            // 添加pic
            this.yrQueryService.getDiscussion(ree['id']).subscribe(disc => {
              const sform: DiscussionInterface = {
                pic: this.userId,
                desc: '',
                duedate: null,
                status: 0
              };
              this.yrGenerateService.updateDiscussion(disc['id'], sform).pipe(
                map(discuss => {
                  this.makeData.push(ree);
                  if (index === ress.length - 1) {
                    if (this.hasMb) {
                      if (this.makeData.find(item => item.materialId === this.mbId)) {
                        const id = this.makeData.find(item => item.materialId === this.mbId).id;
                        this.yrGenerateService.updateModelMaterial(id, {
                          yieldRate: (new PercentPipe().transform(this.mbYield)).split('%')[0] / 100
                        }).subscribe(rr => {
                          // DFC获取材料数与DFQ资料是否匹配
                          this.isCompleted = true;
                          this.enableProduce = false;
                          this.query();
                        });
                      } else {
                        this.yrGenerateService.addModelMaterial({
                          materialId: this.mbId,
                          yieldRate: (new PercentPipe().transform(this.mbYield)).split('%')[0] / 100,
                          modelId: this.selectValue.proName,
                          siteId: this.selectValue.plant.split('-')[0],
                          plantId: this.selectValue.plant.split('-')[1]
                        }).subscribe(mb => {
                          // 添加pic
                          this.yrQueryService.getDiscussion(mb['id']).subscribe(discc => {
                            const ssform: DiscussionInterface = {
                              pic: this.userId,
                              desc: '',
                              duedate: null,
                              status: 0
                            };
                            this.yrGenerateService.updateDiscussion(discc['id'], ssform).subscribe(last => {
                              this.isComplete = true;
                              this.enableProduce = false;
                              this.query();

                            });
                          });
                        });
                      }
                    } else {
                      this.isCompleted = true;
                      this.enableProduce = false;
                      this.query();
                    }
                  }
                }
                )).subscribe();
            });
          });
        }
      });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
