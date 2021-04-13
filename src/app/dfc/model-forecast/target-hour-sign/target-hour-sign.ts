import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';
import { BehaviorSubject } from 'rxjs';

/**
 * DFC KPI Query時 選項的style
 */
export const DfcSummaryQueryStyle: {
  plant: ClsDfcQueryStyle,
  bu: ClsDfcQueryStyle,
  custom: ClsDfcQueryStyle,
  modelType: ClsDfcQueryStyle,
  proCode: ClsDfcQueryStyle,
  proName: ClsDfcQueryStyle,
  searchUser: ClsDfcQueryStyle
  model: ClsDfcQueryStyle,
  signStage: ClsDfcQueryStyle
} = {
  plant: {
    type: 'select',
    style: {width: '80px'},
    red: true,
    label: '廠別',
    selectType: 'simple'
  },
  bu: {
    type: 'select',
    style: {width: '120px'},
    red: false,
    label: 'BU',
    selectType: 'search'
  },
  custom: {
    type: 'select',
    style: {width: '150px'},
    red: false,
    label: '客戶名',
    selectType: 'search'
  },
  modelType: {
    type: 'select',
    style: {width: '80px'},
    red: false,
    label: '產品',
    selectType: 'simple'
  },
  proCode: {
    type: 'select',
    style: {width: '200px'},
    red: false,
    label: 'Project Code',
    selectType: 'search'
  },
  proName: {
    type: 'select',
    style: {width: '200px'},
    red: false,
    label: 'Project Name',
    selectType: 'search'
  },
  model: {
    type: 'select',
    style: {width: '200px'},
    red: false,
    label: 'Model Name',
    selectType: 'search'
  },
  signStage: {
    type: 'select',
    style: {width: '100px'},
    red: false,
    label: '簽核狀況',
    selectType: 'simple'
  },
  searchUser: {
    type: 'select',
    style: {width: '300px'},
    red: false,
    label: '簽核人員',
    selectType: 'search'
  }
};

/**
 * DFC KPI Query 下拉框設定
 */
export const DfcSummaryQuerySelect: {
  plant: ClsDfcQuerySelect,
  bu: ClsDfcQuerySelect,
  custom: ClsDfcQuerySelect,
  modelType: ClsDfcQuerySelect,
  proCode: ClsDfcQuerySelect,
  proName: ClsDfcQuerySelect,
  searchUser: ClsDfcQuerySelect
  model: ClsDfcQuerySelect,
  signStage: ClsDfcQuerySelect
} = {
  plant: {
    selectList: []
  },
  bu: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
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
  model: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  signStage: {
    selectList: [
      {Value: '', Label: 'ALL'},
      {Value: '-1', Label: '未簽核'},
      {Value: '0', Label: '簽核中'},
      {Value: '1', Label: '已簽核'},
      {Value: '2', Label: '被駁回'}
    ]
  },
  searchUser: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  }
};

/**
 *  DFC Summary 選擇項選擇值 的類
 */
export class ClsDfcSummarySelect {
  plant: string;
  bu: string;
  custom: string;
  modelType: string;
  proCode: string[];
  proName: number[];
  model: number[];
  signStage: string;
  searchUser: string;
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

