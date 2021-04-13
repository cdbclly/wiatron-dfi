import { Injectable } from '@angular/core';
import { ProjectStageSkipReasonApi } from '@service/mrr-sdk/services/custom/ProjectStageSkipReason';
import { View_PieChartApi, ProductTypeStageScoreApi } from './../../../service/mrr-sdk';
@Injectable({
  providedIn: 'root'
})
export class MufrpiedataService {
  projects;
  standardScores;
  skipRemarks;
  constructor(
    private productTypeStageScoreApi: ProductTypeStageScoreApi,
    private projectStageSkipReasonApi: ProjectStageSkipReasonApi,
    private view_PieChartApi: View_PieChartApi
  ) { }

  async getData(bgValue) {
    const jobs = [
      this.view_PieChartApi.find().toPromise(),
      this.productTypeStageScoreApi.find().toPromise(),
      this.projectStageSkipReasonApi.find().toPromise()
    ];
    const jobsResult = await Promise.all(jobs);
    this.projects = jobsResult[0];
    this.standardScores = jobsResult[1];
    this.skipRemarks = jobsResult[2];
    this.projects = this.projects.filter(a => a['plant'] !== null);
    if (bgValue) {
      this.projects = this.projects.filter(a => a['bg'] === bgValue);
    }
    // 若存在partNumberVendorId，先以partNumberVendorId先去重
    const res = new Map();
    const newDatas = this.projects.filter(p => p['partNumberVendorId'] ? (!res.has(p['partNumberVendorId']) && res.set(p['partNumberVendorId'], 1)) : true);
    return newDatas;
  }

