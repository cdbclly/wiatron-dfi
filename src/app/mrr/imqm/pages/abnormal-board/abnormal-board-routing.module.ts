import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AbnormalBoardComponent } from './abnormal-board.component';

const routes: Routes = [
  {
    path: '',
    component: AbnormalBoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbnormalBoardRoutingModule { }
