import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';
import { BehaviorSubject } from 'rxjs';

/**
 * DFC KPI Query時 選項的style
 */
export const DfcKpiQueryStyle: {
  plant: ClsDfcQueryStyle,
  bu: ClsDfcQueryStyle,
  custom: ClsDfcQueryStyle,
  modelType: ClsDfcQueryStyle,
  standard: ClsDfcQueryStyle,
  proCode: ClsDfcQueryStyle,
  proName: ClsDfcQueryStyle,
  cFlow: ClsDfcQueryStyle,
  modelName: ClsDfcQueryStyle
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
    style: { width: '80px' },
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
    style: { width: '200px' },
    red: false,
    label: '產品別',
    selectType: 'multiple'
  },
  standard: {
    type: 'select',
    style: { width: '100px' },
    red: false,
    label: '達標狀況',
    selectType: 'simple'
  },
  proCode: {
    type: 'select',
    style: { width: '800px' },
    red: false,
    label: 'Project Code',
    selectType: 'multiple'
  },
  modelName: {
    type: 'select',
    style: { width: '800px' },
    red: false,
    label: 'Model Name',
    selectType: 'multiple'
  },
  proName: {
    type: 'select',
    style: { width: '800px' },
    red: false,
    label: 'Project Name',
    selectType: 'multiple'
  },
  cFlow: {
    type: 'select',
    style: { width: '400px' },
    red: false,
    label: 'C流程',
    selectType: 'multiple'
  }
};

/**
 * DFC KPI Query 下拉框設定
 */
export const DfcKpiQuerySelect: {
  plant: ClsDfcQuerySelect,
  bu: ClsDfcQuerySelect,
  custom: ClsDfcQuerySelect,
  modelType: ClsDfcQuerySelect,
  standard: ClsDfcQuerySelect,
  proCode: ClsDfcQuerySelect,
  modelName: ClsDfcQuerySelect,
  proName: ClsDfcQuerySelect,
  cFlow: ClsDfcQuerySelect
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
  standard: {
    selectList: [
      { Value: 'green', Label: '達標' },
      { Value: 'red', Label: '未達標' }
    ]
  },
  proCode: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  modelName: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  proName: {
    selectList: [],
    searchChange$: new BehaviorSubject('')
  },
  cFlow: {
    selectList: [
      { Value: 'C0', Label: 'C0' },
      { Value: 'C1', Label: 'C1' },
      { Value: 'C2', Label: 'C2' },
      { Value: 'C3', Label: 'C3' },
      { Value: 'C4', Label: 'C4' },
      { Value: 'C5', Label: 'C5' },
      { Value: 'C6', Label: 'C6' }
    ],
    searchChange$: new BehaviorSubject('')
  }
};

export const DfcKpiRewardsContent = {
  Stage: ['C4', 'C5', 'MP'],
  Standard: {
    C4: {
      Reward: ['以C4最後一次build的組裝工時為準, 實際組裝工時差異在目標工時正負5%以內', '1.DFi leader書面嘉獎2次', '2.團隊1000RMB'],
      Punish: {
        Lv1: ['工時超過目標5%~10%', '1.DFi 團隊口頭警告1次', '2.DFi leader書面警告1次'],
        Lv2: ['工時超過目標10%~20%', '1.DFi 團隊書面警告1次', '2.DFi leader書面警告2次'],
        Lv3: ['工時超過目標20%', '1.DFi 團隊書面警告2次', '2.DFi leader小過1次']
      }
    },
    C5: {
      Reward: ['以C5最後一次build的組裝工時為準,實際組裝工時差異在目標工時正負5%以內', '1.DFi leader小功1次', '2.團隊1500RMB'],
      Punish: {
        Lv1: ['工時超過目標5%~10%', '1.DFi 團隊口頭警告1次', '2.DFi leader書面警告1次'],
        Lv2: ['工時超過目標10%~20%', '1.DFi 團隊書面警告1次', '2.DFi leader書面警告2次'],
        Lv3: ['工時超過目標20%', '1.DFi 團隊書面警告2次', '2.DFi leader小過1次']
      }
    },
    MP: {
      Reward: ['以MP的組裝工時為準, 實際組裝工時差異在目標工時正負5%以內', '1.DFi leader 大功1次', '2.Team成員書面嘉獎1次', '3.團隊2500RMB'],
      Punish: {
        Lv1: ['工時超過目標5%~10%', '1.DFi 團隊口頭警告2次', '2.DFi leader書面警告2次'],
        Lv2: ['工時超過目標10%~20%', '1.DFi 團隊書面警告2次', '2.DFi leader小過1次'],
        Lv3: ['工時超過目標20%', '1.DFi 團隊小過1次', '2.DFi leader小過2次']
      }
    }
  }
};

