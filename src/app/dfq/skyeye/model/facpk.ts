export class FacpkModel {
  modelName: string;
  stationLine: string;
  stationType: string;
  stationName: string;
  stationId: string;
  tdName: string;
  mdName: string;
  cpk: number;
  lowerLimit: number;
  upperLimit: number;
  goodLimit: number;
  stopDate: number;
  Details: Detail;
}

export class Detail {
  ProductionSN: string; // 机台序列号
  StartTime: number;
  EndTime: number;
  result: number;
  item_upperlimit: number;
  item_lowerlimit: number;
  status: boolean;
}
