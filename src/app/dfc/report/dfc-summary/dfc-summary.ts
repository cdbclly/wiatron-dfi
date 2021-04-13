import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';
import { BehaviorSubject } from 'rxjs';

/**
 * DFC KPI Query時 選項的style
 */
export const DfcSummaryQueryStyle: {
  plant: ClsDfcQueryStyle,
  custom: ClsDfcQueryStyle,
  modelType: ClsDfcQueryStyle,
  proCode: ClsDfcQueryStyle,
  proName: ClsDfcQueryStyle,
  cFlow: ClsDfcQueryStyle,
  model: ClsDfcQueryStyle
} = {
  plant: {
    type: 'select',
    style: { width: '400px' },
    red: true,
    label: '廠別',
    selectType: 'multiple'
  },
  custom: {
    type: 'select',
    style: { width: '150px' },
    red: false,
    label: '客戶',
    selectType: 'search'
  },
  modelType: {
    type: 'select',
    style: { width: '150px' },
    red: false,
    label: '產品別',
    selectType: 'simple'
  },
  proCode: {
    type: 'select',
    style: { width: '200px' },
    red: false,
    label: 'Project Code',
    selectType: 'search'
  },
  proName: {
    type: 'select',
    style: { width: '200px' },
    red: false,
    label: 'Project Name',
    selectType: 'search'
  },
  cFlow: {
    type: 'select',
    style: { width: '400px' },
    red: false,
    label: '當前C階段',
    selectType: 'multiple'
  },
  model: {
    type: 'select',
    style: { width: '200px' },
    red: false,
    label: 'Model Name',
    selectType: 'search'
  }
};

/**
 * DFC workHour的下拉框設定
 */
export const DfcSummaryWorkQuerySelect: {
  plant: ClsDfcQuerySelect,
  custom: ClsDfcQuerySelect,
  modelType: ClsDfcQuerySelect,
  proCode: ClsDfcQuerySelect,
  proName: ClsDfcQuerySelect,
  cFlow: ClsDfcQuerySelect,
  model: ClsDfcQuerySelect
} = {
  plant: {
    selectList: []
  },
  custom: {
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
    searchChange$: new BehaviorSubject('')
  },
  cFlow: {
    selectList: [
      { Value: 'RFQ', Label: 'RFQ' },
      { Value: 'C2', Label: 'C2' },
      { Value: 'C3', Label: 'C3' },
      { Value: 'C4', Label: 'C4' },
      { Value: 'C5', Label: 'C5' },
      { Value: 'C6', Label: 'C6' }
    ],
    searchChange$: new BehaviorSubject('')
  },
  model: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  }
};

/**
 *  DFC Summary 選擇項選擇值 的類
 */
export const DfcSummaryMOHQuerySelect: {
  plant: ClsDfcQuerySelect,
  custom: ClsDfcQuerySelect,
  modelType: ClsDfcQuerySelect,
  proCode: ClsDfcQuerySelect,
  proName: ClsDfcQuerySelect,
  model: ClsDfcQuerySelect
} = {
  plant: {
    selectList: []
  },
  custom: {
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
    searchChange$: new BehaviorSubject('')
  },
  model: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  }
};

/**
 *  DFC Summary 選擇項選擇值 的類
 */
export class ClsDfcSummarySelect {
  plant: string[];
  custom: string;
  modelType: string;
  proCode: string;
  proName: string;
  cFlow: string[];
  model: string;
}

export class ClsDfcSummaryReward {
  status: string; // 標誌為獎勵（green）或者懲罰(red)
  proName: string; // 機種
  cFlow: string; // C流程
  flag: number; // 標誌工時--1/Moh--0
  actual: string; // 實際工時/MOH
  target: string; // 目標工時/MOH
  level?: string; // 獎懲的level
  content: string[]; // 獎懲內容
  members: {}[]; // 人員名單
}


/**
 *  DFC Summary workHour和MOH的切換值
 */
export enum workOrMOH {
  work = 1,
  MOH = 0,
}
