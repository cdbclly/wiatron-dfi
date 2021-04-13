import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '@service/file.service';
import { ContainerApi, LoopBackConfig } from '@service/dfi-sdk';
import * as moment from 'moment';

@Component({
  selector: 'layout-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  temImgUrl: SafeUrl;
  uploadFile: File;
  filePath: string;
  isPreview: boolean;
  container = 'contact-us';

  constructor(
    private sanitizer: DomSanitizer,
    private fileService: FileService,
    private containerService: ContainerApi
  ) {}

  ngOnInit() {
    this.query();
  }

  query() {
    this.containerService.getFiles(this.container).subscribe(files => {
      let maxDate = moment.max(files.map(file => moment(file.mtime)));
      this.filePath = files.length>0 ? LoopBackConfig.getPath() + `/api/containers/${this.container}/download/` + files.find(file => moment(file.mtime).isSame(maxDate)).name : '';
    });
  }

  preview(file) {
    this.isPreview = true;
    this.uploadFile = file;
    this.temImgUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
  }

  upload(uploadFile) {
    this.fileService.postMRRFile(uploadFile, this.container, uploadFile.name).subscribe(file => {
      this.isPreview = false;
      this.query();
    });
  }

  cancel(uploadFile) {
    this.isPreview = false;
    uploadFile = null;
  }
}


