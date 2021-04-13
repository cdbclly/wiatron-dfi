import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';
import { BehaviorSubject } from 'rxjs';

/**
 * DFC KPI Query時 選項的style
 */
export const DfcTargetQueryStyle: {
  plant: ClsDfcQueryStyle,
  custom: ClsDfcQueryStyle,
  modelType: ClsDfcQueryStyle,
  proCode: ClsDfcQueryStyle,
  proName: ClsDfcQueryStyle,
  cFlow: ClsDfcQueryStyle
} = {
  plant: {
    type: 'select',
    style: { width: '100%' },
    red: true,
    label: '廠別',
    selectType: 'simple'
  },
  custom: {
    type: 'select',
    style: { width: '100%' },
    red: false,
    label: '客戶',
    selectType: 'search'
  },
  modelType: {
    type: 'select',
    style: { width: '100%' },
    red: false,
    label: '產品別',
    selectType: 'simple'
  },
  proCode: {
    type: 'select',
    style: { width: '100%' },
    red: false,
    label: 'Project Code',
    selectType: 'search'
  },
  proName: {
    type: 'select',
    style: { width: '100%' },
    red: false,
    label: 'Project Name',
    selectType: 'search'
  },
  cFlow: {
    type: 'select',
    style: { width: '100%' },
    red: false,
    label: '當前C階段',
    selectType: 'multiple'
  }
};

/**
 * DFC KPI Query 下拉框設定
 */
export const DfcTargetQuerySelect: {
  plant: ClsDfcQuerySelect,
  custom: ClsDfcQuerySelect,
  modelType: ClsDfcQuerySelect,
  proCode: ClsDfcQuerySelect,
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
    selectList: []
  },
  proCode: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  proName: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  cFlow: {
    selectList: [
      { Value: 'RFQ', Label: 'RFQ' }
    ],
    searchChange$: new BehaviorSubject('')
  }
};

/**
 *  DFC Summary 選擇項選擇值 的類
 */
export class ClsDfcTargetSelect {
  plant: string;
  custom: string;
  modelType: string;
  proCode: string;
  proName: string;
  cFlow: string[];
}


