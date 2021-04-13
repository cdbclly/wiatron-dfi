import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { WarningBoardComponent } from './warning-board.component';

const routes: Routes = [
  {
    path: '',
    component: WarningBoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarningBoardRoutingModule { }
