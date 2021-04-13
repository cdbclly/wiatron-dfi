import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkhourGapComponent } from './workhour-gap.component';

const routes: Routes = [
  { path: '', component: WorkhourGapComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkhourGapRoutingModule { }
