import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedModule } from 'app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutModule } from '../layout/layout.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { BoardComponent } from '../dashboard/board/board.component';
import { DfqboardComponent } from '../dashboard/dfqboard/dfqboard.component';
import { DfcboardComponent } from '../dashboard/dfcboard/dfcboard.component';
import { MrrboardComponent } from '../dashboard/mrrboard/mrrboard.component';
import { SkyeyeBoardComponent } from '../dashboard/dfqboard/skyeye-board/skyeye-board.component';
import { RfqWorkhourComponent } from '../dashboard/rfq-workhour/rfq-workhour.component';
import { DfcrfqboardComponent } from '../dashboard/dfcrfqboard/dfcrfqboard.component';
import { RfiWorkProgressComponent } from '../dashboard/rfi-workprogress/rfi-work-progress/rfi-work-progress.component';
import { NuddBoardComponent } from '../dashboard/mrrboard/nudd-board/nudd-board.component';
import { DocumentBoardComponent } from '../dashboard/mrrboard/document-board/document-board.component';
import { MpFpyrQualifieldRateComponent } from '../dashboard/dfqboard/mp-fpyr-qualified-rate/mp-fpyr-qualified-rate.component';
import { EmAutoJudgementQualifieldRateComponent } from '../dashboard/dfqboard/em-auto-judgement-qualifield-rate/em-auto-judgement-qualifield-rate.component';
import { EchartsModalComponent } from '../dashboard/echarts-modal/echarts-modal.component';
import { PieChartComponent } from '.././components/pie-chart/pie-chart.component';
import { ManufacturerBoardComponent } from './mrrboard/manufacturer-board/manufacturer-board.component';
import { MaterialBoardComponent } from './mrrboard/material-board/material-board.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    NgZorroAntdModule,
    LayoutModule,
    TranslateModule
  ],
  declarations: [
    DashboardComponent,
    EchartsModalComponent,
    BoardComponent,
    DfqboardComponent,
    DfcboardComponent,
    MrrboardComponent,
    SkyeyeBoardComponent,
    RfqWorkhourComponent,
    DfcrfqboardComponent,
    RfiWorkProgressComponent,
    NuddBoardComponent,
    DocumentBoardComponent,
    MpFpyrQualifieldRateComponent,
    EmAutoJudgementQualifieldRateComponent,
    PieChartComponent,
    ManufacturerBoardComponent,
    MaterialBoardComponent
  ],
  exports: [
    DashboardComponent,
    EchartsModalComponent,
    BoardComponent,
    DfqboardComponent,
    DfcboardComponent,
    MrrboardComponent,
    SkyeyeBoardComponent,
    RfqWorkhourComponent,
    DfcrfqboardComponent,
    RfiWorkProgressComponent,
    NuddBoardComponent,
    DocumentBoardComponent,
    MpFpyrQualifieldRateComponent,
    EmAutoJudgementQualifieldRateComponent,
    PieChartComponent
  ]
})
export class DashboardModule { }
