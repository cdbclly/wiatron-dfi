import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';
import { BehaviorSubject, Subject } from 'rxjs';

/**
 * DFQ 目標良率生成 Query時 選項的style
 */
export const DfqYrCompareQueryStyle: {

  plant: ClsDfcQueryStyle,
  bu: ClsDfcQueryStyle,
  modelType: ClsDfcQueryStyle,
  proCode: ClsDfcQueryStyle,
  proName: ClsDfcQueryStyle,
  cFlow: ClsDfcQueryStyle,
  similarModel: ClsDfcQueryStyle,
  blankModel: ClsDfcQueryStyle
} = {
  plant: {
    type: 'select',
    style: { width: '75%' },
    red: true,
    label: '廠別',
    selectType: 'simple'
  },
  bu: {
    type: 'select',
    style: { width: '75%' },
    red: false,
    label: 'BU',
    selectType: 'simple'
  },
  modelType: {
    type: 'select',
    style: { width: '75%' },
    red: true,
    label: '產品',
    selectType: 'simple'
  },
  proCode: {
    type: 'select',
    style: { width: '65%' },
    red: true,
    label: 'Project Code',
    selectType: 'simple'
  },
  proName: {
    type: 'select',
    style: { width: '65%' },
    red: true,
    label: 'Project Name',
    selectType: 'search'
  },
  cFlow: {
    type: 'select',
    style: { width: '75%' },
    red: true,
    label: 'C流程',
    selectType: 'simple'
  },
  similarModel: {
    type: 'select',
    style: { width: '100%' },
    red: false,
    label: '相似機種模型',
    selectType: 'simple'
  },
  blankModel: {
    type: 'select',
    style: { width: '100%' },
    red: false,
    label: '空白機種模型',
    selectType: 'simple'
  }
};

/**
 * DFQ 目標良率生成 Query時 下拉框設定
 */
export const DfqYrCompareQuerySelect: {
  plant: ClsDfcQuerySelect,
  bu: ClsDfcQuerySelect,
  modelType: ClsDfcQuerySelect,
  proCode: ClsDfcQuerySelect,
  proName: ClsDfcQuerySelect,
  cFlow: ClsDfcQuerySelect,
  similarModel: ClsDfcQuerySelect,
  blankModel: ClsDfcQuerySelect
} = {
  plant: {
    selectList: []
  },
  bu: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  modelType: {
    selectList: []
  },
  proCode: {
    selectList: [],
    searchChange$: new BehaviorSubject(''),
    selectDisabled: true
  },
  proName: {
    selectList: [],
    searchChange$: new Subject<string>()
  },
  cFlow: {
    selectList: [
      { Value: 'RFQ', Label: 'RFQ' }
    ],
    searchChange$: new BehaviorSubject(''),
    selectDisabled: true
  },
  similarModel: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  blankModel: {
    selectList: [],
    searchChange$: new BehaviorSubject(''),
    selectDisabled: true
  }
};

/**
 *  DFQ 目標良率生成 選擇項選擇值 的類
 */
export class ClsYrCompareSelect {
  plant: string;
  bu: string;
  modelType: string;
  proCode: string;
  proName: string;
  cFlow: string;
  similarModel: string;
  blankModel: string;
}
