import { NewmodelService } from './newmodel.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DownexcelService } from '@service/downexcel.service';
import { UsageService } from '../usage-report/usage.service';
import { NzMessageService } from 'ng-zorro-antd';
import { YrGenerateService } from '../../yr-generate/yr-generate.service';
import { ProjectCodeProfile } from '@service/dfc_sdk/sdk';
import { CommonService } from '@service/dpm_sdk/common.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { FpyrApi } from '@service/dpm_sdk/sdk';
import { map, catchError } from 'rxjs/operators';
@Component({
  selector: 'app-newmodel-yr-report',
  templateUrl: './newmodel-yr-report.component.html',
  styleUrls: ['./newmodel-yr-report.component.scss']
})
export class NewmodelYrReportComponent implements OnInit {

  plantSelectValue: string;
  buSelectValue: string;
  customerSelectValue: string;
  modelTypeSelectValue: string;
  modelNameSelectValue = [];
  modelFamilySelectValue = [];
  listOfModelYie = [];
  listOfPlantSelectOption = [];
  listOfBuSelectOption = [];
  listOfCustomerSelectOption = [];
  listOfModelTypeSelectOption = [];
  listOfModelNameSelectOption = [];
  projectCodes = [];
  projectNames = [];
  tableShow = false;
  showData = [];
  loading = false;
  loadModel = false;
  down = false;

  constructor(
    private route: ActivatedRoute,
    private downExcelService: DownexcelService,
    private message: NzMessageService,
    private usageService: UsageService,
    private yrGenerateService: YrGenerateService,
    private newmodelService: NewmodelService,
    private dpmService: CommonService,
    private fpyrService: FpyrApi
  ) {
    this.listOfPlantSelectOption = this.route.snapshot.data['plantsResolver'];
    this.listOfBuSelectOption = this.route.snapshot.data['busResolver'];
  }

  ngOnInit() {
  }

  // 廠別 BU的值改變時調用
  getModel() {
    this.loadModel = true;
    this.customerSelectValue = '';
    this.modelTypeSelectValue = '';
    this.modelNameSelectValue = [];
    this.modelFamilySelectValue = [];
    this.listOfModelNameSelectOption = [];
    this.listOfModelTypeSelectOption = [];
    this.listOfCustomerSelectOption = [];
    this.projectCodes = [];
    this.showData = [];
    this.loading = false;
    this.tableShow = true;
    let plant;
    if (this.plantSelectValue) {
      plant = this.plantSelectValue.split('-')[1];
      this.dpmService.setBaseUrl(plant);
    }
    this.usageService.getViewYield(this.plantSelectValue, this.buSelectValue, this.customerSelectValue, this.modelTypeSelectValue).subscribe(res => {
      for (let index = 0; index < res.length; index++) {
        if (!this.listOfModelTypeSelectOption.includes(res[index]['product'])) {
          this.listOfModelTypeSelectOption.push(res[index]['product']);
        }
        if (!this.listOfCustomerSelectOption.includes(res[index]['customer'])) {
          this.listOfCustomerSelectOption.push(res[index]['customer']);
        }
        if (!this.projectCodes.includes(res[index]['project'])) {
          this.projectCodes.push(res[index]['project']);
        }
        if (!this.projectNames.includes(res[index]['model'])) {
          this.projectNames.push(res[index]['model']);
        }
        this.listOfModelYie = res;
      }
      this.loadModel = false;
    });
  }

  // 產品的值改變時
  modelChange() {
    this.loadModel = true;
    this.modelNameSelectValue = [];
    this.modelFamilySelectValue = [];
    this.projectCodes = [];
    let plant;
    if (this.plantSelectValue) {
      plant = this.plantSelectValue.split('-')[1];
    }
    this.listOfModelYie.filter(item => item.product === this.modelTypeSelectValue);
    this.listOfModelYie.forEach(ite => { if (this.projectCodes.indexOf(ite.project === -1)) { this.projectCodes.push(ite.project); } });
    this.loadModel = false;
  }

  // ProjectCode的值改變時
  changeModelFamily(evt) {
    this.modelNameSelectValue = [];
    for (let index = 0; index < evt.length; index++) {
      this.listOfModelYie.filter(item => {
        if (item.project === evt[index]) {
          this.modelNameSelectValue.push(item['model']);
          this.loading = false;
        }
      });
    }
  }

  query() {
    this.loading = true;
    if (!this.plantSelectValue) {
      this.message.create('error', 'Please select a plant!');
      this.loading = false;
      return;
    }
    this.showData = [];
    this.usageService.getViewYieldNoModels(this.plantSelectValue, this.buSelectValue, this.customerSelectValue, this.modelTypeSelectValue, this.modelNameSelectValue).subscribe(res => {
      if (res.length === 0) {
        this.loading = false;
        this.tableShow = true;
        return;
      }
      for (let index = 0; index < res.length; index++) {
        if (res[index]['baModel'] && res[index]['baProject']) {
          // 参数plant,project 先projectCodeProfile 拿C1-C5 DD;
          this.newmodelService.getProjectCodeProFile(res[index]['plant'], res[index]['baProject']).subscribe(
            async (projectCodeProfiles: ProjectCodeProfile[]) => {
              // fpyr pcba的阶段良率
              if (projectCodeProfiles.length > 0) {
                const C2period = [moment(projectCodeProfiles[0].C1DueDay).format('YYYY-MM-DD'), moment(projectCodeProfiles[0].C2DueDay).format('YYYY-MM-DD')];
                const C3period = [moment(projectCodeProfiles[0].C2DueDay).format('YYYY-MM-DD'), moment(projectCodeProfiles[0].C3DueDay).format('YYYY-MM-DD')];
                const C4period = [moment(projectCodeProfiles[0].C3DueDay).format('YYYY-MM-DD'), moment(projectCodeProfiles[0].C4DueDay).format('YYYY-MM-DD')];
                const C5period = [moment(projectCodeProfiles[0].C4DueDay).format('YYYY-MM-DD'), moment(projectCodeProfiles[0].C5DueDay).format('YYYY-MM-DD')];
                res[index]['C2Fpyr'] = this.getFpyr(res[index]['baModel'], C2period);
                res[index]['C3Fpyr'] = this.getFpyr(res[index]['baModel'], C3period);
                res[index]['C4Fpyr'] = this.getFpyr(res[index]['baModel'], C4period);
                res[index]['C5Fpyr'] = this.getFpyr(res[index]['baModel'], C5period);
                this.showData = res;
                this.loading = false;
                this.tableShow = true;
              }
            });
        }
        this.showData = res;
        this.loading = false;
        this.tableShow = true;
      }
    });
  }

  getFpyr(model, trnDate) {
    const filter = {
      where: {
        plant: this.plantSelectValue.split('-')[1],
        mfgType: 'FA',
        model: model,
        trnDate: { between: trnDate }
      },
      group: ['model'],
      order: ['trnDate']
    };
    return this.fpyrService.find(filter).pipe<number>(map(result => { return result[0] ? result[0]['fpyr'] : null }));
  }




  download() {
    this.down = true;
    setTimeout(() => {
      const table = document.getElementById('yrReport');
      this.downExcelService.exportTableAsExcelFile(table, 'yrReport');
      this.down = false;
    }, 1000);
  }

  getDates(startDate, endDate): string[] {
    const result = [];
    while (moment(endDate).diff(moment(startDate), 'day') >= 0) {
      result.push(moment(startDate).format('YYYY-MM-DD'));
    }
    return result;
  }
}
