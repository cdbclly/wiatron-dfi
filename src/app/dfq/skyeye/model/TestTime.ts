export class TestTimes {
  modelName: string;
  stationLine: string;
  stationType: string;
  stationName: string;
  stationId: string;
  mean: number;
  lowerLimit: number;
  upperLimit: number;
  overcount: number;
  stopdate: number;
  details: Detail[];
}

export class Detail {
  unitSerialNumber: string;
  testcycletime: number;
  stopdate: number;
  stationId: string;
}

export class Limit {
  lowlimit: number;
  meanlimit: number;
  upperlimit: number;
}
