import { Component, OnInit } from '@angular/core';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import { NzModalService } from 'ng-zorro-antd';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';
import { DatePipe } from '@angular/common';
import { SpecMemberListService } from './spec-member-list.service';

@Component({
  selector: 'app-spec-member-list',
  templateUrl: './spec-member-list.component.html',
  styleUrls: ['./spec-member-list.component.scss']
})
export class SpecMemberListComponent implements OnInit 
{
  cur_site;
  cur_plant;
  project = [];
  projectGroup = [];
  plantGroup = [];
  addPlantGroup = [];
  siteGroup = [];
  addSiteGroup = [];
  kpiInfos = [];
  cur_section;
  cur_sectionId;
  sectionGroup = [];
  ckpiInfos;
  cur_model = [];
  cur_stage = [];
  queryButton = true;
  editMap = new Map<string, boolean>();
  modelGroup = [];
  editItem = {};
  isVisible = false;
  isVisible_log = false;
  disableedit = false;
  nzScroll: {} = { x: '1210px' };
  showSample: Boolean = false;
  cur_project: string;
  model: string | null;
  phase: string | null;
  prnum: number | null;
  add_plant: string | null;
  stageCode: string | null;
  setting1: string | null; setting2: string | null;
  upperCpk: number | null; lowerCpk: number | null;
  pcs: number | null; // 取样数量
  upn: string | null; // 架构
  dateRangeFrom;
  dateRangeTo;
  member
  maintain_list = [];
  maintain_list1 = ['Plant', 'Model Name', 'Stage Code', '預警SPEC(Upper Limit)', '預警SPEC(Lower Limit)'];
  maintain_list2 = ['Plant', 'Model Name', 'Stage Code', 'Test item name', 'Sub test item name', 'Upper Limit', 'Lower Limit', 'pcs'];
  addModelStageInfos;
  modelFlteredOptions = []; // 新增项目时，model 的autocompelete暂存项目
  stageFlteredOptions = [];
  addModelGroup = [];
  addStageGroup = [];
  add_site;
  objectKeys = Object.keys;
  objectValue = Object.values;
  role;
  tmp_arr;
  siteInfos;
  curEditRow; // 當前正在編輯的一筆資料
  curPage; // 當前的頁數
  curPagelog; // log的当前页面
  // upload
  uploadFileName: string;
  inputdata = [];
  newDatas; // 文件上传的资料（已去除重复的）
  showProgress = true; // 是否显示进度条
  progressBar = 0; // 上传进度条的数值
  proStatus = 'active'; // 进度条的状态
  logInfos = [];  // 日志信息
  footer = null;
  constructor(
    private dataService: LineDataServiceService,
    private message: NzMessageService,
    private _service: SpecMemberListService,
    private modalService: NzModalService,
    private excelService: ExcelToolService,
    private datePipe: DatePipe
  ) 
  { 

  }

  ngOnInit() {
    const role_arr = JSON.parse(localStorage.getItem('$DFI$UserAuth'));
    // this.siteInfos = JSON.parse(localStorage.getItem('Skyeye_plantMapping')).filter(res => res['Site'] === localStorage.getItem('DFC_Site').toUpperCase());
    this.siteInfos = JSON.parse(localStorage.getItem('Skyeye_plantMapping'));
    this.addSiteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    this.siteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    this.role = role_arr['SkyeyeTestItemMaintain'];
  }

