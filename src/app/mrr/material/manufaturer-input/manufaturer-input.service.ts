import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { of, Observable, forkJoin, ReplaySubject } from 'rxjs';
import {
  PartNumberVendorRecordApi,
  VendorRecordApi,
  YieldRateRecordApi,
  VendorIssueApi,
  OperationApi,
  View_ManufacturerMaterialYieldRateApi,
  View_ProcessYieldRateApi
} from '@service/mrr-sdk';
import { map, mergeMap } from 'rxjs/operators';
import { ProjectApi } from '@service/dfi-sdk';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ManufaturerInputService {

  public nowDate;
  public toSqmBaseDataParts$ = new ReplaySubject<any>();

  constructor(
    private partNumberVendorRecordApi: PartNumberVendorRecordApi,
    private vendorRecordApi: VendorRecordApi,
    private yieldRateRecordApi: YieldRateRecordApi,
    private vendorIssueApi: VendorIssueApi,
    private operationApi: OperationApi,
    private v_PlantProject: ProjectApi,
    private view_ManufacturerMaterialYieldRate: View_ManufacturerMaterialYieldRateApi,
    private view_ProcessYieldRate: View_ProcessYieldRateApi
  ) { }


  getSubject(data) {
    return this.toSqmBaseDataParts$.next(data);
  }

  getPlantProject(projectCode) {
    return this.v_PlantProject.find({
      where: {
        id: projectCode
      }
    });
  }

  /**
   * 廠商端良率查詢
   *
   * @param {FormGroup} validateForm
   * @returns {Observable<any>}
   * @memberof ManufaturerInputService
   */
  query(validateForm: FormGroup, rangePicker?: any[]): Observable<any> {
    return forkJoin([
      this.partNumberVendorRecordApi
        .getVendorRecordsExt(
          validateForm.value.partNumberVendor,
          validateForm.value.stage,
          rangePicker
            ? rangePicker[0]
            : moment(new Date(validateForm.value.rangePicker[0]).getTime()).format('YYYY-MM-DD'),
          rangePicker
            ? rangePicker[1]
            : moment(new Date(validateForm.value.rangePicker[1]).getTime()).format('YYYY-MM-DD')
        ),
      this.getPlantProject(validateForm.value.projectCode)
    ]).pipe(
      map(res => {
        const records = res[0];
        const customer = res[1].length ? res[1][0]['customerId'] : '';

        const dataSet = [];
        const optionParam = {
          sqmYield: [],
          vendorYield: [],
          date: []
        };

        records['partNumberVendorRecords'].forEach(record => {
          optionParam.date.push(
            new Date(record.dateCode).toLocaleDateString()
          );
          let vendorYield, yieldColor;
          let actual,
            sumActual = 1,
            RTYActual;
          const inputDataSet = [];
          if (record['operations'].length > 0) {
            const latestOperation = record['operations'].find(
              operation => operation['order'] === record['operations'].length
            );
            this.sort(record['operations'], x => x['order']);
            for (
              let index = 0;
              index < record['operations'].length;
              index++
            ) {
              const operation = record['operations'][index];
              if (operation['order'] !== record['operations'].length) {
                actual = (!operation.input || !operation.output) ? 0 : Math.round((operation.output / operation.input) * 10000) / 10000;
                if (operation.input && operation.output) {
                  sumActual *= operation.output / operation.input;
                } else if (operation.input === 0 && operation.output === 0) {
                  sumActual *= 1;
                } else if (!operation.input || !operation.output) {
                  sumActual *= 0;
                }
              }
              if (operation['order'] === record['operations'].length) {
                RTYActual = sumActual;
              }
              inputDataSet.push({
                manufacturer: records['manufacturerId'],
                part: records['part']['name'],
                sqmTargetYieldShow:
                  Math.round(operation.sqmTargetYield * 10000) / 100,
                vendorTargetYieldShow: operation.vendorTargetYield ?
                  Math.round(operation.vendorTargetYield * 10000) / 100 : null,
                actual:
                  operation['order'] !== record['operations'].length
                    ? Math.round(actual * 10000) / 10000
                    : Math.round(RTYActual * 10000) / 10000,
                // 如果有Input 並且Actual小於MP Goal or C4之前不良數大於0 則mark red
                markRed:
                  operation['order'] === record['operations'].length
                    ? operation.vendorTargetYieldId &&
                      operation.sqmTargetYield && RTYActual < operation.sqmTargetYield
                      ? true
                      : false
                    : (operation.vendorTargetYieldId &&
                      operation.input && actual < operation.sqmTargetYield ||
                      (!operation.sqmTargetYield &&
                        operation.input - operation.output > 0))
                      ? true
                      : false,
                ...operation
              });
            }
            // 如果RTY的Actual小於MP Goal則mark red
            yieldColor =
              RTYActual <
                Math.round(latestOperation.sqmTargetYield * 10000) / 10000
                ? { backgroundColor: 'red', color: '#ccc' }
                : {};
            optionParam.sqmYield.push(
              latestOperation.sqmTargetYield
                ? Math.round(latestOperation.sqmTargetYield * 10000) / 100
                : 0
            );
            optionParam.vendorYield.push(Math.round(RTYActual * 10000) / 100);
          } else {
            optionParam.sqmYield.push(0);
            optionParam.vendorYield.push(0);
            vendorYield = 0;
            yieldColor = {};
          }

          dataSet.push({
            dateCode: new Date(record.dateCode),
            customer: validateForm.value.customer ? validateForm.value.customer : customer,
            manufacturerId: records['manufacturerId'],
            projectCode: validateForm.value.projectCode,
            projectName: validateForm.value.projectName,
            stage: records['stageId'],
            part: records['part']['name'],
            partNumber: records['partNumberId'],
            yield: RTYActual ? Math.round(RTYActual * 10000) / 100 : 0,
            yieldColor: yieldColor,
            submitDate: record['vendorRecordSubmitDate']
              ? new Date(record['vendorRecordSubmitDate'])
              : '',
            createDate: record['createDate']
              ? new Date(record['createDate'])
              : '',
            partNumberVendorRecordId: record['partNumberVendorRecordId'],
            vendorRecordStatus: record['vendorRecordStatus'],
            dataSet: this.sort(inputDataSet, x => x['order'])
          });
        });
        const option = this.getSinglePartYrChart(optionParam);
        return {
          dataSet: dataSet,
          option: option
        };
      })
    );
  }

  /**
   * 數組排序
   *
   * @template T
   * @param {Array < any >} arr
   * @param {(x: T) => any} fnc
   * @param {Array<any>} [mappingTable]
   * @returns
   * @memberof ManufaturerInputService
   */
  sort<T>(arr: Array<any>, fnc: (x: T) => any, mappingTable?: Array<any>) {
    return arr.sort((a, b) => {
      const _a = mappingTable ? mappingTable.indexOf(fnc(a)) : fnc(a);
      const _b = mappingTable ? mappingTable.indexOf(fnc(b)) : fnc(b);
      if (_a > _b) {
        return 1;
      } else if (_a < _b) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  /**
   * 繪製 echart
   *
   * @private
   * @param {{sqmYield: any[], vendorYield: any[], date: any[]}} param
   * @returns
   * @memberof ManufaturerInputService
   */
  private getSinglePartYrChart(param: {
    sqmYield: any[];
    vendorYield: any[];
    date: any[];
  }) {
    const showDay = param.date.length > 7 ? 7 : param.date.length;
    const per = 100 / param.date.length;

    const start = param.date.length > 7 ? 100 - (showDay - 1) * per : 0;
    const option = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      legend: {
        data: ['SQM目標良率', '廠商良率'],
        left: 'right',
        top: 'top',
        orient: 'vertical'
      },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: param.date
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} %'
        }
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: start,
          end: 100
        },
        {
          type: 'inside',
          realtime: true,
          start: start,
          end: 100
        }
      ],
      color: ['rgba(0, 102, 255)', 'rgb(255, 195, 0)'],
      series: [
        {
          symbolSize: 8,
          type: 'line',
          name: '廠商良率',
          hoverAnimation: false,
          data: param.vendorYield,
          label: {
            show: true,
            position: 'bottom'
          }
        },
        {
          symbolSize: 8,
          type: 'line',
          name: 'SQM目標良率',
          hoverAnimation: false,
          data: param.sqmYield,
          label: {
            show: true,
            position: 'top'
          }
        }
      ]
    };
    return option;
  }

  /**
   * 廠商良率輸入頁面查詢
   *
   * @param {FormGroup} validateForm
   * @param {any[]} rangePicker
   * @returns {Observable<any>}
   * @memberof ManufaturerInputService
   */
  queryKeyin(validateForm: FormGroup, rangePicker: any[]): Observable<any> {
    return this.query(validateForm, rangePicker).pipe(
      mergeMap(q => {
        if (q.dataSet.length > 0) {
          const res = {
            partNumberVendorRecordId: null,
            vendorRecordStatus: null,
            dataSet: []
          };
          q.dataSet.forEach(dataSet => {
            if (
              new Date(dataSet.dateCode).toLocaleDateString() ===
              new Date(validateForm.value.dateCode).toLocaleDateString()
            ) {
              if (dataSet.dataSet.length > 0) {
                res.partNumberVendorRecordId = dataSet.partNumberVendorRecordId;
                res.vendorRecordStatus = dataSet.vendorRecordStatus;
                res.dataSet = dataSet.dataSet;
              }
            }
          });
          return of(res);
        } else {
          return this.createPartNumberVendorRecords(validateForm, rangePicker);
        }
      })
    );
  }

  /**
   * 當不存在時新建 partNumberVendorRecord
   *
   * @param {FormGroup} validateForm
   * @param {any[]} rangePicker
   * @returns {Observable<any>}
   * @memberof ManufaturerInputService
   */
  createPartNumberVendorRecords(
    validateForm: FormGroup,
    rangePicker: any[]
  ): Observable<any> {
    return this.partNumberVendorRecordApi
      .autoInsertPlantCreate({
        plantId: validateForm.value.plant,
        partNumberVendorId: validateForm.value.partNumberVendor,
        dateCode: new Date(validateForm.value.dateCode).toUTCString(),
        stageId: validateForm.value.stage,
        vendorRecordSubmitDate: null
      })
      .pipe(
        mergeMap(c => {
          return this.query(validateForm, rangePicker);
        }),
        map(q => {
          const res = {
            vendorRecordStatus: null,
            partNumberVendorRecordId: null,
            dataSet: []
          };
          q.dataSet.forEach(dataSet => {
            if (
              new Date(dataSet.dateCode).toLocaleDateString() ===
              new Date(validateForm.value.dateCode).toLocaleDateString()
            ) {
              if (dataSet.dataSet.length > 0) {
                res.partNumberVendorRecordId = dataSet.partNumberVendorRecordId;
                res.vendorRecordStatus = dataSet.vendorRecordStatus;
                res.dataSet = dataSet.dataSet;
              }
            }
          });
          return res;
        })
      );
  }

  /**
   * 存入 廠商輸入數據
   *
   * @param {*} dataSet
   * @returns {Observable<any>}
   * @memberof ManufaturerInputService
   */
  saveInputData(dataSet: any[]): Observable<any> {
    const jobs = [];
    dataSet.forEach(d => {
      jobs.push(
        this.vendorRecordApi.patchAttributes(d.vendorRecordId, {
          input: d.input,
          output: d.output,
          remark: d.remark
        })
      );
      jobs.push(
        this.yieldRateRecordApi.updateVendorYieldExt(
          d.yieldRateRecordId,
          Math.round(d.vendorTargetYieldShow) / 100
        )
      );
    });
    return forkJoin(jobs);
  }

  /**
   * 送出時 修改 partNumberVendorRecord 的 vendorRecordStatus --- 0: No Data; 1: Accept; 2: Open; 3: Reject
   *
   * @param {*} partNumberVendorRecordId
   * @param {*} markRed -- true -> 2: Open;  false -> 1: Accept;
   * @returns
   * @memberof ManufaturerInputService
   */
  submitInputData(partNumberVendorRecordId, markRed) {
    return this.partNumberVendorRecordApi.patchAttributes(
      partNumberVendorRecordId,
      {
        vendorRecordStatus: markRed ? 2 : 1,
        vendorRecordSubmitDate: new Date().toUTCString()
      }
    );
  }

  /**
   * 查詢出 TopIssue中的 值
   *
   * @param {*} datas
   * @returns {Observable<any>}
   * @memberof ManufaturerInputService
   */
  queryTopIssue(datas): Observable<any> {
    return forkJoin(
      datas.map(d => {
        return this.vendorIssueApi.find({
          where: {
            vendorRecordId: d.vendorRecordId
          },
          include: ['vendorRecord']
        });
      })
    ).pipe(
      mergeMap(f => {
        let res = [];
        f.forEach(r => {
          res = res.concat(r);
        });
        if (res.length > 0) {
          return of(res);
        } else {
          return this.createTopIssue(datas);
        }
      }),
      map((m: any[]) => {
        const dataSet = [];
        m.forEach(r => {
          const op = datas.find(f => f.vendorRecordId === r.vendorRecordId);
          dataSet.push({
            vendorRecordId: r.vendorRecordId,
            input: r.input,
            defectQty: r.defectQty,
            owner: r.owner,
            status: r.status,
            vendorIssueId: r.id,
            vendorRecord: r.vendorRecord,
            issue: r.issue ? r.issue : '',
            rootcause: r.rootcause ? r.rootcause : '',
            action: r.action ? r.action : '',
            dueDate: r.dueDate
              ? r.dueDate
              : new Date(new Date().setDate(new Date().getDate() + 4)),
            filePath: r.filePath ? r.filePath : '',

            nfr:
              r.input && r.defectQty
                ? Math.round((r.defectQty / r.input) * 10000) / 100
                : 0,
            operationName: op.operationName,
            operationId: op.operationId
          });
        });
        return dataSet;
      })
    );
  }

  /**
   * status  ->0: No Data; 1: Open; 2: Reject; 3: Ongoing; 4: Tracking; 5: Close
   *
   * @param {*} datas
   * @returns {Observable<any[]>}
   * @memberof ManufaturerInputService
   */
  createTopIssue(datas): Observable<any[]> {
    return forkJoin(
      datas.map(d => {
        const param: any = {
          vendorRecordId: d.vendorRecordId,
          input: d.input,
          owner: localStorage.getItem('$DFI$userID'),
          status: 0
        };
        if (d.defectQty) {
          param.defectQty = d.defectQty;
        }
        if (d.issue) {
          param.issue = d.issue;
        }
        if (d.rootcause) {
          param.rootcause = d.rootcause;
        }
        if (d.action) {
          param.action = d.action;
        }
        if (d.dueDate) {
          param.dueDate = d.dueDate;
        }
        if (d.filePath) {
          param.filePath = d.filePath;
        }
        return this.vendorIssueApi.create(param);
      })
    ).pipe(
      mergeMap((fc: any[]) => {
        return forkJoin(
          fc.map(m => {
            return this.vendorIssueApi.find({
              where: {
                vendorRecordId: m.vendorRecordId
              },
              include: ['vendorRecord']
            });
          })
        );
      }),
      map(m => {
        let res = [];
        m.forEach(r => {
          res = res.concat(r);
        });
        return res;
      })
    );
  }

  /**
   * 更新保存 TopIssue
   *
   * @param {*} datas
   * @param {*} type 'save'|'submit'
   * @returns {Observable<any[]>}
   * @memberof ManufaturerInputService
   */
  updateTopIssue(datas, type): Observable<any[]> {
    return forkJoin(
      datas.map(d => {
        let param: any = {};
        if (type === 'save') {
          param = {
            issue: d.issue,
            defectQty: d.defectQty,
            rootcause: d.rootcause,
            action: d.action,
            dueDate: d.dueDate,
            filePath: d.filePath,
            status: d.status // SQM可修改狀態
          };
        } else if (type === 'submit') {
          param = {
            issue: d.issue,
            defectQty: d.defectQty,
            rootcause: d.rootcause,
            action: d.action,
            dueDate: d.dueDate,
            filePath: d.filePath,
            status: 1 // 廠商送出狀態為open
          };
        } else {
          param = {
            issue: d.issue,
            defectQty: d.defectQty,
            rootcause: d.rootcause,
            action: d.action,
            dueDate: d.dueDate,
            filePath: d.filePath,
            status: 2 // SQM駁回狀態為reject
          };
        }
        return this.vendorIssueApi.patchAttributes(d.vendorIssueId, param);
      })
    );
  }

  checkTopIssueDefectQty(topIssueData: any[], toTopIssueDate: any[]): any {
    const defectQty = toTopIssueDate.reduce((p, t) => {
      if (!p[t['vendorRecordId']]) {
        p[t['vendorRecordId']] = { defectQty: t['input'] - t['output'], filledIn: 0 };
      }
      return p;
    }, {});
    topIssueData.forEach(d => {
      defectQty[d.vendorRecordId].filledIn += d.defectQty;
    });
    return defectQty;
  }

  calWeek(dateCode) {
    this.nowDate = new Date(dateCode);
    // 計算當天是當年的第幾周
    let firstWeekDay;
    let sumDay = 0;
    const year = this.nowDate.getFullYear();
    const month = this.nowDate.getMonth();
    const day = this.nowDate.getDate();
    const weekDay = new Date(year, 0, 1).getDay();

    if (weekDay === 0) {
      firstWeekDay = 1;
    } else {
      firstWeekDay = 8 - weekDay;
    }
    switch (month) {
      case 11:
        sumDay += 30;
      case 10:
        sumDay += 31;
      case 9:
        sumDay += 30;
      case 8:
        sumDay += 31;
      case 7:
        sumDay += 31;
      case 6:
        sumDay += 30;
      case 5:
        sumDay += 31;
      case 4:
        sumDay += 30;
      case 3:
        sumDay += 31;
      case 2:
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          sumDay += 29;
        } else {
          sumDay += 28;
        }
      case 1:
        sumDay += 31;
    }
    sumDay += day;
    return Math.ceil((sumDay - firstWeekDay) / 7) + 1;
  }

  getVendorIssueList(id) {
    return this.vendorIssueApi
      .find({
        where: {
          vendorRecordId: id
        },
        include: {
          relation: 'vendorRecord',
          scope: {
            include: ['partNumberVendorRecord', 'partNumberVendorOperation']
          }
        }
      })
      .pipe(
        map(async data => {
          if (data.length) {
            for (let index = 0; index < data.length; index++) {
              data[index]['vendorIssueId'] = data[index]['id'];
              if (data[index]['vendorRecord']['partNumberVendorOperation']) {
                const operation = await this.operationApi
                  .find({
                    where: {
                      id:
                        data[index]['vendorRecord'][
                        'partNumberVendorOperation'
                        ]['operationId']
                    }
                  })
                  .toPromise();
                data[index]['operationName'] = operation[0]['name'];
              }
              if (data[index]['filePath']) {
                const docType = ['jpg', 'png', 'gif', 'jpeg', 'bmp'];
                if (
                  !docType.includes(
                    data[index]['filePath']
                      .split('.')
                      .pop()
                      .toLowerCase()
                  )
                ) {
                  data[index]['docType'] = false;
                } else {
                  data[index]['docType'] = true;
                }
              }
              data[index]['nfr'] =
                (data[index]['input'] && data[index]['defectQty']) ||
                  data[index]['defectQty'] === 0
                  ? Math.round(
                    (data[index]['defectQty'] / data[index]['input']) * 10000
                  ) / 100
                  : 0;
              data[index]['output'] = data[index]['vendorRecord']['output'];
            }
          }
          return data;
        })
      );
  }

  // 廠商端良率查詢重構 --- 實現by單個料號查詢 or by單個廠商查詢 from view_ManufacturerMaterialYieldRate 和 view_ProcessYieldRate
  manufacturerYieldQuery(validateForm: FormGroup) {
    const query: any = {
      where: {
        and: [{
          dateCode: {
            between: [moment(new Date(validateForm.value.rangePicker[0]).getTime()).format('YYYY-MM-DD'), moment(new Date(validateForm.value.rangePicker[1]).getTime()).format('YYYY-MM-DD')]
          }
        }]
      }
    };
    if (validateForm.value.partNumber) {
      query.where.and.push({ partNumber: validateForm.value.partNumber });
    }
    if (validateForm.value.manufacturer) {
      query.where.and.push({ manufacturer: validateForm.value.manufacturer });
    }
    if (validateForm.value.plant) {
      query.where.and.push({ plant: validateForm.value.plant });
    }
    if (validateForm.value.customer) {
      query.where.and.push({ customer: validateForm.value.customer });
    }
    if (validateForm.value.projectCode) {
      query.where.and.push({ projectCode: validateForm.value.projectCode });
    }
    if (validateForm.value.projectName) {
      query.where.and.push({ projectName: validateForm.value.projectName });
    }
    if (validateForm.value.part) {
      query.where.and.push({ partId: validateForm.value.part });
    }
    if (validateForm.value.stage) {
      query.where.and.push({ stage: validateForm.value.stage });
    }
    if (validateForm.value.partNumberVendor) {
      query.where.and.push({ partNumberVendorId: validateForm.value.partNumberVendor });
    }
    return forkJoin([this.view_ManufacturerMaterialYieldRate.find(query), this.view_ProcessYieldRate.find(query)]).pipe(map((res: any) => {
      const manufacturerData = res[0]; // 廠商端實際生產良率查詢
      const operationData = res[1]; // 單個料號的製程良率查詢

      const optionParam = {
        sqmYield: [],
        vendorYield: [],
        date: []
      };

      manufacturerData.sort(this.sortByDateCode); // 同一料號按dateCode排序
      for (let i = 0; i < manufacturerData.length; i++) {
        const partNumberVendorId = manufacturerData[i].partNumberVendorId; // 指同一個料號
        const partNumberVendorRecordId = manufacturerData[i].partNumberVendorRecordId; // 指同一個dateCode
        // echart需要參數
        optionParam.date.push(
          new Date(manufacturerData[i].dateCode).toLocaleDateString()
        );
        if (operationData.filter(o => o.partNumberVendorId === partNumberVendorId && o.partNumberVendorRecordId === partNumberVendorRecordId).length > 0) {
          const operation = operationData.filter(o => o.partNumberVendorId === partNumberVendorId && o.partNumberVendorRecordId === partNumberVendorRecordId);
          for (let index = 0; index < operation.length; index++) {
            operation[index]['sqmTargetYieldShow'] = Math.round(operation[index].sqmTargetYield * 10000) / 100;
            operation[index]['vendorTargetYieldShow'] = Math.round(operation[index].vendorTargetYield * 10000) / 100;
            // 如果有Input 並且Actual小於MP Goal or C4之前不良數大於0 則mark red
            operation[index]['markRed'] = operation[index].order === operation.length ? (operation[index].vendorTargetYieldId && operation[index].sqmTargetYield && manufacturerData[i].materialActualYield < operation[index].sqmTargetYield ? true : false) : (operation[index].vendorTargetYieldId &&
              operation[index].input && Math.round((operation[index].output / operation[index].input) * 10000) / 10000 < operation[index].sqmTargetYield ||
              (!operation[index].sqmTargetYield &&
                operation[index].input - operation[index].output > 0))
              ? true
              : false;
            if (operation[index].input === 0 && operation[index].output === 0) { // 不計算該製程的良率
              operation[index]['actual'] = 0;
            }
            if (operation[index].operationName === 'RTY') {
              operation[index]['actual'] = manufacturerData[i].materialActualYield;
            }
          }
          manufacturerData[i]['dataSet'] = operation;
          this.sort(manufacturerData[i]['dataSet'], x => x['order']);
          manufacturerData[i]['sqmTargetYield'] = manufacturerData[i]['dataSet'].find(d => d.operationName === 'RTY').sqmTargetYield;
          // 如果RTY的Actual小於MP Goal則mark red
          manufacturerData[i]['yieldColor'] =
            !!manufacturerData[i].materialActualYield ? (manufacturerData[i].materialActualYield < manufacturerData[i].sqmTargetYield
              ? { backgroundColor: 'red', color: '#ccc' }
              : {}) : {};
          // echart需要參數
          optionParam.sqmYield.push(
            manufacturerData[i].sqmTargetYield
              ? Math.round(manufacturerData[i].sqmTargetYield * 10000) / 100
              : 0
          );
          optionParam.vendorYield.push(manufacturerData[i].materialActualYield ? Math.round(manufacturerData[i].materialActualYield * 10000) / 100 : 0);
        } else {
          optionParam.sqmYield.push(0);
          optionParam.vendorYield.push(0);
        }
      }
      const option = this.getSinglePartYrChart(optionParam);
      return {
        dataSet: manufacturerData,
        option: option
      };
    }));
  }

  sortByDateCode(a, b) {
    const v1 = a.partNumber + a.dateCode;
    const v2 = b.partNumber + b.dateCode;
    return v1 == v2 ? 0 : v1 < v2 ? -1 : 1;
  }
}
