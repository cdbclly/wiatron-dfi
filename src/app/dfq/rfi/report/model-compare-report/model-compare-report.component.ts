import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ModelCompareService } from './model-compare.service';
import { NzMessageService } from 'ng-zorro-antd';
import { YrGenerateService } from '../../yr-generate/yr-generate.service';
import { DownexcelService } from '@service/downexcel.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-model-compare-report',
  templateUrl: './model-compare-report.component.html',
  styleUrls: ['./model-compare-report.component.scss']
})
export class ModelCompareReportComponent implements OnInit {
  validateForm: FormGroup;
  isLoading = false;
  selectMaterial;
  Materials = [];
  Products = [];
  selectProduct;
  Models = [];
  selectModel1;
  selectModel2;
  selectModel3;
  selectModel4;
  viewData = [];
  factorTypes = [];
  queryData = [];
  queryFlag = false;
  down = false;

  filterModelList = []; //增加DFQ流程后 過濾的機種
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modelCompareService: ModelCompareService,
    private message: NzMessageService,
    private yrGenerateService: YrGenerateService,
    private downloadService: DownexcelService) {
    this.Products = this.route.snapshot.data['productsResolver'];
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      selectProduct: [null, [Validators.required]],
      selectMaterial: [null, [Validators.required]],
      selectModel1: [null],
      selectModel2: [null],
      selectModel3: [null],
      selectModel4: [null]
    });
  }

  // 產品的值改變時
  getMaterial(product) {
    this.Models = [];
    this.selectMaterial = '';
    this.selectModel1 = '';
    this.selectModel2 = '';
    this.selectModel3 = '';
    this.selectModel4 = '';
    this.modelCompareService.getMaterial(product).subscribe(res => {
      this.Materials = res;
      // 根據廠別 抓取ProjectName和ProjectCode下拉框的值從 ProjectCodeProfile和ProjectNameProfile
      this.yrGenerateService.getRFiModel(null, product).subscribe(data => {
        this.filterModelList = data.ProjectModel['model'];
      });
    });
  }

  // 物料的值改變時
  async getSelect() {
    this.selectModel1 = '';
    this.selectModel2 = '';
    this.selectModel3 = '';
    this.selectModel4 = '';
    this.Models = [];
    if (this.selectMaterial && this.selectProduct) {
      await this.modelCompareService.getSelect(this.selectMaterial, this.selectProduct).toPromise().then(async res => {
        const result = res.filter(d => this.filterModelList.includes(d['modelId']));
        for (const view of result) {
          if (!this.Models.includes('<' + view.plant + '-' + view.customer + '>' + view.modelId)) {
            this.Models.push('<' + view.plant + '-' + view.customer + '>' + view.modelId);
          }
        }
      });
    }
  }

  async query() {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    this.isLoading = true;
    this.queryFlag = false;
    this.factorTypes = [];
    this.queryData = [];
    if (!this.selectProduct || !this.selectMaterial) {
      this.message.create('error', 'Please select required option!');
      this.isLoading = false;
      return;
    }
    const models = [];
    if (this.selectModel1) {
      models.push(this.selectModel1.split('>')[1]);
    }
    if (this.selectModel2) {
      models.push(this.selectModel2.split('>')[1]);
    }
    if (this.selectModel3) {
      models.push(this.selectModel3.split('>')[1]);
    }
    if (this.selectModel4) {
      models.push(this.selectModel4.split('>')[1]);
    }
    if (models.length === 0) {
      this.message.create('error', 'Please select model');
      this.isLoading = false;
      return;
    }
    await this.modelCompareService.getFactorType(this.selectMaterial).toPromise().then(res => {
      this.factorTypes = res;
    });
    await this.modelCompareService.getFromData(this.selectProduct, this.selectMaterial, models)
      .toPromise().then(async res => {
        for (const item of res) {
          await this.yrGenerateService.getEsByModelMaterialId(item.id).toPromise().then(es => {
            const esData = es['hits']['hits'][0]['_source']['factors'];
            item['factors'] = esData;
            this.queryData.push(item);
          });
        }
        this.queryFlag = true;
        this.isLoading = false;
      });
  }

  download() {
    this.down = true;
    setTimeout(() => {
      const id = document.getElementById('Report');
      this.downloadService.exportTableAsExcelFile(id, '機種設計比對');
      this.down = false;
    }, 1000);
  }
}
