export class CPKSliding {
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
  Details: Detail[];
  upn: any;
}

export class CPKTubling {
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
  Details: Detail[];
  upn: any;
}

export class Detail {
  unitSerialNumber: string;
  mdResult: number;
  mdStatus: boolean;
}
