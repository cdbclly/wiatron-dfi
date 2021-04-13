import { BehaviorSubject } from 'rxjs';
import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';

/**
 * DFC 军令状 Query時 選項的style
 */
export const DfcMilitaryOrderQueryStyle: {
  plant: ClsDfcQueryStyle,
  bu: ClsDfcQueryStyle,
  custom: ClsDfcQueryStyle,
  modelType: ClsDfcQueryStyle,
  signStatus: ClsDfcQueryStyle,
  proCode: ClsDfcQueryStyle,
  proName: ClsDfcQueryStyle
} = {
  plant: {
    type: 'select',
    style: { width: '80px' },
    red: true,
    label: '廠別',
    selectType: 'simple'
  },
  bu: {
    type: 'select',
    style: { width: '150px' },
    red: false,
    label: 'BU',
    selectType: 'search'
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
    style: { width: '120px' },
    red: false,
    label: '產品別',
    selectType: 'simple'
  },
  signStatus: {
    type: 'select',
    style: { width: '100px' },
    red: false,
    label: '簽核狀況',
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
    style: { width: '300px' },
    red: true,
    label: 'Project Name',
    selectType: 'search'
  }
};

/**
 * DFC 军令状 Query 下拉框設定
 */
export const DfcMilitaryOrderQuerySelect: {
  plant: ClsDfcQuerySelect,
  bu: ClsDfcQuerySelect,
  custom: ClsDfcQuerySelect,
  modelType: ClsDfcQuerySelect,
  signStatus: ClsDfcQuerySelect,
  proCode: ClsDfcQuerySelect,
  proName: ClsDfcQuerySelect
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
  signStatus: {
    selectList: [
      { Value: '', Label: 'All' },
      { Value: '-1', Label: '未啟動' },
      { Value: '0', Label: '簽核中' },
      { Value: '1', Label: '已簽核' }
    ]
  },
  proCode: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  proName: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  }
};

/**
 * DFC 軍令狀 啟動簽核時的彈窗所用
 */
export const DfcMilitaryOrderSignStartStyle: {
  IE: ClsDfcQueryStyle,
  PME: ClsDfcQueryStyle,
  PE: ClsDfcQueryStyle,
  PSE: ClsDfcQueryStyle,
  DFI_LEADER: ClsDfcQueryStyle,
  PQM: ClsDfcQueryStyle,
  PLANT_MANAGER: ClsDfcQueryStyle,
  EE: ClsDfcQueryStyle,
  ME: ClsDfcQueryStyle,
  SW: ClsDfcQueryStyle,
  GSQM: ClsDfcQueryStyle,
  PM: ClsDfcQueryStyle,
  PM_HEAD: ClsDfcQueryStyle,
  BU_HEAD: ClsDfcQueryStyle
} = {
  IE: {
    type: 'select',
    style: { width: '280px', right: '10px', position: 'absolute' },
    divStyle: { width: '100%', position: 'relative' },
    red: true,
    label: 'IE',
    selectType: 'search'
  },
  PME: {
    type: 'select',
    style: { width: '280px', right: '10px', position: 'absolute' },
    divStyle: { width: '100%', position: 'relative' },
    red: true,
    label: 'PME',
    selectType: 'search'
  },
  PE: {
    type: 'select',
    style: { width: '280px', right: '10px', position: 'absolute' },
    divStyle: { width: '100%', position: 'relative' },
    red: false,
    label: 'PE',
    selectType: 'search'
  },
  PSE: {
    type: 'select',
    style: { width: '280px', right: '10px', position: 'absolute' },
    divStyle: { width: '100%', position: 'relative' },
    red: false,
    label: 'PSE',
    selectType: 'search'
  },
  DFI_LEADER: {
    type: 'select',
    style: { width: '280px', right: '10px', position: 'absolute' },
    divStyle: { width: '100%', position: 'relative' },
    red: true,
    label: 'DFi Leader',
    selectType: 'search'
  },
  PQM: {
    type: 'select',
    style: { width: '280px', right: '10px', position: 'absolute' },
    divStyle: { width: '100%', position: 'relative' },
    red: true,
    label: 'PQM',
    selectType: 'search'
  },
  PLANT_MANAGER: {
    type: 'select',
    style: { width: '280px', right: '10px', position: 'absolute' },
    divStyle: { width: '100%', position: 'relative' },
    red: true,
    label: 'Plant Manage',
    selectType: 'search'
  },
  EE: {
    type: 'select',
    style: { width: '280px', right: '10px', position: 'absolute' },
    divStyle: { width: '100%', position: 'relative' },
    red: true,
    label: 'EE',
    selectType: 'search'
  },
  ME: {
    type: 'select',
    style: { width: '280px', right: '10px', position: 'absolute' },
    divStyle: { width: '100%', position: 'relative' },
    red: true,
    label: 'ME',
    selectType: 'search'
  },
  SW: {
    type: 'select',
    style: { width: '280px', right: '10px', position: 'absolute' },
    divStyle: { width: '100%', position: 'relative' },
    red: false,
    label: 'SW',
    selectType: 'search'
  },
  GSQM: {
    type: 'select',
    style: { width: '280px', right: '10px', position: 'absolute' },
    divStyle: { width: '100%', position: 'relative' },
    red: false,
    label: 'GSQM',
    selectType: 'search'
  },
  PM: {
    type: 'select',
    style: { width: '280px', right: '10px', position: 'absolute' },
    divStyle: { width: '100%', position: 'relative' },
    red: true,
    label: 'PM',
    selectType: 'search'
  },
  PM_HEAD: {
    type: 'select',
    style: { width: '280px', right: '10px', position: 'absolute' },
    divStyle: { width: '100%', position: 'relative' },
    red: true,
    label: 'PM Header',
    selectType: 'search'
  },
  BU_HEAD: {
    type: 'select',
    style: { width: '280px', right: '10px', position: 'absolute' },
    divStyle: { width: '100%', position: 'relative' },
    red: true,
    label: 'BU Header',
    selectType: 'search'
  }
};

