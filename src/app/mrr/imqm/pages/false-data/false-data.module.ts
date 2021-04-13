import { ImqmCommonModule } from './../../imqm-common/imqm-common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FalseDataRoutingModule } from './false-data-routing.module';
import { FalseDataComponent } from './false-data.component';
import { SelectComponent } from '../falseData/select/select.component';

@NgModule({
  imports: [
    CommonModule,
    FalseDataRoutingModule,
    ImqmCommonModule
  ],
  declarations: [FalseDataComponent, SelectComponent]
})
export class FalseDataModule { }
