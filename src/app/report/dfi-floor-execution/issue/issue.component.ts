import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MrrMaterialSelectService } from 'app/mrr/material/mrr-material-select.service';
import { ActivatedRoute } from '@angular/router';
import { FloorExecutionIssueApi, MailApi } from '@service/dfi-sdk';
import { NzMessageService } from 'ng-zorro-antd';
import { MemberApi } from '@service/dfc_sdk/sdk';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss']
})
export class IssueComponent implements OnInit {

  editCache: { [key: string]: { edit: boolean; data: {} } } = {};
  validateForm: FormGroup;
  isLoading = false;
  plants = [];
  modules = [
    'All',
    'RFQ工時預測',
    'DFC工時追蹤',
    'NUDD風險評估',
    '產品標準文件管理',
    '廠商資料管理',
    '材料良率自動追蹤',
    'iMQM材料品質監控',
    'C4C5自動判定',
    'RFI良率預測',
    'Skyeye品質監控',
    'MP良率預警與追蹤'
  ];
  issueSet = [];
  issueSetCache = [];
  issueFlag = false;
  // 新增議題的參數
  saveData;
  // issue status
  statusList = [
    { Value: 0, Label: 'Open' },
    { Value: 1, Label: 'Ongoing' },
    { Value: 2, Label: 'Close' },
    { Value: 3, Label: 'Verify' }
  ];
  title;
  modalFlag = false;
  clickUpdateData;
  issueCategory = ['議題', '討論中', 'Bug', 'CR', '緊急處理', '待分類'];
  listOfCategorys = [];
  ListOfStatus = [
    { value: 0, text: 'Open' },
    { value: 1, text: 'Ongoing' },
    { value: 2, text: 'Close' },
    { value: 3, text: 'Verify' }
  ];
  priorityList = ['P1', 'P2', 'P3'];
  listOfSearchCategory = [];
  listOfSearchStatus = [];
  sortName;
  sortValue;
  listOfDate;
  isRolePMO = false;
  EXCEL_EXTENSION = '.xlsx';
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  constructor(
    private fb: FormBuilder,
    private selectService: MrrMaterialSelectService,
    private router: ActivatedRoute,
    private floorExecutionIssueService: FloorExecutionIssueApi,
    private messageService: NzMessageService,
    private memberService: MemberApi,
    private mailService: MailApi,
    private datePipe: DatePipe
  ) {
    // from title link  to check issue
    this.router.params.subscribe(params => {
      if (Object.keys(params).length) {
        this.validateForm.controls['selectModule'].setValue(params['systemName']);
        this.query();
      }
    });
  }

  ngOnInit() {
    const role = localStorage.getItem('$DFI$userRole').toUpperCase();
    this.isRolePMO = role.indexOf('PMO') !== -1;
    this.getPlants();
    this.issueCategory.map(item => {
      this.listOfCategorys = [...this.listOfCategorys, { text: item, value: item }];
    });
    // form init
    this.validateForm = this.fb.group({
      selectModule: ['All', [Validators.required]],
      selectPlant: [null]
    });
    this.query();
  }

  getPlants() {
    this.selectService.getPlant().subscribe(plants => {
      this.plants = plants;
      this.plants.unshift({ Value: 'All', Label: 'All' });
    });
  }

  query() {
    this.isLoading = true;
    this.issueSet = [];
    this.floorExecutionIssueService.find({
      where: {
        subsystemName: this.validateForm.value.selectModule && this.validateForm.value.selectModule !== 'All' ? this.validateForm.value.selectModule : undefined,
        plantId: this.validateForm.value.selectPlant ? this.validateForm.value.selectPlant : undefined
      },
      order: 'dueDate DESC'
    }).subscribe(res => {
      this.listOfDate = res;
      this.issueSet = res;
      this.issueSetCache = JSON.parse(JSON.stringify(this.issueSet));
      this.isLoading = false;
      if (!this.issueSet.length) {
        this.messageService.create('success', '查無資料');
      }
    }, error => {
      this.isLoading = false;
      this.messageService.create('error', '查詢失敗！');
    });
  }
  // can add or update issue detail
  showModal(data?) {
    if (!data) {
      this.title = '新增';
      this.modalFlag = false;
      this.saveData = {
        subsystemName: this.validateForm.value.selectModule && this.validateForm.value.selectModule !== 'All' ? this.validateForm.value.selectModule : '',
        plantId: this.validateForm.value.selectPlant ? this.validateForm.value.selectPlant : '',
        category: '議題',
        priority: null,
        description: null,
        rootCause: null,
        solution: null,
        pic: null,
        dueDate: null,
        actualCloseDay: null,
        status: 0
      };
    } else {
      this.clickUpdateData = data;
      this.title = '修改';
      this.modalFlag = true;
      this.saveData = {
        subsystemName: data.subsystemName,
        plantId: data.plantId,
        category: data.category,
        priority: data.priority,
        description: data.description,
        rootCause: data.rootCause,
        solution: data.solution,
        pic: data.pic,
        dueDate: data.dueDate,
        status: data.status
      };
    }
    this.issueFlag = true;
  }

  checkIssue(dataSet, flag) {
    let checkFlag = false;
    let checkItem;
    if (flag) {
      checkItem = {
        subsystemName: '模組名稱',
        plantId: '廠別',
        category: '議題分類',
        priority: '優先順序',
        description: '描述',
        pic: '負責人',
      };
    } else {
      checkItem = {
        subsystemName: '模組名稱',
        plantId: '廠別',
        category: '議題分類',
        description: '描述',
        pic: '負責人',
      };
    }
    for (const key in dataSet) {
      if (dataSet.hasOwnProperty(key)) {
        for (const itemKey in checkItem) {
          if (checkItem.hasOwnProperty(itemKey)) {
            if (dataSet[key]) {
              checkFlag = true;
            } else {
              if (key === itemKey) {
                this.messageService.create('error', checkItem[itemKey] + '未填寫！');
                return;
              }
            }
          }
        }
      }
    }
    return checkFlag;
  }

