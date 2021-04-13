import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KpiBoardComponent } from './kpi-board.component';

const routes: Routes = [
  {
    path: '',
    component: KpiBoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiBoardRoutingModule { }
