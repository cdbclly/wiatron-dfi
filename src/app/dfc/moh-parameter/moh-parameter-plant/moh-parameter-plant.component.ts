import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';
import { MohParameterService, DfcMOHParamMapping } from '../moh-parameter.service';
import { NzMessageService } from 'ng-zorro-antd';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-moh-parameter-plant',
  templateUrl: './moh-parameter-plant.component.html',
  styleUrls: ['./moh-parameter-plant.component.scss']
})
export class MohParameterPlantComponent implements OnInit, OnDestroy {

  @Input() nzScrollY;

  // 下拉框類設定
  querySelect: {
    style: ClsDfcQueryStyle,
    value: string,
    select: ClsDfcQuerySelect
  } = {
      style: {
        type: 'select',
        style: { width: '200px', margin: '10px 0 0 0' },
        red: true,
        label: '廠別',
        selectType: 'simple'
      },
      value: '',
      select: {
        selectList: []
      }
    };
  queryBUSelect: {
    style: ClsDfcQueryStyle,
    value: string,
    select: ClsDfcQuerySelect
  } = {
      style: {
        type: 'select',
        style: { width: '200px', margin: '10px 0 0 0' },
        red: false,
        label: 'BU',
        selectType: 'search'
      },
      value: '',
      select: {
        selectList: [],
        searchChange$: new BehaviorSubject('')
      }
    };

  dataSet;
  editCache; // 表格緩存
  actionEnabled = true;

  dfcMOHParamMapping = DfcMOHParamMapping; // DFC 參數項匹配關係

  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['MOHCondition']; // 页面上的用户权限
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));

  nzScroll = { x: '100%', y: '0px' };
  nzWidthConfig = ['7%', '7%', '67%', '11%', '8%'];

  // I18N
  destroy$ = new Subject();
  trans;
  constructor(
    private mohParameterService: MohParameterService,
    private dfcSelectService: DfcSelectNewService,
    private message: NzMessageService,
    private translate: TranslateService
  ) {
    // 初始化I18N
    this.translate.get(['dfc.dfc-site', 'dfc.must-select-plant']).subscribe(res => {
      this.querySelect.style.label = res['dfc.dfc-site'];
      this.trans = res['dfc.must-select-plant'];
    });
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfc.dfc-site', 'dfc.must-select-plant']).subscribe(res => {
        this.querySelect.style.label = res['dfc.dfc-site'];
        this.trans = res['dfc.must-select-plant'];
      });
    });
  }

  ngOnInit() {
    this.initPlantSelect();
    this.initBUSelect();
    this.nzScroll = { x: '100%', y: this.nzScrollY };
  }

  // 加载时 查询相关厂别
  initPlantSelect() {
    this.querySelect.select.selectList = []; // 清空选择框中的值
    this.dfcSelectService.getPlant().subscribe(data => this.querySelect.select.selectList = data);
    // 对厂别自动带入本厂的标签
    this.querySelect.value = localStorage.getItem('DFC_Plant');
  }

  changePlant() {
    this.queryBUSelect.value = null;
    this.buSearch('');
  }

  // 初始化BU
  initBUSelect() {
    const getBUList = (bu: string) => {
      return this.mohParameterService.getBU(this.querySelect.value, bu).then(datas => {
        return datas;
      });
    };
    const buList$: Observable<string[]> = this.queryBUSelect.select.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getBUList));
    buList$.subscribe(datas => {
      this.queryBUSelect.select.selectList = datas.filter(data => {
        return !(!data);
      });
      this.queryBUSelect.select.isLoading = false;
    });
  }

  buSearch(value: string) {
    this.queryBUSelect.select.isLoading = true;
    this.queryBUSelect.select.searchChange$.next(value);
  }

  async query() {
    if (!this.querySelect.value) {
      this.message.create('error', this.trans);
      return;
    }
    this.dataSet = []; // 清空表格數據
    const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === this.querySelect.value);
    this.mohParameterService.queryPlantParam(this.querySelect.value, plantMap).then(data => {
      this.dataSet = data;
      this.updateEditCache();
    });
  }

  updateEditCache() {
    this.editCache = {}; // 清空缓存数据
    this.dataSet.forEach(item => {
      if (!this.editCache[item.No]) {
        this.editCache[item.No] = {
          edit: false,
          data: { ...item }
        };
      }
    });
  }

  // 厂别 - 表格编辑事件
  startEdit(key: string) {
    this.editCache[key].edit = true;
    this.actionEnabled = false;
  }

  saveEdit(key: string) {
    this.mohParameterService.savePlantParam(this.editCache[key].data, this.dataSet[(parseInt(key, 10) - 1)])
      .then(data => {
        if (data['result'] === 'success') {
          this.message.create('success', 'Saved successfully！');
          this.cancelEdit(key);
          this.dataSet[(parseInt(key, 10) - 1)]['SetValue'] = this.editCache[key].data['SetValue'];
          if (['PCBAType', 'LCMType', 'FAType'].includes(this.editCache[key].data['Type'])) {
            this.dataSet[(parseInt(key, 10) - 1)]['MohParam'] = data['data'][this.editCache[key].data['Type']];
          }
        } else {
          this.message.create('error', 'Save failed！');
          this.cancelEdit(key);
        }
      });
  }

  cancelEdit(key: string) {
    this.editCache[key].edit = false;
    this.actionEnabled = true;
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
