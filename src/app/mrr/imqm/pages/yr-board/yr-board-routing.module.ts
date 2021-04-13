import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YrBoardComponent } from './yr-board.component';

const routes: Routes = [
  {
    path: '',
    component: YrBoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YrBoardRoutingModule { }
