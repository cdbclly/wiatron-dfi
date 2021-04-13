import { Injectable } from '@angular/core';
import { LoopBackConfig as DPMLoopBackConfig } from '@service/dpm_sdk/sdk';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor() { }
  setBaseUrl(plantId: string) {
    const dpmUrl = JSON.parse(localStorage.getItem('DPM_API_URL'));
    for (const key in dpmUrl) {
      if (key === plantId) {
        DPMLoopBackConfig.setBaseURL(dpmUrl[key]);
      }
    }
  }
}
