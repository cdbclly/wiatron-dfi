import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary.component';
import { SummaryRoutingModule } from './summary-routing.module';
import { ImqmCommonModule } from '../../../../imqm-common/imqm-common.module';

@NgModule({
  imports: [
    CommonModule,
    SummaryRoutingModule,
    ImqmCommonModule
  ],
  declarations: [
    SummaryComponent
  ]
})
export class SummaryModule { }
