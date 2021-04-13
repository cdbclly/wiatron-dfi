import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';
import { BehaviorSubject } from 'rxjs';

/**
 * DFC KPI Query時 選項的style
 */
export const DfcKpiQueryStyle: {
  plant: ClsDfcQueryStyle,
  custom: ClsDfcQueryStyle,
  modelType: ClsDfcQueryStyle,
  Process: ClsDfcQueryStyle,
  proCode: ClsDfcQueryStyle,
  modelName: ClsDfcQueryStyle,
  proName: ClsDfcQueryStyle,
  cFlow: ClsDfcQueryStyle
} = {
  plant: {
    type: 'select',
    style: { width: '80px', margin: '10px 0 0 0' },
    red: true,
    label: '廠別',
    selectType: 'simple'
  },
  custom: {
    type: 'select',
    style: { width: '120px', margin: '10px 0 0 0' },
    red: true,
    label: '客戶名',
    selectType: 'search'
  },
  modelType: {
    type: 'select',
    style: { width: '80px', margin: '10px 0 0 0' },
    red: true,
    label: '產品',
    selectType: 'simple'
  },
  Process: {
    type: 'select',
    style: { width: '150px', margin: '10px 0 0 0' },
    red: false,
    label: '製程',
    selectType: 'simple'
  },
  proCode: {
    type: 'select',
    style: { width: '200px', margin: '10px 0 0 0' },
    red: true,
    label: 'Project Code',
    selectType: 'search'
  },
  modelName: {
    type: 'select',
    style: { width: '200px', margin: '10px 0 0 0' },
    red: true,
    label: 'Model Name',
    selectType: 'search'
  },
  proName: {
    type: 'select',
    style: { width: '200px', margin: '10px 0 0 0' },
    red: true,
    label: 'Project Name',
    selectType: 'search'
  },
  cFlow: {
    type: 'select',
    style: { width: '400px', margin: '10px 0 0 0' },
    red: true,
    label: 'C流程',
    selectType: 'multiple'
  }
};

/**
 * DFC KPI Query 下拉框設定
 */
export const DfcKpiQuerySelect: {
  plant: ClsDfcQuerySelect,
  custom: ClsDfcQuerySelect,
  modelType: ClsDfcQuerySelect,
  Process: ClsDfcQuerySelect,
  proCode: ClsDfcQuerySelect,
  modelName: ClsDfcQuerySelect,
  proName: ClsDfcQuerySelect,
  cFlow: ClsDfcQuerySelect
} = {
  plant: {
    selectList: []
  },
  custom: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  modelType: {
    selectList: [],
    selectDisabled: true
  },
  Process: {
    selectList: []
  },
  proCode: {
    selectList: [],
    searchChange$: new BehaviorSubject(''),
    selectDisabled: true
  },
  modelName: {
    selectList: [],
    searchChange$: new BehaviorSubject(''),
    selectDisabled: true
  },
  proName: {
    selectList: [],
    searchChange$: new BehaviorSubject(''),
    selectDisabled: true
  },
  cFlow: {
    selectList: [
      { Value: 'C0', Label: 'C0' },
      { Value: 'C1', Label: 'C1' },
      { Value: 'C2', Label: 'C2' },
      { Value: 'C3', Label: 'C3' },
      { Value: 'C4', Label: 'C4' },
      { Value: 'C5', Label: 'C5' },
      { Value: 'C6', Label: 'C6' }
    ],
    searchChange$: new BehaviorSubject(''),
    selectDisabled: true
  }
};
/**
 *  DFC KPI 選擇項選擇值 的類
 */
export class ClsDfcKpiSelect {
  plant: string;
  custom: string;
  modelType: string;
  Process: string;
  proCode: string[];
  modelName: number;
  proName: string[];
  cFlow: string[];
}

