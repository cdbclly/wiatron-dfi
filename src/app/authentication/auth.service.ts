import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InternalStorage } from '../service/portal/sdk/storage/storage.swaps';
import { UserApi, LoggerService } from '../service/portal/sdk';
import { ExternalUserApi } from '../service/mrr-sdk';
import { LoopBackAuth } from '../service/portal/sdk';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../environments/environment';
import { UtilsService } from '@service/utils.service';
import { BaseES } from '../dfq/skyeye/model/ES_Base';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends LoopBackAuth {
  redirectUrl: string;
  esItem: BaseES = new BaseES();
  isExt = localStorage.getItem('$DFI$isExt') ? true : false;
  trans = {};
  constructor(
    protected storage: InternalStorage,
    private userService: UserApi,
    private router: Router,
    private loggerService: LoggerService,
    private externalUserService: ExternalUserApi,
    private messageService: NzMessageService,
    private utilsService: UtilsService,
    private translate: TranslateService
  ) {
    super(storage);
    // 初始化I18N;
    this.translate.get(['login.logged-out']).subscribe(res => {
      this.trans['logged-out'] = res['login.logged-out'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['login.logged-out']).subscribe(res => {
        this.trans['logged-out'] = res['login.logged-out'];
      });
    });
  }

  logout() {
    if (!localStorage.getItem('$DFI$isExt')) {
      this.userService.logout().subscribe({
        next: () => {
          this.messageService.success(`${this.trans['logged-out']}`);
          this.router.navigate(['/login']);
        },
        error: err => {
          this.loggerService.error(err);
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.externalUserService.logout().subscribe(res => {
        this.messageService.success(`${this.trans['logged-out']}`);
        this.router.navigate(['/login']);
      });
    }
  }

  setEnvironment() {
    if (environment.enable && !environment['isExtUser']) {
      localStorage.setItem('RFI_ES_URL', environment['RFI_ES_URL']);
      localStorage.setItem('mqtt_host', JSON.stringify(environment['mqtt_host']));
      localStorage.setItem('mqtt_port', JSON.stringify(environment['mqtt_port']));
      localStorage.setItem('dmcUrl', environment['dmcUrl']);
      localStorage.setItem('skyeye_site', JSON.stringify(environment['SKYEYE_DASHBOARD_SITE']));
      localStorage.setItem('DPM_API_URL', JSON.stringify(environment['DPM_API_URL']));
      localStorage.setItem('dpmIssueUrl', JSON.stringify(environment['dpmIssueUrl']));
      localStorage.setItem('mqtt_topics', JSON.stringify(environment['mqtt_topics']));
      // dfc Stage全 show的Plant
      localStorage.setItem('dfcStageShowPlant', environment['dfcStageShowPlant'].join());
      this.esItem.esNode = environment['esNode'];
      this.esItem.esPort = environment['esPort'];
      this.esItem.esIndex = environment['esIndex'];
      this.esItem.plant = '';
      localStorage.setItem('esItem', JSON.stringify(this.esItem));
      this.getSkyPlantMap(environment['SKYEYE_DASHBOARD_SITE']);
      if (!!localStorage.getItem('$DFI$userID') && !this.isExt) {
        this.utilsService.getAuthority();
      }
      if (!!localStorage.getItem('$DFI$userID') && !this.isExt) {
        this.utilsService.getIMQMAuthority();
      }
      this.getDfcSignConfig();
    } else {
      this.utilsService.getConfig()
        .subscribe(config => {
          localStorage.setItem('RFI_ES_URL', config['RFI_ES_URL']);
          localStorage.setItem('mqtt_host', JSON.stringify(config['mqtt_host']));
          localStorage.setItem('mqtt_port', JSON.stringify(config['mqtt_port']));
          localStorage.setItem('dmcUrl', config['dmcUrl']);
          localStorage.setItem('skyeye_site', JSON.stringify(config['SKYEYE_DASHBOARD_SITE']));
          localStorage.setItem('mqtt_topics', JSON.stringify(config['mqtt_topics']));
          localStorage.setItem('DPM_API_URL', JSON.stringify(config['DPM_API_URL']));
          localStorage.setItem('dpmIssueUrl', JSON.stringify(config['dpmIssueUrl']));
          // dfc Stage全 show的Plant
          localStorage.setItem('dfcStageShowPlant', config['dfcStageShowPlant'].join());
          this.esItem.esNode = config['esNode'];
          this.esItem.esPort = config['esPort'];
          this.esItem.esIndex = config['esIndex'];
          this.esItem.plant = '';
          localStorage.setItem('esItem', JSON.stringify(this.esItem));
          this.getSkyPlantMap(config['SKYEYE_DASHBOARD_SITE']);
          if (!!localStorage.getItem('$DFI$userID') && !this.isExt) {
            this.utilsService.getAuthority();
          }
          if (!!localStorage.getItem('$DFI$userID') && !this.isExt) {
            this.utilsService.getIMQMAuthority();
          }
          this.getDfcSignConfig();
        });
    }
  }

  getSkyPlantMap(data) {
    const siteMap = [];
    for (const site in data) {
      if (data.hasOwnProperty(site)) {
        const plantArr = data[site];
        plantArr.map(plant => {
          siteMap.push({ Plant: plant, Site: site });
        });
      }
    }
    localStorage.setItem('Skyeye_plantMapping', JSON.stringify(siteMap));
  }

  // 獲取DFC簽核人員信息
  getDfcSignConfig() {
    this.utilsService.getDfcSignConfig()
      .subscribe(config => {
        localStorage.setItem('DFC_SignConfig', JSON.stringify(config));
      });
  }
}
