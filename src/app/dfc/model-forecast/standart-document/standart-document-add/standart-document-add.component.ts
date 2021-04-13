import { Component, OnInit } from '@angular/core';
import { ClsDfcQuerySelect, ClsDfcQueryStyle } from 'app/shared/dfc-common';
@Component({
  selector: 'app-standart-document-add',
  templateUrl: './standart-document-add.component.html',
  styleUrls: ['./standart-document-add.component.scss']
})
export class StandartDocumentAddComponent implements OnInit {

  isAddDataVisible = true;

  // 下拉框類設定
  addStyle: {
    modelType: ClsDfcQueryStyle,
    process: ClsDfcQueryStyle,
    module: ClsDfcQueryStyle,
    material: ClsDfcQueryStyle,
    factor: ClsDfcQueryStyle,
    factorDetail: ClsDfcQueryStyle,
    action: ClsDfcQueryStyle,
    costTime: ClsDfcQueryStyle,
    action2: ClsDfcQueryStyle
  } = {
      modelType: {
        type: 'select',
        style: { width: '100%' },
        red: true,
        label: '產品',
        selectType: 'simple'
      },
      process: {
        type: 'select',
        style: { width: '100%' },
        red: true,
        label: '製程',
        selectType: 'simple'
      },
      module: {
        type: 'select',
        style: { width: '100%' },
        red: true,
        label: '模組',
        selectType: 'search'
      },
      material: {
        type: 'select',
        style: { width: '100%' },
        red: true,
        label: '物料',
        selectType: 'search'
      },
      factor: {
        type: 'select',
        style: { width: '100%' },
        red: true,
        label: '因素',
        selectType: 'search'
      },
      factorDetail: {
        type: 'select',
        style: { width: '100%' },
        red: true,
        label: '因素細項',
        selectType: 'search'
      },
      action: {
        type: 'select',
        style: { width: '100%' },
        red: true,
        label: '動作',
        selectType: 'search'
      },
      costTime: {
        type: 'input',
        style: { width: '100%' },
        red: true,
        label: '工時',
        selectType: 'number'
      },
      action2: {
        type: 'input',
        style: { width: '100%' },
        red: false,
        label: ''
      }
    };
  addSelect: {
    modelType: ClsDfcQuerySelect,
    process: ClsDfcQuerySelect,
    module: ClsDfcQuerySelect,
    material: ClsDfcQuerySelect,
    factor: ClsDfcQuerySelect,
    factorDetail: ClsDfcQuerySelect,
    action: ClsDfcQuerySelect
  } = {
      modelType: { selectList: [] },
      process: { selectList: [] },
      module: { selectList: [] },
      material: { selectList: [] },
      factor: { selectList: [] },
      factorDetail: { selectList: [] },
      action: { selectList: [] }
    };
  addValue = {
    Select: { modelType: '', process: '', module: '', material: '', factor: '', factorDetail: '', action: '', costTime: '' },
    Plus: { module: false, material: false, factor: false, factorDetail: false, action: false },
    PlusValue: { module: '', material: '', factor: '', factorDetail: '', action: '' }
  };

  constructor() { }

  ngOnInit() {
  }

  // 點擊加號
  clickAddPlus(data) {
    this.addValue.Plus[data] = true;
  }

  // 保存加號顯示出來的 input 框
  clickSavePlus(data) {
    this.addValue.Plus[data] = false;
  }

  // 取消新增
  handleAddCancel() {

  }

  // 保存新增內容
  handleAddSave() {

  }

}
