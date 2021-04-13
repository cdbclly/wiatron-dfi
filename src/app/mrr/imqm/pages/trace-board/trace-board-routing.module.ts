import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TraceBoardComponent } from './trace-board.component';

const routes: Routes = [
  {
    path: '',
    component: TraceBoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraceBoardRoutingModule { }
