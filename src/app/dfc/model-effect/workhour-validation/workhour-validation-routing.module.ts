import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkhourValidationComponent } from './workhour-validation.component';

const routes: Routes = [
  { path: '', component: WorkhourValidationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkhourValidationRoutingModule { }
