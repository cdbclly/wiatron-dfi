import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import { YrFactorService } from './yr-factor.service';
import { error } from 'util';
import { Utils } from 'app/dfq/utils';
import { Material, MaterialApi, FactorTypeApi, FactorApi, Factor, FactorType, ModelMaterial } from '@service/dfq_sdk/sdk';
import { ProductApi, Product } from '@service/dfi-sdk';
import { YrGenerateService } from '../../yr-generate/yr-generate.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-yr-factor-maintain',
  templateUrl: './yr-factor-maintain.component.html',
  styleUrls: ['./yr-factor-maintain.component.scss']
})
export class YrFactorMaintainComponent implements OnInit, OnChanges, OnDestroy {
  isLoading = false;
  validatorForm: FormGroup;
  uploadFileName;
  filetoUpload: File;
  editCache: { [key: string]: any } = {};
  products = [];
  selectedProduct;
  materials = [];
  Materials = [];
  selectedMaterial;
  factorType = [];
  addMaterialFlag = false;
  factorTypes = [];
  factors = [];
  updateMaterial;
  addFacorTypeFlag = false;
  addFacorFlag = false;
  onMaterial = '';
  onFactorType = '';
  addMaterialData = '';
  updateMaterialFlag = false;
  updateMaData;
  updateMaterialId;
  addFactorTypeData;
  onMaterialId: any;
  updateFTypeFlag = false;
  updateFTypeName;
  updateFtypeId;
  onFactorTypeId: any;
  updateFactor: any;
  addFactorName: any;
  updateFacorFlag = false;
  updateFactorName;
  updateFactorId;
  updateFacTypeId;

  facorFlag = true;
  tableShow2;
  tableShow3;
  data = [];
  // 上传中UI
  uploading;
  downloadMaterial: any;
  downloadFactorType: any;
  count: number;
  finishUp = false;
  productMaterials = [];
  materialList;
  uploadTotal;
  uploadCount;
  uploadStatus;
  showMaterialList;
  prodMaterials = [];
  factorTypeOkloding = false;
  esFactors;
  addFTypeFactor;
  modelMaterialUploadId;
  destroy$ = new Subject();
  trans = {};

  constructor(
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private yrFactor: YrFactorService,
    private productService: ProductApi,
    private materialService: MaterialApi,
    private factorTypeService: FactorTypeApi,
    private factorService: FactorApi,
    private yrGenerateService: YrGenerateService,
    private translate: TranslateService) { }

