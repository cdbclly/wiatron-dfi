import { BehaviorSubject } from 'rxjs';
import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';

/**
 * MRR 文件Report Query時 下拉框設定
 */
export const MrrDocReportQuery: {
  site: {
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
  productType: {
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
  bu: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string,
    change$?
  }
} = {
  site: {
    style: {
      type: 'select',
      style: { width: '80px', margin: '10px 0 0 0' },
      red: false,
      label: '廠區',
      selectType: 'simple'
    },
    select: {
      selectList: []
    },
    value: '',
    change$: new BehaviorSubject('')
  },
  plant: {
    style: {
      type: 'select',
      style: { width: '80px', margin: '10px 0 0 0' },
      red: false,
      label: '廠別',
      selectType: 'simple'
    },
    select: {
      selectList: []
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
  bu: {
    style: {
      type: 'select',
      style: { width: '120px', margin: '10px 0 0 0' },
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
  }
};
