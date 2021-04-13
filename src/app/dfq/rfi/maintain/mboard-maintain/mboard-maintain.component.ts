import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { error } from 'util';
import { Utils } from 'app/dfq/utils';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
// service
import { Workflow, WorkflowSign, WorkflowApi, WorkflowSignApi, Mail, Site, SiteApi, PlantApi, Plant, WorkflowFormMapping, WorkflowFormMappingApi, WorkflowForm, WorkflowFormApi, MailApi } from '@service/dfi-sdk';
import { MemberApi, Member } from '@service/dfc_sdk/sdk';
import { Part, PartApi, View_PartApi, View_Part } from '@service/dfq_sdk/sdk';
import { MboardService } from './mboard.service';
import { MeetingReviewTestService } from 'app/dfq/exit-meeting/meeting-review-test/meeting-review-test.service';

@Component({
  selector: 'app-mboard-maintain',
  templateUrl: './mboard-maintain.component.html',
  styleUrls: ['./mboard-maintain.component.scss']
})
export class MboardMaintainComponent implements OnInit, OnChanges {
  queryed: boolean;
  filetoUpload: File;
  userId: string;
  workflowFormMappingId;
  showSignatureModal = false;
  isVisible = false;
  isLoading = false;
  // query form
  validatorForm2: FormGroup;
  sites: Site[];
  plants: Plant[];
  products = [];
  isPagination = true;
  selectedSite: string;
  selectedPlant: string;
  selectedProduct: string;
  // edit modal
  validatorForm: FormGroup;
  addModalShow = false;
  part = new Part();
  defectNumber: number;
  total: number;
  // data table
  selectedStatus;
  status = [
    { text: '未送簽', value: null },
    { text: '簽核中', value: '0' },
    { text: '簽核通過', value: '1' },
    { text: '簽核未通過', value: '2' }];
  searchStatus = [null, '0', '1', '2'];
  partIds: {}[] = [];
  searchPartIds: string[];
  listOfAllData = [];
  listOfDisplayData = [];
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mapOfCheckedId: { [key: string]: boolean } = {};
  numberOfChecked = 0;
  sortName: string | null = null;
  sortValue: string | null = null;
  // upload
  uploadFileName;
  uploadFileFlag: boolean;
  excelData = [];
  fileData: any;
  signingPartIds: string[];
  uploadLoading: boolean;

  constructor(
    private fb: FormBuilder,
    private mboardService: MboardService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private route: ActivatedRoute,
    private meetingReviewTestService: MeetingReviewTestService,
    private workflowService: WorkflowApi,
    private workflowSignService: WorkflowSignApi,
    private partService: PartApi,
    private viewPartService: View_PartApi,
    private userService: MemberApi,
    private siteService: SiteApi,
    private plantService: PlantApi,
    private workflowFormMappingService: WorkflowFormMappingApi,
    private workflowFormService: WorkflowFormApi,
    private mailService: MailApi
  ) {
    this.userId = localStorage.getItem('$DFI$userID');
  }

  ngOnInit() {
    this.validatorForm = this.fb.group({
      plantId: [null, Validators.required],
      productId: [null, Validators.required],
      partId: [null, [Validators.required]],
      defectNumber: [0, [Validators.required]],
      total: [1, [Validators.required]]
    });

    this.validatorForm2 = this.fb.group({
      siteId: [null, Validators.required],
      plantId: [null, Validators.required],
      productId: [null, Validators.required]
    });

    // query parameters
    this.route.queryParams.subscribe(params => {
      if (params['site']) {
        this.selectedSite = params['site'];
      }

      if (params['plant']) {
        this.selectedPlant = params['plant'];
      }

      if (params['product']) {
        this.selectedProduct = params['product'];
      }

      if (params['status']) {
        this.searchStatus = this.status.filter(status => status.value === params['status']).map(status => status.value);
      }

      if (this.selectedSite && this.selectedPlant && this.selectedProduct) {
        this.query();
      }
    });

    this.getSites();
    this.getPlants();
    this.getProducts();
  }

  ngOnChanges() { }

