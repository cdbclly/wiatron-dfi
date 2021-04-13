import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkhourQueryComponent } from './workhour-query.component';

const routes: Routes = [
  { path: '', component: WorkhourQueryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkhourQueryRoutingModule { }
