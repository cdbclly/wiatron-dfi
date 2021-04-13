import { DownexcelService } from '@service/downexcel.service';
import { ReportQueryService } from './report-query.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { PlantApi } from '@service/dfi-sdk';

@Component({
  selector: 'app-report-query',
  templateUrl: './report-query.component.html',
  styleUrls: ['./report-query.component.scss']
})
export class ReportQueryComponent implements OnInit {
  // Site
  sites = [];
  // Plant
  plants = [];
  // 產品
  products = [];
  // 客戶
  customers = [];
  // BU
  BUs = [];
  // 時間區間
  dateRange = [];
  // projectCode(Project)
  projectCode = [];
  // projectName(model)
  projectName = [];
  // 達標狀況
  complianceStatus = [
    {
      name: '已評估未通過',
      statu: 0
    },
    {
      name: '簽核中',
      statu: 1
    },
    {
      name: '未評估',
      statu: 2
    },
    {
      name: '已評估通過',
      statu: 3
    }
  ];
  flag = true;
  // 查找參數
  site;
  plant;
  plantList; // plant表
  product;
  customer;
  BU;
  project;
  model;
  modelResult;
  data = { total: [], pass: [] };
  showEchart = false;
  productList = [];
  clickProduct;
  show = false;
  modelFlag = false;
  detailFlag = false;
  queryFlag = true;
  // 紅綠燈數量
  overall = {
    red: 0,
    green: 0
  };
  // 未Run紅燈 簽核 已Run紅燈
  red = {
    unsubmit: 0,
    signing: 0,
    fail: 0
  };
  // 通過綠燈項目
  pass = [];
  // 已Run紅燈項目
  fail = [];
  // 簽核中紅燈項目
  sign = [];
  // 未Run紅燈項目
  unsubmit = [];
  tableDataSet = [];
  tableData = [];
  modelName;
  isUnsubmitted = false;
  isGreenPass = false;
  submitRed = false;
  signingRed = false;
  isVisible = false;
  designItem = []; // 存放去重的designItemName
  count = 0; // 記錄designItemName的數量
  items = []; // 存放審核通過項目的詳情
  index; // 存放點擊的哪一行
  reportDetail;
  title;
  showData;
  paramFlag;
  hasRoutPlant = false;
  v_ModelResult = [];
  downFlag = true;
  constructor(
    private service: ReportQueryService,
    private plantService: PlantApi,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private downExcelService: DownexcelService,
    private routerd: Router
  ) { }

  ngOnInit() {
    // 初始化加載時間區間
    const now = new Date();
    this.plantService.find().subscribe(res => {
      this.plantList = res;
      this.route.queryParams.subscribe(params => {
        this.paramFlag = params;
        if (this.paramFlag['plant']) {
          this.site = this.plantList.find(a => a.id === this.paramFlag['plant']).siteId;
          this.plant = this.paramFlag['plant'];
          this.hasRoutPlant = true;
          this.getResultBySite();
          // 初始化site下拉框的值
          this.sites = [];
          // 初始化plant下拉框的值
          this.plants = [];
          this.service.getModelResult({
            where: {
              businessGroup: localStorage.getItem('bg')
            }
          }).subscribe(res => {
            for (let index = 0; index < res.length; index++) {
              if (!this.sites.includes(res[index]['site'])) {
                this.sites.push(res[index]['site']);
              }
            }
          });
        } else {
          this.sites = [];
          this.plants = [];
          this.service.getViewModelResult().subscribe(res => {
            for (let index = 0; index < res.length; index++) {
              if (!this.sites.includes(res[index]['site'])) {
                this.sites.push(res[index]['site']);
              }
            }
          });
        }
      });
    });
  }

