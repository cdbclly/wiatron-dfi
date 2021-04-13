import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageBoardRoutingModule } from './manage-board-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ManageBoardRoutingModule,
    TranslateModule
  ],
  declarations: []
})
export class ManageBoardModule { }
