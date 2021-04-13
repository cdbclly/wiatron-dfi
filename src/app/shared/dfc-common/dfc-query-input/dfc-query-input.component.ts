import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-dfc-query-input',
  templateUrl: './dfc-query-input.component.html',
  styleUrls: ['./dfc-query-input.component.scss']
})
export class DfcQueryInputComponent implements OnInit {

  @Input() queryStyle: ClsDfcQueryStyle;
  @Input() querySelect: ClsDfcQuerySelect;
  @Input() queryValue;
  @Output() queryValueChange = new EventEmitter();
  @Output() searchSelectChange = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  changeSelect() {
    this.queryValueChange.emit(this.queryValue);
  }

  searchSelect(event) {
    this.searchSelectChange.emit(event);
  }

  // 獲取Content Style
  getContentStyle(parentDom, brotherDom) {
    if (brotherDom.clientWidth < 100) {
      return { 'width': (parentDom.clientWidth - 100) };
    } else {
      return { 'width': (parentDom.clientWidth - brotherDom.clientWidth) };
    }
  }
}

export class ClsDfcQueryStyle {
  type: string; // 记录是那种模式 input, select
  style: {}; // 传过来的宽度 或者其他修改的style
  divStyle?: {}; // 傳過來的 外層 div寬度
  red: boolean; // 是否为必填
  label: string; // label值
  // 以下为 select 特有的属性
  selectType?: string; // 记录select的类型, select 時必選 , 可选 muilt, 2.search(带Loading)
  optionCustom?: boolean; // option 是否 客制化
  optionContent?: any; // option客制化内容
  selectWidth?: {}; // 修改下拉框的宽度
  optionWidth?: {}; // 修改option的宽度
}
export class ClsDfcQuerySelect {
  // 以下为 select 特有的属性
  selectDisabled?: boolean; // select 是否可用
  selectList?: any[]; // 下拉框列表
  optionDisabled?: boolean; // option 是否可用
  isLoading?: boolean; // 是否为 Loading
  searchChange$?; // search动作需要
}
