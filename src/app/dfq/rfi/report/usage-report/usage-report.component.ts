import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsageService } from './usage.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { YrQueryService } from '../../yr-generate/query-form/yr-query.service';
import { NewmodelService } from '../newmodel-yr-report/newmodel.service';
import { DownexcelService } from '@service/downexcel.service';
import { debounceTime, map } from 'rxjs/operators';
import { Utils } from 'app/dfq/utils';

@Component({
  selector: 'app-usage-report',
  templateUrl: './usage-report.component.html',
  styleUrls: ['./usage-report.component.scss']
})
export class UsageReportComponent implements OnInit {

  validateForm: FormGroup;
  hasParam: boolean;
  plantSelectValue: string;
  buSelectValue: string;
  customerSelectValue: string;
  modelTypeSelectValue: string;
  cFlowSelectValue: string;
  modelNameSelectValue = [];
  modelFamilySelectValue = [];

  listOfPlantSelectOption = [];
  listOfBuSelectOption = [];
  listOfCustomerSelectOption = [];
  listOfModelTypeSelectOption = [];
  listOfModelNameSelectOption = [];

  tableShow = false;
  showData = [];
  modelGroup: any;
  Models: any[];
  loading = false;
  loadModel = false;
  down = false;
  customers: {}[] = [];
  products: {}[] = [];
  projects: {}[] = [];
  models: {}[] = [];
  searchCustomers = [];
  searchProducts = [];
  searchProjects = [];
  searchModels = [];
  queryFlag = true;
  queryData = [];