  ngOnInit() {
    // 初始化I18N;
    this.translate.get(['dfq.enter-material', 'dfq.material-already-exists', 'dfq.enter-factor-type', 'dfq.factor-type-already-exists', 'dfq.factor-already-exists', 'dfq.enter-factor', 'dfq.material-yield-maintenance']).subscribe(res => {
      this.trans['enterMaterial'] = res['dfq.enter-material'];
      this.trans['existsMaterial'] = res['dfq.material-already-exists'];
      this.trans['enterFactorType'] = res['dfq.enter-factor-type'];
      this.trans['existsFactorType'] = res['dfq.factor-type-already-exists'];
      this.trans['existsFactor'] = res['dfq.factor-already-exists'];
      this.trans['enterFactor'] = res['dfq.enter-factor'];
      this.trans['materialYieldMaintenance'] = res['dfq.material-yield-maintenance'];
    });
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.enter-material', 'dfq.material-already-exists', 'dfq.enter-factor-type', 'dfq.factor-type-already-exists', 'dfq.factor-already-exists', 'dfq.enter-factor', 'dfq.material-yield-maintenance']).subscribe(res => {
        this.trans['enterMaterial'] = res['dfq.enter-material'];
        this.trans['existsMaterial'] = res['dfq.material-already-exists'];
        this.trans['enterFactorType'] = res['dfq.enter-factor-type'];
        this.trans['existsFactorType'] = res['dfq.factor-type-already-exists'];
        this.trans['existsFactor'] = res['dfq.factor-already-exists'];
        this.trans['enterFactor'] = res['dfq.enter-factor'];
        this.trans['materialYieldMaintenance'] = res['dfq.material-yield-maintenance'];
      });
    });
    this.showMaterialList = false;
    this.tableShow2 = false;
    this.tableShow3 = false;
    this.uploading = false;
    this.productService.find({}).subscribe(products => this.products = products);
    this.getMaterials();
    this.factorTypeService.find().subscribe(factorTypes => this.factorTypes = factorTypes);
    this.factorService.find().subscribe(factors => this.factors = factors);

    this.validatorForm = this.fb.group({
      productId: [null, Validators.required],
      materialId: [null],
    });
  }

  ngOnChanges() { }


  query() {
    this.isLoading = true;
    this.uploading = false;
    this.onFactorType = '';
    this.onMaterial = '';
    this.Materials = [];
    this.prodMaterials = [];
    this.factors = [];
    this.factorTypes = [];
    for (const i in this.validatorForm.controls) {
      if (this.validatorForm.controls.hasOwnProperty(i)) {
        this.validatorForm.controls[i].markAsDirty();
        this.validatorForm.controls[i].updateValueAndValidity();
      }
    }
    if (!this.selectedProduct) {
      this.isLoading = false;
      this.messageService.create('error', 'Please select product!');
      return;
    } else {
      this.yrFactor.productToMaterial(undefined, this.selectedProduct).subscribe(resu => {
        for (let index = 0; index < resu.length; index++) {
          const element = resu[index];
          this.prodMaterials.push(element);
        }
      });
      this.yrFactor.productToMaterial(this.selectedMaterial === null ? undefined : this.selectedMaterial, this.selectedProduct).subscribe(res => {
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          this.Materials.push(element);
        }
        this.showMaterialList = true;
        this.isLoading = false;
      });
    }
  }

  changeProduct(product) {
    this.selectedMaterial = null;
    this.materialList = this.materials.filter(material => material.productId === product);
  }

  getMaterials(productId?) {
    this.materialService.find({ where: { productId: productId } }).subscribe(materials => this.materials = materials);
  }

  clickMaterial(material) {
    this.tableShow2 = true;
    this.tableShow3 = false;
    this.updateMaterial = material.name;
    this.onMaterial = material.name;
    this.onMaterialId = material.id;
    return this.yrFactor.materialToType(material.id).subscribe(res => {
      this.factorTypes = res;
    });
  }
  clickFactorType(factorType) {
    this.tableShow3 = true;
    this.onFactorTypeId = factorType.id;
    this.onFactorType = factorType.name;
    return this.yrFactor.typeToFactor(factorType.id).subscribe(res => {
      this.factors = res;
    });
  }
  addMaterial() {
    this.addMaterialFlag = true;
  }
  addMaterialCancel() {
    this.addMaterialFlag = false;
  }
  materialModelOk() {
    if (!this.addMaterialData) {
      this.messageService.create('error', this.trans['enterMaterial']);
      return;
    }
    this.addMaterialData = this.addMaterialData.trim();
    if (this.prodMaterials.find(item => item['name'] === this.addMaterialData)) {
      this.messageService.create('error', this.trans['existsMaterial']);
      return;
    }
    const addmaterial = {
      productId: this.selectedProduct,
      name: this.addMaterialData
    };
    return this.yrFactor.addMaterial(addmaterial).subscribe(res => {
      this.query();
      this.messageService.create('success', 'Added successfully!');
      this.addMaterialFlag = false;

    });
  }

  UPMaterialCancel() {
    this.updateMaterialFlag = false;
  }

  editMaterial(material) {
    this.updateMaterialFlag = true;
    this.updateMaData = material.name;
    this.updateMaterialId = material.id;
  }

  upMaterialModelOk() {
    if (!this.updateMaData) {
      this.messageService.create('error', this.trans['enterMaterial']);
      return;
    }
    this.updateMaData = this.updateMaData.trim();
    if (this.prodMaterials.find(item => item['name'] === this.updateMaData)) {
      this.messageService.create('error', this.trans['existsMaterial']);
      return;
    }
    const updateM = {
      productId: this.selectedProduct,
      name: this.updateMaData,
      id: this.updateMaterialId,
    };
    return this.yrFactor.updateMaterial(updateM).toPromise().then(res => {
      this.query();
      this.messageService.create('success', 'Successfully modified!');
      this.updateMaterialFlag = false;
    });
  }
  upMaterialCancel() {
    this.updateMaterialFlag = false;
  }

  FactorTypeCancel() {
    this.addFacorTypeFlag = false;
  }
  addFactorTypeCancel() {
    this.addFacorTypeFlag = false;
  }
  addFactorType() {
    this.addFacorTypeFlag = true;
  }
  factorTypeModelOk() {
    this.factorTypeOkloding = true;
    if (!this.addFactorTypeData) {
      this.messageService.create('error', this.trans['enterFactorType']);
      this.factorTypeOkloding = false;
      return;
    }
    this.addFactorTypeData = this.addFactorTypeData.trim();
    if (this.factorTypes.find(item => item['name'] === this.addFactorTypeData)) {
      this.messageService.create('error', this.trans['existsFactorType']);
      this.factorTypeOkloding = false;
      return;
    }
    const addFType = {
      materialId: this.onMaterialId,
      name: this.addFactorTypeData
    };
    // 通過 MaterialId 查詢 ModelMaterialUploadId,判斷資料是否維護完成
    this.yrFactor.getModelMaterialUpload(this.onMaterialId).subscribe(async modelMaterialUpload => {
      // this.modelMaterialUploadId = modelMaterialUpload;
      let hasModelMaterial = 0;
      this.esFactors = [];
      for (let index = 0; index < modelMaterialUpload.length; index++) {
        await this.yrGenerateService.getEsByModelMaterialId(modelMaterialUpload[index].id).toPromise().then(esFactors => {
          this.esFactors.push(esFactors);
          if (esFactors['hits']['hits'].length !== 0) {
            if (!!esFactors['hits']['hits'][0]['_source']['factors'][0]) {
              hasModelMaterial++;
            }
          }
        });
      }
      if (hasModelMaterial === modelMaterialUpload.length) {
        this.yrFactor.addFactType(addFType).toPromise().then(red => {
          this.yrFactor.materialToType(this.onMaterialId).toPromise().then(async re => {
            this.factorTypes = re;
            // 新增的無因子的id
            this.addFTypeFactor = re[0]['factors'][0].id;
            // 添加esFactor
            for (let j = 0; j < this.esFactors.length; j++) {
              let updateFactors = this.esFactors[j]['hits']['hits'][0]['_source']['factors'];
              let esId = this.esFactors[j]['hits']['hits'][0]['_id'];
              let modelMaterialUploadId = this.esFactors[j]['hits']['hits'][0]['_source']['modelMaterialId'];
              updateFactors.push(this.addFTypeFactor);
              this.yrGenerateService.updateEsData(esId, modelMaterialUploadId, updateFactors).toPromise().then(final => {
                esId = '';
                updateFactors = [];
                modelMaterialUploadId = '';
                this.esFactors = [];
              });
            }
          });
        });
        // 通過 MaterialId 查詢 ModelMaterialId
        this.yrFactor.getModelMaterial(this.onMaterialId).toPromise().then(modelMaterial => {
          for (let index = 0; index < modelMaterial.length; index++) {
            // 根據ModelMaterialId和新增的無因子的id新增一條 ModelMaterialFactor
            this.yrFactor.updateModelMaterialFactor({
              modelMaterialId: modelMaterial[index]['id'],
              factorId: this.addFTypeFactor
            }).subscribe();
          }
        });
        this.messageService.create('success', 'Added successfully!');
        this.addFacorTypeFlag = false;
        this.factorTypeOkloding = false;
        return;
      } else {
        this.messageService.create('error', this.trans['materialYieldMaintenance']);
        this.addFacorTypeFlag = false;
        this.factorTypeOkloding = false;
        return;
      }
    });
  }

  editFType(factorType) {
    this.updateFTypeFlag = true;
    this.updateFTypeName = factorType.name;
    this.updateFtypeId = factorType.id;
  }

  UPFTypeCancel() {
    this.updateFTypeFlag = false;
  }
  upFTypeCancel() {
    this.updateFTypeFlag = false;
  }

  updateFTypeModelOk() {
    if (!this.updateFTypeName) {
      this.messageService.create('error', this.trans['enterFactorType']);
      return;
    }

    this.updateFTypeName = this.updateFTypeName.trim();
    if (this.factorTypes.find(item => item['name'] === this.updateFTypeName)) {
      this.messageService.create('error', this.trans['existsFactorType']);
      return;
    }
    const updateFTypeData = {
      id: this.updateFtypeId,
      name: this.updateFTypeName,
      materialId: this.onMaterialId,
    };
    return this.yrFactor.updateFType(updateFTypeData).subscribe(res => {
      return this.yrFactor.materialToType(this.onMaterialId).subscribe(re => {
        this.factorTypes = re;
        this.messageService.create('success', 'Successfully modified!');
        this.updateFTypeFlag = false;
      });
    });
  }

  addFactorCancel() {
    this.addFacorFlag = false;
  }
  addFCancel() {
    this.addFacorFlag = false;
  }

  addFactor() {
    this.addFacorFlag = true;
  }
  FactorModelOk() {

    if (!this.addFactorName) {
      this.messageService.create('error', this.trans['enterFactor']);
      return;
    }
    this.addFactorName = this.addFactorName.trim();
    if (this.factors.find(item => item['name'] === this.addFactorName)) {
      this.messageService.create('error', this.trans['existsFactor']);
      return;
    }
    const addFactorData = {
      name: this.addFactorName,
      factorTypeId: this.onFactorTypeId,
    };
    return this.yrFactor.addFactor(addFactorData).subscribe(res => {
      return this.yrFactor.typeToFactor(this.onFactorTypeId).subscribe(re => {
        this.factors = re;
        this.addFacorFlag = false;
        this.messageService.create('success', 'Added successfully!');
      });
    });
  }
  editFactor(factor) {
    this.updateFacorFlag = true;
    this.updateFactorName = factor.name;
    this.updateFactorId = factor.id;
    this.updateFacTypeId = factor.factorTypeId;
  }
  updateFactorCancel() {
    this.updateFacorFlag = false;
  }
  updateFCancel() {
    this.updateFacorFlag = false;
  }
  updateFactorModelOk() {
    if (!this.updateFactorName) {
      this.messageService.create('error', this.trans['enterFactor']);
      return;
    }
    // 如果修改因子名已經存在則不予許重複
    this.updateFactorName = this.updateFactorName.trim();
    if (this.factors.find(item => item['name'] === this.updateFactorName)) {
      this.messageService.create('error', this.trans['existsFactor']);
      return;
    }

    const updateFactorData = {
      id: this.updateFactorId,
      name: this.updateFactorName,
      factorTypeId: this.updateFacTypeId,
    };
    return this.yrFactor.updateFactor(updateFactorData).subscribe(res => {
      return this.yrFactor.typeToFactor(this.updateFacTypeId).subscribe(re => {
        this.factors = re;
        this.updateFacorFlag = false;
        this.messageService.create('success', 'Successfully modified!');
      });
    });
  }

  upsertMaterials(productId, data) {
    const materials = Utils.groupBy(data, '物料');
    for (const material in materials) {
      // material not exists
      if (this.materials.filter((row: Material) => {
        if (row.name === material && row.productId === productId) {
          return true;
        } else {
          return false;
        }
      }).length === 0) {
        this.materialService.create({ name: material, productId: productId }).subscribe(result => this.materials.push(result));
      } else {
        // material exists
      }
    }
  }

  upsertFactorTypes(materialId, data) {
    const factorTypes = Utils.groupBy(data, '項目');
    for (const factorType in factorTypes) {
      if (this.factorTypes.filter((row: FactorType) => {
        if (row.name === factorType && row.materialId === materialId) {
          return true;
        } else {
          return false;
        }
      }).length === 0) {
        this.factorTypeService.create({ name: factorType, materialId: materialId }).subscribe(result => this.factorTypes.push(result));
      }
    }
  }

  upsertFactors(factorTypeId, data) {
    const factors = Utils.groupBy(data, '因子');
    for (const factor in factors) {
      if (this.factors.filter((row: Factor) => {
        if (row.name === factor && row.factorTypeId === factorTypeId) {
          return true;
        } else {
          return false;
        }
      }).length === 0) {
        this.factorService.create({ name: factor, factorTypeId: factorTypeId }).subscribe(result => this.factors.push(result));
      }
    }
  }

  upload() {
    this.uploading = true;
    this.isLoading = true;
    this.uploadCount = 0;
    this.uploadTotal = 1;
    this.uploadStatus = 'active';
    if (!this.filetoUpload) {
      this.uploading = false;
      this.isLoading = false;
      this.messageService.create('error', 'Please select file');
      return;
    } else {
      // check file name is excel type
      const fileData = document.getElementById('upload');
      const fileName = this.filetoUpload.name.substring(this.filetoUpload.name.lastIndexOf('.'));
      const format = new Array('.xlsx', '.xls', '.csv');
      if (format.indexOf(fileName) < 0) {
        fileData['value'] = '';
        this.uploadFileName = '';
        throw new Error('Only Excel types are accepted!');
      }
      this.uploadFileName = this.filetoUpload.name.slice(0, 15);

      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(this.filetoUpload);
      reader.onload = async (e: any) => {
        try {
          // read workbook
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          // grab first sheet
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          // sheet to json
          const header = XLSX.utils.sheet_to_json(ws, { header: 1 });
          const data = XLSX.utils.sheet_to_json(ws);
          // check header
          if (header.length > 0) {
            if (header[0][0] !== '產品類別') {
              throw new Error('第一列第一欄應為產品類別，請修改後再上傳');
            } else if (header[0][1] !== '物料') {
              throw new Error('第一列第二欄應為物料，請修改後再上傳');
            } else if (header[0][2] !== '項目') {
              throw new Error('第一列第三欄應為項目，請修改後再上傳');
            } else if (header[0][3] !== '因子') {
              throw new Error('第一列第四欄應為因子，請修改後再上傳');
            }
          }

          if (data && data.length === 0) {
            throw new Error('無資料，請檢查上傳檔案');
          } else {
            this.uploadTotal = data.length;
          }

          // replace \r\n with ''
          // replace left/right blank space
          for (let i = 0; i < data.length; i++) {
            data[i]['產品類別'] = data[i]['產品類別'].replace('\r\n', '').trim();
            data[i]['物料'] = data[i]['物料'].replace('\r\n', '').trim();
            data[i]['項目'] = data[i]['項目'].replace('\r\n', '').trim();
            if (typeof (data[i]['因子']) === 'string') {
              data[i]['因子'] = data[i]['因子'].replace('\r\n', '').trim();
            }
          }

          // group by product
          const products = Utils.groupBy(data, '產品類別');
          for (const product in products) {
            if (products.hasOwnProperty(product)) {
              let p: Product;
              // product exists?
              await this.productService.findOne({ where: { id: product } }).toPromise().then((result: Product) => p = result).catch(err => console.log(err));
              if (p) {
                // group by material
                const materials = Utils.groupBy(products[product], '物料');
                for (const material in materials) {
                  if (materials.hasOwnProperty(material)) {
                    // material exists?
                    let m: Material;
                    await this.materialService.findOne({ where: { name: material, productId: product } }).toPromise()
                      .then((result: Material) => m = result).catch(err => console.log(err));
                    // create material if not exists
                    if (!m) {
                      await this.materialService.create({ productId: product, name: material }).toPromise()
                        .then((result: Material) => { this.materials.push(result); m = result; })
                        .catch(err => console.log(err));
                    }
                    // group by factor type
                    const factorTypes = Utils.groupBy(materials[material], '項目');
                    for (const factorType in factorTypes) {
                      if (factorTypes.hasOwnProperty(factorType)) {
                        let f: FactorType;
                        await this.factorTypeService.findOne({ where: { name: factorType, materialId: m.id } }).toPromise().then((result: FactorType) => f = result).catch(err => {
                          console.log(err);
                        });
                        // create factor type if not exists
                        if (!f) {
                          await this.factorTypeService.create({ name: factorType, materialId: m.id }).toPromise()
                            .then((result: FactorType) => {
                              this.factorTypes.push(result);
                              f = result;
                              console.log(f);
                            });
                          await this.yrFactor.getModelMaterialUpload(f.materialId).toPromise().then(async modelMaterialUploads => {
                            if (modelMaterialUploads.length === 0) {
                              return;
                            }
                            let hasModelMaterial = 0;
                            this.esFactors = [];
                            for (let index = 0; index < modelMaterialUploads.length; index++) {
                              await this.yrGenerateService.getEsByModelMaterialId(modelMaterialUploads[index].id).toPromise().then(async esFactors => {
                                if (esFactors['hits']['hits'].length !== 0) {
                                  if (!!esFactors['hits']['hits'][0]['_source']['factors'][0]) {
                                    hasModelMaterial++;
                                  }
                                }
                                this.esFactors.push(esFactors);
                              });
                            }
                            if (hasModelMaterial === modelMaterialUploads.length) {
                              await this.yrFactor.materialToType(f.materialId).toPromise().then(async re => {
                                this.factorTypes = re;
                                this.addFTypeFactor = re[0]['factors'][0].id;
                                for (let j = 0; j < this.esFactors.length; j++) {
                                  const updateFactors = this.esFactors[j]['hits']['hits'][0]['_source']['factors'];
                                  const esId = this.esFactors[j]['hits']['hits'][0]['_id'];
                                  const modelMaterialUploadId = this.esFactors[j]['hits']['hits'][0]['_source']['modelMaterialId'];
                                  updateFactors.push(this.addFTypeFactor);
                                  console.log(updateFactors);
                                  await this.yrGenerateService.updateEsData(esId, modelMaterialUploadId, updateFactors).toPromise().then(r => { console.log(r); }
                                  );
                                }
                              });
                              this.yrFactor.getModelMaterial(f.materialId).toPromise().then(modelMaterial => {
                                for (let k = 0; k < modelMaterial.length; k++) {
                                  this.yrFactor.updateModelMaterialFactor({
                                    modelMaterialId: modelMaterial[k]['id'],
                                    factorId: this.addFTypeFactor
                                  }).subscribe();
                                }
                              });
                              return;
                            } else {
                              this.messageService.create('error', this.trans['materialYieldMaintenance']);
                              return;
                            }
                          });
                        }
                        // group by factor
                        const factors = Utils.groupBy(factorTypes[factorType], '因子');
                        for (const factor in factors) {
                          if (factors.hasOwnProperty(factor)) {
                            let fa: Factor;
                            await this.factorService.findOne({ where: { name: factor, factorTypeId: f.id } }).toPromise().then((result: Factor) => fa = result).catch(err => console.log(err));
                            if (!fa) {
                              // create factor if not exists
                              this.factorService.create({ name: factor, factorTypeId: f.id }).subscribe(result => {
                                this.factors.push(result);
                                this.uploadCount++;
                              });
                            } else {
                              this.uploadCount++;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                throw new Error('Product ' + product + 'does not exist');
              }
            }
          }

          this.uploadStatus = 'success';
          this.filetoUpload = null;
          fileData['value'] = '';
          this.uploadFileName = '';
          this.uploading = false;
          this.isLoading = false;
        } catch (err) {
          this.messageService.create('error', err);
          fileData['value'] = '';
          this.uploadFileName = '';
          this.filetoUpload = null;
          this.uploading = false;
          this.isLoading = false;
          this.uploadStatus = 'execption';
        }
      };
    }
  }

  handleUploadFile(uploadFile) {
    this.filetoUpload = uploadFile.files.item(0);
    // console.log(this.filetoUpload);
    if (this.filetoUpload) {
      let fileName = this.filetoUpload.name;
      const format = new Array('.xlsx', '.xls', '.csv');
      fileName = fileName.substring(fileName.lastIndexOf('.'));
      if (format.indexOf(fileName) < 0) {
        this.messageService.create('error', 'Only Excel types are accepted!');
        this.uploadFileName = '';
        return;
      }
      this.uploadFileName = this.filetoUpload.name;
    }
  }

  download() {
    if (this.selectedMaterial == null) {
      this.downloadMaterial = undefined;
    } else {
      this.downloadMaterial = this.selectedMaterial.id;
    }
    return this.yrFactor.downFile(this.selectedProduct, this.downloadMaterial, this.downloadFactorType).toPromise().then(res => {
      const tableData = [];
      if (res.length !== 0) {
        for (const ele of res) {
          for (const factorType of ele.factorTypes) {
            for (const factor of factorType.factors) {
              const tbdata = {
                '產品類別': this.selectedProduct,
                '物料': ele.name,
                '項目': factorType.name,
                '因子': factor.name,
              };
              tableData.push(tbdata);
            }
          }
        }
      } else {
        const tbdata = {
          '產品類別': '',
          '物料': '',
          '項目': '',
          '因子': '',
        };
        tableData.push(tbdata);
      }

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, '因子維護.xlsx');
    });

  }

  enableMaterial(material: Material) {
    this.isLoading = true;
    this.materialService.patchAttributes(material.id, { enabled: material.enabled }).subscribe({
      next: result => {
        this.isLoading = false;
      },
      error: error => {
        this.messageService.create('error', error.message);
        // recovery material enabled
        material.enabled = !material.enabled;
        this.isLoading = false;
      }
    });
  }

  closeFacterType() {
    this.tableShow2 = false;
    this.tableShow3 = false;
  }
  closeFacter() {
    this.tableShow3 = false;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
