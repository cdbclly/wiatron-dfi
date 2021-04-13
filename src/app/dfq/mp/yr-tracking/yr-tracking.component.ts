import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '@service/dpm_sdk/common.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { LINEApi, FpyrApi, LINE, RepairMasterApi } from '@service/dpm_sdk/sdk';
import { forkJoin, Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { PcScheduleApi } from '@service/dfq_sdk/sdk/services/custom/PcSchedule';
import { PcSchedule } from '@service/dfq_sdk/sdk';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mp-yr-tracking',
  templateUrl: './yr-tracking.component.html',
  styleUrls: ['./yr-tracking.component.scss']
})
export class YrTrackingComponent implements OnInit, AfterViewInit, OnDestroy {
  // form
  formGroup: FormGroup;
  queried: boolean;
  plants;
  lines: LINE[];
  modelFamilies;
  models;
  dateRange = [];
  byModel: boolean;
  schedule: PcSchedule[];
  scheduleDates: any[];
  trnDates: string[];
  forcastDates: string[];
  dpmUrl: string;
  // echart
  daysPerPeriod: number;
  lineYieldRate;
  fpyr;
  modelFpyr;
  pieYieldRate = [];
  modelFpyrOnTargetStatus;
  wma;
  byLine = false;
  // loopback filter
  lineFilter;
  modelFilter;
  modelFamilyFilter;
  trnDateFilter;
  // is loading
  isWeightedMovingAvgLoading: boolean;
  isModelFpyrQualifieldRateLoading: boolean;
  isLineYieldRateComparisonLoading: boolean;
  isPieYieldRateComparisonLoading: boolean;
  isDpmUrlLoading: boolean;
  isModelLoading: boolean;
  // i18n
  destroy$ = new Subject();
  trans = {
    forecast: '',
    actual: '',
    standard: '',
    lineToLine: '',
    reason: ''
  };

  constructor(
    private fb: FormBuilder,
    private dpmService: CommonService,
    private router: ActivatedRoute,
    private lineService: LINEApi,
    private fpyrService: FpyrApi,
    private scheduleService: PcScheduleApi,
    private messageService: NzMessageService,
    private repairMasterService: RepairMasterApi,
    private translate: TranslateService
  ) {
    this.fpyr = [];
    this.wma = [];
    this.daysPerPeriod = 7;
  }

