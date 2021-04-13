import { DatetimePipe } from './../mrr/nudd/datetime.pipe';
import { WaivePipe } from './../dfq/waive.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';
import { SearchUserComponent } from '../shared/search-user/search-user.component';
import { UserEnnamePipe } from 'app/shared/pipe/user-enname/user-enname.pipe';
import { DFiProductPipe } from 'app/shared/pipe/dfiProduct/dfiProduct.pipe';
import { AgreePipe } from 'app/dfq/agree.pipe';
import {
  DeletePopComponent,
  DfcQueryInputComponent,
  DfcEchartComponent,
  UploadFileComponent,
  DfcSignHistoryComponent
} from './dfc-common/';
import { DfcLoadingComponent } from './dfc-common/dfc-loading/dfc-loading.component';
import {
  MemberPipe,
  PlantModelPipe,
  SitePipe,
  WorkflowFormMappingPipe,
  WorkflowFormPipe,
  MrrDocBomFilterPipe,
  ModelWorkhourReportPipe,
  ModelMohReportPipe,
  MrrDocDelayedDayPipe
} from './pipe/';
import { DfcBasicModelPipe } from './pipe/dfc-basic-model.pipe';
import { PercentPipe } from './percent.pipe';
import { FlowStatusPipe } from './flow-status.pipe';
import { DfiPermissionDirective } from './dfi-permission.directive';
import { DfiDisableDirective } from './dfi-disable.directive';
import { DragDirective } from './drag.directive';
import { WorkflowStatusPipe } from './pipe/workflow-status/workflow-status.pipe';
import { ResultPipe } from './result.pipe';
import { PlantNamePipe } from 'app/shared/pipe';
import { TranslateModule } from '@ngx-translate/core';

const DFCCommon = [
  DeletePopComponent,
  DfcQueryInputComponent,
  DfcEchartComponent,
  UploadFileComponent,
  DfcSignHistoryComponent,
  DfcLoadingComponent
];
const SharedPipe = [
  MemberPipe,
  PlantModelPipe,
  SitePipe,
  DFiProductPipe,
  WorkflowFormMappingPipe,
  WorkflowFormPipe,
  MrrDocBomFilterPipe,
  ModelWorkhourReportPipe,
  ModelMohReportPipe,
  MrrDocDelayedDayPipe,
  PlantNamePipe,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NgxEchartsModule,
    TranslateModule
  ],
  declarations: [
    SearchUserComponent,
    UserEnnamePipe,
    AgreePipe,
    WaivePipe,
    DFCCommon,
    DatetimePipe,
    DfcEchartComponent,
    SharedPipe,
    DfcBasicModelPipe,
    PercentPipe,
    FlowStatusPipe,
    DfiPermissionDirective,
    DfiDisableDirective,
    DragDirective,
    WorkflowStatusPipe,
    ResultPipe,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NgxEchartsModule,
    SearchUserComponent,
    UserEnnamePipe,
    AgreePipe,
    WaivePipe,
    DFCCommon,
    DatetimePipe,
    SharedPipe,
    DfcBasicModelPipe,
    PercentPipe,
    FlowStatusPipe,
    DfiPermissionDirective,
    DfiDisableDirective,
    DragDirective,
    WorkflowStatusPipe,
    ResultPipe
  ]
})
export class SharedModule { }
