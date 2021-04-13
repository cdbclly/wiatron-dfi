import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { PlantApi, Plant, BusinessGroupApi } from '@service/dfi-sdk';
import { CommonService } from '@service/dpm_sdk/common.service';
import { FpyrApi, LINEApi, Fpyr } from '@service/dpm_sdk/sdk';
import * as moment from 'moment';
import { forkJoin, Subject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { IPieChartOption } from '../../../components/pie-chart/pie-chart';
import { Router } from '@angular/router';
import { PlantNamePipe } from 'app/shared/pipe';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-mp-fpyr-qualified-rate',
  templateUrl: './mp-fpyr-qualified-rate.component.html',
  styleUrls: ['./mp-fpyr-qualified-rate.component.scss']
})
export class MpFpyrQualifieldRateComponent implements OnInit, OnChanges {
  @Input() businessGroup: string;
  plants: Plant[];
  pcbaOptions = [];
  faOptions = [];
  faTempOptions = [];
  pcbaTempOptions = [];
  site: string;
  plant: string;
  isLoading = true;
  transNotice = {};
  constructor(
    private router: Router,
    private messageService: NzMessageService,
    private businessGroupService: BusinessGroupApi,
    private dpmService: CommonService,
    private lineService: LINEApi,
    private fpyrService: FpyrApi,
    private plantName: PlantNamePipe,
    private plantService: PlantApi,
    private translate: TranslateService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // 初始化i18n;
    this.translate.get(['mrr.mrr-noData', 'mrr.mrr-sysDev', 'dashboard.dfq-not-found-dpm', 'dashboard.dfq-not-found-mp', 'dashboard.dfq-dpm-server', 'mrr.material-goal']).subscribe(res => {
      this.transNotice['noData'] = res['mrr.mrr-noData'];
      this.transNotice['sysDev'] = res['mrr.mrr-sysDev'];
      this.transNotice['dpm'] = res['dashboard.dfq-not-found-dpm'];
      this.transNotice['goal'] = res['mrr.material-goal'];
      this.transNotice['mp'] = res['dashboard.dfq-not-found-mp'];
      this.transNotice['server'] = res['dashboard.dfq-dpm-server'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.mrr-noData', 'mrr.mrr-sysDev', 'dashboard.dfq-not-found-dpm', 'dashboard.dfq-not-found-mp', 'dashboard.dfq-dpm-server', 'mrr.material-goal']).subscribe(res => {
        this.transNotice['noData'] = res['mrr.mrr-noData'];
        this.transNotice['sysDev'] = res['mrr.mrr-sysDev'];
        this.transNotice['dpm'] = res['dashboard.dfq-not-found-dpm'];
        this.transNotice['goal'] = res['mrr.material-goal'];
        this.transNotice['mp'] = res['dashboard.dfq-not-found-mp'];
        this.transNotice['server'] = res['dashboard.dfq-dpm-server'];
      });
    });
    if (this.businessGroup) {
      this.businessGroupService.getPlants(this.businessGroup).subscribe((plants: Plant[]) => {
        this.plants = plants;
        this.query();
      });
    } else {
      this.plantService.find().subscribe((plants: Plant[]) => {
        this.plants = plants;
        this.query();
      });
    }
  }

  ngOnInit(): void {
  }

  async query() {
    let mfgType: string, yearmonth: string, trnDate: string;
    for (let i = 0; i < this.plants.length; i++) {
      // set dpm api url by plant
      this.dpmService.setBaseUrl(this.plants[i].id);
      // PCBA
      mfgType = 'PCBA';
      // get latest trn date
      trnDate = await this.getLatestTrnDate(this.plants[i].id, mfgType);
      yearmonth = moment(trnDate).format('YYYYMM');
      // PCBA Target
      const pcbaTarget$ = this.getTarget(this.plants[i].id, mfgType, '*', yearmonth);
      // PCBA FPYR
      const pcbaFpyr$ = this.getFpyr(this.plants[i].id, mfgType, trnDate);
      // join PCBA Fpyr and target
      this.join(mfgType, pcbaTarget$, pcbaFpyr$, i);
      // FA
      mfgType = 'FA';
      // get latest trn date
      trnDate = await this.getLatestTrnDate(this.plants[i].id, mfgType);
      yearmonth = moment(trnDate).format('YYYYMM');
      // FA Target
      const faTarget$ = this.getTarget(this.plants[i].id, mfgType, '*', yearmonth);
      // FA FPYR
      const faFpyr$ = this.getFpyr(this.plants[i].id, mfgType, trnDate);
      // join FA Fpyr and target
      this.join(mfgType, faTarget$, faFpyr$, i);
    }
  }

  join(mfgType: string, target$, fpyr$, i): void {
    let target: number, fpyr: number;
    forkJoin(target$, fpyr$).subscribe({
      next: async ([targets, fpyrs]) => {
        if (targets && targets['targets'][0] && targets['targets'][0].target) {
          target = targets['targets'][0].target;
        } else {
          target = undefined;
        }
        if (fpyrs && fpyrs[0] && fpyrs[0]['fpyr']) {
          fpyr = fpyrs[0]['fpyr'];
        } else {
          fpyr = undefined;
        }
        const params = {
          site: this.plants[i].siteId,
          plant: this.plants[i].id,
          mfgType: mfgType,
          fpyr: fpyr,
          target: target,
          enabled: this.plants[i].enabled,
        };
        if (mfgType === 'FA') {
          this.faTempOptions.push(await this.getOptions(params));
        } else if (mfgType === 'PCBA') {
          this.pcbaTempOptions.push(await this.getOptions(params));
        } else { }
        this.isFinish(this.pcbaTempOptions, this.faTempOptions);
      },
      error: error => this.handleError(error, this.plants[i].siteId, this.plants[i].id, mfgType, this.plants[i].enabled)
    });
  }

  sort(data): void {
    data.sort((a, b) => {
      if (a.data[0].value > b.data[0].value) {
        return 1;
      } else if (a.data[0].value === b.data[0].value) {
        return 0;
      } else if (a.data[0].value < b.data[0].value) {
        return -1;
      } else { }
    });
  }

  isFinish(pcbaTempOptions, faTempOptions) {
    if ((this.plants.length === this.pcbaTempOptions.length) && (this.plants.length === this.faTempOptions.length) && (this.pcbaTempOptions.length === this.faTempOptions.length)) {
      this.sort(faTempOptions);
      this.sort(pcbaTempOptions);
      this.pcbaOptions = pcbaTempOptions;
      this.faOptions = faTempOptions;
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }

  async getLatestTrnDate(plantId: string, mfgType: string): Promise<string> {
    const latest = await this.fpyrService.findOne<Fpyr>({ where: { plant: plantId, mfgType: mfgType }, limit: 1, order: 'trnDate desc' }).toPromise().catch(error => console.log(error));
    if (latest) {
      return latest.trnDate;
    } else {
      return moment().subtract(1, 'days').format('YYYY-MM-DD');
    }
  }

  getFpyr(plantId: string, mfgType: string, trnDate: string) {
    const filter = {
      where: {
        plant: plantId,
        mfgType: mfgType,
        trnDate: trnDate
      },
      group: ['plant', 'mfgType']
    };
    return this.fpyrService.find(filter);
  }

  getTarget(plantId: string, mfgType: string, line: string, yearmonth: string) {
    let kpiId: string;
    if (mfgType === 'PCBA') {
      kpiId = 'KPI0013';
    } else if (mfgType === 'FA') {
      kpiId = 'KPI0014';
    } else {
      kpiId = undefined;
    }
    return this.lineService.findOne({
      where: {
        plant: plantId,
        mfgtype: mfgType === 'PCBA' ? 'PCB' : mfgType,
        line: line
      },
      include: {
        relation: 'targets',
        scope: {
          where: {
            kpiid: kpiId,
            yearmonth: yearmonth
          },
          fields: ['id', 'plantid', 'kpiid', 'lineid', 'type', 'yearmonth', 'target']
        }
      }
    });
  }

  async getOptions(params): Promise<IPieChartOption> {
    const option: IPieChartOption = {
      title: await this.plantName.transform(params.plant),
      subtext: (params.fpyr !== undefined ? (params.fpyr * 100).toFixed(2) + '%' : 'N/A') + '\n' + '─────' + '\n' + (params.target !== undefined ? (params.target * 100).toFixed(2) + '%' : 'N/A'),
      data: [],
      height: '160px',
      width: '160px'
    };
    if (params.fpyr === undefined || params.target === undefined) {
      option.subtext = this.transNotice['noData'];
      option.data.push({
        value: 999,
        itemStyle: {
          color: 'white'
        },
        plant: params.plant,
        mfgType: params.mfgType
      });
    } else {
      option.data.push({
        value: params.fpyr,
        itemStyle: {
          color: this.getColor(params)
        },
        plant: params.plant,
        mfgType: params.mfgType
      });
      if (params.fpyr < params.target) {
        option.data.push({
          value: params.target - params.fpyr,
          itemStyle: {
            color: 'white'
          },
          plant: params.plant,
          mfgType: params.mfgType
        });
      } else { }
    }
    if (!params.enabled) {
      option.subtext = this.transNotice['sysDev'];
    }
    return option;
  }

  getColor(data: { fpyr: number; target: number; }): string {
    return data.fpyr >= data.target ? 'green' : data.fpyr < data.target && data.fpyr > 0.95 ? 'yellow' : data.fpyr < 0.95 ? 'red' : 'grey';
  }

  onChartEvent(params) {
    this.router.navigateByUrl(`/dashboard/dfq/mp/yr-tracking?plant=${params.data.plant}&mfgType=${params.data.mfgType}`);
  }

  async handleError(error, site: string, plant: string, mfgType: string, enabled) {
    const params = {
      site: site,
      plant: plant,
      mfgType: mfgType,
      fpyr: undefined,
      target: undefined,
      enabled: enabled
    };
    if (mfgType === 'FA') {
      this.faTempOptions.push(await this.getOptions(params));
    } else if (mfgType === 'PCBA') {
      this.pcbaTempOptions.push(await this.getOptions(params));
    } else { }
    this.isFinish(this.pcbaTempOptions, this.faTempOptions);
    if (error.statusCode === 404) {
      console.log(`${site}-${plant} ${this.transNotice['dpm']} ${mfgType} ${this.transNotice['goal']}`);
    } else {
      this.messageService.error(`${this.transNotice['mp']} ${site}-${plant} ${this.transNotice['server']}:${error.message ? error.message : error}`);
    }
  }
}