  ngOnInit(): void {
    this.plants = this.router.snapshot.data['getPlant'];
    this.modelFamilies = this.router.snapshot.data['getMdelFamilies'];
    // receive router query params
    this.router.queryParams.subscribe(params => {
      const models: string[] = params.model ? params.model.split(',') : [];
      // param startDate and endDate
      if (params.startDate && params.endDate) {
        this.dateRange[0] = params.startDate;
        this.dateRange[1] = params.endDate;
      } else if (params.scheduleDates) {
        this.scheduleDates = params.scheduleDates.split(',');
      } else { }

      // form validator init
      this.formGroup = this.fb.group({
        plant: ['', Validators.required],
        mfgType: [params.mfgType, Validators.required],
        modelFamily: [params.modelFamily],
        model: [models],
        rangePicker: [[]],
      });
    });
    // 初始化I18N;
    this.translate.get(['dfq.mp-model-to-standard', 'dfq.mp-forecast-through-rate', 'dfq.mp-line-to-line-yield-comparison', 'dfq.mp-repair-reason-category', 'dfq.mp-actual-through-rate']).subscribe(res => {
      this.trans.standard = res['dfq.mp-model-to-standard'];
      this.trans.forecast = res['dfq.mp-forecast-through-rate'];
      this.trans.actual = res['dfq.mp-actual-through-rate'];
      this.trans.lineToLine = res['dfq.mp-line-to-line-yield-comparison'];
      this.trans.reason = res['dfq.mp-repair-reason-category'];
    });
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.mp-model-to-standard', 'dfq.mp-forecast-through-rate', 'dfq.mp-line-to-line-yield-comparison', 'dfq.mp-repair-reason-category', 'dfq.mp-actual-through-rate']).subscribe(res => {
        this.trans.standard = res['dfq.mp-model-to-standard'];
        this.trans.forecast = res['dfq.mp-forecast-through-rate'];
        this.trans.actual = res['dfq.mp-actual-through-rate'];
        this.trans.lineToLine = res['dfq.mp-line-to-line-yield-comparison'];
        this.trans.reason = res['dfq.mp-repair-reason-category'];
      });
    });
  }

  ngAfterViewInit(): void {
    this.formGroup.patchValue({
      plant: this.router.snapshot.queryParams.plant || ''
    });
    if (this.formGroup.valid) {
      this.query();
    } else {
      this.messageService.warning('Please select required parameters!');
    }
  }

  async query() {
    this.queried = false;
    // check date range
    const compareDay = moment(this.dateRange[1]).diff(moment(this.dateRange[0]), 'day');
    if (compareDay > 7) {
      this.messageService.error('The date interval cannot exceed seven days!');
      return;
    }
    this.byLine = false;
    // form validator
    for (const i in this.formGroup.controls) {
      if (this.formGroup.controls.hasOwnProperty(i)) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
    // query by model or not
    if (this.formGroup.value.modelFamily || (this.formGroup.value.model && this.formGroup.value.model.length > 0)) {
      this.byModel = true;
    } else {
      this.byModel = false;
    }
    // set dpm api url
    this.dpmService.setBaseUrl(this.formGroup.value.plant);
    // filter line
    let lines$: Observable<LINE[]>;
    this.lines = undefined;
    if (this.formGroup.value.mfgType === 'PCBA') {
      lines$ = this.lineService.find<LINE>({ where: { plant: this.formGroup.value.plant, mfgtype: 'PCB', isProduction: true, enabled: true }, include: ['smtLines', 'dipLines'] });
    } else {
      lines$ = this.lineService.find<LINE>({ where: { plant: this.formGroup.value.plant, mfgtype: this.formGroup.value.mfgType, isProduction: true, enabled: true } });
    }
    await lines$.toPromise()
      .then((lines: LINE[]) => this.lines = lines)
      .catch(error => this.handleError(error, 'DPM Server error'));
    if (!this.lines) {
      return;
    }
    this.lineFilter = { inq: this.lines.map(element => element.line) };
    // filter model
    this.modelFilter = this.formGroup.value.model && this.formGroup.value.model.length > 0 ? { inq: this.formGroup.value.model } : undefined;
    // filter model family
    this.modelFamilyFilter = this.formGroup.value.modelFamily ? this.formGroup.value.modelFamily : undefined;
    // filter trndate
    const filter = {
      where: {
        plant: this.formGroup.value.plant,
        process: this.formGroup.value.mfgType,
        modelFamily: this.modelFamilyFilter,
        model: this.modelFilter,
        line: this.lineFilter,
        date: { lt: moment().add(3, 'days').format('YYYY-MM-DD') }
      },
      order: 'date desc',
      group: ['date']
    };
    await this.scheduleService.find(filter).toPromise()
      .then((schedule: PcSchedule[]) => this.schedule = schedule)
      .catch(err => this.handleError(err, 'DFi Server error,Unable to get a PC schedule'));
    this.forcastDates = this.getDates(moment(), moment().add(2, 'days'));
    if (this.dateRange[0] && this.dateRange[1]) {
      // use specified dates
      this.trnDates = this.getDates(this.dateRange[0], this.dateRange[1]);
      this.scheduleDates = this.getDates(moment(this.dateRange[0]).subtract(this.daysPerPeriod, 'days'), this.dateRange[1]);
    } else if (this.schedule && this.schedule.length > 0) {
      // use schedule dates
      this.trnDates = this.schedule.map(schedule => moment(schedule['date']).format('YYYY-MM-DD')).filter(date => !this.forcastDates.includes(date)).slice(0, this.daysPerPeriod).sort();
      this.scheduleDates = this.schedule.map(schedule => moment(schedule['date']).format('YYYY-MM-DD')).slice(0, this.daysPerPeriod * 2).sort();
    } else {
      // use the past 7 dates
      this.dateRange = [moment().subtract(this.daysPerPeriod, 'days').format('YYYY-MM-DD'), moment().add(-1, 'days').format('YYYY-MM-DD')];
      this.trnDates = this.getDates(this.dateRange[0], this.dateRange[1]);
      this.trnDates = this.trnDates.concat(this.forcastDates);  // 加上未來三天？？
      this.scheduleDates = this.getDates(moment(this.dateRange[0]).subtract(this.daysPerPeriod, 'days').format('YYYY-MM-DD'), this.dateRange[1]);
      this.scheduleDates = this.scheduleDates.concat(this.forcastDates);
      this.messageService.warning('The schedule is not uploaded, and the past seven days are automatically used as query conditions');
    }
    this.trnDateFilter = { inq: this.trnDates };
    // gen charts
    this.genWeightedMovingAverage(this.daysPerPeriod); // 預測良率
    this.genModelFpyrQualifieldRate(); // 機種達標比例
    this.genLineYieldRateComparison();
    this.genRepairMaster(this.formGroup.value.plant, this.formGroup.value.mfgType, this.modelFilter, this.trnDateFilter, undefined, this.lineFilter);
    this.dpmUrl = this.getDpmUrl(this.formGroup.value.plant, this.formGroup.value.mfgType);
    // set URL
    this.setUrl(this.formGroup.value.plant, this.formGroup.value.mfgType, this.formGroup.value.modelFamily, this.formGroup.value.model, this.byModel);
    // set query flag to true
    this.queried = true;
  }

  setUrl(plant: string, mfgType: string, modelFamily: string, models: string[], byModel: boolean): void {
    let url = `dashboard/dfq/mp/yr-tracking?plant=${plant}&mfgType=${mfgType}`;
    if (byModel) {
      url += `&model=${models.join(',')}`;
    }
    if (modelFamily) {
      url += `&modelFamily=${modelFamily}`;
    }
    if (this.dateRange[0] && this.dateRange[1]) {
      url += `&startDate=${moment(this.dateRange[0]).format('YYYY-MM-DD')}&endDate=${moment(this.dateRange[1]).format('YYYY-MM-DD')}`;
    } else if (this.trnDates && this.trnDates.length > 0) {
      url += `&scheduleDates=${this.trnDates.join(',')}`;
    } else { }
    history.replaceState('', document.title, url);
  }

  genWeightedMovingAverage(period: number) {
    this.isWeightedMovingAvgLoading = true;
    this.wma = [];
    const filter = {
      where: {
        plant: this.formGroup.value.plant,
        mfgType: this.formGroup.value.mfgType,
        line: this.lineFilter,
        modelFamily: this.modelFamilyFilter,
        model: this.modelFilter,
        trnDate: { inq: this.scheduleDates }
      },
      group: ['trnDate'],
      order: ['trnDate']
    };

    const fpyr$ = this.fpyrService.find(filter);
    const wma = []; // weighted moving average fpyr
    const actual = []; // actual fpyr
    fpyr$.subscribe({
      next: (data: any[]) => {
        const all = [];
        this.trnDates.forEach(trnDate => { // 計算過去的良率 by day
          let total = 0, weight = 0;
          const temp = data.filter(data => data.trnDate < trnDate);
          const index = temp.length - period < 0 ? 0 : temp.length - period;
          weight = temp.slice(index).reduce((sum, current) => {
            const planQty = this.schedule.filter(schedule => moment(schedule.date).format('YYYY-MM-DD') === current.trnDate)
              .reduce((sum, current) => sum + current.planQty, 0);
            if (planQty) {
              total += planQty;
              return sum + current.fpyr * planQty;
            } else {
              return sum;
            }
          }, 0);

          wma.push({
            trnDate: trnDate,
            fpyr: total ? weight / total : undefined
          });
          const fpyr = data.find(data => data.trnDate === trnDate);
          actual.push({
            trnDate: trnDate,
            fpyr: fpyr ? fpyr.fpyr : undefined
          });
          all.push({
            trnDate: trnDate,
            fpyr: fpyr ? fpyr.fpyr : undefined
          });
        });
        this.forcastDates.forEach(forcastDate => {  // 未來3天的良率 by day
          let total = 0;
          const weight = all.slice(all.length - this.daysPerPeriod < 0 ? 0 : all.length - this.daysPerPeriod, all.length)
            .reduce((sum, current) => {
              const planQty = this.schedule.filter(schedule => moment(schedule.date).format('YYYY-MM-DD') === current.trnDate)
                .reduce((sum, current) => sum + current.planQty, 0);
              if (planQty && current.fpyr) {
                total += planQty;
                return sum + current.fpyr * planQty;
              } else {
                return sum;
              }
            }, 0);
          wma.push({
            trnDate: forcastDate,
            fpyr: total ? weight / total : undefined
          });
          all.push({
            trnDate: forcastDate,
            fpyr: total ? weight / total : undefined
          });
        });
        this.fpyr = this.formatPercent(actual);
        this.wma = this.formatPercent(wma);
        this.isWeightedMovingAvgLoading = false;
      },
      error: err => {
        this.handleError(err, 'DPM Server error,Can not get rate');
        this.isWeightedMovingAvgLoading = false;
      }
    });
  }
  formatPercent(data) {
    return data.map(data => {
      data.fpyr = Number((data.fpyr * 100).toFixed(2));
      return data;
    });
  }

  genModelFpyrQualifieldRate() {
    this.isModelFpyrQualifieldRateLoading = true;
    // FPYR
    const filter = {
      where: {
        plant: this.formGroup.value.plant,
        mfgType: this.formGroup.value.mfgType,
        line: this.lineFilter,
        modelFamily: this.modelFamilyFilter,
        model: this.modelFilter,
        trnDate: this.trnDateFilter
      },
      group: ['model']
    };
    const fpyr$ = this.fpyrService.find(filter);
    // target
    let meetTarget = 0, missTarget = 0, noTarget = 0;
    const target$ = this.lineService.findOne({
      where: {
        plant: this.formGroup.value.plant,
        mfgtype: this.formGroup.value.mfgType === 'PCBA' ? 'PCB' : this.formGroup.value.mfgType,
        line: '*'
      },
      include: {
        relation: 'targets',
        scope: {
          where: {
            kpiid: this.formGroup.value.mfgType === 'PCBA' ? 'KPI0013' : 'KPI0014',
            yearmonth: moment().format('YYYYMM')  // 好像有問題
          },
          fields: ['id', 'plantid', 'kpiid', 'lineid', 'type', 'yearmonth', 'target']
        }
      }
    });
    forkJoin(fpyr$, target$).subscribe({
      next: ([actual, target]) => {
        if (target && target['targets'].length > 0) {
          actual.forEach(model => {
            if (model['fpyr'] >= target['targets'][0].target) {
              meetTarget++;
            } else {
              missTarget++;
            }
          });
        } else {
          noTarget = actual.length;
        }
        this.modelFpyrOnTargetStatus = [];
        this.modelFpyrOnTargetStatus.push({
          name: 'meet-target',
          value: meetTarget,
          plant: this.formGroup.value.plant,
          mfgtype: this.formGroup.value.mfgType,
          startDate: this.dateRange[0] ? moment(this.dateRange[0]).format('YYYY-MM-DD') : undefined,
          endDate: this.dateRange[1] ? moment(this.dateRange[1]).format('YYYY-MM-DD') : undefined,
          date: this.trnDateFilter.inq ? this.trnDateFilter.inq.join(',') : undefined,
          itemStyle: {
            color: 'green'
          }
        });
        this.modelFpyrOnTargetStatus.push({
          name: 'miss-target',
          value: missTarget,
          plant: this.formGroup.value.plant,
          mfgtype: this.formGroup.value.mfgType,
          startDate: this.dateRange[0] ? moment(this.dateRange[0]).format('YYYY-MM-DD') : undefined,
          endDate: this.dateRange[1] ? moment(this.dateRange[1]).format('YYYY-MM-DD') : undefined,
          date: this.trnDateFilter.inq ? this.trnDateFilter.inq.join(',') : undefined,
          itemStyle: {
            color: 'red'
          }
        });
        this.modelFpyrOnTargetStatus.push({
          name: 'no-target',
          value: noTarget,
          plant: this.formGroup.value.plant,
          mfgtype: this.formGroup.value.mfgType,
          startDate: this.dateRange[0] ? moment(this.dateRange[0]).format('YYYY-MM-DD') : undefined,
          endDate: this.dateRange[1] ? moment(this.dateRange[1]).format('YYYY-MM-DD') : undefined,
          date: this.trnDateFilter.inq ? this.trnDateFilter.inq.join(',') : undefined,
          itemStyle: {
            color: 'grey'
          }
        });
        this.isModelFpyrQualifieldRateLoading = false;
      },
      error: err => {
        this.handleError(err, 'DPM Server error');
        this.isModelFpyrQualifieldRateLoading = false;
      }
    });
  }

  genLineYieldRateComparison() {
    this.isLineYieldRateComparisonLoading = true;
    const filter = {
      where: {
        plant: this.formGroup.value.plant,
        mfgType: this.formGroup.value.mfgType,
        line: this.lineFilter,
        modelFamily: this.modelFamilyFilter,
        model: this.modelFilter,
        trnDate: this.trnDateFilter,
      },
      group: ['line'],
      order: 'line asc'
    };
    const fpyr$ = this.fpyrService.find<LINE>(filter);
    forkJoin(fpyr$).subscribe({
      next: ([fpyr]) => {
        // merge SMT lines to DIP line
        fpyr.forEach(data => {
          const line = this.lines.find(element => element.line === data.line);
          if (line && line['smtLines'] && line['smtLines'].length > 0) {
            line['smtLines'].forEach((smt: LINE) => {
              const index = fpyr.map(x => x.line).indexOf(smt.line);
              if (index !== -1) {
                data['fpyr'] = data['fpyr'] * fpyr[index]['fpyr'];
                if (Array.isArray(data['lines'])) {
                  data['lines'].push(fpyr[index].line);
                } else {
                  data['lines'] = [data.line, fpyr[index].line];
                }
                fpyr.splice(index, 1);
              } else {
                data['lines'] = [data.line];
              }
            });
          } else if (line && line['dipLines'] && line['dipLines'].length > 0) {
            data['lines'] = [data.line, line['dipLines'][0].line];
            data.line = line['dipLines'][0].line;
          } else {
            data['lines'] = [data.line];
          }
        });
        // sort by line
        fpyr = fpyr.sort((a, b) => a.line > b.line ? 1 : -1);
        // convert float to percent
        fpyr = fpyr.map((data: any) => {
          data.fpyr = (data.fpyr * 100).toFixed(2);
          return data;
        });
        this.lineYieldRate = fpyr;
        this.isLineYieldRateComparisonLoading = false;
      },
      error: err => {
        this.handleError(err, 'DPM Server error');
        this.isLineYieldRateComparisonLoading = false;
      }
    });
  }

  // repair reason types pie chart
  genRepairMaster(plant, mfgType, modelFilter, trnDateFilter, line, relatedLines) {
    this.byLine = true;
    this.isPieYieldRateComparisonLoading = true;
    this.pieYieldRate = [];
    // group by reasonType
    const filter = {
      where: {
        plant: plant,
        mfgType: mfgType,
        model: modelFilter,
        line: relatedLines,
        trnDate: trnDateFilter,
      },
      group: ['reasonType']
    }
    this.repairMasterService.find(filter).subscribe({
      next: data => {
        this.pieYieldRate = data.map((data: any) => {
          return {
            name: data.reasonType,
            value: data.qty,
            plant: plant,
            mfgType: mfgType,
            line: line,
            relatedLines: relatedLines,
            model: modelFilter,
            trnDate: trnDateFilter
          };
        });
        this.pieYieldRate.slice();
        this.isPieYieldRateComparisonLoading = false;
      },
      error: err => {
        this.handleError(err, 'DPM Server error');
        this.isPieYieldRateComparisonLoading = false;
      }
    });
  }
  // get DPM URL
  getDpmUrl(plantId: string, mfgType: string) {
    this.isDpmUrlLoading = true;
    try {
      const dpmLinkUrl = JSON.parse(localStorage.getItem('dpmIssueUrl'));
      for (const key in dpmLinkUrl) {
        if (key === plantId) {
          const plantLink = dpmLinkUrl[key];
          for (const mfgKey in plantLink) {
            if (mfgKey === mfgType) {
              this.isDpmUrlLoading = false;
              return dpmLinkUrl[key][mfgKey];
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      this.messageService.error('Failed to get DPM URL');
      this.isDpmUrlLoading = false;
    }
  }

  disabledDate(current) {
    return current.getTime() + 24 * 60 * 60 * 1000 > Date.now();
  }

  sortByTrnDate(data) {
    data.sort((a, b) => {
      if (a.trnDate < b.trnDate) {
        return -1;
      } else if (a.trnDate > b.trnDate) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  getModels(plantId: string, mfgType: string, modelFamily: string) {
    if (!plantId) {
      this.models = [];
      return;
    }
    this.dpmService.setBaseUrl(plantId);
    this.isModelLoading = true;
    const filter = {
      where: {
        plant: plantId,
        mfgType: mfgType ? mfgType : undefined,
        modelFamily: modelFamily ? modelFamily : undefined
      },
      group: ['model']
    };
    this.fpyrService.find(filter).subscribe({
      next: data => this.models = data.map(x => x['model']).sort(),
      error: err => {
        this.handleError(err, 'DPM Server error,Failed to get model list');
        this.isModelLoading = false;
      },
      complete: () => this.isModelLoading = false
    });
  }

  getDates(startDate, endDate): string[] {
    let result = [];
    while (moment(endDate).diff(moment(startDate), 'day') >= 0) {
      result.push(moment(startDate).format('YYYY-MM-DD'));
      startDate = moment(startDate).add(1, 'days');
    };
    return result;
  }

  resetLoading() {
    this.isWeightedMovingAvgLoading = false;
    this.isModelFpyrQualifieldRateLoading = false;
    this.isLineYieldRateComparisonLoading = false;
    this.isPieYieldRateComparisonLoading = false;
    this.isDpmUrlLoading = false;
    this.isModelLoading = false;
  }

  handleError(err, title: string) {
    if (err === 'Server error') {
      this.messageService.error(`${title}: Unable to connect to server`);
    } else {
      this.messageService.error(`${title}: ${err.message}`);
    }
    this.resetLoading();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
