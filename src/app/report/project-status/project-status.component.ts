import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileService } from '@service/file.service';
import { NzMessageService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { MeetingApi, Meeting, PlantApi } from '@service/dfi-sdk';
import { PlantNamePipe } from 'app/shared/pipe/plantName/plant-name.pipe';
import { SitePipe } from 'app/shared/pipe';
// DFI SDK
import { LoopBackConfig as DFILoopBackConfig } from '@service/dfi-sdk';
@Component({
  selector: 'app-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss']
})
export class ProjectStatusComponent implements OnInit {
  temImgUrl;
  selectedMonth;
  uploadFile;
  fileName;
  filePath;
  site = 'F721';
  queryLoading = false;
  imgFlag = true;
  hasMeeting = false;
  isLoadingOne = false;
  constructor(
    private sanitizer: DomSanitizer,
    private fileService: FileService,
    private message: NzMessageService,
    private meetingApi: MeetingApi,
    private plantService: PlantApi

  ) { }

  ngOnInit() {
    this.selectedMonth = new Date();
    this.query(new Date());
  }

  query(selectedMonth) {
    this.filePath = '';
    this.meetingApi.find().subscribe(meetingLogs => {
      const meetingLog = meetingLogs.filter((meeting: Meeting) => moment(selectedMonth).get('month') === moment(meeting.yearmonth).get('month'));
      if (meetingLog.length > 0) {
        this.hasMeeting = true;
        if (meetingLog[0]['projectStatusPath']) {
          const selectPictrueName = meetingLog[0]['projectStatusPath'].split('/');
          const fileName = selectPictrueName[selectPictrueName.length - 1];
          // 下載上傳的Excel、PPT以及PDF等
          const apiURL = DFILoopBackConfig.getPath().toString();
          this.filePath = apiURL + `/api/containers/projectStatus/download/` + fileName;
        }
      }
    }, error => {
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
    this.fileService.postMRRFile(this.uploadFile, 'projectStatus', this.fileName).subscribe(
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
          const projectStatusPath = 'dfi/api/dfi/server/storage/projectStatus/' + `${this.fileName}`;
          if (uploadMeeting.length > 0) {
            this.handleUpload(uploadMeeting[0], projectStatusPath);
          } else {
            this.meetingApi.upsert({meetingDate: new Date()}).subscribe(newMeeting => {
              this.handleUpload(newMeeting, projectStatusPath);
            });
          }
        });
      }, error => {
        console.log(error);
        this.message.create('error', '上傳失败');
        this.isLoadingOne = false;
      });
  }

  handleUpload(uploadMeeting, projectStatusPath) {
    this.meetingApi.patchAttributes(uploadMeeting['id'], { projectStatusPath: projectStatusPath }).subscribe(res => {
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
