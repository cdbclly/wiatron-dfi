import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';
import { BehaviorSubject } from 'rxjs';


export class ClsDfcValidationSelect {
  plant: string;
  bu: string;
  customer: string;
  product: string;
  status: string;
  proName: string;
  proCode: string;
  modelName: string;
  cFlow: string;
}


export const DfcWorkhourValidationQuery: {
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
  customer: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string,
    change$?
  },
  product: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string[],
    change$?
  },
  status: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string,
    change$?
  },
  proName: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string[],
    change$?
  },
  proCode: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string[],
    change$?
  },
  modelName: {
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
      style: {width: '120px', margin: '10px 0 0 0'},
      red: false,
      label: 'BU',
      selectType: 'simple'
    },
    select: {
      selectList: []
    },
    value: '',
    change$: new BehaviorSubject('')
  },
  customer: {
    style: {
      type: 'select',
      style: {width: '80px', margin: '10px 0 0 0'},
      red: false,
      label: '客戶名',
      selectType: 'simple'
    },
    select: {
      selectList: [],
      selectDisabled: false
    },
    value: '',
    change$: new BehaviorSubject('')
  },
  product: {
    style: {
      type: 'select',
      style: {width: '80px', margin: '10px 0 0 0'},
      red: false,
      label: '產品',
      selectType: 'multiple'
    },
    select: {
      selectList: []
    },
    value: [],
    change$: new BehaviorSubject('')
  },
  status: {
    style: {
      type: 'select',
      style: {width: '150px', margin: '10px 0 0 0'},
      red: false,
      label: '達標狀況',
      selectType: 'simple'
    },
    select: {
      selectList: [
        {Value: 'yes', Label: '達標'},
        {Value: 'no', Label: '不達標'}
      ],
      searchChange$: new BehaviorSubject('')
    },
    value: null,
    change$: new BehaviorSubject('')
  },
  proName: {
    style: {
      type: 'select',
      style: {width: '700px', margin: '10px 0 0 0'},
      red: false,
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
      style: {width: '700px', margin: '10px 0 0 0'},
      red: false,
      label: 'Project Code',
      selectType: 'multiple'
    },
    select: {
      selectList: [],
      selectDisabled: false
    },
    value: [],
    change$: new BehaviorSubject('')
  },
  modelName: {
    style: {
      type: 'select',
      style: {width: '700px', margin: '10px 0 0 0'},
      red: false,
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
      style: {width: '300px', margin: '10px 0 0 0'},
      red: false,
      label: 'C階段',
      selectType: 'multiple'
    },
    select: {
      selectList: [
        {Value: 'RFQ', Label: 'RFQ'},
        // {Value: 'C0', Label: 'C0'},
        // {Value: 'C1', Label: 'C1'},
        {Value: 'C2', Label: 'C2'},
        {Value: 'C3', Label: 'C3'},
        {Value: 'C4', Label: 'C4'},
        {Value: 'C5', Label: 'C5'},
        {Value: 'C6', Label: 'C6'}
      ]
    },
    value: [],
    change$: new BehaviorSubject('')
  }
};
