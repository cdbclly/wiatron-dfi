import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DfcWorkhourValidationQuery } from './workhour-validation';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { WorkhourValidationService } from './workhour-validation.service';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-workhour-validation',
  templateUrl: './workhour-validation.component.html',
  styleUrls: ['./workhour-validation.component.scss']
})

export class WorkhourValidationComponent implements OnInit, OnDestroy {

  querySelected = { ...DfcWorkhourValidationQuery };
  typeObjectKeys: Function = Object.keys;
  showTable: boolean = false;
  result = [];
  proCodeList: object = {};
  proCode: string[] = [];

  MOHModalDatas = {};
  workHourModalDatas = {};

  showClassTag = {};

  isQueryLoading = false;

  saveTag = {};

  isEditable = {};

  DataBeforeEdit: any = {};

  widthConfig = ['80px', '80px', '80px', '150px', '150px', '80px', '100px', '100px',
    '120px', '120px', '200px', '100px', '120px', '120px', '200px', '100px', '105px'];
  scrollConfig = { x: '2005px', y: '500px' };
  destroy$ = new Subject();
  trans: Object = {};
  constructor(
    private selectApi: DfcSelectNewService,
    private message: NzMessageService,
    private whvService: WorkhourValidationService,
    private activateRoute: ActivatedRoute,
    private translate: TranslateService) {
  }

  ngOnInit() {
    // 初始化I18N;
    this.translate.get(['report.dfc-kpi-compliance-status', 'dfq.dfq-plant', 'dfq.dfq-cflow', 'dfq.dfq-customer', 'dfq.dfq-product', 'dfc.analysis-not-up-to-standard', 'dfc.response-timeout', 'report.select-all', 'dfc.no-empty']).subscribe(res => {
      this.querySelected.plant.style.label = res['dfq.dfq-plant'];
      this.querySelected.customer.style.label = res['dfq.dfq-customer'];
      this.querySelected.product.style.label = res['dfq.dfq-product'];
      this.querySelected.status.style.label = res['report.dfc-kpi-compliance-status'];
      this.querySelected.cFlow.style.label = res['dfq.dfq-cflow'];
      this.trans['ustandard'] = res['dfc.analysis-not-up-to-standard'];
      this.trans['responseTimeout'] = res['dfc.response-timeout'];
      this.trans['selectAll'] = res['report.select-all'];
      this.trans['noempty'] = res['dfc.no-empty'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['report.dfc-kpi-compliance-status', 'dfq.dfq-plant', 'dfq.dfq-cflow', 'dfq.dfq-customer', 'dfq.dfq-product', 'dfc.analysis-not-up-to-standard', 'dfc.response-timeout', 'report.select-all', 'dfc.no-empty']).subscribe(res => {
        this.querySelected.plant.style.label = res['dfq.dfq-plant'];
        this.querySelected.customer.style.label = res['dfq.dfq-customer'];
        this.querySelected.product.style.label = res['dfq.dfq-product'];
        this.querySelected.status.style.label = res['report.dfc-kpi-compliance-status'];
        this.querySelected.cFlow.style.label = res['dfq.dfq-cflow'];
        this.trans['ustandard'] = res['dfc.analysis-not-up-to-standard'];
        this.trans['responseTimeout'] = res['dfc.response-timeout'];
        this.trans['selectAll'] = res['report.select-all'];
        this.trans['noempty'] = res['dfc.no-empty'];
      });
    });
    this.init();
    this.activateRoute.params.subscribe(param => {
      if (param.stageId) {
        let oneResult = this.whvService.getDataByOneId(param.stageId);
        oneResult.then(data => {
          this.result.push(data);
          this.initTag(this.result.length);
          this.showTable = true;
        });
      }
    });
  }

  init(): void {
    this.selectApi.getProductType().subscribe(data => this.querySelected.product.select.selectList = data);
    this.selectApi.getPlant().subscribe(data => this.querySelected.plant.select.selectList = data);
    this.plantSelected();
    this.buSelected();
    this.customerSelected();
    this.productTypeSelected();
    this.proNameSelected();
    this.proNameSearch();
    this.modelNameSelected();
    this.proCodeSelected();
  }

