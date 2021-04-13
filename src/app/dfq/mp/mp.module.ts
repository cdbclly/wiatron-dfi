import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MpRoutingModule } from './mp-routing.module';
import { PcScheduleComponent } from './pc-schedule/pc-schedule.component';
import { YrTrackingComponent } from './yr-tracking/yr-tracking.component';
import { FpyrMovingAverageComponent } from './yr-tracking/fpyr-moving-average/fpyr-moving-average.component';
import { ModelFpyrListComponent } from './yr-tracking/model-fpyr-list/model-fpyr-list.component';
import { SharedModule } from 'app/shared/shared.module';
import { LineYieldRateComparisonComponent } from './yr-tracking/line-yield-rate-comparison/line-yield-rate-comparison.component';
import { PieYieldRateComparisonComponent } from './yr-tracking/pie-yield-rate-comparison/pie-yield-rate-comparison.component';
import { ModelFpyrQualifieldRateComponent } from './yr-tracking/model-fpyr-qualifield-rate/model-fpyr-qualifield-rate.component';
import { YrDpmLinkComponent } from './yr-tracking/dpm-issue-link/yr-dpm-link.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    MpRoutingModule,
    TranslateModule
  ],
  declarations: [
    PcScheduleComponent,
    YrTrackingComponent,
    ModelFpyrListComponent,
    FpyrMovingAverageComponent,
    LineYieldRateComparisonComponent,
    PieYieldRateComparisonComponent,
    ModelFpyrQualifieldRateComponent,
    YrDpmLinkComponent
  ]
})
export class MpModule { }
