import { CheckListLog } from './../../../../service/dfq_sdk/sdk/models/CheckListLog';
import { Component, OnInit } from '@angular/core';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import { MainTainService } from './main-tain.service';
import { NzModalService } from 'ng-zorro-antd';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';
import { DatePipe } from '@angular/common';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
// Skyeye SDK
import { LoopBackConfig as SkyeyeLoopBackConfig } from '@service/skyeye_sdk';

@Component({
  selector: 'app-main-tain',
  templateUrl: './main-tain.component.html',
  styleUrls: ['./main-tain.component.scss']
})
export class MainTainComponent implements OnInit {

  cur_site;
  cur_plant;
  project = [];
  projectGroup = [];
  plantGroup = [];
  addPlantGroup = [];
  siteGroup = [];
  addSiteGroup = [];
  kpiInfos: any = [];
  initRawInfos = [];
  ckpiInfos;
  cur_stage = [];
  cur_model = [];
  queryButton = true;
  editMap = new Map<string, boolean>();
  stageGroup = [];
  modelGroup = [];
  addModelGroup = [];
  addStageGroup = [];
  addModelStageInfos;
  modelFlteredOptions = []; // 新增项目时，model 的autocompelete暂存项目
  stageFlteredOptions = [];
  THwidth = ['60px', '60px', '80px', '80px', '80px', '200px', '100px', '80px', '80px', '150px', '150px', '80px', '100px', '100px', '100px', '60px'];
  editItem = {};
  isVisible = false;
  isVisible_log = false;
  disableedit = false;
  nzScroll: {} = { x: '1560px' };
  maintain_list = [];
  maintain_list1 = ['Plant', 'Model Name', 'Stage Code', '預警SPEC(Upper Limit)', '預警SPEC(Lower Limit)'];
  maintain_list2 = ['Plant', 'Model Name', 'Stage Code', 'Test item name', 'Sub test item name', 'Upper Limit', 'Lower Limit', 'pcs'];
  pcs: number | null; // 取样数量
  upn: string | null; // 架构
  showSample: Boolean = false;
  cur_project: string;
  model: string | null;
  add_plant: string | null;
  add_site;
  stageCode: string | null;
  setting1: string | null; setting2: string | null;
  upperCpk: number | null; lowerCpk: number | null;
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
  isShow = false;
  mousekey: any = -1;
  selectArr: any = [];

  constructor(private dataService: LineDataServiceService,
    private message: NzMessageService,
    private _service: MainTainService,
    private modalService: NzModalService,
    private excelService: ExcelToolService,
    private datePipe: DatePipe,
    private esService: EsDataServiceService
  ) { }


  async ngOnInit() {
    const role_arr = JSON.parse(localStorage.getItem('$DFI$UserAuth'));
    this.siteInfos = JSON.parse(localStorage.getItem('Skyeye_plantMapping')).filter(res => res['Site'] === localStorage.getItem('DFC_Site').toUpperCase());
    this.addSiteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    this.siteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    // this.addPlantGroup = this.dataService.groupBy(this.siteInfos, 'Plant');
    // console.log(role_arr['SkyeyeTestItemMaintain']['update']);
    this.role = role_arr['SkyeyeTestItemMaintain'];
    // this.kpiInfos = await this.dataService.getKPIAll(this.addPlantGroup[0]); // 獲取WKS的KPI
    // // this.plantGroup = await this.dataService.groupBy(this.kpiInfos, 'plantId');
    // this.initRawInfos = this.kpiInfos;
    // console.log(this.kpiInfos);
    this.maintain_list = this.maintain_list1;
    this.cur_project = 'fpyr';
  }