  // 选中下拉框的数据调用
  async getOptions(type) {
    if (type === 'plant') {
      this.modelGroup = [];
      this.filterData();
      this.cur_plant = undefined;
      this.project = [];
      this.cur_model = [];
      this.queryButton = true;
    }
    if (type === 'project') {
      this.modelGroup = [];
      this.filterData();
      this.project = [];
      this.cur_model = [];
      this.queryButton = false;
      if (this.cur_plant === null) {
        this.queryButton = true;
      }
    }

    if (type === 'model') {
      this.filterData();
      this.cur_model = [];
      console.log(this.kpiInfos);
    }
    if (type === 'query') {
      this.filterData();
      console.log(this.kpiInfos);
    }

    if (type === 'addSite') {
      this.addPlantGroup = this.siteInfos.filter(res => res['Site'] === this.add_site).map(res => {
        return res['Plant'];
      });
    }
    if (type === 'addPlant') {
      this._service.getAddModelStage(this.add_plant).subscribe(res => {
        this.addModelStageInfos = res;
        this.addModelGroup = this.addModelStageInfos.map(item => item['modelId']);
        this.addModelGroup = Array.from(new Set(this.addModelGroup));
        this.modelFlteredOptions = Object.values(this.addModelGroup);
        // this.stageFlteredOptions = [];
      });
    }
    if (type === 'addModel') {
      console.log(this.model);
      this.addStageGroup = this.addModelStageInfos.map(item => item['stageId']);
      this.addStageGroup = Array.from(new Set(this.addStageGroup));
      this.stageFlteredOptions = Object.values(this.addStageGroup);
    }
  }

  showLog(id) {
    if (id) {
      this._service.getLogDetail(id).subscribe(res => {
        this.isVisible_log = true;
        console.log(res);
        this.logInfos = res;
      });
    } else {
      this.isVisible_log = true;
      this.logInfos = [];
    }
  }