  query() {
    this.isLoading = true;
    this.queryed = true;
    this.partIds = [];
    for (const i in this.validatorForm2.controls) {
      if (this.validatorForm2.controls.hasOwnProperty(i)) {
        this.validatorForm2.controls[i].markAsDirty();
        this.validatorForm2.controls[i].updateValueAndValidity();
      }
    }

    this.viewPartService.find({
      where: {
        productId: this.selectedProduct,
        plantId: this.selectedPlant,
      },
      order: 'defectNum DESC'
    }).subscribe(async (parts: View_Part[]) => {
      this.listOfAllData = parts;
      for (let index = 0; index < parts.length; index++) {
        const part = parts[index];
        this.partIds = [...this.partIds, { text: part.partId, value: part.partId }];
        // load workflow
        // if (part.workflowId !== null) {
        //   await this.workflowService.findById(part.workflowId, { include: 'workflowSigns' }).toPromise().then((workflow: Workflow) => {
        //     part['workflow'] = workflow;
        //     part['workflowSign'] = workflow['workflowSigns'][0];
        //     part['status'] = workflow.status;
        //   });
        // } else {
        //   part['workflow'] = new Workflow();
        // }
      }
      this.search();
      this.refreshStatus();
      this.isLoading = false;
    });
  }



  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.filter(item => !item.disabled).every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate = this.listOfDisplayData.filter(item => !item.disabled).some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
    this.numberOfChecked = this.listOfAllData.filter(item => this.mapOfCheckedId[item.id]).length;
  }

  // currentPageDataChange($event: Part[]): void {
  //   this.listOfDisplayData = $event;
  //   this.refreshStatus();
  // }

  checkAll(checked: boolean): void {
    this.listOfDisplayData.filter(item => !item.disabled).forEach(item => this.mapOfCheckedId[item.id] = checked);
    this.refreshStatus();
  }

  search(): void {
    this.listOfDisplayData = this.listOfAllData
    .filter((part: View_Part) => this.searchStatus && this.searchStatus.length > 0 ? this.searchStatus.includes(part.status) : true)
    .filter((part: View_Part) => this.searchPartIds && this.searchPartIds.length > 0 ? this.searchPartIds.includes(part.partId) : true);
  }

  sort(sort: { key: string, value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }

  filter(searchStatus: string[], searchPartIds: string[]): void {
    // uncheck all
    this.listOfDisplayData.forEach((part: Part) => {
      if (this.mapOfCheckedId[part.id]) {
        this.mapOfCheckedId[part.id] = false;
        this.numberOfChecked = 0;
      }
    });
    this.searchStatus = searchStatus;
    this.searchPartIds = searchPartIds;
    this.search();
  }

  getSites() {
    this.siteService.find({}).subscribe((sites: Site[]) => this.sites = sites);
  }

  getSite(plantId: string) {
    if (plantId) {
      const index = this.plants.findIndex((plant: Plant) => plant.id === plantId);
      if (index === -1) {
        this.selectedSite = undefined; // clear the selected site when the site of the plant was not found
      } else {
        this.selectedSite = this.plants[index].siteId; // assign the selected site when the site of the plant was found
      }
    }
  }

  getPlants(siteId?: string) {
    if (siteId === null) {
      // get all plants when the selected site is emptied
      siteId = undefined;
    }

    // if (this.selectedPlant && !siteId) {
    //   // clear the selected plant when reselect the site
    //   this.selectedPlant = undefined;
    //   this.isParamsQuery = false;
    // }


    this.plantService.find({ where: { siteId: siteId } }).subscribe((plants: Plant[]) => {
      if (plants.length === 1) {
        // auto select the plant when there is only one plant
        this.selectedPlant = plants[0].id;
      } else if (plants.length === 0) {
        // clear the selected plant when plants not found
        this.selectedPlant = undefined;
      } else if (!this.selectedPlant && plants.length > 1) {
        // clear the selected plant when multiple plants are found
        this.selectedPlant = undefined;
      } else { }
      this.plants = plants;
    });
  }

  getProducts() {
    this.mboardService.getProduct().subscribe(res => {
      this.products = res;
    });
  }

  editMBsignOk() {
    this.showSignatureModal = true;
  }

  editsignCancel() {
    this.showSignatureModal = false;
  }

  cancalSignature() {
    this.showSignatureModal = false;
  }

  refreshPart(part: View_Part) {
    const index = this.listOfDisplayData.findIndex(element => element.id === part.id);
    if (index !== -1) {
      this.listOfDisplayData.splice(index, 1, part);
      this.listOfDisplayData = [...this.listOfDisplayData];
    } else {
      this.message.create('error', 'refresh part fail!');
      throw new Error('refresh part fail!');
    }
  }

  // update workflow sign
  async createWorkflow() {
    this.isLoading = true;
    // find workflow form
    let workflowFormId: number;
    await this.workflowFormService.findOne({ where: { name: 'DFQ0005' } }).toPromise().then((form: WorkflowForm) => {
      if (!form) {
        this.message.create('error', 'Approval form information is not maintained!');
        throw new Error('Approval form information is not maintained!');
      } else {
        workflowFormId = form.id;
      }
    });

    // find workflow form mapping
    const key = this.selectedSite + '-' + this.selectedPlant + '-' + this.selectedProduct;
    await this.workflowFormMappingService.findOne({ where: { workflowFormId: workflowFormId, key: key } }).toPromise()
    .then((formMapping: WorkflowFormMapping) => {
      this.workflowFormMappingId = formMapping.id;
    })
    .catch(async err => {
      if (err.status === 404) {
        await this.workflowFormMappingService.create({
          workflowFormId: workflowFormId,
          key: key,
          model: 'DFQ'
        }).toPromise().then((formMapping: WorkflowFormMapping) => this.workflowFormMappingId = formMapping.id);
      } else {
        throw err;
      }
    });

    // find supervisor name
    let supervisorName: string;
    await this.userService.findOne({ where: { EmpID: this.userId } }).toPromise()
    .then((member: Member) => supervisorName = member.Supervisor)
    .catch(err => {
      if (err.statusCode === 404) {
        const errMsg = 'your dfi basedata not found!';
        this.message.create('error', errMsg);
        throw new Error(errMsg);
      } else {
        this.message.create('error', err);
        throw err;
      }
    });
    let supervisor: Member;
    await this.userService.findOne({ where: { EmpID: supervisorName } }).toPromise()
    .then((user: Member) => supervisor = user)
    .catch(err => {
      if (err.statusCode === 404) {
        const errMsg = 'your supervisor ' + supervisorName + '\'s employee ID not found!';
        this.message.create('error', errMsg);
        throw new Error(errMsg);
      } else {
        this.message.create('error', err);
        throw err;
      }
    });

    this.listOfDisplayData.filter((part) => this.mapOfCheckedId[part.id]).forEach((part: View_Part, index, array) => {
      // create a workflow
      this.workflowService.create({
        desc: 'RFI' + '-' + this.selectedPlant + '-' + this.selectedProduct + '-MB不良率',
        routingParameter: `?site=${this.selectedSite}&plant=${this.selectedPlant}&product=${this.selectedProduct}&status=0`,
        status: '0',
        workflowFormMappingId: this.workflowFormMappingId
      }).subscribe((workflow: Workflow) => {
        part.workflowId = workflow.id;
        part.status = '0';
        // this.refreshPart(part);
        // create workflow signature
        this.workflowSignService.create({ workflowId: workflow.id, userId: supervisor.EmpID, isAgree: null, comment: null }).subscribe((workflowSign: WorkflowSign) => {
          // update current stage of the workflow
          workflow.current = workflowSign.id;
          this.workflowService.patchAttributes(workflow.id, workflow).subscribe((workflow: Workflow) => {
            // part['workflow'] = workflow;
            // part['status'] = workflow.status;
            // update workflowId of the part
          });
        });
        // update workflowId of the part
        this.partService.patchAttributes(part.id, part).subscribe((part: Part) => {
          // part['workflow'] = workflow;
          // part['workflowSign'] = workflowSign;
        });
      });

      // send email
      if (index === array.length - 1) {
        const url = `${location.origin}/dashboard/rfi/maintain/mboard-maintain?product=${this.selectedProduct}&site=${this.selectedSite}&plant=${this.selectedPlant}&status=0`;
        this.mailService.create({
          subject: '【DFQ系統提醒】DFQ MB Base Data簽核',
          content: `Dear Sir:<br>廠別${this.selectedSite}-${this.selectedPlant}產品別${this.selectedProduct}的MB Base Data已更新，請登錄DFQ系統簽核，以滿足機種良率預測需要. <br>DFQ URL:<a href="'${url}'">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator`,
          sender: 'dfi@wistron.com',
          receiver: supervisor.EmpID
        }).subscribe(() => {
          this.listOfDisplayData.filter(item => !item.disabled).forEach(item => this.mapOfCheckedId[item.id] = false);
          this.refreshStatus();
          this.message.create('info', 'Signed');
        }, err => this.message.create('error', err));

        this.isLoading = false;
      }
    });
  }

  save(part: Part) {
    this.isLoading = true;
    // update workflow
    part.defectNum = this.defectNumber;
    part.total = this.total;
    part.workflowId = null;
    part['workflow'] = new Workflow();
    this.partService.patchAttributes(part.id, part).subscribe(result => {
      this.isVisible = false;
      this.isLoading = false;
      this.message.create('info', '已修改請重新送簽 Modified please re-sign');
    });

    this.refreshStatus();
  }

  cancelSave(part: Part) {
    this.defectNumber = part.defectNum;
    this.total = part.total;
    this.isVisible = false;
  }

  canSend(): boolean {
    return this.listOfDisplayData.filter((part: Part) => this.mapOfCheckedId[part.id] === true).every(part => {
      if (part.workflowId) {
        if (part.workflow && part.workflow.status === null) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });
  }

  send() {
    try {
      this.modalService.confirm({
        nzTitle: '<i>Send Alert</i>',
        nzContent: '<b>Do you Want to Send?</b>',
        nzOkText: 'Ok',
        nzCancelText: 'Cancel',
        nzOnCancel: () => { },
        nzOnOk: () => this.createWorkflow()
      });
    } catch (e) {
      this.message.create('error', e);
      this.isLoading = false;
    }

  }

  noticeSignature(site, plant, product, receiver) {
    const url = `${location.origin}/dashboard/rfi/maintain/mboard-maintain?product=${this.selectedProduct}&site=${this.selectedSite}&plant=${this.selectedPlant}&status=2`;
    return this.meetingReviewTestService.createMail({
      subject: '【DFQ系統提醒】DFQ MB Base Data簽核未通過通知',
      content: 'Dear Sir:<br>廠別' + site + '-' + plant + '產品' + product + '的MB Base Data, 簽核未通過' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
      sender: 'dfi@wistron.com',
      receiver: receiver
    });
  }

  completeSignature(site, plant, product, receiver) {
    const url = `${location.origin}/dashboard/rfi/maintain/mboard-maintain?product=${this.selectedProduct}&site=${this.selectedSite}&plant=${this.selectedPlant}&status=1`;
    return this.meetingReviewTestService.createMail({
      subject: '【DFQ系統提醒】DFQ MB Base Data簽核完成',
      content: 'Dear Sir:<br>廠別' + site + '-' + plant + '產品' + product + '的MB Base Data已更新並完成簽核，此後DFQ新機種將以新版本標準作業' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
      sender: 'dfi@wistron.com',
      receiver: receiver
    });
  }

  showSigningPartId() {
    let content = '';
    for (let i = 0; i < this.signingPartIds.length; i++) {
      content += this.signingPartIds[i] + '<br/>';
    }
    this.modalService.error({
      nzTitle: '簽核中料號無法修改 Part number cannot be modified during sign approval',
      nzContent: content
    });
  }

  changeUploadFile(uploadFile) {
    this.filetoUpload = uploadFile.files.item(0);
    this.fileData = document.getElementById('upload');
    if (this.filetoUpload) {
      let fileName = this.filetoUpload.name;
      const format = new Array('.xlsx', '.xls', '.csv');
      fileName = fileName.substring(fileName.lastIndexOf('.'));
      if (format.indexOf(fileName) < 0) {
        this.message.create('error', '仅接受Excel类型!');
        this.uploadFileName = '';
        return;
      }
      this.uploadFileName = this.filetoUpload.name;
      this.uploadFileFlag = true;
    }
  }

  async upload() {
    this.uploadLoading = true;
    if (!this.filetoUpload || this.uploadFileFlag === false) {
      this.message.create('error', 'Please select file');
    } else {
      this.isLoading = true;
      this.signingPartIds = [];
      let count = 0;
      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(this.filetoUpload);
      reader.onload = async (e: any) => {
        // read workbook
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        // grab first sheet
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        // save data
        this.excelData = XLSX.utils.sheet_to_json(ws);
        this.searchPartIds = [];
        // check duplicated data
        for (let index = 0; index < this.excelData.length; index++) {
          const part: Part = new Part();
          part.plantId = this.excelData[index]['廠別'];
          part.productId = this.excelData[index]['產品別'];
          part.partId = this.excelData[index]['料號'];
          part.defectNum = this.excelData[index]['不良數'];
          part.total = this.excelData[index]['製造數'];
          this.searchPartIds.push(part.partId);
          // check
          await this.partService.findOne({
            where: {
              plantId: this.excelData[index]['廠別'],
              productId: this.excelData[index]['產品別'],
              partId: this.excelData[index]['料號']
            }
          }).toPromise()
            .then(async (result: Part) => {
              result.defectNum = part.defectNum;
              // check workflow status if it exists
              if (result.workflowId) {
                await this.workflowService.findById(result.workflowId).toPromise().then(async (workflow: Workflow) => {
                  if (workflow.status === '0') { // signing
                    this.signingPartIds.push(result.partId);
                  } else { // rejected or approved
                    // reset workflowId
                    result.workflowId = null;
                    await this.partService.updateAttributes(result.id, result).toPromise().then((result: Part) => {
                      // delete
                      this.listOfDisplayData = this.listOfDisplayData.filter((element: Part) => result.id !== element.id);
                      // add
                      this.listOfDisplayData = [...this.listOfDisplayData, result];
                      count++;
                    });
                  }
                });
              } else {
                await this.partService.updateAttributes(result.id, result).toPromise().then((result: Part) => {
                  // delete
                  this.listOfDisplayData = this.listOfDisplayData.filter((element: Part) => result.id !== element.id);
                  // add
                  this.listOfDisplayData = [...this.listOfDisplayData, result];
                  count++;
                });
              }
            })
            .catch(async (err) => {
              if (err.statusCode === 404) {
                await this.partService.create(part).subscribe((part: Part) => {
                  this.listOfDisplayData = [...this.listOfDisplayData, part];
                  count++;
                });
              } else {
                this.message.create('error', err);
                throw err;
              }
            });
        }
        // check whether they were not duplicated
        if (this.signingPartIds.length > 0) {
          this.fileData['value'] = '';
          this.uploadFileName = '';
          this.isLoading = false;
          this.showSigningPartId();
        }

        this.uploadFileFlag = false;
        this.fileData['value'] = '';
        this.uploadFileName = '';
        this.isLoading = false;
        this.uploadLoading = false;
        this.message.create('info', count + 'Successfully uploaded');
      };

    }
  }

  download() {
    this.partService.find({
      where: {
        productId: this.selectedProduct,
        plantId: this.selectedPlant,
        partId: this.searchPartIds
      },
      order: 'defectNum DESC'
    }).subscribe({
      next: (data: Part[]) => {
        const downloadFile = [];
        if (data.length !== 0) {
          for (const part of data) {
            downloadFile.push({
              '廠別': part.plantId,
              '產品別': part.productId,
              '料號': part.partId,
              '不良數': part.defectNum,
              '製造數': part.total
            });
          }
        } else {
          downloadFile.push({
            '廠別': this.selectedPlant,
            '產品別': this.selectedProduct,
            '料號': '',
            '不良數': '',
            '製造數': ''
          });
        }
        // convert to xlsx
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(downloadFile);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'MB物料良率.xlsx');
      },
      error: err => this.message.create('error', err)
    });
  }

  canSign(): boolean {
    return this.listOfDisplayData.filter((part: View_Part) => this.mapOfCheckedId[part.id]).every((part: View_Part) => {
      if (part.status === '0' && part.workflowId /*&& part['workflowSign']['userId'] === this.userId*/) {
        return true;
      } else {
        return false;
      }
    });
  }

  async sign(agree, comments: string) {
    this.isLoading = true;
    let senderEmail: string;
    // group by workflow creator
    const sorted = _.groupBy(this.listOfAllData.filter((part: View_Part) => this.mapOfCheckedId[part.id]), (part: View_Part) => part.workflowCreatedBy);
    for (const sender in sorted) {
      if (sorted.hasOwnProperty(sender)) {
        // find sender email
        await this.userService.findById(sender).toPromise()
        .then((user: Member) => senderEmail = user.Email)
        .catch(err => {
          this.isLoading = false;
          if (err.statusCode === 404) {
            const errMsg = 'sender email not found!';
            this.message.create('error', errMsg);
            throw new Error(errMsg);
          } else {
            this.message.create('error', err);
            throw err;
          }
        });

        sorted[sender].filter(item => this.mapOfCheckedId[item.id]).forEach((part: View_Part) => {
          // update workflow sign
          this.workflowSignService.findOne({where: {workflowId: part.workflowId}})
          .subscribe((workflowSign: WorkflowSign) => {
            workflowSign.isAgree = agree;
            workflowSign.comment = comments;
            this.workflowSignService.patchAttributes(workflowSign.id, workflowSign).subscribe();
          });
          // update workflow status
          this.workflowService.patchAttributes(part.workflowId, { status: agree ? '1' : '2'}).subscribe((workflow: Workflow) => {
            // part['workflow'] = workflow;
            part.status = workflow.status;
            // find index of the part
            const index = this.listOfAllData.findIndex((element: View_Part) => element.id === part.id);
            // remove
            this.listOfAllData = this.listOfAllData.filter((element: View_Part) => element.id !== part.id);
            // refresh
            this.listOfAllData = [...this.listOfAllData.slice(0, index), part, ...this.listOfAllData.slice(index)];
            this.mapOfCheckedId[part.id] = false;
            this.refreshStatus();
            this.search();
          });
        });

        // find signer email
        let signerEmail: string;
        await this.userService.findById(this.userId).toPromise()
        .then((user: Member) => signerEmail = user.Email)
        .catch(err => {
          this.isLoading = false;
          if (err.statusCode === 404) {
            const errMsg = 'sender email not found!';
            this.message.create('error', 'sender email not found!');
            throw new Error(errMsg);
          } else {
            this.message.create('error', err);
            throw err;
          }
        });

        // send email
        const receiver = senderEmail + ';' + signerEmail;
        if (agree) {
          await this.completeSignature(this.selectedSite, this.selectedPlant, this.selectedProduct, receiver).toPromise().then();
        } else {
          await this.noticeSignature(this.selectedSite, this.selectedPlant, this.selectedProduct, receiver).toPromise().then();
        }
      }
    }

    this.filter(this.searchStatus, this.searchPartIds);
    this.cancalSignature();
    this.message.create('info', agree ? 'approved' : 'rejected');
    this.isLoading = false;
  }
  // edit
  edit(part?: Part) {
    if (part) {
      this.part = part;
      this.mapOfCheckedId[part.id] = true;
    } else {
      this.part = new Part({
        plantId: this.selectedPlant,
        productId: this.selectedProduct
      });
    }

    this.addModalShow = true;
  }

  submitForm(part: Part): void {
    for (const i in this.validatorForm.controls) {
      if (this.validatorForm.controls.hasOwnProperty(i)) {
        this.validatorForm.controls[i].markAsDirty();
        this.validatorForm.controls[i].updateValueAndValidity();
      }
    }

    this.isLoading = true;
    // reset workflow
    delete part.workflowId;
    delete part['workflow'];
    delete part['status'];
    // upsert part
    this.partService.upsert(part).subscribe((result: Part) => {
      // insert
      if (!part.id) {
        this.listOfDisplayData = [result, ...this.listOfDisplayData];
        this.message.create('success', 'added successfully!');
      } else {
      // update
        part = result;
        // part.modifiedBy = result.modifiedBy;
        // part.modified = result.modified;
        this.message.create('success', 'update successfully!!');
      }
      this.refreshStatus();
      this.addModalShow = false;
      this.isLoading = false;
    },
      err => {
        this.addModalShow = false;
        this.isLoading = false;
        this.message.create('error', err);
        throw err;
      });
  }

  handleCancel(): void {
    this.addModalShow = false;
  }

  percentFormatter = (value: number) => value === undefined ? `${0} %` : `${this.strip(value * 100)} %`;

  percentParser = (value: string) => value.replace(' %', '');

  strip(num, precision = 12) {
    return +parseFloat(num.toPrecision(precision));
  }

}

