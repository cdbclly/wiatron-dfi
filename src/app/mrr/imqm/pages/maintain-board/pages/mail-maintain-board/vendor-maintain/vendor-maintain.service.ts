import { Injectable } from '@angular/core';
import { SelectMenuApi, EmailMaintainApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VendorMaintainService {

  constructor(private selectService: SelectMenuApi, private emailService: EmailMaintainApi) { }

  getSelectList(data) {
    return this.selectService.getSelectMenu(data).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getMailMaintainData(data) {
    // return this.http.get('./../../../../../../../../assets/temp-data/mailMaintain.json');
    return this.emailService.getList(data).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  updateMailData(data) {
    return this.emailService.putEmail(data).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  deleteMailData(id) {
    return this.emailService.deleteEmail(id).subscribe(res => {
      console.log(res);
      if (res) {
        return res;
      } else {
        return null;
      }
    });
  }

  addNewMailData(data) {
    return this.emailService.createEmail(data);
  }

  addNewMailSets(data) {
    return this.emailService.createMany(data);
  }

  getMailGroup() {
    return this.emailService.find({fields: {eMail: true}}).pipe(map((res) => {
      return res.map(item => item['eMail'] && item['eMail'].trim());
    }));
  }

  checkDuplicate(obj) {
    return this.emailService.find({where: {and: [{site: obj['site'], plant: obj['plant'], type: obj['type'], vendor: obj['vendor'],
    model: obj['model'], partNumber: obj['partNumber'], eMail: obj['eMail']}]}}).toPromise();
  }
}
