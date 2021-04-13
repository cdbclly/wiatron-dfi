import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MrrMaterialSelectService } from '../../mrr-material-select.service';
import { SqmBaseDataService } from '../sqm-base-data.service';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-sqm-base-data-manu',
  templateUrl: './sqm-base-data-manu.component.html',
  styleUrls: ['./sqm-base-data-manu.component.scss']
})
export class SqmBaseDataManuComponent implements OnInit {
  editCache: { [key: string]: { edit: boolean; data: {} } } = {};
  validateForm: FormGroup;
  isLoading = false;

  plantList = [];
  manufacturers = [];
  manufacturerList = [];
  manufacturerSearchChange$ = new BehaviorSubject('');

  // 新增數據
  saveData = {
    selectPic: '',
    selectPicMail: '',
    selectPicLeader: ''
  };
  acountParam = {
    vendorId: '',
    username: '',
    password: ''
  };
  // 廠商賬號維護參數
  manufacturer;
  updatePassword;
  showPassword = false;
  externalUserSet = [];
  userNameList = [];
  vendorList = [];
  addUserNameFlag = false;
  // 廠商郵件維護參數
  name;
  email;
  supervisorId;
  addFlag = false;
  addMailFlag = false;
  manufacturerData = [];
  addLeaderList = [];
  addisLeaveList = ['是', '否'];