/**
 *  DFC KPI 選擇項選擇值 的類
 */
export class ClsDfcKpiSelect {
  plant: string;
  bu: string;
  custom: string;
  modelType: string[];
  standard: string;
  proCode: string[];
  modelID: string[];
  modelName: { id: number, type: number }[];
  proName: string[];
  cFlow: string[];
  count: number;
}

/**
 * DFC KPI 獎懲建議的 類
 */
export class ClsDfcKpiReward {
  projectCodeId: number;
  status: string; // 標誌為獎勵（green）或者懲罰(red)
  proName: string; // 機種
  cFlow: string; // C流程
  flag: number; // 標誌工時--1/Moh--0
  actual: string; // 實際數值 -- 用於顯示
  target: string; // 目標數值 -- 用於顯示
  level?: string; // 獎懲的level
  content: string[]; // 獎懲內容
  members: {}[]; // 人員名單
  workhours: {}; // 用於獎懲規則 顯示
  msg: boolean; // 判斷是否 為reward中 含有的stage
}

// dfq獎懲規則說明
export const DfqKpiRewardsContent = [
  ['DFQ良率達標獎勵懲罰規則說明', '', '', '', '', '', '', 'v03'],
  ['Month', '', 'Mass Production 1 Month', '', '', '', 'Remark'],
  ['Week', '', 'week1', 'week2', 'week3', 'week4'],
  ['Goal', '', '94.5% 1.實際生產累計≥5k', '96.5% 1.實際生產累計≥10k', '97.5% 1.實際生產累計≥15k', '98.5% 1.實際生產累計≥20k', '特殊原因不達標的，DFI Leader請向DFI委員（或廠長以上）說明，如獲得批准，則不受懲罰'],
  ['Actual', '', 'MP第一周的實際良率', 'MP第二周的實際良率', 'MP第三周的實際良率', 'MP第四周的實際良率'],
  ['標準', '達標（獎勵）階段達標後：DFI Leader 以簽呈方式申請費用', '達標條件：量產第一周，FPYR有達到94.5% 獎勵：1.DFI Leader書面嘉獎一次', '達標條件：量產第二周，FPYR有達到96.5% 獎勵：1.團隊1000RMB2.DFI Leader書面嘉獎兩次', '達標條件：量產第三周，FPYR有達到97.5% 獎勵：1.團隊1500RMB2.DFI Leader小功一次', '達標條件：量產第四周，FPYR有達到98.5% 獎勵：1.團隊2500RMB2.DFI Leader大功一次3.Team 成員書面嘉獎一次'],
  ['', '未達標（懲罰）階段未達標: PQM 以郵件通知DFi 執行委員, Biweekly 的DFi 會議上通報給賴總& 周總', 'DFI Leader書面警告一次 DFI團隊口頭警告一次 1.實際生產累計≥5k，FPYP≤90% （BU wavie C5 result除外：C5良率87%未達標獲得BU wavie，那week1 FPYP的起點則是以87%低標）', 'DFI Leader書面警告兩次 DFI團隊書面警告一次 1.實際生產累計≥10k，FPYP≤92%', 'DFI Leader小過一次 DFI團隊書面警告兩次 1.實際生產累計≥15k，FPYP≤93% 2.（如果前一周有達到FPYP目標，則可以降低一級處罰（書面警告一次））', 'DFI Leader小過兩次 DFI團隊小過一次 1.實際生產累計≥20k，FPYP≤95% 2.（如果前一周有達到FPYP目標，則可以降低一級處罰（書面警告兩次））']
];
