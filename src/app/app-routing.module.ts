import { DfcboardComponent } from './dashboard/dfcboard/dfcboard.component';
import { DfqboardComponent } from './dashboard/dfqboard/dfqboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BoardComponent } from './dashboard/board/board.component';
import { MrrboardComponent } from './dashboard/mrrboard/mrrboard.component';
import { LoopBackAuth, LoggerService } from '@service/portal/sdk';
import { FormNosReportComponent } from './mrr/imqm/pages/snapshotMail/form-nos-report/form-nos-report.component';
import { SummaryReportComponent } from './mrr/imqm/pages/snapshotMail/summary-report/summary-report.component';
import { KpiReportComponent } from './mrr/imqm/pages/snapshotMail/kpi-report/kpi-report.component';
import { ReplyReasonComponent } from './mrr/imqm/pages/reply-reason/reply-reason.component';
import { map, first, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { RfqWorkhourComponent } from './dashboard/rfq-workhour/rfq-workhour.component';
import { DfcrfqboardComponent } from './dashboard/dfcrfqboard/dfcrfqboard.component';
import { AuthGuard, ManufacturerGuard } from './authentication/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/authentication', pathMatch: 'full' },
  { path: 'imqmSummaryReport', component: SummaryReportComponent, canActivate: [ManufacturerGuard] },
  { path: 'imqmKpiReport', component: KpiReportComponent, canActivate: [ManufacturerGuard] },
  { path: 'imqmFormsReport', component: FormNosReportComponent, canActivate: [ManufacturerGuard] },
  { path: 'imqmReplyReason', component: ReplyReasonComponent, canActivate: [ManufacturerGuard] },
  {
    path: '',
    loadChildren: 'app/layout/layout.module#LayoutModule',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    // canLoad: [AuthGuard],
    children: [
      {
        path: 'board',
        component: BoardComponent,
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'dfcrfqboard/:title/:color',
        component: DfcrfqboardComponent,
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'dfqboard/:bg',
        component: DfqboardComponent,
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'dfcboard/:bg',
        component: DfcboardComponent,
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'mrrboard/:bg',
        component: MrrboardComponent,
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'admin',
        loadChildren: 'app/authority/authority.module#AuthorityModule',
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'basedata',
        loadChildren: 'app/basedata/basedata.module#BasedataModule',
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'dfc',
        loadChildren: 'app/dfc/dfc.module#DfcModule',
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'dfq',
        loadChildren: './dfq/dfq.module#DfqModule',
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'nudd',
        loadChildren: 'app/mrr/nudd/nudd.module#NuddModule',
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'exit-meeting',
        loadChildren: 'app/dfq/exit-meeting/exit-meeting.module#ExitMeetingModule',
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'rfi',
        loadChildren: 'app/dfq/rfi/rfi.module#RfiModule',
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'mp',
        loadChildren: 'app/dfq/mp/mp.module#MpModule',
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'skyeye',
        loadChildren: 'app/dfq/skyeye/skyeye/skyeye.module#SkyeyeModule',
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'mrrDoc',
        loadChildren: 'app/mrr/doc/mrr-doc.module#MrrDocModule',
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'imqm',
        loadChildren: 'app/mrr/imqm/imqm.module#ImqmModule',
        canActivate: [ManufacturerGuard]
      },
      {
        path: 'mrrMaterial',
        loadChildren: 'app/mrr/material/mrr-material.module#MrrMaterialModule'
      },
      {
        path: 'mrrMdm',
        loadChildren: 'app/mrr/mdm/mrr-mdm.module#MrrMdmModule'
      },
      {
        path: 'report',
        loadChildren: 'app/report/report.module#ReportModule',
        canActivate: [ManufacturerGuard]
      }
    ]
  },
  {
    path: 'authentication',
    loadChildren: 'app/authentication/authentication.module#AuthenticationModule'
  },
  {
    path: '**',
    redirectTo: '/dashboard/board',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
  providers: [AuthGuard, ManufacturerGuard]
})
export class AppRoutingModule { }
