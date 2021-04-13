import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaterialYrService } from './material-yr.service';
import * as XLSX from 'xlsx';
import { YrGenerateService } from '../../yr-generate/yr-generate.service';
import { Utils } from 'app/dfq/utils';
import { BaseDataSigningService } from '../../signing/base-data-signing/base-data-signing.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserApi, User } from '@service/portal/sdk';
import { PlantApi, Plant } from '@service/dfi-sdk';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-material-yr-maintain',
  templateUrl: './material-yr-maintain.component.html',
  styleUrls: ['./material-yr-maintain.component.scss']
})
export class MaterialYrMaintainComponent implements OnInit, OnDestroy {
  newCombine: {}[];
  editCache: { [key: string]: any } = {};
  listOfData: any[] = [];
  Product = [];        // 下拉框所有厂别
  selectProduct;       // 下拉框选中的厂别
  Material;
  selectMaterial;
  Site = [];
  selectSite: string;
  Model = [];
  selectModel = [];
  Customer = [];
  selectCustomer;
  isLoading = false;
  uploadFileName;
  isVisible = false;
  ExcelData: any;
  filetoUpload: File;
  View_ModelMaterial = [];            // 查询表所有数据
  tableShow = false;                  // 显示查询表格
  uploadShow = false;                 // 显示上传图标
  selectTable = [];                   // 选择后查询的数据
  showData = [];
  Plant = [];
  MaterialTable = [];
  MaterialId;
  pic: string;
  data = [];
  ModelMaterialId = [];
  GETModelMaterialId = false;
  editModelMaterialId;               // 选择编辑的那条id
  ModelMaterialUploadId: string;
  selectMaterialIds = [];            // 被選中的一條
  showUploadExcel = false;
  Data;
  factor = [];
  factorTypes = [];
  queryModels = [];
  selectfactorTypeName = [];
  uploadFactors = [];                // 文件上传时添加的因子
  uploadProduct;
  uploading = false;
  uploadmodelId: string;
  uploadModelId: string;
  upEnable = false;
  userId: any;
  choiceSite: any;
  chociePlant: any;
  choicePlant: any;
  excelTitle: any;
  fileData: HTMLElement;
  canEdit = true;
  addModelId;
  addSite;
  addPlant;
  addyieldRate;
  addOneData;
  showAddModelMateril = false;
  addselectModels = [];
  isOkLoading;
  downShow = false;
  choiceMaterialId: any;
  selectMaterialId: any;
  addMaterialId: number;
  modelMessage = false;
  errUploadMaterial;
  validatorForm: FormGroup;
  isPagination = true;
  // 上傳下載
  downLoading;
  uploadLoding;
  // 篩選欄位
  sortValue: 'ascend' | 'descend' | null = null;
  searchValue: string[] = [];
  sortName: string | null = null;
  listOfMaterial: {}[] = [];
  listOfPic: {}[] = [];
  listOfModel: {}[] = [];
  searchModel = [];
  searchMaterial = [];
  searchPic = [];
  showSelect = false;
  showSelectIcon = true;
  destroy$ = new Subject();
  trans = {};


  constructor(
    private materialYrService: MaterialYrService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private baseDataSigningService: BaseDataSigningService,
    private yrGenerateService: YrGenerateService,
    private fb: FormBuilder,
    private userService: UserApi,
    private plantService: PlantApi,
    private translate: TranslateService
  ) {
    this.userId = localStorage.getItem('$DFI$userID');
  }

