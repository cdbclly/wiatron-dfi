import { BaseES } from './dfq/skyeye/model/ES_Base';
import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { TranslateService } from '@ngx-translate/core';
// DFQ SDK
import { LoopBackConfig as DFQLoopBackConfig } from '@service/dfq_sdk/sdk';
// DFC SDK
import { LoopBackConfig as DFCLoopBackConfig } from '@service/dfc_sdk/sdk';
// MRR SDK
import { LoopBackConfig as NUDDLoopBackConfig } from '@service/mrr-sdk';
// DFI SDK
import { LoopBackConfig as DFILoopBackConfig } from '@service/dfi-sdk';
import { UtilsService } from '@service/utils.service';
// PORTAL SDK
import { LoopBackConfig as PortalLoopBackConfig } from '@service/portal/sdk';
// Skyeye SDK
import { LoopBackConfig as SkyeyeLoopBackConfig } from '@service/skyeye_sdk';
// IMQM SDK
import { LoopBackConfig as IMQMLoopBackConfig } from '@service/imqm-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  esItem: BaseES = new BaseES();
  isExt = localStorage.getItem('$DFI$isExt') ? true : false;
  constructor(
    private utilsService: UtilsService,
    private translateService: TranslateService
  ) {
    this.translateService.setDefaultLang('zh');
    if (environment.enable && !environment['isExtUser']) {
      DFCLoopBackConfig.setBaseURL(environment['DFCAPIURL']);
      DFQLoopBackConfig.setBaseURL(environment['DFQ_API_URL']);
      NUDDLoopBackConfig.setBaseURL(environment['NUDD_API_URL']);
      DFILoopBackConfig.setBaseURL(environment['DFI_API_URL']);
      PortalLoopBackConfig.setBaseURL(environment['PORTAL_API_URL']);
      SkyeyeLoopBackConfig.setBaseURL(environment['SKYEYE_API_URL']);
      IMQMLoopBackConfig.setBaseURL(environment['IMQM_API_URL']);
      DFILoopBackConfig.filterOnUrl();
      DFCLoopBackConfig.filterOnUrl();
      DFQLoopBackConfig.filterOnUrl();
      NUDDLoopBackConfig.filterOnUrl();
      SkyeyeLoopBackConfig.filterOnUrl();
      IMQMLoopBackConfig.filterOnUrl();
    } else if (environment.enable && environment['isExtUser']) {
      NUDDLoopBackConfig.setBaseURL(environment['NUDD_API_URL']);
      DFILoopBackConfig.setBaseURL(environment['DFI_API_URL']);
      PortalLoopBackConfig.setBaseURL(environment['PORTAL_API_URL']);
      DFILoopBackConfig.filterOnUrl();
      NUDDLoopBackConfig.filterOnUrl();
    } else {
      this.utilsService.getConfig()
        .subscribe(config => {
          DFCLoopBackConfig.setBaseURL(config['DFCAPIURL']);
          DFQLoopBackConfig.setBaseURL(config['DFQ_API_URL']);
          NUDDLoopBackConfig.setBaseURL(config['NUDD_API_URL']);
          DFILoopBackConfig.setBaseURL(config['DFI_API_URL']);
          PortalLoopBackConfig.setBaseURL(config['PORTAL_API_URL']);
          SkyeyeLoopBackConfig.setBaseURL(config['SKYEYE_API_URL']);
          IMQMLoopBackConfig.setBaseURL(config['IMQM_API_URL']);
          DFILoopBackConfig.filterOnUrl();
          DFCLoopBackConfig.filterOnUrl();
          DFQLoopBackConfig.filterOnUrl();
          NUDDLoopBackConfig.filterOnUrl();
          SkyeyeLoopBackConfig.filterOnUrl();
          IMQMLoopBackConfig.filterOnUrl();
        });
    }
  }
}
