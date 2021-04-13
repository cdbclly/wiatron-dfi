import { NgModule } from '@angular/core';
import { MrrMaterialRoutingModule } from './mrr-material-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';

import { SqmBaseDataComponent } from './sqm-base-data/sqm-base-data.component';
import { SqmBaseDataPartsComponent } from './sqm-base-data/sqm-base-data-parts/sqm-base-data-parts.component';
import { SqmBaseDataManuComponent } from './sqm-base-data/sqm-base-data-manu/sqm-base-data-manu.component';
import { ManufaturerInputComponent } from './manufaturer-input/manufaturer-input.component';
import { ManufaturerInputKeyinComponent } from './manufaturer-input/manufaturer-input-keyin/manufaturer-input-keyin.component';
import { ManufaturerInputIssueComponent } from './manufaturer-input/manufaturer-input-issue/manufaturer-input-issue.component';
import { SqmsIqcComponent } from './sqms-iqc/sqms-iqc.component';
import { MrrMaterialReportComponent } from './report/mrr-material-report.component';
import { FactoryDefectiveComponent } from './factory-defective/factory-defective.component';
import { FactoryDefectiveIssueComponent } from './factory-defective/factory-defective-issue/factory-defective-issue.component';
import { OperationPipe, IssueStatusPipe } from './material.pipe';
import { SqmBaseDataMatmComponent } from './sqm-base-data/sqm-base-data-matm/sqm-base-data-matm.component';
import { MrrKpiComponent } from './mrr-kpi/mrr-kpi.component';
import { DashboardModule } from 'app/dashboard/dashboard.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    SharedModule,
    MrrMaterialRoutingModule,
    DashboardModule,
    TranslateModule
  ],
  declarations: [
    SqmBaseDataComponent,
    SqmBaseDataPartsComponent,
    SqmBaseDataManuComponent,
    ManufaturerInputComponent,
    ManufaturerInputKeyinComponent,
    ManufaturerInputIssueComponent,
    SqmsIqcComponent,
    MrrMaterialReportComponent,
    FactoryDefectiveComponent,
    FactoryDefectiveIssueComponent,
    OperationPipe,
    IssueStatusPipe,
    SqmBaseDataMatmComponent,
    MrrKpiComponent
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN }
  ]
})
export class MrrMaterialModule { }
