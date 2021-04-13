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
import { KPIApi } from './services/custom/KPI';
import { SectionApi } from './services/custom/Section';
import { LineApi } from './services/custom/Line';
import { StationApi } from './services/custom/Station';
import { TestItemMapApi } from './services/custom/TestItemMap';
import { StageMapApi } from './services/custom/StageMap';
import { KPI_logApi } from './services/custom/KPI_log';
import { LightBarApi } from './services/custom/LightBar';
import { LightBar_LogApi } from './services/custom/LightBar_Log';
import { MorouteApi } from './services/custom/Moroute';
import { RecipientApi } from './services/custom/Recipient';
import { Recipient_LogApi } from './services/custom/Recipient_Log';
import { Spc_MaintainApi } from './services/custom/Spc_Maintain';
import { Spc_Maintain_LogApi } from './services/custom/Spc_Maintain_Log';
import { Wcq_Screw_ParameterApi } from './services/custom/Wcq_Screw_Parameter';
import { Wcq_Screw_Parameter_LogApi } from './services/custom/Wcq_Screw_Parameter_Log';
import { CTQApi } from './services/custom/CTQ';
import { CTQ_logApi } from './services/custom/CTQ_log';
import { Skyeye_ctq_spc_cl_listApi } from './services/custom/Skyeye_ctq_spc_cl_list';
import { ToolsVersionApi } from './services/custom/ToolsVersion';
import { ToolsVersion_logApi } from './services/custom/ToolsVersion_log';
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
        KPIApi,
        SectionApi,
        LineApi,
        StationApi,
        TestItemMapApi,
        StageMapApi,
        KPI_logApi,
        LightBarApi,
        LightBar_LogApi,
        MorouteApi,
        RecipientApi,
        Recipient_LogApi,
        Spc_MaintainApi,
        Spc_Maintain_LogApi,
        Wcq_Screw_ParameterApi,
        Wcq_Screw_Parameter_LogApi,
        CTQApi,
        CTQ_logApi,
        Skyeye_ctq_spc_cl_listApi,
        ToolsVersionApi,
        ToolsVersion_logApi,
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