  async getOptions(type) {
    console.log(this.cur_plant)
    if (type === 'plant') {
      // this.filterData();
      this.cur_plant = '';
      this.project = [];
      this.cur_stage = [];
      this.cur_model = [];
      this.queryButton = true;
    }
    if (type === 'project') {
      // this.filterData();
      this.project = [];
      this.cur_stage = [];
      this.cur_model = [];
      if (this.cur_plant) {
        this.queryButton = false;
      } else {
        this.queryButton = true;
      }
    }
    if (type === 'stage') {
      // this.filterData();
      this.cur_stage = [];
      this.cur_model = [];
    }
    if (type === 'model') {
      // this.filterData();
      this.cur_model = [];
    }
    if (type === 'query') {
      this.filterData();
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
      });
    }
    if (type === 'addModel') {
      this.addStageGroup = this.addModelStageInfos.map(item => item['stageId']);
      this.addStageGroup = Array.from(new Set(this.addStageGroup));
      this.stageFlteredOptions = Object.values(this.addStageGroup);
    }
  }

  selectedItem() {
    if (this.cur_project === 'rf cpk') {
      this.maintain_list = this.maintain_list2;
    } else {
      this.maintain_list = this.maintain_list1;
    }
    if (this.cur_project === 'assy fixturecpk') {
      this.showSample = true;
      this.maintain_list = this.maintain_list2;
    } else {
      this.showSample = false;
    }
  }

  async query() {
    this.queryButton = false;
    await this.filterData();
    this.ckpiInfos = this.kpiInfos;
    this.ckpiInfos.forEach(ele => {
      this.editMap.set(ele['groupId'], false);
    });
    this.disableedit = false;
  }

  async getOptList(type) {
    if (type === 'project') {
      this.tmp_arr = this.project;
      this.project = [];
      // debugger;
      await this.getSelectData('project');
      this.project = this.tmp_arr;
      this.projectGroup = this.dataService.groupBy(this.selectArr, 'name');
    }
    if (type === 'stage') {
      this.tmp_arr = this.cur_stage;
      this.cur_stage = [];
      await this.getSelectData('stage');
      this.cur_stage = this.tmp_arr;
      this.stageGroup = this.dataService.groupBy(this.selectArr, 'stageId');
    }
    if (type === 'model') {
      // debugger;
      this.tmp_arr = this.cur_model;
      this.cur_model = [];
      await this.getSelectData('model');
      this.cur_model = this.tmp_arr;
      this.modelGroup = this.dataService.groupBy(this.selectArr, 'modelId');
    }
    if (type === 'plant') {
      // 獲取資料
      // this.kpiInfos = await this.dataService.getKPIAll(this.cur_plant); // 獲取WKS的KPI
      // this.kpiInfos = await this.esService.postData(SkyeyeLoopBackConfig.getPath().toString() + '/api/KPIs/getKPIsGroup', this.cur_plant).toPromise();
      // this.initRawInfos = this.kpiInfos;
      this.tmp_arr = this.cur_plant;
      this.cur_plant = '';
      // await this.filterData();
      this.cur_plant = this.tmp_arr;
      // this.plantGroup = this.dataService.groupBy(this.kpiInfos, 'plantId');
      this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
        return res['Plant'];
      });
      // this.cur_plant = undefined;
    }
  }

  async filterData() {
    this.kpiInfos = await this.esService.postData(SkyeyeLoopBackConfig.getPath().toString() + '/api/KPIs/getKPIsGroup', this.cur_plant).toPromise();
    if (this.cur_plant) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_plant.indexOf(res['plantId']) !== -1);
    }
    if (this.cur_stage.length > 0) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_stage.indexOf(res['stageId']) !== -1);
    }
    if (this.cur_model.length > 0) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_model.indexOf(res['modelId']) !== -1);
    }
    if (this.project.length > 0) {
      this.kpiInfos = this.kpiInfos.filter(res => this.project.indexOf(res['name']) !== -1);
    }
    this.queryButton = false;
  }

  // 编辑按钮 ##
  editRow(ele) {
    this.editMap.set(ele['groupId'], true);
    this.disableedit = true;
    this.curEditRow = JSON.parse(JSON.stringify(ele));
    this.editItem = {
      id: ele['id'], plantId: ele['plantId'], stageId: ele['stageId'], modelId: ele['modelId'], name: ele['name'],
      threshold1: ele['threshold1'], threshold2: ele['threshold2'], upperCpk: ele['upperCpk'], lowerCpk: ele['lowerCpk'], updatedUser: ele['updatedUser'],
      updatedTime: ele['updatedTime'], createdTime: ele['createdTime'], pcs: ele['pcs'], upn: ele['upn'], groupId: ele['groupId']
    };
  }

  // 再次点击编辑以后保存功能
  async saveRow(ele, data) {
    // const existdata: any = await this.dataService.getPKIByAllOptions(ele['plantId'], ele['stageId'], ele['name'], ele['modelId'], ele['threshold1'], ele['threshold2'], ele['upn'], ele['upperCpk'], ele['lowerCpk']);
    if (ele['pcs'] !== data['pcs'] || ele['lowerCpk'] !== data['lowerCpk'] || ele['upperCpk'] !== data['upperCpk'] || ele['threshold1'] !== data['threshold1'] || ele['threshold2'] !== data['threshold2']) {
          // 判斷key欄位有無修改，這裡是沒有被修改到
    if (ele['name'] === 'rf cpk') {
      // 檢驗lower,upper欄位是否是數值
      if (ele['upperCpk'] && ele['lowerCpk']) {
        if (isNaN(ele['upperCpk']) || isNaN(ele['lowerCpk'])) {
          this.message.create('info', '上下限資料格式錯誤');
          this.editMap.set(data['groupId'], false);
          this.disableedit = false;
          return;
        } else {
          ele['upperCpk'] = parseFloat(String(ele['upperCpk']).trim());
          ele['lowerCpk'] = parseFloat(String(ele['lowerCpk']).trim());
          if (ele['upperCpk'] < 0 || ele['lowerCpk'] < 0) {
            this.message.create('info', 'cpk上下限值不可填寫負值');
            this.editMap.set(data['groupId'], false);
            this.disableedit = false;
            return;
          }
          if (ele['upperCpk'] > 100 || ele['lowerCpk'] > 100) {
            this.message.create('info', '上下限值請填寫0~100');
            this.editMap.set(data['groupId'], false);
            this.disableedit = false;
            return;
          }
        }
      } else {
        this.message.create('info', '上下限不可為空');
        this.editMap.set(data['groupId'], false);
        this.disableedit = false;
        return;
      }
    } else if (ele['name'] === 'assy fixturecpk') {
      // 檢驗lower,upper欄位是否是數值
      if (ele['upperCpk'] && ele['lowerCpk']) {
        if (isNaN(ele['upperCpk']) || isNaN(ele['lowerCpk'])) {
          this.message.create('info', '上下限資料格式錯誤');
          this.editMap.set(data['groupId'], false);
          this.disableedit = false;
          return;
        } else {
          ele['upperCpk'] = parseFloat(String(ele['upperCpk']).trim());
          ele['lowerCpk'] = parseFloat(String(ele['lowerCpk']).trim());
          if (ele['upperCpk'] < 0 || ele['lowerCpk'] < 0) {
            this.message.create('info', 'cpk上下限值不可填寫負值');
            this.editMap.set(data['groupId'], false);
            this.disableedit = false;
            return;
          }
          if (ele['upperCpk'] > 100 || ele['lowerCpk'] > 100) {
            this.message.create('info', '上下限值請填寫0~100');
            this.editMap.set(data['groupId'], false);
            this.disableedit = false;
            return;
          }
        }
      } else {
        this.message.create('info', '上下限不可為空');
        this.editMap.set(data['groupId'], false);
        this.disableedit = false;
        return;
      }

      if (ele['pcs']) {
        if (isNaN(ele['pcs'])) {
          this.message.create('info', '取樣數量資料格式錯誤');
          this.editMap.set(data['groupId'], false);
          this.disableedit = false;
          return;
        } else {
          // tslint:disable-next-line: radix
          ele['pcs'] = parseInt(String(ele['pcs']).trim());
          if (ele['pcs'] < 0) {
            this.message.create('info', '取樣數量不可填寫負值');
            this.editMap.set(data['groupId'], false);
            this.disableedit = false;
            return;
          }
        }
      } else {
        this.message.create('info', '取樣數量不可為空');
        this.editMap.set(data['groupId'], false);
        this.disableedit = false;
        return;
      }
    } else if (ele['name'] === 'retry rate' || ele['name'] === 'fpyr') {
      // 檢驗lower,upper欄位是否是數值
      if (ele['threshold1'] && ele['threshold2']) {
        if (isNaN(ele['threshold1']) || isNaN(ele['threshold2'])) {
          this.message.create('info', '上下限資料格式錯誤');
          this.editMap.set(data['groupId'], false);
          this.disableedit = false;
          return;
        } else {
          ele['threshold1'] = parseFloat(String(ele['threshold1']).trim());
          ele['threshold2'] = parseFloat(String(ele['threshold2']).trim());
          if (ele['threshold1'] > 100 || ele['threshold1'] < 0 || ele['threshold2'] < 0 || ele['threshold2'] > 100) {
            this.message.create('info', '上下限值請填寫0~100');
            this.editMap.set(data['groupId'], false);
            this.disableedit = false;
            return;
          }
        }
      } else {
        this.message.create('info', '上下限不可為空');
        this.editMap.set(data['groupId'], false);
        this.disableedit = false;
        return;
      }
    } else {
      if (ele['threshold1'] && ele['threshold2']) {
        if (isNaN(ele['threshold1']) || isNaN(ele['threshold2'])) {
          this.message.create('info', '上下限資料格式錯誤');
          this.editMap.set(data['groupId'], false);
          this.disableedit = false;
          return;
        } else {
          ele['threshold1'] = parseFloat(String(ele['threshold1']).trim());
          ele['threshold2'] = parseFloat(String(ele['threshold2']).trim());
          if (ele['threshold1'] > 100 || ele['threshold1'] < 0 || ele['threshold2'] < 0 || ele['threshold2'] > 100) {
            this.message.create('info', '上下限值請填寫0~100');
            this.editMap.set(data['groupId'], false);
            this.disableedit = false;
            return;
          }
        }
      } else {
        this.message.create('info', '上下限不可為空');
        this.editMap.set(data['groupId'], false);
        this.disableedit = false;
        return;
      }
    }
    // save
    ele['updatedUser'] = localStorage.getItem('$DFI$userID');
    ele['updatedTime'] = new Date().getTime();
    ele['modelId'] = String(ele['modelId']).trim();
    ele['stageId'] = String(ele['stageId']).trim();
    // console.log('修改后传入后端的数据 \n', [ele]);
    // await this.esService.postData(SkyeyeLoopBackConfig.getPath().toString() + '/api/KPIs/updateKPIsGroup', ele).toPromise();
    this.esService.postData(SkyeyeLoopBackConfig.getPath().toString() + '/api/KPIs/updateKPIsGroup', [ele]).subscribe(res => {
      if (res['msg'] === 'ok') {
        data.plantId = ele['plantId'];
        data.modelId = ele['modelId'];
        data.stageId = ele['stageId'];
        data.name = ele['name'];
        data.threshold1 = ele['threshold1'];
        data.threshold2 = ele['threshold2'];
        data.upperCpk = ele['upperCpk'];
        data.lowerCpk = ele['lowerCpk'];
        data.upn = ele['upn'];
        data.pcs = ele['pcs'];
        data.updatedUser = localStorage.getItem('$DFI$userID');
        data.updatedTime = new Date().getTime();
        data.createdTime = ele['createdTime'];
        this.message.create('success', '更新成功');
        this.editMap.set(data['groupId'], false);
        this.disableedit = false;
      }
    });
    } else {
      this.editMap.set(data['groupId'], false);
      this.disableedit = false;
    }
  }

  delRow(id) {
    this.dataService.deleteKPIById(id);
    this.esService.postData(SkyeyeLoopBackConfig.getPath().toString() + '/api/KPIs/delKPIsGroup', {'groupId': id}).subscribe((data) => {
      const ckpInfos = this.ckpiInfos.filter(res => res['groupId'] !== id);
      this.ckpiInfos = ckpInfos;
    });
  }

  // 点击编辑后，在编辑按钮下方显示的按钮##
  cancelEdit(ele) {
    this.editItem = {
      id: ele['id'], plantId: ele['plantId'], stageId: ele['stageId'], modelId: ele['modelId'], name: ele['name'],
      threshold1: ele['threshold1'], threshold2: ele['threshold2'], upperCpk: ele['upperCpk'], lowerCpk: ele['lowerCpk'], updatedUser: ele['updatedUser'],
      updatedTime: ele['updatedTime'], createdTime: ele['createdTime'], pcs: ele['pcs'], upn: ele['upn']
    };
    this.editMap.set(ele['groupId'], false);
    this.disableedit = false;
  }

  showModal(): void {
    this.isVisible = true;
  }

  // 单独新增RF CPK测试项时，若存在重复，弹出是否覆盖确认框，若选择取消，照理应该自出查出该笔重复的记录，可是目前查出的是不带大小测试项目的记录
  // 是因为系统目前没做这块（要改filterData()），做的这么全面好累的说，待後面User提到時再說吧
  // 新增##
  async handleOk() {
    let data;
    if (this.model === undefined || this.stageCode === undefined || this.setting1 === undefined || this.setting2 === undefined) {
      this.message.create('info', '輸入項不可為空');
    } else {
      data = {
        'name': String(this.cur_project).trim(),
        'plantId': String(this.add_plant).trim(),
        'modelId': String(this.model).trim(),
        // tslint:disable-next-line: radix
        'pcs': String(this.cur_project).trim() !== 'assy fixturecpk' ? undefined : parseInt(String(this.pcs).trim()),
        'upn': String(this.cur_project).trim() !== 'rf cpk' && String(this.cur_project).trim() !== 'retry rate' ? undefined : String(this.upn).trim(),
        'stageId': String(this.stageCode).trim(),
        'threshold1': (String(this.cur_project).trim() !== 'rf cpk' && String(this.cur_project).trim() !== 'assy fixturecpk') ? parseFloat(String(this.setting1).trim()) : String(this.setting1).trim(),
        'threshold2': (String(this.cur_project).trim() !== 'rf cpk' && String(this.cur_project).trim() !== 'assy fixturecpk') ? parseFloat(String(this.setting2).trim()) : String(this.setting2).trim(),
        'upperCpk': (String(this.cur_project).trim() !== 'rf cpk' && String(this.cur_project).trim() !== 'assy fixturecpk') ? undefined : parseFloat(String(this.upperCpk).trim()),
        'lowerCpk': (String(this.cur_project).trim() !== 'rf cpk' && String(this.cur_project).trim() !== 'assy fixturecpk') ? undefined : parseFloat(String(this.lowerCpk).trim()),
        'updatedUser': localStorage.getItem('$DFI$userID'),
        'updatedTime': new Date().getTime(),
        'createdTime': new Date().getTime()
      };
      // check
      // const existdata: any = await this.dataService.getPKIByAllOptions(this.add_plant, this.stageCode, this.cur_project, this.model, this.setting1, this.setting2, this.upn, this.upperCpk, this.lowerCpk);
      // check 上下限值
      switch (String(this.cur_project).trim()) {
        case 'assy fixturecpk':
          if (isNaN(this.upperCpk) || isNaN(this.lowerCpk)) {
            this.message.create('info', '上下限資料格式錯誤');
            return;
          } else {
            this.upperCpk = parseFloat(String(this.upperCpk).trim());
            this.lowerCpk = parseFloat(String(this.lowerCpk).trim());
            if (this.upperCpk < 0 || this.lowerCpk < 0) {
              this.message.create('info', 'cpk上下限值不可填寫負值');
              return;
            }
          }
          if (isNaN(this.pcs)) {
            this.message.create('info', '取樣數量資料格式錯誤');
            return;
          } else {
            // tslint:disable-next-line: radix
            this.pcs = parseInt(String(this.pcs).trim());
            if (this.pcs < 0) {
              this.message.create('info', '取樣數量不可填寫負值');
              return;
            }
          }
          break;

          case 'rf cpk':
            if (isNaN(this.upperCpk) || isNaN(this.lowerCpk)) {
              this.message.create('info', '上下限資料格式錯誤');
              return;
            } else {
              this.upperCpk = parseFloat(String(this.upperCpk).trim());
              this.lowerCpk = parseFloat(String(this.lowerCpk).trim());
              if (this.upperCpk < 0 || this.lowerCpk < 0) {
                this.message.create('info', 'cpk上下限值不可填寫負值');
                return;
              }
            }
            if (this.upn === undefined) {
              this.message.create('info', '架构栏位不能为空');
              return;
            } else if (!this.upn.trim()) {
              this.message.create('info', '架构栏位不能为空');
              return;
            }
            break;

            case 'fpyr':
              if (isNaN(parseFloat(this.setting1)) || isNaN(parseFloat(this.setting2))) {
                this.message.create('info', '上下限資料格式錯誤');
                return;
              } else {
                if (parseFloat(this.setting1) < 0 || parseFloat(this.setting1) > 100 || parseFloat(this.setting2) < 0 || parseFloat(this.setting2) > 100) {
                  this.message.create('info', '上下限值請填寫0~100');
                  return;
                }
              }
              // if (this.upn === undefined) {
              //   this.message.create('info', '架构栏位不能为空');
              //   return;
              // } else if (!this.upn.trim()) {
              //   this.message.create('info', '架构栏位不能为空');
              //   return;
              // }
              break;

              case 'retry rate':
                if (isNaN(parseFloat(this.setting1)) || isNaN(parseFloat(this.setting2))) {
                  this.message.create('info', '上下限資料格式錯誤');
                  return;
                } else {
                  if (parseFloat(this.setting1) < 0 || parseFloat(this.setting1) > 100 || parseFloat(this.setting2) < 0 || parseFloat(this.setting2) > 100) {
                    this.message.create('info', '上下限值請填寫0~100');
                    return;
                  }
                }
                if (this.upn === undefined) {
                  this.message.create('info', '架构栏位不能为空');
                  return;
                } else if (!this.upn.trim()) {
                  this.message.create('info', '架构栏位不能为空');
                  return;
                }
                break;

        default:
          if (isNaN(parseFloat(this.setting1)) || isNaN(parseFloat(this.setting2))) {
            this.message.create('info', '上下限資料格式錯誤');
            return;
          } else {
            if (parseFloat(this.setting1) < 0 || parseFloat(this.setting1) > 100 || parseFloat(this.setting2) < 0 || parseFloat(this.setting2) > 100) {
              this.message.create('info', '上下限值請填寫0~100');
              return;
            }
          }
          break;
      }
      this.addOneData(data);
    }
  }

  addOneData(data) {
    this.esService.postData(SkyeyeLoopBackConfig.getPath().toString() + '/api/KPIs/updateKPIsGroup', [data]).subscribe((async result => {
      if (result['msg'] === 'ok' && result['createResult'].length > 0) {
        if (result['errUpn'].length > 0) {
          this.message.create('warning', '至少存在一笔架构数据格式错误.');
        } else {
          this.message.create('success', '维护成功');
        }
        this.kpiInfos = [];
        // this.kpiInfos.push(result);
        // this.ckpiInfos = this.kpiInfos;
        console.log(result['createResult'])
        this.ckpiInfos = await this.esService.postData(SkyeyeLoopBackConfig.getPath().toString() + '/api/KPIs/getKPIsGroup', {'groupId': result['createResult']}).toPromise();
        this.ckpiInfos.forEach(eles => {
          this.editMap.set(eles['groupId'], false);
        });
        this.disableedit = false;
        this.isVisible = false;
      }
    }));
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
      console.log('读到的数据--- \n',this.inputdata);
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
    // const dataSets = [];
    this.newDatas = [];
    // const upDatas = [];
    for (let index = 1; index < this.inputdata.length; index++) {
      this.progressBar = parseInt((parseFloat((index / (this.inputdata.length - 1)).toFixed(2)) * 100).toFixed(3), 0);
      // debugger;
      const ele = this.inputdata[index];
      let data;
      data = {
        'name': String(ele[0]).trim().toLowerCase(),
        'plantId': String(ele[1]).trim(),
        'modelId': String(ele[2]).trim(),
        'stageId': String(ele[3]).trim(),
        'threshold1': (String(ele[0]).trim().toLowerCase() !== 'rf cpk' && String(ele[0]).trim().toLowerCase() !== 'assy fixturecpk') ? parseFloat(String(ele[4]).trim()) : String(ele[4]).trim(),
        'threshold2': (String(ele[0]).trim().toLowerCase() !== 'rf cpk' && String(ele[0]).trim().toLowerCase() !== 'assy fixturecpk') ? parseFloat(String(ele[5]).trim()) : String(ele[5]).trim(),
        'upperCpk': (String(ele[0]).trim().toLowerCase() !== 'rf cpk' && String(ele[0]).trim().toLowerCase() !== 'assy fixturecpk') ? undefined : parseFloat(String(ele[6]).trim()),
        'lowerCpk': (String(ele[0]).trim().toLowerCase() !== 'rf cpk' && String(ele[0]).trim().toLowerCase() !== 'assy fixturecpk') ? undefined : parseFloat(String(ele[7]).trim()),
        'updatedUser': localStorage.getItem('$DFI$userID'),
        'updatedTime': new Date().getTime(),
        'createdTime': new Date().getTime(),
        // 添加取样数量
        // tslint:disable-next-line: radix
        'pcs': String(ele[0]).trim().toLowerCase() !== 'assy fixturecpk' ? undefined : parseInt(String(ele[8]).trim()),
        'upn': String(ele[0]).trim().toLowerCase() !== 'rf cpk' && String(ele[0]).trim().toLowerCase() !== 'retry rate' ? undefined : String(ele[9]).trim(),
      };
      // 数字校验
      // debugger;
      if (ele[6] !== undefined && ele[7] !== undefined) {
        if (isNaN(ele[6]) || isNaN(ele[7])) {
          this.message.create('info', '上傳失敗' + '第' + index + '行资料格式错误');
          this.showProgress = true;
          return;
        } else {
          ele[6] = parseFloat(String(ele[6]).trim());
          ele[7] = parseFloat(String(ele[7]).trim());
          if (ele[6] < 0 || ele[7] < 0) {
            this.message.create('info', '上傳失敗' + '第' + index + '行上下限值不可為負數');
            this.showProgress = true;
            return;
          }
        }
      }
      if (String(ele[0]).trim().toLowerCase() === 'assy fixturecpk') {
        if (isNaN(ele[8])) {
          this.message.create('info', '取樣數量資料格式錯誤');
          this.showProgress = true;
          return;
        } else {
          // tslint:disable-next-line: radix
          this.pcs = parseInt(String(this.pcs).trim());
          if (this.pcs < 0) {
            this.message.create('info', '上傳失敗' + '第' + index + '行资料格式错误');
            this.showProgress = true;
            return;
          }
        }
      }
      if (String(ele[0]).trim().toLowerCase() === 'rf cpk' || String(ele[0]).trim().toLowerCase() === 'retry rate') {
        if (!String(ele[9]).trim() || String(ele[9]).trim() === 'undefined') {
          this.message.create('info', '上傳失敗' + '第' + index + '行架构栏位不能为空');
          this.showProgress = true;
          return;
        }
      }
      if (String(ele[0]).trim().toLowerCase() !== 'rf cpk' && String(ele[0]).trim().toLowerCase() !== 'assy fixturecpk') {
        if (isNaN(ele[4]) || isNaN(ele[5])) {
          this.message.create('info', '上傳失敗' + '第' + index + '行资料格式错误');
          this.showProgress = true;
          return;
        } else {
          ele[4] = parseFloat(String(ele[4]).trim());
          ele[5] = parseFloat(String(ele[5]).trim());
          if (ele[4] > 100 || ele[4] < 0 || ele[5] < 0 || ele[5] > 100) {
            this.message.create('info', '上傳失敗' + '第' + index + '行上下限值請填寫0~100');
            this.showProgress = true;
            return;
          }
        }
      }

    this.newDatas.push(data);
    if (this.inputdata.length - 1 === index) {
      this.proStatus = 'success';
      this.showConfirm(); // 处理好上传资料后会弹出确认上传框
    }
    }
    // 上传文件中重复项
    // this.newDatas = this._service.getRidoffDuplicates(this.newDatas);
  }


  showConfirm() {
    this.modalService.confirm({
      nzTitle: '<i>是否上传文件?</i>',
      nzContent: '',
      nzOnOk: async () => { await this.uploadOk(); this.showProgress = true; this.proStatus = 'active'; },
      nzOnCancel: () => { this.showProgress = true; this.proStatus = 'active'; }
    });
  }

  uploadOk() {
    this.pcs = null;
    this.esService.postData(SkyeyeLoopBackConfig.getPath().toString() + '/api/KPIs/updateKPIsGroup', this.newDatas).subscribe(async data => {
      if (data['msg'] === 'ok') {
        if (data['result'].length > 0) {
          this.ckpiInfos = await this.esService.postData(SkyeyeLoopBackConfig.getPath().toString() + '/api/KPIs/getKPIsGroup', {'groupId': data['result']}).toPromise();
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
        colWidth.push({ wpx: 120 });
      });
      const headerBgColor = '53868B';
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(this.ckpiInfos)), 'MaintainData', colWidth, headerBgColor);
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

  show(i: number) {
    this.isShow = true;
    this.mousekey = i;
  }

  hidden() {
    this.isShow = false;
  }

  async getSelectData(type) {
    let postData = {};
    if (type === 'plant') {
      postData = {
        'name': this.project,
        'plantId': this.cur_plant,
        'modelId': this.cur_model,
        'stageId': this.cur_stage,
        'keyValue': 'stageId'
      };
    }
    if (type === 'project') {
        postData = {
          'plantId': this.cur_plant,
          'keyValue': 'name'
        };
    }
    if (type === 'stage') {
      postData = {
        'name': this.project,
        'plantId': this.cur_plant,
        'keyValue': 'stageId'
      };
    }
    if (type === 'model') {
      postData = {
        'name': this.project,
        'plantId': this.cur_plant,
        'stageId': this.cur_stage,
        'keyValue': 'modelId'
      };
    }
    this.selectArr = await this.esService.postData(SkyeyeLoopBackConfig.getPath().toString() + '/api/KPIs/queryKPIsGroup', postData).toPromise();
  }
}