  getResultBySite() {
    this.show = false;
    if (this.site) {
      this.downFlag = false;
    }
    // 當site改變時，將其他的值全部清空，並且隱藏掉project和model
    if (!this.hasRoutPlant) {
      this.plant = undefined;
    }
    this.product = undefined;
    this.customer = undefined;
    this.BU = undefined;
    this.project = undefined;
    this.model = undefined;
    this.flag = true;
    this.plants = [];
    this.products = [];
    this.customers = [];
    this.BUs = [];
    // 初始化根據site拿plant，產品，客戶，BU下拉框的值
    this.service.getModelResult({
      where: {
        site: this.site
      }
    }).subscribe(res => {
      this.v_ModelResult = res;
      for (let index = 0; index < res.length; index++) {
        if (!this.plants.includes(res[index]['plant'])) {
          this.plants.push(res[index]['plant']);
        }
        if (!this.products.includes(res[index]['product'])) {
          this.products.push(res[index]['product']);
        }
        if (!this.customers.includes(res[index]['customer'])) {
          this.customers.push(res[index]['customer']);
        }
        if (!this.BUs.includes(res[index]['businessUnit'])) {
          this.BUs.push(res[index]['businessUnit']);
        }
      }
      this.query();
    });
  }

  getResultByPlant() {
    this.show = false;
    // 當plant改變時，將除site之外的其他值全部清空，並且隱藏掉project和model
    this.product = undefined;
    this.customer = undefined;
    this.BU = undefined;
    this.project = undefined;
    this.model = undefined;
    this.flag = true;
    this.products = [];
    this.customers = [];
    this.BUs = [];
    // 初始化根據site拿plant，產品，客戶，BU下拉框的值
    this.service.getModelResult({
      where: {
        plant: this.plant
      }
    }).subscribe(res => {
      for (let index = 0; index < res.length; index++) {
        if (!this.products.includes(res[index]['product'])) {
          this.products.push(res[index]['product']);
        }
        if (!this.customers.includes(res[index]['customer'])) {
          this.customers.push(res[index]['customer']);
        }
        if (!this.BUs.includes(res[index]['businessUnit'])) {
          this.BUs.push(res[index]['businessUnit']);
        }
      }
      this.query();
    });
  }

  // 查詢
  query() {
    if (!this.plant) {
      this.plant = undefined;
    }
    if (!this.product) {
      this.product = undefined;
    }
    this.getEchartsData(this.site, this.plant, this.product, this.dateRange);
    // 精確查找
    if (this.project && this.model) {
      this.service
        .getModelResult({
          where: {
            site: this.site,
            plant: this.plant,
            product: this.product,
            customer: this.customer,
            businessUnit: this.BU,
            project: this.project,
            model: this.model
          }
        })
        .subscribe(res => {
          this.reportDetail = res;
          if (this.reportDetail.length > 0) {
            const status = this.reportDetail[0]['status'];
            if (status === 3) {
              this.title = '已評估未通過';
            }
            if (status === 1) {
              this.title = '簽核中';
            }
            if (status === 0) {
              this.title = '未評估';
            }
            if (status === 2) {
              this.title = '已評估通過';
            }
          }
        });
      this.detailFlag = true;
      this.show = false;
    }
    this.hasRoutPlant = false;
  }

