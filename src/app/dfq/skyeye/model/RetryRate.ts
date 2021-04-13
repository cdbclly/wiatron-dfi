export class RetryRates {
  modelName: string;
  stationLine: string;
  stationType: string;
  stationName: string;
  stationId: string;
  retryrate: number;
  lowlimit: number;
  upperlimit: number;
  stopdate: number;
  upn: string;
  Details: Detail[];
}

export class Detail {
  tdname: string;
  mdname: string;
  unitserialnumber: string[];
}
