import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { forkJoin, Observable } from 'rxjs';
import { MeetingMinutesService } from './meeting-minutes.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { DownexcelService } from '../../service/downexcel.service';
import { WorkSheet, WorkBook } from 'xlsx/types';
import { UserEnnamePipe } from 'app/shared/pipe/user-enname/user-enname.pipe';
import { MailApi, Attendance, TrackingIssue, MeetingApi, Meeting, TrackingIssueApi } from '@service/dfi-sdk';
import { FileService } from '@service/file.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MemberApi } from '@service/dfc_sdk/sdk/services/custom/Member';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-meeting-minutes',
  templateUrl: './meeting-minutes.component.html',
  styleUrls: ['./meeting-minutes.component.scss'],
  animations: [
    trigger('deleteAttendence', [
      state('noAnimate', style({
        opacity: 1
      })),
      transition('void => animate', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ]),
      transition('animate => void', [
        animate('1000ms', style({ opacity: 0 }))
      ])

    ])
  ]
})
export class MeetingMinutesComponent implements OnInit, OnDestroy {
  selectedMonth;
  queryMonth; // 當前 issueList 對應的月份，單獨設置一個 var 比直接查 issueLists 的某欄位會好些
  attendees: object = {};
  userList = [];
  selectedUser;
  isLoading = false;
  cardBodyStyle = { 'padding': '0px', 'overflow': 'auto' };
  trackingIssues: any[];
  editCache;
  curMonth = moment().format('YYYY-MM');
  isVisible = false;
  editId: any = 0;
  modalBodyStyle = { 'max-height': '500px', 'overflow-y': 'auto' };
  queryLoading = false;
  saveLoading = false;
  modalTitle;
  delSets = { // 存储页面删除的id
    attIds: [],
    issueIds: [],
    picIds: []
  };
  nzPageIndex = 2; // issue table 當前頁碼
  objectKeys = Object.keys;
  isCollpase = false; // 出勤人员折叠图标
  EXCEL_EXTENSION = '.xlsx';
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  monthFormat = 'yyyy/MM';
  sendLoading = false;
  isMeetingDate = false;  // 当月是否已保存数据
  sortName;
  sortValue;
  listOfDate;

  constructor(
    private _service: MeetingMinutesService,
    private messageService: NzMessageService,
    private modal: NzModalService,
    private excelService: DownexcelService,
    private userEnamePipe: UserEnnamePipe,
    private mailService: MailApi,
    private datePipe: DatePipe,
    private fileService: FileService,
    private route: ActivatedRoute,
    private memberService: MemberApi,
    private meetingService: MeetingApi,
    private trackingIssueService: TrackingIssueApi
  ) { }