  // mrr 厂商资料管理系统饼图分子分母计算
  dealMufrDatas(data) {
    const listData = data.filter(a => a.moduleEnabled); // 过滤掉closed掉的projectCode
    // 機種去重，把c3~c5整理到一筆資料中
    listData.forEach(d => {
      this.projects.forEach(e => {
        if (d.partNumberVendorId) {
          if (d.projectCode === e['projectCode'] && e['partNumberVendorId'] === d.partNumberVendorId) {
            d[`${e['stage']}`] = [];
            d[`${e['stage']}`][0] = e['total'];
            d[`${e['stage']}`][1] = e['totalNotUploaded'];
            d[`${e['stage']}`][2] = e['totalNotVerified'];
            d[`${e['stage']}`][3] = e['totalFailed'];
            d[`${e['stage']}`][4] = e['totalPassed'];
          }
        } else if (d.projectCode === e['projectCode']) {
          d['C3'] = [0, 0, 0, 0, 0];
          d['C4'] = [0, 0, 0, 0, 0];
          d['C5'] = [0, 0, 0, 0, 0];
        }
      });
    });
    const dealData = {};
    let length = 0;
    let length1 = 0;
    let length2 = 0;
    // 分类
    for (const item of data) {
      // c3~c5饼图的分类
      if (!dealData[`C3~C5`]) {
        dealData[`C3~C5`] = {};
      }
      if (!dealData[`C3~C5`][item.productType]) {
        dealData[`C3~C5`][item.productType] = {};
      }
      if (!dealData[`C3~C5`][item.productType][item.plant]) {
        dealData[`C3~C5`][item.productType][item.plant] = {};
      }
      if (!dealData[`C3~C5`][item.productType][item.plant][item.projectCode]) {
        if (item.moduleEnabled) {
          dealData[`C3~C5`][item.productType][item.plant][item.projectCode] = [];
          length++;
          dealData[`C3~C5`][item.productType][item.plant][item.projectCode].push(item);
        }
      } else {
        if (item.moduleEnabled) {
          dealData[`C3~C5`][item.productType][item.plant][item.projectCode].push(item);
        }
      }
      dealData[`C3~C5`]['totalPro'] = length;
      // c4~c5饼图的分类
      if (item.currentStage === 'C4' || item.currentStage === 'C5') {
        if (!dealData[`C4~C5`]) {
          dealData[`C4~C5`] = {};
        }
        if (!dealData[`C4~C5`][item.productType]) {
          dealData[`C4~C5`][item.productType] = {};
        }
        if (!dealData[`C4~C5`][item.productType][item.plant]) {
          dealData[`C4~C5`][item.productType][item.plant] = {};
        }
        if (!dealData[`C4~C5`][item.productType][item.plant][item.projectCode]) {
          if (item.moduleEnabled) {
            dealData[`C4~C5`][item.productType][item.plant][item.projectCode] = [];
            dealData[`C4~C5`][item.productType][item.plant][item.projectCode].push(item);
            length1++;
          }
        } else {
          dealData[`C4~C5`][item.productType][item.plant][item.projectCode].push(item);
        }
        dealData[`C4~C5`]['totalPro'] = length1;
      }
      // c5饼图的分类
      if (item.currentStage === 'C5') {
        if (!dealData[`C5`]) {
          dealData[`C5`] = {};
        }
        if (!dealData[`C5`][item.productType]) {
          dealData[`C5`][item.productType] = {};
        }
        if (!dealData[`C5`][item.productType][item.plant]) {
          dealData[`C5`][item.productType][item.plant] = {};
        }
        if (!dealData[`C5`][item.productType][item.plant][item.projectCode]) {
          if (item.moduleEnabled) {
            dealData[`C5`][item.productType][item.plant][item.projectCode] = [];
            dealData[`C5`][item.productType][item.plant][item.projectCode].push(item);
            length2++;
          }
        } else {
          dealData[`C5`][item.productType][item.plant][item.projectCode].push(item);
        }
        dealData[`C5`]['totalPro'] = length2;
      }
    }
    if (dealData) {
      let rsignC3;
      let rsignC4;
      let rsignC5;
      let gsignC3;
      let gsignC4;
      let gsignC5;
      let proStatus;
      const stages = ['C3', 'C4', 'C5'];
      for (const key in dealData) {
        if (dealData.hasOwnProperty(key)) {
          let goal = 0;
          let ungoal = 0;
          let middle = 0;
          for (const key2 in dealData[key]) {
            if (dealData[key].hasOwnProperty(key2)) {
              for (const key3 in dealData[key][key2]) {
                if (dealData[key][key2].hasOwnProperty(key3)) {
                  const plant = dealData[key][key2][key3];
                  for (const key4 in plant) {
                    if (plant.hasOwnProperty(key4)) {
                      const project = plant[key4];
                      let passNumber = 0;
                      let totalNumber = 0;
                      let c3PassNumber = 0;
                      let c3TotalNumber = 0;
                      let c4PassNumber = 0;
                      let c4TotalNumber = 0;
                      let c5PassNumber = 0;
                      let c5TotalNumber = 0;
                      let proStage;
                      const skipReason = this.skipRemarks.filter(a => a.projectCode === key4 && a.plantName === key3 && a.productId === (key2 === 'null' ? null : key2));
                      if (skipReason.length) {
                        skipReason.forEach(e => {
                          if (e.stage === 'C3') {
                            project['c3Remark'] = e.remark;
                          } else if (e.stage === 'C4') {
                            project['c4Remark'] = e.remark;
                          } else if (e.stage === 'C5') {
                            project['c5Remark'] = e.remark;
                          }
                        });
                        // 同一個機種，沒有skipReason設定為null
                        const missStage = stages.filter(s => !skipReason.find(c => c.stage === s));
                        missStage.forEach(m => {
                          if (m === 'C3') {
                            project['c3Remark'] = null;
                          } else if (m === 'C4') {
                            project['c4Remark'] = null;
                          } else if (m === 'C5') {
                            project['c5Remark'] = null;
                          }
                        });
                      } else {
                        project['c3Remark'] = null;
                        project['c4Remark'] = null;
                        project['c5Remark'] = null;
                      }
                      // 若某階段有輸入不達標原因，則該階段的資料不納入計算
                      for (let index = 0; index < project.length; index++) {
                        const element = project[index];
                        // currentStage為C4時，分4種情況
                        if (element.currentStage === 'C4' && !project['c3Remark'] && !project['c4Remark']) {
                          passNumber += element['C3'][4] + element['C4'][4];
                          totalNumber += element['C3'][0] + element['C4'][0];
                        } else if (element.currentStage === 'C4' && project['c3Remark'] && !project['c4Remark']) {
                          passNumber += element['C4'][4];
                          totalNumber += element['C4'][0];
                        } else if (element.currentStage === 'C4' && !project['c3Remark'] && project['c4Remark']) {
                          passNumber += element['C3'][4];
                          totalNumber += element['C3'][0];
                        } else if (element.currentStage === 'C4' && project['c3Remark'] && project['c4Remark']) {
                          passNumber = 0;
                          totalNumber = 0;
                        }
                        // currentStage為C5時，分7種情況
                        if (element.currentStage === 'C5' && !project['c3Remark'] && !project['c4Remark'] && !project['c5Remark']) {
                          passNumber += element['C3'][4] + element['C4'][4] + element['C5'][4];
                          totalNumber += element['C3'][0] + element['C4'][0] + element['C5'][0];
                        } else if (element.currentStage === 'C5' && project['c3Remark'] && project['c4Remark'] && project['c5Remark']) {
                          passNumber = 0;
                          totalNumber = 0;
                        } else if (element.currentStage === 'C5' && project['c3Remark'] && project['c4Remark'] && !project['c5Remark']) {
                          passNumber += element['C5'][4];
                          totalNumber += element['C5'][0];
                        } else if (element.currentStage === 'C5' && !project['c3Remark'] && project['c4Remark'] && project['c5Remark']) {
                          passNumber += element['C4'][4] + element['C5'][4];
                          totalNumber += element['C4'][0] + element['C5'][0];
                        } else if (element.currentStage === 'C5' && project['c3Remark'] && !project['c4Remark'] && !project['c5Remark']) {
                          passNumber += element['C4'][4] + element['C5'][4];
                          totalNumber += element['C4'][0] + element['C5'][0];
                        } else if (element.currentStage === 'C5' && !project['c3Remark'] && project['c4Remark'] && !project['c5Remark']) {
                          passNumber += element['C3'][4] + element['C5'][4];
                          totalNumber += element['C3'][0] + element['C5'][0];
                        } else if (element.currentStage === 'C5' && !project['c3Remark'] && !project['c4Remark'] && project['c5Remark']) {
                          passNumber += element['C3'][4] + element['C4'][4];
                          totalNumber += element['C3'][0] + element['C4'][0];
                        }
                        // currentStage為C5時，分2種情況
                        if (element.currentStage === 'C3' && !project['c3Remark']) {
                          passNumber += element['C3'][4];
                          totalNumber += element['C3'][0];
                        } else if (element.currentStage === 'C3' && project['c3Remark']) {
                          passNumber = 0;
                          totalNumber = 0;
                        }
                        c3PassNumber += element['C3'][4];
                        c3TotalNumber += element['C3'][0];
                        c4PassNumber += element['C4'][4];
                        c4TotalNumber += element['C4'][0];
                        c5PassNumber += element['C5'][4];
                        c5TotalNumber += element['C5'][0];
                        proStage = element.currentStage;
                      }
                      project['pass'] = passNumber;
                      project['total'] = totalNumber;
                      const projectScores = this.standardScores.filter(a => a.productType === key2);
                      projectScores.forEach(ee => {
                        if (ee['sign'] === 'R') {
                          rsignC3 = ee['C3Score'];
                          rsignC4 = ee['C4Score'];
                          rsignC5 = ee['C5Score'];
                        } else if (ee['sign'] === 'G') {
                          gsignC3 = ee['C3Score'];
                          gsignC4 = ee['C4Score'];
                          gsignC5 = ee['C5Score'];
                        }
                      });
                      // 判斷機種燈號以及每個stage的燈號
                      const tem = Number(passNumber / totalNumber).toFixed(1);
                      project['passRate'] = Number(tem);
                      const c3Tem = Number(c3PassNumber / c3TotalNumber).toFixed(1);
                      const c4Tem = Number(c4PassNumber / c4TotalNumber).toFixed(1);
                      const c5Tem = Number(c5PassNumber / c5TotalNumber).toFixed(1);
                      // 機種燈號判斷
                      if (!totalNumber) {
                        project['status'] = 'red';
                        project['passRate'] = 0;
                      } else if (proStage === 'C3') {
                        if (tem <= rsignC3) {
                          project['status'] = 'red';
                        } else if (tem >= gsignC3) {
                          project['status'] = 'green';
                        } else {
                          project['status'] = 'yellow';
                        }
                      } else if (proStage === 'C4') {
                        if (tem <= rsignC4) {
                          project['status'] = 'red';
                        } else if (tem >= gsignC4) {
                          project['status'] = 'green';
                        } else {
                          project['status'] = 'yellow';
                        }
                      } else if (proStage === 'C5') {
                        if (tem <= rsignC5) {
                          project['status'] = 'red';
                        } else if (tem >= gsignC5) {
                          project['status'] = 'green';
                        } else {
                          project['status'] = 'yellow';
                        }
                      }
                      // stage燈號判斷，如果某个阶段的有填理由，為黃色，总数为0，则为红色
                      if (proStage === 'C3') {
                        // C3
                        if (project['c3Remark']) {
                          project['c3Status'] = 'yellow';
                        } else if (c3Tem <= rsignC3 || !c3TotalNumber) {
                          project['c3Status'] = 'red';
                        } else if (c3Tem >= gsignC3) {
                          project['c3Status'] = 'green';
                        } else {
                          project['c3Status'] = 'yellow';
                        }
                        project['c4Status'] = 'black';
                        project['c5Status'] = 'black';
                      } else if (proStage === 'C4') {
                        // C3
                        if (project['c3Remark']) {
                          project['c3Status'] = 'yellow';
                        } else if (c3Tem <= rsignC3 || !c3TotalNumber) {
                          project['c3Status'] = 'red';
                        } else if (c3Tem >= gsignC3) {
                          project['c3Status'] = 'green';
                        } else {
                          project['c3Status'] = 'yellow';
                        }
                        // C4
                        if (project['c4Remark']) {
                          project['c4Status'] = 'yellow';
                        } else if (c4Tem <= rsignC4 || !c4TotalNumber) {
                          project['c4Status'] = 'red';
                        } else if (c4Tem >= gsignC4) {
                          project['c4Status'] = 'green';
                        } else {
                          project['c4Status'] = 'yellow';
                        }
                        project['c5Status'] = 'black';
                      } else if (proStage === 'C5') {
                        // C3
                        if (project['c3Remark']) {
                          project['c3Status'] = 'yellow';
                        } else if (c3Tem <= rsignC3 || !c3TotalNumber) {
                          project['c3Status'] = 'red';
                        } else if (c3Tem >= gsignC3) {
                          project['c3Status'] = 'green';
                        } else {
                          project['c3Status'] = 'yellow';
                        }
                        // C4
                        if (project['c4Remark']) {
                          project['c4Status'] = 'yellow';
                        } else if (c4Tem <= rsignC4 || !c4TotalNumber) {
                          project['c4Status'] = 'red';
                        } else if (c4Tem >= gsignC4) {
                          project['c4Status'] = 'green';
                        } else {
                          project['c4Status'] = 'yellow';
                        }
                        if (project['c5Remark']) {
                          project['c5Status'] = 'yellow';
                        } else if (c5Tem <= rsignC5 || !c5TotalNumber) {
                          project['c5Status'] = 'red';
                        } else if (c5Tem >= gsignC5) {
                          project['c5Status'] = 'green';
                        } else {
                          project['c5Status'] = 'yellow';
                        }
                      }
                      proStatus = project['status'];

                      if (proStatus === 'red') {
                        ungoal++;
                      } else if (proStatus === 'green') {
                        goal++;
                      } else {
                        middle++;
                      }
                    }
                  }
                }
              }
            }
          }
          dealData[key]['qualifiedPro'] = goal;
          dealData[key]['unqualifiedPro'] = ungoal;
          dealData[key]['generalPro'] = middle;
        }
      }
      return dealData;
    }
  }
}
