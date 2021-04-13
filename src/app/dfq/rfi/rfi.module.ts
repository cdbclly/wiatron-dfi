import { MotherboardAddComponent } from './yr-generate/motherboard-add/motherboard-add.component';
import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RfiRoutingModule } from './rfi-routing.module';
import { YrGenerateComponent } from './yr-generate/yr-generate.component';
import { MaterialYrMaintainComponent } from './maintain/material-yr-maintain/material-yr-maintain.component';
import { NewmodelYrReportComponent } from './report/newmodel-yr-report/newmodel-yr-report.component';
import { ModelCompareReportComponent } from './report/model-compare-report/model-compare-report.component';
import { YrFactorMaintainComponent } from './maintain/yr-factor-maintain/yr-factor-maintain.component';
import { NewmaterialYrMaintainComponent } from './maintain/newmaterial-yr-maintain/newmaterial-yr-maintain.component';
import { UsageReportComponent } from './report/usage-report/usage-report.component';
import { YrachieveRatioReportComponent } from './report/yrachieve-ratio-report/yrachieve-ratio-report.component';
import { QueryFormComponent } from './yr-generate/query-form/query-form.component';
import { YrCompareComponent } from './yr-generate/yr-compare/yr-compare.component';
import { ChangeCompareComponent } from './yr-generate/change-compare/change-compare.component';
import { MotherboardDetailComponent } from './yr-generate/motherboard-detail/motherboard-detail.component';
import { MboardMaintainComponent } from './maintain/mboard-maintain/mboard-maintain.component';
import { FactortypePipe } from './factortype.pipe';
import { FactorPipe } from './factor.pipe';
import { FactorDetailsModalComponent } from './maintain/factor-details-modal/factor-details-modal.component';
import { BlankModelFactorsComponent } from './yr-generate/blank-model-factors/blank-model-factors.component';
import { YrGenerateSigningComponent } from './signing/yr-generate-signing/yr-generate-signing.component';
import { BaseDataSigningComponent } from './signing/base-data-signing/base-data-signing.component';
import { ModelDetialsSigingComponent } from './signing/base-data-signing/model-detials-siging/model-detials-siging.component';
import { TargetYieldSigningComponent } from './signing/yr-generate-signing/target-yield-signing/target-yield-signing.component';
import { NewSigningDetailsComponent } from './signing/yr-generate-signing/new-signing-details/new-signing-details.component';
import { MaterialMappingComponent } from './maintain/material-yr-maintain/material-mapping/material-mapping.component';
import { ModelMaintainComponent } from './maintain/material-yr-maintain/model-maintain/model-maintain.component';
import { ModelChieveReportComponent } from './report/model-chieve-report/model-chieve-report.component';
import { YrForecastComponent } from './report/model-chieve-report/yr-forecast/yr-forecast.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RfiRoutingModule,
    TranslateModule
  ],
  declarations: [
    YrGenerateComponent,
    MaterialYrMaintainComponent,
    NewmodelYrReportComponent,
    ModelCompareReportComponent,
    YrFactorMaintainComponent,
    NewmaterialYrMaintainComponent,
    UsageReportComponent,
    YrachieveRatioReportComponent,
    QueryFormComponent,
    YrCompareComponent,
    ChangeCompareComponent,
    MotherboardDetailComponent,
    MboardMaintainComponent,
    FactortypePipe,
    FactorPipe,
    FactorDetailsModalComponent,
    BlankModelFactorsComponent,
    YrGenerateSigningComponent,
    BaseDataSigningComponent,
    ModelDetialsSigingComponent,
    TargetYieldSigningComponent,
    MotherboardAddComponent,
    NewSigningDetailsComponent,
    MaterialMappingComponent,
    ModelMaintainComponent,
    ModelChieveReportComponent,
    YrForecastComponent,
  ]
})
export class RfiModule { }
