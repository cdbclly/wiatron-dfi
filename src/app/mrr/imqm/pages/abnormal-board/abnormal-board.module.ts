import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbnormalBoardComponent } from './abnormal-board.component';
import { AbnormalBoardRoutingModule } from './abnormal-board-routing.module';
import { ImqmCommonModule } from '../../imqm-common/imqm-common.module';

@NgModule({
  imports: [
    CommonModule,
    AbnormalBoardRoutingModule,
    ImqmCommonModule
  ],
  declarations: [AbnormalBoardComponent]
})
export class AbnormalBoardModule { }
