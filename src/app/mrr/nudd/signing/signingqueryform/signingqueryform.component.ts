import { SigningService } from 'app/mrr/nudd/signing/signing.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { QueryformService } from '../../analyse/queryform/queryform.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signingqueryform',
  templateUrl: './signingqueryform.component.html',
  styleUrls: ['./signingqueryform.component.scss']
})
export class SigningqueryformComponent implements OnInit {

  product: string;
  projectCode: string;
  projectName: string;
  part: string;
  type: string;
  site: string;
  plant: string;
  plantData;
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
  modelresults = [];

  needShowProjectCodes = [];

  modelResultId: number;
  isProLoading = false;    // 下拉框projectCode加载时的loading
  @Output() menu = new EventEmitter<any>();
  facts: any[];
  sendData: (string | number | any[])[];
  signingUrl: string;
  reportUrl: string;
  customer: any;
  hasRoutPlant = false;
  constructor(
    private queryFormService: QueryformService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private signingService: SigningService
  ) {
    this.getProduct();
    this.getSites();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['site'] && params['plant'] && params['product'] && params['projectCode'] && params['projectName']) {
        this.hasRoutPlant = true;
        this.site = params['site'];
        this.plant = params['plant'];
        this.getModelResultIds();
        this.product = params['product'];
        this.getProjectCode(this.product);
        this.projectCode = params['projectCode'];
        this.getProjectName(this.projectCode);
        this.projectName = params['projectName'];
        setTimeout(() => {
          this.query();
        }, 1500);
      }
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

  getShowProjectCodes() {
    this.projects.length = 0;
    this.needShowProjectCodes.length = 0;
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

  getProjectCode(data) {
    this.isProLoading = true;
    this.projectCode = '';
    this.projectName = '';
    this.type = '';
    this.needShowProjectCodes.length = 0;
    if (data) {
      this.queryFormService.getProjectCode(data).subscribe(res => {
        res = res.filter(a => a['moduleName'] === 'nudd' && a['moduleEnabled'] === true);
        this.projectCodes = res;
        this.projects.forEach(reso => {
          for (let index = 0; index < this.projectCodes.length; index++) {
            if (this.projectCodes[index].projectCode === reso && this.needShowProjectCodes.indexOf(this.projectCodes[index].projectCode) === -1) {
              this.needShowProjectCodes.push(this.projectCodes[index].projectCode);
              break;
            }
          }
        });
        this.isProLoading = false;
      });
      this.queryFormService.getDimension(data).subscribe(res => {
        this.types = res;
      });
    }
  }

  getModelresults() {
    this.modelresults = [];
    this.queryFormService.getProjectName([this.projectCode]).subscribe(res => {
      res.forEach(element => {
        this.modelresults.push(element.id);
      });
      // 根據siteId和modelId查找modelResult表中status為1的fact表里的數據(要簽核的數據)
      this.signingService.getModelResultId(this.site, this.modelresults).subscribe(data => {
        let facts = [];
        data.forEach(element => {
          if (element['modelResults'].length !== 0) {
            // 選site 產品別的facts
            facts.push(element['modelResults'][0].facts);
          }
        });
        facts = [].concat.apply([], facts);
        this.facts = facts.filter(reso => reso.workflowId !== null);
        let factsJustProject = [];
        // 沒選擇projectname / 選擇了projectname
        if (!this.projectName && !this.projectCode) {
          // projectName, 產品別,Site,modelResultId,facts,signingurl,report url, projectNames, projectCode, customer
          this.sendData = [this.projectName, this.product, this.site, this.modelResultId, this.facts, this.signingUrl, this.reportUrl, [], this.projectCode, this.customer, this.plant];
          this.menu.emit(this.sendData);
        } else if (!this.projectName && this.projectCode) {
          const projectNames = [];
          for (let index = 0; index < this.projectNames.length; index++) {
            projectNames.push(this.projectNames[index].id);
          }
          this.signingService.getModelResultId(this.site, projectNames).subscribe(rese => {
            for (let index = 0; index < rese.length; index++) {
              if (rese[index]['modelResults'].length !== 0 && this.facts.length !== 0) {
                this.modelResultId = rese[index]['modelResults'][0].id;
                factsJustProject.push(this.facts.filter(reso => reso.modelResultId === this.modelResultId));
              }
            }
            factsJustProject = [].concat.apply([], factsJustProject);
            // projectName, 產品別,Site,modelResultId,facts,signingurl,report url, projectNames, projectCode, customer
            this.sendData = [this.projectName, this.product, this.site, this.modelResultId, factsJustProject, this.signingUrl, this.reportUrl, projectNames, this.projectCode, this.customer, this.plant];
            this.menu.emit(this.sendData);
          });
        } else if (this.projectName && this.projectCode) {
          this.signingService.getModelResultId(this.site, [this.projectName]).subscribe(rese => {
            if (rese[0]['modelResults'].length !== 0 && this.facts.length !== 0) {
              this.modelResultId = rese[0]['modelResults'][0].id;
              factsJustProject = this.facts.filter(reso => reso.modelResultId === this.modelResultId);
            }
            // projectName, 產品別,Site,modelResultId,facts,signingurl,report url, projectNames, projectCode, customer
            this.sendData = [this.projectName, this.product, this.site, this.modelResultId, factsJustProject, this.signingUrl, this.reportUrl, [], this.projectCode, this.customer, this.plant];
            this.menu.emit(this.sendData);
          });
        }
      });
    });
  }

  getProjectName(data) {
    this.projectName = '';
    if (data) {
      this.queryFormService.getProjectName([data]).subscribe(res => {
        this.projectNames = res;
      }
      );
    }
  }

  getModelResultIds() {
    if (!this.hasRoutPlant) {
      this.plant = '';
    }
    this.projectCode = '';
    this.projectName = '';
    this.getShowProjectCodes();
    this.getPlants();
  }

  query() {
    if (this.projectCode) {
      this.customer = this.projectCodes.find(item => item.projectCode === this.projectCode).customer.toUpperCase();
    }
    if (!this.site) {
      this.message.create('error', 'Please select site！');
      return;
    } else if (!this.plant) {
      this.message.create('error', 'Please select plant！');
      return;
    } else if (!this.product) {
      this.message.create('error', 'Please select product！');
      return;
    }
    if (this.site && this.product) {
      this.getModelresults();
    }
    this.hasRoutPlant = false;
  }
}
