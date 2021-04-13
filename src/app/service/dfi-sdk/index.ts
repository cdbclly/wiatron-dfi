/* tslint:disable */
/**
* @module SDKModule
* @author Jonathan Casarrubias <t:@johncasarrubias> <gh:jonathan-casarrubias>
* @license MIT 2016 Jonathan Casarrubias
* @version 2.1.0
* @description
* The SDKModule is a generated Software Development Kit automatically built by
* the LoopBack SDK Builder open source module.
*
* The SDKModule provides Angular 2 >= RC.5 support, which means that NgModules
* can import this Software Development Kit as follows:
*
*
* APP Route Module Context
* ============================================================================
* import { NgModule }       from '@angular/core';
* import { BrowserModule }  from '@angular/platform-browser';
* // App Root 
* import { AppComponent }   from './app.component';
* // Feature Modules
* import { SDK[Browser|Node|Native]Module } from './shared/sdk/sdk.module';
* // Import Routing
* import { routing }        from './app.routing';
* @NgModule({
*  imports: [
*    BrowserModule,
*    routing,
*    SDK[Browser|Node|Native]Module.forRoot()
*  ],
*  declarations: [ AppComponent ],
*  bootstrap:    [ AppComponent ]
* })
* export class AppModule { }
*
**/
import { ErrorHandler } from './services/core/error.service';
import { LoopBackAuth } from './services/core/auth.service';
import { LoggerService } from './services/custom/logger.service';
import { SDKModels } from './services/custom/SDKModels';
import { InternalStorage, SDKStorage } from './storage/storage.swaps';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CookieBrowser } from './storage/cookie.browser';
import { StorageBrowser } from './storage/storage.browser';
import { SiteApi } from './services/custom/Site';
import { PlantApi } from './services/custom/Plant';
import { PlantModelApi } from './services/custom/PlantModel';
import { ModelApi } from './services/custom/Model';
import { ProjectApi } from './services/custom/Project';
import { ProfitCenterApi } from './services/custom/ProfitCenter';
import { BusinessUnitApi } from './services/custom/BusinessUnit';
import { BusinessGroupApi } from './services/custom/BusinessGroup';
import { ProductApi } from './services/custom/Product';
import { CustomerApi } from './services/custom/Customer';
import { EmailApi } from './services/custom/Email';
import { MailApi } from './services/custom/Mail';
import { WorkflowApi } from './services/custom/Workflow';
import { WorkflowSignApi } from './services/custom/WorkflowSign';
import { WorkflowCounterSignApi } from './services/custom/WorkflowCounterSign';
import { StageApi } from './services/custom/Stage';
import { SiteModelApi } from './services/custom/SiteModel';
import { ProjectStageApi } from './services/custom/ProjectStage';
import { ContainerApi } from './services/custom/Container';
import { WorkflowFormApi } from './services/custom/WorkflowForm';
import { WorkflowFormMappingApi } from './services/custom/WorkflowFormMapping';
import { WorkflowSignatoryApi } from './services/custom/WorkflowSignatory';
import { View_WorkflowApi } from './services/custom/View_Workflow';
import { View_WorkflowSignApi } from './services/custom/View_WorkflowSign';
import { View_ModelApi } from './services/custom/View_Model';
import { View_WorkflowHistoryApi } from './services/custom/View_WorkflowHistory';
import { MailScheduleApi } from './services/custom/MailSchedule';
import { PlantMappingApi } from './services/custom/PlantMapping';
import { ProductTypeMappingApi } from './services/custom/ProductTypeMapping';
import { MeetingApi } from './services/custom/Meeting';
import { AttendanceApi } from './services/custom/Attendance';
import { TrackingIssueApi } from './services/custom/TrackingIssue';
import { TrackingIssuePicApi } from './services/custom/TrackingIssuePic';
import { FloorExecutionIssueApi } from './services/custom/FloorExecutionIssue';
import { CompanyApi } from './services/custom/Company';
import { ProcessCodeApi } from './services/custom/ProcessCode';
/**
* @module SDKBrowserModule
* @description
* This module should be imported when building a Web Application in the following scenarios:
*
*  1.- Regular web application
*  2.- Angular universal application (Browser Portion)
*  3.- Progressive applications (Angular Mobile, Ionic, WebViews, etc)
**/
@NgModule({
  imports:      [ CommonModule, HttpClientModule ],
  declarations: [ ],
  exports:      [ ],
  providers:    [
    ErrorHandler
  ]
})
export class SDKBrowserModule {
  static forRoot(internalStorageProvider: any = {
    provide: InternalStorage,
    useClass: CookieBrowser
  }): ModuleWithProviders {
    return {
      ngModule  : SDKBrowserModule,
      providers : [
        LoopBackAuth,
        LoggerService,
        SDKModels,
        SiteApi,
        PlantApi,
        PlantModelApi,
        ModelApi,
        ProjectApi,
        ProfitCenterApi,
        BusinessUnitApi,
        BusinessGroupApi,
        ProductApi,
        CustomerApi,
        EmailApi,
        MailApi,
        WorkflowApi,
        WorkflowSignApi,
        WorkflowCounterSignApi,
        StageApi,
        SiteModelApi,
        ProjectStageApi,
        ContainerApi,
        WorkflowFormApi,
        WorkflowFormMappingApi,
        WorkflowSignatoryApi,
        View_WorkflowApi,
        View_WorkflowSignApi,
        View_ModelApi,
        View_WorkflowHistoryApi,
        MailScheduleApi,
        PlantMappingApi,
        ProductTypeMappingApi,
        MeetingApi,
        AttendanceApi,
        TrackingIssueApi,
        TrackingIssuePicApi,
        FloorExecutionIssueApi,
        CompanyApi,
        ProcessCodeApi,
        internalStorageProvider,
        { provide: SDKStorage, useClass: StorageBrowser }
      ]
    };
  }
}
/**
* Have Fun!!!
* - Jon
**/
export * from './models/index';
export * from './services/index';
export * from './lb.config';
export * from './storage/storage.swaps';
export { CookieBrowser } from './storage/cookie.browser';
export { StorageBrowser } from './storage/storage.browser';

