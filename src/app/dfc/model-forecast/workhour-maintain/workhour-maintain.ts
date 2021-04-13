import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';
import { BehaviorSubject } from 'rxjs';

export const DfcWorkhourMaintainQuery: {
  plant: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string,
    change$?
  },
  bu: {
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
  bu: {
    style: {
      type: 'select',
      style: {width: '80px', margin: '10px 0 0 0'},
      red: false,
      label: 'BU',
      selectType: 'search'
    },
    select: {
      selectList: [],
      searchChange$: new BehaviorSubject('')
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
      style: {width: '150px', margin: '10px 0 0 0'},
      red: true,
      label: '製程',
      selectType: 'simple'
    },
    select: {
      selectList: []
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
      selectList: []
    },
    value: '',
    change$: new BehaviorSubject('')
  }
};
