
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UploadQueryService } from './upload-query.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-nudd-upload-query',
  templateUrl: './nudd-upload-query.component.html',
  styleUrls: ['./nudd-upload-query.component.scss']
})
export class NuddUploadQueryComponent implements OnInit {

  isLoading = false;
  product = null;
  projectCode = null;
  projectName = null;
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
  isProLoading = false;    // 下拉框projectCode加载时的loading
  @Input() report;
  @Input() typeShow;
  @Input() queryShow;
  @Output() menu = new EventEmitter<any>();
  @Output() formFlag: EventEmitter<any> = new EventEmitter();
  @Output() formParam: EventEmitter<any> = new EventEmitter();
  @Output() change = new EventEmitter<any>();
  @Output() queryFlag = new EventEmitter<any>();
  modelResultId: number;
  needShowProjectCodes = [];
  projects = [];

  constructor(
    private uploadQueryService: UploadQueryService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.getProduct();
    this.getSites();
  }


  getModelResultId() {
    this.projects.length = 0;
    this.needShowProjectCodes.length = 0;
    if (this.projectName && this.site) {
      this.uploadQueryService.getModelResultId(this.site, [this.projectName]).subscribe(res => {
        if (res[0]['modelResults'].length !== 0) {
          this.modelResultId = res[0]['modelResults'][0].id;
        }
      });
    }

    this.uploadQueryService.getModels(this.site).subscribe(res => {
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
    this.uploadQueryService.getSites().subscribe(res => {
      this.sites = res;
    }
    );
  }

  getProduct() {
    this.uploadQueryService.getProduct().subscribe(res => {
      this.products = res;
    }
    );
  }

  getProjectCode(data) {
    this.isProLoading = true;
    this.projectCode = '';
    this.projectName = '';
    this.type = '';
    this.needShowProjectCodes.length = 0;
    if (data) {
      this.uploadQueryService.getProjectCode(data).subscribe(res => {
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
        this.isProLoading = false;
      });
      this.uploadQueryService.getDimension(data).subscribe(res => {
        this.types = res;
      });
    }
  }

  getProjectName(data) {
    this.projectName = '';
    if (data) {
      this.uploadQueryService.getProjectName([data]).subscribe(res => {
        this.projectNames = res;
      }
      );
    }
  }

  getAddEnable() {
    this.getModelResultId();
    this.change.emit(true);
  }

  getModelResultIds() {
    this.projectCode = '';
    this.projectName = '';
    this.getModelResultId();
  }

  query() {
    const param = {
      site: this.site,
      product: this.product,
      projectCode: this.projectCode,
      projectName: this.projectName,
      type: this.type
    };
    if (!param.site) {
      this.message.create('error', 'Please select site！');
      return;
    } else if (!param.product) {
      this.message.create('error', 'Please select product！');
      return;
    } else if (!param.projectCode) {
      this.message.create('error', 'Please select projectCode！');
      return;
    } else if (!param.projectName) {
      this.message.create('error', 'Please select projectName！');
      return;
    }
    const data = [true, this.projectName, this.product, this.site];
    this.queryFlag.emit(data);
  }

}
