import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiBoardRoutingModule } from './kpi-board-routing.module';
import { ImqmCommonModule } from '../../../../imqm-common/imqm-common.module';
import { KpiBoardComponent } from './kpi-board.component';
import { KpiBoardSelectComponent } from './kpi-board-select/kpi-board-select.component';

@NgModule({
  imports: [
    CommonModule,
    KpiBoardRoutingModule,
    ImqmCommonModule
  ],
  declarations: [KpiBoardComponent, KpiBoardSelectComponent]
})
export class KpiBoardModule { }
