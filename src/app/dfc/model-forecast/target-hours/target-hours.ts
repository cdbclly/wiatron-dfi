import { BehaviorSubject } from 'rxjs';
import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';

export const DfcTargetHoursQuery: {
  plant: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string[],
    change$?
  },
  bu: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string[],
    change$?
  },
  custom: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string[],
    change$?
  },
  productType: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string[],
    change$?
  },
  proName: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: number[],
    change$?
  },
  proCode: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string[],
    change$?
  },
  model: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string[],
    change$?
  },
  cFlow: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string[],
    change$?
  }
} = {
  plant: {
    style: {
      type: 'select',
      style: {width: 'calc(100% - 150px)', right: '10px', position: 'absolute'},
      divStyle: {width: '100%', position: 'relative'},
      red: true,
      label: '廠別',
      selectType: 'multiple'
    },
    select: {
      selectList: []
    },
    value: [],
    change$: new BehaviorSubject('')
  },
  bu: {
    style: {
      type: 'select',
      style: {width: 'calc(100% - 150px)', right: '10px', position: 'absolute'},
      divStyle: {width: '100%', position: 'relative'},
      red: false,
      label: 'BU',
      selectType: 'multiple'
    },
    select: {
      selectList: [],
      searchChange$: new BehaviorSubject('')
    },
    value: [],
    change$: new BehaviorSubject('')
  },
  custom: {
    style: {
      type: 'select',
      style: {width: 'calc(100% - 150px)', right: '10px', position: 'absolute'},
      divStyle: {width: '100%', position: 'relative'},
      red: false,
      label: '客戶',
      selectType: 'multiple'
    },
    select: {
      selectList: [],
      searchChange$: new BehaviorSubject('')
    },
    value: [],
    change$: new BehaviorSubject('')
  },
  productType: {
    style: {
      type: 'select',
      style: {width: 'calc(100% - 150px)', right: '10px', position: 'absolute'},
      divStyle: {width: '100%', position: 'relative'},
      red: true,
      label: '產品',
      selectType: 'multiple'
    },
    select: {
      selectList: []
    },
    value: [],
    change$: new BehaviorSubject('')
  },
  proName: {
    style: {
      type: 'select',
      style: {width: 'calc(100% - 150px)', right: '10px', position: 'absolute'},
      divStyle: {width: '100%', position: 'relative'},
      red: true,
      label: 'Project Name',
      selectType: 'multiple'
    },
    select: {
      selectList: [],
      searchChange$: new BehaviorSubject('')
    },
    value: [],
    change$: new BehaviorSubject('')
  },
  proCode: {
    style: {
      type: 'select',
      style: {width: 'calc(100% - 150px)', right: '10px', position: 'absolute'},
      divStyle: {width: '100%', position: 'relative'},
      red: true,
      label: 'Project Code',
      selectType: 'multiple'
    },
    select: {
      selectList: [],
      selectDisabled: true
    },
    value: [],
    change$: new BehaviorSubject('')
  },
  model: {
    style: {
      type: 'select',
      style: {width: 'calc(100% - 150px)', right: '10px', position: 'absolute'},
      divStyle: {width: '100%', position: 'relative'},
      red: true,
      label: 'Model Name',
      selectType: 'multiple'
    },
    select: {
      selectList: [],
      searchChange$: new BehaviorSubject('')
    },
    value: [],
    change$: new BehaviorSubject('')
  },
  cFlow: {
    style: {
      type: 'select',
      style: {width: 'calc(100% - 150px)', right: '10px', position: 'absolute'},
      divStyle: {width: '100%', position: 'relative'},
      red: true,
      label: 'C階段',
      selectType: 'multiple'
    },
    select: {
      selectList: [{'Value': 'RFQ', 'Lable': 'RFQ'}],
      searchChange$: new BehaviorSubject('')
    },
    value: ['RFQ'],
    change$: new BehaviorSubject('')
  }
};
