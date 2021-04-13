import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  @Output() uploadFile = new EventEmitter();
  @Input() showLoading;
  @Input() uploadType;
  @Output() fileShow = new EventEmitter();
  fileToUpload: File = null;
  uploadFileName = '';
  inputdata = [];
  pngFlag = false;
  inputShow;
  slectImage = '選擇上傳的圖片';
  selectExcel = 'Select Excel file';

  // I18N
  destroy$ = new Subject();

  constructor(
    private message: NzMessageService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    if (!!this.uploadType && this.uploadType === 'png') {
      this.pngFlag = true;
    }

    this.translate.get(['dfc.dfc-select-image', 'dfc.dfc-select-excel-file']).subscribe(res => {
      this.slectImage = res['dfc.dfc-select-image'];
      this.selectExcel = res['dfc.dfc-select-excel-file'];
      this.getInputShow();
    });
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfc.dfc-select-image', 'dfc.dfc-select-excel-file']).subscribe(res => {
        this.slectImage = res['dfc.dfc-select-image'];
        this.selectExcel = res['dfc.dfc-select-excel-file'];
        this.getInputShow();
      });
    });

  }

  getInputShow() {
    if (this.uploadFileName) {
      this.inputShow = this.uploadFileName;
    } else {
      if (this.pngFlag) {
        this.inputShow = this.slectImage;
      } else {
        this.inputShow = this.selectExcel;
      }
    }
  }

  handleUploadFile(input) {
    this.fileToUpload = input.files.item(0);
    if (this.fileToUpload) {
      const fileType = this.fileToUpload.type;
      let fileErrMsg = '';
      let validExts;
      let fileExt = this.fileToUpload.name;
      if (!!this.uploadType && this.uploadType === 'png') {
        validExts = new Array('.jpg', '.png');
        fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
        if (validExts.indexOf(fileExt) < 0) {
          fileErrMsg = 'Invalid file type. Only \'.jpg\' and \'.png\' types are accepted.';
        }
      } else {
        validExts = new Array('.xlsx', '.xls', '.csv');
        fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
        if (validExts.indexOf(fileExt) < 0) {
          fileErrMsg = 'Invalid file type. Only Excel types are accepted.';
        }
      }
      if (!!fileErrMsg) {
        this.message.create('error', fileErrMsg);
        this.fileToUpload = null;
        this.uploadFileName = '';
        return;
      }
      this.uploadFileName = this.fileToUpload.name;
    } else {
      this.uploadFileName = '';
    }
    this.getInputShow();
    // 上傳的文件如果為 獎懲文件, 則走這一步
    if (!!this.uploadType && this.uploadType === 'reward') {
      /* wire up file reader */
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        /* save data */
        this.inputdata = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
        this.fileShow.emit(this.inputdata);
      };
      reader.readAsBinaryString(input.files[0]);
    }
  }

  upload() {
    const now = new Date();
    let fileName = now.getTime().toString();
    fileName = fileName + '.' + this.fileToUpload.name.split('.').pop();
    this.showLoading = true;
    if (!!this.uploadType && this.uploadType === 'reward') {
      this.uploadFile.emit(this.inputdata);
    } else {
      this.uploadFile.emit(this.fileToUpload);
    }
  }
}