/**
 * DFC 军令状 啟動簽核時 下拉框設定
 */
export const DfcMilitaryOrderSignStartSelect: {
  IE: ClsDfcQuerySelect,
  PME: ClsDfcQuerySelect,
  PE: ClsDfcQuerySelect,
  PSE: ClsDfcQuerySelect,
  DFI_LEADER: ClsDfcQuerySelect,
  PQM: ClsDfcQuerySelect,
  PLANT_MANAGER: ClsDfcQuerySelect,
  EE: ClsDfcQuerySelect,
  ME: ClsDfcQuerySelect,
  SW: ClsDfcQuerySelect,
  GSQM: ClsDfcQuerySelect,
  PM: ClsDfcQuerySelect,
  PM_HEAD: ClsDfcQuerySelect,
  BU_HEAD: ClsDfcQuerySelect
} = {
  IE: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  PME: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  PE: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  PSE: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  DFI_LEADER: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  PQM: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  PLANT_MANAGER: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  EE: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  ME: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  SW: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  GSQM: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  PM: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  PM_HEAD: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  BU_HEAD: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  }
};

/**
 * DFC 军令状 啟動簽核時 下拉框Value設定
 */
export const DfcMilitaryOrderSignStartValue: ClsDfcMilitarySignStartQuery = {
  IE: '', PME: '', PE: '', PSE: '', DFI_LEADER: '', GSQM: '', PQM: '', PLANT_MANAGER: '',
  EE: '', ME: '', SW: '', PM: '', PM_HEAD: '', BU_HEAD: ''
};

export const DfcMilitaryOrderSignBuPlantSelect: {
  bu: {
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
  }
} = {
  plant: {
    style: {
      type: 'select',
      style: { width: '280px', right: '10px', position: 'absolute' },
      divStyle: { width: '100%', position: 'relative' },
      red: false,
      label: '選擇廠別簽核',
      selectType: 'search'
    },
    select: {
      selectList: [],
      searchChange$: new BehaviorSubject('')
    },
    value: '',
    change$: new BehaviorSubject('')
  },
  bu: {
    style: {
      type: 'select',
      style: { width: '280px', right: '10px', position: 'absolute' },
      divStyle: { width: '100%', position: 'relative' },
      red: false,
      label: '選擇BU簽核表單',
      selectType: 'search'
    },
    select: {
      selectList: [],
      searchChange$: new BehaviorSubject('')
    },
    value: '',
    change$: new BehaviorSubject('')
  }
};

/**
 * DFC 軍令狀 查詢 使用的類
 */
export class ClsDfcMilitaryOrderQuery {
  plant: string;
  bu: string;
  custom: string;
  modelType: string;
  signStatus: string;
  proCode: string;
  proName: string;
  constructor() {
    this.plant = '';
    this.bu = '';
    this.custom = '';
    this.modelType = '';
    this.signStatus = '';
    this.proCode = '';
    this.proName = '';
  }
}

/**
 * DFC 軍令狀 啟動簽核 使用的類
 */
export class ClsDfcMilitarySignStartQuery {
  IE: string;
  PME: string;
  PE: string;
  PSE: string;
  DFI_LEADER: string;
  GSQM: string;
  PQM: string;
  PLANT_MANAGER: string;
  EE: string;
  ME: string;
  SW: string;
  PM: string;
  PM_HEAD: string;
  BU_HEAD: string;
}
