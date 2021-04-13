import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';
import { BehaviorSubject } from 'rxjs';

/**
 * MRR 文件 PIC名稱 維護 query時 下拉框設定
 */
export const MrrDocAuthQuery: {
  plant: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    change$?,
    value: string
  },
  productType: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    change$?,
    value: string
  },
  doc: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    change$?,
    value: string
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
    change$: new BehaviorSubject(''),
    value: ''
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
    change$: new BehaviorSubject(''),
    value: ''
  },
  doc: {
    style: {
      type: 'select',
      style: {width: '200px', margin: '10px 0 0 0'},
      red: true,
      label: '文件類別',
      selectType: 'simple'
    },
    select: {
      selectList: []
    },
    change$: new BehaviorSubject(''),
    value: ''
  }
};

/**
 * MRR 文件 PIC名稱 維護 新增 時 下拉框設定
 */
export const MrrDocAuthAdd = {
  docName: {
    redFlag: true,
    title: '文件名稱',
    multiple: false,
    value: ''
  },
  PIC: {
    redFlag: true,
    title: 'PIC',
    multiple: true,
    value: []
  },
  PICLeader1: {
    redFlag: true,
    title: 'PIC Leader1',
    multiple: true,
    value: []
  },
  PICLeader2: {
    redFlag: true,
    title: 'PIC Leader2',
    multiple: true,
    value: []
  },
  siteUser1: {
    redFlag: true,
    title: 'Site User1',
    multiple: false,
    value: ''
  },
  siteUser2: {
    redFlag: false,
    title: 'Site User2',
    multiple: false,
    value: ''
  },
  siteUser3: {
    redFlag: false,
    title: 'Site User3',
    multiple: false,
    value: ''
  },
  siteUser4: {
    redFlag: false,
    title: 'Site User4',
    multiple: false,
    value: ''
  },
  siteUser5: {
    redFlag: false,
    title: 'Site User5',
    multiple: false,
    value: ''
  }
};

/**
 * MRR 文件 PIC名稱 維護 編輯 時 下拉框設定
 */
export const MrrDocAuthEdit = {
  PIC: {
    list: [],
    multiple: true,
    search$: new BehaviorSubject('')
  },
  PICLeader1: {
    list: [],
    multiple: true,
    search$: new BehaviorSubject('')
  },
  PICLeader2: {
    list: [],
    multiple: true,
    search$: new BehaviorSubject('')
  },
  siteUser1: {
    list: [],
    multiple: false,
    search$: new BehaviorSubject('')
  },
  siteUser2: {
    list: [],
    multiple: false,
    search$: new BehaviorSubject('')
  },
  siteUser3: {
    list: [],
    multiple: false,
    search$: new BehaviorSubject('')
  },
  siteUser4: {
    list: [],
    multiple: false,
    search$: new BehaviorSubject('')
  },
  siteUser5: {
    list: [],
    multiple: false,
    search$: new BehaviorSubject('')
  }
};
