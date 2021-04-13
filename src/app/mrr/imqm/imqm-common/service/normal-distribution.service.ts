import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NormalDistributionService {

  constructor() { }

  // 获取目标字典数组
  getAimArray(array) {
    const aim = [];
    for (const iterator of array) {
      const temp = {};
      temp['value'] = iterator;
      temp['count'] = this.getSameValueCount(array, iterator);
      aim.push(temp);
    }
    return aim;
  }

  // 目标数组去重
  deleteDuplicatesElement(array, keyArray) {
    return this.dicArrayDeleteDuplicatesElement(array, keyArray);
  }


    // 计算均值
    average(arr, key1, key2) {
      let sum = 0;
      let count = 0;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        count = this.add(count, arr[i][key2]);
        sum = this.add(sum, this.multiple(arr[i][key1], arr[i][key2]));
      }
      return parseFloat((this.divider(sum, count)).toFixed(2));
    }


     // 计算标准差
  standardDeviation(arr, average, key1, key2) {
    let count = 0;
    let sum = 0;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < arr.length; i++) {
      count = this.add(count, arr[i][key2]);
      const r = this.minus(arr[i][key1], average);
      sum = this.add(sum, this.multiple(this.multiple(r, r), arr[i][key2]));
    }
    return parseFloat(Math.sqrt((this.divider(sum, count))).toFixed(2));
  }

  // 返回正态分布数组
  returnNormalDistributionArray(arr, average, standDev) {
    const array = [];
    for (const key in arr) {
      if (Object.prototype.hasOwnProperty.call(arr, key)) {
        array.push(this.normalDistributionData(arr[key], average, standDev));
      }
    }
    return array;
  }

    // 计算正态分布值
    normalDistributionData(x, average, standDev) {
      if (standDev !== 0) {
        const r1 = this.divider(1, this.multiple(Math.sqrt(2 * Math.PI), standDev));
        const temp = this.minus(x, average);
        const r2 = Math.exp(-1 * this.divider((this.multiple(temp, temp)), (2 * this.multiple(standDev, standDev))));
        // return ((1 / Math.sqrt(2 * Math.PI) * standDev) * Math.exp(-1 * ((x - aver) * (x - aver)) / (2 * standDev * standDev)));
        return this.multiple(r1, r2).toFixed(3);
      } else {
        return 0 ;
      }
    }

  dicArrayDeleteDuplicatesElement(dicArray: Array<any>, keyArray: Array<string>) {
    const obj = {};
    dicArray = dicArray.reduce((aimArr, next) => {
      let keyString = '';
      keyArray.forEach(e => {
        if (keyString === '') {
          keyString = next[e];
        } else {
          keyString = keyString + next[e];
        }
      });
      // tslint:disable-next-line: no-unused-expression
      obj[keyString] ? '' : obj[keyString] = true && aimArr.push(next);
      return aimArr;
    }, []);
    return dicArray;
  }



  getSameValueCount(arr, val) {
    // tslint:disable-next-line: only-arrow-functions
    const processArr = arr.filter(function (value) {
      return value === val;
    });
    return processArr.length;
  }


  addParam(arr, target1) {
    let flag = false;
    const target = parseFloat(target1);
    if (target < parseFloat(arr[0])) {
        arr.unshift(target);
        return arr;
    }

    if (target > parseFloat(arr[arr.length - 1])) {
        arr.push(target);
        return arr;
    }
    let i;
    for ( i = 0; i < arr.length; i++) {
        if (parseFloat(arr[i]) > target) {
            if (arr[i - 1] === target) {
                flag = true;
            }
            break;
        }
    }
    if (flag) {
        return arr;
    } else {
        arr.splice(i, 0, target);
        return arr;
    }
   }

  add(value1, value2) {
    let r1: any;
    let r2: any;
    let m: any;
    try {
      r1 = value1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = value2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (value1 * m + value2 * m) / m;
  }

  minus(value1, value2) {
    let r1: any;
    let r2: any;
    let m: any;
    let n: any;
    try {
      r1 = value1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = value2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    // 动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((value1 * m - value2 * m) / m).toFixed(n);
  }


  multiple(value1, value2) {
    let m = 0;
    const s1 = value1.toString();
    const s2 = value2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) {
    }
    try {
      m += s2.split('.')[1].length;
    } catch (e) {
    }
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
  }


  divider(value1, value2) {
    let t1 = 0;
    let t2 = 0;
    let r1;
    let r2;
    try {
      t1 = value1.toString().split('.')[1].length;
    } catch (e) {
    }
    try {
      t2 = value2.toString().split('.')[1].length;
    } catch (e) {
    }
    r1 = Number(value1.toString().replace('.', ''));
    r2 = Number(value2.toString().replace('.', ''));
    return (r1 / r2) * Math.pow(10, t2 - t1);
  }

}