  // 点击到输入框时调用
  async getOptList(type) {
    if (type === 'model') {
      if (this.cur_site !== null && this.cur_plant !== null && this.cur_site !== undefined && this.cur_plant !== undefined) {
        this.tmp_arr = this.cur_model;
        this.cur_model = [];
        await this.filterData();
        this.cur_model = this.tmp_arr;
        this.modelGroup = this.dataService.groupBy(this.kpiInfos, 'model');
      }

      // console.log(this.kpiInfos);
    }
    if (type === 'plant') {
      // 獲取資料
      this.kpiInfos = await this.dataService.getRecipientApi(this.cur_plant); // 獲取WKS的KPI
      this.tmp_arr = this.cur_plant;
      this.cur_plant = '';
      await this.filterData();
      this.cur_plant = this.tmp_arr;
      this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
        return res['Plant'];
      });
      console.log(this.kpiInfos);
    }

    if (type === 'section')
    {
      this.sectionGroup=[];
      this.dataService.getSectionsByPlant(this.cur_plant).subscribe(res => {
        this.sectionGroup = res.map(section => {
          {
            return section;
          }
        });
        this.sectionGroup = this.sectionGroup.filter(ress => ress !== null);
        this.sectionGroup = Array.from(new Set(this.sectionGroup));
        console.log('section = '+this.sectionGroup);
      });
    }
  }

  // 再次点击编辑以后保存功能
  async saveRow(ele, data) {
    // console.log(this.editMap, ele);
    // console.log('再次点击编辑以后保存功能对应的数据 -- \n', ele);
    const existdata = await this.dataService.getRecipientApiByAllOptions1(ele['plantId'], ele['model'],ele['plantName'],ele['stageId'],ele['phase']);
    console.log('elephase === \n', ele['phase']);
    console.log('curEditRowphase === \n', this.curEditRow['phase']);
    // 检查的栏位都没修改
    if (ele['model'] === this.curEditRow['model']) {
      if (existdata.length > 1) {
        this.message.create('info', '修改失敗，存在重複');
        this.editMap.set(ele['id'], false);
        this.disableedit = false;
        return;
      }
    } else { // key欄位中至少有一個被修改到
      if (existdata.length > 0) {
        this.message.create('info', '修改失敗，存在重複');
        this.editMap.set(ele['id'], false);
        this.disableedit = false;
        return;
      }
    }

    // 檢驗lower,upper欄位是否是數值
    if (ele['phase']) {
      if (ele['phase']!=='C0'&&ele['phase']!=='C1'&&ele['phase']!=='C2'&&ele['phase']!=='C3'&&ele['phase']!=='C4'&&ele['phase']!=='C5') {
        this.message.create('info', 'Phase資料格式錯誤,Phase欄位定義: C0～C5');
        this.editMap.set(ele['id'], false);
        this.disableedit = false;
        return;
      } 
    } else {
      this.message.create('info', 'Phase資料不可為空');
      this.editMap.set(ele['id'], false);
      this.disableedit = false;
      return;
    }
    // save
      ele['updatedUser'] = localStorage.getItem('$DFI$userID');
      ele['updatedTime'] = new Date().getTime();
      ele['createdTime'] = data.createdTime;
      ele['beginTime'] = new Date(ele['beginTime']).getTime();
      ele['endTime'] = new Date(ele['endTime']).getTime();
      // ele['model'] = String(ele['model']).trim();
      // ele['maNumber'] = parseFloat(String(ele['maNumber']).trim());
      // ele['period'] = parseFloat(String(ele['period']).trim());
      await this.dataService.updateRecipientApiById(ele);
      data.plantId = ele['plantId'];
      data.createdTime = ele['createdTime'];
      data.model = ele['model'];
      data.phase = ele['phase'];
      data.stageId = ele['stageId'];
      data.recipientName = ele['recipientName'];
      data.beginTime = ele['beginTime'];
      data.endTime = ele['endTime'];
      data.period = ele['plantName'];
      
      this.message.create('success', '更新成功');
      this.editMap.set(ele['id'], false);
      this.disableedit = false;
  }

  delRow(id) {
    this.dataService.deleteRecipientApiById(id);
    console.log(id, this.ckpiInfos);
    const ckpInfos = this.ckpiInfos.filter(res => res['id'] !== id);
    this.ckpiInfos = ckpInfos;
  }

   // 点击编辑后，在编辑按钮下方显示的按钮##
  cancelEdit(ele) {
    this.editItem = {
      id: ele['id'], plantId: ele['plantId'], model: ele['model'], upperLimit: ele['upperLimit'], lowerLimit: ele['lowerLimit'],
      process: ele['process'],maNumber: ele['maNumber'], period: ele['period'], updatedUser: ele['updatedUser'],
      updatedTime: ele['updatedTime'], createdTime: ele['createdTime']
    };
    this.editMap.set(ele['id'], false);
    this.disableedit = false;
  }

  async query() {
    this.queryButton = false;
    await this.filterData();
    this.ckpiInfos = this.kpiInfos;
    this.ckpiInfos.forEach(ele => {
      this.editMap.set(ele['id'], false);
    });
    
    this.disableedit = false;
  }

  async filterData() {
    this.kpiInfos = await this.dataService.getRecipientApi(this.cur_plant);
    if (this.cur_site) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_site.toLowerCase().indexOf(res['plantName']) !== -1);
    }
    if (this.cur_model.length > 0) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_model.indexOf(res['model']) !== -1);
    }
    if (this.project.length > 0) {
      this.kpiInfos = this.kpiInfos.filter(res => this.project.indexOf(res['name']) !== -1);
    }
    // console.log('----------------------------------------------\n');
    // console.log('site = ' + this.cur_site);
    // console.log('plant = ' + this.cur_plant);
    if (this.cur_site && this.cur_plant && this.cur_site !== null && this.cur_plant !== null) {
      this.queryButton = false;
    }
  }

  // 下载上传文件模板
  downloadTemp() {
    // 获取config中的模板
    this._service.getTemplateFile().toPromise().then(res => {
      console.log(res);
      const headerBgColor = '53868B';
      const colWidth = [];
     Object.keys(res[0]).forEach(element => {
      colWidth.push({wpx: 80});
      colWidth.push({wpx: 80});
      colWidth.push({wpx: 80});
      colWidth.push({wpx: 80});
      colWidth.push({wpx: 80});
      colWidth.push({wpx: 250});
      colWidth.push({wpx: 120});
      colWidth.push({wpx: 120});
      colWidth.push({wpx: 60});
    });
      // this.excelService.exportAsExcelFile(JSON.parse(JSON.stringify(res)), 'SpecFileTemplate');
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(res)), 'SpecFileTemplate', colWidth, headerBgColor);
    });
  }

  // 编辑按钮 ##
  editRow(ele) {
    this.editMap.set(ele['id'], true);
    this.disableedit = true;
    this.curEditRow = JSON.parse(JSON.stringify(ele));
    console.log(this.editMap);
    console.log('被编辑的数据====\n', this.curEditRow);
    this.editItem = {
      id: ele['id'], plantName: ele['plantName'],plantId: ele['plantId'], model: ele['model'], stageId: ele['stageId'], recipientName: ele['recipientName'],
      process: ele['process'],beginTime: ele['beginTime'], endTime: ele['endTime'], phase: ele['phase']
    };
    this.editItem['beginTime']=this.datePipe.transform(ele['beginTime'], 'yyyy/MM/dd');
    this.editItem['endTime']=this.datePipe.transform(ele['endTime'], 'yyyy/MM/dd');
  }//1588608000000

  // 下载表格##
  downloadData() {
    if (this.ckpiInfos) {
      this.ckpiInfos.forEach(element => {
        element['updatedTime'] = this.datePipe.transform(element['updatedTime'], 'yyyy-MM-dd HH:mm:ss');
        element['createdTime'] = this.datePipe.transform(element['createdTime'], 'yyyy-MM-dd HH:mm:ss');
        element['beginTime'] = this.datePipe.transform(element['beginTime'], 'yyyy-MM-dd HH:mm:ss');
        element['endTime'] = this.datePipe.transform(element['endTime'], 'yyyy-MM-dd HH:mm:ss');
      });
      const colWidth = [];
     Object.keys(this.ckpiInfos[0]).forEach(element => {
      colWidth.push({wpx: 90});
      colWidth.push({wpx: 90});
      colWidth.push({wpx: 90});
      colWidth.push({wpx: 90});
      colWidth.push({wpx: 90});
      colWidth.push({wpx: 250});
      colWidth.push({wpx: 130});
      colWidth.push({wpx: 130});
      colWidth.push({wpx: 80});
      colWidth.push({wpx: 120});
      colWidth.push({wpx: 120});
      colWidth.push({wpx: 120});
      colWidth.push({wpx: 60});
    });
    const headerBgColor = '53868B';
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(this.ckpiInfos)), 'SpecMemberList', colWidth, headerBgColor);
    }
  }