  patchOrCreateIssue() {
    const checkFlag = this.checkIssue(this.saveData, this.modalFlag);
    const issendMail = this.saveData.hasOwnProperty('mailTag') && this.saveData['mailTag'];
    if (checkFlag) {
      if (!this.modalFlag) {
        if (this.saveData.hasOwnProperty('mailTag')) {
          delete this.saveData['mailTag'];
        }
        this.floorExecutionIssueService.create(this.saveData).subscribe(res => {
          this.issueSet.push(res);
          this.issueSet = this.issueSet.slice();
          this.issueSetCache = JSON.parse(JSON.stringify(this.issueSet));
          this.messageService.create('success', '新增成功！');
          this.sendMailForPic(res);
          this.handleCancel();
        }, error => {
          this.messageService.create('error', '新增失敗！');
          this.handleCancel();
        });
      } else {
        if (this.saveData.status === 2) {
          this.saveData['actualCloseDay'] = new Date();
        }
        if (this.saveData.dueDate) {
          this.saveData.dueDate = new Date(this.saveData.dueDate);
        }
        this.floorExecutionIssueService.patchAttributes(this.clickUpdateData.id, this.saveData).subscribe(res => {
          Object.assign(this.clickUpdateData, res);
          this.messageService.create('success', '修改成功！');
          if (issendMail === 1) {
            this.sendMailForPic(res);
          }
          this.handleCancel();
        }, error => {
          this.messageService.create('error', '修改失敗！');
          this.handleCancel();
        });
      }
    }
  }

  handleCancel() {
    this.saveData = undefined;
    this.issueFlag = false;
  }

  async sendMailForPic(issue) {
    const receiver = await this.memberService.findById(issue.pic).toPromise();
    const content = `
    Dear ${receiver['EName']}:<br/><br/>
    DFi落地執行議題如下，請回復<br/>
    <table border="1" style="border-collapse:collapse;">
    <tr>
      <th colspan="5"bgcolor="#696969" style="text-align:center;color: white">DFI會議事項</th>
    </tr>
    <tr>
      <th>編號</th><th>事項</th><th>期限</th>
    </tr>
    <tr>
      <td style="width:100px; text-align:center">${issue.id}</td>
      <td  style="width:400px;text-align:center">${issue.description}</td>
      <td style="width:130px; text-align:center">${this.datePipe.transform(issue.dueDate, 'yyyy-MM-dd')}</td>
    </tr>
    </table><br/><br/>
    Please click URL: <a href="${window.location.href}/dashboard/report/issue">Click</a> here to enter the system for review.（鏈接僅支持Google瀏覽器）`;
    const mailData = {
      subject: `DFi月報落地執行議題回覆`,
      sender: 'dfi@wistron.com',
      content: content,
      receiver: receiver['Email']
    };
    this.mailService.create(mailData).toPromise();
  }

  getPic(event) {
    if (event && event.length) {
      if (this.saveData.pic !== event[0]['EmpID']) { // 修改pic 后记录发送邮件的标记
        this.saveData['mailTag'] = 1;
      }
      this.saveData.pic = event[0]['EmpID'];
    } else {
      if (this.saveData.pic !== event['EmpID']) {
        this.saveData['mailTag'] = 1;
      }
      this.saveData.pic = event['EmpID'];
    }
  }

  deleteIssueRaw(id: number) {
    const index = this.issueSet.findIndex(issue => issue.id === id);
    this.floorExecutionIssueService.deleteById(id).toPromise().then(delRaw => {
      if (delRaw['count'] === 1) {
        this.issueSet.splice(index, 1);
        this.issueSet = [...this.issueSet];
        this.messageService.success('刪除成功');
      }
    }).catch(e => {
      this.messageService.error('刪除失敗');
    });
  }

  getExpirationDays(dueday: Date) {
    return moment().diff(dueday, 'days');
  }
  tableSort(sort: { key: string; value: string }): void {
    // this.trackingIssues = [];
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }

  filter1(listOfSearchCategory: string[]): void {
    this.listOfSearchCategory = listOfSearchCategory;
    this.search();
  }
  filter2(listOfSearchStatus: string[]): void {
    this.listOfSearchStatus = listOfSearchStatus;
    this.search();
  }

  search(): void {
    /** filter data **/
    let data = [];
    data = this.listOfDate
      .filter(item => this.listOfSearchCategory && this.listOfSearchCategory.length > 0 ? this.listOfSearchCategory.includes(item['category']) : true)
      .filter(item => this.listOfSearchStatus && this.listOfSearchStatus.length > 0 ? this.listOfSearchStatus.includes(item['status']) : true);
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.issueSet = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName] !== null ? (b[this.sortName] !== null ? (a[this.sortName] > b[this.sortName]
            ? 1
            : -1) : 1) : -1
          : b[this.sortName] !== null ? (a[this.sortName] !== null ? (b[this.sortName] > a[this.sortName]
            ? 1
            : -1) : 1) : -1
      );
      this.issueSet = this.issueSet.slice();
    } else {
      this.issueSet = data;
      this.issueSet = this.issueSet.slice();
    }
  }
}