  ngOnDestroy(): void {
    return;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.nzPageIndex = parseInt(params['nzPageIndex'], 10);
      if (params['yearmonth']) {
        this.selectedMonth = params['yearmonth'];
      } else {
        this.selectedMonth = this.curMonth;
      }
      this.query(this.selectedMonth);
    });
  }

  query(byMonth: string) {
    this.queryLoading = true;
    this.attendees = {};
    this.trackingIssues = [];
    this.queryMonth = moment(byMonth).format('YYYY-MM');
    const meeting$ = this.meetingService.find<Meeting>({
      where: {
        yearmonth: moment(this.selectedMonth).format('YYYY-MM')
      },
      order: 'id desc',
      include: 'attendances'
    });
    const trackingIssues$ = this.trackingIssueService.find<TrackingIssue>({
      where: {
        or: [
          {
            createdOn: {
              between: [
                moment(this.selectedMonth).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                moment(this.selectedMonth).endOf('month').format('YYYY-MM-DD HH:mm:ss')
              ]
            }
          },
          {
            createdOn: { lt: moment(this.selectedMonth).startOf('month').format('YYYY-MM-DD HH:mm:ss') },
            status: { inq: ['Open', 'Ongoing', 'Delay'] }
          }
        ]
      },
      include: 'trackingIssuePics',
    });
    forkJoin(meeting$, trackingIssues$).subscribe({
      next: ([meeting, trackingIssues]) => {
        if (meeting.length > 0) {
          this.attendees = _.groupBy(meeting[0].attendances, 'site');
        }
        this.listOfDate = trackingIssues;
        this.trackingIssues = trackingIssues;
        this.editCache = undefined;
        this.queryLoading = false;
      },
      error: err => {
        if (err.message) {
          this.messageService.error(err.message);
        } else {
          this.messageService.error(err);
        }
        this.queryLoading = false;
      }
    });
  }

  checkOne(user, event: Event) {
    user.status = user.status ? 1 : 0;
  }

  deleteOne(user, event: Event) {
    const del = this.attendees[user.site].splice(this.attendees[user.site].indexOf(user), 1);
    // tslint:disable-next-line:no-unused-expression
    del.length > 0 && this.delSets.attIds.push(del[0].id);
    // tslint:disable-next-line: no-unused-expression
    this.attendees[user.site].length === 0 && delete this.attendees[user.site];
  }


  chooseUser(user: Array<any> | {}, obj: {}, propName: string, propMail: string, propEname: string) {
    if (obj.hasOwnProperty(propName)) {
      // 用于标记发送给 pic 的 mail
      if (user instanceof Array) {
        if (user[0]['EmpID'] !== obj[propName]) {
          obj['mailTag'] = 1;
        }
        obj[propName] = user[0].EmpID;
        obj[propMail] = user[0].Email;
        obj[propEname] = user[0].EName;
      } else {
        if (user.hasOwnProperty('EmpID') && user['EmpID'] !== obj[propName]) {
          obj['mailTag'] = 1;
        }
        obj[propName] = user['EmpID'];
        obj[propMail] = user['Email'];
        obj[propEname] = user['EName'];
      }
      // obj[propName] = user instanceof Array ? user[0].EmpID : typeof user === 'object' ? user['EmpID'] : '';
      // obj[propMail] = user instanceof Array ? user[0].Email : typeof user === 'object' ? user['Email'] : '';
      // obj[propEname] = user instanceof Array ? user[0].EName : typeof user === 'object' ? user['EName'] : '';
    }
  }

  addAttendees(user) {
    if (this.queryMonth === this.curMonth) {
      const index = this.attendees[user.Site] ? this.attendees[user.Site].findIndex(att => att.employeeId === user.EmpID) : -1;
      if (index === -1) {
        this.attendees[user.Site] ?
          this.attendees[user.Site].push({ id: Symbol(), employeeId: user.EmpID, status: 0, meetingId: 0, site: user.Site, email: user.Email, ename: user.EName }) :
          this.attendees[user.Site] = [{ id: Symbol(), employeeId: user.EmpID, status: 0, meetingId: 0, site: user.Site, email: user.Email, ename: user.EName }];
      } else {
        this.messageService.info('Already in the attendance list, duplicate additions are prohibited');
      }
    }
  }

  showModal(id?: any): void {
    if (id) {
      this.editId = id;
      const index = this.trackingIssues.findIndex(issue => issue.id === id);
      this.editCache = JSON.parse(JSON.stringify(this.trackingIssues[index]));
      this.modalTitle = 'Eidt';
    } else {
      this.editId = Symbol();
      this.editCache = {
        id: this.editId,
        trackingIssuePics: [{ employerId: '', trackingIssueId: this.editId, email: '', ename: '' }],
        initiator: '',
        status: 'Open'
      };
      this.modalTitle = 'Add';
    }
    this.isVisible = true;
  }

  deleteIssueRaw(id: any): void {
    const index = this.trackingIssues.findIndex(issue => issue.id === id);
    const del = this.trackingIssues.splice(index, 1);
    // tslint:disable-next-line: no-unused-expression
    del.length > 0 && this.delSets.issueIds.push(del[0].id);
    this.trackingIssues = [...this.trackingIssues];
  }

  handleOk(): void {
    // 校驗必填項
    if (!(this.editCache.initiator && this.editCache.trackingIssuePics.length > 0 && this.editCache.trackingIssuePics[0]['employerId']
      && this.editCache.description)) {
      this.messageService.error('Please fill in the required options');
      return;
    }
    const index = this.trackingIssues.findIndex(issue => issue.id === this.editId);
    if (this.editCache.status === 'Close') {
      this.editCache['closingTime'] = new Date();
    }
    if (typeof this.editId === 'symbol') {
      if (index > -1) {// 存在->修改
        this.trackingIssues[index] = { ...JSON.parse(JSON.stringify(this.editCache)), id: this.editId };
      } else { // 新增
        this.trackingIssues.push(this.editCache);
      }
    } else { // 修改
      this.trackingIssues[index] = JSON.parse(JSON.stringify(this.editCache)); // 在這裡會丟掉 pic symbol 類型的 id,但不影響操作，暫不處理
    }
    this.trackingIssues = [...this.trackingIssues];
    this.editCache = undefined;
    this.isVisible = false;
  }

  handleCancel(): void {
    this.editCache = undefined;
    this.isVisible = false;
  }

  removeField(e: MouseEvent, i: number) {
    e.preventDefault();
    if (this.editCache['trackingIssuePics'].length > 0) {
      const del = this.editCache['trackingIssuePics'].splice(i, 1);
      // tslint:disable-next-line: no-unused-expression
      (del.length && del[0].hasOwnProperty('id')) > 0 && this.delSets.picIds.push(del[0]['id']);
    }
  }

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    this.editCache['trackingIssuePics'].push({ trackingIssueId: this.editId, employerId: '', email: '', ename: '' });
  }

  save() {
    // meeting attendance
    this.saveLoading = true;
    const callbackFlag = { logo: true }; // 所有api 操作的結果標識，true 都 ok
    let meeting;
    const picMailData = { data: [] };  // pic 郵件通知 data
    this.meetingService.find<Meeting>({ where: { yearmonth: moment(this.selectedMonth).format('YYYY-MM') }, include: 'attendances' }).subscribe(async meetings => {
      if (meetings.length > 0) {
        meeting = meetings[0];
        this.isMeetingDate = true;
        // meeting.attendances.length === 0 && await this.sendMailforMeeting(meetingMailData);
      } else {
        meeting = await this._service.saveCurMonthMeeting({ yearmonth: moment(this.selectedMonth).format('YYYY-MM') }, callbackFlag);
        this.isMeetingDate = true;
        // await this.sendMailforMeeting(meetingMailData);
      }
      //  處理pic mail
      await this.sendMailforPic(picMailData);
      // 删除attendees 多余的属性
      const attendeeList = _.flatten(Object.values(this.attendees).map(attBySite => {
        return attBySite.map(att => {
          att.meetingId = meeting['id'];
          att.ename && delete att.ename;
          att.email && delete att.email;
          return att;
        });
      }));
      await this.saveData(attendeeList, this.delSets, 'attIds', this._service.saveCurMonthAttendees.bind(this._service), this._service.deleteAttendeeByIds.bind(this._service), callbackFlag);

      // save issueTrack issueTrackPics
      const issueLists = [...this.trackingIssues];
      let issueListPics = [];
      for (let index = 0; index < issueLists.length; index++) {
        issueLists[index] = { ...issueLists[index] }; // issueLists[index] 为一个新对象，它的变化不会响应到页面
        const issue = issueLists[index];
        // issue['meetingId'] = meeting['id'];
        const picList = issue['trackingIssuePics'];
        delete issue['trackingIssuePics'];
        // tslint:disable-next-line: no-unused-expression
        issue['mailTag'] && delete issue['mailTag'];
        await this._service.saveIssueTrack(issueLists[index], index).then(res => {
          // tslint:disable-next-line:no-unused-expression
          res && picList.map(pic => {
            pic['trackingIssueId'] = res['id'];
            // tslint:disable-next-line:no-unused-expression
            pic.mailTag && delete pic.mailTag;
            // tslint:disable-next-line:no-unused-expression
            pic.email && delete pic.email;
            // tslint:disable-next-line:no-unused-expression
            pic.ename && delete pic.ename;
            return pic;
          });
        });
        issueListPics = issueListPics.concat(picList);
      }
      const issueDels = this.delSets.issueIds.filter(id => typeof id !== 'symbol');
      await this._service.deletePicByIssueId(issueDels);
      await this._service.deleteTrackIssueByIds(issueDels);

      await this.saveData(issueListPics, this.delSets, 'picIds', this._service.saveIssueTrackPics.bind(this._service), this._service.deleteTrackIssuePicsByIds.bind(this._service), callbackFlag);
      this.delSets = { // reset
        attIds: [],
        issueIds: [],
        picIds: []
      };
      this.selectedMonth ? this.query(this.selectedMonth) : this.query(this.selectedMonth);
      if (callbackFlag.logo) {
        // send mail for pic, attendees
        // tslint:disable-next-line:no-unused-expression
        for (let index = 0; index < picMailData.data.length; index++) {
          await this.mailService.create(picMailData.data[index]).toPromise();
        }
        if (picMailData.data.length > 0) {
          this.messageService.success('Saved successfully! The meeting minutes Mail have been sent !');
        } else {
          this.messageService.success('Saved successfully!');
        }
        this.saveLoading = false;
      }
    });
  }

  async sendMeetingMail() {
    this.sendLoading = true;
    const meetingMailData = { data: '' }; // 月會郵件通知data
    try {
      await this.sendMailforMeeting(meetingMailData);
      if (meetingMailData.data !== '') {
        await this.mailService.create(meetingMailData.data).toPromise();
      }
    } catch (error) {
      this.sendLoading = false;
      this.isMeetingDate = false;
      this.messageService.create('error', 'Failed to send');
      return;
    }
    this.isMeetingDate = false;
    this.messageService.success('The meeting minutes Mail have been sent !');
    this.sendLoading = false;
  }

  async saveData(addList: any[], delList: {}, propName, saveFn: Function, deleteFn: Function, callbackFlag: object) {
    addList = addList.map(item => {
      // tslint:disable-next-line:no-unused-expression
      typeof item.id === 'symbol' && delete item.id;
      return item;
    });
    delList[propName] = delList[propName].filter(id => typeof id !== 'symbol');
    if (callbackFlag['logo']) {
      await saveFn(addList, callbackFlag);
      await deleteFn(delList[propName], callbackFlag);
    }
  }

  canDeactivate() {
    return new Promise(res => {
      // 离开页面弹出框确认
      this.modal.confirm({
        nzOkText: 'OK',
        nzCancelText: 'Cancel',
        nzTitle: 'Confirm whether the data on the current page is saved?',
        nzContent: `After clicking the'Confirm' button, the confirmation box will be closed and the page will be redirected`,
        nzOnCancel: () => res(false),
        nzOnOk: () => res(true)
      });
    });
  }

  cardCollpase() {
    this.isCollpase = !this.isCollpase;
  }

  async sendMailforMeeting(meetingMailData: object) {
    // 生成当月会议记录的xlxs
    const handleTemplateData = async (workBook: WorkBook) => {
      const workSheet = workBook.Sheets['工作表1'];
      workSheet['!ref'] = 'A1:E' + (this.trackingIssues.length + 4);
      // 表頭背景色
      workSheet['A1']['s']['fill']['fgColor'] = { rgb: '696969' };
      workSheet['B1']['s']['fill']['fgColor'] = { rgb: '696969' };

      for (let index = 0; index < this.trackingIssues.length; index++) {
        // translate pic.Id to pic.ename
        const pics = this.trackingIssues[index]['trackingIssuePics'];
        const picEname = [];
        for (let picIndex = 0; picIndex < pics.length; picIndex++) {
          picEname.push(await this.userEnamePipe.transform(pics[picIndex]['employerId']).toPromise());
        }
        this.setCellValue(index + 1, workSheet, 'A' + (index + 4));
        this.setCellValue(await this.userEnamePipe.transform(this.trackingIssues[index]['initiator']).toPromise(), workSheet, 'B' + (index + 4));
        this.setCellValue(this.trackingIssues[index]['description'], workSheet, 'C' + (index + 4));
        this.setCellValue(picEname, workSheet, 'D' + (index + 4));
        this.setCellValue(this.datePipe.transform(this.trackingIssues[index]['dueDate'], 'yyyy-MM-dd'), workSheet, 'E' + (index + 4));
      }
      const attendeeData = [];
      let userMails = '';
      const users = [];
      for (const site in this.attendees) {
        if (this.attendees.hasOwnProperty(site)) {
          const atts = this.attendees[site].map(async att => {
            users.push(att.employeeId);
          });
        }
      }
      await this.memberService.find({
        where: {
          EmpID: { inq: users }
        }
      }).toPromise().then(menber => {
        for (let i = 0; i < menber.length; i++) {
          userMails += menber[i]['Email'] + ';';
          attendeeData.push(menber[i]['EName']);
        }
      });
      this.setCellValue(attendeeData.toString(), workSheet, 'B1');
      const filename = 'DFi月會紀錄_' + new Date().getTime() + this.EXCEL_EXTENSION;
      await this._service.saveExcelWorkBookOnServer(workBook, filename, 'meetingMinute');
      // mail data
      const mailData = {
        subject: `DFi Monthly Report Meeting Minutes(${this.curMonth})`,
        sender: 'dfi@wistron.com',
        content: `Dear All:<br/>
          ${this.curMonth} DFi月會紀錄，請見附件<br/>
          Please click URL: <a href="${window.location.href}?yearmonth=${this.curMonth}">Click</a> here to enter the system for review.(鏈接僅支持Google瀏覽器)`,
        receiver: userMails,
        attachments: JSON.stringify([{
          filename: filename,
          path: `/armstrong/dfi/api/dfi/server/storage/meetingMinute/${filename}`
        }])
      };
      meetingMailData['data'] = mailData;
      // await this.mailService.create(mailData).toPromise();
    };
    await this.excelService.parseFile(`../../../assets/temp-data/meetingTemplate.xlsx?nocache=${(new Date()).getTime()}`, handleTemplateData.bind(this));
  }

  async sendMailforPic(picMailData: object) {
    const newPic = {};
    this.trackingIssues.forEach(issue => {
      issue['trackingIssuePics'].forEach(pic =>
        pic.mailTag === 1 && (newPic[pic.ename + ',' + pic.email] ? newPic[pic.ename + ',' + pic.email].push(issue) : newPic[pic.ename + ',' + pic.email] = [issue])
      );
    });
    for (let i = 0; i < this.objectKeys(newPic).length; i++) {
      let cc = [];
      const picId = this.objectKeys(newPic)[i];
      const [picEname, picEmail] = picId.split(',');
      let issueTable = '';
      for (let index = 0; index < newPic[picId].length; index++) {
        const issueItem = newPic[picId][index];
        const [user] = await this.memberService.find({ where: { EmpID: issueItem['initiator'] } }).toPromise();
        cc.push(user['Email']);
        issueTable += `<tr><td style="width:100px; text-align:center">${index + 1}</td><td style="width:400px;text-align:center">${issueItem['description']}</td><td style="width:130px; text-align:center">${this.datePipe.transform(issueItem['dueDate'], 'yyyy-MM-dd')}</td></tr>`;
      }
      cc = Array.from(new Set(cc)); // 去重
      const content = `
        Dear ${picEname}:<br/><br/>
        DFI 月會議題如下，請回覆<br/>
        <table border="1" style="border-collapse:collapse;">
        <tr>
        <th colspan="5"bgcolor="#696969" style="text-align:center;color: white">DFi會議事項</th>
        </tr>
        <tr>
          <th>編號</th>
          <th>事項</th>
          <th>期限</th>
        </tr>
        ${issueTable}
        </table><br/><br/>
        Please click URL: <a href="${window.location.href}?yearmonth=${this.curMonth}">Click</a> here to enter the system for review.(鏈接僅支持Google瀏覽器)`;
      const mail = {
        subject: `DFi ${this.curMonth} 月會議題回覆`,
        sender: 'dfi@wistron.com',
        cc: cc.reduce<string>((previous, current) => `${previous};${current}`, ''),
        content: content,
        receiver: picEmail
      };
      picMailData['data'].push(mail);
    }
  }

  setCellValue(newValue, ws: WorkSheet, cellCode) {
    if (ws[cellCode]) {
      ws[cellCode]['v'] = newValue;
      ws[cellCode]['s']['alignment'] = { horizontal: 'left', vertical: 'left', wrapText: true };
      ws[cellCode]['t'] = 's';
    } else {
      ws[cellCode] = {
        v: newValue,
        s: { alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border: ws['A1']['s']['border'], font: ws['A2']['s']['font'] },
        t: 's'
      };
    }
  }

  getExpirationDays(dueday: Date) {
    return moment().diff(dueday, 'days');
  }

  sort(sort: { key: string; value: string }): void {
    this.trackingIssues = [];
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }

  search(): void {
    const data = this.listOfDate;
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.trackingIssues = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName] !== null ? (b[this.sortName] !== null ? (a[this.sortName] > b[this.sortName]
            ? 1
            : -1) : 1) : -1
          : b[this.sortName] !== null ? (a[this.sortName] !== null ? (b[this.sortName] > a[this.sortName]
            ? 1
            : -1) : 1) : -1
      );
      this.trackingIssues = this.trackingIssues.slice();
    } else {
      this.trackingIssues = data;
      this.trackingIssues = this.trackingIssues.slice();
    }
  }
}