handleOk_log() {
  this.isVisible_log = false;
}

showModal(): void {
  this.isVisible = true;
}

handleCancel(): void {
  this.isVisible = false;
}

handleCancel_log(): void {
  this.isVisible_log = false;
}

addOneData(existdata, data) {
  console.log('data \n', data)// updateRecipientApiById
  this.dataService.insertRecipientApiSets(data);
    this.message.create('success', '维护成功');
    this.kpiInfos = [];
    this.kpiInfos.push(data);
    // if (existdata.length === 0) {
    //   this.kpiInfos.push(data);
    // } else {
    //   this.kpiInfos = this.kpiInfos.map((res) => {
    //     if (res['id'] === existdata[0]['id']) {
    //       res = data;
    //     }
    //     return res;
    //   });
    //   console.log(this.kpiInfos);
    // }
    this.ckpiInfos = this.kpiInfos;
    this.ckpiInfos.forEach(eles => {
      this.editMap.set(eles['id'], false);
    });
    this.disableedit = false;
    this.isVisible = false;
}

handleFileInput(evt: any) {
  this.uploadFileName = evt.files[0].name;
  if (evt.files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
  evt.files[0].type !== 'application/vnd.ms-excel') {
    this.message.create('info', '請重新上傳正確格式的excel文件');
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
    console.log('inputdata \n', this.inputdata);
  };
  reader.readAsBinaryString(evt.files[0]);
}

