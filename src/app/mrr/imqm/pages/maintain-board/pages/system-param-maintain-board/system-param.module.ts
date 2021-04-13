import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemParamRoutingModule } from './system-param-routing.module';
import { ImqmCommonModule } from 'app/mrr/imqm/imqm-common/imqm-common.module';
import { SystemParamComponent } from './system-param.component';
import { SystemParamPlantComponent } from './system-param-plant/system-param-plant.component';
import { SystemParamDetailComponent } from './system-param-detail/system-param-detail.component';

@NgModule({
  imports: [
    CommonModule,
    ImqmCommonModule,
    SystemParamRoutingModule

  ],
  declarations: [
    SystemParamComponent,
    SystemParamPlantComponent,
    SystemParamDetailComponent
  ]
})
export class SystemParamModule { }
