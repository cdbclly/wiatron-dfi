import { BehaviorSubject } from 'rxjs';
import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';

/**
 * MRR 文件上傳 Query時 下拉框設定
 */
export const MrrDocUploadQuery: {
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
  proCode: {
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
  }
} = {
  site: {
    style: {
      type: 'select',
      style: { width: '80px', margin: '10px 0 0 0' },
      red: true,
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
  productType: {
    style: {
      type: 'select',
      style: { width: '80px', margin: '10px 0 0 0' },
      red: true,
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
  proName: {
    style: {
      type: 'select',
      style: { width: '200px', margin: '10px 0 0 0' },
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
  }
};
