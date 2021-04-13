import { ActivatedRoute } from '@angular/router';
import { QueryformService } from './queryform.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-queryform',
  templateUrl: './queryform.component.html',
  styleUrls: ['./queryform.component.scss']
})
export class QueryformComponent implements OnInit {
  product: string;
  projectCode: string;
  projectName: string;
  part: string;
  type: string;
  site: string;
  plant: string;

  typeid: number;

  typeids = [];
  products = [];
  projectCodes = [];
  projectNames = [];
  parts = [];
  types = [];
  sites = [];
  plants = [];
  projects = [];
  needShowProjectCodes = [];

  modelResultId: number;
  ignoreProduct: boolean;

  isProLoading = false;  // 下拉框projectCode加载时的loading

  @Input() report;
  @Input() typeShow;
  @Input() plantFlag;
  @Input() queryShow;
  @Output() menu = new EventEmitter<any>();
  @Output() formFlag: EventEmitter<any> = new EventEmitter();
  @Output() formParam: EventEmitter<any> = new EventEmitter();
  @Output() change = new EventEmitter<any>();
  @Output() pCode = new EventEmitter<any>();
  @Output() custo = new EventEmitter<any>();
  modelResultStatus: any;

  queryEnable = true;

  rdUserId: string;
  customer: any;