  // 根據site、plant、product去查詢View_modelResult表數據(要顯示的餅圖)
  getEchartsData(site, plant, product, date) {
    let queryData = {};
    // 是否带时间区间查询
    if (this.dateRange.length) {
      queryData = {
        plant: plant,
        site: site,
        product: product,
        projectCreatedOn: { between: this.dateRange }
      };
    } else {
      queryData = {
        plant: plant,
        site: site,
        product: product
      };
    }
    this.showEchart = false;
    if (JSON.stringify(this.paramFlag) !== '{}') {
      queryData['businessGroup'] = localStorage.getItem('bg');
      this.service
        .getModelResult({
          where: queryData
        })
        .subscribe(data => {
          this.modelResult = data;
          // 查找產品(去重)
          const res = new Map();
          const result = this.modelResult.filter(p => !res.has(p.product) && res.set(p.product, 1));
          this.productList.length = 0;
          for (let index = 0; index < result.length; index++) {
            this.productList.push(result[index].product);
          }
          // 在每次循環產品前清空(存放的格式)
          this.data['total'] = [];
          this.data['pass'] = [];
          for (let i = 0; i < this.productList.length; i++) {
            const ele1 = this.productList[i];
            let total = 0;
            let pass = 0;
            for (let j = 0; j < this.modelResult.length; j++) {
              const ele2 = this.modelResult[j];
              if (ele1 === ele2.product) {
                total++;
                if (ele2.status === 2) {
                  pass++;
                }
              }
              // 獲取總產品數和通過評估的數量(餅圖裡面的數據)
              this.data['total'][i] = total;
              this.data['pass'][i] = pass;
            }
            // 如果有資料,圓餅圖就顯示
            if (this.modelResult.length > 0) {
              this.showEchart = true;
            } else {
              this.message.create('error', 'No data！');
              return;
            }
            // 獲取總產品數和通過評估的數量(餅圖裡面的數據)
            this.data['total'][i] = total;
            this.data['pass'][i] = pass;
          }
          if (this.modelResult.length > 0) {
            this.showEchart = true;
          } else {
            this.message.create('error', 'No data！');
            return;
          }
        });
    } else {
      this.service
        .getModelResult({
          where: queryData
        })
        .subscribe(data => {
          this.modelResult = data;
          // 查找產品(去重)
          const res = new Map();
          const result = this.modelResult.filter(p => !res.has(p.product) && res.set(p.product, 1));
          this.productList.length = 0;
          for (let index = 0; index < result.length; index++) {
            this.productList.push(result[index].product);
          }
          // 在每次循環產品前清空(存放的格式)
          this.data['total'] = [];
          this.data['pass'] = [];
          for (let i = 0; i < this.productList.length; i++) {
            const ele1 = this.productList[i];
            let total = 0;
            let pass = 0;
            for (let j = 0; j < this.modelResult.length; j++) {
              const ele2 = this.modelResult[j];
              if (ele1 === ele2.product) {
                total++;
                if (ele2.status === 2) {
                  pass++;
                }
              }
              // 獲取總產品數和通過評估的數量(餅圖裡面的數據)
              this.data['total'][i] = total;
              this.data['pass'][i] = pass;
            }
            // 如果有資料,圓餅圖就顯示
            if (this.modelResult.length > 0) {
              this.showEchart = true;
            } else {
              this.message.create('error', 'No data！');
              return;
            }
            // 獲取總產品數和通過評估的數量(餅圖裡面的數據)
            this.data['total'][i] = total;
            this.data['pass'][i] = pass;
          }
          if (this.modelResult.length > 0) {
            this.showEchart = true;
          } else {
            this.message.create('error', 'No data！');
            return;
          }
        });
    }
  }