  plantSelected(): void {
    const change = (plant?) => {
      return of(plant);
    };
    const change$: Observable<string> = this.querySelected.plant.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(change));
    change$.subscribe(datas => {
      this.querySelected.bu.value = '';
      this.querySelected.customer.value = '';
      this.querySelected.proName.value = [];
      this.querySelected.proCode.value = [];
      this.querySelected.modelName.value = [];
      if (!!datas) {
        this.plantSelectedDeal(datas);
      } else {
        this.querySelected.bu.select.selectList = [];
        this.querySelected.customer.select.selectList = [];
        this.querySelected.proName.select.selectList = [];
        this.querySelected.proCode.select.selectList = [];
        this.querySelected.modelName.select.selectList = [];
      }
    });
  }

  plantSelectedDeal(data): void {
    this.selectApi.getBU(data).subscribe(data => {
      this.querySelected.bu.select.selectList = data;
    });
    this.selectApi.getCustom(
      data,
      this.querySelected.bu.value
    ).subscribe(data => {
      this.querySelected.customer.select.selectList = data;
    });
    let tag = !this.arrayDeal(this.querySelected.product.value);
    if (tag) {
      this.selectApi.getProName(
        data,
        this.querySelected.bu.value,
        this.querySelected.customer.value,
        ''
      ).subscribe(data => {
        this.querySelected.proName.select.selectList = data.proName;
        this.proCodeList = data.proCode;
      });
    } else {
      this.proCodeList = {};
      this.querySelected.proName.select.selectList = [];
      this.querySelected.product.value.forEach(element => {
        this.selectApi.getProName(
          data,
          this.querySelected.bu.value,
          this.querySelected.customer.value,
          element
        ).subscribe(data => {
          this.querySelected.proName.select.selectList.push.apply(
            this.querySelected.proName.select.selectList,
            data.proName);
          Object.assign(this.proCodeList, data.proCode);
        });
      });
    }
  }

  buSelected(): void {
    const change = (bu?) => {
      return of(bu);
    };
    const change$: Observable<string> = this.querySelected.bu.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(change));
    change$.subscribe(data => {
      this.querySelected.customer.value = '';
      this.querySelected.proCode.value = [];
      this.querySelected.proName.value = [];
      this.querySelected.modelName.value = [];
      this.querySelected.proCode.select.selectList = [];
      if (!!data && !!this.querySelected.plant.value) {
        this.buSelectedDeal(data);
      } else if (!data && !!this.querySelected.plant.value) {
        this.buSelectedDeal('');
      } else {
        this.querySelected.proName.select.selectList = [];
        this.querySelected.customer.select.selectList = [];
        this.querySelected.modelName.select.selectList = [];
      }
    });
  }

  buSelectedDeal(data): void {
    this.selectApi.getCustom(
      this.querySelected.plant.value,
      data
    ).subscribe(list => {
      this.querySelected.customer.select.selectList = list;
    });
    if (!this.arrayDeal(this.querySelected.product.value)) {
      this.selectApi.getProName(
        this.querySelected.plant.value,
        data,
        this.querySelected.customer.value
      ).subscribe(data => {
        this.querySelected.proName.select.selectList = data.proName;
        this.proCodeList = data.proCode;
      });
    } else {
      this.proCodeList = {};
      this.querySelected.proName.select.selectList = [];
      this.querySelected.product.value.forEach(element => {
        this.selectApi.getProName(
          this.querySelected.plant.value,
          data,
          this.querySelected.customer.value,
          element
        ).subscribe(data => {
          this.querySelected.proName.select.selectList.push.apply(
            this.querySelected.proName.select.selectList,
            data.proName);
          Object.assign(this.proCodeList, data.proCode);
        });
      });
    }
  }

  customerSelected(): void {
    const change = (customer?) => {
      return of(customer);
    };
    const change$: Observable<string> = this.querySelected.customer.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(change));
    change$.subscribe(data => {
      if (!!this.querySelected.plant.value) {
        let tag = !this.arrayDeal(this.querySelected.product.value);
        if (tag) {
          this.selectApi.getProName(
            this.querySelected.plant.value,
            this.querySelected.bu.value,
            this.querySelected.customer.value
          ).subscribe(data => {
            this.querySelected.proName.select.selectList = data.proName;
            this.proCodeList = data.proCode;
          });
        } else {
          this.proCodeList = {};
          this.querySelected.product.value.forEach(element => {
            this.selectApi.getProName(
              this.querySelected.plant.value,
              this.querySelected.bu.value,
              data,
              element
            ).subscribe(data => {
              this.querySelected.proName.select.selectList.push.apply(
                this.querySelected.proName.select.selectList,
                data.proName);
              Object.assign(this.proCodeList, data.proCode);
            });
          });
        }
      }
      this.querySelected.proCode.value = [];
      this.querySelected.proName.value = [];
      this.querySelected.modelName.value = [];
    });
  }

  productTypeSelected(): void {
    const change = (productItem?) => {
      return of(productItem);
    };
    const change$: Observable<string[]> = this.querySelected.product.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(change));
    change$.subscribe(data => {
      this.querySelected.proName.select.selectList = [];
      this.querySelected.proCode.select.selectList = [];
      this.querySelected.modelName.select.selectList = [];
      let isArray = Array.isArray(data);
      let tmp = [''];
      if (isArray) {
        tmp = Array.from(data);
        if (!this.arrayDeal(tmp)) {
          tmp = [''];
        }
      }
      if (!this.querySelected.plant.value) {
        tmp = [];
      }
      this.productTypeSelectedDeal(tmp);
      this.querySelected.proCode.value = [];
      this.querySelected.proName.value = [];
      this.querySelected.modelName.value = [];
    });
  }

  productTypeSelectedDeal(arr): void {
    this.proCodeList = {};
    arr.forEach(element => {
      this.selectApi.getProName(
        this.querySelected.plant.value,
        this.querySelected.bu.value,
        this.querySelected.customer.value,
        element
        , '', true
      ).subscribe(list => {
        this.querySelected.proName.select.selectList.push.apply(
          this.querySelected.proName.select.selectList, list.proName);
        Object.assign(this.proCodeList, list.proCode);
      });
    });
  }

  proNameSelected(): void {
    const change = (proName?) => {
      return of(proName);
    };
    const change$: Observable<string[]> = this.querySelected.proName.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(change));
    change$.subscribe(data => {
      this.querySelected.modelName.value = [];
      this.querySelected.proCode.value = [];
      let isArray = Array.isArray(data);
      if (isArray && !!this.querySelected.plant.value) {
        let tmp = Array.from(data);
        this.arrayDeal(tmp);
        this.proCode = [];
        let ids = [];
        tmp.forEach(element => {
          this.proCode.push(this.proCodeList[element]);
          ids.push(element);
        });
        this.whvService.getModelName(ids).subscribe(data => {
          let list = [];
          data.forEach(e => {
            list.push({
              Value: e['modelName'],
              Label: e['modelName']
            });
          });
          this.querySelected.modelName.select.selectList = list;
        })
        this.querySelected.proCode.select.selectList = this.proCode;
      }
    });
  }
  proNameSearch(): void {
    const searchProNameList = (pName?) => {
      return of(pName);
    };
    const searchProNameList$: Observable<string[]> = this.querySelected.proName.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchProNameList));
    searchProNameList$.subscribe(data => {
      let isArray = Array.isArray(this.querySelected.product.value);
      let tmp = [''];
      if (isArray) {
        tmp = Array.from(this.querySelected.product.value);
        if (!this.arrayDeal(tmp)) {
          tmp = [''];
        }
      }
      if (!this.querySelected.plant.value) {
        tmp = [];
      }
      this.querySelected.proName.select.selectList = [];
      tmp.forEach(item => {
        this.selectApi.getProName(
          this.querySelected.plant.value,
          this.querySelected.bu.value,
          this.querySelected.customer.value,
          item,
          data,
          true
        ).subscribe(list => {
          this.querySelected.proName.select.selectList.push.apply(
            this.querySelected.proName.select.selectList, list.proName);
          Object.assign(this.proCodeList, list.proCode);
        });
      });
    });
  }

  proCodeSelected(): void {
    const change = (proCode?) => {
      return of(proCode);
    };
    const change$: Observable<string[]> = this.querySelected.proCode.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(change));
    change$.subscribe(data => {
    });
  }

  modelNameSelected() {
    const change = (mName?) => {
      return of(mName);
    };
    const change$: Observable<string[]> = this.querySelected.modelName.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(change));
    change$.subscribe(data => {
      this.arrayDeal(data);
      this.querySelected.modelName.value = data;
    });
  }

  async query() {
    this.MOHModalDatas = {};
    this.workHourModalDatas = {};
    this.result = [];
    this.arrayDeal(this.querySelected.cFlow.value);
    const obj = {
      plant: this.querySelected.plant.value,
      bu: this.querySelected.bu.value,
      customer: this.querySelected.customer.value,
      product: this.querySelected.product.value,
      status: this.querySelected.status.value,
      proName: this.querySelected.proName.value,
      proCode: this.querySelected.proCode.value,
      modelName: this.querySelected.modelName.value,
      cFlow: this.querySelected.cFlow.value
    };
    if (!obj.plant) {
      this.message.create('error', this.trans['selectAll']);
      this.querySelected.product.value = [];
      this.querySelected.bu.value = '';
      this.querySelected.plant.value = '';
      this.querySelected.customer.value = '';
      this.querySelected.proName.value = [];
      this.querySelected.proCode.value = [];
      this.querySelected.cFlow.value = [];
      this.querySelected.modelName.value = [];
      return;
    }
    this.isQueryLoading = true;
    this.result = await this.whvService.getData(obj);
    this.initTag(this.result.length);
    this.isQueryLoading = false;
    this.showTable = true;
  }

  async save(stageID, saveId, editId) {
    for (let i = 0; i < this.result.length; ++i) {
      if (this.result[i].StageID === stageID) {
        console.log(this.result[i]);
        if (!(typeof this.result[i].FactoryActualMOH === 'number') ||
          !(typeof this.result[i].FactoryActualOperationTime === 'number')) {
          this.message.create('error', 'Factory Actual' + this.trans['noempty']);
          return;
        }
        let month = Number.parseInt(this.result[i].Month);
        if (!(typeof month === 'number' && !Number.isNaN(month))) {
          this.message.create('error', 'Month' + this.trans['noempty']);
          return;
        }
        this.result[i].Month = month;
        this.saveTag[saveId] = true;
        let s1 = await this.whvService.updateDataValidation(this.result[i]);
        let s2 = await this.whvService.upsertMOHGap(this.result[i]);
        let s3 = await this.whvService.upsertOperaTionGapTime(this.result[i]);
        this.saveTag[saveId] = false;
        this.isEditable[editId] = false;
        this.showClassTag['MOH' + i] = true;
        this.showClassTag['WH' + i] = true;
        delete this.DataBeforeEdit.stageID;
        break;
      }
    }
  }

  download() {
    this.message.create('warning', this.trans['responseTimeout']);
    setTimeout(() => {
      let headers = {
        A1: { v: '廠別' }, B1: { v: '客户名' }, C1: { v: '產品' }, D1: { v: 'Project Code' }, E1: { v: 'Project Name' },
        F1: { v: 'C階段' }, G1: { v: '月份' }, H1: { v: 'MOH(USD)' }, L1: { v: '工时(S) Working Hours' }, P1: { v: '驗證達標' },
        H2: { v: '工廠實際' }, I2: { v: '當前設計' }, J2: { v: 'Gap(%)' }, K2: { v: 'Gap分析' },
        L2: { v: '工廠實際' }, M2: { v: '當前設計' }, N2: { v: 'Gap(%)' }, O2: { v: 'Gap分析' },
      };
      let merges = [
        { s: { c: 0, r: 0 }, e: { c: 0, r: 1 } }, { s: { c: 1, r: 0 }, e: { c: 1, r: 1 } },
        { s: { c: 2, r: 0 }, e: { c: 2, r: 1 } }, { s: { c: 3, r: 0 }, e: { c: 3, r: 1 } },
        { s: { c: 4, r: 0 }, e: { c: 4, r: 1 } }, { s: { c: 5, r: 0 }, e: { c: 5, r: 1 } },
        { s: { c: 6, r: 0 }, e: { c: 6, r: 1 } }, { s: { c: 7, r: 0 }, e: { c: 10, r: 0 } },
        { s: { c: 11, r: 0 }, e: { c: 14, r: 0 } }, { s: { c: 15, r: 0 }, e: { c: 15, r: 1 } },
        { s: { c: 7, r: 1 }, e: { c: 7, r: 1 } }, { s: { c: 8, r: 1 }, e: { c: 8, r: 1 } },
        { s: { c: 9, r: 1 }, e: { c: 9, r: 1 } }, { s: { c: 10, r: 1 }, e: { c: 10, r: 1 } },
        { s: { c: 11, r: 1 }, e: { c: 11, r: 1 } }, { s: { c: 12, r: 1 }, e: { c: 12, r: 1 } },
        { s: { c: 13, r: 1 }, e: { c: 13, r: 1 } }, { s: { c: 14, r: 1 }, e: { c: 14, r: 1 } },
      ];
      let data = {};
      let i = 3;
      this.result.forEach(item => {
        let MOHGapsdata = '';
        if (item.MOHGaps) {
          let k = 1;
          item.MOHGaps.forEach(e => {
            MOHGapsdata = MOHGapsdata + 'Gap-' + k + ':' + e.DifferenceValue + ';' + e.Reason + ';' + e.Countermeasure + ';';
            ++k;
          })
        }
        let operationTimeGapsData = '';
        if (item.OperationTimeGaps) {
          let k = 1;
          item.OperationTimeGaps.forEach(e => {
            operationTimeGapsData = operationTimeGapsData + 'Gap-' + k + ':' + e.DifferenceValue + ';' + e.Reason + ';' + e.Countermeasure + ';';
            k++;
          });
        }
        let mohCS = item.StageMOHError || item.StageMOH;
        let tmp = {
          ['A' + i]: { v: item.StageInfo.Plant }, ['B' + i]: { v: item.StageInfo.Customer }, ['C' + i]: { v: item.StageInfo.ModelType },
          ['D' + i]: { v: item.StageInfo.ProjectCode }, ['E' + i]: { v: item.StageInfo.ProjectName }, ['F' + i]: { v: item.StageInfo.Stage },
          ['G' + i]: { v: item.Month || '' }, ['H' + i]: { v: item.FactoryActualMOH || '' }, ['I' + i]: { v: mohCS }, ['J' + i]: { v: item.standard.MOHRatio },
          ['K' + i]: { v: MOHGapsdata }, ['L' + i]: { v: item.FactoryActualOperationTime || '' }, ['M' + i]: { v: item.totalStageOperationTime },
          ['N' + i]: { v: item.standard.workHourRadio }, ['O' + i]: { v: operationTimeGapsData }, ['P' + i]: { v: item.standard.isReached }
        }
        data = Object.assign({}, data, tmp);
        i++;
      });
      let ref = 'A1:PZ' + i;
      let output = Object.assign({}, headers, data);
      let wb = {
        SheetNames: ['mySheet'],
        Sheets: {
          mySheet: Object.assign({}, output, { '!ref': ref, '!merges': merges })
        }
      };
      XLSX.writeFile(wb, 'table.xlsx');
    }, 400);
  }

  isShowMOHModal(stageID) {
    this.MOHModalDatas[stageID + ''] = [];
    this.result.forEach(e => {
      if (e.StageID == stageID) {
        if (e.isMOHVisible) {
          e.isMOHVisible = false;
        } else {
          if (!e['MOHGaps'] || e['MOHGaps'].length <= 0) {
            this.addMOHItem(stageID);
          } else {
            e['MOHGaps'].forEach(element => {
              this.MOHModalDatas[stageID + ''].push(Object.assign({}, element));
            });
          }
          e.isMOHVisible = true;
        }
      }
    })
  }

  confirmMOH(stageID) {
    this.result.forEach(e => {
      if (e.StageID == stageID) {
        let tag = true;
        for (let i = 0; i < this.MOHModalDatas[stageID].length; ++i) {
          if (!this.analysisCompute()) {
            document.getElementById('MOH' + i).style.border = '1px red solid';
            this.message.create('error', this.trans['ustandard']);
            tag = false;
            break;
          } else {
            document.getElementById('MOH' + i).style.border = '1px rgba(96,96,96,0.26) solid';
          }
        }
        if (tag) {
          e.MOHGaps = this.MOHModalDatas[stageID];
          e.isMOHVisible = false;
        }

      }
    });
  }

  addMOHItem(stageID) {
    let data = {
      StageID: stageID,
      DifferenceValue: '',
      Reason: '',
      Countermeasure: ''
    }
    this.MOHModalDatas[stageID].push(data);
  }

  isShowWorkHourModal(stageID) {
    this.workHourModalDatas[stageID + ''] = [];
    this.result.forEach(e => {
      if (e.StageID == stageID) {
        if (e.isWorkHourVisible) {
          e.isWorkHourVisible = false;
        }
        else {
          if (!e['OperationTimeGaps'] || e['OperationTimeGaps'].length <= 0) {
            this.addWorkHourItem(stageID);
          } else {
            e['OperationTimeGaps'].forEach(element => {
              this.workHourModalDatas[stageID + ''].push(Object.assign({}, element));
            });
          }
          e.isWorkHourVisible = true;
        }
      }
    })
  }

  confirmWorkHour(stageID) {
    this.result.forEach(e => {
      if (e.StageID == stageID) {
        let tag = true;
        for (let i = 0; i < this.workHourModalDatas[stageID].length; ++i) {
          if (!this.analysisCompute()) {
            document.getElementById('WH' + i).style.border = '1px red solid';
            this.message.create('error', this.trans['ustandard']);
            tag = false;
            break;
          } else {
            document.getElementById('WH' + i).style.border = '1px rgba(96,96,96,0.26) solid';
          }
        }
        if (tag) {
          e.OperationTimeGaps = this.workHourModalDatas[stageID];
          e.isWorkHourVisible = false;
        }
      }
    });
  }

  addWorkHourItem(stageID) {
    let data = {
      StageID: stageID,
      DifferenceValue: '',
      Reason: '',
      Countermeasure: ''
    }
    this.workHourModalDatas[stageID].push(data);
  }

  actualTimeBlur(stageID) {
    this.result.forEach(e => {
      if (e.StageID == stageID) {
        let result = this.whvService.isReachedStandard(e['StageMOH'], e['totalStageOperationTime'],
          e['FactoryActualMOH'], e['FactoryActualOperationTime']);
        e.standard = result;
      }
    });
  }

  /**
   * @author Buck Yang
   * @param arr {string[]}
   * @description it is used to deal a plugin's error that just work for array of string
   */
  arrayDeal(arr: string[]): boolean {
    for (let i = 0; i < arr.length; ++i) {
      if (!arr[i].trim()) {
        for (let j = i; j < arr.length - 1; ++j) {
          arr[j] = arr[j + 1];
        }
        i--;
        arr.pop();
      }
    }
    return arr.length > 0;
  }

  initTag(len: number) {
    for (let i = 0; i < len; ++i) {
      this.showClassTag['MOH' + i] = true;
      this.showClassTag['WH' + i] = true;
      this.saveTag['save' + i] = false;
      this.isEditable['edit' + i] = false;
    }
  }

  analysisCompute(): boolean {
    return true;
  }

  editableStatus(i, stageId) {
    if (this.isEditable['edit' + i]) {
      this.recoverCancelEdit(stageId);
      this.isEditable['edit' + i] = false;
      this.showClassTag['MOH' + i] = true;
      this.showClassTag['WH' + i] = true;
    } else {
      this.isEditable['edit' + i] = true;
      this.saveDataBeforeEdit(stageId);
      this.saveTag['save' + i] = false;
      this.showClassTag['MOH' + i] = false;
      this.showClassTag['WH' + i] = false;
    }
  }

  saveDataBeforeEdit(stageId) {
    this.result.forEach(e => {
      if (e.StageID == stageId) {
        let tmp = {
          Month: e.Month,
          FactoryActualMOH: e.FactoryActualMOH,
          FactoryActualOperationTime: e.FactoryActualOperationTime,
          MOHGaps: e.MOHGaps,
          OperationTimeGaps: e.OperationTimeGaps
        }
        this.DataBeforeEdit.stageId = tmp;
      }
    });
  }

  recoverCancelEdit(stageId) {
    this.result.forEach(e => {
      if (e.StageID == stageId) {
        const tmp = this.DataBeforeEdit.stageId;
        e.FactoryActualMOH = tmp.FactoryActualMOH;
        e.FactoryActualOperationTime = tmp.FactoryActualOperationTime;
        e.MOHGaps = tmp.MOHGaps;
        e.OperationTimeGaps = tmp.OperationTimeGaps;
        e.Month = tmp.Month;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

