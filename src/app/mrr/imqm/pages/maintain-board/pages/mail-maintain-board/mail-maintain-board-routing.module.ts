import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MailMaintainBoardComponent } from './mail-maintain-board.component';

const routes: Routes = [
  {
    path: '',
    component: MailMaintainBoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailMaintainBoardRoutingModule { }
