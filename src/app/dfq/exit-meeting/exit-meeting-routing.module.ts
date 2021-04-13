import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryService } from './summary/summary.service';
import { SummaryComponent } from './summary/summary.component';
import { MeetingReviewTestComponent } from './meeting-review-test/meeting-review-test.component';
import { MeetingReviewResolve, MeetingReviewTestService } from './meeting-review-test/meeting-review-test.service';

const routes: Routes = [
  {
    path: '', component: MeetingReviewTestComponent,
    resolve: {
      meetinQueryBuilder: MeetingReviewResolve,
      bgsResolver: 'BGsResolver',
      sitesResolver: 'SitesResolver',
      customersResolver: 'CustomersResolver',
      stagesResolver: 'StagesResolver'
    }
  },
  {
    path: 'meeting-review',
    component: MeetingReviewTestComponent,
    resolve: {
      meetinQueryBuilder: MeetingReviewResolve,
      bgsResolver: 'BGsResolver',
      sitesResolver: 'SitesResolver',
      customersResolver: 'CustomersResolver',
      stagesResolver: 'StagesResolver'
    }
  },
  {
    path: 'summary',
    component: SummaryComponent,
    resolve: {
      // summaryQueryBuilder: SummaryResolve,
      bgsResolver: 'C4BGsResolver',
      sitesResolver: 'SitesResolver',
      customersResolver: 'CustomersResolver'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    MeetingReviewResolve,
    {
      provide: 'BGsResolver',
      useFactory: (service: MeetingReviewTestService) => () => service.getBgs(),
      deps: [MeetingReviewTestService]
    },
    {
      provide: 'SitesResolver',
      useFactory: (service: MeetingReviewTestService) => () => service.getSites(),
      deps: [MeetingReviewTestService]
    },
    {
      provide: 'CustomersResolver',
      useFactory: (service: MeetingReviewTestService) => () => service.getCustomers(),
      deps: [MeetingReviewTestService]
    },
    {
      provide: 'StagesResolver',
      useFactory: (service: MeetingReviewTestService) => () => service.getStages(),
      deps: [MeetingReviewTestService]
    },
    {
      provide: 'C4BGsResolver',
      useFactory: (service: SummaryService) => () => service.getBgs(),
      deps: [SummaryService]
    }
  ]
})
export class ExitMeetingRoutingModule { }
