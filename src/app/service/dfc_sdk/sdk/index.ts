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
import { UserApi } from './services/custom/User';
import { StageApi } from './services/custom/Stage';
import { ModelOperationsApi } from './services/custom/ModelOperations';
import { TargetOperationsApi } from './services/custom/TargetOperations';
import { ModelOperationsLogApi } from './services/custom/ModelOperationsLog';
import { ProcessApi } from './services/custom/Process';
import { MaterialApi } from './services/custom/Material';
import { FactorApi } from './services/custom/Factor';
import { FactorDetailApi } from './services/custom/FactorDetail';
import { ActionApi } from './services/custom/Action';
import { StandardOperationTimeApi } from './services/custom/StandardOperationTime';
import { MemberApi } from './services/custom/Member';
import { MOHConditionApi } from './services/custom/MOHCondition';
import { MOHAdditionApi } from './services/custom/MOHAddition';
import { MOHApi } from './services/custom/MOH';
import { MOHLogApi } from './services/custom/MOHLog';
import { AuthorityApi } from './services/custom/Authority';
import { GroupApi } from './services/custom/Group';
import { ProjectCodeProfileApi } from './services/custom/ProjectCodeProfile';
import { ProjectNameProfileApi } from './services/custom/ProjectNameProfile';
import { ProjectMemberApi } from './services/custom/ProjectMember';
import { ModelOperationTimeApi } from './services/custom/ModelOperationTime';
import { EmailModelApi } from './services/custom/EmailModel';
import { MOHDefaultConditionApi } from './services/custom/MOHDefaultCondition';
import { UploadApi } from './services/custom/Upload';
import { Opm_monthApi } from './services/custom/Opm_month';
import { Opm_finbasicApi } from './services/custom/Opm_finbasic';
import { Opm_r3Api } from './services/custom/Opm_r3';
import { PlantMappingApi } from './services/custom/PlantMapping';
import { MOHPlantApi } from './services/custom/MOHPlant';
import { V_StanderOperationApi } from './services/custom/V_StanderOperation';
import { ModelTypeMappingApi } from './services/custom/ModelTypeMapping';
import { OperationLogApi } from './services/custom/OperationLog';
import { ModuleMappingApi } from './services/custom/ModuleMapping';
import { BUApi } from './services/custom/BU';
import { WorkflowApi } from './services/custom/Workflow';
import { WorkflowSignApi } from './services/custom/WorkflowSign';
import { MilitaryOrderSignApi } from './services/custom/MilitaryOrderSign';
import { TargetOperationSignApi } from './services/custom/TargetOperationSign';
import { DfiProjectApi } from './services/custom/DfiProject';
import { StandardOperationSignApi } from './services/custom/StandardOperationSign';
import { StandardOperationSignContentApi } from './services/custom/StandardOperationSignContent';
import { RewardSignApi } from './services/custom/RewardSign';
import { ModelTypeProcessSettingApi } from './services/custom/ModelTypeProcessSetting';
import { WorkflowFormApi } from './services/custom/WorkflowForm';
import { WorkflowFormMappingApi } from './services/custom/WorkflowFormMapping';
import { WorkflowSignatoryApi } from './services/custom/WorkflowSignatory';
import { V_ProjectSummaryApi } from './services/custom/V_ProjectSummary';
import { V_ProjectSelectApi } from './services/custom/V_ProjectSelect';
import { View_WorkflowApi } from './services/custom/View_Workflow';
import { BasicModelApi } from './services/custom/BasicModel';
import { GroupModelApi } from './services/custom/GroupModel';
import { GroupModelMappingApi } from './services/custom/GroupModelMapping';
import { DataVerificationApi } from './services/custom/DataVerification';
import { MOHGapApi } from './services/custom/MOHGap';
import { OperationTimeGapApi } from './services/custom/OperationTimeGap';
import { UiPageApi } from './services/custom/UiPage';
import { KpiReportCacheApi } from './services/custom/KpiReportCache';
import { DashboardIgnoredProjectApi } from './services/custom/DashboardIgnoredProject';
import { ProjectModuleApi } from './services/custom/ProjectModule';
import { ProductApi } from './services/custom/Product';
import { ProductTypeMappingApi } from './services/custom/ProductTypeMapping';
import { DfcDashboardApi } from './services/custom/DfcDashboard';
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
        UserApi,
        StageApi,
        ModelOperationsApi,
        TargetOperationsApi,
        ModelOperationsLogApi,
        ProcessApi,
        MaterialApi,
        FactorApi,
        FactorDetailApi,
        ActionApi,
        StandardOperationTimeApi,
        MemberApi,
        MOHConditionApi,
        MOHAdditionApi,
        MOHApi,
        MOHLogApi,
        AuthorityApi,
        GroupApi,
        ProjectCodeProfileApi,
        ProjectNameProfileApi,
        ProjectMemberApi,
        ModelOperationTimeApi,
        EmailModelApi,
        MOHDefaultConditionApi,
        UploadApi,
        Opm_monthApi,
        Opm_finbasicApi,
        Opm_r3Api,
        PlantMappingApi,
        MOHPlantApi,
        V_StanderOperationApi,
        ModelTypeMappingApi,
        OperationLogApi,
        ModuleMappingApi,
        BUApi,
        WorkflowApi,
        WorkflowSignApi,
        MilitaryOrderSignApi,
        TargetOperationSignApi,
        DfiProjectApi,
        StandardOperationSignApi,
        StandardOperationSignContentApi,
        RewardSignApi,
        ModelTypeProcessSettingApi,
        WorkflowFormApi,
        WorkflowFormMappingApi,
        WorkflowSignatoryApi,
        V_ProjectSummaryApi,
        V_ProjectSelectApi,
        View_WorkflowApi,
        BasicModelApi,
        GroupModelApi,
        GroupModelMappingApi,
        DataVerificationApi,
        MOHGapApi,
        OperationTimeGapApi,
        UiPageApi,
        KpiReportCacheApi,
        DashboardIgnoredProjectApi,
        ProjectModuleApi,
        ProductApi,
        ProductTypeMappingApi,
        DfcDashboardApi,
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

