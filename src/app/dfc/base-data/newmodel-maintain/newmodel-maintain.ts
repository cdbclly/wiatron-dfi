import { BehaviorSubject } from 'rxjs';
import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';

export const DfcNewmodelMaintainQuery: {
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
  plmStatus: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string,
    change$?
  }
} = {
  plant: {
    style: {
      type: 'select',
      style: { width: '150px', margin: '10px 0 0 0' },
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
      style: { width: '80px', margin: '10px 0 0 0' },
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
      style: { width: '150px', margin: '10px 0 0 0' },
      red: false,
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
      style: { width: '80px', margin: '10px 0 0 0' },
      red: false,
      label: '產品別',
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
      style: { width: '200px', margin: '10px 0 0 0' },
      red: false,
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
      style: { width: '200px', margin: '10px 0 0 0' },
      red: false,
      label: 'Project Code',
      selectType: 'search'
    },
    select: {
      selectList: [],
      searchChange$: new BehaviorSubject('')
    },
    value: '',
    change$: new BehaviorSubject('')
  },
  plmStatus: {
    style: {
      type: 'select',
      style: { width: '200px', margin: '10px 0 0 0' },
      red: false,
      label: 'PLM Status',
      selectType: 'simple'
    },
    select: {
      selectList: [
        { Value: 'Active', Label: 'Active' },
        { Value: 'Hold', Label: 'Hold' },
        { Value: 'Cancel', Label: 'Cancel' },
        { Value: 'Close', Label: 'Close' }
      ]
    },
    value: '',
    change$: new BehaviorSubject('')
  }
};