  // 點擊餅圖,拿到對應產品要顯示的table的數值
  clickEchart(i) {
    this.product = this.productList[i];
    let queryData = {};
    if (this.dateRange.length) {
      queryData = {
        plant: this.plant,
        site: this.site,
        product: this.product,
        projectCreatedOn: { between: this.dateRange }
      };
    } else {
      queryData = {
        plant: this.plant,
        site: this.site,
        product: this.product
      };
    }
    if (JSON.stringify(this.paramFlag) !== '{}') {
      queryData['businessGroup'] = localStorage.getItem('bg');
      this.service
        .getModelResult({
          where: queryData
        })
        .subscribe(res => {
          const models = [];
          for (let index = 0; index < res.length; index++) {
            if (!models.includes(res[index]['model'])) {
              models.push(res[index]['model']);
            }
          }
          this.service.getSiteModel(this.site, this.plant, models).subscribe(result => {
            this.tableDataSet = result;
            this.red = {
              unsubmit: 0,
              signing: 0,
              fail: 0
            };
            this.overall = {
              red: 0,
              green: 0
            };
            for (let index = 0; index < this.tableDataSet.length; index++) {
              if (this.tableDataSet[index]['status'] === 0) {
                this.red.unsubmit++;
              }
              if (this.tableDataSet[index]['status'] === 1) {
                this.red.signing++;
              }
              if (this.tableDataSet[index]['status'] === 2) {
                this.overall.green++;
              }
              if (this.tableDataSet[index]['status'] === 3) {
                this.red.fail++;
              }
            }
          });
          this.overall.red = this.tableDataSet.length - this.overall.green;
        });
      this.show = true;
    } else {
      this.service
        .getModelResult({
          where: queryData
        })
        .subscribe(res => {
          const models = [];
          for (let index = 0; index < res.length; index++) {
            if (!models.includes(res[index]['model'])) {
              models.push(res[index]['model']);
            }
          }
          this.service.getSiteModel(this.site, this.plant, models).subscribe(result => {
            this.tableDataSet = result;
            this.red = {
              unsubmit: 0,
              signing: 0,
              fail: 0
            };
            this.overall = {
              red: 0,
              green: 0
            };
            for (let index = 0; index < this.tableDataSet.length; index++) {
              if (this.tableDataSet[index]['status'] === 0) {
                this.red.unsubmit++;
              }
              if (this.tableDataSet[index]['status'] === 1) {
                this.red.signing++;
              }
              if (this.tableDataSet[index]['status'] === 2) {
                this.overall.green++;
              }
              if (this.tableDataSet[index]['status'] === 3) {
                this.red.fail++;
              }
            }
          });
          this.overall.red = this.tableDataSet.length - this.overall.green;
        });
      this.show = true;
    }
  }

  // 點擊table要顯示的modal
  showModal(status) {
    this.isUnsubmitted = true;
    this.isGreenPass = true;
    this.submitRed = false;
    this.signingRed = false;
    this.fail = [];
    this.pass = [];
    this.unsubmit = [];
    this.sign = [];
    this.tableData = [];
    for (let index = 0; index < this.tableDataSet.length; index++) {
      // 未評估的數據
      if (this.tableDataSet[index]['status'] === 0) {
        this.tableDataSet[index]['isGreen'] = false;
        this.tableData.push(this.tableDataSet[index]);
      }
      // 簽核中的數據
      if (this.tableDataSet[index]['status'] === 1) {
        this.tableDataSet[index]['isGreen'] = false;
        this.tableData.push(this.tableDataSet[index]);
      }
      // 已評估通過的數據
      if (this.tableDataSet[index]['status'] === 2) {
        this.tableDataSet[index]['isGreen'] = false;
        const facts = this.tableDataSet[index]['facts'];
        let designItemName;
        if (facts.length !== 0) {
          this.designItem = [];
          for (let i = 0; i < facts.length; i++) {
            designItemName = facts[i].designItemName;
            if (!this.designItem.includes(designItemName)) {
              this.designItem.push(designItemName);
            }
            if (facts[i]['workflowId'] !== null) {
              this.tableDataSet[index]['isGreen'] = true;
            }
          }
          this.tableDataSet[index]['passItemCount'] = this.designItem.length;
          this.tableDataSet[index]['designItemDetail'] = this.designItem;
          this.tableData.push(this.tableDataSet[index]);
        } else {
          this.tableDataSet[index]['passItemCount'] = 0;
          this.tableData.push(this.tableDataSet[index]);
        }
      }
      // 已評估未通過的數據
      if (this.tableDataSet[index]['status'] === 3) {
        this.tableDataSet[index]['isGreen'] = false;
        this.tableData.push(this.tableDataSet[index]);
      }
    }
    if (status === 2) {
      this.showData = this.tableData.filter(data => data['status'] === 2);
      this.modelName = '已評估通過機種';
      this.isGreenPass = false;
    } else if (status === 3) {
      this.showData = this.tableData.filter(data => data['status'] === 3);
      this.modelName = '已評估紅燈機種';
      this.submitRed = true;
    } else if (status === 1) {
      this.showData = this.tableData.filter(data => data['status'] === 1);
      this.modelName = '簽核中Fail機種';
      this.signingRed = true;
    } else if (status === 0) {
      this.showData = this.tableData.filter(data => data['status'] === 0);
      this.modelName = '未評估機種';
      this.isUnsubmitted = false;
    }
    this.modelFlag = true;
  }

