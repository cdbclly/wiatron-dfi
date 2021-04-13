import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { MaterialYrService } from '../material-yr.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-material-mapping',
  templateUrl: './material-mapping.component.html',
  styleUrls: ['./material-mapping.component.scss']
})
export class MaterialMappingComponent implements OnInit, OnDestroy {
  selectProduct;
  selectPlant;
  selectMaterial;
  products = [];
  plants = [];
  materials = [];
  transferShow = false;
  nonRelatedMaterials: any[] = [];
  sfcDefectRateData = [];
  sfcDistinctMaterialData = [];
  relatedMaterials = [];
  materialId;
  saveFlag = true;
  isLoading;
  validatorForm: FormGroup;

  // i18n
  destroy$ = new Subject();
  trans: Object = {};
  title1 = '未關聯SFCS物料Description';
  title2 = '已關聯SFCS物料Description';

  constructor(
    private message: NzMessageService,
    private materialMappingService: MaterialYrService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    // 初始化I18N;
    this.translate.get(['dfq.rfi-material-maping-title1', 'dfq.rfi-material-maping-title2']).subscribe(res => {
      this.title1 = res['dfq.rfi-material-maping-title1'];
      this.title2 = res['dfq.rfi-material-maping-title2'];
    });
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.rfi-material-maping-title1', 'dfq.rfi-material-maping-title2']).subscribe(res => {
        this.title1 = res['dfq.rfi-material-maping-title1'];
        this.title2 = res['dfq.rfi-material-maping-title2'];
      });
    });
  }

  ngOnInit() {
    this.getProduct();
    this.validatorForm = this.fb.group({
      productId: [null, Validators.required],
      plantId: [null, Validators.required],
      materialId: [null, [Validators.required]],
    });
  }

  getProduct() {
    this.materialMappingService.getProduct().subscribe(res => {
      this.products = res;
    });
  }

  getMaterial() {
    this.selectMaterial = '';
    this.selectPlant = '';
    this.plants = [];
    this.materials = [];
    this.materialMappingService.getViewSFCDEFECTRATEDATA({ where: { PRODUCT: this.selectProduct } }).subscribe(res => {
      console.log(res);
      for (let index = 0; index < res.length; index++) {
        if (!this.plants.includes(res[index]['SITE'] + '-' + res[index]['PLANT'])) {
          this.plants.push(res[index]['SITE'] + '-' + res[index]['PLANT']);
        }
      }
    });
    this.materialMappingService.getMaterial2(this.selectProduct).subscribe(res => {
      this.materials = res;
    });
  }

  getDFQMaterial() {
    this.materialId = this.selectMaterial;
  }

  query() {
    this.transferShow = false;
    this.isLoading = true;
    for (const i in this.validatorForm.controls) {
      if (this.validatorForm.controls.hasOwnProperty(i)) {
        this.validatorForm.controls[i].markAsDirty();
        this.validatorForm.controls[i].updateValueAndValidity();
      }
    }
    if (!this.selectProduct) {
      this.message.create('error', 'Please select the product!');
    } if (!this.selectPlant) {
      this.message.create('error', 'Please select Plant!');
    } if (!this.selectMaterial) {
      this.message.create('error', 'Please select material!');
    } if (this.selectProduct && this.selectPlant && this.selectMaterial) {
      this.materialMappingService.getViewSFCDEFECTRATEDATA({
        where: {
          PRODUCT: this.selectProduct,
          PLANT: this.selectPlant.split('-')[1]
        }
      }).subscribe(res => {
        this.sfcDefectRateData = res;
        // SFCS物料去重
        const map = new Map();
        this.sfcDistinctMaterialData = this.sfcDefectRateData.filter(
          item => !map.has(item.REASONDESC) && map.set(item.REASONDESC, 1)
        );
        this.nonRelatedMaterials = [];
        for (let index = 0; index < this.sfcDistinctMaterialData.length; index++) {
          // 未關聯SFCS物料
          if (!this.sfcDistinctMaterialData[index]['MATERIALID']) {
            this.nonRelatedMaterials.push({
              key: index.toString(),
              title: `${this.sfcDistinctMaterialData[index]['REASONDESC']}`,
              description: this.sfcDistinctMaterialData[index],
              direction: 'left',
              changeDirection: ''
            });
          }
        }
        // 已關聯SFCS物料
        this.sfcDistinctMaterialData = this.sfcDistinctMaterialData.filter(item => item['MATERIALID'] === this.selectMaterial);
        for (let index = 0; index < this.sfcDistinctMaterialData.length; index++) {
          this.nonRelatedMaterials.push({
            key: index.toString(),
            title: `${this.sfcDistinctMaterialData[index]['REASONDESC']}`,
            description: this.sfcDistinctMaterialData[index],
            direction: 'right',
            changeDirection: ''
          });
        }
        console.log(this.nonRelatedMaterials);
        this.isLoading = false;
        this.transferShow = true;
      });
    }
  }

  change(ret: {}): void {
    ret['list'].filter(function (item) {
      item.changeDirection = ret['to'];
      return true;
    });
    this.relatedMaterials = [];
    for (let index = 0; index < ret['list'].length; index++) {
      ret['list'][index]['description']['changeDirection'] = ret['list'][index]['changeDirection'];
      this.relatedMaterials.push(ret['list'][index]['description']);
    }
    this.saveFlag = false;
  }

  save() {
    for (let index = 0; index < this.relatedMaterials.length; index++) {
      if (this.relatedMaterials[index]['changeDirection'] === 'right') {
        this.relatedMaterials[index]['MATERIALID'] = this.materialId;
      } else {
        this.relatedMaterials[index]['MATERIALID'] = null;
      }
      this.materialMappingService.updateSFCDEFECTRATEDATA(this.relatedMaterials[index]).subscribe(res => {
        console.log(res);
      });
      if (index === this.relatedMaterials.length - 1) {
        this.message.create('success', 'Save successfully!');
      }
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
