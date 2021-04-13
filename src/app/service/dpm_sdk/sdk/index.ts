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
import { USERApi } from './services/custom/USER';
import { ACLApi } from './services/custom/ACL';
import { ROLEMAPPINGApi } from './services/custom/ROLEMAPPING';
import { ROLEApi } from './services/custom/ROLE';
import { APPLICATIONApi } from './services/custom/APPLICATION';
import { LINEApi } from './services/custom/LINE';
import { LINEGROUPApi } from './services/custom/LINEGROUP';
import { LineGroupMappingApi } from './services/custom/LineGroupMapping';
import { LineKpiMappingApi } from './services/custom/LineKpiMapping';
import { PlantGroupMappingApi } from './services/custom/PlantGroupMapping';
import { DEPARTMENTApi } from './services/custom/DEPARTMENT';
import { DEPARTMENTUSERApi } from './services/custom/DEPARTMENTUSER';
import { ROLEUSERSApi } from './services/custom/ROLEUSERS';
import { DPMUSERKPIApi } from './services/custom/DPMUSERKPI';
import { DPMROLEKPIApi } from './services/custom/DPMROLEKPI';
import { DPMKPIApi } from './services/custom/DPMKPI';
import { DPMKPIBASELINEApi } from './services/custom/DPMKPIBASELINE';
import { DPMKPITARGETApi } from './services/custom/DPMKPITARGET';
import { DPMPRODUCTIVITYApi } from './services/custom/DPMPRODUCTIVITY';
import { DPMPDTISSUEGROUPApi } from './services/custom/DPMPDTISSUEGROUP';
import { DPMPDTISSUESApi } from './services/custom/DPMPDTISSUES';
import { DPMALERTApi } from './services/custom/DPMALERT';
import { DPMKPIWARNINGApi } from './services/custom/DPMKPIWARNING';
import { DPMKPIMFGApi } from './services/custom/DPMKPIMFG';
import { DPMUPHApi } from './services/custom/DPMUPH';
import { DPMUPPHApi } from './services/custom/DPMUPPH';
import { DPMUPPHNApi } from './services/custom/DPMUPPHN';
import { DPMFPYRApi } from './services/custom/DPMFPYR';
import { DPMYRISSUEApi } from './services/custom/DPMYRISSUE';
import { DPMOEEISSUEGROUPApi } from './services/custom/DPMOEEISSUEGROUP';
import { DPMOEEApi } from './services/custom/DPMOEE';
import { DPMOEEDETAILApi } from './services/custom/DPMOEEDETAIL';
import { DPMOEECHARGEHOURApi } from './services/custom/DPMOEECHARGEHOUR';
import { DPMOEELOSSHOURApi } from './services/custom/DPMOEELOSSHOUR';
import { DPMSTOPCODEApi } from './services/custom/DPMSTOPCODE';
import { DPMSTOPCODEGROUPApi } from './services/custom/DPMSTOPCODEGROUP';
import { DPMDLBUFFERRATIOApi } from './services/custom/DPMDLBUFFERRATIO';
import { APINIApi } from './services/custom/APINI';
import { IssueSummaryApi } from './services/custom/IssueSummary';
import { IssueStatusApi } from './services/custom/IssueStatus';
import { DPMCSSRApi } from './services/custom/DPMCSSR';
import { SITEApi } from './services/custom/SITE';
import { PLANTApi } from './services/custom/PLANT';
import { PLANTGROUPApi } from './services/custom/PLANTGROUP';
import { FunctionGroupApi } from './services/custom/FunctionGroup';
import { EVENTApi } from './services/custom/EVENT';
import { DPMFPYRSTATIONApi } from './services/custom/DPMFPYRSTATION';
import { ModelFamilyApi } from './services/custom/ModelFamily';
import { ModelApi } from './services/custom/Model';
import { ModelSeriesApi } from './services/custom/ModelSeries';
import { TipApi } from './services/custom/Tip';
import { FpyrTipApi } from './services/custom/FpyrTip';
import { FpyrByModelSeriesApi } from './services/custom/FpyrByModelSeries';
import { StageFpyrByModelSeriesApi } from './services/custom/StageFpyrByModelSeries';
import { OeeIssueApi } from './services/custom/OeeIssue';
import { ProductivityIssueApi } from './services/custom/ProductivityIssue';
import { ModelSeriesTargetApi } from './services/custom/ModelSeriesTarget';
import { ModelSeriesBaselineApi } from './services/custom/ModelSeriesBaseline';
import { DPMOEEGROUPTARGETApi } from './services/custom/DPMOEEGROUPTARGET';
import { DPMOEELINETARGETApi } from './services/custom/DPMOEELINETARGET';
import { DPMIDLTARGETApi } from './services/custom/DPMIDLTARGET';
import { DPMOFFLINETARGETApi } from './services/custom/DPMOFFLINETARGET';
import { MANPOWERQUOTASApi } from './services/custom/MANPOWERQUOTAS';
import { DEDUCTEDDEPARTMENTApi } from './services/custom/DEDUCTEDDEPARTMENT';
import { DPMDLBUFFERRATIOGAP_ATTENDANCEApi } from './services/custom/DPMDLBUFFERRATIOGAP_ATTENDANCE';
import { DPMDLBUFFERRATIOGAP_EMPLOYEDApi } from './services/custom/DPMDLBUFFERRATIOGAP_EMPLOYED';
import { UploadForOEEApi } from './services/custom/UploadForOEE';
import { UploadForDLApi } from './services/custom/UploadForDL';
import { UploadForIDLApi } from './services/custom/UploadForIDL';
import { UploadForOFFLINEApi } from './services/custom/UploadForOFFLINE';
import { FpyrApi } from './services/custom/Fpyr';
import { RepairDetailApi } from './services/custom/RepairDetail';
import { RepairMasterApi } from './services/custom/RepairMaster';
import { DPMDIRECTLABORApi } from './services/custom/DPMDIRECTLABOR';
import { DPMINDIRECTLABORApi } from './services/custom/DPMINDIRECTLABOR';
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
        USERApi,
        ACLApi,
        ROLEMAPPINGApi,
        ROLEApi,
        APPLICATIONApi,
        LINEApi,
        LINEGROUPApi,
        LineGroupMappingApi,
        LineKpiMappingApi,
        PlantGroupMappingApi,
        DEPARTMENTApi,
        DEPARTMENTUSERApi,
        ROLEUSERSApi,
        DPMUSERKPIApi,
        DPMROLEKPIApi,
        DPMKPIApi,
        DPMKPIBASELINEApi,
        DPMKPITARGETApi,
        DPMPRODUCTIVITYApi,
        DPMPDTISSUEGROUPApi,
        DPMPDTISSUESApi,
        DPMALERTApi,
        DPMKPIWARNINGApi,
        DPMKPIMFGApi,
        DPMUPHApi,
        DPMUPPHApi,
        DPMUPPHNApi,
        DPMFPYRApi,
        DPMYRISSUEApi,
        DPMOEEISSUEGROUPApi,
        DPMOEEApi,
        DPMOEEDETAILApi,
        DPMOEECHARGEHOURApi,
        DPMOEELOSSHOURApi,
        DPMSTOPCODEApi,
        DPMSTOPCODEGROUPApi,
        DPMDLBUFFERRATIOApi,
        APINIApi,
        IssueSummaryApi,
        IssueStatusApi,
        DPMCSSRApi,
        SITEApi,
        PLANTApi,
        PLANTGROUPApi,
        FunctionGroupApi,
        EVENTApi,
        DPMFPYRSTATIONApi,
        ModelFamilyApi,
        ModelApi,
        ModelSeriesApi,
        TipApi,
        FpyrTipApi,
        FpyrByModelSeriesApi,
        StageFpyrByModelSeriesApi,
        OeeIssueApi,
        ProductivityIssueApi,
        ModelSeriesTargetApi,
        ModelSeriesBaselineApi,
        DPMOEEGROUPTARGETApi,
        DPMOEELINETARGETApi,
        DPMIDLTARGETApi,
        DPMOFFLINETARGETApi,
        MANPOWERQUOTASApi,
        DEDUCTEDDEPARTMENTApi,
        DPMDLBUFFERRATIOGAP_ATTENDANCEApi,
        DPMDLBUFFERRATIOGAP_EMPLOYEDApi,
        UploadForOEEApi,
        UploadForDLApi,
        UploadForIDLApi,
        UploadForOFFLINEApi,
        FpyrApi,
        RepairDetailApi,
        RepairMasterApi,
        DPMDIRECTLABORApi,
        DPMINDIRECTLABORApi,
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

