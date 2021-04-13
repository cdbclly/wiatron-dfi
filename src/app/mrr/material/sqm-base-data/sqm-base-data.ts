export class PartsAddModelList {
  operationList: any[];
  operationListCache: any[];
  operationListOriginal: any[];
  transferList: any[]; // 穿梭框中的值
  transferListCache: any[];
  constructor(param?: {
    operationList: any[],
    transferList: any[]
  }) {
    this.operationList = [];
    this.operationListCache = [];
    this.operationListOriginal = [];
    this.transferList = [];
    this.transferListCache = [];
    if (param) {
      this.setValues(param);
    }
  }

  public setValues(param: {
    operationList: any[],
    transferList: any[]
  }) {
    this.operationList = param.operationList;
    this.transferList = param.transferList;
  }
}
