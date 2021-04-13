import { Component, OnInit } from '@angular/core';
import { MemberApi, OperationLogApi } from '@service/dfc_sdk/sdk';
import { GroupApi } from '@service/dfc_sdk/sdk';
import { AuthorityApi } from '@service/dfc_sdk/sdk';
import { FileService } from '@service/file.service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.scss']
})
export class UserAuthComponent implements OnInit {
  userList = [];
  dataSet = [];
  searchKey = '';
  isAddDataVisible;
  groupList = [];
  modalTitle = 'Add user';
  saveData = {
    'EmpID': '',
    'Name': '',
    'EName': '',
    'Email': '',
    'Site': '',
    'Dept': '',
    'Plant': '',
    'Role': '',
    'Supervisor': '',
    'Group': null,
    'DFIUser': false,
    'DFILeader': false,
    'IsPlantLevel': false,
    'CanSignMilitaryOrder': false
  };
  auth;
  type = 'Create';
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));

  fileToUpload: File = null;
  uploadFileName = '';
  showLoading = false;
  downloadFlag = false;
  downLoading = false;

  constructor(
    private memberService: MemberApi,
    private groupService: GroupApi,
    private fileService: FileService,
    private authorityService: AuthorityApi,
    private operationLogServer: OperationLogApi,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'));
    this.reset();
    this.getUserList();
    this.getGroupList();
  }

  reset() {
    this.saveData = {
      'EmpID': '',
      'Name': '',
      'EName': '',
      'Email': '',
      'Dept': '',
      'Site': '',
      'Plant': '',
      'Role': '',
      'Supervisor': '',
      'Group': null,
      'DFIUser': false,
      'DFILeader': false,
      'IsPlantLevel': false,
      'CanSignMilitaryOrder': false
    };
  }

  getUserList() {
    this.memberService.find({
      'include': {
        'relation': 'group',
        'scope': {
          'fields': [
            'GroupID',
            'Describtion'
          ]
        }
      }
    })
      .subscribe((res) => {
        this.dataSet = res.map(rs => {
          const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === rs['Plant']);
          rs['Plant'] = (!plantMap) ? rs['Plant'] : plantMap['PlantName'];
          return rs;
        });
        this.userList = res.map(rs => {
          const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === rs['Plant']);
          rs['Plant'] = (!plantMap) ? rs['Plant'] : plantMap['PlantName'];
          return rs;
        });
      });
  }

  getGroupList() {
    this.groupService.find()
      .subscribe((res) => {
        this.groupList = res;
      });
  }

  onSearch() {
    if (!!this.searchKey) {
      this.memberService.find({
        where: {
          or: [
            { Group: { like: '%' + this.searchKey + '%' } },
            { Name: { like: '%' + this.searchKey + '%' } },
            { EName: { like: '%' + this.searchKey + '%' } },
            { Site: { like: '%' + this.searchKey + '%' } },
            { Plant: { like: '%' + this.searchKey + '%' } },
            { Role: { like: '%' + this.searchKey + '%' } },
            { EmpID: { like: '%' + this.searchKey + '%' } }
          ]
        },
        'include': {
          'relation': 'group',
          'scope': {
            'fields': [
              'GroupID',
              'Describtion'
            ]
          }
        }
      })
        .subscribe((res) => {
          this.dataSet = res.map(rs => {
            const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === rs['Plant']);
            rs['Plant'] = (!plantMap) ? rs['Plant'] : plantMap['PlantName'];
            return rs;
          });
        });
    } else {
      this.dataSet = JSON.parse(JSON.stringify(this.userList));
    }
  }

  // 新增相關事件
  operateAdd() {
    this.modalTitle = 'Add user';
    this.type = 'Create';
    this.reset();
    this.isAddDataVisible = true;
  }

  handleAddCancel() {
    this.isAddDataVisible = false;
  }

  handleAddSave() {
    this.memberService.upsert(this.saveData)
      .subscribe(data => {
        this.authorityService.deleteById(this.saveData['EmpID'])
          .subscribe(i => {
            this.authorityService.upsert({
              EmpID: this.saveData['EmpID'],
              GroupID: this.saveData['Group']
            }).subscribe(res => {
              this.getUserList();
              this.isAddDataVisible = false;
              // 將操作信息存入緩存
              const logMsg = 'update\t' + localStorage.getItem('$DFI$userName') +
                '\nEdit or add users, as follows:\n' + JSON.stringify(res);
              this.operationLogServer.create({
                userID: localStorage.getItem('$DFI$userID'),
                APname: '使用者權限維護,User rights maintenance',
                data: logMsg
              }).subscribe(rs => console.log(rs), error => console.log(error));
            });
          });
      });
  }

  onEdit(data) {
    this.modalTitle = 'Edit user';
    this.type = 'Edit';
    this.saveData = JSON.parse(JSON.stringify(data));
    const plantMap = this.PlantMapping.find(plantMapData => plantMapData['PlantName'] === this.saveData.Plant);
    this.saveData.Plant = (!plantMap) ? this.saveData.Plant : plantMap['Plant'];
    delete this.saveData['group'];
    this.isAddDataVisible = true;
  }

  select(ad) {
    if (!!ad) {
      const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === ad.plant);
      this.saveData = Object.assign(this.saveData, {
        'EmpID': ad.id,
        'Name': ad.userCnName,
        'EName': ad.userEnName,
        'Email': ad.email,
        'Site': ad.site,
        'Plant': (!plantMap) ? ad.plant : plantMap['PlantName']
      });
    }
  }

  download(flag) {
    this.downloadFlag = flag;
    this.downLoading = true;
    if (flag) {
      // 下載模板
      this.fileService.downloadAuthMember('');
    } else {
      // 下載 表格內容 (此功能原要求必须有查询条件)
      // 1.EmpID
      const empIDs = this.dataSet.map(d => d.EmpID);
      // 2.下載文件
      this.fileService.downloadAuthMember(empIDs);
    }
    setTimeout(() => {
      this.downLoading = false;
    }, 5000);
  }

  upload(file) {
    this.showLoading = true;
    this.fileService.postDFCFile(file, 'member').subscribe({
      next: d => {
        this.message.create('success', 'Upload successfully!');
      },
      error: e => {
        const err = 'Upload failed: ' + JSON.stringify(e.error.error.message);
        this.message.create('error', err);
      },
      complete: () => {
        this.showLoading = false;
      }
    });
  }
}
