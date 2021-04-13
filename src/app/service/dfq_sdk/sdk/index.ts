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
import { AccessTokenApi } from './services/custom/AccessToken';
import { ACLApi } from './services/custom/ACL';
import { RoleMappingApi } from './services/custom/RoleMapping';
import { RoleApi } from './services/custom/Role';
import { UserApi } from './services/custom/User';
import { SiteApi } from './services/custom/Site';
import { BusinessGroupApi } from './services/custom/BusinessGroup';
import { PlantApi } from './services/custom/Plant';
import { CustomerApi } from './services/custom/Customer';
import { BusinessUnitApi } from './services/custom/BusinessUnit';
import { StageApi } from './services/custom/Stage';
import { NPICHECKLIST_EMTApi } from './services/custom/NPICHECKLIST_EMT';
import { NPIMODELApi } from './services/custom/NPIMODEL';
import { NPITEAMMEMBERHEADApi } from './services/custom/NPITEAMMEMBERHEAD';
import { NPITEAMMEMBERLISTApi } from './services/custom/NPITEAMMEMBERLIST';
import { NPICHECKLIST_EM_HEADApi } from './services/custom/NPICHECKLIST_EM_HEAD';
import { NPICHECKLIST_EMApi } from './services/custom/NPICHECKLIST_EM';
import { ExitMeetingResultApi } from './services/custom/ExitMeetingResult';
import { CheckListLogApi } from './services/custom/CheckListLog';
import { View_ModelResultApi } from './services/custom/View_ModelResult';
import { ModelMaterialApi } from './services/custom/ModelMaterial';
import { ModelMaterialPartApi } from './services/custom/ModelMaterialPart';
import { MaterialApi } from './services/custom/Material';
import { FactorApi } from './services/custom/Factor';
import { FactorTypeApi } from './services/custom/FactorType';
import { View_ModelMaterialApi } from './services/custom/View_ModelMaterial';
import { ModelMaterialUploadApi } from './services/custom/ModelMaterialUpload';
import { View_ModelMaterialUploadApi } from './services/custom/View_ModelMaterialUpload';
import { DiscussionApi } from './services/custom/Discussion';
import { ModelMaterialFactorApi } from './services/custom/ModelMaterialFactor';
import { View_ModelYieldRateApi } from './services/custom/View_ModelYieldRate';
import { ProjectPartApi } from './services/custom/ProjectPart';
import { PartApi } from './services/custom/Part';
import { View_ModelMaterialPartApi } from './services/custom/View_ModelMaterialPart';
import { SFCDEFECTRATEDATAApi } from './services/custom/SFCDEFECTRATEDATA';
import { View_SFCDEFECTRATEDATAApi } from './services/custom/View_SFCDEFECTRATEDATA';
import { View_SfcModelMateiralApi } from './services/custom/View_SfcModelMateiral';
import { ModelScheduleApi } from './services/custom/ModelSchedule';
import { View_MassProductionApi } from './services/custom/View_MassProduction';
import { View_ModelScheduleApi } from './services/custom/View_ModelSchedule';
import { View_RfiDashboardApi } from './services/custom/View_RfiDashboard';
import { View_PartApi } from './services/custom/View_Part';
import { ProjectCodeProfileApi } from './services/custom/ProjectCodeProfile';
import { ProjectMemberApi } from './services/custom/ProjectMember';
import { MemberApi } from './services/custom/Member';
import { PlantMappingApi } from './services/custom/PlantMapping';
import { PcScheduleApi } from './services/custom/PcSchedule';
import { SendEmailApi } from './services/custom/SendEmail';
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
        AccessTokenApi,
        ACLApi,
        RoleMappingApi,
        RoleApi,
        UserApi,
        SiteApi,
        BusinessGroupApi,
        PlantApi,
        CustomerApi,
        BusinessUnitApi,
        StageApi,
        NPICHECKLIST_EMTApi,
        NPIMODELApi,
        NPITEAMMEMBERHEADApi,
        NPITEAMMEMBERLISTApi,
        NPICHECKLIST_EM_HEADApi,
        NPICHECKLIST_EMApi,
        ExitMeetingResultApi,
        CheckListLogApi,
        View_ModelResultApi,
        ModelMaterialApi,
        ModelMaterialPartApi,
        MaterialApi,
        FactorApi,
        FactorTypeApi,
        View_ModelMaterialApi,
        ModelMaterialUploadApi,
        View_ModelMaterialUploadApi,
        DiscussionApi,
        ModelMaterialFactorApi,
        View_ModelYieldRateApi,
        ProjectPartApi,
        PartApi,
        View_ModelMaterialPartApi,
        SFCDEFECTRATEDATAApi,
        View_SFCDEFECTRATEDATAApi,
        View_SfcModelMateiralApi,
        ModelScheduleApi,
        View_MassProductionApi,
        View_ModelScheduleApi,
        View_RfiDashboardApi,
        View_PartApi,
        ProjectCodeProfileApi,
        ProjectMemberApi,
        MemberApi,
        PlantMappingApi,
        PcScheduleApi,
        SendEmailApi,
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

