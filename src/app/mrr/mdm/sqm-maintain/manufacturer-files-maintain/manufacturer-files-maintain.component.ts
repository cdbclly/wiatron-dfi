import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PartNumberVendorFileApi, ProjectPartNumberApi, PartNumberVendorApi, PartNumberVendorFileRejectHistoryApi } from '@service/mrr-sdk';
import { NzMessageService } from 'ng-zorro-antd';
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';
// MRR SDK
import { LoopBackConfig as NUDDLoopBackConfig } from '@service/mrr-sdk';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-manufacturer-files-maintain',
  templateUrl: './manufacturer-files-maintain.component.html',
  styleUrls: ['./manufacturer-files-maintain.component.scss']
})
export class ManufacturerFilesMaintainComponent implements OnInit {
  routData; // 接收的路由參數
  isEditButton = false;
  isAddutton = false;
  isMailButton = false;
  isDisplayEdit = false;
  isSaveLoading = false;
  stateValue; // 審核狀態值
  showData; // 頁面顯示資料
  listOfDatas;  // 第二層rejectReason資料
  oldData;  // 取消編輯之前的資料
  checked = true;
  addOneFlag = false;
  confirmLoading = false;
  addFileName;  // 新增文件名稱
  checkboxValues;
  disPlayText = false;
  checkOptions = [
    { label: 'C3', value: 'C3', checked: true, disabled: false },
    { label: 'C4', value: 'C4', checked: true, disabled: false },
    { label: 'C5', value: 'C5', checked: true, disabled: false }
  ];
  key = CryptoJS.enc.Utf8.parse('1234123412ABCDEF');  // 十六位十六进制数作为密钥
  iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');   // 十六位十六进制数作为密钥偏移量
  transNotice = {};
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private message: NzMessageService,
    private partNumberVendorFileApi: PartNumberVendorFileApi,
    private projectPartNumberApi: ProjectPartNumberApi,
    private partNumberVendorApi: PartNumberVendorApi,
    private partNumberVendorFileRejectHistoryApi: PartNumberVendorFileRejectHistoryApi,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.vendor-sop-name', 'mrr.vendor-waiting-upload', 'mrr.vendor-sop-name', 'mrr.vendor-sysdefault',
      'mrr.vendor-not-pass', 'mrr.vendor-exit-notice', 'mrr.vendor-fillFile', 'mrr.vendor-leastOne', 'mrr.vendor-no-upload-notice',
      'mrr.vendor-fail-notice', 'mrr.vendor-no-mail-notice']).subscribe(res => {
        this.transNotice['sopName'] = res['mrr.vendor-sop-name'];

        this.transNotice['sopName'] = res['mrr.vendor-sop-name'];
        this.transNotice['sysdefault'] = res['mrr.vendor-sysdefault'];
        this.transNotice['fail'] = res['mrr.vendor-not-pass'];
        this.transNotice['exitNotice'] = res['mrr.vendor-exit-notice'];
        this.transNotice['fillFile'] = res['mrr.vendor-fillFile'];
        this.transNotice['leastOne'] = res['mrr.vendor-leastOne'];
        this.transNotice['noUploadNotice'] = res['mrr.vendor-no-upload-notice'];
        this.transNotice['failNotice'] = res['mrr.vendor-fail-notice'];
        this.transNotice['noMailNotice'] = res['mrr.vendor-no-mail-notice'];
      });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.vendor-sop-name', 'mrr.vendor-waiting-upload', 'mrr.vendor-sop-name', 'mrr.vendor-sysdefault',
        'mrr.vendor-not-pass', 'mrr.vendor-exit-notice', 'mrr.vendor-fillFile', 'mrr.vendor-leastOne', 'mrr.vendor-no-upload-notice',
        'mrr.vendor-fail-notice', 'mrr.vendor-no-mail-notice']).subscribe(res => {
          this.transNotice['sopName'] = res['mrr.vendor-sop-name'];
          // '待上傳' = res['mrr.vendor-waiting-upload'];
          this.transNotice['sopName'] = res['mrr.vendor-sop-name'];
          this.transNotice['sysdefault'] = res['mrr.vendor-sysdefault'];
          this.transNotice['fail'] = res['mrr.vendor-not-pass'];
          this.transNotice['exitNotice'] = res['mrr.vendor-exit-notice'];
          this.transNotice['fillFile'] = res['mrr.vendor-fillFile'];
          this.transNotice['leastOne'] = res['mrr.vendor-leastOne'];
          this.transNotice['noUploadNotice'] = res['mrr.vendor-no-upload-notice'];
          this.transNotice['failNotice'] = res['mrr.vendor-fail-notice'];
          this.transNotice['noMailNotice'] = res['mrr.vendor-no-mail-notice'];
        });
    });
    this.route.queryParams.subscribe(res => {
      this.routData = res;
      const searchData = {
        stageId: this.routData.stage,
        partNumberVendorId: Number(this.routData.partNumberVendorId)
      };
      this.getPartNumberFile(searchData);
      this.getpartNoPassVaule();
    });
  }

  getPartNumberFile(d) {
    this.partNumberVendorFileApi.getPartNumberFiles(d).subscribe(res => {
      this.partNumberVendorFileRejectHistoryApi.find().subscribe(red => {
        red.sort(this.sortById);
        this.listOfDatas = red;
        for (const r of res.data) {
          r['listData'] = [];
          r['disEditUnchecked'] = true;   // 禁用待確認
          r['disEditFailed'] = true;  // 禁用未通過
          r['disEditPass'] = true; // 禁用通過
          r['uploadDates'] = null;  // 添加uploadDates屬性
          r['rejectReason'] = null;  // 先給所有rejectReason賦值為NULL
          r['editRejectReason'] = false;  // 默認RejectReason不可編輯
          if (!r['path'] && !r['fileName']) {
            r['uploadDates'] = '待上傳';
            r['status'] = null;
          } else {
            r['uploadDates'] = moment(new Date(r['uploadDate'])).format('YYYY-MM-DD HH:mm');
          }
          if (r['pass']) {
            r['status'] = null;
            r['uploadDates'] = null;
          }
          if (r['defaultPass'] === true) {
            r['passReason'] = this.transNotice['sysdefault'];
          }
          for (const data1 of red) {
            data1['createDate'] = moment(new Date(data1['createDate'])).format('YYYY-MM-DD HH:mm');
            if (r.id === data1['partNumberVendorId']) {
              if (r['status'] === 'FAILED') {  // 如果為審核狀態為FAILED，可以看到最新一筆rejectReason
                const lastrejectReason = [...red].pop();  // 獲取最新一筆rejectReason
                if (lastrejectReason) {
                  r['rejectReason'] = lastrejectReason['rejectReason'];
                }
              }
              r['listData'].push(data1);
            }
          }
        }
        this.showData = res.data.sort(this.sortByBg);
        this.updateEditCache();
      });
    });
  }

  // rejectReason按ID排序
  sortById(a, b) {
    return a.id - b.id;
  }

  // 先按pass排序，再按uploadDates排序
  sortByBg(data1, data2) {
    if (data1['pass'] === data2['pass']) {
      if (data1['uploadDates'] && (data1['uploadDates'] !== '待上傳' || data1['uploadDate'] !== '')) {
        if (data1['uploadDates'] > data2['uploadDates']) {
          return 1;
        } else if (data1['uploadDates'] < data2['uploadDates']) {
          return -1;
        } else {
          return 0;
        }
      }
    } else {
      if (data1['pass'] > data2['pass']) {
        return 1;
      } else {
        return -1;
      }
    }
  }

  // 如果料號pass為1,或者廠商有fail或者NG則只可讀，不可寫
  getpartNoPassVaule() {
    this.projectPartNumberApi.find({
      where: {
        projectId: this.routData.projectCode,
        partNumberId: this.routData.part_no
      }
    }).subscribe(res => {
      if (res[0]['pass']) {
        this.disPlayText = true;  // 顯示提示文字
        this.isEditButton = true;
        this.isAddutton = true;
        this.isMailButton = true;
      }
      this.partNumberVendorApi.find({
        where: {
          partNumberId: this.routData.part_no,
          manufacturerId: this.routData.manufacturer,
        }
      }).subscribe(ree => {
        if (ree !== []) {
          if (ree[0]['failDesc'] || ree[0]['approveValidation'] === this.transNotice['fail']) {
            this.disPlayText = true;
            this.isEditButton = true;
            this.isAddutton = true;
            this.isMailButton = true;
          }
        }
      });
    });
  }

  // pass change
  passValueChange(data, e) {
    if (e === false) {
      data.edit = false;
      if (data.defaultPass === false) {  // 非系統默認的略過，如果恢復為false，則清空理由
        data.passReason = null;
      }
      if (data['status'] === 'PASS' || data['uploadDates'] === '待上傳') {
        data['disEditUnchecked'] = true;
        data['disEditFailed'] = true;
        data['disEditPass'] = true;
      } else if (data['status'] === 'FAILED') {
        data['disEditUnchecked'] = true;
        data['disEditFailed'] = false;
        data['disEditPass'] = false;
      } else if (!data['fileName'] && !data['path']) {
        data['uploadDates'] = '待上傳';
        data['disEditUnchecked'] = true;
        data['disEditFailed'] = true;
        data['disEditPass'] = true;
      } else {
        data['disEditUnchecked'] = false;
        data['disEditFailed'] = false;
        data['disEditPass'] = false;
      }
    } else if (e === true) {
      data.edit = true;
      data['disEditUnchecked'] = true;
      data['disEditFailed'] = true;
      data['disEditPass'] = true;
      data['uploadDates'] = '';
    }
  }

  // status change
  statusChange(data, status) {
    if (status === 'FAILED') {
      data.editRejectReason = true;
    } else {
      data['rejectReason'] = null;
      data.editRejectReason = false;
    }
  }

  // create Temporary file
  addFile() {
    this.addFileName = null;
    if (this.routData.stage === 'C3') {
      for (const item of this.checkOptions) {
        item.checked = true;
        item.disabled = false;
      }
    } else if (this.routData.stage === 'C4') {
      for (const item of this.checkOptions) {
        if (item.value === 'C3') {
          item.checked = false;
          item.disabled = true;
        }
      }
    } else if (this.routData.stage === 'C5') {
      for (const item of this.checkOptions) {
        if (item.value === 'C3' || item.value === 'C4') {
          item.checked = false;
          item.disabled = true;
        }
      }
    }
    this.addOneFlag = true;
  }

  addOne() {
    this.confirmLoading = true;
    // 檢核
    if (!this.addFileName) {
      this.confirmLoading = false;
      this.message.create('error', this.transNotice['fillFile']);
      return;
    } else {
      const fileNames = [];
      for (const item of this.showData) {
        fileNames.push(item.documentName);
      }
      const index = fileNames.indexOf(this.addFileName.trim());
      if (index !== -1) {
        this.confirmLoading = false;
        this.message.create('error', `${this.addFileName}${this.transNotice['exitNotice']}`);
        return;
      } else {
        // 必須選至少一個階段
        const isChecked = this.checkOptions.some(s => s.checked === true);
        if (isChecked === true) {
          for (let k = 0; k < this.checkOptions.length; k++) {
            if (this.checkOptions[k].checked === true) {
              this.createNewFile(this.checkOptions[k].value);
            }
            if (k === this.checkOptions.length - 1) {
              this.confirmLoading = false;
              this.addOneFlag = false;
              this.message.create('success', 'Added successfully！');
            }
          }
        } else {
          this.confirmLoading = false;
          this.message.create('error', this.transNotice['leastOne']);
          return;
        }
      }
    }
  }

  async createNewFile(stage) {
    const nowStage = this.routData.stage;
    const nowDate = new Date();
    const user = localStorage.getItem('$DFI$userID');
    const addData = {
      partNumberVendorId: this.routData.partNumberVendorId,
      documentName: this.addFileName,
      stageId: stage,
      pass: 0,
      createDate: nowDate,
      createBy: user,
      defaultPass: false,
    };
    await this.partNumberVendorFileApi.create(addData).toPromise().then(res => {
      if (stage === nowStage) {
        res['uploadDates'] = '待上傳';
        res['status'] = null;
        res['editRejectReason'] = false;  // 默認RejectReason不可編輯
        res['listData'] = []; // 存放未通過理由
        res['disEditUnchecked'] = true;   // 禁用待確認
        res['disEditFailed'] = true;  // 禁用未通過
        res['disEditPass'] = true; // 禁用通過
        this.showData.push(res);
        this.showData = this.showData.slice();
      }
    });
  }

  cancelAddOne() {
    this.addOneFlag = false;
  }

  editStart() {
    this.oldData = [];
    this.isDisplayEdit = true;
    this.isEditButton = true;
    this.checked = false;
    for (const data of this.showData) {
      const oneOldData = {
        pass: data.pass,
        defaultPass: data.defaultPass,
        passReason: data.passReason,
        status: data.status,
        uploadDates: data.uploadDates,
        rejectReason: data.rejectReason
      };
      this.oldData.push(oneOldData);
      if (data['pass'] || data['status'] === 'PASS' || data['uploadDates'] === '待上傳') {
        data['disEditUnchecked'] = true;
        data['disEditFailed'] = true;
        data['disEditPass'] = true;
      } else if (data['status'] === 'FAILED') {
        data['disEditUnchecked'] = true;
        data['disEditFailed'] = false;
        data['disEditPass'] = false;
        data['editRejectReason'] = true;
      } else {
        data['disEditUnchecked'] = false;
        data['disEditFailed'] = false;
        data['disEditPass'] = false;
        data['editRejectReason'] = false;
      }
    }
  }

  async editSave() {
    this.isSaveLoading = true;
    const date = new Date();
    for (let j = 0; j < this.showData.length; j++) {
      this.showData[j]['disEditUnchecked'] = true;
      this.showData[j]['disEditFailed'] = true;
      this.showData[j]['disEditPass'] = true;
      if (!this.showData[j]['pass']) {  // 若pass为false,则不需填无需上传理由，将其置为null
        this.showData[j]['passReason'] = null;
      }
      if (!this.showData[j]['defaultPass']) {  // 非defaultPass為true， 如果勾選pass值為true,必須填寫理由
        if (this.showData[j]['pass']) {
          if (!this.showData[j]['passReason']) {
            this.isSaveLoading = false;
            this.message.create('error', this.transNotice['noUploadNotice']);
            return;
          }
        }
      }
      if (this.showData[j]['status'] === 'FAILED' && !this.showData[j]['rejectReason']) {  // 審核狀態為FAILED， 必須填寫理由
        this.isSaveLoading = false;
        this.message.create('error', this.transNotice['failNotice']);
        return;
      }
      const updateData = {
        id: this.showData[j]['id'],
        partNumberVendorId: this.showData[j]['partNumberVendorId'],
        documentName: this.showData[j]['documentName'],
        stageId: this.showData[j]['stageId'],
        path: this.showData[j]['path'],
        fileName: this.showData[j]['fileName'],
        pass: this.showData[j]['pass'],
        defaultPass: this.showData[j]['defaultPass'],
        passReason: this.showData[j]['passReason'],
        status: this.showData[j]['status'],
        rejectReason: this.showData[j]['rejectReason'],
        uuidFileName: this.showData[j]['uuidFileName'],
        uploadDate: this.showData[j]['uploadDate'],
        updateDate: date,
        updateBy: localStorage.getItem('$DFI$userID')
      };
      await this.partNumberVendorFileApi.upsert(updateData).toPromise();
      if (this.showData[j]['editRejectReason'] === true) {
        const addRejectReason = {
          partNumberVendorId: this.showData[j]['id'],
          rejectReason: this.showData[j]['rejectReason'],
          rejectBy: localStorage.getItem('$DFI$userID'),
          createDate: date
        };
        await this.partNumberVendorFileRejectHistoryApi.create(addRejectReason).toPromise().then(rdd => {
          const newCreateDate = moment(new Date(rdd.createDate)).format('YYYY-MM-DD HH:mm');
          rdd.createDate = JSON.parse(JSON.stringify(newCreateDate));
          const newRejectReason = JSON.parse(JSON.stringify(this.showData[j]['listData']));
          newRejectReason.push(rdd);
          this.showData[j]['listData'] = newRejectReason;
          this.showData[j]['editRejectReason'] = false;
        });
      }
      this.showData[j]['edit'] = false;
      if (j === this.showData.length - 1) {
        this.isDisplayEdit = false;
        this.isEditButton = false;
        this.checked = true;
        this.isSaveLoading = false;
        this.message.create('success', 'Saved successfully！');
      }
    }
  }

  editCancel() {
    this.updateEditCache();
    for (let k = 0; k < this.showData.length; k++) {
      this.showData[k]['pass'] = this.oldData[k]['pass'];
      this.showData[k]['status'] = this.oldData[k]['status'];
      this.showData[k]['defaultPass'] = this.oldData[k]['defaultPass'];
      this.showData[k]['passReason'] = this.oldData[k]['passReason'];
      this.showData[k]['uploadDates'] = this.oldData[k]['uploadDates'];
      this.showData[k]['rejectReason'] = this.oldData[k]['rejectReason'];
      this.showData[k]['disEditUnchecked'] = true;
      this.showData[k]['disEditFailed'] = true;
      this.showData[k]['disEditPass'] = true;
      this.showData[k]['editRejectReason'] = false;
    }
    this.isDisplayEdit = false;
    this.isEditButton = false;
    this.checked = true;
  }

  // downLoad
  async downLoad(data) {
    await this.partNumberVendorFileApi.find({ where: { id: data.id } }).toPromise().then(async fie => {
      const uuidFileName = fie[0]['uuidFileName'];
      const token = localStorage.getItem('$DFI$token').toString();
      const apiURL = NUDDLoopBackConfig.getPath().toString();
      const container = this.routData.containerName;
      const fileUrl = apiURL + `/api/containers/${container}/download/` + uuidFileName;
      await fetch(fileUrl, {
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
        // 移除元素
        document.body.removeChild(a);
      });
    });
  }

 // 跳轉厂商文件上传測試，请勿删除以下注解部分
  // jumpTest() {
  //   const url = {
  //     projectCode: this.routData.projectCode,
  //     stage: this.routData.stage,
  //     manufacturer: this.routData.manufacturer,
  //     part_no: this.routData.part_no,
  //     partNumberVendorId: Number(this.routData.partNumberVendorId),
  //     uploadCompleteRate: this.routData.uploadCompleteRate,
  //     passRate: this.routData.passRate,
  //     containerName: this.routData.containerName
  //   };
  //   const srcs1 = CryptoJS.enc.Utf8.parse(JSON.stringify(url));
  //   const encrypted = CryptoJS.AES.encrypt(srcs1, this.key, { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  //   const lockUrl = encrypted.ciphertext.toString().toUpperCase();
  //   this.router.navigate(['/dashboard/mrrMdm/mumfile', lockUrl]);
  // }

  // 發送Mail
  sendMail() {
    const site = this.routData.plant;
    const manufacturerId = this.routData.manufacturer;
    const herf = `http://ifactory.wks.wistron.com/dfiui/dashboard/mrrMdm/mumfile/`;
    this.partNumberVendorFileApi.getManufacturerMail(site, manufacturerId).subscribe(res => {
      if (res.result) {
        const url = {
          projectCode: this.routData.projectCode,
          stage: this.routData.stage,
          manufacturer: this.routData.manufacturer,
          part_no: this.routData.part_no,
          partNumberVendorId: Number(this.routData.partNumberVendorId),
          uploadCompleteRate: this.routData.uploadCompleteRate,
          passRate: this.routData.passRate,
          containerName: this.routData.containerName
        };
        const srcs1 = CryptoJS.enc.Utf8.parse(JSON.stringify(url));
        const encrypted = CryptoJS.AES.encrypt(srcs1, this.key, { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        const lockUrl = encrypted.ciphertext.toString().toUpperCase();
        const sendData = {
          projectId: this.routData.projectCode,
          partNo: this.routData.part_no,
          stageId: this.routData.stage,
          manufacturerId: this.routData.manufacturer,
          partNumberVendorId: this.showData[0]['partNumberVendorId'],
          receiver: res.result,
          link: `${herf}${lockUrl}`
        };
        this.partNumberVendorFileApi.sendEmail(sendData).subscribe(ree => {
          if (ree.data === true) {
            this.message.create('success', 'Mail sent successfully！');
          } else {
            this.message.create('error', 'Failed to send mail！');
          }
        });
      } else {
        this.message.create('error', this.transNotice['noMailNotice']);
      }
    });
  }

  // 初始化編輯狀態
  updateEditCache(): void {
    for (const item of this.showData) {
      if (item.defaultPass === false) {  // 當defaultPass 為false的，才允許編輯“無需上傳”理由
        item['edit'] = false;
      }
    }
  }

  downSqmSop() {
    const token = localStorage.getItem('$DFI$token').toString();
    const apiURL = NUDDLoopBackConfig.getPath().toString();
    const container = 'mrrDoc';
    const fileUrl = apiURL + `/api/containers/${container}/download/${this.transNotice['sopName']}.pdf`;
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
      a.download = `${this.transNotice['sopName']}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}