formatDate(numb, format="/") {
  let time = new Date((numb - 1) * 24 * 3600000 + 1)
  time.setFullYear(time.getFullYear() - 70)
  let year = time.getFullYear() + ''
  let month = time.getMonth() + 1
  let date = time.getDate()-1
  if(format && format.length === 1) {
      return year + format + month + format + date
  }
  return year+(month < 10 ? '0' + month : month)+(date < 10 ? '0' + date : date)
}

  // 上传 ##
  async uploadPre() {
    // 写入DB
    if (this.inputdata.length === 0) {
      this.message.create('info', '上傳文件内容不能为空');
      return;
    }
    this.showProgress = false;
    const dataSets = [];
    this.newDatas = [];
    // const upDatas = [];
    for (let index = 1; index < this.inputdata.length; index++) {
      this.progressBar = parseInt((parseFloat((index / (this.inputdata.length - 1)).toFixed(2)) * 100).toFixed(3), 0);
      const ele = this.inputdata[index];
      let data;
      console.log('String(ele[5]).trim() \n', String(ele[5]).trim())
      console.log('String(ele[6]).trim() \n', String(ele[6]).trim())
      data = {
        "plantName": String(ele[0]).trim().toLowerCase(),
        "plantId": String(ele[1]).trim(),
        "process":String(ele[2]).trim(),
        "model": String(ele[3]).trim(),
        "stageId": String(ele[4]).trim(),
        "recipientName": String(ele[5]).trim(),
        "beginTime": new Date(String(ele[6]).trim()).getTime(),
        "endTime": new Date(String(ele[7]).trim()).getTime(),
        "phase": String(ele[8]).trim(),
        'updatedUser': localStorage.getItem('$DFI$userID'),
        'updatedTime': new Date().getTime(),//1585534238409
        'createdTime': new Date().getTime()
      };
      // check
      const existdata: any[] = await this.dataService.getRecipientApiByAllOptions1(ele[1], ele[3], ele[0].toLowerCase(), ele[4],ele[8]);
      console.log('从数据库中查询出来的重复数据 - existdata \n', existdata);
    // save
    if (existdata.length > 0) {
      data = {
        'id': existdata[0]['id'],
        "plantName": String(ele[0]).trim().toLowerCase(),
        "plantId": String(ele[1]).trim(),
        "process":String(ele[2]).trim(),
        "model": String(ele[3]).trim(),
        "stageId": String(ele[4]).trim(),
        "recipientName": String(ele[5]).trim(),
        "beginTime": new Date(String(ele[6]).trim()).getTime(),
        "endTime": new Date(String(ele[7]).trim()).getTime(),
        "phase": String(ele[8]).trim(),
        'updatedUser': localStorage.getItem('$DFI$userID'),
        'updatedTime': new Date().getTime(),//1585534238409
        'createdTime': existdata[0]['createdTime']
      };
      console.log('上传的重复数据 ==== \n', data);

      // 更新重复的
      this.dataService.updateRecipientApiById(data);
    } else {
      this.newDatas.push(data);
    }
    dataSets.push(data);
    console.log(index, this.inputdata.length);
    if (this.inputdata.length - 1 === index) {
      this.proStatus = 'success';
      this.showConfirm(); // 处理好上传资料后会弹出确认上传框
    }
    }
    console.log(dataSets);
    // 上传文件中重复项
    // this.newDatas = this._service.getRidoffDuplicates(this.newDatas);
  }

  showConfirm() {
    this.modalService.confirm({
      nzTitle  : '<i>是否上传文件?</i>',
      nzContent: '',
      nzOnOk   : async() => { await this.uploadOk(); this.showProgress = true; this.proStatus = 'active'; },
      nzOnCancel: () => { this.showProgress = true; this.proStatus = 'active'; }
    });
  }

  uploadOk() {
    this.pcs =  null;
    console.log('newDatas \n',this.newDatas);
    this.dataService.insertRecipientApiSets(this.newDatas).subscribe(res => {
      this.message.create('success', '上传成功');
      this.uploadFileName = null;
      this.inputdata = [];
      console.log(res);
      // this.kpiInfos = dataSets;
      this.ckpiInfos = res;
      this.ckpiInfos.forEach(eles => {
      this.editMap.set(eles['id'], false);
     });
      this.disableedit = false;
      this.isVisible = false;
    }, error => {this.message.create('info',  '上傳資料過大，請分批次上傳'); } );
  }

