import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
// DFI SDK
import { LoopBackAuth as DFILoopBackAuth } from '@service/dfi-sdk';
// DFQ SDK
import { LoopBackAuth as DFQLoopBackAuth } from '@service/dfq_sdk/sdk/services/core/auth.service';
// DFC SDK
import { LoopBackAuth as DFCLoopBackAuth } from '@service/dfc_sdk/sdk/services/core/auth.service';
import { NzMessageService } from 'ng-zorro-antd';
// NUDD SDK
import { LoopBackAuth as NUDDLoopBackAuth } from '@service/mrr-sdk/services/core/auth.service';
// PORTAL SDK
import { UtilsService } from '@service/utils.service';
import { SiteApi } from '@service/portal/sdk/services/custom/Site';
import { LoopBackConfig as PortalLoopBackConfig, UserApi, SDKToken, Site } from '@service/portal/sdk';
// IMQM SDK
import { LoopBackAuth as IMQMLoopBackAuth } from '@service/imqm-sdk/services/core/auth.service';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { ExternalUserApi, LoopBackConfig as NUDDLoopBackConfig } from '@service/mrr-sdk';
import { PlantMappingApi } from '@service/dfi-sdk';
import { AuthService } from '../auth.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginUrl;
  domain = '';
  username = '';
  password = '';
  sites;
  isLoading: boolean;
  // 廠商登錄參數
  manuUser = '';
  manuPassword = '';
  isExt = false;
  trans = {};
  constructor(
    protected DFQAuth: DFQLoopBackAuth,
    protected DFCAuth: DFCLoopBackAuth,
    protected NUDDAuth: NUDDLoopBackAuth,
    protected DFIAuth: DFILoopBackAuth,
    protected PORTALAuth: AuthService,
    protected IMQMAuth: IMQMLoopBackAuth,
    private userService: UserApi,
    private messageService: NzMessageService,
    private plantMappingServer: PlantMappingApi,
    private utilsService: UtilsService,
    private siteService: SiteApi,
    private router: Router,
    private externalUserApi: ExternalUserApi,
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化I18N;
    this.translate.get(['login.login-success', 'login.login-fail', 'login.login-success-jump', 'login.login-no-authority']).subscribe(res => {
      this.trans['login-success'] = res['login.login-success'];
      this.trans['login-fail'] = res['login.login-fail'];
      this.trans['login-success-jump'] = res['login.login-success-jump'];
      this.trans['login-no-authority'] = res['login.login-no-authority'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['login.login-success', 'login.login-fail', 'login.login-success-jump', 'login.login-no-authority']).subscribe(res => {
        this.trans['login-success'] = res['login.login-success'];
        this.trans['login-fail'] = res['login.login-fail'];
        this.trans['login-success-jump'] = res['login.login-success-jump'];
        this.trans['login-no-authority'] = res['login.login-no-authority'];
      });
    });
    // 取消切換頁簽
    if (location.host === 'ifactory.wks.wistron.com') {
      this.isExt = true;
    }
    const host = ['localhost:4200', 'dfiqas.wistron.com', 'dfi.wks.wistron.com.cn'];
    if (host.includes(location.host)) {
      this.isExt = false;
    }
    if (environment.enable) {
      this.loginUrl = environment['PORTAL_API_URL'] + environment['PORTAL_LOGIN_API'];
      NUDDLoopBackConfig.setBaseURL(environment['NUDD_API_URL']);
      PortalLoopBackConfig.setBaseURL(environment['PORTAL_API_URL']);
    } else {
      this.utilsService.getConfig().subscribe(config => {
        this.loginUrl = config['PORTAL_API_URL'] + config['PORTAL_LOGIN_API'];
        NUDDLoopBackConfig.setBaseURL(config['NUDD_API_URL']);
        PortalLoopBackConfig.setBaseURL(config['PORTAL_API_URL']);
      });
    }
    // load sites
    this.siteService.find().subscribe((sites: Site[]) => {
      this.sites = sites;
      // load site to domain
      if (localStorage.getItem('Site')) {
        this.domain = localStorage.getItem('Site');
      }
    });
    if (localStorage.getItem('$DFI$userID')) {
      this.username = localStorage.getItem('$DFI$userID');
    }
  }

  login(domain: string, username: string, password: string) {
    if (!domain || !username || !password) {
      return;
    }
    if (this.loginUrl) {
      this.isLoading = true;
      const key = '2b7e151628aed2a6abf7158809cf4f3c';
      const encrypted = CryptoJS.AES.encrypt(password, key).toString();
      this.userService
        .login({
          domain: domain.toUpperCase(),
          plant: '',
          username: username,
          password: encrypted
        })
        .subscribe({
          next: (token: SDKToken) => {
            localStorage.setItem('Site', this.domain);
            localStorage.setItem('$DFI$token', token.id);
            localStorage.setItem('$DFI$userID', token.userId.toUpperCase());
            localStorage.setItem('$DFI$isExt', '');
            this.setToken(token);
            this.authService.setEnvironment();
            const job1$ = this.utilsService.getAuthority();
            const job2$ = this.utilsService.getIMQMAuthority();
            const job3$ = this.plantMappingServer.find({}).toPromise().then(plantMappingDatas => {
              const plants = [];
              const list = plantMappingDatas.map(plantMappingData => {
                if (!plants.includes(plantMappingData['PlantCode'])) {
                  plants.push(plantMappingData['PlantCode']);
                  return {
                    Plant: plantMappingData['Plant'],
                    PlantName: plantMappingData['PlantName'],
                    Site: plantMappingData['Site'],
                    PlantCode: plantMappingData['PlantCode'],
                    bg: plantMappingData['bg'],
                    op: plantMappingData['op'],
                    Actived: plantMappingData['Actived'],
                  };
                }
              });
              const dfcPlantMapping = list.filter(plantMappingData => !(!plantMappingData));
              localStorage.setItem('DFC_PlantMapping', JSON.stringify(dfcPlantMapping));
            });
            Promise.all([job1$, job2$, job3$]).then(() => {
              this.isLoading = false;
              if (this.authService.redirectUrl) {
                this.messageService.success(`${this.trans['login-success-jump']}`);
                this.router.navigateByUrl(this.authService.redirectUrl);
              } else {
                this.messageService.success(`${this.trans['login-success']}`);
                this.router.navigateByUrl('/dashboard/board');
              }
            }).catch(err => {
              this.isLoading = false;
              this.messageService.error(`${this.trans['login-no-authority']}`);
              this.authService.logout();
            });
          },
          error: err => {
            this.messageService.error(`${this.trans['login-fail']}\n` + err.message);
            this.isLoading = false;
          }
        });
    }
  }

  // 廠商身份登錄
  externalLogin(manuUser, manuPassword) {
    if (!manuUser || !manuPassword) {
      return;
    }
    if (this.loginUrl) {
      this.isLoading = true;
      this.externalUserApi
        .login({
          username: manuUser,
          password: manuPassword
        })
        .subscribe({
          next: (token: SDKToken) => {
            this.setToken(token);
            this.isLoading = false;
            localStorage.setItem('$DFI$token', token.id);
            localStorage.setItem('$DFI$userID', token.userId.toUpperCase());
            localStorage.setItem('$DFI$isExt', 'true');
            this.plantMappingServer
              .find({})
              .toPromise()
              .then(plantMappingDatas => {
                const plants = [];
                const list = plantMappingDatas.map(plantMappingData => {
                  if (!plants.includes(plantMappingData['PlantCode'])) {
                    plants.push(plantMappingData['PlantCode']);
                    return {
                      Plant: plantMappingData['Plant'],
                      PlantName: plantMappingData['PlantName'],
                      Site: plantMappingData['Site'],
                      PlantCode: plantMappingData['PlantCode']
                    };
                  }
                });
                const dfcPlantMapping = list.filter(
                  plantMappingData => !!plantMappingData
                );
                localStorage.setItem(
                  'DFC_PlantMapping',
                  JSON.stringify(dfcPlantMapping)
                );
                // 带出登录者所属厂商
                this.externalUserApi.find({ where: { username: manuUser } }).toPromise().then(externalUser => {
                  localStorage.setItem(
                    'manufacturerId',
                    JSON.stringify(externalUser[0]['manufacturerId'])
                  );
                  this.messageService.success(`${this.trans['login-success']}`);
                  this.router.navigateByUrl('/dashboard/mrrMaterial/manufaturer');
                });
              });
          },
          error: err => {
            this.messageService.error(`${this.trans['login-fail']}\n` + err.message);
            this.isLoading = false;
          }
        });
    }
  }

  setToken(token: SDKToken) {
    this.DFQAuth.setToken(token);
    this.DFCAuth.setToken(token);
    this.NUDDAuth.setToken(token);
    this.DFIAuth.setToken(token);
    this.PORTALAuth.setToken(token);
    this.IMQMAuth.setToken(token);
  }
}
