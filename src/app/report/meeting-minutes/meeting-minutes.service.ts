import { Injectable } from '@angular/core';
import { MeetingApi, AttendanceApi, TrackingIssueApi, TrackingIssuePicApi, EmailApi } from '../../service/dfi-sdk';
import { Observable, forkJoin } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { DownexcelService } from '../../service/downexcel.service';
import { FileService } from '@service/file.service';
import * as XLSX from 'xlsx';
import * as XLSXSTYLE from 'xlsx-style';

@Injectable({
  providedIn: 'root'
})
export class MeetingMinutesService {

  EXCEL_EXTENSION = '.xlsx';
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  constructor(
    private meetingService: MeetingApi,
    private attendenceService: AttendanceApi,
    private trackIssueService: TrackingIssueApi,
    private trackIssuePicService: TrackingIssuePicApi,
    private emailService: EmailApi,
    private message: NzMessageService,
    private excelService: DownexcelService,
    private fileService: FileService
  ) {}

  saveCurMonthMeeting(meeting, flag: object) {
    return this.meetingService.upsert(meeting).toPromise()
      .catch(err => flag['logo'] = false);
  }


  saveCurMonthAttendees(attendees: any[], flag: object) {
    return forkJoin(attendees.map(att => this.attendenceService.upsert(att))).toPromise()
      .catch(err => flag['logo'] = false);
  }

  saveIssueTrack(issue: any, index: number) {
    return this.trackIssueService.upsert(issue).toPromise().catch(err => {
      if (err && err.code === 'ER_DATA_TOO_LONG') {
        this.message.create('error', `追蹤議題清單第 ${index + 1} 行內容超出規定大小，修改失敗`);
        return;
      }
    });
  }

  saveIssueTrackPics(picList: any[], successFlag: object) {
    return forkJoin(picList.map(pic => this.trackIssuePicService.upsert(pic))).toPromise()
    .catch(err => successFlag['logo'] = false);
  }

  deleteAttendeeByIds(ids: any[], flag: object) {
    // for (let index = 0; index < ids.length; index++) {
    //   this.attendenceService.deleteById(ids[index]).toPromise();
    // }
    return forkJoin(ids.map(id => this.attendenceService.deleteById(id))).toPromise()
      .catch(err => flag['logo'] = false);
  }

  deleteTrackIssueByIds(ids: any[]) {
    return forkJoin(ids.map(id => this.trackIssueService.deleteById(id))).toPromise();
  }

  deletePicByIssueId(ids: any[]) {
    return forkJoin(ids.map(id => this.trackIssueService.deleteTrackingIssuePics(id))).toPromise();
  }

  deleteTrackIssuePicsByIds(ids: any[], flag: object) {
    return forkJoin(ids.map(id => this.trackIssuePicService.deleteById(id))).toPromise()
      .catch(err => flag['logo'] = false);
  }

  async saveExcelWorkBookOnServer(workBook: XLSX.WorkBook, filename, containerName) {
    const excelBuffer: any = XLSXSTYLE.write(workBook, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    const data: Blob = new Blob([this.excelService.s2ab(excelBuffer)], {
      type: this.EXCEL_TYPE
    });
    const file = new File([data], filename , {type: this.EXCEL_TYPE, lastModified: Date.now()});
    await this.fileService.postMRRFile(file, containerName, filename).toPromise();
  }
}
