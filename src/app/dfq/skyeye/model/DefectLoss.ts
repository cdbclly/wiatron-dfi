export class DefectLoss {
  modelName: string;
  stationLine: string;
  stationType: string;
  stationName: string;
  stationId: string;
  failrate: number;
  lowlimit: number;
  upperlimit: number;
  stopdate: number;
  upn: any;
  stationtype: any;
  Details: Detail[];
}

export class Detail {
  tdname: string;
  mdname: string;
  unitserialnumber: string[];
}
