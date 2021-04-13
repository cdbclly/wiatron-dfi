import { YrQueryService } from './yr-generate/query-form/yr-query.service';
import { NewmaterialYrMaintainComponent } from './maintain/newmaterial-yr-maintain/newmaterial-yr-maintain.component';
import { YrFactorMaintainComponent } from './maintain/yr-factor-maintain/yr-factor-maintain.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YrGenerateComponent } from './yr-generate/yr-generate.component';
import { MaterialYrMaintainComponent } from './maintain/material-yr-maintain/material-yr-maintain.component';
import { ModelCompareReportComponent } from './report/model-compare-report/model-compare-report.component';
import { NewmodelYrReportComponent } from './report/newmodel-yr-report/newmodel-yr-report.component';
import { UsageReportComponent } from './report/usage-report/usage-report.component';
import { YrachieveRatioReportComponent } from './report/yrachieve-ratio-report/yrachieve-ratio-report.component';
import { MboardMaintainComponent } from './maintain/mboard-maintain/mboard-maintain.component';
import { YrGenerateSigningComponent } from './signing/yr-generate-signing/yr-generate-signing.component';
import { BaseDataSigningComponent } from './signing/base-data-signing/base-data-signing.component';
import { MaterialMappingComponent } from './maintain/material-yr-maintain/material-mapping/material-mapping.component';
import { ModelMaintainComponent } from './maintain/material-yr-maintain/model-maintain/model-maintain.component';
import { ModelChieveReportComponent } from './report/model-chieve-report/model-chieve-report.component';

const routes: Routes = [
  {
    path: 'yr-generate', component: YrGenerateComponent,
    resolve: {
      plantsResolver: 'PlantsResolver',
      busResolver: 'BusResolver',
      productsResolver: 'ProductsResolver',
      customersResolver: 'CustomersResolver'
    }
  },
  {
    path: 'maintain/material-yr-maintain', component: MaterialYrMaintainComponent
  },
  {
    path: 'maintain/material-mapping', component: MaterialMappingComponent
  },
  {
    path: 'maintain/model-maintain', component: ModelMaintainComponent
  },
  {
    path: 'maintain/yr-factor-maintain', component: YrFactorMaintainComponent
  },
  {
    path: 'maintain/newmaterial-yr-maintain', component: NewmaterialYrMaintainComponent
  },
  {
    path: 'maintain/mboard-maintain', component: MboardMaintainComponent
  },
  {
    path: 'report/model-compare-report', component: ModelCompareReportComponent,
    resolve: {
      plantsResolver: 'PlantsResolver',
      busResolver: 'BusResolver',
      productsResolver: 'ProductsResolver',
      customersResolver: 'CustomersResolver'
    }
  },
  {
    path: 'report/newmodel-yr-report', component: NewmodelYrReportComponent,
    resolve: {
      plantsResolver: 'PlantsResolver',
      busResolver: 'BusResolver',
      productsResolver: 'ProductsResolver',
      customersResolver: 'CustomersResolver'
    }
  },
  {
    path: 'report/usage-report', component: UsageReportComponent,
    resolve: {
      plantsResolver: 'PlantsResolver',
      busResolver: 'BusResolver',
      productsResolver: 'ProductsResolver',
      customersResolver: 'CustomersResolver'
    }
  },
  {
    path: 'report/model-chieve-report/:plantName', component: ModelChieveReportComponent,
  },
  {
    path: 'report/model-chieve-report', component: ModelChieveReportComponent,
  },
  {
    path: 'report/yrachieve-ratio-report', component: YrachieveRatioReportComponent
  },
  {
    path: 'signing/base-data-signing', component: BaseDataSigningComponent
  },
  {
    path: 'signing/yr-generate-signing', component: YrGenerateSigningComponent,
    resolve: {
      plantsResolver: 'PlantsResolver',
      busResolver: 'BusResolver',
      productsResolver: 'ProductsResolver',
      customersResolver: 'CustomersResolver'
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: 'ProductsResolver',
      useFactory: (service: YrQueryService) => () => service.getProduct(),
      deps: [YrQueryService]
    },
    {
      provide: 'PlantsResolver',
      useFactory: (service: YrQueryService) => () => service.getPlants(),
      deps: [YrQueryService]
    },
    {
      provide: 'BusResolver',
      useFactory: (service: YrQueryService) => () => service.getBu(),
      deps: [YrQueryService]
    },
    {
      provide: 'CustomersResolver',
      useFactory: (service: YrQueryService) => () => service.getCustomers(),
      deps: [YrQueryService]
    }
  ]
})
export class RfiRoutingModule { }
