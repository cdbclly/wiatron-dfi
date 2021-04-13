import { Component, OnInit } from '@angular/core';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import { NzModalService } from 'ng-zorro-antd';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';
import { DatePipe } from '@angular/common';
import { SmartFactoryService } from './smart-factory.service';

@Component({
  selector: 'app-smart-factory',
  templateUrl: './smart-factory.component.html',
  styleUrls: ['./smart-factory.component.scss']
})
export class SmartFactoryComponent implements OnInit {
  cur_site;
  cur_plant;
  project = [];
  projectGroup = [];
  plantGroup = [];
  siteGroup = [];
  kpiInfos = [];
  ckpiInfos;
  cur_model = [];
  queryButton = true;
  editMap = new Map<string, boolean>();
  modelGroup = [];
  cur_category; // 类别
  categoryGroup = [];
  cur_stage; // 站别
  stageGroup = [];
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
  THwidth = ['60px', '80px', '90px', '140px', '120px', '90px', '120px', '120px', '80px', '90px', '120px', '120px', '100px', '60px'];
  logInfos = [];  // 日志信息
  footer = null;


  constructor(
    private dataService: LineDataServiceService,
    private message: NzMessageService,
    private _service: SmartFactoryService,
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
  }

  // 选中下拉框的数据调用
  async getOptions(type) {
    // 选择site 获取plant数据
    if (type === 'plant') {
      this.cur_plant = '';
      this.plantGroup = [];
      this.cur_category = '';
      this.categoryGroup = [];
      this.cur_stage = '';
      this.stageGroup = [];
      this.cur_model = [];
      this.modelGroup = [];
      this.queryButton = true;
      this.filterData();
    }

    // 选择plant 获取category数据
    if (type === 'category') {
      this.cur_category = '';
      this.categoryGroup = [];
      this.cur_stage = '';
      this.stageGroup = [];
      this.cur_model = [];
      this.modelGroup = [];
      this.queryButton = true;
      this.filterData();
      // if (this.cur_plant === null) {
      //   this.queryButton = true;
      // }
    }

    // 选择category 获取stage数据
    if (type === 'stage') {
      this.stageGroup = [];
      this.cur_stage = '';
      this.cur_model = [];
      this.modelGroup = [];
      this.queryButton = true;
      this.filterData();
      // if (this.cur_plant === null) {
      //   this.queryButton = true;
      // }
    }
    // 选择stage 获取model数据
    if (type === 'model') {
      this.cur_model = [];
      this.modelGroup = [];
      this.queryButton = true;
      this.filterData();
    }
    // if (type === 'query') {
    //   this.filterData();
    //   console.log(this.kpiInfos);
    // }
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
    if (type === 'plant') {
      this.kpiInfos = await this.dataService.getCTQApi(this.cur_plant); // 獲取WKS的KPI
      this.tmp_arr = this.cur_plant;
      this.cur_plant = '';
      await this.filterData();
      this.cur_plant = this.tmp_arr;
      this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
        return res['Plant'];
      });
      console.log('plantGroup ==== \n', this.plantGroup);
    }

    if (type === 'category') {
      if (this.cur_site && this.cur_plant) {
        this.tmp_arr = this.cur_category;
        this.cur_category = '';
        await this.filterData();
        this.cur_category = this.tmp_arr;
        this.categoryGroup = this.dataService.groupBy(this.kpiInfos, 'project');
        console.log('categoryGroup ==== \n', this.categoryGroup);
      }
    }

    if (type === 'stage') {
      if (this.cur_site && this.cur_plant && this.cur_category) {
        this.tmp_arr = this.cur_stage;
        this.cur_stage = '';
        await this.filterData();
        this.cur_stage = this.tmp_arr;
        this.stageGroup = this.dataService.groupBy(this.kpiInfos, 'stationtype');
        console.log('stageGroup ==== \n', this.stageGroup);
      }
    }

    if (type === 'model') {
      if (this.cur_site && this.cur_plant && this.cur_category && this.cur_stage) {
        this.tmp_arr = this.cur_model;
        this.cur_model = [];
        await this.filterData();
        this.cur_model = this.tmp_arr;
        this.modelGroup = this.dataService.groupBy(this.kpiInfos, 'modelname');
        console.log('modeltGroup ==== \n', this.modelGroup);
      }
    }
  }

  async filterData() {
    this.kpiInfos = await this.dataService.getCTQApi(this.cur_plant);
    if (this.cur_plant) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_plant.indexOf(res['plant']) !== -1);
    }
    if (this.cur_category) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_category.indexOf(res['project']) !== -1);
    }
    if (this.cur_stage) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_stage.indexOf(res['stationtype']) !== -1);
    }
    if (this.cur_model.length > 0) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_model.indexOf(res['modelname']) !== -1);
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
    this.editItem = {
      id: ele['id'], plant: ele['plant'], project: ele['project'], screenParameter: ele['screenParameter'], modelname: ele['modelname'],
      stationtype: ele['stationtype'], tdname: ele['tdname'], mdname: ele['mdname'], goal: ele['goal'],
      updatedUser: ele['updatedUser'], updatedTime: ele['updatedTime'], createdTime: ele['createdTime']
    };
  }

  // 再次点击编辑以后保存功能
  async saveRow(ele, data) {
    // 检查Screen Parameter栏位
    if (ele['screenParameter']) {
      if (isNaN(parseFloat(String(ele['screenParameter']).trim()))) {
        this.message.create('info', 'Screen Parameter data format error');
        this.editMap.set(ele['id'], false);
        this.disableedit = false;
        return;
      } else {
        ele['screenParameter'] = parseFloat(String(ele['screenParameter']).trim());
        if (ele['screenParameter'] < 0 || ele['screenParameter'] > 100) {
          this.message.create('info', 'Screen Parameter范围在1~100');
          this.editMap.set(ele['id'], false);
          this.disableedit = false;
          return;
        }
      }
    } else {
      this.message.create('info', 'Screen Parameter不可為空');
      this.editMap.set(ele['id'], false);
      this.disableedit = false;
      return;
    }


    // 检查goal 栏位
    if (ele['project'] === 'ppk') {
      if (ele['goal']) {
        if (isNaN(ele['goal'])) {
          this.message.create('info', 'goal data format error');
          this.editMap.set(ele['id'], false);
          this.disableedit = false;
          return;
        } else {
          ele['goal'] = parseFloat(String(ele['goal']).trim());
          if (ele['goal'] < 0) {
            this.message.create('info', 'goal应为正数');
            this.editMap.set(ele['id'], false);
            this.disableedit = false;
            return;
          }
        }
      } else {
        this.message.create('info', 'goal不可為空');
        this.editMap.set(ele['id'], false);
        this.disableedit = false;
        return;
      }
    }

    // save
    ele['updatedUser'] = localStorage.getItem('$DFI$userID');
    ele['updatedTime'] = new Date().getTime();
    ele['screenParameter'] = Math.floor(parseFloat(String(ele['screenParameter']).trim()) * 10) / 10,
      ele['goal'] = Math.floor(parseFloat(String(ele['goal']).trim()) * 10) / 10;
    await this.dataService.updateCTQApiById(ele);
    data.plant = ele['plant'];
    data.project = ele['project'];
    data.screenParameter = ele['screenParameter'];
    data.modelname = ele['modelname'];
    data.stationtype = ele['stationtype'];
    data.tdname = ele['tdname'];
    data.mdname = ele['mdname'];
    data.goal = ele['project'].toLowerCase() === 'ppk' ? ele['goal'] : null;
    data.updatedUser = localStorage.getItem('$DFI$userID');
    data.updatedTime = new Date().getTime();
    data.createdTime = ele['createdTime'];
    this.message.create('success', 'Upload Success');
    this.editMap.set(ele['id'], false);
    this.disableedit = false;
  }

  delRow(id) {
    this.dataService.deleteCTQApiById(id);
    const ckpInfos = this.ckpiInfos.filter(res => res['id'] !== id);
    this.ckpiInfos = ckpInfos;
  }

  // 点击编辑后，在编辑按钮下方显示的按钮##
  cancelEdit(ele) {
    this.editItem = {
      id: ele['id'], plant: ele['plant'], project: ele['project'], screenParameter: ele['screenParameter'], modelname: ele['modelname'],
      stationtype: ele['stationtype'], tdname: ele['tdname'], mdname: ele['mdname'], goal: ele['goal'],
      updatedUser: ele['updatedUser'], updatedTime: ele['updatedTime'], createdTime: ele['createdTime']
    };
    this.editMap.set(ele['id'], false);
    this.disableedit = false;
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

  handleFileInput(evt: any) {
    // debugger;
    this.uploadFileName = evt.files[0].name;
    if (evt.files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      evt.files[0].type !== 'application/vnd.ms-excel') {
      this.message.create('info', 'Please re-upload the excel file in the correct format.');
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
    if (this.inputdata[1].length === 0) {
      this.message.create('info', 'The uploaded file content cannot be empty.');
      return;
    }
    this.showProgress = false;
    // const dataSets = [];
    this.newDatas = [];
    // const upDatas = [];
    for (let index = 1; index < this.inputdata.length; index++) {
      this.progressBar = parseInt((parseFloat((index / (this.inputdata.length - 1)).toFixed(2)) * 100).toFixed(3), 0);
      // debugger;
      const ele = this.inputdata[index];
      let data;
      data = {
        'plant': String(ele[0]).trim(),
        'project': String(ele[1]).trim().toLowerCase(),
        'screenParameter': Math.floor(parseFloat(String(ele[2]).trim()) * 10) / 10,
        'modelname': String(ele[3]).trim(),
        'stationtype': String(ele[4]).trim(),
        'tdname': String(ele[5]).trim(),
        'mdname': String(ele[6]).trim(),
        'goal': String(ele[1]).trim().toLowerCase() === 'ppk' ? Math.floor(parseFloat(String(ele[7]).trim()) * 10) / 10 : undefined,
        'updatedUser': localStorage.getItem('$DFI$userID'),
        'updatedTime': new Date().getTime(),
        'createdTime': new Date().getTime(),
      };

      // 数字校验
      if (String(ele[1]).trim().toLowerCase() === 'ppk') {
        if (ele[2] !== undefined && ele[7] !== undefined) {
          if (isNaN(parseFloat(String(ele[2]).trim())) || isNaN(ele[7])) {
            this.message.create('info', 'Upload failed line' + index + 'data format error');
            this.showProgress = true;
            return;
          } else {
            ele[2] = Math.floor(parseFloat(String(ele[2]).trim()) * 10) / 10;
            ele[7] = Math.floor(parseFloat(String(ele[7]).trim()) * 10) / 10;
            if (ele[2] < 0 || ele[2] > 100 || ele[7] < 0 || ele[7] > 100) {
              this.message.create('info', 'Upload failed Line' + index + 'pper and lower limits cannot be negative');
              this.showProgress = true;
              return;
            }
          }
        }
      } else {
        if (ele[2] !== undefined) {
          if (isNaN(parseFloat(String(ele[2]).trim()))) {
            this.message.create('info', 'Upload failed line' + index + 'data format error');
            this.showProgress = true;
            return;
          } else {
            ele[2] = Math.floor(parseFloat(String(ele[2]).trim()) * 10) / 10;
            if (ele[2] < 0 || ele[2] > 100) {
              this.message.create('info', 'Upload failed line' + index + 'data format error');
              this.showProgress = true;
              return;
            }
          }
        }
      }

      // check
      const existdata: any[] = await this.dataService.getCTQApiByAllOptions(ele[0], ele[1], ele[3], ele[4], ele[5], ele[6]);
      // debugger
      // save
      if (existdata.length > 0) {
        data = {
          'id': existdata[0]['id'],
          'plant': String(ele[0]).trim(),
          'project': String(ele[1]).trim().toLowerCase(),
          'screenParameter': Math.floor(parseFloat(String(ele[2]).trim()) * 10) / 10,
          'modelname': String(ele[3]).trim(),
          'stationtype': String(ele[4]).trim(),
          'tdname': String(ele[5]).trim(),
          'mdname': String(ele[6]).trim(),
          'goal': String(ele[1]).trim().toLowerCase() === 'ppk' ? Math.floor(parseFloat(String(ele[7]).trim()) * 10) / 10 : undefined,
          'updatedUser': localStorage.getItem('$DFI$userID'),
          'updatedTime': new Date().getTime(),
          'createdTime': new Date().getTime(),
        };

        // 更新重复的
        this.dataService.updateCTQApiById(data);
      } else {
        this.newDatas.push(data);
      }
      if (this.inputdata.length - 1 === index) {
        this.proStatus = 'success';
        this.showConfirm(); // 处理好上传资料后会弹出确认上传框
      }
    }
    this.newDatas = this._service.getRidoffDuplicates(this.newDatas);
  }

  showConfirm() {
    this.modalService.confirm({
      nzTitle: '<i>Whether to upload files or not?</i>',
      nzContent: '',
      nzOnOk: async () => { await this.uploadOk(); this.showProgress = true; this.proStatus = 'active'; },
      nzOnCancel: () => { this.showProgress = true; this.proStatus = 'active'; }
    });
  }

  uploadOk() {
    this.dataService.insertCTQApSets(this.newDatas).subscribe(res => {
      // debugger;
      this.message.create('success', 'Uploaded Success');
      this.uploadFileName = null;
      this.inputdata = [];
      this.ckpiInfos = res;
      this.ckpiInfos.forEach(eles => {
        this.editMap.set(eles['id'], false);
      });
      this.disableedit = false;
      this.isVisible = false;
    }, error => { this.message.create('info', 'Upload material too big, please upload in batches.'); });
  }

  // 下载上传文件模板
  downloadTemp() {
    // 获取config中的模板
    this._service.getTemplateFile().toPromise().then(res => {
      const arr: any = res;
      const downloadDatas = arr.map(e => {
        return {
          'Plant ID': e['plantID'],
          'Category': e['category'],
          'Screen Parameter': e['screenparameter'],
          'Model Name': e['modelName'],
          'Stage': e['stage'],
          'Test Item': e['testitem'],
          'Sub Test Item': e['subItem'],
          'Goal': e.goal ? e.goal : '',
        };
      });
      const colWidth = [];
      Object.keys(res[0]).forEach((element, index) => {
        if (index === 2 || index === 5 || index === 6) {
          colWidth.push({ wpx: 180 });
        } else {
          colWidth.push({ wpx: 130 });
        }
      });
      const headerBgColor = '53868B';
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(downloadDatas)), 'CTQ Template', colWidth, headerBgColor);
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
        colWidth.push({ wpx: 120 });
      });
      const headerBgColor = '53868B';
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(this.ckpiInfos)), 'CTQ Data', colWidth, headerBgColor);
    }
  }

  showLog(id) {
    if (id) {
      this._service.getLogDetail(id).subscribe(res => {
        this.isVisible_log = true;
        this.logInfos = res;
        // console.log('----res \n',res)
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