  sortValue: 'ascend' | 'descend' | null = null;
  searchValue: string[] = [];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private yrQueryService: YrQueryService,
    private newModelService: NewmodelService,
    private downExcelService: DownexcelService,
    private usageService: UsageService
  ) {
    this.listOfPlantSelectOption = this.route.snapshot.data['plantsResolver'];
    this.listOfBuSelectOption = this.route.snapshot.data['busResolver'];
    this.hasParam = false;
    this.route.queryParams.subscribe(params => {
      if (params['sitePlant']) {
        this.plantSelectValue = params['sitePlant'];
        this.hasParam = true;
        this.getModel();
      }
    });
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      plantSelectValue: [null, [Validators.required]],
      buSelectValue: [null],
      customerSelectValue: [null],
      modelTypeSelectValue: [null],
      modelFamilySelectValue: [null],
      modelNameSelectValue: [null]
    });
    this.queryFlag = true;
  }

  getModel() {
    if (this.plantSelectValue) {
      this.loadModel = true;
      this.queryFlag = true;
    }
    this.customerSelectValue = '';
    this.modelTypeSelectValue = '';
    this.listOfModelNameSelectOption = [];
    this.listOfModelTypeSelectOption = [];
    this.listOfCustomerSelectOption = [];
    this.modelFamilySelectValue = [];
    this.modelNameSelectValue = [];
    this.usageService.getViewYield(this.plantSelectValue, this.buSelectValue, this.customerSelectValue, this.modelTypeSelectValue).subscribe(res => {
      this.listOfModelNameSelectOption = res;
      for (let index = 0; index < res.length; index++) {
        if (!this.listOfModelTypeSelectOption.includes(res[index]['product'])) {
          this.listOfModelTypeSelectOption.push(res[index]['product']);
        }
        if (!this.listOfCustomerSelectOption.includes(res[index]['customer'])) {
          this.listOfCustomerSelectOption.push(res[index]['customer']);
        }
      }
      this.loadModel = false;
      this.queryFlag = false;
      if (this.hasParam) {
        this.query();
      }
    });
  }
  modelChange() {
    if (!this.modelTypeSelectValue) {
      this.listOfModelNameSelectOption = [];
      this.usageService.getViewYield(this.plantSelectValue, this.buSelectValue, this.customerSelectValue, this.modelTypeSelectValue).subscribe(res => {
        this.listOfModelNameSelectOption = res;
        this.loadModel = false;
        this.queryFlag = false;
      });
    } else {
      this.loadModel = true;
      this.queryFlag = true;
      this.listOfModelNameSelectOption = [];
      this.newModelService.getModelbyProduct(this.plantSelectValue, this.modelTypeSelectValue).subscribe(res => {
        this.listOfModelNameSelectOption = res;
        this.loadModel = false;
        this.queryFlag = false;
      });
    }
  }


  changeModelFamily(evt) {
    this.modelNameSelectValue = [];
    for (let index = 0; index < evt.length; index++) {
      this.modelNameSelectValue.push(this.listOfModelNameSelectOption.find(item => item.project === evt[index]).model);
    }
  }

  query() {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    this.loading = true;
    this.showData.length = 0;
    if (this.modelNameSelectValue.length === 0) {
      const model = [];
      for (const item of this.listOfModelNameSelectOption) {
        if (!model.includes(item.model)) {
          model.push(item.model);
        }
      }
      this.customers = [];
      this.products = [];
      this.projects = [];
      this.models = [];
      this.usageService.getViewYieldNoModels(this.plantSelectValue, this.buSelectValue, this.customerSelectValue, this.modelTypeSelectValue).subscribe(res => {
        this.showData = res;
        this.queryData = res;
        for (let index = 0; index < res.length; index++) {
          this.customers = [...this.customers, { text: res[index]['customer'], value: res[index]['customer'] }];
          this.products = [...this.products, { text: res[index]['product'], value: res[index]['product'] }];
          this.projects = [...this.projects, { text: res[index]['project'], value: res[index]['project'] }];
          this.models = [...this.models, { text: res[index]['model'], value: res[index]['model'] }];
        }
        const result = new Map();
        this.customers = this.customers.filter(item => !result.has(item['value']) && result.set(item['value'], 1));
        this.products = this.products.filter(item => !result.has(item['value']) && result.set(item['value'], 1));
        this.projects = this.projects.filter(item => !result.has(item['value']) && result.set(item['value'], 1));
        this.models = this.models.filter(item => !result.has(item['value']) && result.set(item['value'], 1));
        this.loading = false;
        this.tableShow = true;
      });
    } else {
      this.usageService.getViewYieldByModels(this.modelNameSelectValue, this.plantSelectValue).subscribe(res => {
        this.showData = res;
        this.queryData = res;
        this.loading = false;
        this.tableShow = true;
      });
    }
  }
  // 良率排序
  sort(searchValue: string[]): void {
    this.searchValue = searchValue;
    const filterFunc = (item) => {
      return this.searchValue.length ? this.searchValue.some(name => item.name.indexOf(name) !== -1) : true;
    };
    const queryData = this.queryData.filter(item => filterFunc(item));
    this.showData = queryData.sort((a, b) =>
      this.sortValue === 'ascend' ? (a.improvedYieldRate > b.improvedYieldRate ? 1 : -1) : b.improvedYieldRate > a.improvedYieldRate ? 1 : -1);
  }

  filter(searchCustomer: string[], searchProduct: string[], searchProject: String[], searchModel: String[]): void {
    this.searchCustomers = searchCustomer;
    this.searchProducts = searchProduct;
    this.searchProjects = searchProject;
    this.searchModels = searchModel;
    this.search();
  }

  search(): void {
    this.showData = this.queryData.filter(item => this.searchCustomers && this.searchCustomers.length > 0 ? this.searchCustomers.includes(item['customer']) : true)
      .filter(item => this.searchProducts && this.searchProducts.length > 0 ? this.searchProducts.includes(item['product']) : true)
      .filter(item => this.searchProjects && this.searchProjects.length > 0 ? this.searchProjects.includes(item['project']) : true)
      .filter(item => this.searchModels && this.searchModels.length > 0 ? this.searchModels.includes(item['model']) : true);
  }

  download() {
    this.down = true;
    setTimeout(() => {
      const table = document.getElementById('yrReport');
      this.downExcelService.exportTableAsExcelFile(table, 'yrReport');
      this.down = false;
    }, 1000);

  }

}