  isExt = localStorage.getItem('$DFI$isExt') ? true : false;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private selectService: MrrMaterialSelectService,
    private sqmBaseDataService: SqmBaseDataService
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      selectPlant: [null, [Validators.required]],
      selectManufacturer: [null, [Validators.required]]
    });
    this.initPlantSelect();
    this.getManufacturer();
  }

  // 廠別下拉框
  initPlantSelect() {
    this.selectService.getPlant().subscribe(res => {
      this.plantList = res;
    });
  }

  // 廠商下拉框 從PartNumberVendor表 只抓取SQM維護過的廠商信息
  getManufacturer() {
    this.manufacturerSearchChange$
      .asObservable()
      .pipe(debounceTime(100))
      .subscribe(value => {
        this.selectService.getPartNumberInfo(null).subscribe((res: any) => {
          this.manufacturers = res.manufacturers;
          if (value) {
            this.manufacturers = res.manufacturers.filter(v => v.startsWith(value));
          }
        });
      });
  }

  query() {
    this.isLoading = true;
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    this.manufacturer = this.validateForm.value.selectManufacturer;
    this.userNameList = []; // 廠商賬號下拉框 L代表leader，U代表user
    this.userNameList.push(this.manufacturer + '_L');
    this.userNameList.push(this.manufacturer + '_U');
    const object$ = forkJoin([
      this.sqmBaseDataService.getPartNumberVendor(this.manufacturer),
      this.sqmBaseDataService.getExternalUser(this.manufacturer),
      this.sqmBaseDataService.getManufacturerPIC()
    ]);
    object$.subscribe((res: any) => {
      // 原來：SQM維護廠商賬號的時候 需要把每一個vendorCode都維護進去 因為後端做權限管控的時候是根據（廠商+vendorCode）兩個條件
      // 現在：User想廠商登錄進去 可以直接帶出該廠商下面的所有料號 不然key一個料號就需要重新登錄一次 所以目前只根據（廠商）一個條件做權限管控
      const partNumberVendor = res[0];
      const map = new Map();
      this.vendorList = partNumberVendor.filter(v => !map.has(v['vendorId']) && map.set(v['vendorId'], 1));
      this.vendorList = this.vendorList.filter(v => v.vendorId != v.manufacturerId); // 供應商代碼下拉框 同一個廠商可能對應多個vendorCode
      if (this.vendorList.length > 2) {
        for (let i = 0; i < this.vendorList.length - 2; i++) {
          this.userNameList.push(this.manufacturer + '_' + String.fromCharCode(65 + i));
        }
      }
      this.externalUserSet = res[1];
      this.updateEditUserCache();
      const manufacturerData = res[2];
      if (manufacturerData.length > 0) {
        for (let index = 0; index < manufacturerData.length; index++) {
          if (manufacturerData[index]['isLeave']) {
            manufacturerData[index]['isLeave'] = '是';
          } else {
            manufacturerData[index]['isLeave'] = '否';
          }
          if (manufacturerData[index]['supervisorId']) {
            const haveSupervisor = manufacturerData.filter(
              item => item['id'] === manufacturerData[index]['supervisorId']
            );
            manufacturerData[index]['picLeader'] = haveSupervisor[0]['name'];
          } else {
            manufacturerData[index]['picLeader'] = null;
          }
        }
        this.manufacturerData = manufacturerData.filter(
          item =>
            item['plantId'] === this.validateForm.value.selectPlant &&
            item['manufacturerId'] ===
            this.validateForm.value.selectManufacturer
        );
        this.updateEditCache();
      }
      this.addLeaderList = this.manufacturerData;
      this.isLoading = false;
      this.addFlag = true;
    });
  }
  // 新增廠商聯繫人郵件
  showMailModal() {
    this.saveData = {
      selectPic: '',
      selectPicMail: '',
      selectPicLeader: ''
    };
    this.addMailFlag = true;
  }

  addMailData() {
    if (this.saveData.selectPic && this.saveData.selectPicMail) {
      const form = {
        plantId: this.validateForm.value.selectPlant,
        manufacturerId: this.validateForm.value.selectManufacturer,
        name: this.saveData.selectPic,
        email: this.saveData.selectPicMail,
        supervisorId: this.saveData.selectPicLeader
          ? this.saveData.selectPicLeader
          : null,
        isLeave: 0
      };
      this.sqmBaseDataService.addManufacturerPIC(form).subscribe(res => {
        if (res['supervisorId']) {
          const haveSupervisor = this.manufacturerData.filter(
            item => item.id === res['supervisorId']
          );
          res['picLeader'] = haveSupervisor[0]['name'];
        } else {
          res['picLeader'] = null;
        }
        if (res['isLeave']) {
          res['isLeave'] = '是';
        } else {
          res['isLeave'] = '否';
        }
        this.manufacturerData.push(res);
        this.updateEditCache();
        this.manufacturerData = this.manufacturerData.slice();
        this.addMailFlag = false;
        this.message.create('success', '添加成功！');
      }, error => {
        this.addMailFlag = false;
        this.message.create('error', '添加失敗！');
      });
    } else {
      const param = !this.saveData.selectPic ? '聯繫人' : '聯繫人郵箱';
      this.message.create('warning', '請填寫' + param);
      return;
    }
  }

  handleCancel() {
    this.addMailFlag = false;
  }

  updateEditCache(): void {
    this.manufacturerData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  // 修改廠商聯繫人郵件
  nameChange(value) {
    this.name = value;
  }

  emailChange(value) {
    this.email = value;
  }

  picChange(value) {
    this.supervisorId = value;
  }

  startEdit(data) {
    this.editCache[data.id].edit = true;
  }

  saveEdit(data) {
    if (this.editCache[data.id].data['isLeave'] === '是') {
      data.isLeave = 1;
    } else {
      data.isLeave = 0;
    }
    const form = {
      id: data.id,
      manufacturerId: data.manufacturerId,
      plantId: data.plantId,
      name: this.name ? this.name : data.name,
      email: this.email ? this.email : data.email,
      supervisorId: this.supervisorId ? this.supervisorId : data.supervisorId,
      isLeave: data.isLeave
    };
    this.sqmBaseDataService.updateManufacturerPIC(form).subscribe(res => {
      if (!res['supervisorId']) {
        res['picLeader'] = null;
      } else {
        res['picLeader'] = this.manufacturerData.filter(
          item => item.id === res['supervisorId']
        )[0]['name'];
      }
      if (res['isLeave']) {
        res['isLeave'] = '是';
      } else {
        res['isLeave'] = '否';
      }
      Object.assign(data, res);
      this.editCache[data.id].edit = false;
      this.message.create('success', '修改成功！');
    }, error => {
      this.editCache[data.id].edit = false;
      this.message.create('error', '修改失敗！');
    });
  }

  cancelEdit(data) {
    const index = this.manufacturerData.findIndex(item => item.id === data.id);
    this.editCache[data.id] = {
      data: { ...this.manufacturerData[index] },
      edit: false
    };
  }

  // 新增廠商賬號密碼
  showUserNameModal() {
    this.acountParam = {
      vendorId: '',
      username: '',
      password: ''
    };
    this.addUserNameFlag = true;
  }

  addUserData() {
    const form = {
      username: this.acountParam.username,
      vendorId: this.acountParam.vendorId,
      manufacturerId: this.manufacturer,
      password: this.acountParam.password,
      updatedOn: new Date(),
      updatedBy: localStorage.getItem('$DFI$userID')
    };
    if (this.acountParam.vendorId && this.acountParam.username && this.acountParam.password) {
      this.sqmBaseDataService
        .getExternalUser({
          where: {
            manufacturerId: this.manufacturer,
            vendorId: this.acountParam.vendorId,
            username: this.acountParam.username
          }
        })
        .subscribe(res => {
          if (res.length > 0) {
            this.message.create('warning', '該賬號已存在，請勿重複添加！');
            return;
          } else {
            this.sqmBaseDataService.addExternalUser(form).subscribe(resu => {
              this.externalUserSet.push(resu);
              this.updateEditUserCache();
              this.externalUserSet = this.externalUserSet.slice();
              this.addUserNameFlag = false;
              this.message.create('success', '添加成功！');
            }, error => {
              this.addUserNameFlag = false;
              this.message.create('error', '添加失敗！');
            });
          }
        });
    } else {
      const param = !this.acountParam.vendorId
        ? '供應商代碼'
        : !this.acountParam.username
          ? '廠商賬號'
          : '廠商密碼';
      this.message.create('warning', '請填寫' + param);
      return;
    }
  }

  handleCancel1() {
    this.addUserNameFlag = false;
  }

  // 修改廠商密碼
  editPassword(data) {
    this.editCache[data.username].edit = true;
  }

  save(data) {
    const param = {
      username: data.username,
      password: this.updatePassword,
      updatedOn: new Date(),
      updatedBy: localStorage.getItem('$DFI$userID')
    };
    this.sqmBaseDataService.updatePassword(param).subscribe(res => {
      Object.assign(data, res);
      this.editCache[data.username].edit = false;
      this.message.create('success', '密碼已修改！');
    }, error => {
      this.editCache[data.username].edit = false;
      this.message.create('error', '修改失敗！');
    });
  }

  cancel(data) {
    const index = this.externalUserSet.findIndex(item => item.username === data.username);
    this.editCache[data.username] = {
      data: { ...this.externalUserSet[index] },
      edit: false
    };
  }

  updateEditUserCache(): void {
    this.externalUserSet.forEach(item => {
      this.editCache[item.username] = {
        edit: false,
        data: { ...item }
      };
    });
  }
}
