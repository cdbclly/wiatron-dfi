export class FaRetestRate {
  modelName: string; // 机种
  stationLine: string; // 线别
  stationType: string; // 站别
  stationName: string; // 待定，不知道具体作用，暂定为治具类别
  stationId: string; // 治具编号
  retestrate: number;
  lowlimit: number;
  upperlimit: number;
  executiontime: number; // 时间
  productionSN: string;  // 機台序列號
  Details: Detail[];
}

export class Detail {
  tdname: string;
  mdname: string;
  item_yieldrate: number;
  item_detail: string[];
}