  routeUrl;
  plantData;
  typesCache = [];
  constructor(
    private queryFormService: QueryformService,
    private message: NzMessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['site'] && params['product'] && params['projectCode'] && params['projectName']) {
        this.site = params['site'];
        this.getModelResultIds();
        this.plant = params['plant'];
        this.product = params['product'];
        this.getProjectCode(this.product);
        this.projectCode = params['projectCode'];
        this.getProjectName(this.projectCode);
        this.projectName = params['projectName'];
        this.queryEnable = true;
        setTimeout(() => {
          this.query();
        }, 3000);
      }
    });
    this.getProduct();
    this.getSites();
  }

  getModelResultId() {
    this.projects.length = 0;
    this.needShowProjectCodes.length = 0;
    if (this.projectName && this.site) {
      this.queryFormService.getModelResultId(this.site, [this.projectName]).subscribe(res => {
        if (res[0]['modelResults'].length !== 0) {
          this.modelResultId = res[0]['modelResults'][0].id;
          this.modelResultStatus = res[0]['modelResults'][0].status;
          this.queryEnable = true;
        } else {
          console.log('無modelResults');
        }
      });
    }
    this.queryFormService.getModels(this.site).subscribe(res => {
      res.forEach(element => {
        if (element['model']) {
          if (this.projects.indexOf(element['model'].projectId) === -1) {
            this.projects.push(element['model'].projectId);
          }
        }
      });
      this.projects.forEach(data => {
        for (let index = 0; index < this.projectCodes.length; index++) {
          if (this.projectCodes[index].projectCode === data && this.needShowProjectCodes.indexOf(this.projectCodes[index].projectCode) === -1) {
            this.needShowProjectCodes.push(this.projectCodes[index].projectCode);
            break;
          }
        }
      });
    });
  }

  getSites() {
    this.queryFormService.getSites().subscribe(res => {
      this.sites = res;
    }
    );
  }

  getPlants() {
    this.queryFormService.getPlants(this.site).subscribe(res => {
      this.plantData = res;
      for (let index = 0; index < this.plantData.length; index++) {
        const plant = this.plantData[index]['name'] + '-' + this.plantData[index]['id'];
        this.plantData[index]['plant'] = plant;
      }
    });
  }

  getProduct() {
    this.queryFormService.getProduct().subscribe(res => {
      this.products = res;
    }
    );
  }

  async getProjectCode(data) {
    this.isProLoading = true;
    this.ignoreProduct = false;
    this.projectCode = '';
    this.projectName = '';
    this.type = '';
    this.needShowProjectCodes.length = 0;
    // if site product is in ignore olny save not rfqPorjectCode
    if (data) {
      this.types = await this.queryFormService.getDimension(data).toPromise();
      this.typesCache = this.types;
      const ignoreProducts = await this.queryFormService.getIgnoreProduct(this.site, data).toPromise();
      if (ignoreProducts.length > 0) {
        this.ignoreProduct = true;
        await this.queryFormService.getNotRfqProjectCode(data).toPromise().then(res => {
          res = res.filter(a => a['moduleName'] === 'nudd' && a['moduleEnabled']);
          this.projectCodes = res;
          this.projects.forEach(reso => {
            for (let index = 0; index < this.projectCodes.length; index++) {
              if (this.projectCodes[index].projectCode === reso && this.needShowProjectCodes.indexOf(this.projectCodes[index].projectCode) === -1) {
                this.needShowProjectCodes.push(this.projectCodes[index].projectCode);
                break;
              }
            }
            this.isProLoading = false;
          });
        });
      } else {
        await this.queryFormService.getProjectCode(data).toPromise().then(res => {
          res = res.filter(a => a['moduleName'] === 'nudd' && a['moduleEnabled']);
          this.projectCodes = res;
          this.projects.forEach(reso => {
            for (let index = 0; index < this.projectCodes.length; index++) {
              if (this.projectCodes[index].projectCode === reso && this.needShowProjectCodes.indexOf(this.projectCodes[index].projectCode) === -1) {
                this.needShowProjectCodes.push(this.projectCodes[index].projectCode);
                break;
              }
            }
          });
        }
        );
      }
    }
    this.isProLoading = false;
  }

  async getProjectName(data) {
    this.projectName = '';
    this.type = '';
    if (data) {
      if (data.indexOf('QRQ') !== -1) { // QRQY機種，只需做3D
        this.types = this.types.filter(item => item.name !== '2D');
      } else if (this.ignoreProduct) {
        // if site product is in ignore only has type 2D(WZS)
        this.types = this.types.filter(item => item.name !== '3D');
      } else {
        this.types = this.typesCache;
      }
      await this.queryFormService.getProjectName([data]).toPromise().then(res => {
        this.projectNames = res;
      }
      );
    }
  }

  next() {
    this.typeids = this.types.filter(res => res.name === this.type);
    if (this.typeids[0].id) {
      this.typeid = this.typeids[0].id;
    } else {
      this.typeid = null;
    }
    const url = `${location.origin}${'/dashboard/nudd/pictureanalysereport'}?site=${this.site}&plant=${this.plant}&product=${this.product}&projectCode=${this.projectCode}&projectName=${this.projectName}`;
    // projectname , 2D/3D, 2D/3Did, 產品別, Site, modelResultId, modelResultStatus, url, RDID
    const data = [this.projectName, this.type, this.typeid, this.product, this.site, this.modelResultId, this.modelResultStatus, url, this.rdUserId];
    this.menu.emit(data);
    this.custo.emit(this.customer);
  }

  next2() {
    const url = `${location.origin}${'/dashboard/nudd/nuddsigning'}?site=${this.site}&plant=${this.plant}&product=${this.product}&projectCode=${this.projectCode}&projectName=${this.projectName}`;
    if (this.projectCodes.find(res => res.projectCode === this.projectCode).rfqProjectId !== null) {
      this.queryFormService.getProjectName([this.projectCodes.find(res => res.projectCode === this.projectCode).rfqProjectId]).subscribe(reso => {
        // projectname, 產品別, Site, modelResultId, url, RDID, rfqProjectId, rfqProjectName, customer
        const data = [this.projectName, this.product, this.site, this.modelResultId, url, this.rdUserId, this.projectCodes.find(res => res.projectCode === this.projectCode).rfqProjectId, reso[0]['id'], this.customer, this.plant, this.ignoreProduct];
        this.menu.emit(data);
        this.pCode.emit(this.projectCode);
      });
    } else {
      // projectname, 產品別, Site, modelResultId, url, RDID, customer
      const data = [this.projectName, this.product, this.site, this.modelResultId, url, this.rdUserId, undefined, this.customer, this.plant];
      this.menu.emit(data);
      this.pCode.emit(this.projectCode);
    }
  }

  getAddEnable() {
    this.getModelResultId();
    this.change.emit(false);
  }

  getModelResultIds() {
    this.plant = '';
    this.product = '';
    this.projectCode = '';
    this.projectName = '';
    this.getModelResultId();
    this.getPlants();
  }

  query() {
    this.customer = this.projectCodes.find(item => item.projectCode === this.projectCode).customer.toUpperCase();
    this.rdUserId = this.projectCodes.filter(res => res.projectCode === this.projectCode)[0].createdBy;
    // IDBOOK分析頁
    const param = {
      site: this.site,
      product: this.product,
      projectCode: this.projectCode,
      projectName: this.projectName,
      type: this.type,
      rdId: this.rdUserId,
      url: `${location.origin}${'/dashboard/nudd/idbookanalyse'}?site=${this.site}&product=${this.product}&projectCode=${this.projectCode}&projectName=${this.projectName}`
    };
    if (!param.site) {
      this.message.create('error', 'Please select site！');
      return;
    } else if (!param.product) {
      this.message.create('error', 'Please select product！');
      return;
    } else if (!param.projectCode) {
      this.message.create('error', 'Please select projectCode!');
      return;
    } else if (!param.projectName) {
      this.message.create('error', 'Please select projectName!');
      return;
    } else if (!this.type) {
      if (this.typeShow) {
        this.message.create('error', 'Please select 2D/3D!');
        return;
      }
    }
    // 2D3D分析頁
    if (this.typeShow) {
      this.next();
    }
    // 2D3D Report
    if (this.report) {
      this.next2();
    }
    this.formFlag.emit(true);
    this.formParam.emit(param);
  }
}
