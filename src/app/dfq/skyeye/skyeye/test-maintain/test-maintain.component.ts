import { Component, OnInit } from '@angular/core';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { TestMaintainService } from './test-maintain.service';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
// Skyeye SDK
import { LoopBackConfig as SkyeyeLoopBackConfig } from '@service/skyeye_sdk';
@Component({
  selector: 'app-test-maintain',
  templateUrl: './test-maintain.component.html',
  styleUrls: ['./test-maintain.component.scss']
})
export class TestMaintainComponent implements OnInit {
  cur_site;
  cur_plant;
  project = [];
  projectGroup = [];
  plantGroup = [];
  // addPlantGroup = [];
  siteGroup = [];
  // addSiteGroup = [];
  stageGroup = [];
  cur_stage = [];
  kpiInfos: any = [];
  ckpiInfos;
  cur_model = [];
  queryButton = true;
  editMap = new Map<string, boolean>();
  modelGroup = [];
  editItem = {};
  isVisible = false;
  isVisible_log = false;
  disableedit = false;
  nzScroll: {} = { x: '920px' };
  showSample: Boolean = false;
  model: string | null;
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
  THwidth = ['60px', '80px', '100px', '80px', '120px', '110px',  '110px', '110px', '90px', '60px'];
  logInfos = [];  // 日志信息
  mousekey: any = -1;
  footer = null;
  isShow = false;
  constructor(
    private dataService: LineDataServiceService,
    private message: NzMessageService,
    private _service: TestMaintainService,
    private modalService: NzModalService,
    private excelService: ExcelToolService,
    private datePipe: DatePipe,
    private esService: EsDataServiceService
  ) { }

  ngOnInit() {
    const role_arr = JSON.parse(localStorage.getItem('$DFI$UserAuth'));
    debugger
    console.log(localStorage.getItem('Skyeye_plantMapping'))
    this.siteInfos = JSON.parse(localStorage.getItem('Skyeye_plantMapping')).filter(res => res['Site'] === localStorage.getItem('DFC_Site').toUpperCase());
    // this.addSiteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    this.siteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    this.role = role_arr['SkyeyeTestItemMaintain'];
  }


