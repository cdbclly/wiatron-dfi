import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterDataRoutingModule } from './filter-data-routing.module'
import { ImqmCommonModule } from 'app/mrr/imqm/imqm-common/imqm-common.module';
import { FilterSelectComponent } from './filter-select/filter-select.component'
import { FilterDataComponent } from './filter-data.component';


@NgModule({
  imports: [
    CommonModule,
    ImqmCommonModule,
    FilterDataRoutingModule,
  ],
  declarations: [
    FilterDataComponent,
    FilterSelectComponent
  ]
})
export class FilterDataModule { }