  // 當前面全部選了才能選project
  getProject() {
    this.project = undefined;
    this.model = undefined;
    if (this.customer && this.BU) {
      this.projectCode = [];
      this.service
        .getModelResult({
          where: {
            site: this.site,
            plant: this.plant,
            productType: this.product,
            customer: this.customer,
            bu: this.BU,
            createDate: { between: this.dateRange }
          }
        })
        .subscribe(res => {
          for (let index = 0; index < res.length; index++) {
            if (!this.projectCode.includes(res[index]['projectCode'])) {
              this.projectCode.push(res[index]['projectCode']);
            }
          }
        });
      this.flag = false;
    }
  }

  // 根據project查找model
  getModel() {
    this.model = undefined;
    if (this.project) {
      this.projectName = [];
      this.service.getModelResult({
        where: {
          project: this.project
        }
      }).subscribe(res => {
        for (let index = 0; index < res.length; index++) {
          if (!this.projectName.includes(res[index]['model'])) {
            this.projectName.push(res[index]['model']);
          }
        }
      });
    }
    this.flag = false;
  }

  queryShow() {
    this.queryFlag = false;
  }

  // 點擊table里的數值顯示的modal里的鏈接
  router(item) {
    this.routerd.navigate(['/dashboard/nudd/report/pictureanalysereport'], {
      queryParams: {
        site: item.site,
        plant: item.plant,
        product: item.product,
        projectCode: item.project,
        projectName: item.model
      }
    });
  }

  router2(item) {
    this.routerd.navigate(['/dashboard/nudd/pictureanalyse'], {
      queryParams: {
        site: item.site,
        product: item.product,
        projectCode: item.project,
        projectName: item.model
      }
    });
  }

  router3(item) {
    this.routerd.navigate(['/dashboard/nudd/nuddsigning'], {
      queryParams: {
        site: item.site,
        plant: item.plant,
        product: item.product,
        projectCode: item.project,
        projectName: item.model
      }
    });
  }

  // 精確查找后點擊進入的鏈接
  routing(data) {
    if (data.status === 0) {
      this.routerd.navigate(['/dashboard/nudd/pictureanalyse'], {
        queryParams: {
          site: data.site,
          product: data.product,
          projectCode: data.project,
          projectName: data.model
        }
      });
    }
    if (data.status === 1) {
      this.routerd.navigate(['/dashboard/nudd/nuddsigning'], {
        queryParams: {
          site: data.site,
          product: data.product,
          projectCode: data.project,
          projectName: data.model
        }
      });
    }
    if (data.status === 2) {
      this.routerd.navigate(['/dashboard/nudd/report/pictureanalysereport'], {
        queryParams: {
          site: data.site,
          product: data.product,
          projectCode: data.project,
          projectName: data.model
        }
      });
    }
    if (data.status === 3) {
      this.routerd.navigate(['/dashboard/nudd/report/pictureanalysereport'], {
        queryParams: {
          site: data.site,
          product: data.product,
          projectCode: data.project,
          projectName: data.model
        }
      });
    }
  }

  // 點擊審核通過項目的designItem出現modal
  showDesignItemDetail(item) {
    if (item['facts'].length !== 0) {
      this.items = item['designItemDetail'];
      this.isVisible = true;
    }
  }

  handleCancel(): void {
    this.modelFlag = false;
  }

  handleCancel1() {
    this.isVisible = false;
  }

  handleCancel2() {
    this.detailFlag = false;
  }

  download() {
    const table = document.getElementById('downdata');
    this.downExcelService.exportTableAsExcelFile(table, 'NUDD Report');
  }

  downloadAll() {
    const table = document.getElementById('downAll');
    this.downExcelService.exportTableAsExcelFile(table, 'NUDD Report');
  }
}
