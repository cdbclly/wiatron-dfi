import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationGuideRoutingModule } from './operation-guide-routing.module';
import { OperationGuideComponent } from './operation-guide.component';
import { ImqmCommonModule } from 'app/mrr/imqm/imqm-common/imqm-common.module';

@NgModule({
  imports: [
    CommonModule,
    OperationGuideRoutingModule,
    ImqmCommonModule
  ],
  declarations: [OperationGuideComponent]
})
export class OperationGuideModule { }
