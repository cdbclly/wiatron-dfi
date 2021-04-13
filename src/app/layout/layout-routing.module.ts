import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ReportProblemProcessComponent } from './report-problem-process/report-problem-process.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'contact-us',
        component: ContactUsComponent
      },
      { 
        path: 'report-problem-process', 
        component: ReportProblemProcessComponent 
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
