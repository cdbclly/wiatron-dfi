import { Component, OnInit } from '@angular/core';
import { IdbookMaintainService } from './idbook-maintain.service';
@Component({
  selector: 'app-idbook-maintain',
  templateUrl: './idbook-maintain.component.html',
  styleUrls: ['./idbook-maintain.component.scss']
})
export class IdbookMaintainComponent implements OnInit {
  mappingShow = false;
  processShow = false;
  yrShow = false;
  data;
  formData;
  // 權限控制
  enableUse = false;
  role: string;
  SQMLeaderUse = false;
  constructor(private service: IdbookMaintainService) { }

  ngOnInit() {
    this.role = localStorage.getItem('$DFI$userRole');
    const roles = this.role.toUpperCase().split(',');
    if (roles.indexOf('SQM') !== -1 || roles.indexOf('IT') !== -1) {
      this.enableUse = true;
    }
    if (roles.indexOf('SQM LEADER') !== -1) {
      this.SQMLeaderUse = true;
      this.enableUse = true;
    }
  }

  queryForm(data) {
    this.processShow = false;
    this.mappingShow = false;
    this.yrShow = false;
    this.service.getProcess(data.product).subscribe(res => {
      this.data = res;
      this.formData = data;
      if (data.action === 'Mapping') {
        this.mappingShow = true;
      } else if (data.action === '工藝維護') {
        this.processShow = true;
      } else if (data.action === '材料維護') {
        this.service.getMaterials(this.formData.product).subscribe(mRes => {
          this.data = mRes;
          this.data = this.data.slice();
          this.yrShow = true;
        });
      } else if (data.action === '製程維護') {
        this.service.getOperations(this.formData.product).subscribe(oRes => {
          this.data = oRes;
          this.data = this.data.slice();
          this.yrShow = true;
        });
      }
    });
  }
}
