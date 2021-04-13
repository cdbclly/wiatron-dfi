import { Component, OnInit } from '@angular/core';
import { MemberApi, OperationLogApi } from '@service/dfc_sdk/sdk';
import { GroupApi } from '@service/dfc_sdk/sdk';
@Component({
  selector: 'app-member-auth',
  templateUrl: './member-auth.component.html',
  styleUrls: ['./member-auth.component.scss']
})
export class MemberAuthComponent implements OnInit {
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
    'Plant': '',
    'Role': '',
    'DFIUser': false,
    'DFILeader': false
  };
  auth;
  type = 'Create';
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  constructor(
    private memberService: MemberApi,
    private groupService: GroupApi,
    private operationLogServer: OperationLogApi
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
      'Site': '',
      'Plant': '',
      'Role': '',
      'DFIUser': false,
      'DFILeader': false
    };
  }

  getUserList() {
    this.memberService.find({
      'where': {
        'Site': localStorage.getItem('DFC_Site')
      }
    })
      .subscribe((res) => {
        this.userList = res.map(rs => {
          const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === rs['Plant']);
          rs['Plant'] = (!plantMap) ? rs['Plant'] : plantMap['PlantName'];
          return rs;
        });
        this.dataSet = res.map(rs => {
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
          'and': [
            {
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
            { 'Site': localStorage.getItem('DFC_Site') }
          ]
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
        this.getUserList();
        this.isAddDataVisible = false;
        // 將操作信息存入緩存
        const logMsg = 'update\t' + localStorage.getItem('$DFI$userName') +
          '\nModify information,as follows:\n' + JSON.stringify(data);
        this.operationLogServer.create({
          userID: localStorage.getItem('$DFI$userID'),
          APname: 'DFi Core Member',
          data: logMsg
        }).subscribe(rs => console.log(rs), error => console.log(error));
      });
  }

  onEdit(data) {
    this.modalTitle = 'Edit user';
    this.type = 'Edit';
    this.saveData = JSON.parse(JSON.stringify(data));
    this.isAddDataVisible = true;
  }
}
