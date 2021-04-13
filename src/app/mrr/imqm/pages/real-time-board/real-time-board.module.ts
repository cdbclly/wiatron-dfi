
import { RealTimeBoardRoutingModule } from './real-time-board-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImqmCommonModule } from 'app/mrr/imqm/imqm-common/imqm-common.module';
import { SelectMenuComponent } from './select-menu/select-menu.component';

@NgModule({
  imports: [
    CommonModule,
    RealTimeBoardRoutingModule,
    ImqmCommonModule
    ],
  declarations: [SelectMenuComponent],
  exports: [SelectMenuComponent, ImqmCommonModule]
})
export class RealTimeBoardModule { }
