import { ImqmCommonModule } from 'app/mrr/imqm/imqm-common/imqm-common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestItemRoutingModule } from './test-item-routing.module';
import { TestItemComponent } from './test-item.component';

@NgModule({
  imports: [
    CommonModule,
    ImqmCommonModule,
    TestItemRoutingModule
  ],
  declarations: [TestItemComponent]
})
export class TestItemModule { }
