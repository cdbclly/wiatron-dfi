import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileService } from '@service/file.service';
import { NzMessageService } from 'ng-zorro-antd';
import { MeetingApi, Meeting } from '@service/dfi-sdk';
import * as moment from 'moment';
// DFI SDK
import { LoopBackConfig as DFILoopBackConfig } from '@service/dfi-sdk';
@Component({
  selector: 'app-project-summary',
  templateUrl: './project-summary.component.html',
  styleUrls: ['./project-summary.component.scss']
})
export class ProjectSummaryComponent implements OnInit {
  temImgUrl;
  selectedMonth;
  uploadFile;
  fileName;
  filePath;
  queryLoading = false;
  imgFlag = true;
  hasMeeting = false;
  isLoadingOne = false;
  constructor(
    private sanitizer: DomSanitizer,
    private fileService: FileService,
    private message: NzMessageService,
    private meetingApi: MeetingApi
  ) { }

  ngOnInit() {
    this.selectedMonth = new Date();
    this.query(new Date());
  }

  query(selectedMonth) {
    this.filePath = '';
    this.meetingApi.find().subscribe(meetingLogs => {
      const meetingLog = meetingLogs.filter((meeting: Meeting) => moment(selectedMonth).get('month') === moment(meeting.yearmonth).get('month'));
      this.hasMeeting = true;
      if (meetingLog.length > 0) {
        if (meetingLog[0]['projectSummaryPath']) {
          const selectPictrueName = meetingLog[0]['projectSummaryPath'].split('/');
          const fileName = selectPictrueName[selectPictrueName.length - 1];
          // 下載上傳的Excel、PPT以及PDF等
          const apiURL = DFILoopBackConfig.getPath().toString();
          this.filePath = apiURL + `/api/containers/projectSummary/download/` + fileName;
        }
      }
    }, error => {
      this.hasMeeting = false;
      console.log(error);
    });
  }


  // local imgurl preview
  preview(uploadFile) {
    this.filePath = '';
    this.imgFlag = false;
    this.uploadFile = uploadFile;
    this.fileName = this.selectedMonth.getTime() + '' + uploadFile['name'];
    this.temImgUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(uploadFile));
  }

  imgUpLoad() {
    this.isLoadingOne = true;
    const monthStart = moment(this.selectedMonth).startOf('month').toDate();
    const monthEnd = moment(this.selectedMonth).endOf('month').toDate();
    this.fileService.postMRRFile(this.uploadFile, 'projectSummary', this.fileName).subscribe(
      async data => {
        // 将文件名和路径存入meetingapi
        this.meetingApi.find({
          where: {
            and: [
              {meetingDate: {
                gt: monthStart
              }},
              {meetingDate: {
                lt: monthEnd
              }}
            ]}
          }).subscribe(uploadMeeting => {
          // const uploadMonth = moment(this.selectedMonth).get('month');
          // const uploadMeeting = meetingLogs.filter((meetingLog: Meeting) => moment(meetingLog.meetingDate).get('month') === uploadMonth);
          const projectSummaryPath = 'dfi/api/dfi/server/storage/projectSummary/' + `${this.fileName}`;
          if (uploadMeeting.length > 0) {
            this.handleUpload(uploadMeeting[0], projectSummaryPath);
          } else { // 新增一筆會議記錄
            this.meetingApi.upsert({meetingDate: new Date()}).subscribe(newMeeting => {
              this.handleUpload(newMeeting, projectSummaryPath);
            });
          }
        });
      }, error => {
        console.log(error);
        this.message.create('error', '上傳失败');
        this.isLoadingOne = false;
      });
  }

  handleUpload(meeting, projectSummaryPath) {
    this.meetingApi.patchAttributes(meeting['id'], { projectSummaryPath: projectSummaryPath }).subscribe(res => {
      this.message.create('success', '上傳成功！');
      this.query(this.selectedMonth);
      this.isLoadingOne = false;
      this.imgFlag = true;
    });
  }

  Delete() {
    this.imgFlag = true;
    this.query(this.selectedMonth);
    this.uploadFile = '';
  }
}