  ngOnInit(): void {
    // 初始化I18N;
    this.translate.get(['dfq.mp-data-verification', 'dfq.mp-not-match-tempelate', 'dfq.repeated-upload-again', 'dfq.signing-please-do-not-modify', 'dfq.factor-and-factor-template-umatch', 'dfq.material-not-exist', 'dfq.send-sign-in-time', 'dfq.mp-already-exists', 'dfq.add-model-in-sign', 'dfq.continue-to-add-factor']).subscribe(res => {
      this.trans['dataVerification'] = res['dfq.mp-data-verification'];
      this.trans['noMatchTempelate'] = res['dfq.mp-not-match-tempelate'];
      this.trans['repeatedUpload'] = res['dfq.repeated-upload-again'];
      this.trans['signingNomodify'] = res['dfq.signing-please-do-not-modify'];
      this.trans['factorTemplateUmatch'] = res['dfq.factor-and-factor-template-umatch'];
      this.trans['materialNoexist'] = res['dfq.material-not-exist'];
      this.trans['sendSignInTime'] = res['dfq.send-sign-in-time'];
      this.trans['existsData'] = res['dfq.mp-already-exists'];
      this.trans['addModelInSign'] = res['dfq.add-model-in-sign'];
      this.trans['addFactor'] = res['dfq.continue-to-add-factor'];
    });
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.mp-data-verification', 'dfq.mp-not-match-tempelate', 'dfq.repeated-upload-again', 'dfq.signing-please-do-not-modify', 'dfq.factor-and-factor-template-umatch', 'dfq.material-not-exist', 'dfq.send-sign-in-time', 'dfq.mp-already-exists', 'dfq.add-model-in-sign', 'dfq.continue-to-add-factor']).subscribe(res => {
        this.trans['dataVerification'] = res['dfq.mp-data-verification'];
        this.trans['noMatchTempelate'] = res['dfq.mp-not-match-tempelate'];
        this.trans['repeatedUpload'] = res['dfq.repeated-upload-again'];
        this.trans['signingNomodify'] = res['dfq.signing-please-do-not-modify'];
        this.trans['factorTemplateUmatch'] = res['dfq.factor-and-factor-template-umatch'];
        this.trans['materialNoexist'] = res['dfq.material-not-exist'];
        this.trans['sendSignInTime'] = res['dfq.send-sign-in-time'];
        this.trans['existsData'] = res['dfq.mp-already-exists'];
        this.trans['addModelInSign'] = res['dfq.add-model-in-sign'];
        this.trans['addFactor'] = res['dfq.continue-to-add-factor'];
      });
    });
    // 找到当前登录用户
    this.pic = localStorage.getItem('$DFI$userID');
    this.getProduct();
    this.validatorForm = this.fb.group({
      ProductId: [null, Validators.required],
      MaterialId: [null],
      SiteId: [null, Validators.required],
      CustomerId: [null],
      ModelId: [null, [Validators.required]],
    });
  }

  getProduct() {
    this.materialYrService.getProduct().subscribe(res => {
      this.Product = res;
    });
  }

  // 產品值改變時
  getMaterial() {
    this.selectMaterial = '';
    this.Material = [];
    // 选择产品关联选择物料，客户别和機種
    this.materialYrService.getMaterial2(this.selectProduct).subscribe(res => {
      this.Material = res;
    });
    this.selectSite = '';
    this.Model = [];
    this.selectModel = [];
    this.selectCustomer = '';
    this.Customer = [];
    this.materialYrService.getSite(this.selectProduct).subscribe(sitePlant => {
      for (const ONE of sitePlant) {
        if (!this.Customer.includes(ONE.customer)) {
          this.Customer.push(ONE.customer);
        }
      }
      this.getRFiBAModel(this.selectSite, this.selectProduct, this.selectCustomer);
      this.plantService.find().subscribe(res => {
        res.forEach((item: Plant) => {
          if (!this.Site.includes(item.siteId + '-' + item.id)) {
            this.Site.push(item.siteId + '-' + item.id);
          }
        });
      });
    });
  }

  // 廠別值改變時
  getCustomers() {
    // 选择厂别关联选择客户别
    this.selectCustomer = '';
    this.Customer = [];
    let Arr = [];
    if (this.selectSite) {
      Arr = this.selectSite.split('-');
    } else {
      Arr[0] = undefined;
      Arr[1] = undefined;
    }
    this.materialYrService.getCustomer(this.selectProduct, Arr[0], Arr[1]).subscribe(red => {
      for (const ONE of red) {
        if (!this.Customer.includes(ONE.customer)) {
          this.Customer.push(ONE.customer);
        }
      }
      this.Model = [];
      this.selectModel = [];
      this.getRFiBAModel(Arr[1], this.selectProduct, this.selectCustomer);
    });
  }

  getModels() {
    // 选择客户别关联机种
    this.selectModel = [];
    this.Model = [];
    let Arr = [];
    if (this.selectSite) {
      Arr = this.selectSite.split('-');
    } else {
      Arr[0] = undefined;
      Arr[1] = undefined;
    }
    if (!this.selectCustomer) {
      this.selectCustomer = undefined;
    }
    this.getRFiBAModel(Arr[1], this.selectProduct, this.selectCustomer);
  }

  showModel() {
    this.showAddModelMateril = true;
  }

  // 查詢model里的可選擇的非RFQ機種 機種下拉選項
  getsitPlantModels() {
    let Arr = [];
    Arr = this.addSite.split('-');
    this.yrGenerateService.getRFiBAModel(Arr[1], this.selectProduct).subscribe(res => {
      this.addselectModels = res.ProjectModel['model'];
    });
  }

  // 点击查询后加载查询的表格数据。
  async query() {
    for (const i in this.validatorForm.controls) {
      if (this.validatorForm.controls.hasOwnProperty(i)) {
        this.validatorForm.controls[i].markAsDirty();
        this.validatorForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.uploadFileName) {
      this.fileData['value'] = '';
      this.uploadFileName = '';
    }
    this.tableShow = false;
    this.uploadShow = false;
    this.selectTable.length = 0;
    this.materialYrService.getViewModelMaterialNewFactor(this.selectProduct, this.selectMaterial).subscribe(res => {
      this.newCombine = res;
    });
    let Arr1 = [];
    this.isLoading = true;
    if (!this.selectProduct) {
      this.message.create('error', 'Please select the product!');
      this.isLoading = false;
      return;
    } else {
      // 判断是否被选择
      if (this.selectSite) {
        Arr1 = this.selectSite.split('-');
      } else {
        Arr1[0] = undefined;
        Arr1[1] = undefined;
      }
      if (this.selectMaterial) {
      } else {
        this.selectMaterial = undefined;
      }
      if (!this.selectModel) {
        this.message.create('error', 'Please select the model!');
        this.isLoading = false;
        return;
      }
      if (!this.selectCustomer) {
        this.selectCustomer = undefined;
      }
      await this.materialYrService.getMaterial3(this.selectMaterial, this.selectProduct).toPromise().then(async res => {
        const selectMaterialIds = [];
        res.forEach(element => {
          if (selectMaterialIds.indexOf(element['id']) === -1) {
            selectMaterialIds.push(element['id']);
          }
        });
        this.selectMaterialIds = selectMaterialIds;
        if (this.selectModel.length !== 0) {
          this.queryModels = this.selectModel;
        } else {
          this.queryModels = undefined;
        }
        // 根据传回的选项查数据库 并显示到页面上
        await this.materialYrService.getFactorType(this.selectProduct, this.selectMaterialIds, this.queryModels, Arr1[0], Arr1[1], this.selectCustomer).toPromise().then(async reso => {
          this.selectTable = reso;
          this.showData = reso;
          // 篩選欄位
          this.listOfPic = [];
          this.listOfModel = [];
          this.listOfMaterial = [];
          for (let index = 0; index < this.selectModel.length; index++) {
            this.listOfModel = [... this.listOfModel, { text: this.selectModel[index], value: this.selectModel[index] }];
          }
          for (let index = 0; index < this.selectTable.length; index++) {
            this.listOfMaterial = [...this.listOfMaterial, { text: this.selectTable[index]['material']['name'], value: this.selectTable[index]['material']['name'] }];
            await this.userService.findById(this.selectTable[index].pic).toPromise()
              .then((user: User) => {
                this.listOfPic = [...this.listOfPic, { text: user.userEnName, value: user.username }];
                if (index === this.selectTable.length - 1) {
                  const result = new Map();
                  this.listOfModel = this.listOfModel.filter(item => !result.has(item['value']) && result.set(item['value'], 1));
                  this.listOfPic = this.listOfPic.filter(item => !result.has(item['value']) && result.set(item['value'], 1));
                  this.listOfMaterial = this.listOfMaterial.filter(item => !result.has(item['value']) && result.set(item['value'], 1));
                }
              });
          }
        });
      });
      this.isLoading = false;
      this.updateEditCache();
      this.uploadShow = true;
    }
    this.tableShow = true;
  }

  sort(searchValue: string[]): void {
    this.searchValue = searchValue;
    const filterFunc = (item) => {
      return this.searchValue.length ? this.searchValue.some(name => item.name.indexOf(name) !== -1) : true;
    };
    const queryData = this.selectTable.filter(item => filterFunc(item));
    this.showData = queryData.sort((a, b) =>
      this.sortValue === 'ascend' ? (a.yieldRate > b.yieldRate ? 1 : -1) : b.yieldRate > a.yieldRate ? 1 : -1);
  }

  filter(searchModel: string[], searchMaterial: string[], searchPic: string[]): void {
    this.searchModel = searchModel;
    this.searchMaterial = searchMaterial;
    this.searchPic = searchPic;
    this.search();
  }

  search(): void {
    this.showData = this.selectTable
      .filter(item => this.searchModel && this.searchModel.length > 0 ? this.searchModel.includes(item['modelId']) : true)
      .filter(item => this.searchMaterial && this.searchMaterial.length > 0 ? this.searchMaterial.includes(item['material']['name']) : true)
      .filter(item => this.searchPic && this.searchPic.length > 0 ? this.searchPic.includes(item['pic']) : true);
  }

  seaechMaterial() {
    this.showSelect = true;
    this.showSelectIcon = false;
  }

  reset() {
    this.showSelect = false;
    this.showSelectIcon = true;
    this.searchMaterial = [];
    this.search();
  }

  async handleUploadFile(uploadFile) {
    this.upEnable = false;
    this.uploadLoding = this.message.loading(this.trans['dataVerification'], { nzDuration: 0 }).messageId;
    this.filetoUpload = uploadFile.files.item(0);
    this.fileData = document.getElementById('upload');
    if (this.filetoUpload) {
      let fileName = this.filetoUpload.name;
      const format = new Array('.xlsx', '.xls', '.csv');
      fileName = fileName.substring(fileName.lastIndexOf('.'));
      if (format.indexOf(fileName) < 0) {
        this.message.create('error', 'Only Excel types are accepted!');
        this.message.remove(this.uploadLoding);
        this.fileData['value'] = '';
        this.uploadFileName = '';
        return;
      }
      this.uploadFileName = this.filetoUpload.name.slice(0, 15);
    }

    /* wire up file reader */
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(this.filetoUpload);
    reader.onload = async (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      // 检测excel栏位
      const Excel = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.excelTitle = Excel[0];
      const template = [
        'Site'
        , 'Plant'
        , '產品類別'
        , '機種'
        , '物料'
        , '項目'
        , '因子'
      ];
      for (let k = 0; k < this.excelTitle.length; k++) {
        if (this.excelTitle[k] !== template[k]) {
          this.message.create('error', this.trans['noMatchTempelate']);
          this.message.remove(this.uploadLoding);
          this.fileData['value'] = '';
          this.uploadFileName = '';
          return;
        }
      }
      /* save data */
      this.ExcelData = (XLSX.utils.sheet_to_json(ws));
      // 处理上传数据
      let OneData = {};
      this.Data = [];
      this.uploadFactors.length = 0;
      let k1 = 0;
      const ExcelData = [];
      for (let index = 0; index < this.ExcelData.length; index++) {
        if (ExcelData.filter(item => item['Site'] === this.ExcelData[index]['Site'] && item['Plant'] === this.ExcelData[index]['Plant']
          && item['機種'] === this.ExcelData[index]['機種'] && item['物料'] === this.ExcelData[index]['物料'] && item['項目'] === this.ExcelData[index]['項目']).length === 0) {
          ExcelData.push(this.ExcelData[index]);
        }
      }
      const gap = this.ExcelData.length - ExcelData.length;
      if (gap > 0) {
        this.message.create('error', 'Excel' + gap + this.trans['repeatedUpload']);
        this.message.remove(this.uploadLoding);
        this.fileData['value'] = '';
        this.uploadFileName = '';
        return;
      }
      for (let index = 0; index < this.ExcelData.length; index++) {
        if (this.ExcelData[index]['項目'] === '良率') {
          if (Number.parseFloat(this.ExcelData[index]['因子']) > 100) {
            this.errUploadMaterial = this.ExcelData[index]['物料'];
            this.modelMessage = true;
            this.fileData['value'] = '';
            this.uploadFileName = '';
            this.message.remove(this.uploadLoding);
            return;
          } else if (Number.parseFloat(this.ExcelData[index]['因子']) <= 0) {
            this.errUploadMaterial = this.ExcelData[index]['物料'];
            this.modelMessage = true;
            this.fileData['value'] = '';
            this.uploadFileName = '';
            this.message.remove(this.uploadLoding);
            return;
          } else if ((Number.parseFloat(this.ExcelData[index]['因子']).toString() === 'NaN')) {
            this.errUploadMaterial = this.ExcelData[index]['物料'];
            this.modelMessage = true;
            this.fileData['value'] = '';
            this.uploadFileName = '';
            this.message.remove(this.uploadLoding);
            return;
          }
        }
        if (!this.ExcelData[index]['Site']) {
          this.message.create('error', 'Site is empty!');
          this.message.remove(this.uploadLoding);
          this.fileData['value'] = '';
          this.uploadFileName = '';
          return;
        } else if (!this.ExcelData[index]['Plant']) {
          this.message.create('error', 'Plant is empty!');
          this.message.remove(this.uploadLoding);
          this.fileData['value'] = '';
          this.uploadFileName = '';
          return;
        } else if (!this.ExcelData[index]['機種']) {
          this.message.create('error', 'Model is empty!');
          this.message.remove(this.uploadLoding);
          this.fileData['value'] = '';
          this.uploadFileName = '';
          return;
        } else if (this.ExcelData[index]['物料'] === 'MB') {
          this.message.create('error', 'Do not maintain MB!');
          this.message.remove(this.uploadLoding);
          this.fileData['value'] = '';
          this.uploadFileName = '';
          return;
        } else if (this.ExcelData[index]['產品類別'] !== this.selectProduct || !this.Material.find(item => this.ExcelData[index]['物料'])) {
          this.message.create('error', 'Please upload ' + this.selectProduct + ' materials!');
          this.message.remove(this.uploadLoding);
          this.fileData['value'] = '';
          this.uploadFileName = '';
          return;
        } else {
          this.yrGenerateService.getRFiBAModel(this.ExcelData[index]['Plant'], this.ExcelData[index]['產品類別']).subscribe(async result => {
            let modelFalg;
            modelFalg = result.ProjectModel['model'].filter(item => item === this.ExcelData[index]['機種']);
            if (modelFalg.length === 0) {
              this.message.create('error', `${this.ExcelData[index]['Site']}-${this.ExcelData[index]['Plant']}-${this.ExcelData[index]['產品類別']}-${this.ExcelData[index]['機種']},請上傳非RFQ機種!`);
              this.message.remove(this.uploadLoding);
              this.fileData['value'] = '';
              this.uploadFileName = '';
              return;
            }
            this.baseDataSigningService.getflow('RFI物料良率:' + this.ExcelData[index]['機種']).subscribe(async resd => {
              // 簽核中,請勿修改!
              if (resd.length !== 0 && resd[0]['status'] == 0) {
                this.message.create('error', this.ExcelData[index]['機種'] + this.trans['signingNomodify']);
                this.message.remove(this.uploadLoding);
                this.fileData['value'] = '';
                this.uploadFileName = '';
                return;
              }
              if (index === this.ExcelData.length - 1) {
                // 检查因子
                const plantGroup = Utils.groupBy(this.ExcelData, 'Plant');
                for (const key in plantGroup) {
                  if (plantGroup.hasOwnProperty(key)) {
                    const modelGroup = Utils.groupBy(plantGroup[key], '機種');
                    for (const j in modelGroup) {
                      if (modelGroup.hasOwnProperty(j)) {
                        const materialGroup = Utils.groupBy(modelGroup[j], '物料');
                        for (const k in materialGroup) {
                          if (materialGroup.hasOwnProperty(k)) {
                            const uploadFactors = [];
                            for (let l = 0; l < materialGroup[k].length; l++) {
                              k1++;
                              // 最后一笔为良率资料
                              if (l !== materialGroup[k].length - 1) {
                                try {
                                  // 在因子模板是否存在
                                  if (this.Material.find(row => row['name'] === k).factorTypes.find(sRow => sRow['name'] === materialGroup[k][l]['項目']).
                                    factors.find(tRow => tRow['name'] === materialGroup[k][l]['因子'])) {
                                    uploadFactors.push(this.Material.find(row => row['name'] === k).factorTypes.find(sRow => sRow['name'] === materialGroup[k][l]['項目']).
                                      factors.find(tRow => tRow['name'] === materialGroup[k][l]['因子']).id);
                                  } else {
                                    this.message.create('error', this.trans['factorTemplateUmatch']);
                                    this.fileData['value'] = '';
                                    this.uploadFileName = '';
                                    k1 = -999;
                                    this.upEnable = false;
                                    this.message.remove(this.uploadLoding);
                                    return;
                                  }
                                } catch (error) {
                                  this.message.create('error', k + this.trans['materialNoexist']);
                                  this.fileData['value'] = '';
                                  this.uploadFileName = '';
                                  k1 = -999;
                                  this.upEnable = false;
                                  this.message.remove(this.uploadLoding);
                                  return;
                                }

                              }
                            }
                            OneData = {
                              'workflowId': null,
                              'modelId': materialGroup[k][0]['機種'],
                              'yieldRate': this.numDiv(materialGroup[k].find(ite => ite['項目'] === '良率')['因子'], 100),
                              'siteId': materialGroup[k][0]['Site'],
                              'plantId': materialGroup[k][0]['Plant'],
                              'pic': this.pic,
                              'materialId': this.Material.find(item => item.name === k).id,
                            };
                            this.Data.push(OneData);
                            this.uploadFactors.push(uploadFactors);
                            if (this.ExcelData.length === k1) {
                              this.message.remove(this.uploadLoding);
                              this.upEnable = true;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            });
          });
        }
      }
    };
  }

  async upload() {
    this.upEnable = false;
    this.tableShow = false;
    this.uploading = true;

    for (let i = 0; i < this.Data.length; i++) {
      this.baseDataSigningService.getflow('RFI物料良率:' + this.Data[i]['機種']).subscribe(async resd => {
        await this.materialYrService.getBaseDataDuc(this.Data[i]['modelId'], this.Data[i]['materialId'], this.Data[i]['siteId'], this.Data[i]['plantId']).toPromise().then(async res => {
          if (resd.length !== 0) {
            const change = await this.materialYrService.updateflow(resd[0]['id'], {
              status: null
            }).toPromise();
          }
          // 有workFlow就清掉
          if (res.length > 0) {
            for (let m = 0; m < res.length; m++) {
              this.materialYrService.updateModelMaterialUpload(res[m]['id'], {
                workflowId: null
              }).subscribe();
            }
            this.Data[i]['id'] = res[0]['id'];
          }
          await this.materialYrService.createModelMaterial(this.Data[i]).toPromise().then(async cre => {
            if (this.Data[i].hasOwnProperty('id')) {
              await this.yrGenerateService.getEsByModelMaterialId(cre['id']).toPromise().then(async es => {
                await this.yrGenerateService.updateEsData(es['hits'].hits[0]._id, cre['id'], this.uploadFactors[i]).toPromise();
              });
            } else {
              const it = await this.yrGenerateService.addEsData(cre['id'], this.uploadFactors[i]).toPromise();
            }
            if (i === this.Data.length - 1) {
              this.uploading = false;
              this.filetoUpload = null;
              this.fileData['value'] = '';
              this.uploadFileName = '';
              this.message.create('success', this.Data.length + 'item,Upload successfully' + this.trans['sendSignInTime']);
              this.query();
            }
          });
        });
      });
    }

  }

  async downDemo() {
    if (!this.selectProduct) {
      this.message.create('error', 'Please select product!');
      this.isLoading = false;
      return;
    }
    if (!this.selectSite) {
      this.message.create('error', 'Please select a plant!');
      this.isLoading = false;
      return;
    }
    const downloadDta = [];
    let first = {};
    for (let index = 0; index < this.Material.length; index++) {
      for (let j = 0; j < this.Material[index]['factorTypes'].length; j++) {
        first = {
          Site: this.selectSite.split('-')[0],
          Plant: this.selectSite.split('-')[1],
          產品類別: this.selectProduct,
          機種: '',
          物料: this.Material[index].name,
          項目: this.Material[index]['factorTypes'][j].name,
          因子: ''
        };
        downloadDta.push(first);
        if (j === this.Material[index]['factorTypes'].length - 1) {
          downloadDta.push({
            Site: this.selectSite.split('-')[0],
            Plant: this.selectSite.split('-')[1],
            產品類別: this.selectProduct,
            機種: '',
            物料: this.Material[index].name,
            項目: '良率',
            因子: ''
          });
        }
      }
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(downloadDta);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, (this.selectMaterial ? this.selectMaterial : '物料良率') + '.xlsx');
  }

  // 下载页面上的表格
  async download() {
    //  数据处理
    this.downLoading = true;
    const id = this.message.loading('Loading ..', { nzDuration: 0 }).messageId;
    for (let index = 0; index < this.selectTable.length; index++) {
      await this.yrGenerateService.getEsByModelMaterialId(this.selectTable[index].id).toPromise().then(async data => {
        const factors = [];
        if (data['hits'].total > 0) {
          this.selectTable[index].factor = data['hits']['hits'][0]['_source']['factors'];
          for (let j = 0; j < this.selectTable[index].factor.length; j++) {
            await this.materialYrService.getFactor(this.selectTable[index].factor[j]).toPromise().then(resd => {
              factors.push(resd['name']);
            });
          }
        }
        this.selectTable[index]['factorName'] = factors;
      });
    }
    this.message.remove(id);
    const downloadDta = [];
    let first = {};
    // 如果查询是空白下载空白模板
    if (this.selectTable.length !== 0) {  // 如果查询有值则下载。
      for (const item of this.selectTable) {
        for (let index = 0; index < item['material']['factorTypes'].length; index++) {
          first = {
            Site: item.site,
            Plant: item.plant,
            產品類別: this.selectProduct,
            機種: item.modelId,
            物料: item.materialName,
            項目: item['material']['factorTypes'][index].name,
            因子: item['factorName'][index]
          };
          downloadDta.push(first);
          if (index === item['material']['factorTypes'].length - 1) {
            downloadDta.push({
              Site: item.site,
              Plant: item.plant,
              產品類別: this.selectProduct,
              機種: item.modelId,
              物料: item.materialName,
              項目: '良率',
              因子: item.yieldRate * 100
            });
          }
        }
      }
    }
    // console.log(downloadDta);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(downloadDta);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, (this.selectMaterial ? this.selectMaterial : '物料良率') + '.xlsx');
    this.downLoading = false;
  }

  // 新增一條數據
  async addOne() {
    this.modalService.confirm({
      nzTitle: '<i>Save Alert</i>',
      nzContent: '<b>Do you Want to Save?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnOk: async () => {
        this.isOkLoading = true;
        let Arr = [];
        if (!this.addSite) {
          this.message.create('error', 'Please select a plant!');
          this.isOkLoading = false;
          return;
        } else if (!this.addModelId) {
          this.message.create('error', 'Please select a model!');
          this.isOkLoading = false;
          return;
        } else if (!this.addMaterialId) {
          this.message.create('error', 'Please select material!');
          this.isOkLoading = false;
          return;
        } else {
          Arr = this.addSite.split('-');
        }
        // 檢查資料是否存在
        this.materialYrService.getBaseDataDuc(this.addModelId, this.addMaterialId, Arr[0], Arr[1]).subscribe(async ree => {
          if (ree.length !== 0) {
            this.message.create('error', this.trans['existsData']);
            this.isOkLoading = false;
            return;
          } else {
            // 查詢簽核中機種不准添加
            this.baseDataSigningService.getflow('RFI物料良率:' + this.addModelId).subscribe(rd => {
              let isSign = false;
              for (let index = 0; index < rd.length; index++) {
                if (rd[index]['status'] == 0) {
                  isSign = true;
                }
              }
              if (isSign) {
                this.message.create('error', this.trans['addModelInSign']);
                this.isOkLoading = false;
                return;
              } else {
                this.addOneData = {
                  'workflowId': null,
                  'modelId': this.addModelId,
                  'yieldRate': null,
                  'siteId': Arr[0],
                  'plantId': Arr[1],
                  'pic': this.pic,
                  'materialId': this.addMaterialId,
                };
                this.materialYrService.createModelMaterial(this.addOneData).subscribe(res => {
                  // 清空這筆簽核狀態
                  this.baseDataSigningService.getflow('RFI物料良率:' + this.addModelId).subscribe(async ree => {
                    if (ree.length > 0) {
                      const change = await this.materialYrService.updateflow(ree[0]['id'], {
                        status: null,
                        current: null
                      }).toPromise();
                      for (let m = 0; m < ree.length; m++) {
                        this.materialYrService.updateModelMaterialUpload(ree[m]['id'], {
                          workflowId: null,
                          pic: this.userId
                        }).subscribe(fia => { });
                      }
                    }
                    this.isOkLoading = false;
                    this.showAddModelMateril = false;
                    this.message.create('success', this.trans['addFactor']);
                    this.query();
                  });
                });
              }
            });
          }
        });
      }
    });
  }

  // 修改
  async startEdit(id: string) {
    this.editCache[id].edit = true;
    this.editCache[id].data.yieldRate = this.editCache[id].data.yieldRate * 100;
    const editMaterial = await this.materialYrService.getEditmateril(id).toPromise();
    for (const item of editMaterial) {
      this.editModelMaterialId = item['id'];
    }
  }

  cancelEdit(id: string) {
    this.editCache[id].edit = false;
    this.editCache[id].data.yieldRate = this.numDiv(this.editCache[id].data.yieldRate, 100);
  }

  // 保存修改
  async saveEdit(id: string) {
    this.canEdit = false;
    const index = this.selectTable.findIndex(item => item.id === id);
    this.editCache[id].edit = false;
    // 修改后改变PIC
    await this.materialYrService.findPicById(id).toPromise();
    this.baseDataSigningService.getflow('RFI物料良率:' + this.selectTable[index]['modelId']).subscribe(async resd => {
      // 簽核中,請勿修改!
      if (resd.length !== 0 && resd[0]['status'] === 0) {
        this.message.create('error', this.selectTable[index]['modelId'] + this.trans['signingNomodify']);
        this.canEdit = true;
        return;
      }
      this.materialYrService.getBaseDataDuc(this.selectTable[index]['modelId'], this.selectTable[index]['materialId'], this.selectTable[index]['site'], this.selectTable[index]['plant']).subscribe(async ree => {
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
          }).subscribe();
        }
      });
      // 把修改后的pic数据的一整条更新进去
      await this.materialYrService.updatepic(id, {
        pic: this.pic,
        yieldRate: this.numDiv(this.editCache[id].data.yieldRate, 100)
      }).toPromise().then(res => {
        this.canEdit = true;
        this.message.create('success', 'Successfully modified' + this.trans['sendSignInTime']);
      });

      this.editCache[id].data.yieldRate = this.numDiv(this.editCache[id].data.yieldRate, 100);
      this.editCache[id].data.pic = this.userId;
      Object.assign(this.selectTable[index], this.editCache[id].data);
    });
  }

  numDiv(num1, num2) {
    let baseNum1 = 0, baseNum2 = 0;
    let baseNum3, baseNum4;
    try {
      baseNum1 = num1.toString().split('.')[1].length;
    } catch (e) {
      baseNum1 = 0;
    }
    try {
      baseNum2 = num2.toString().split('.')[1].length;
    } catch (e) {
      baseNum2 = 0;
    }
    baseNum3 = Number(num1.toString().replace('.', ''));
    baseNum4 = Number(num2.toString().replace('.', ''));
    return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);
  }

  updateEditCache(): void {
    for (const item of this.selectTable) {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    }
  }

  modalVisible(evt) {
    this.isVisible = evt;
    this.GETModelMaterialId = false;
  }

  cancalAddModelMateril() {
    this.showAddModelMateril = false;
  }

  savedModalVisible(evt) {
    this.isVisible = evt;
    this.GETModelMaterialId = false;
    this.query();
  }

  // 顯示項目詳情
  async showModal(id: string, modelId: string, site, plant, materialId) {
    this.isVisible = true;
    this.GETModelMaterialId = true;
    this.ModelMaterialUploadId = id;
    this.uploadModelId = modelId;
    this.choiceSite = site;
    this.choicePlant = plant;
    this.choiceMaterialId = materialId;
  }

  handleCancelMessage() {
    this.modelMessage = false;
  }

  handleOkMessage() {
    this.modelMessage = false;
  }

  //  初始化抓取機種下拉框的值從 ProjectCodeProfile和ProjectNameProfile
  getRFiBAModel(plant?, product?, customer?) {
    this.yrGenerateService.getRFiBAModel(plant, product, customer).subscribe(res => {
      this.Model = res.ProjectModel['model'];
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
