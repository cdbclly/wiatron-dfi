export class PIC {
  name: string;
  dept: string;
  seniority: string;
  jobLevel: string;
  supervisor: string;
  certification: string;
  p6sigma: string;
  close: number;
  open: number;
  ongoing: number;
  handleAlertTime1: number;
  handleAlertTime2: number;
  handleAlertTime3: number;
  closeAlertTime1: number;
  closeAlertTime2: number;
  closeAlertTime3: number;
}

export class AlertInfos {
  curdate: Date;
  lineId: string;
  modelId: string;
  stationId: string;
  warningInfo: string;
  equipNo: string;
  rootInfo: string;
  action: string;
  comment: string;
  status: string;
  occurTime: string;
  handleTime: string;
  endingTime: string;
  dept: string;
  pic: string;
  picReasonDesc: string; // 根本原因
  decision: string; // 辅助决策
}
