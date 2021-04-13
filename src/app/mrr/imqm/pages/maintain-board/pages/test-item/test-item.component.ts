import { ExcelToolsService } from './../../../../imqm-common/service/excel-tools.service';
import { TranslateService } from '@ngx-translate/core';
import { TestItemService } from './test-item.service';
import { SelectItems } from './../../../../imqm-common/toolKits/model';
import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzI18nService, en_US, zh_TW, NzModalService } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { getSelectLocal } from 'app/mrr/imqm/imqm-common/toolKits/autoSelect';

@Component({
  selector: 'app-test-item',
  templateUrl: './test-item.component.html',
  styleUrls: ['./test-item.component.scss']
})
export class TestItemComponent implements OnInit {
  selectItem: SelectItems;
  subject = 'testItem';
  require = false;
  isShow = true;
  styleShow = false;
  queryData = {};
  // 测项群组
  testGroupData = [];
  groupId: number = -1;
  groupName: string;
  // 测试项名称
  dataSet = [];
  uploadFileName: string;
  inputdata = [];
  progressBar = 100; // 上传进度条的数值
  showProgress = true; // 是否显示进度条
  proStatus = 'active'; // 进度条的状态
  editItem = {};
  destroy$ = new Subject();
  trans: object = {};
  addProcessFlag = false;
  oneName: string;
  // 还原被编辑的数据
  restoreEditData = {};
  editStatus = false
  i = 1;
  editCache = {};
  // 上传的excel数据
  newDatas = [];
  // 变形度,外观,count spc\cpk不能编辑
  disabledEdite = false;
  detailGroupID = undefined;
  all_switchSPC = false;
  all_switchCPK = false
  constructor(
    private message: NzMessageService,
    private testItemService: TestItemService,
    private translate: TranslateService,
    private nzI18nService: NzI18nService,
    private modalService: NzModalService,
    private excelService: ExcelToolsService
  ) {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['imq-yr-dimension', 'imq-yr-deformation', 'imq-yr-outlook', 'imq-yr-measurement', 'imq-yr-count',
        'imq-yr-alerta', 'imq-yr-alertb', 'imq-yr-alertc', 'imq-yr-alertd', 'imq-yr-alerte', 'imq-yr-alertef', 'imq-allSwitch1', 'imq-allSwitch2']).subscribe(res => {
          this.trans['dimension'] = res['imq-yr-dimension'];
          this.trans['deformation'] = res['imq-yr-deformation'];
          this.trans['outlook'] = res['imq-yr-outlook'];
          this.trans['measurement'] = res['imq-yr-measurement'];
          this.trans['count'] = res['imq-yr-count'];

          this.trans['alerta'] = res['imq-yr-alerta'];
          this.trans['alertb'] = res['imq-yr-alertb'];
          this.trans['alertc'] = res['imq-yr-alertc'];
          this.trans['alertd'] = res['imq-yr-alertd'];
          this.trans['alerte'] = res['imq-yr-alerte'];
          this.trans['alertf'] = res['imq-yr-alertef'];
          this.trans['on'] = res['imq-allSwitch2'];
          this.trans['off'] = res['imq-allSwitch1']
          if (cur.lang === 'en') {
            this.nzI18nService.setLocale(en_US);
          } else {
            this.nzI18nService.setLocale(zh_TW);
          }
        });
    });
  }


  ngOnInit() {
    this.translate.get(['imq-yr-dimension', 'imq-yr-deformation', 'imq-yr-outlook', 'imq-yr-measurement', 'imq-yr-count',
      'imq-yr-alerta', 'imq-yr-alertb', 'imq-yr-alertc', 'imq-yr-alertd', 'imq-yr-alerte', 'imq-yr-alertef', 'imq-allSwitch1', 'imq-allSwitch2']).subscribe(res => {
        this.trans['dimension'] = res['imq-yr-dimension'];
        this.trans['deformation'] = res['imq-yr-deformation'];
        this.trans['outlook'] = res['imq-yr-outlook'];
        this.trans['measurement'] = res['imq-yr-measurement'];
        this.trans['count'] = res['imq-yr-count'];

        this.trans['alerta'] = res['imq-yr-alerta'];
        this.trans['alertb'] = res['imq-yr-alertb'];
        this.trans['alertc'] = res['imq-yr-alertc'];
        this.trans['alertd'] = res['imq-yr-alertd'];
        this.trans['alerte'] = res['imq-yr-alerte'];
        this.trans['alertf'] = res['imq-yr-alertef'];
        this.trans['on'] = res['imq-allSwitch2'];
        this.trans['off'] = res['imq-allSwitch1']

        const lastSelectItem = getSelectLocal(this.subject);
        if (lastSelectItem) {
          this.query(lastSelectItem[this.subject]);
        }
      });
  }


  query(params) {
    this.styleShow = false;
    this.selectItem = params;
    this.queryData = {
      site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
      model: this.selectItem.cur_model, vendor: this.selectItem.cur_vendor, productName: this.selectItem.cur_proName, partNumber: this.selectItem.cur_materialNo,
      startTime: this.selectItem.date_from, endTime: this.selectItem.date_to
    };
    this.getAllData(this.queryData);
  }

  async getAllData(data) {
    const queryData = await this.testItemService.getTestGroupData(data);
    this.testGroupData = [];
    for (const item of queryData) {
      const tempGroup = {};
      tempGroup['isGroupAble'] = item['isGroupAble'];
      tempGroup['groupName'] = item['groupName'];
      tempGroup['chineseName'] = item['chineseName'];
      tempGroup['groupName1'] = this.getTestName(item['groupName']);
      tempGroup['count'] = item['TestItemDetail'] ? item['TestItemDetail'].length : 0;
      tempGroup['id'] = item['id'];
      tempGroup['TestItemDetail'] = item['TestItemDetail'];
      this.testGroupData.push(tempGroup);
    }
    this.getSort(this.testGroupData)
  }


  // 固定顺序
  getSort(data) {
    if (data['length'] > 0) {
      const arr = [,,,,];
      for (const item of data) {
        if (item.groupName === 'sizeData') {
          arr[0] = item;
        }
        if (item.groupName === 'deformationData') {
          arr[1] = item;
        }
        if (item.groupName === 'visualizationData') {
          arr[2] = item;
        }
        if (item.groupName === 'measurementData') {
          arr[3] = item;
        }
        if (item.groupName === 'countData') {
          arr[4] = item;
        }
      }
      this.testGroupData = arr;
    }
    console.log('allData === \n', this.testGroupData)
  }

  // 转化名称
  getTestName(data: string) {
    if (data) {
      if (data === "deformationData") {
        return this.trans['deformation'];
      }
      if (data === "sizeData") {
        return this.trans['dimension'];
      }
      if (data === "visualizationData") {
        return this.trans['outlook'];
      }
      if (data === "measurementData") {
        return this.trans['measurement'];
      }
      if (data === "countData") {
        return this.trans['count'];
      }
    }
  }



  // 显示测试项名称table
  showNextTab(data, groupData?) {
    console.log(data, groupData)
    this.detailGroupID = data;
    this.newDatas = [];
    this.inputdata = [];
    this.uploadFileName = null;
    this.groupName = groupData.groupName1;
    this.groupId = data;
    // 根据 id 获取testGroupData中测试项名称的数据
    this.getTestItemData(data);
    this.styleShow = true;

    if (groupData.groupName === "deformationData") {
      this.disabledEdite = true;
    }
    if (groupData.groupName === "visualizationData") {
      this.disabledEdite = true;
    }
    if (groupData.groupName === "countData") {
      this.disabledEdite = true;
    }
    if (groupData.groupName === "measurementData" || groupData.groupName === "sizeData") {
      this.disabledEdite = false;
    }
  }


  // 获取测试项名称数据
  getTestItemData(data) {
    let tempItemData = this.testGroupData.filter(res => res['id'] === data)[0]['TestItemDetail'];
    // tempItemData = [];
    if (tempItemData.length === 0) {
      // this.styleShow = false;
      this.dataSet = [];
      return;
    }
    this.dataSet = [];
    for (let i = 0; i < tempItemData.length; i++) {
      const tempItem = {}
      tempItem['isAble'] = tempItemData[i]['isAble'];
      tempItem['itemName'] = tempItemData[i]['itemName'];
      tempItem['index'] = i + 1;
      tempItem['isSpcAble'] = tempItemData[i]['isSpcAble'];
      tempItem['isCpkAble'] = tempItemData[i]['isCpkAble'];
      tempItem['id'] = tempItemData[i]['id'];
      this.dataSet.push(tempItem);
    }
    this.allOpen('all', this.dataSet);
    this.updateEditCache();
  }

  // 测试群组 switch 开关
   testGroupSwitchChange(data) {
    if (data.isGroupAble) {
      data.isGroupAble = 1;
    } else {
      data.isGroupAble = 0;
    }
    const testGroupData = {
      id: data.id,
      site: this.queryData['site'],
      plant: this.queryData['plant'],
      product: this.queryData['product'],
      customer: this.queryData['customer'],
      vendor: this.queryData['vendor'],
      model: this.queryData['model'],
      productName: this.queryData['productName'],
      partNumber: this.queryData['partNumber'],
      groupName: data['groupName'],
      chineseName: data['chineseName'],
      isGroupAble: data['isGroupAble'],
      updatedUser: localStorage.getItem('$DFI$userID'),
      updatedTime: new Date().getTime(),
    };
     this.testItemService.groupStatusChange(testGroupData).subscribe(res => {
      // console.log('测试群组开关 \n', res)
      if (!(res['updatedUser'] && res['groupName'])) {
        // 修改失败，刷新数据
        this.getAllData(this.queryData);
      }
      // else {
      //   // console.log('testGroupData = \n', this.testGroupData)
      // }
    });
  }



  startEdit(data): void {
    this.editStatus = true;
    this.restoreEditData = data;
    // 获取要编辑的数据
    this.editCache[data.id].edit = true;
  }

  // 取消修改的时候需要还原原始数据
  cancelEdit(data): void {
    this.editCache[data.id].edit = false;
    this.editCache[data.id].data.itemName = this.restoreEditData['itemName'];
    this.editStatus = false;
  }

  async saveEdit(id: string) {
    const index = this.dataSet.findIndex(item => item.id === id);
    const editData = String(this.editCache[id].data.itemName).trim();
    if (this.strLen(editData) > 20) {
      this.message.create('info', this.trans['alerta']);
      return;
    }
    // 验证当修改的测试项名称是否存在已经有的数据中
    const exsitData = this.dataSet.filter(res => res['itemName'] === editData);
    if (exsitData.length > 0 && (this.dataSet[index].itemName !== editData)) {
      this.message.create('info', this.trans['alertb']);
      return;
    };
    // 如果测试项名称没有改动
    if (this.dataSet[index].itemName === editData) {
      Object.assign(this.dataSet[index], this.editCache[id].data);
      this.editCache[id].edit = false;
      this.editStatus = false;
      return;
    }
    Object.assign(this.dataSet[index], this.editCache[id].data);
    this.editCache[id].edit = false;
    this.editStatus = false;
    let tempItem = {};
    tempItem = {
      isAble: this.dataSet[index].isAble,
      itemName: this.dataSet[index].itemName,
      isSpcAble: this.dataSet[index].isSpcAble,
      isCpkAble: this.dataSet[index].isCpkAble,
      groupId: this.groupId,
      updatedUser: localStorage.getItem('$DFI$userID'),
      updatedTime: new Date().getTime(),
      id: this.dataSet[index].id
    };
    await this.testItemService.updateItemTestData(tempItem);
    // 数据刷新
    await this.getAllData(this.queryData);
    this.getTestItemData(this.groupId);
    this.addProcessFlag = false;
  }

  // 初始化编辑状态
  updateEditCache(): void {
    this.editCache = {};
    this.dataSet.forEach(item => {
      if (!this.editCache[item.id]) {
        this.editCache[item.id] = {
          edit: false,
          data: { ...item }
        };
      }
    });
  }

  // 测试项目名称 switch开关
  testItemSwitchChange(data) {
    this.testItemStatusChange(data);
  }
  spcSwitchChange(data, detailData) {
    this.testItemStatusChange(data, 'spc', detailData);
  }
  cpkSwitchChange(data, detailData) {
    this.testItemStatusChange(data, 'cpk', detailData);
  }

  async testItemStatusChange(data, tag?, detailData?) {
    // console.log(data)
    const keyArr = ['isCpkAble', 'isSpcAble', 'isCpkAble'];
    for (const key of keyArr) {
      if (data[key]) {
        data[key] = 1;
      } else {
        data[key] = 0;
      }
    }
    const tempItem = {
      isAble: data.isAble,
      itemName: data.itemName,
      isSpcAble: data.isSpcAble,
      isCpkAble: data.isCpkAble,
      groupId: this.groupId,
      updatedUser: localStorage.getItem('$DFI$userID'),
      updatedTime: new Date().getTime(),
      id: data.id
    };
    await this.testItemService.updateItemTestData(tempItem);
    // 数据刷新
    await this.getAllData(this.queryData);
    this.getTestItemData(this.groupId);
    this.addProcessFlag = false;
    this.allOpen(tag, detailData);
  }


  sortData() {
    const arrItem = [];
    for (const item of this.dataSet) {
      arrItem.push(item['itemName']);
    }

    const regEng = /[a-zA-Z]/g;
    const regChar = /[\u4e00-\u9fa5]/g;
    const regNum = /[0-9]/g;
    let arrGroup = [];
    let arrChar = [];
    for (let index = 0; index < arrItem.length; index++) {
      const element = arrItem[index];
      let num = element.replace(regEng, '').replace(regChar, '');
      num = (num == null || num == '' || num == undefined) ? 0 : num;
      let strChar = element.replace(regNum, '').replace(/\s*/g, "");
      if (arrChar.indexOf(strChar) === -1) {
        arrChar.push(strChar);
      }
      const strNum = String(num).replace(/\s*/g, "");
      arrGroup.push({ arrName: element, arrChar: strChar, arrNum: parseInt(strNum) });
    }

    let result = [];
    for (let i = 0; i < arrChar.length; i++) {
      let matchData = arrGroup.filter(x => x.arrChar == arrChar[i]);
      matchData = matchData.sort(function (a, b) {
        return a.arrNum - b.arrNum;
      });
      for (let j = 0; j < matchData.length; j++) {
        result.push(matchData[j].arrName);
      }
    }
    const tempArr = [];
    for (const item of result) {
      tempArr.push(this.dataSet.filter(res => res['itemName'] === item)[0]);
    }
    this.dataSet =  tempArr;
  }



  // 单笔数据新增
  addOneData() {
    this.addProcessFlag = true;
  }
  processModelCancel() {
    this.addProcessFlag = false;
    this.oneName = '';
  }

  async processModelOk() {
    const testItemDetail = this.testGroupData.filter(res => res['id'] === this.detailGroupID)[0];
    //  确定新增，需要检测字符串长度；去除前后空格
    const name = String(this.oneName).trim();
    if (name) {
      if (this.strLen(name) > 20) {
        this.message.create('info', this.trans['alerta']);
      } else {
        // 验证当前新增一笔的测试项名称是否存在已经有的数据中
        const exsitData = this.dataSet.filter(res => res['itemName'] === name);
        if (exsitData.length > 0) {
          this.message.create('info', this.trans['alertb']);
          return
        };
        let tempItem = {};
        tempItem = {
          isAble: 1,
          itemName: name,
          isSpcAble: (testItemDetail['groupName'] === 'sizeData' || testItemDetail['groupName'] === 'measurementData') ? 1 : 0,
          isCpkAble: (testItemDetail['groupName'] === 'sizeData' || testItemDetail['groupName'] === 'measurementData') ? 1 : 0,
          groupId: this.groupId,
          updatedUser: localStorage.getItem('$DFI$userID'),
          updatedTime: new Date().getTime()
        };
        await this.testItemService.addItemTestData(tempItem);
        // 数据刷新
        await this.getAllData(this.queryData);
        this.getTestItemData(this.groupId);
        this.oneName = '';
        this.addProcessFlag = false;
      }
    }
  }

  strLen(sString) {
    var j = 0;
    var s = sString;
    if (s == "") return j;
    for (var i = 0; i < s.length; i++) {
      if (s.substr(i, 1).charCodeAt(0) > 255) j = j + 2;
      else j++
    }
    return j;
  }



  // 下载数据模板
  downloadTemp() {
    if (this.dataSet.length > 0) {
      this.downloadData();
    } else {
      // 获取config中的模板
      this.testItemService.getTemplateFile().toPromise().then(res => {
        this.excelService.exportAsExcelFile(JSON.parse(JSON.stringify(res)), 'testItemTemplate');
      });
    }
  }



  //  上传excel
  uploadExcel(evt: any) {
    this.uploadFileName = evt.files[0].name;
    if (evt.files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      evt.files[0].type !== 'application/vnd.ms-excel') {
      this.message.create('info', this.trans['alertc']);
      return;
    }
    const reader: FileReader = new FileReader();
    // reader.readAsArrayBuffer(evt.files[0]);
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      /* save data */
      this.inputdata = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // console.log('读到的数据--- \n', this.inputdata);
    };
    reader.readAsBinaryString(evt.files[0]);
  }



  uploadExcelData() {
    if (this.inputdata.length === 0) {
      this.message.create('info', this.trans['alertd']);
      return;
    }
    this.showProgress = false;
    this.newDatas = [];
    for (let index = 1; index < this.inputdata.length; index++) {
      this.progressBar = parseInt((parseFloat((index / (this.inputdata.length - 1)).toFixed(2)) * 100).toFixed(3), 0);
      const ele = this.inputdata[index];
      let data;
      // 判断测试项名称字符串长度
      const strLength = this.strLen(String(ele[0]).trim());
      if (strLength > 20) {
        this.message.create('info', this.trans['alertf'] + (index + 1) + this.trans['alerte']);
        this.showProgress = true;
        this.proStatus = 'active';
        return;
      }

      const testItemDetail = this.testGroupData.filter(res => res['id'] === this.detailGroupID)[0];
      if (strLength > 0 && String(ele[0]).trim() !== 'undefined') {
        data = {
          groupId: this.groupId,
          itemName: String(ele[0]).trim(),
          isAble: 1,
          isSpcAble: (testItemDetail['groupName'] === 'sizeData' || testItemDetail['groupName'] === 'measurementData') ? 1 : 0,
          isCpkAble: (testItemDetail['groupName'] === 'sizeData' || testItemDetail['groupName'] === 'measurementData') ? 1 : 0,
          updatedUser: localStorage.getItem('$DFI$userID'),
          updatedTime: new Date().getTime()
        };
        this.newDatas.push(data);
        // 去除要上传的新数据重复测试项名称数据
        let singleDataArr = [];
        const obj = {};
        // tslint:disable-next-line: no-shadowed-variable
        singleDataArr = this.newDatas.reduce((item: any, next) => {
          // tslint:disable-next-line: no-unused-expression
          obj[next.itemName] ? '' : obj[next.itemName] = true && item.push(next);
          return item;
        }, []);
        this.newDatas = singleDataArr;
      }

      if (this.inputdata.length - 1 === index) {
        this.proStatus = 'success';
        this.showConfirm(); // 处理好上传资料后会弹出确认上传框
      }
    }
  }


  showConfirm() {
    this.modalService.confirm({
      nzTitle: '<i>是否上传文件?</i>',
      nzContent: '',
      nzOnOk: async () => { this.uploadOk(); this.showProgress = true; this.proStatus = 'active'; },
      nzOnCancel: () => { this.showProgress = true; this.proStatus = 'active'; }
    });
  }

  async uploadOk() {
    await this.testItemService.uploadExcelData(this.newDatas, this.groupId);
    this.newDatas = [];
    this.inputdata = [];
    this.uploadFileName = null;
    // 数据刷新
    await this.getAllData(this.queryData);
    this.getTestItemData(this.groupId);
    this.addProcessFlag = false;
  }



  async allSwitchValue(data) {
    const testItemDetail = this.testGroupData.filter(res => res['id'] === this.detailGroupID)[0]['TestItemDetail'];
    // debugger
    // console.log(testItemDetail)
    const upLoadData = [];
    if (data === 'spc') {
      for (let i = 0; i < testItemDetail.length; i++) {
        const tempItem = {
          isAble: testItemDetail[i].isAble,
          itemName: testItemDetail[i].itemName,
          isSpcAble: this.all_switchSPC ? 1 : 0,
          isCpkAble: testItemDetail[i].isCpkAble,
          id: testItemDetail[i].id,
          updatedUser: localStorage.getItem('$DFI$userID'),
          updatedTime: new Date().getTime(),
          groupId: testItemDetail[i].groupId
        };
        upLoadData.push(tempItem);
      }
    }

    if (data === 'cpk') {
      for (let i = 0; i < testItemDetail.length; i++) {
        const tempItem = {
          isAble: testItemDetail[i].isAble,
          itemName: testItemDetail[i].itemName,
          isSpcAble: testItemDetail[i].isSpcAble,
          isCpkAble: this.all_switchCPK ? 1 : 0,
          groupId: testItemDetail[i].groupId,
          updatedUser: localStorage.getItem('$DFI$userID'),
          updatedTime: new Date().getTime(),
          id: testItemDetail[i].id
        };
        upLoadData.push(tempItem);
      }
    }

       await this.testItemService.updateMany(upLoadData);
      // 数据刷新
      await this.getAllData(this.queryData);
      this.getTestItemData(this.groupId);
  }


  // 判断全选switch是否全部打开
  allOpen(tag, detailData) {
    if(tag === 'cpk') {
      if (detailData.filter(item => item['isCpkAble'] === 0)['length'] === 0) {
        this.all_switchCPK = true;
      } else {
        this.all_switchCPK = false;
      }
    }

    if(tag === 'spc') {
      if (detailData.filter(item => item['isSpcAble'] === 0)['length'] === 0) {
        this.all_switchSPC = true;
      } else {
        this.all_switchSPC = false;
      }
    }

    if(tag === 'all') {
      if (detailData.filter(item => item['isSpcAble'] === 0)['length'] === 0) {
        this.all_switchSPC = true;
      } else {
        this.all_switchSPC = false;
      }

      if (detailData.filter(item => item['isCpkAble'] === 0)['length'] === 0) {
        this.all_switchCPK = true;
      } else {
        this.all_switchCPK = false;
      }
    }
  }








  // 下载表格##
  downloadData() {
    if (this.dataSet) {
      const colWidth = [];
      const downLoadData = [];
      const key = 'Test Item';
      for (const item of this.dataSet) {
        const tempDic = {
          [key]: item.itemName
        };
        downLoadData.push(tempDic);
      }
      Object.keys(downLoadData[0]).forEach(element => {
        colWidth.push({ wpx: 120 });
      });
      const headerBgColor = '53868B';
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(downLoadData)), key, colWidth, headerBgColor);
    }
  }
}
