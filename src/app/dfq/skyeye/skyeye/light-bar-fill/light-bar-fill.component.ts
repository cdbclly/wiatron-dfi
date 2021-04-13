import { Component, OnInit } from '@angular/core';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import { NzModalService } from 'ng-zorro-antd';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';
import { DatePipe } from '@angular/common';
import { LightBarFillService } from './light-bar-fill.service';

@Component({
  selector: 'app-light-bar-fill',
  templateUrl: './light-bar-fill.component.html',
  styleUrls: ['./light-bar-fill.component.scss']
})
export class LightBarFillComponent implements OnInit {

  cur_site;
  cur_plant;
  project = [];
  projectGroup = [];
  plantGroup = [];
  // addPlantGroup = [];
  siteGroup = [];
  // addSiteGroup = [];
  kpiInfos = [];
  ckpiInfos;
  cur_model = [];
  queryButton = true;
  editMap = new Map<string, boolean>();
  modelGroup = [];
  editItem = {};
  isVisible = false;
  isVisible_log = false;
  disableedit = false;
  nzScroll: {} = { x: '1300px' };
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
  THwidth = ['60px', '60px', '80px', '80px', '80px', '90px', '80px',  '110', '110', '80', '80px', '120px', '120px', '100px', '60px'];
  logInfos = [];  // 日志信息
  footer = null;

  constructor(
    private dataService: LineDataServiceService,
    private message: NzMessageService,
    private _service: LightBarFillService,
    private modalService: NzModalService,
    private excelService: ExcelToolService,
    private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    const role_arr = JSON.parse(localStorage.getItem('$DFI$UserAuth'));
    this.siteInfos = JSON.parse(localStorage.getItem('Skyeye_plantMapping')).filter(res => res['Site'] === localStorage.getItem('DFC_Site').toUpperCase());
    // this.addSiteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    this.siteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    this.role = role_arr['SkyeyeTestItemMaintain'];
    // console.log(this.role['update']);
  }

