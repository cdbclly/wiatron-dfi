import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DfcSummaryQueryStyle, ClsDfcSummarySelect } from '../dfc-summary';
import { DfcSummaryService } from '../dfc-summary.service';
@Component({
  selector: 'app-summary-moh',
  templateUrl: './summary-moh.component.html',
  styleUrls: ['./summary-moh.component.scss']
})
export class SummaryMOHComponent implements OnInit {
  tablePaging = true;
  queryStyle = DfcSummaryQueryStyle;

  @Input() selectValue: ClsDfcSummarySelect;
  @Input() querySelect: any;
  @Input() dataSet: any[];
  @Input() queryLoading: boolean;
  @Input() tableHeight;
  @Output() mohChangePlant = new EventEmitter();
  @Output() mohChangeCustomAndModelType = new EventEmitter();
  @Output() mohCustomSearch = new EventEmitter();
  @Output() mohChangeProName = new EventEmitter();
  @Output() mohProCodeSearch = new EventEmitter();
  @Output() mohProNameSearch = new EventEmitter();
  @Output() mohModelSearch = new EventEmitter();
  @Output() mohQuery = new EventEmitter();
  @Output() mohDownload = new EventEmitter();

  // 展開表格表頭相關
  c0 = { col: 2, expand: false };
  c1 = { col: 2, expand: false };
  c2 = { col: 2, expand: false };
  c3 = { col: 2, expand: false };
  c4 = { col: 2, expand: false };
  c5 = { col: 2, expand: false };
  c6 = { col: 2, expand: false };
  expandCount = 0;

  // 表格數據相關
  nzScrollRep = { x: '1890px' };
  nzWidthConfig = ['90px', '80px', '100px', '100px', '150px', '150px', '150px', '85px', '120px', '65px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px'];

  constructor(
    private dfcSummaryService: DfcSummaryService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.nzScrollRep['y'] = this.tableHeight + 'px';
    // 初始化i18n;
    this.translate.get(['mrr.mrr-plant', 'mrr.mrr-customer', 'mrr.mrr-product']).subscribe(res => {
      DfcSummaryQueryStyle.plant.label = res['mrr.mrr-plant'];
      DfcSummaryQueryStyle.custom.label = res['mrr.mrr-customer'];
      DfcSummaryQueryStyle.modelType.label = res['mrr.mrr-product'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.mrr-plant', 'mrr.mrr-customer', 'mrr.mrr-product']).subscribe(res => {
        DfcSummaryQueryStyle.plant.label = res['mrr.mrr-plant'];
        DfcSummaryQueryStyle.custom.label = res['mrr.mrr-customer'];
        DfcSummaryQueryStyle.modelType.label = res['mrr.mrr-product'];
      });
    });
  }

  isObjectType(val): boolean {  // 是引用類型為true，基本類型為false
    if ((typeof val) === 'object') {
      return true;
    } else {
      return false;
    }
  }

  // emit event listener
  changePlant(): void {
    this.mohChangePlant.emit(null);
  }

  changeCustomAndModelType(): void {
    this.mohChangeCustomAndModelType.emit(null);
  }

  customSearch(event): void {
    this.mohCustomSearch.emit(event);
  }

  changeProName(event): void {
    this.mohChangeProName.emit(event);
  }

  proCodeSearch(event): void {
    this.mohProCodeSearch.emit(event);
  }

  proNameSearch(event): void {
    this.mohProNameSearch.emit(event);
  }

  modelSearch(event): void {
    this.mohModelSearch.emit(event);
  }

  query(): void {
    this.mohQuery.emit(null);
  }

  download(): void {
    this.tablePaging = false;
    setTimeout(() => {
      this.mohDownload.emit(null);
      this.tablePaging = true;
    }, 300);
  }

  expandColumn(obj: { col: number, expand: boolean }) {
    if (obj.expand) {
      obj.expand = false;
      obj.col = 2;
      this.expandCount--;
    } else {
      obj.expand = true;
      obj.col = 7;
      this.expandCount++;
    }
    this.nzScrollRep.x = (parseInt(this.nzScrollRep.x) + 400 * this.expandCount).toString() + 'px';
  }

  // 判斷是否為 前3項，前3項不顯示
  isColIndex(index): boolean {
    if ([0, 1, 2, 3].includes(index)) {
      return false;
    } else {
      return true;
    }
  }

  isInnerType(index): boolean {
    if (index === 0) {
      return false;
    } else {
      return true;
    }
  }

  nzExpandChange(event, data) {
    if (event) {
      if (data[1].length === 0) {
        this.searchModel(data);
      }
    }
  }

  searchModel(data) {
    this.dfcSummaryService.getGroupChildData(data[3], { type: 'moh' }).then(d => {
      data[1] = d;
    });
  }
}
