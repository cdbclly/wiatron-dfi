import { KpiFilterPipe } from './report/dfc-kpi/kpi-filter.pipe';
import { RewardsPunishmentRuleSignComponent } from './military-order/rewards-punishment-rule-sign/rewards-punishment-rule-sign.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DfcRoutingModule } from './dfc-routing.module';
import { MohParameterComponent } from './moh-parameter/moh-parameter.component';
import { MohModelnameComponent } from './moh-modelname/moh-modelname.component';
import { NewmodelMaintainComponent } from './base-data/newmodel-maintain/newmodel-maintain.component';
import { ModelWorkhourComponent } from './report/model-workhour/model-workhour.component';
import { ModelMohComponent } from './report/model-moh/model-moh.component';
import { StandartDocumentComponent } from './model-forecast/standart-document/standart-document.component';
import { TargetHoursComponent } from './model-forecast/target-hours/target-hours.component';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { DfcKpiComponent } from './report/dfc-kpi/dfc-kpi.component';
import { DfcSummaryComponent } from './report/dfc-summary/dfc-summary.component';
import { SummaryWorkHourComponent } from './report/dfc-summary/summary-work-hour/summary-work-hour.component';
import { SummaryMOHComponent } from './report/dfc-summary/summary-moh/summary-moh.component';
import { TargetReportComponent } from './report/target-report/target-report.component';
import { DfcKpiRewardsComponent } from './report/dfc-kpi/dfc-kpi-rewards/dfc-kpi-rewards.component';
import { DfcKpiRuleComponent } from './report/dfc-kpi/dfc-kpi-rule/dfc-kpi-rule.component';
import { MohParameterPlantComponent } from './moh-parameter/moh-parameter-plant/moh-parameter-plant.component';
import { MohParameterModelComponent } from './moh-parameter/moh-parameter-model/moh-parameter-model.component';
import { WorkhourReviewComponent } from './model-effect/workhour-review/workhour-review.component';
import { WorkhourReviewDetailComponent } from './model-effect/workhour-review/workhour-review-detail/workhour-review-detail.component';
import { StandartDocumentAddComponent } from './model-forecast/standart-document/standart-document-add/standart-document-add.component';
import { DfcTargetEchartComponent } from './echart/dfc-target-echart/dfc-target-echart.component';
import { TargetHourSignComponent } from './model-forecast/target-hour-sign/target-hour-sign.component';
import { TargetHourSignChildComponent } from './model-forecast/target-hour-sign/target-hour-sign-child/target-hour-sign-child.component';
import { MilitaryOrderQueryComponent } from './military-order/military-order-sign/military-order-query/military-order-query.component';
import { MilitaryOrderPrintComponent } from './military-order/military-order-sign/military-order-print/military-order-print.component';
import { MilitaryOrderSignComponent } from './military-order/military-order-sign/military-order-sign.component';
import { MilitaryOrderSignApproveComponent } from './military-order/military-order-sign/military-order-sign-approve/military-order-sign-approve.component';
import { WorkhourReportComponent } from './report/workhour-report/workhour-report.component';
import { RewardsPunishmentRuleQueryComponent } from './military-order/rewards-punishment-rule-query/rewards-punishment-rule-query.component';
import { StandartOperationSignDetailComponent } from './model-forecast/standart-operation-sign/standart-operation-sign-detail/standart-operation-sign-detail.component';
import { StandartOperationSignComponent } from './model-forecast/standart-operation-sign/standart-operation-sign.component';
import { TargetFilterPipe } from './model-effect/workhour-review/workhour-review-detail/target-filter.pipe';
import { WorkhourReportDetailComponent } from './report/workhour-report/workhour-report-detail/workhour-report-detail.component';
import { WorkhourReportWaterfallmapComponent } from './workhour-report-waterfallmap/workhour-report-waterfallmap.component';
import { RewardsSignDetailComponent } from './military-order/rewards-punishment-rule-sign/rewards-sign-detail/rewards-sign-detail.component';
import { MaterialFilterPipe } from './model-forecast/target-hours/material-filter.pipe';
import { AddOrUpdateModelComponent } from './base-data/newmodel-maintain/add-or-update-model/add-or-update-model.component';
import { AddGroupModelComponent } from './base-data/newmodel-maintain/add-group-model/add-group-model.component';
import { DfcRewardsPunishmentComponent } from './military-order/dfc-rewards-punishment/dfc-rewards-punishment.component';
import { DfqRewardsPunishmentComponent } from './military-order/dfq-rewards-punishment/dfq-rewards-punishment.component';
import { DfqRewardsPunishmentSignComponent } from './military-order/rewards-punishment-rule-sign/dfq-rewards-punishment-sign/dfq-rewards-punishment-sign.component';
import { ModelWorkHourTableDatasFilterPipe } from './report/model-workhour/table-datas-filter.pipe';
import { TargetReportTableDatasFilterPipe } from './report/target-report/target-report-table-datas-filter.pipe';
import { WorkhourReviewTableDatasFilterPipe } from './report/workhour-report/workhour-report-detail/workhour-review-table-datas-filter.pipe';
import { NewmodelMaintainPipe, ProductTypeBgColorPipe } from './base-data/newmodel-maintain/newmodel-maintain.pipe';
import { WorkReachingComponent } from './report/work-reaching/work-reaching.component';
import { WorkhourForecastComponent } from './report/work-reaching/workhour-forecast/workhour-forecast.component';
import { WorkhourTrackingComponent } from './report/work-reaching/workhour-tracking/workhour-tracking.component';
import { DfcProcessPipe } from './dfc-pipe.pipe';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    SharedModule,
    DfcRoutingModule,
    TranslateModule
  ],
  declarations: [
    TargetFilterPipe,
    MaterialFilterPipe,
    MohParameterComponent,
    MohModelnameComponent,
    NewmodelMaintainComponent,
    ModelWorkhourComponent,
    ModelMohComponent,
    StandartDocumentComponent,
    TargetHoursComponent,
    DfcKpiComponent,
    DfcSummaryComponent,
    SummaryWorkHourComponent,
    SummaryMOHComponent,
    TargetReportComponent,
    DfcKpiRuleComponent,
    DfcKpiRewardsComponent,
    MohParameterPlantComponent,
    MohParameterModelComponent,
    WorkhourReviewComponent,
    WorkhourReviewDetailComponent,
    StandartDocumentAddComponent,
    TargetHourSignComponent,
    TargetHourSignChildComponent,
    DfcTargetEchartComponent,
    TargetHourSignComponent,
    MilitaryOrderSignComponent,
    MilitaryOrderSignApproveComponent,
    WorkhourReportComponent,
    WorkhourReportWaterfallmapComponent,
    WorkhourReportDetailComponent,
    MilitaryOrderQueryComponent,
    MilitaryOrderPrintComponent,
    RewardsPunishmentRuleQueryComponent,
    StandartOperationSignDetailComponent,
    StandartOperationSignComponent,
    RewardsSignDetailComponent,
    AddOrUpdateModelComponent,
    AddGroupModelComponent,
    KpiFilterPipe,
    DfcRewardsPunishmentComponent,
    DfqRewardsPunishmentComponent,
    DfqRewardsPunishmentSignComponent,
    RewardsPunishmentRuleSignComponent,
    ModelWorkHourTableDatasFilterPipe,
    TargetReportTableDatasFilterPipe,
    WorkhourReviewTableDatasFilterPipe,
    NewmodelMaintainPipe,
    ProductTypeBgColorPipe,
    WorkReachingComponent,
    WorkhourForecastComponent,
    WorkhourTrackingComponent,
    DfcProcessPipe
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN }
  ]
})
export class DfcModule { }