  // 选中下拉框的数据调用
  async getOptions(type) {
    // debugger;
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
    }
    if (type === 'query') {
      this.filterData();
    }
  }


  // 查询按钮点击
  async query() {
    this.queryButton = false;
    await this.filterData();
    this.ckpiInfos = this.kpiInfos;
    this.ckpiInfos.forEach(ele => {
      this.editMap.set(ele['id'], false);
    });
    console.log('查询到的数据 - this.ckpiInfos 如下\n', this.ckpiInfos);
    this.disableedit = false;
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
    }
    if (type === 'plant') {
      // 獲取資料
      this.kpiInfos = await this.dataService.getLightBarApi(this.cur_plant); // 獲取WKS的KPI
      this.tmp_arr = this.cur_plant;
      this.cur_plant = '';
      await this.filterData();
      this.cur_plant = this.tmp_arr;
      this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
        return res['Plant'];
      });
    }
  }

  async filterData() {
    this.kpiInfos = await this.dataService.getLightBarApi(this.cur_plant);
    if (this.cur_plant) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_plant.indexOf(res['plantId']) !== -1);
    }
    if (this.cur_model.length > 0) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_model.indexOf(res['model']) !== -1);
    }
    if (this.project.length > 0) {
      this.kpiInfos = this.kpiInfos.filter(res => this.project.indexOf(res['name']) !== -1);
    }
    if (this.cur_site && this.cur_plant && this.cur_site !== null && this.cur_plant !== null) {
      this.queryButton = false;
    }
  }

  // 编辑按钮 ##
  editRow(ele) {
    this.editMap.set(ele['id'], true);
    this.disableedit = true;
    this.curEditRow = JSON.parse(JSON.stringify(ele));
    // console.log('被编辑的数据====\n', this.curEditRow);
    this.editItem = {
      id: ele['id'], plantId: ele['plantId'], model: ele['model'], upperLimit: ele['upperLimit'], lowerLimit: ele['lowerLimit'],
      maNumber: ele['maNumber'], period: ele['period'], dualWaveJudge: ele['dualWaveJudge'], codeJudge: ele['codeJudge'], spacingValue: ele['spacingValue'],
     updatedUser: ele['updatedUser'], updatedTime: ele['updatedTime'], createdTime: ele['createdTime']
    };
  }

  // 再次点击编辑以后保存功能
  async saveRow(ele, data) {
    // console.log('再次点击编辑以后保存功能对应的数据 -- \n', ele);
    const existdata = await this.dataService.getLightBarApiByAllOptions(ele['plantId'], ele['model']);
    // console.log('existdata === \n', existdata);

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
    if (ele['upperLimit'] && ele['lowerLimit']) {
      if (isNaN(ele['upperLimit']) || isNaN(ele['lowerLimit'])) {
        this.message.create('info', '上下限資料格式錯誤');
        this.editMap.set(ele['id'], false);
        this.disableedit = false;
        return;
      } else {
        ele['upperLimit'] = parseFloat(String(ele['upperLimit']).trim());
        ele['lowerLimit'] = parseFloat(String(ele['lowerLimit']).trim());
        if (ele['upperLimit'] < 0 || ele['lowerLimit'] < 0) {
          this.message.create('info', '上下限值不能小於零');
          this.editMap.set(ele['id'], false);
          this.disableedit = false;
          return;
        }
      }
    } else {
      this.message.create('info', '上下限不可為空');
      this.editMap.set(ele['id'], false);
      this.disableedit = false;
      return;
    }

     // 检查周期栏位
     if (ele['period']) {
      if (isNaN(ele['period'])) {
        this.message.create('info', '週期资料格式错误');
        this.editMap.set(ele['id'], false);
        this.disableedit = false;
        return;
      } else {
        ele['period'] = parseFloat(String(ele['period']).trim());
        if (ele['period'] < 0  || String(ele['period']).indexOf('.') + 1 > 0) {
          this.message.create('info', '週期值应为自然数');
          this.editMap.set(ele['id'], false);
          this.disableedit = false;
          return;
        }
      }
    } else {
      this.message.create('info', '週期不可為空');
      this.editMap.set(ele['id'], false);
      this.disableedit = false;
      return;
    }

    // 检查MA number栏位
    if (ele['maNumber']) {
      if (isNaN(ele['maNumber'])) {
        this.message.create('info', 'MA number资料格式错误');
        this.editMap.set(ele['id'], false);
        this.disableedit = false;
        return;
      } else {
        ele['maNumber'] = parseFloat(String(ele['maNumber']).trim());
        if (ele['maNumber'] < 0  || String(ele['maNumber']).indexOf('.') + 1 > 0) {
          this.message.create('info', 'MA number值应为自然数');
          this.editMap.set(ele['id'], false);
          this.disableedit = false;
          return;
        }
      }
    } else {
      this.message.create('info', 'MA number不可為空');
      this.editMap.set(ele['id'], false);
      this.disableedit = false;
      return;
    }


    // 检查雙波峰判斷標準 栏位
    if (ele['dualWaveJudge']) {
      if (isNaN(ele['dualWaveJudge'])) {
        this.message.create('info', '雙波峰判斷標準资料格式错误');
        this.editMap.set(ele['id'], false);
        this.disableedit = false;
        return;
      } else {
        ele['dualWaveJudge'] = parseFloat(String(ele['dualWaveJudge']).trim());
        if (ele['dualWaveJudge'] < 0  || String(ele['dualWaveJudge']).indexOf('.') + 1 > 0) {
          this.message.create('info', '雙波峰判斷標準值应为自然数');
          this.editMap.set(ele['id'], false);
          this.disableedit = false;
          return;
        }
      }
    } else {
      this.message.create('info', '雙波峰判斷標準不可為空');
      this.editMap.set(ele['id'], false);
      this.disableedit = false;
      return;
    }


    // 检查程式觸發標準 栏位
    if (ele['codeJudge']) {
      if (isNaN(ele['codeJudge'])) {
        this.message.create('info', '程式觸發標準资料格式错误');
        this.editMap.set(ele['id'], false);
        this.disableedit = false;
        return;
      } else {
        ele['codeJudge'] = parseFloat(String(ele['codeJudge']).trim());
        if (ele['codeJudge'] < 0  || String(ele['codeJudge']).indexOf('.') + 1 > 0) {
          this.message.create('info', '程式觸發標準值应为自然数');
          this.editMap.set(ele['id'], false);
          this.disableedit = false;
          return;
        }
      }
    } else {
      this.message.create('info', '程式觸發標準不可為空');
      this.editMap.set(ele['id'], false);
      this.disableedit = false;
      return;
    }



    // 检查間距值 栏位
    if (ele['spacingValue']) {
      if (isNaN(ele['spacingValue'])) {
        this.message.create('info', '間距值资料格式错误');
        this.editMap.set(ele['id'], false);
        this.disableedit = false;
        return;
      } else {
        ele['spacingValue'] = parseFloat(String(ele['spacingValue']).trim());
        if (ele['spacingValue'] < 0  || String(ele['spacingValue']).indexOf('.') + 1 > 0) {
          this.message.create('info', '間距值值应为自然数');
          this.editMap.set(ele['id'], false);
          this.disableedit = false;
          return;
        }
      }
    } else {
      this.message.create('info', '間距值不可為空');
      this.editMap.set(ele['id'], false);
      this.disableedit = false;
      return;
    }


    // save
      ele['updatedUser'] = localStorage.getItem('$DFI$userID');
      ele['updatedTime'] = new Date().getTime();
      ele['model'] = String(ele['model']).trim();
      ele['maNumber'] = parseFloat(String(ele['maNumber']).trim());
      ele['period'] = parseFloat(String(ele['period']).trim());

      ele['dualWaveJudge'] = parseFloat(String(ele['dualWaveJudge']).trim());
      ele['codeJudge'] = parseFloat(String(ele['codeJudge']).trim());
      ele['spacingValue'] = parseFloat(String(ele['spacingValue']).trim());
      // debugger;
      await this.dataService.updateLightBarApiById(ele);
      data.plantId = ele['plantId'];
      data.model = ele['model'];
      data.upperLimit = ele['upperLimit'];
      data.lowerLimit = ele['lowerLimit'];
      data.maNumber = ele['maNumber'];
      data.period = ele['period'];

      data.dualWaveJudge = ele['dualWaveJudge'];
      data.codeJudge = ele['codeJudge'];
      data.spacingValue = ele['spacingValue'];

      data.updatedUser = localStorage.getItem('$DFI$userID');
      data.updatedTime = new Date().getTime();
      data.createdTime = ele['createdTime'];
      this.message.create('success', '更新成功');
    this.editMap.set(ele['id'], false);
    this.disableedit = false;
  }

  delRow(id) {
    this.dataService.deleteLightBarApiById(id);
    // console.log(id, this.ckpiInfos);
    const ckpInfos = this.ckpiInfos.filter(res => res['id'] !== id);
    this.ckpiInfos = ckpInfos;
  }

   // 点击编辑后，在编辑按钮下方显示的按钮##
  cancelEdit(ele) {
    this.editItem = {
      id: ele['id'], plantId: ele['plantId'], model: ele['model'], upperLimit: ele['upperLimit'], lowerLimit: ele['lowerLimit'],
      maNumber: ele['maNumber'], period: ele['period'],  dualWaveJudge: ele['dualWaveJudge'], codeJudge: ele['codeJudge'], spacingValue: ele['spacingValue'],
      updatedUser: ele['updatedUser'], updatedTime: ele['updatedTime'], createdTime: ele['createdTime']
    };
    this.editMap.set(ele['id'], false);
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
        this.editMap.set(eles['id'], false);
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
      // console.log(this.inputdata.length);
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
        'plantId': String(ele[0]).trim(),
        'model': String(ele[1]).trim(),
        'upperLimit': parseFloat(String(ele[2]).trim()),
        'lowerLimit': parseFloat(String(ele[3]).trim()),
        'maNumber': parseFloat(String(ele[4]).trim()),
        'period': parseFloat(String(ele[5]).trim()),
        // 新增栏位
        'dualWaveJudge': parseFloat(String(ele[6]).trim()),
        'codeJudge': parseFloat(String(ele[7]).trim()),
        'spacingValue': parseFloat(String(ele[8]).trim()),

        'updatedUser': localStorage.getItem('$DFI$userID'),
        'updatedTime': new Date().getTime(),
        'createdTime': new Date().getTime(),
      };
      // 数字校验
      // debugger;
      if (ele[2] !== undefined && ele[3] !== undefined && ele[4] !== undefined && ele[5] !== undefined) {
        if (isNaN(ele[2]) || isNaN(ele[3]) || isNaN(ele[4]) || isNaN(ele[5]) || String(ele[4]).indexOf('.') + 1 > 0 || String(ele[5]).indexOf('.') + 1 > 0 || String(ele[6]).indexOf('.') + 1 > 0 || String(ele[7]).indexOf('.') + 1 > 0 || String(ele[8]).indexOf('.') + 1 > 0) {
          this.message.create('info', '上傳失敗' + '第' + index + '行资料格式错误');
          this.showProgress = true;
          return;
        } else {
          ele[2] = parseFloat(String(ele[2]).trim());
          ele[3] = parseFloat(String(ele[3]).trim());
          ele[4] = parseFloat(String(ele[4]).trim());
          ele[5] = parseFloat(String(ele[5]).trim());
          ele[6] = parseFloat(String(ele[6]).trim());
          ele[7] = parseFloat(String(ele[7]).trim());
          ele[8] = parseFloat(String(ele[8]).trim());
          if ( ele[2] < 0 || ele[3] < 0 || ele[4] < 0 || ele[5] < 0 || ele[6] < 0 || ele[7] < 0 || ele[8] < 0 ) {
          this.message.create('info', '上傳失敗' + '第' + index + '行上下限值不可為負數');
          this.showProgress = true;
          return;
        }
        }
      }

      // check
      const existdata: any[] = await this.dataService.getLightBarApiByAllOptions(ele[0], ele[1]);
      console.log('检查是上传的数据是否存在  existdata - \n', existdata);
    // save
    if (existdata.length > 0) {
      data = {
        'id': existdata[0]['id'],
        'plantId': String(ele[0]).trim(),
        'model': String(ele[1]).trim(),
        'upperLimit': parseFloat(String(ele[2]).trim()),
        'lowerLimit': parseFloat(String(ele[3]).trim()),
        'maNumber': parseFloat(String(ele[4]).trim()),
        'period': parseFloat(String(ele[5]).trim()),

        'dualWaveJudge': parseFloat(String(ele[6]).trim()),
        'codeJudge': parseFloat(String(ele[7]).trim()),
        'spacingValue': parseFloat(String(ele[8]).trim()),

        'updatedUser': localStorage.getItem('$DFI$userID'),
        'updatedTime': new Date().getTime(),
        'createdTime': new Date().getTime(),
      };

       // 数字校验
      // debugger;
      if (ele[2] !== undefined && ele[3] !== undefined && ele[4] !== undefined && ele[5] !== undefined && ele[6] !== undefined && ele[7] !== undefined && ele[8] !== undefined) {
        if (isNaN(ele[2]) || isNaN(ele[3]) || isNaN(ele[4]) || isNaN(ele[5]) || isNaN(ele[6]) || isNaN(ele[7]) || isNaN(ele[8])) {
          this.message.create('info', '上傳失敗' + '第' + index + '行资料格式错误');
          this.showProgress = true;
          return;
        } else {
          ele[2] = parseFloat(String(ele[2]).trim());
          ele[3] = parseFloat(String(ele[3]).trim());
          ele[4] = parseFloat(String(ele[4]).trim());
          ele[5] = parseFloat(String(ele[5]).trim());
          ele[6] = parseFloat(String(ele[6]).trim());
          ele[7] = parseFloat(String(ele[7]).trim());
          ele[8] = parseFloat(String(ele[8]).trim());
          if ( ele[2] < 0 || ele[3] < 0 || ele[4] < 0 || ele[5] < 0 || ele[6] < 0 || ele[7] < 0 || ele[8] < 0 ) {
          this.message.create('info', '上傳失敗' + '第' + index + '行上下限值不可為負數');
          this.showProgress = true;
          return;
        }
        }
      }
      // 更新重复的
      this.dataService.updateLightBarApiById(data);
    } else {
      this.newDatas.push(data);
    }
    dataSets.push(data);
    // console.log(index, this.inputdata.length);
    if (this.inputdata.length - 1 === index) {
      this.proStatus = 'success';
      this.showConfirm(); // 处理好上传资料后会弹出确认上传框
    }
    }
    // console.log(dataSets);
    // 上传文件中重复项
    this.newDatas = this._service.getRidoffDuplicates(this.newDatas);
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
    console.log(this.newDatas);
    this.dataService.insertLightBarApSets(this.newDatas).subscribe(res => {
      // debugger;
      this.message.create('success', '上传成功');
      this.uploadFileName = null;
      this.inputdata = [];
      this.ckpiInfos = res;
     this.ckpiInfos.forEach(eles => {
    this.editMap.set(eles['id'], false);
     });
     this.disableedit = false;
      this.isVisible = false;
    }, error => {this.message.create('info',  '上傳資料過大，請分批次上傳'); } );
  }

    // 下载上传文件模板
    downloadTemp() {
      // 获取config中的模板
      this._service.getTemplateFile().toPromise().then(res => {
        this.excelService.exportAsExcelFile(JSON.parse(JSON.stringify(res)), 'FileTemplate');
      });
    }

    // 下载表格##
    downloadData() {
      if (this.ckpiInfos) {
        this.ckpiInfos.forEach(element => {
          element['updatedTime'] = this.datePipe.transform(element['updatedTime'], 'yyyy-MM-dd HH:mm:ss');
          element['createdTime'] = this.datePipe.transform(element['createdTime'], 'yyyy-MM-dd HH:mm:ss');
        });
        const colWidth = [];
       Object.keys(this.ckpiInfos[0]).forEach(element => {
        colWidth.push({wpx: 120});
      });
      const headerBgColor = '53868B';
        this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(this.ckpiInfos)), 'LightBarData', colWidth, headerBgColor);
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
}
