import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import * as CryptoJS from 'crypto-js';
import { PartNumberVendorFileApi, ProjectPartNumberApi, PartNumberVendorApi, ExternalUserApi } from '@service/mrr-sdk';
// MRR SDK
import { LoopBackConfig as NUDDLoopBackConfig } from '@service/mrr-sdk';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-manufacturer-files-manufacurer-files',
  templateUrl: './manufacturer-files-manufacurer-files.component.html',
  styleUrls: ['./manufacturer-files-manufacurer-files.component.scss']
})
export class ManufacturerFilesManufacurerFilesComponent implements OnInit {
  showData;  // 頁面展示的數據
  routData;  // 路由接收的數據
  uploadLoding; // 文件上傳的loading
  isDisplayUpload = false;
  filetoUpload;
  uploadFileName = '';
  fileName;
  documentUrl;
  releaseUrl;
  key = CryptoJS.enc.Utf8.parse('1234123412ABCDEF');  // 十六位十六进制数作为密钥
  iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');   // 十六位十六进制数作为密钥偏移量
  transNotice = {};
  constructor(
    private message: NzMessageService,
    public route: ActivatedRoute,
    private http: HttpClient,
    private partNumberVendorFileApi: PartNumberVendorFileApi,
    private projectPartNumberApi: ProjectPartNumberApi,
    private partNumberVendorApi: PartNumberVendorApi,
    private externalUserApi: ExternalUserApi,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.vendor-waiting-upload', 'mrr.vendor-no-upload', 'mrr.vendor-not-pass', 'mrr.material-factory-issue-fileUpload',
      'mrr.vendor-personnel', 'mrr.vendor-sop-name', 'mrr.nudd-fileUploading', 'mrr.vendor-file-oversize']).subscribe(res => {
        this.transNotice['waitingUpload'] = res['mrr.vendor-waiting-upload'];
        this.transNotice['noUpload'] = res['mrr.vendor-no-upload'];
        this.transNotice['fail'] = res['mrr.vendor-not-pass'];
        this.transNotice['uploadIssue'] = res['mrr.material-factory-issue-fileUpload'];
        this.transNotice['vendorPer'] = res['mrr.vendor-personnel'];
        this.transNotice['sopName'] = res['mrr.vendor-sop-name'];
        this.transNotice['uploading'] = res['mrr.nudd-fileUploading'];
        this.transNotice['oversize'] = res['mrr.vendor-file-oversize'];
      });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.vendor-waiting-upload', 'mrr.vendor-no-upload', 'mrr.vendor-not-pass', 'mrr.material-factory-issue-fileUpload',
        'mrr.vendor-personnel', 'mrr.vendor-sop-name', 'mrr.nudd-fileUploading', 'mrr.vendor-file-oversize']).subscribe(res => {
          this.transNotice['waitingUpload'] = res['mrr.vendor-waiting-upload'];
          this.transNotice['noUpload'] = res['mrr.vendor-no-upload'];
          this.transNotice['fail'] = res['mrr.vendor-not-pass'];
          this.transNotice['uploadIssue'] = res['mrr.material-factory-issue-fileUpload'];
          this.transNotice['vendorPer'] = res['mrr.vendor-personnel'];
          this.transNotice['sopName'] = res['mrr.vendor-sop-name'];
          this.transNotice['uploading'] = res['mrr.nudd-fileUploading'];
          this.transNotice['oversize'] = res['mrr.vendor-file-oversize'];
        });
    });
    const lockUrl = this.route.snapshot.paramMap.get('url');
    const encryptedHexStr = CryptoJS.enc.Hex.parse(lockUrl);
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(srcs, this.key, { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    const releaseUrl = JSON.parse(decryptedStr);
    const manufacturer = JSON.parse(localStorage.getItem('manufacturerId'));
    if (manufacturer && manufacturer !== releaseUrl.manufacturer) {
      this.externalUserApi.logout().subscribe({
        next: () => {
          localStorage.clear();
          location.replace(location.origin + '/dfiui/login');
        }
      });
    } else {
      this.routData = {
        projectCode: releaseUrl.projectCode,
        stage: releaseUrl.stage,
        manufacturer: releaseUrl.manufacturer,
        part_no: releaseUrl.part_no,
        partNumberVendorId: releaseUrl.partNumberVendorId,
        uploadCompleteRate: releaseUrl.uploadCompleteRate,
        passRate: releaseUrl.passRate,
        containerName: releaseUrl.containerName,
      };
      const searchData = {
        // 拿掉所有空格
        stageId: this.routData.stage,
        partNumberVendorId: this.routData.partNumberVendorId
      };
      this.getPartNumberFile(searchData);
    }
  }

  getPartNumberFile(d) {
    this.partNumberVendorFileApi.getPartNumberFiles(d).subscribe(res => {
      for (const r of res.data) {
        r['disEditStatus'] = true;
        r['displayFileName'] = null;
        r['displayDownload'] = false;  // 是否顯示下載icon
        if (r['status'] === 'FAILED') {  // 未通過
          r['uploadDate'] = this.transNotice['waitingUpload'];
        } else if (!r['path'] && !r['fileName']) {  // 未上傳
          r['uploadDate'] = this.transNotice['waitingUpload'];
          r['status'] = null;
        } else {
          r['rejectReason'] = null;
          r['uploadDate'] = moment(new Date(r['uploadDate'])).format('YYYY-MM-DD HH:mm');
        }
        if (r['pass']) {
          r['status'] = null;
          r['uploadDate'] = this.transNotice['noUpload'];
        }
      }
      this.showData = res.data;
      this.showData.sort(this.sortByBg);
      this.getpartNoPassVaule();
    });
  }

  // 如果料號pass為1,或者廠商有fail則只可讀，不可寫
  getpartNoPassVaule() {
    this.projectPartNumberApi.find({
      where: {
        projectId: this.routData.projectCode,
        partNumberId: this.routData.part_no
      }
    }).subscribe(res => {
      if (res[0]['pass']) {
        this.isDisplayUpload = true;
      }
      this.partNumberVendorApi.find({
        where: {
          partNumberId: this.routData.part_no,
          manufacturerId: this.routData.manufacturer,
        }
      }).subscribe(ree => {
        if (ree[0]['failDesc'] || ree[0]['approveValidation'] === this.transNotice['fail']) {
          this.isDisplayUpload = true;
        }
      });
    });
  }

  // 先按pass排序， 再按uploadDate排序
  sortByBg(a, b) {
    if (a['pass'] === b['pass']) {
      if (a['uploadDate'] && (a['uploadDate'] !== this.transNotice['waitingUpload'] || a['uploadDate'] !== null)) {
        if (a['uploadDate'] < b['uploadDate']) {
          return 1;
        } else if (a['uploadDate'] > b['uploadDate']) {
          return -1;
        } else {
          return 0;
        }
      }
    } else {
      if (a['pass'] > b['pass']) {
        return 1;
      } else {
        return -1;
      }
    }
  }

  customSort({ data, sortBy, sortField }) {
    const sortByObject = sortBy.reduce(
      (obj, item, index) => ({
        ...obj,
        [item]: index
      }),
      {}
    );
    return data.sort(
      (a, b) => sortByObject[a[sortField]] - sortByObject[b[sortField]]
    );
  }

  tasksWithDefault(tasks, sortBy) {
    tasks.map(item => ({
      ...item,
      sortStatus: sortBy.includes(item.uploadDate) ? item.uploadDate : 'other'
    }));
  }

  // upload
  handleUploadFile(data, uploadFile) {
    if (uploadFile) {
      this.uploadLoding = this.message.loading(this.transNotice['uploading'], { nzDuration: 0 }).messageId;
      // 檢核是否已經上傳，如果已上傳則刪除再上傳
      const date = new Date();
      const filetoUpload: File = uploadFile.files.item(0);
      if (filetoUpload.size > 10485760) {  // 上传文件大小不能大于10M
        this.message.remove(this.uploadLoding);
        this.message.create('error', this.transNotice['oversize']);
        return;
      }
      const filed = this.routData.projectCode + '-' + this.routData.part_no + '-' + this.routData.manufacturer;
      const token = localStorage.getItem('$DFI$token').toString();
      const apiURL = NUDDLoopBackConfig.getPath().toString();
      const endpoint = apiURL + `/api/containers/${this.routData.containerName}/upload`;
      // 截取文件後綴名
      const index = filetoUpload.name.lastIndexOf('.');
      const originalName = filetoUpload.name.substring(index + 1, filetoUpload.name.length);
      // 重構文件
      const fileName = this.routData.projectCode + '_' + this.routData.stage + '_'
        + moment(date).format('YYYY-MM-DD') + '_'
        + data.documentName + '_' + this.routData.part_no + ' _'
        + this.routData.manufacturer + '.' + originalName;
      const httpOptions = {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Authorization': token
        })
      };
      const bit = [];
      bit.push(filetoUpload);
      const newFile = new File(bit, fileName, {
        type: filetoUpload.type,
        lastModified: filetoUpload.lastModified
      });
      const formData: FormData = new FormData();
      formData.append('files', newFile);
      formData.append('id', data.id);
      formData.append('fileName', fileName);
      formData.append('token', token);
      this.partNumberVendorFileApi.find({ where: { id: data.id } }).subscribe(rdd => {   // 查詢是否已經有上傳文件
        if (rdd[0]['uploadDate']) {
          // 如果已有上傳，先刪除再上傳
          const deletePoint = apiURL + `/api/containers/${this.routData.containerName}/files/${rdd[0]['uuidFileName']}`;
          this.http.delete(deletePoint, httpOptions).subscribe(dd => {  // 刪除
            this.http.post(endpoint, formData, httpOptions).subscribe(res => {  // 上傳
              if (res['result'].clamStatus === true) {  // 如果沒有病毒
                const originalName = res['result'].fields.fileName[0];
                const uuidName = res['result'].files.files[0].name;
                const upsertData = {
                  id: data.id,
                  partNumberVendorId: data.partNumberVendorId,
                  documentName: data.documentName,
                  stageId: data.stageId,
                  path: `../../server/storage/${filed}/${uuidName}`,
                  fileName: originalName,
                  pass: data.pass,
                  status: 'UNCHECKED',
                  passReason: data.passReason,
                  defaultPass: data.defaultPass,
                  rejectReason: data.rejectReason,
                  createDate: data.createDate,
                  updateDate: data.updateDate,
                  createBy: data.createBy,
                  updateBy: data.updateBy,
                  isDelete: data.isDelete,
                  uploadDate: date,
                  uuidFileName: uuidName
                };
                this.partNumberVendorFileApi.upsert(upsertData).subscribe(ss => {
                  data.uploadDate = moment(date).format('YYYY-MM-DD HH:mm');
                  data.status = 'UNCHECKED';
                  data['displayFileName'] = filetoUpload.name;
                  data['fileName'] = fileName;
                  data['displayDownload'] = true;
                  this.message.remove(this.uploadLoding);
                  this.message.create('success', 'Upload successfully！');
                });
              }
              else {
                this.message.remove(this.uploadLoding);
                this.message.create('error', this.transNotice['uploadIssue']);
                return;
              }
            });
          });
        } else {  // 如果第一次上傳
          this.http.post(endpoint, formData, httpOptions).subscribe(res => {
            if (res['result'].clamStatus === true) {  // 如果沒有病毒
              const originalName = res['result'].fields.fileName[0];
              const uuidName = res['result'].files.files[0].name;
              const upsertData = {
                id: data.id,
                partNumberVendorId: data.partNumberVendorId,
                documentName: data.documentName,
                stageId: data.stageId,
                path: `../../server/storage/${filed}/${fileName}`,
                fileName: originalName,
                pass: data.pass,
                status: 'UNCHECKED',
                createDate: data.createDate,
                updateDate: data.updateDate,
                createBy: data.createBy,
                updateBy: data.updateBy,
                isDelete: data.isDelete,
                uploadDate: date,
                uuidFileName: uuidName
              };
              this.partNumberVendorFileApi.upsert(upsertData).subscribe(ss => {
                data.uploadDate = moment(date).format('YYYY-MM-DD HH:mm');
                data.status = 'UNCHECKED';
                data['displayFileName'] = filetoUpload.name;
                data['uuidFileName'] = uuidName;
                data['fileName'] = fileName;
                data['displayDownload'] = true;
                this.message.remove(this.uploadLoding);
                this.message.create('success', 'Upload successfully！');
              });
            } else {
              this.message.remove(this.uploadLoding);
              this.message.create('error', this.transNotice['uploadIssue']);
              return;
            }
          });
        }
      });
    }
  }

  // downLoad
  async downLoad(data) {
    await this.partNumberVendorFileApi.find({ where: { id: data.id } }).toPromise().then(async fie => {
      const uuidFileName = fie[0]['uuidFileName'];
      const token = localStorage.getItem('$DFI$token').toString();
      const apiURL = NUDDLoopBackConfig.getPath().toString();
      const container = this.routData.containerName;
      this.documentUrl = apiURL + `/api/containers/${container}/download/` + uuidFileName;
      await fetch(this.documentUrl, {
        method: 'GET',
        headers: new Headers({
          'content-Type': 'application/json;charset=UTF-8',
          Authorization: token
        })
      }).then(async res => await res.blob()).then(async (blob) => {
        // 创建隐藏的可下载链接
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = URL.createObjectURL(blob);
        a.download = data.fileName;  // 下載時候的文件名
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);  // 移除元素
      });
    });
  }

  downSqmSop() {
    const token = localStorage.getItem('$DFI$token').toString();
    const apiURL = NUDDLoopBackConfig.getPath().toString();
    const container = 'mrrDoc';
    const fileUrl = apiURL + `/api/containers/${container}/download/${this.transNotice['sopName']}-${this.transNotice['vendorPer']}.pdf`;
    fetch(fileUrl, {
      method: 'GET',
      headers: new Headers({
        'content-Type': 'application/json;charset=UTF-8',
        Authorization: token
      })
    }).then(async res => await res.blob()).then(async (blob) => {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = URL.createObjectURL(blob);
      a.download = `${this.transNotice['sopName']}-${this.transNotice['vendorPer']}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
