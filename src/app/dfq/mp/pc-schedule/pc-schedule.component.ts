import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { CommonService } from '@service/dpm_sdk/common.service';
import { LINEApi, FpyrApi } from '@service/dpm_sdk/sdk';
import { ActivatedRoute } from '@angular/router';
import { PcScheduleApi } from '@service/dfq_sdk/sdk/services/custom/PcSchedule';
import { PcSchedule } from '@service/dfq_sdk/sdk';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-pc-schedule',
  templateUrl: './pc-schedule.component.html',
  styleUrls: ['./pc-schedule.component.scss']
})
export class PcScheduleComponent implements OnInit, OnDestroy {
  // from
  validateForm: FormGroup;
  plants;
  lines;
  models;
  selectedPlant;
  selectedLine;
  selectedModel;
  selectedDate;
  selectedDateRange;
  selectedStartDate;
  selectedEndDate;
  spanLenth;
  selectedMfgType;
  selectTable = [];
  mfgTypes = ['PCBA', 'FA'];
  showModels = [];
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mapOfCheckedId: { [key: string]: boolean } = {};
  isUpoad = false;

  // Add
  addOneFlag = false;
  isAddLoading = false;
  isOkLoading;
  isOkLoading2;
  isOkLoading3;
  selectedDateAdd;
  selectedPlantAdd;
  selectedMfgTypeAdd;
  selectedLineAdd;
  selectedModelAdd;
  selectPlanQtyAdd;

  // delete
  numberOfChecked = 0;
  isDelLoading = false;
  isDownLoad = false;
  isOperating = false;
  delData = [];
  selectedDateDel;

  editOneFlag = false;
  editDataId;
  editDate;
  editPlant;
  editMfgType;
  editlines;
  editLine;
  editModel;
  editPlanQty;
  oldData;

  // listOfTable and Preview the uploadedTable
  allData = [];
  listOfDisplayData = [];
  isDisplayTable = false;
  isLoading = false;
  uploading = false;
  uploadLoding;
  uploadFileName = '';
  filetoUpload;
  uploadData = [];
  uploadSameData = [];
  uploadSameDataArr = [];
  uploadNewDataArr = [];
  saveSameData;
  uploadSameDataIndex = [];
  coverFlag = false;
  isAllDisplayDataChecked2 = false;
  isIndeterminate2 = false;
  mapOfCheckedId2: { [key: string]: boolean } = {};
  previewFlag = false;
  uploadCreatdData = [];
  uploadCancelData = [];
  fileData;
  excelTitle;
  downLoading = false;
  newDates;
  exlines;
  exmodels;

  // sort and filter
  listOfLines = [];
  listOfModels = [];
  listOfSearchModels = [];
  listOfSearchLines = [];
  sortName;
  sortValue;
  isPagination = true;
  timer;
  // i18n
  destroy$ = new Subject();
  trans: Object = {};

  constructor(
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private dpmService: CommonService,
    private lineService: LINEApi,
    private router: ActivatedRoute,
    private fpyrService: FpyrApi,
    private pcScheduleService: PcScheduleApi,
    private translate: TranslateService
  ) {
    this.plants = this.router.snapshot.data['getPlant'];
  }

  ngOnInit() {
    // 初始化I18N;
    this.translate.get(['dfq.mp-already-exists', 'dfq.mp-modify-before-uploading', 'dfq.mp-no-data-upload', 'dfq.mp-not-match-tempelate', 'dfq.mp-data-verification', 'dfq.mp-same-line-repeated', 'dfq.mp-prompt']).subscribe(res => {
      this.trans['alreadyExists'] = res['dfq.mp-already-exists'];
      this.trans['modifyBeforeUploading'] = res['dfq.mp-modify-before-uploading'];
      this.trans['noDataUpload'] = res['dfq.mp-no-data-upload'];
      this.trans['notMatchTempelate'] = res['dfq.mp-not-match-tempelate'];
      this.trans['dataVerification'] = res['dfq.mp-data-verification'];
      this.trans['sameLineRepeated'] = res['dfq.mp-same-line-repeated'];
      this.trans['prompt'] = res['dfq.mp-prompt'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.mp-already-exists', 'dfq.mp-modify-before-uploading', 'dfq.mp-no-data-upload', 'dfq.mp-not-match-tempelate', 'dfq.mp-data-verification', 'dfq.mp-same-line-repeated', 'dfq.mp-prompt']).subscribe(res => {
        this.trans['alreadyExists'] = res['dfq.mp-already-exists'];
        this.trans['modifyBeforeUploading'] = res['dfq.mp-modify-before-uploading'];
        this.trans['noDataUpload'] = res['dfq.mp-no-data-upload'];
        this.trans['notMatchTempelate'] = res['dfq.mp-not-match-tempelate'];
        this.trans['dataVerification'] = res['dfq.mp-data-verification'];
        this.trans['sameLineRepeated'] = res['dfq.mp-same-line-repeated'];
        this.trans['prompt'] = res['dfq.mp-prompt'];
      });
    });
    // receive router query params
    this.router.queryParams.subscribe(params => {
      if (params['plant']) {
        this.selectedPlant = params['plant'];
      }
      if (params['line']) {
        this.selectedLine = params['line'];
      }
      if (params['model']) {
        this.selectedModel = params['model'];
      }
      if (params['mfgType']) {
        this.selectedMfgType = params['mfgType'];
      }
      if (params['selectedDateRange']) {
        const date = [];
        for (let i = 0; i < params['selectedDateRange'].split(',').length; i++) {
          date.push(params['selectedDateRange'].split(',')[i]);
          this.selectedStartDate = moment(params['selectedDateRange'].split(',')[0]).format('YYYY-MM-DD');
          this.selectedEndDate = moment(params['selectedDateRange'].split(',')[1]).format('YYYY-MM-DD');
        }
        this.selectedDateRange = date;
      }

      // form validator init
      this.validateForm = this.fb.group({
        mfgType: [this.selectedMfgType, [Validators.required]],
        plant: [this.selectedPlant, [Validators.required]],
        line: [null],
        modelId: [null],
        date: [this.selectedDateRange, [Validators.required]],
      });
      // auto query
      if (this.validateForm.valid) {
        this.query();
      }
    });
  }

  // form query
  async query() {
    this.isLoading = true;
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    // set dpm api url by plant and set historyRouterUrl
    this.dpmService.setBaseUrl(this.selectedPlant);
    history.replaceState('', document.title, 'dashboard/dfq/mp/pc-schedule?' + `plant=${this.selectedPlant}&mfgType=${this.selectedMfgType}&model=${this.selectedModel}&line=${this.selectedLine}&selectedDateRange=${this.selectedDateRange}`);
    if (this.selectedLine === 'undefined' || this.selectedLine == null || this.selectedLine === 'null') {
      this.selectedLine = undefined;
    }
    if (this.selectedModel === 'undefined' || this.selectedModel == null || this.selectedModel === 'null') {
      this.selectedModel = undefined;
    }
    this.getPcSchedule(this.selectedPlant, this.selectedMfgType, this.selectedStartDate, this.selectedEndDate, this.selectedLine, this.selectedModel).subscribe(res => {
      // sort asc by date model line
      res.sort(function (a, b) {
        const v1 = a['date'] + a['model'] + a['line'];
        const v2 = b['date'] + b['model'] + b['line'];
        return v1 == v2 ? 0 : v1 < v2 ? -1 : 1;
      });
      // list of sort and filter data
      for (let index = 0; index < res.length; index++) {
        this.listOfLines = [...this.listOfLines, { text: res[index]['line'], value: res[index]['line'] }];
        this.listOfModels = [...this.listOfModels, { text: res[index]['model'], value: res[index]['model'] }];
      }
      const result = new Map();
      this.listOfLines = this.listOfLines.filter(item => !result.has(item['value']) && result.set(item['value'], 1));
      this.listOfModels = this.listOfModels.filter(item => !result.has(item['value']) && result.set(item['value'], 1));
      // onedata for filter and sort anther display
      this.listOfDisplayData = res;
      this.allData = res;
      this.isDisplayTable = true;
      this.isLoading = false;
      this.isDownLoad = true;
      this.isUpoad = false;
    });

  }


  findBigData(value, type) {
    if (!value) {
      return;
    }
    this.timer = setInterval(() => {
      this.searchValue(value, type);
    }, 30000);
  }

  // linkage search
  searchValue(value, type) {
    const reg = new RegExp(value, 'i');
    const datas = this.models.filter(item => item.modelName.match(reg));
    this.showModels = datas.slice();
  }


  // ngModelChange when user select plant filter list of modles and lines
  getLines(plant: string, process: string) {
    if (!this.selectedLine) {
      this.selectedLine = undefined;
    }
    this.lines = [];
    this.models = [];
    this.showModels = [];
    if (plant) {
      if (!process) {
        process = undefined;
      }
      // set url by plant
      this.dpmService.setBaseUrl(plant);
      // get a list of lines
      this.lineService.find({
        where: {
          plant: plant,
          mfgtype: process === 'PCBA' ? 'PCB' : process
        }
      }).subscribe({
        next: lines => { this.lines = lines.filter(item => item['line'] !== '*'); },
        error: err => {
          if (err === 'Server error') {
            this.messageService.create('error', 'Server error');
          } else {
            throw err;
          }
        },
      });
      /* get a list of models */
      const modelListFilter = {
        where: {
          plant: plant,
          mfgType: process
        },
        group: ['model']
      };
      this.fpyrService.find(modelListFilter).subscribe({
        next: data => {
          this.models = data.map(x => x['model']).sort();
          this.showModels = this.models.slice();
        },
        error: err => {
          if (err === 'Server error') {
            this.messageService.create('error', 'Server error');
          } else {
            throw err;
          }
        },
      });
    }
  }

  // click add button show the addmodal and initVar
  addModel() {
    this.isOkLoading = false;
    this.isAddLoading = true;
    this.addOneFlag = true;
    this.selectedDateAdd = undefined;
    this.selectedPlantAdd = undefined;
    this.selectedMfgTypeAdd = undefined;
    this.selectedLineAdd = undefined;
    this.selectedModelAdd = undefined;
    this.selectPlanQtyAdd = undefined;
  }


  // add  to pcScudule
  async addOne() {
    this.modalService.confirm({
      nzTitle: '<i>Save Alert</i>',
      nzContent: '<b>Do you Want to Save?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnCancel: async () => {
        this.isOkLoading = false;
        return;
      },
      nzOnOk: async () => {
        this.isOkLoading = true;
        if (!this.selectedDateAdd) {
          this.message.create('error', 'Please select a date!');
          this.isOkLoading = false;
          return;
        } else if (!this.selectedPlantAdd) {
          this.message.create('error', 'Please select plant!');
          this.isOkLoading = false;
          return;
        } else if (!this.selectedMfgTypeAdd) {
          this.message.create('error', 'Please select product type!');
          this.isOkLoading = false;
          return;
        } else if (!this.selectedLineAdd) {
          this.message.create('error', 'Please select the line!');
          this.isOkLoading = false;
          return;
        } else if (!this.selectedModelAdd) {
          this.message.create('error', 'Please select the model!');
          this.isOkLoading = false;
          return;
        } else if (!this.selectPlanQtyAdd) {
          this.message.create('error', 'Please fill in the output!');
          this.isOkLoading = false;
          return;
        }
        const uuid = this.guid();
        const addNewData = {
          id: uuid,
          date: moment(this.selectedDateAdd).format('YYYY-MM-DD'),
          process: this.selectedMfgTypeAdd,
          plant: this.selectedPlantAdd,
          line: this.selectedLineAdd,
          model: this.selectedModelAdd,
          planQty: Math.floor(this.selectPlanQtyAdd),
          uploadBy: localStorage.getItem('$DFI$userID'),
        };
        // Check whether the data exists
        this.searchPcSchedule(addNewData.plant, addNewData.process, addNewData.date, addNewData.line, addNewData.model).subscribe(red => {
          if (red.length !== 0) {
            this.message.create('error', this.trans['alreadyExists']);
            this.isOkLoading = false;
            return;
          } else {
            this.addPcSchedule(addNewData).subscribe(ree => {
              this.allData.push(ree);
              this.listOfDisplayData = this.allData;
              this.listOfDisplayData = this.listOfDisplayData.slice();
              this.isDisplayTable = true;
              this.isOkLoading = false;
              this.isAddLoading = false;
              this.addOneFlag = false;
              this.message.create('success', 'Added successfully!');
            });

          }
        });
      }
    });
  }

  cancelAddOne() {
    this.isOkLoading = false;
    this.isAddLoading = false;
    this.addOneFlag = false;
  }

  // modify
  editModal(data) {
    this.editDataId = data.id;
    this.editDate = data.date;
    this.editPlant = data.plant;
    this.editMfgType = data.process;
    this.editLine = data.line;
    this.editModel = data.model;
    this.editPlanQty = data.planQty;
    this.oldData = data;
    this.editOneFlag = true;
  }

  editOne() {
    this.isOkLoading2 = true;
    this.modalService.confirm({
      nzTitle: '<i>Modify Alert</i>',
      nzContent: '<b>Are you sure to Modify?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnCancel: async () => {
        this.isOkLoading2 = false;
        return;
      },
      nzOnOk: async () => {
        this.isOkLoading = true;
        if (!this.editDate) {
          this.message.create('error', 'Please select a date!');
          this.isOkLoading2 = false;
          return;
        } else if (!this.editPlant) {
          this.message.create('error', 'Please select plant!');
          this.isOkLoading2 = false;
          return;
        } else if (!this.editMfgType) {
          this.message.create('error', 'Please select product type!');
          this.isOkLoading2 = false;
          return;
        } else if (!this.editLine) {
          this.message.create('error', 'Please select the line!');
          this.isOkLoading2 = false;
          return;
        } else if (!this.editModel) {
          this.message.create('error', 'Please select the model!');
          this.isOkLoading2 = false;
          return;
        } else if (!this.editPlanQty) {
          this.message.create('error', 'Please fill in the output!');
          this.isOkLoading2 = false;
          return;
        }
        const editNewData = {
          id: this.editDataId,
          date: moment(this.editDate).format('YYYY-MM-DD'),
          process: this.editMfgType,
          plant: this.editPlant,
          line: this.editLine,
          model: this.editModel,
          planQty: Math.floor(this.editPlanQty),
          uploadBy: localStorage.getItem('$DFI$userID'),
        };
        this.updatePcSchedule(editNewData).subscribe(
          res => {
            Object.assign(this.oldData, res);
            this.editOneFlag = false;
            this.isOkLoading = false;
            this.isOkLoading2 = false;
            this.message.create('success', 'Successfully modified!');
          },
          err => {
            this.editOneFlag = false;
            this.isOkLoading = false;
            this.isOkLoading2 = false;
            this.message.create('error', 'fail to edit!');
          });
      }
    });
  }

  cancelEditOne() {
    this.isOkLoading = false;
    this.isOkLoading2 = false;
    this.editOneFlag = false;
  }

  // delete
  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData
      .filter(item => !item.disabled)
      .every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate = this.listOfDisplayData.filter(item => !item.disabled).some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
    this.numberOfChecked = this.allData.filter(item => this.mapOfCheckedId[item.id]).length;
  }

  checkAll(checked: boolean): void {
    this.listOfDisplayData.filter(item => !item.disabled).forEach(item => this.mapOfCheckedId[item.id] = checked);
    this.refreshStatus();
  }

  async delModel() {
    this.isDelLoading = true;
    this.isOperating = true;
    this.modalService.confirm({
      nzTitle: '<i>Delete Alert</i>',
      nzContent: '<b>Are you sure to delete?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnOk: async () => {
        const displayData = [];
        for (const key in this.mapOfCheckedId) {
          if (this.mapOfCheckedId.hasOwnProperty(key)) {
            if (this.mapOfCheckedId[key] === true) {
              await this.delPcSchedule(key).toPromise();
              displayData.push(key);
            }
          }
        }
        this.listOfDisplayData = this.listOfDisplayData.filter(item => displayData.indexOf(item.id) === -1);
        this.isOperating = false;
        this.isOkLoading2 = false;
        this.message.create('success', 'successfully deleted!');
        this.isDelLoading = false;
        this.mapOfCheckedId = {};
        this.refreshStatus();
      }

    });
  }

  cancelDelOne() {
    this.isOkLoading2 = false;
    this.isDelLoading = false;
    this.editOneFlag = false;
  }

  // before query Download blank template
  downDemo() {
    this.mapOfCheckedId = {};
    this.refreshStatus();
    const downloadDemoData = [];
    let templateData = {};
    templateData = {
      date: '2020/2/21',
      process: 'PCBA',
      line: 'FA2',
      plant: 'F131',
      model: 'ULTRON',
      planQty: '100',
    };
    downloadDemoData.push(templateData);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(downloadDemoData);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'Pc-Scedule' + '.xlsx');
  }

  // read uploadData
  handleUploadFile(uploadFile) {
    this.numberOfChecked = 0;
    this.allData = [];
    this.uploadSameData = [];
    this.uploadSameDataArr = [];
    this.uploadCreatdData = [];
    this.uploadData = [];
    this.uploadCancelData = [];
    this.saveSameData = [];
    this.isUpoad = false;
    this.isDisplayTable = false;
    this.previewFlag = false;
    this.uploadLoding = this.message.loading(this.trans['dataVerification'], { nzDuration: 0 }).messageId;
    this.uploading = false;
    this.filetoUpload = uploadFile.files.item(0);
    this.fileData = document.getElementById('upload');
    if (this.filetoUpload) {
      const suffixName = this.filetoUpload.name.split('.').pop();
      const format = new Array('xlsx', 'xls', 'csv');
      if (format.includes(suffixName) === false) {
        this.messageService.create('error', 'Only accept Excel type!');
        this.message.remove(this.uploadLoding);
        this.uploadFileName = '';
        this.fileData['value'] = '';
        return;
      }
      this.uploadFileName = this.filetoUpload.name.slice(0, 15);
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(this.filetoUpload);
    reader.onload = async (e: any) => {
      // read workbook
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr,
        {
          type: 'binary',
          cellDates: true,  // 把时间格式数据格式化成能看懂的
        });
      // grab first sheet
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      // sheet to json
      const header = XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.excelTitle = header[0];
      this.uploadData = XLSX.utils.sheet_to_json(ws, { raw: true });
      // check fileName and sheet
      const template = ['date', 'process', 'line', 'plant', 'model', 'planQty'];
      for (let i = 0; i < this.excelTitle.length; i++) {
        if (this.excelTitle[i] !== template[i]) {
          this.message.create('error', this.trans['notMatchTempelate'] + this.trans['prompt'] + `${this.excelTitle[i]}:${template[i]}`);
          this.message.remove(this.uploadLoding);
          this.uploadFileName = '';
          this.fileData['value'] = '';
          return;
        }
        this.uploadFileName = this.filetoUpload.name.slice(0, 15);
      }
      if (this.uploadData.length === 0) {
        this.message.create('error', this.trans['noDataUpload']);
        this.message.remove(this.uploadLoding);
        this.uploadFileName = '';
        this.fileData['value'] = '';
        return;
      } else {
        const arrLines = [];
        const arrModels = [];
        for (let j = 0; j < this.uploadData.length; j++) {
          this.uploadData[j]['plant'] = this.uploadData[j]['plant'].replace(/\s*/g, '');
          this.uploadData[j]['process'] = this.uploadData[j]['process'].replace(/\s*/g, '');
          this.uploadData[j]['line'] = this.uploadData[j]['line'].replace(/\s*/g, '');
          this.uploadData[j]['planQty'] = Math.floor(this.uploadData[j]['planQty']);
          if (j === 0) {
            // setUrl by plant
            this.dpmService.setBaseUrl(this.uploadData[j]['plant']);
            // get a  list of  lines
            this.exlines = [];
            this.exmodels = [];
            await this.lineService.find({
              where: {
                plant: this.uploadData[j]['plant'],
                mfgtype: this.uploadData[j]['process'] === 'PCBA' ? 'PCB' : this.uploadData[j]['process']
              }
            }).toPromise().then(
              res => {
                this.exlines = res;
              }
            ).catch(
              (err) => {
                if (err === 'Server error') {
                  this.messageService.create('error', 'Server error');
                } else { throw err.message; }
              });
            /* get a list of models */
            const modelListFilter = {
              where: {
                plant: this.uploadData[j]['plant'],
                mfgType: this.uploadData[j]['process']
              },
              group: ['model']
            };
            await this.fpyrService.find(modelListFilter).toPromise().then(
              data => {
                this.exmodels = data.map(x => x['model']).slice();
              }
            ).catch(
              (error) => {
                if (error === 'Server error') {
                  this.messageService.create('error', 'Server error');
                } else { throw error.message; }
              },
            );
          }

          // date format
          if (this.uploadData[j]['date']) {
            const date = moment(this.uploadData[j]['date']).format('YYYY-MM-DD');
            const dateFormat = /^(\d{4})-(\d{2})-(\d{2})$/;
            if (dateFormat.test(date)) {
              // true，是yyyy-MM-dd格式
              this.uploadData[j]['date'] = moment(this.uploadData[j]['date'].toString()).format('YYYY-MM-DD');
            } else {
              // false,不是yyyy-MM-dd格式
              this.message.create('error', 'The date format is wrong,Prompt： ‘1999/01/01');
              this.message.remove(this.uploadLoding);
              this.uploadFileName = '';
              this.fileData['value'] = '';
              return;
            }

          } else {
            this.message.create('error', 'Date empty' + this.trans['modifyBeforeUploading']);
            this.message.remove(this.uploadLoding);
            this.uploadFileName = '';
            this.fileData['value'] = '';
            return;
          }
          // process format
          if (!this.uploadData[j]['process']) {
            this.message.create('error', 'Process empty' + this.trans['modifyBeforeUploading']);
            this.message.remove(this.uploadLoding);
            this.uploadFileName = '';
            this.fileData['value'] = '';
            return;
          }
          // model format
          if (!this.uploadData[j]['model']) {
            this.message.create('error', 'Model empty' + this.trans['modifyBeforeUploading']);
            this.message.remove(this.uploadLoding);
            this.uploadFileName = '';
            this.fileData['value'] = '';
            return;
          }
          // line format
          if (!this.uploadData[j]['line']) {
            this.message.create('error', 'Line empty' + this.trans['modifyBeforeUploading']);
            this.message.remove(this.uploadLoding);
            this.uploadFileName = '';
            this.fileData['value'] = '';
            return;
          }
          // planQty format
          if (!this.uploadData[j]['planQty']) {
            this.message.create('error', 'Plan_Qty empty' + this.trans['modifyBeforeUploading']);
            this.message.remove(this.uploadLoding);
            this.uploadFileName = '';
            this.fileData['value'] = '';
            return;
          } else if (this.uploadData[j]['planQty'] > 10000000 || this.uploadData[j]['planQty'] < 1) {
            this.message.create('error', 'Plan_Qty wrong, prompt:1~10000 number');
            this.message.remove(this.uploadLoding);
            this.uploadFileName = '';
            this.fileData['value'] = '';
            return;
          }
          // check the model and line by plant
          const isLine = this.exlines.find(item => item['line'] === this.uploadData[j]['line']);
          if (!isLine) {
            arrLines.push(this.uploadData[j]['line']);
          }
          const isModel = this.exmodels.find(item => item === this.uploadData[j]['model']);
          if (!isModel) {
            arrModels.push(this.uploadData[j]['model']);
          }
          if (j === this.uploadData.length - 1) {
            if (arrLines.length > 0) {
              let lineMessage = '';
              arrModels.forEach(itea => lineMessage = lineMessage + `${itea} <br>`);
              this.message.create('error', arrLines + ' Line wrong' + this.trans['modifyBeforeUploading'], {
                nzDuration: 10000
              });
              this.message.remove(this.uploadLoding);
              this.uploadFileName = '';
              this.fileData['value'] = '';
              return;
            }
            if (arrModels.length > 0) {
              let modelMessage = '';
              arrModels.forEach(item => modelMessage = modelMessage + `${item} <br>`);
              this.message.create('error', modelMessage + ' Model wrong' + this.trans['modifyBeforeUploading'], {
                nzDuration: 10000
              });
              this.message.remove(this.uploadLoding);
              this.uploadFileName = '';
              this.fileData['value'] = '';
              return;
            }
          }
        }

      }

      // check repeat row
      const excelData = [];
      let data3 = [];
      for (let index = 0; index < this.uploadData.length; index++) {
        // Same day,Same line, only one model
        data3 = this.uploadData.filter(
          item => item['date'] === this.uploadData[index]['date']
            && item['line'] === this.uploadData[index]['line']
            && item['model'] === this.uploadData[index]['model']);
        if (data3.length > 1) {
          if (!excelData.includes(this.uploadData[index]['date'] +
            '、' + this.uploadData[index]['line'] +
            '、' + this.uploadData[index]['model']
          )) {
            excelData.push(
              this.uploadData[index]['date'] + '、' +
              this.uploadData[index]['line'] + '、' +
              this.uploadData[index]['model']);
          }
        }
      }
      if (excelData.length > 0) {
        let content = '';
        for (const exceldata of excelData) {
          content = content + `<br> <i>${exceldata}</i> <br>`;
        }
        this.modalService.confirm({
          nzTitle: '<i> Alert</i>',
          nzContent: this.trans['sameLineRepeated'] + content + + this.trans['modifyBeforeUploading'],
          nzOkText: 'Ok',
          nzCancelText: null,
          nzOnOk: async () => {
            this.message.remove(this.uploadLoding);
            this.fileData['value'] = '';
            this.uploadFileName = '';
            return;
          }
        });
      }
      this.message.remove(this.uploadLoding);
      this.isUpoad = true;
    };
  }
  // 上傳資料
  async upload() {
    this.uploading = true;
    this.listOfDisplayData = [];
    for (let j = 0; j < this.uploadData.length; j++) {
      await this.searchPcSchedule(this.uploadData[j]['plant'], this.uploadData[j]['process'], this.uploadData[j]['date'], this.uploadData[j]['line'], this.uploadData[j]['model']).toPromise().then(async (res: PcSchedule[]) => {
        if (res.length > 0) {
          this.uploadData[j]['id'] = res[0]['id'];
        } else {
          this.uploadData[j]['id'] = this.guid();
          this.uploadData[j]['uploadBy'] = localStorage.getItem('$DFI$userID');
        }
      });
      await this.updatePcSchedule(this.uploadData[j]).toPromise();
      this.listOfDisplayData.push(this.uploadData[j]);
      if (j === this.uploadData.length - 1) {
        if (this.validateForm.valid) {
          this.query();
        }
        this.message.create('success', 'Upload successfully!');
        this.isDisplayTable = true;
        this.uploadLoding = false;
        this.uploading = false;
        this.fileData['value'] = '';
        this.uploadFileName = '';
        this.isUpoad = false;
      }
    }

  }
  // download table
  download() {
    this.downLoading = true;
    const downloadDta = [];
    let data = {};
    if (this.listOfDisplayData.length === 0) {
      this.message.create('error', 'No data to download!');
      this.downLoading = false;
      return;
    } else {
      for (let i = 0; i < this.listOfDisplayData.length; i++) {
        data = {
          date: moment(this.listOfDisplayData[i]['date']).format('YYYY-MM-DD'),
          process: this.listOfDisplayData[i]['process'],
          line: this.listOfDisplayData[i]['line'],
          plant: this.listOfDisplayData[i]['plant'],
          model: this.listOfDisplayData[i]['model'],
          planQty: Math.floor(this.listOfDisplayData[i]['planQty'])
        };
        downloadDta.push(data);
      }
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(downloadDta);
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      /* save to file */
      XLSX.writeFile(wb, 'Pc-Scedule' + '.xlsx');
      this.downLoading = false;
    }
  }


  onChange(result: Date[]): void {
    if (!result || result.length === 0) {
      return;
    } else {
      this.selectedStartDate = moment(new Date(result[0])).format('YYYY-MM-DD');
      this.selectedEndDate = moment(new Date(result[1])).format('YYYY-MM-DD');
    }

  }

  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }


  filter1(listOfSearchLines: string[]): void {
    this.listOfSearchLines = listOfSearchLines;
    this.search();
  }
  filter2(listOfSearchModels: string[]): void {
    this.listOfSearchModels = listOfSearchModels;
    this.search();
  }


  search(): void {
    /** filter data **/
    let data = [];
    data = this.allData
      .filter(item => this.listOfSearchLines && this.listOfSearchLines.length > 0 ? this.listOfSearchLines.includes(item['line']) : true)
      .filter(item => this.listOfSearchModels && this.listOfSearchModels.length > 0 ? this.listOfSearchModels.includes(item['model']) : true);
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
            ? 1
            : -1
          : b[this.sortName!] > a[this.sortName!]
            ? 1
            : -1
      );
    } else {
      this.listOfDisplayData = data;
    }
  }


  // call Api
  getPcSchedule(plant, process, startDate, endDate, line?, model?) {
    return this.pcScheduleService.find({
      where: {
        plant: plant,
        process: process,
        date: { between: [startDate, endDate] },
        line: line,
        model: model,
      }
    });
  }

  searchPcSchedule(plant, process, date, line?, model?, planQty?) {
    return this.pcScheduleService.find({
      where: {
        plant: plant,
        process: process,
        date: date,
        line: line,
        model: model,
        planQty: planQty
      }
    });
  }

  searchPcScheduleArr(plantArr, processArr, dateArr, lineArr?, modelArr?) {
    return this.pcScheduleService.find({
      where: {
        plant: { inq: plantArr },
        process: { inq: processArr },
        date: { inq: dateArr },
        line: { inq: lineArr },
        model: { inq: modelArr }
      }
    });
  }



  addPcSchedule(data) {
    return this.pcScheduleService.create(data);
  }

  updatePcSchedule(data) {
    return this.pcScheduleService.upsert(data);
  }

  delPcSchedule(id) {
    return this.pcScheduleService.deleteById(id);
  }

  guid() {
    let d = Date.now();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.timer);
  }

}





