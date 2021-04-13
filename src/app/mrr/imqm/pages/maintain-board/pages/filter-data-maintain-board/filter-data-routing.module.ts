import { NgModule } from '@angular/core';
import { FilterDataComponent } from './filter-data.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: FilterDataComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilterDataRoutingModule { }
