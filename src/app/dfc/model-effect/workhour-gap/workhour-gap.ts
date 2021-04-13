import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';
import { BehaviorSubject } from 'rxjs';


/**
 *  DFC KPI 選擇項選擇值 的類
 */
export class ClsDfcKpiSelect {
  plant: string;
  custom: string;
  modelType: string;
  Process: string;
  proCode: string;
  proName: string;
  cFlow: string;
  kind: string;
}

/**
 * DFC 工時差異對比  廠別, 機種等 下拉框設定
 */
export const DfcWorkhourGapQuery: {
  productType: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string,
    change$?
  },
  process: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string,
    change$?
  },
  kind: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string,
    change$?
  },
  plant: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string,
    change$?
  },
  custom: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string,
    change$?
  },
  proName: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string,
    change$?
  },
  proCode: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string,
    change$?
  },
  model: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string,
    change$?
  },
  cFlow: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string,
    change$?
  }
} = {
  productType: {
    style: {
      type: 'select',
      style: {width: '80px', margin: '10px 0 0 0'},
      red: true,
      label: '產品',
      selectType: 'simple'
    },
    select: {
      selectList: []
    },
    value: '',
    change$: new BehaviorSubject('')
  },
  process: {
    style: {
      type: 'select',
      style: {width: '120px', margin: '10px 0 0 0'},
      red: false,
      label: '製程',
      selectType: 'simple'
    },
    select: {
      selectList: []
    },
    value: '',
    change$: new BehaviorSubject('')
  },
  kind: {
    style: {
      type: 'select',
      style: {width: '80px', margin: '10px 0 0 0'},
      red: false,
      label: '對比類型',
      selectType: 'simple'
    },
    select: {
      selectList: [
        {Value: '物料', Label: '物料'},
        {Value: '動作', Label: '動作'}
      ],
      selectDisabled: true
    },
    value: '',
    change$: new BehaviorSubject('')
  },
  plant: {
    style: {
      type: 'select',
      style: {width: '80px', margin: '10px 0 0 0'},
      red: true,
      label: '廠別',
      selectType: 'simple'
    },
    select: {
      selectList: []
    },
    value: '',
    change$: new BehaviorSubject('')
  },
  custom: {
    style: {
      type: 'select',
      style: {width: '150px', margin: '10px 0 0 0'},
      red: true,
      label: '客戶',
      selectType: 'search'
    },
    select: {
      selectList: [],
      searchChange$: new BehaviorSubject('')
    },
    value: '',
    change$: new BehaviorSubject('')
  },
  proName: {
    style: {
      type: 'select',
      style: {width: '200px', margin: '10px 0 0 0'},
      red: true,
      label: 'Project Name',
      selectType: 'search'
    },
    select: {
      selectList: [],
      searchChange$: new BehaviorSubject('')
    },
    value: '',
    change$: new BehaviorSubject('')
  },
  proCode: {
    style: {
      type: 'select',
      style: {width: '200px', margin: '10px 0 0 0'},
      red: true,
      label: 'Project Code',
      selectType: 'simple'
    },
    select: {
      selectList: [],
      selectDisabled: true
    },
    value: '',
    change$: new BehaviorSubject('')
  },
  model: {
    style: {
      type: 'select',
      style: {width: '200px', margin: '10px 0 0 0'},
      red: true,
      label: 'Model Name',
      selectType: 'search'
    },
    select: {
      selectList: [],
      searchChange$: new BehaviorSubject('')
    },
    value: '',
    change$: new BehaviorSubject('')
  },
  cFlow: {
    style: {
      type: 'select',
      style: {width: '80px', margin: '10px 0 0 0'},
      red: true,
      label: 'C階段',
      selectType: 'simple'
    },
    select: {
      selectList: [
        {Value: 'RFQ', Label: 'RFQ'},
        {Value: 'C0', Label: 'C0'},
        {Value: 'C1', Label: 'C1'},
        {Value: 'C2', Label: 'C2'},
        {Value: 'C3', Label: 'C3'},
        {Value: 'C4', Label: 'C4'},
        {Value: 'C5', Label: 'C5'},
        {Value: 'C6', Label: 'C6'}
      ]
    },
    value: '',
    change$: new BehaviorSubject('')
  }
};
