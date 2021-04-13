import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraceBoardRoutingModule } from './trace-board-routing.module';
import { ImqmCommonModule } from '../../imqm-common/imqm-common.module';
import { TraceBoardComponent } from './trace-board.component';

@NgModule({
  imports: [
    CommonModule,
    TraceBoardRoutingModule,
    ImqmCommonModule
  ],
  declarations: [
    TraceBoardComponent
  ]
})
export class TraceBoardModule { }
