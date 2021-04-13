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
import { EarlyWarningApi } from './services/custom/EarlyWarning';
import { AbnormalApi } from './services/custom/Abnormal';
import { DRMonthlyAverageApi } from './services/custom/DRMonthlyAverage';
import { EmailMaintainApi } from './services/custom/EmailMaintain';
import { YieldRateApi } from './services/custom/YieldRate';
import { SelectMenuApi } from './services/custom/SelectMenu';
import { TraceBackApi } from './services/custom/TraceBack';
import { NumberOfStopsApi } from './services/custom/NumberOfStops';
import { ParameterSettingApi } from './services/custom/ParameterSetting';
import { GroupApi } from './services/custom/Group';
import { GroupMappingRoleApi } from './services/custom/GroupMappingRole';
import { FunctionRoleApi } from './services/custom/FunctionRole';
import { UserInfoApi } from './services/custom/UserInfo';
import { RawDataApi } from './services/custom/RawData';
import { DRateApi } from './services/custom/DRate';
import { SavingInformationApi } from './services/custom/SavingInformation';
import { VendorSavingInformationInfoApi } from './services/custom/VendorSavingInformationInfo';
import { EmailApi } from './services/custom/Email';
import { TraceBackReplyApi } from './services/custom/TraceBackReply';
import { SummaryRateApi } from './services/custom/SummaryRate';
import { SavingInformationDayApi } from './services/custom/SavingInformationDay';
import { VendorSavingInformationInfoDayApi } from './services/custom/VendorSavingInformationInfoDay';
import { ParameterSettingLogApi } from './services/custom/ParameterSettingLog';
import { RawDataTempApi } from './services/custom/RawDataTemp';
import { SavingInformationMachineApi } from './services/custom/SavingInformationMachine';
import { IMQMCSNApi } from './services/custom/IMQMCSN';
import { InputInfoApi } from './services/custom/InputInfo';
import { SelectMenuLogApi } from './services/custom/SelectMenuLog';
import { TestItemGroupApi } from './services/custom/TestItemGroup';
import { TestItemDetailApi } from './services/custom/TestItemDetail';
import { FakeRawdataApi } from './services/custom/FakeRawdata';
import { V_MRR_BYLAW_DIMENSION_IMAGEApi } from './services/custom/V_MRR_BYLAW_DIMENSION_IMAGE';
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
        EarlyWarningApi,
        AbnormalApi,
        DRMonthlyAverageApi,
        EmailMaintainApi,
        YieldRateApi,
        SelectMenuApi,
        TraceBackApi,
        NumberOfStopsApi,
        ParameterSettingApi,
        GroupApi,
        GroupMappingRoleApi,
        FunctionRoleApi,
        UserInfoApi,
        RawDataApi,
        DRateApi,
        SavingInformationApi,
        VendorSavingInformationInfoApi,
        EmailApi,
        TraceBackReplyApi,
        SummaryRateApi,
        SavingInformationDayApi,
        VendorSavingInformationInfoDayApi,
        ParameterSettingLogApi,
        RawDataTempApi,
        SavingInformationMachineApi,
        IMQMCSNApi,
        InputInfoApi,
        SelectMenuLogApi,
        TestItemGroupApi,
        TestItemDetailApi,
        FakeRawdataApi,
        V_MRR_BYLAW_DIMENSION_IMAGEApi,
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

