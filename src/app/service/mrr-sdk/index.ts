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
import { SocketBrowser } from './sockets/socket.browser';
import { SocketDriver } from './sockets/socket.driver';
import { SocketConnection } from './sockets/socket.connections';
import { RealTime } from './services/core/real.time';
import { USERApi } from './services/custom/USER';
import { ACLApi } from './services/custom/ACL';
import { CustomerApi } from './services/custom/Customer';
import { DesignItemApi } from './services/custom/DesignItem';
import { SideApi } from './services/custom/Side';
import { PointApi } from './services/custom/Point';
import { ProcessApi } from './services/custom/Process';
import { OperationApi } from './services/custom/Operation';
import { MaterialApi } from './services/custom/Material';
import { ProcessMaterialApi } from './services/custom/ProcessMaterial';
import { ProcessOperationApi } from './services/custom/ProcessOperation';
import { RiskApi } from './services/custom/Risk';
import { FactRiskApi } from './services/custom/FactRisk';
import { FactApi } from './services/custom/Fact';
import { FactLogApi } from './services/custom/FactLog';
import { ProcessTypeApi } from './services/custom/ProcessType';
import { DimensionApi } from './services/custom/Dimension';
import { LessonLearnedApi } from './services/custom/LessonLearned';
import { ModelResultApi } from './services/custom/ModelResult';
import { PartApi } from './services/custom/Part';
import { PartDocumentApi } from './services/custom/PartDocument';
import { ModelDocumentApi } from './services/custom/ModelDocument';
import { SiteApi } from './services/custom/Site';
import { PlantApi } from './services/custom/Plant';
import { PlantModelApi } from './services/custom/PlantModel';
import { ModelApi } from './services/custom/Model';
import { ProjectApi } from './services/custom/Project';
import { ProfitCenterApi } from './services/custom/ProfitCenter';
import { BusinessUnitApi } from './services/custom/BusinessUnit';
import { BusinessGroupApi } from './services/custom/BusinessGroup';
import { ProductApi } from './services/custom/Product';
import { SiteModelApi } from './services/custom/SiteModel';
import { WorkflowApi } from './services/custom/Workflow';
import { WorkflowSignApi } from './services/custom/WorkflowSign';
import { WorkflowCounterSignApi } from './services/custom/WorkflowCounterSign';
import { StageApi } from './services/custom/Stage';
import { ProjectStageApi } from './services/custom/ProjectStage';
import { WorkflowFormApi } from './services/custom/WorkflowForm';
import { WorkflowFormMappingApi } from './services/custom/WorkflowFormMapping';
import { WorkflowSignatoryApi } from './services/custom/WorkflowSignatory';
import { View_ModelResultApi } from './services/custom/View_ModelResult';
import { DocumentTypeApi } from './services/custom/DocumentType';
import { DocumentApi } from './services/custom/Document';
import { ProductDocumentApi } from './services/custom/ProductDocument';
import { ContainerApi } from './services/custom/Container';
import { NewModelDocumentApi } from './services/custom/NewModelDocument';
import { V_PlantProjectApi } from './services/custom/V_PlantProject';
import { SendModelApi } from './services/custom/SendModel';
import { PLM_allpartApi } from './services/custom/PLM_allpart';
import { MemberApi } from './services/custom/Member';
import { ProjectNameProfileApi } from './services/custom/ProjectNameProfile';
import { ProjectCodeProfileApi } from './services/custom/ProjectCodeProfile';
import { NewMemberApi } from './services/custom/NewMember';
import { ProjectMemberApi } from './services/custom/ProjectMember';
import { PartNumberApi } from './services/custom/PartNumber';
import { VendorApi } from './services/custom/Vendor';
import { ManufacturerApi } from './services/custom/Manufacturer';
import { PartNumberVendorApi } from './services/custom/PartNumberVendor';
import { ProjectStageSkipReasonApi } from './services/custom/ProjectStageSkipReason';
import { ProjectPartNumberApi } from './services/custom/ProjectPartNumber';
import { PartNumberVendorOperationApi } from './services/custom/PartNumberVendorOperation';
import { ManufacturerPICApi } from './services/custom/ManufacturerPIC';
import { SqmTargetYieldApi } from './services/custom/SqmTargetYield';
import { VendorTargetYieldApi } from './services/custom/VendorTargetYield';
import { PartNumberVendorRecordApi } from './services/custom/PartNumberVendorRecord';
import { FactoryRecordApi } from './services/custom/FactoryRecord';
import { SqmsIqcRecordApi } from './services/custom/SqmsIqcRecord';
import { VendorRecordApi } from './services/custom/VendorRecord';
import { YieldRateRecordApi } from './services/custom/YieldRateRecord';
import { FactoryIssueApi } from './services/custom/FactoryIssue';
import { VendorIssueApi } from './services/custom/VendorIssue';
import { NuddItemApi } from './services/custom/NuddItem';
import { PLM_allpart_ProjectApi } from './services/custom/PLM_allpart_Project';
import { View_LatestTargetYieldApi } from './services/custom/View_LatestTargetYield';
import { ExternalUserApi } from './services/custom/ExternalUser';
import { VendorDocumentApi } from './services/custom/VendorDocument';
import { VendorProductDocumentApi } from './services/custom/VendorProductDocument';
import { PartNumberVendorFileApi } from './services/custom/PartNumberVendorFile';
import { View_ProjectPartNumberListApi } from './services/custom/View_ProjectPartNumberList';
import { NuddRfqIgnoreApi } from './services/custom/NuddRfqIgnore';
import { View_PartNumberOverviewApi } from './services/custom/View_PartNumberOverview';
import { ProjectPartNumberForMaintainApi } from './services/custom/ProjectPartNumberForMaintain';
import { PlantPartNumberConfigApi } from './services/custom/PlantPartNumberConfig';
import { PlantCustomerApi } from './services/custom/PlantCustomer';
import { VendorDocumentCategoryApi } from './services/custom/VendorDocumentCategory';
import { VendorDocumentSubCategoryApi } from './services/custom/VendorDocumentSubCategory';
import { PartNumberVendorFileRejectHistoryApi } from './services/custom/PartNumberVendorFileRejectHistory';
import { ProductTypeStageScoreApi } from './services/custom/ProductTypeStageScore';
import { View_PieChartApi } from './services/custom/View_PieChart';
import { MaterialInputApi } from './services/custom/MaterialInput';
import { MaterialRepairApi } from './services/custom/MaterialRepair';
import { MaterialIssueApi } from './services/custom/MaterialIssue';
import { MaterialYieldRateApi } from './services/custom/MaterialYieldRate';
import { SqmsIqcDataApi } from './services/custom/SqmsIqcData';
import { View_ManufacturerMaterialYieldRateApi } from './services/custom/View_ManufacturerMaterialYieldRate';
import { View_ProcessYieldRateApi } from './services/custom/View_ProcessYieldRate';
import { View_MaterialYieldRateReportApi } from './services/custom/View_MaterialYieldRateReport';
import { MaterialUsageApi } from './services/custom/MaterialUsage';
import { IqcMatYrRankByUpdatedOnApi } from './services/custom/IqcMatYrRankByUpdatedOn';
import { FactoryMatYrRankByMfgDateApi } from './services/custom/FactoryMatYrRankByMfgDate';
import { VendorMatYrRankByMfgDateApi } from './services/custom/VendorMatYrRankByMfgDate';
import { ProjectMaterialStatusApi } from './services/custom/ProjectMaterialStatus';
import { ProjectStatusApi } from './services/custom/ProjectStatus';
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
    ErrorHandler,
    SocketConnection
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
        RealTime,
        USERApi,
        ACLApi,
        CustomerApi,
        DesignItemApi,
        SideApi,
        PointApi,
        ProcessApi,
        OperationApi,
        MaterialApi,
        ProcessMaterialApi,
        ProcessOperationApi,
        RiskApi,
        FactRiskApi,
        FactApi,
        FactLogApi,
        ProcessTypeApi,
        DimensionApi,
        LessonLearnedApi,
        ModelResultApi,
        PartApi,
        PartDocumentApi,
        ModelDocumentApi,
        SiteApi,
        PlantApi,
        PlantModelApi,
        ModelApi,
        ProjectApi,
        ProfitCenterApi,
        BusinessUnitApi,
        BusinessGroupApi,
        ProductApi,
        SiteModelApi,
        WorkflowApi,
        WorkflowSignApi,
        WorkflowCounterSignApi,
        StageApi,
        ProjectStageApi,
        WorkflowFormApi,
        WorkflowFormMappingApi,
        WorkflowSignatoryApi,
        View_ModelResultApi,
        DocumentTypeApi,
        DocumentApi,
        ProductDocumentApi,
        ContainerApi,
        NewModelDocumentApi,
        V_PlantProjectApi,
        SendModelApi,
        PLM_allpartApi,
        MemberApi,
        ProjectNameProfileApi,
        ProjectCodeProfileApi,
        NewMemberApi,
        ProjectMemberApi,
        PartNumberApi,
        VendorApi,
        ManufacturerApi,
        PartNumberVendorApi,
        ProjectStageSkipReasonApi,
        ProjectPartNumberApi,
        PartNumberVendorOperationApi,
        ManufacturerPICApi,
        SqmTargetYieldApi,
        VendorTargetYieldApi,
        PartNumberVendorRecordApi,
        FactoryRecordApi,
        SqmsIqcRecordApi,
        VendorRecordApi,
        YieldRateRecordApi,
        FactoryIssueApi,
        VendorIssueApi,
        NuddItemApi,
        PLM_allpart_ProjectApi,
        View_LatestTargetYieldApi,
        ExternalUserApi,
        VendorDocumentApi,
        VendorProductDocumentApi,
        PartNumberVendorFileApi,
        View_ProjectPartNumberListApi,
        NuddRfqIgnoreApi,
        View_PartNumberOverviewApi,
        ProjectPartNumberForMaintainApi,
        PlantPartNumberConfigApi,
        PlantCustomerApi,
        VendorDocumentCategoryApi,
        VendorDocumentSubCategoryApi,
        PartNumberVendorFileRejectHistoryApi,
        ProductTypeStageScoreApi,
        View_PieChartApi,
        MaterialInputApi,
        MaterialRepairApi,
        MaterialIssueApi,
        MaterialYieldRateApi,
        SqmsIqcDataApi,
        View_ManufacturerMaterialYieldRateApi,
        View_ProcessYieldRateApi,
        View_MaterialYieldRateReportApi,
        MaterialUsageApi,
        IqcMatYrRankByUpdatedOnApi,
        FactoryMatYrRankByMfgDateApi,
        VendorMatYrRankByMfgDateApi,
        ProjectMaterialStatusApi,
        ProjectStatusApi,
        internalStorageProvider,
        { provide: SDKStorage, useClass: StorageBrowser },
        { provide: SocketDriver, useClass: SocketBrowser }
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

