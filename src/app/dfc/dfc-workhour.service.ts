import { Injectable } from "@angular/core";
import { MOHPlantApi } from '@service/dfc_sdk/sdk';
@Injectable({
  providedIn: 'root'
})
export class WorkhourService {
  constructor(
    private MOHPlant: MOHPlantApi
  ) { }

  GroupByFactor(data) {
    const groupedStageData = data.stageOperations.data.reduce((p, t) => {
      if (!p[t.FactorID]) {
        p[t.FactorID] = {
          Material: t.Material,
          stageData: [],
          rfqData: []
        };
      }
      p[t.FactorID].stageData.push(t);
      return p;
    }, {});
    const result = data.rfqOperations.data.reduce((p, t) => {
      if (!p[t.FactorID]) {
        p[t.FactorID] = {
          Material: t.Material,
          stageData: [],
          rfqData: []
        };
      }
      p[t.FactorID].rfqData.push(t);
      return p;
    }, groupedStageData);
    Object.keys(result).forEach(key => {
      result[key].maxRows = Math.max(result[key].stageData.length, result[key].rfqData.length);
      result[key].rfqOriginalTime = this.Sum(result[key].rfqData.map(x => { return x.Count == null ? null : x.Count * x.CostTimeActural }));
      result[key].rfqFactorTime = this.Sum(result[key].rfqData.map(x => { return x.TargetCount == null ? x.Count * x.CostTimeActural : x.TargetCount * x.CostTimeTarget }));
      result[key].stageFactorTime = this.Sum(result[key].stageData.map(x => { return x.Count * x.CostTimeActural }));
      result[key].targetFactorTime = this.Sum(result[key].stageData.map(x => {
        if (x.TargetCount == null) {
          return null;
        } else {
          return x.TargetCount * x.CostTimeTarget;
        }
      }));
    });
    return result;
  }

  GroupByMaterialRFQ(data) {
    try {
      const result = {};
      const array = Object.keys(data).map(x => data[x]);
      // 有改進的
      const improvesArray = array.filter(x => x.rfqOriginalTime != x.stageFactorTime);
      // 還有Gap的
      const gapArray = array.filter(x => x.stageFactorTime != x.rfqFactorTime);
      const improvesGroupbyMaterial = improvesArray.reduce((p, t) => {
        if (!p[t.Material]) {
          p[t.Material] = { Material: t.Material, Value: 0 };
        }
        //改進的量
        p[t.Material].Value = p[t.Material].Value + (t.rfqOriginalTime - t.stageFactorTime);
        return p;
      }, {});
      result['improves'] = Object.keys(improvesGroupbyMaterial).map(x => improvesGroupbyMaterial[x]).sort(this.sortFc);
      const gapGroupbyMaterial = gapArray.reduce((p, t) => {
        if (!p[t.Material]) {
          p[t.Material] = { Material: t.Material, Value: 0 };
        }
        //改進的量
        p[t.Material].Value = p[t.Material].Value + (t.stageFactorTime - t.rfqFactorTime);
        return p;
      }, {});
      result['gaps'] = Object.keys(gapGroupbyMaterial).map(x => gapGroupbyMaterial[x]).sort(this.sortFc);
      return result;
    } catch (e) {
    }
  }

  GroupByMaterial(data) {
    try {
      const result = {};
      const array = Object.keys(data).map(x => data[x]);
      // 有改進的
      const improvesArray = array.filter(x => (x.targetFactorTime != null) && (x.targetFactorTime != x.stageFactorTime));
      // 還有Gap的
      const gapArray = array.filter(x => x.rfqFactorTime !== (x.targetFactorTime != null ? x.targetFactorTime : x.stageFactorTime));
      const improvesGroupbyMaterial = improvesArray.reduce((p, t) => {
        if (!p[t.Material]) {
          p[t.Material] = { Material: t.Material, Value: 0 };
        }
        //改進的量
        p[t.Material].Value = p[t.Material].Value + (t.stageFactorTime - t.targetFactorTime);
        return p;
      }, {});
      result['improves'] = Object.keys(improvesGroupbyMaterial).map(x => improvesGroupbyMaterial[x]).sort(this.sortFc);
      const gapGroupbyMaterial = gapArray.reduce((p, t) => {
        if (!p[t.Material]) {
          p[t.Material] = { Material: t.Material, Value: 0 };
        }
        //改進的量
        p[t.Material].Value = p[t.Material].Value + ((t.targetFactorTime || t.stageFactorTime) - t.rfqFactorTime);
        return p;
      }, {});
      result['gaps'] = Object.keys(gapGroupbyMaterial).map(x => gapGroupbyMaterial[x]).sort(this.sortFc);
      return result;
    } catch (e) {
    }
  }

  Sum(array: Array<number>) {
    if (array.length == 0 || array.every(x => x == null)) {
      return null;
    }
    return array.reduce((p, t) => {
      return p + t;
    }, 0);
  }

  sortFc(x_, y_) {
    const x = x_.Value;
    const y = y_.Value;
    if (x > y) {
      return -1;
    } else if (x < y) {
      return 1;
    } else {
      return 0;
    }
  }

  LeftTops(data: { Material: string, Value: number }[], maxNum) {
    if (data.length <= maxNum) {
      return data;
    } else {
      const redundancy = data.splice(maxNum - 2);
      const newItem: { Material: string, Value: number } = {
        Material: 'Other',
        Value: 0
      }
      redundancy.forEach(element => {
        newItem.Value = newItem.Value + element.Value;
      });
      data.push(newItem);
      return data;
    }
  }

  CreateTableDataArray(data, seq) {
    const sortFc = (x, y) => {
      const a = y.Material;
      const b = x.Material;
      const indexA = seq.findIndex(x => x === a);
      const indexB = seq.findIndex(x => x === b);
      if (indexA == indexB) {
        return 0;
      } else if (indexA === -1 && indexB !== -1) {
        return -1;
      } else if (indexA !== -1 && indexB === -1) {
        return 1
      } else if (indexA < indexB) {
        return 1;
      } else {
        return -1;
      }
    }
    let arr = Object.keys(data).map(x => { data[x].factorID = x; return data[x] })
    arr = arr.sort(sortFc);
    const result = [];
    arr.forEach(e => {
      result.push(e.factorID);
    });
    return result;
  }

  async GetMOHDL(projectCode) {
    const moh = await this.MOHPlant.GetPlantMOH(projectCode).toPromise();
    return ((moh.dl2 / moh.ExRateRMB) / 260 / 3600);
  }
}