  // 选中下拉框的数据调用
  async getOptions(type) {
    // debugger;
    if (type === 'plant') {
      this.plantGroup = [];
      this.cur_plant = undefined;
      this.stageGroup = [];
      this.cur_stage = [];
      this.modelGroup = [];
      this.cur_model = [];
      this.queryButton = true;
      if (this.cur_site) {
        await this.filterData();
        this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
          return res['Plant'];
        });
      }
    }


    if (type === 'stage') {
      this.stageGroup = [];
      this.cur_stage = [];
      this.modelGroup = [];
      this.cur_model = [];
      if (this.cur_plant !== undefined && this.cur_plant) {
        this.queryButton = false;
      } else {
        this.queryButton = true;
      }
      if (this.cur_plant) {
        await this.filterData();
        this.stageGroup = this.dataService.groupBy(this.kpiInfos, 'stationtype');
      }
    }

    if (type === 'model') {
      this.modelGroup = [];
      this.cur_model = [];
      if (this.cur_stage.length > 0) {
        await this.filterData();
        this.modelGroup = this.dataService.groupBy(this.kpiInfos, 'modelname');
      }
    }


    if (type === 'query') {
      await this.filterData();
    }
  }


  // 查询按钮点击
  async query() {
    this.queryButton = false;
    await this.filterData();
    this.ckpiInfos = this.kpiInfos;
    this.ckpiInfos.forEach(ele => {
      this.editMap.set(ele['groupId'], false);
    });
    console.log('查询到的数据 - this.ckpiInfos 如下\n', this.ckpiInfos);
    this.disableedit = false;
  }


  async filterData() {
    // this.kpiInfos = await this.dataService.getTestMaintainApi(this.cur_plant);
    this.kpiInfos = await this.esService.postData(SkyeyeLoopBackConfig.getPath().toString() + '/api/ToolsVersion/getByGroupId', this.cur_plant).toPromise();
    if (this.cur_plant) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_plant.indexOf(res['plant']) !== -1);
    }
    if (this.cur_stage.length > 0) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_stage.indexOf(res['stationtype']) !== -1);
    }
    if (this.cur_model.length > 0) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_model.indexOf(res['modelname']) !== -1);
    }
  }

  // 编辑按钮 ##
  editRow(ele) {
    this.editMap.set(ele['groupId'], true);
    this.disableedit = true;
    this.curEditRow = JSON.parse(JSON.stringify(ele));
    this.editItem = {
      id: ele['id'],  site: ele['site'], plant: ele['plant'], modelname: ele['modelname'], stationtype: ele['stationtype'], monumber: ele['monumber'],
     updatedUser: ele['updatedUser'], updatedTime: ele['updatedTime'], createdTime: ele['createdTime']
    };
  }

  // 再次点击编辑以后保存功能
  async saveRow(ele, data) {
    // 检查 工单 栏位
    if (!String(ele['monumber']).trim()) {
      this.message.create('info', '工单不可為空');
      this.editMap.set(ele['groupId'], false);
      this.disableedit = false;
      return;
    }


    // save
      ele['updatedUser'] = localStorage.getItem('$DFI$userID');
      ele['updatedTime'] = new Date().getTime();
      ele['site'] = String(ele['site']).trim();
      ele['plant'] = String(ele['plant']).trim();
      ele['modelname'] = String(ele['modelname']).trim();
      ele['stationtype'] = String(ele['stationtype']).trim();
      ele['monumber'] = String(ele['monumber']).trim();
      // debugger;
      // await this.dataService.updateTestMaintainApiById(ele);
      this.esService.postData(SkyeyeLoopBackConfig.getPath().toString() + '/api/ToolsVersion/updateByGroupId', [ele]).subscribe(async res => {
        if (res['msg'] === 'ok') {
          data.site = ele['site'];
          data.plant = ele['plant'];
          data.modelname = ele['modelname'];
          data.monumber = ele['monumber'];
          data.updatedUser = localStorage.getItem('$DFI$userID');
          data.updatedTime = new Date().getTime();
          data.createdTime = ele['createdTime'];
          this.message.create('success', '更新成功');
          this.editMap.set(data['groupId'], false);
          this.disableedit = false;
        }
      });
  }

  delRow(id) {
    this.esService.postData(SkyeyeLoopBackConfig.getPath().toString() + '/api/ToolsVersion/delByGroupId', {'groupId': id}).subscribe((data) => {
      const ckpInfos = this.ckpiInfos.filter(res => res['groupId'] !== id);
      this.ckpiInfos = ckpInfos;
    });
  }

   // 点击编辑后，在编辑按钮下方显示的按钮##
  cancelEdit(ele) {
    this.editItem = {
      id: ele['id'],  site: ele['site'], plant: ele['plant'], model: ele['modelname'], stationtype: ele['stationtype'], monumber: ele['monumber'],
      updatedUser: ele['updatedUser'], updatedTime: ele['updatedTime'], createdTime: ele['createdTime']
    };
    this.editMap.set(ele['groupId'], false);
    this.disableedit = false;
  }

  showModal(): void {
    this.isVisible = true;
  }


  addOneData(existdata, data) {
    this.dataService.updateKPIById(data);
      this.message.create('success', '维护成功');
      this.kpiInfos = [];
      this.kpiInfos.push(data);
      this.ckpiInfos = this.kpiInfos;
      this.ckpiInfos.forEach(eles => {
        this.editMap.set(eles['groupId'], false);
      });
      this.disableedit = false;
      this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleCancel_log(): void {
    this.isVisible_log = false;
  }

  handleFileInput(evt: any) {
    // debugger;
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
    };
    // debugger
    reader.readAsBinaryString(evt.files[0]);
  }

  // 上传 ##
  async uploadPre() {
    // 写入DB
    if (this.inputdata.length === 0) {
      this.message.create('info', '上傳文件内容不能为空');
      return;
    }
    if (this.inputdata[1].length === 0) {
      this.message.create('info', '上傳文件内容不能为空');
      return;
    }
    this.showProgress = false;
    const dataSets = [];
    this.newDatas = [];
    // const upDatas = [];
    for (let index = 1; index < this.inputdata.length; index++) {
      this.progressBar = parseInt((parseFloat((index / (this.inputdata.length - 1)).toFixed(2)) * 100).toFixed(3), 0);
      // debugger;
      const ele = this.inputdata[index];
      let data;
      data = {
        'site': String(ele[0]).trim(),
        'plant': String(ele[1]).trim(),
        'modelname': String(ele[2]).trim(),
        'stationtype': String(ele[3]).trim(),
        'monumber': String(ele[4]).trim(),
        'updatedUser': localStorage.getItem('$DFI$userID'),
        'updatedTime': new Date().getTime(),
        'createdTime': new Date().getTime(),
      };
      // 数字校验
      // debugger;
      if (ele[0] === undefined || ele[1] === undefined || ele[2] === undefined || ele[3] === undefined) {
        this.message.create('info', '上傳失敗' + '第' + index + '行资料有栏位为空');
        this.showProgress = true;
        return;
      }

      if (ele[4]) {
        if (!this.isNumber(ele[4])) {
          this.message.create('info', '上傳失敗' + '第' + index + '行资料工单只能为数字');
          this.showProgress = true;
          return;
        }
      }

    this.newDatas.push(data);
    dataSets.push(data);
    if (this.inputdata.length - 1 === index) {
      this.proStatus = 'success';
      this.showConfirm(); // 处理好上传资料后会弹出确认上传框
    }
    }
    // // 上传文件中重复项
    // this.newDatas = this._service.getRidoffDuplicates(this.newDatas);
    // console.log('过滤重复---\n', this.newDatas);
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
    this.esService.postData(SkyeyeLoopBackConfig.getPath().toString() + '/api/ToolsVersion/updateByGroupId', this.newDatas).subscribe(async data => {
      if (data['msg'] === 'ok') {
        if (data['newResult'].length > 0) {
          this.ckpiInfos = await this.esService.postData(SkyeyeLoopBackConfig.getPath().toString() + '/api/ToolsVersion/getByGroupId', {'groupId': data['newResult']}).toPromise();
          this.ckpiInfos.forEach(eles => {
            this.editMap.set(eles['groupId'], false);
          });
        }
        this.message.create('success', '上传成功');
        this.uploadFileName = null;
        this.inputdata = [];
        this.disableedit = false;
        this.isVisible = false;
      }
    }, error => { this.message.create('info', '上傳資料過大，請分批次上傳'); });
  }

    // 下载上传文件模板
    downloadTemp() {
      // 获取config中的模板
      this._service.getTemplateFile().toPromise().then(res => {
        this.excelService.exportAsExcelFile(JSON.parse(JSON.stringify(res)), 'TestToolTemplate');
      });
    }

    // 下载表格##
    downloadData() {
      if (this.ckpiInfos) {
        const downloadData = [];
        this.ckpiInfos.forEach(element => {
          const tempDic = {};
          tempDic['site'] = element.site;
          tempDic['plant'] = element.plant;
          tempDic['modelname'] = element.modelname;
          tempDic['stationtype'] = element.stationtype;
          tempDic['monumber'] = element.monumber;
          tempDic['updatedUser'] = element.updatedUser;
          tempDic['updatedTime'] = this.datePipe.transform(element['updatedTime'], 'yyyy-MM-dd HH:mm:ss');
          tempDic['createdTime'] = this.datePipe.transform(element['createdTime'], 'yyyy-MM-dd HH:mm:ss');
          downloadData.push(tempDic);
        });
        const colWidth = [];
       Object.keys(downloadData[0]).forEach(element => {
        colWidth.push({wpx: 120});
      });
      const headerBgColor = '53868B';
        this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(downloadData)), 'TestToolData', colWidth, headerBgColor);
      }
    }

  showLog(id) {
    if (id) {
      this._service.getLogDetail(id).subscribe(res => {
        this.isVisible_log = true;
        this.logInfos = res;
      });
    } else {
      this.isVisible_log = true;
      this.logInfos = [];
    }
  }

  handleOk_log() {
    this.isVisible_log = false;
  }

  show(i: number) {
    this.isShow = true;
    this.mousekey = i;
  }

  isNumber(val) {
    const regPos = /^\d+(\.\d+)?$/; // 非负浮点数
    const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
        return true;
        } else {
        return false;
        }
    }
}