// 单独新增RF CPK测试项时，若存在重复，弹出是否覆盖确认框，若选择取消，照理应该自出查出该笔重复的记录，可是目前查出的是不带大小测试项目的记录
// 是因为系统目前没做这块（要改filterData()），做的这么全面好累的说，待後面User提到時再說吧
// 新增##
async handleOk() {
  let data;
  console.log(this.add_site,this.model, this.stageCode, this.add_plant,this.dateRangeFrom,this.dateRangeTo);
  if (this.model === undefined || this.stageCode === undefined || this.add_site === undefined || this.add_plant === undefined) {
    this.message.create('info', '輸入項不可為空');
  } else {
    data = {
      "plantName": String(this.add_site).trim(),
      "plantId": String(this.add_plant).trim(),
      "process": String(this.cur_sectionId).trim(),
      "model": String(this.model).trim(),
      "stageId": String(this.stageCode).trim(),
      "recipientName": String(this.member).trim(),
      "beginTime": new Date(this.dateRangeFrom).getTime(),
      "endTime": new Date(this.dateRangeTo).getTime(),
      "phase": String(this.phase).trim(),
      'updatedUser': localStorage.getItem('$DFI$userID'),
      'updatedTime': new Date().getTime(),//1585534238409
      'createdTime': new Date().getTime()
    };
    console.log(data);
    // check
    // const existdata: any[] = await this.dataService.getRecipientApiByAllOptions1(ele[1], ele[3], ele[0].toLowerCase(), ele[4],ele[8]);
    const existdata: any[] = await this.dataService.getRecipientApiByAllOptions1(this.add_plant, this.model,this.cur_site,this.stageCode ,this.phase);
    // check 上下限值
    // save
    if (existdata.length !== 0) {
      data = {
        'id': existdata[0]['id'],
        "plantName": String(this.add_site).trim(),
        'plantId': String(this.add_plant).trim(),
        "process": String(this.cur_sectionId).trim(),
        "model": String(this.model).trim(),
        "stageId": String(this.stageCode).trim(),
        "recipientName": String(this.member).trim(),
        "beginTime": new Date(this.dateRangeFrom).getTime(),
        "endTime": new Date(this.dateRangeTo).getTime(),
        "phase": String(this.phase).trim(),        
        'updatedUser': localStorage.getItem('$DFI$userID'),
        'updatedTime': new Date().getTime(),
        'createdTime': existdata[0]['createdTime'],
      };
      this.modalService.confirm({
        nzTitle  : '<i>存在重複項，是否覆蓋?</i>',
        nzContent: '',
        nzOnOk   : async() => { this.addOneData(existdata, data); return; },

      });
      return;
    }
    this.addOneData(existdata, data);
  }
}

onInput(value, type) {
  switch (type) {
    case 'model':
      this.modelFlteredOptions = Object.values(this.addModelGroup)
      .filter(option => option.toLowerCase().indexOf(value.toLowerCase()) === 0);
      break;
    case 'stage':
      this.stageFlteredOptions = Object.values(this.addStageGroup)
      .filter(option => option.toLowerCase().indexOf(value.toLowerCase()) === 0);
      break;
  }
}

}
