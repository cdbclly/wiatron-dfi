import { PicturereportService } from './../analyse/pictureanalysereport/picturereport.service';
import { Component, OnInit } from '@angular/core';
import { SigningService } from './signing.service';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Utils } from 'app/dfq/utils';
import { PictureanalyseService } from '../analyse/pictureanalyse/pictureanalyse.service';
@Component({
  selector: 'app-signing',
  templateUrl: './signing.component.html',
  styleUrls: ['./signing.component.scss']
})
export class SigningComponent implements OnInit {

  dataLists = [];
  showList = false;
  showDetail = false;
  showData = [];

  // 具体签核内容
  signingDetails = [];
  projectNameGroup: any;
  currentRole: string;
  projectName: any;

  Signers = [];
  site: string;
  users = [];
  signingurl: any;
  reporturl: any;
  projectNames: any;
  projectCode: any;
  product: any;
  sendUsers: any[];
  customer: any;
  form: any;
  plant;
  constructor(
    private service: SigningService,
    private picturereportService: PicturereportService,
    private pictureanalyseService: PictureanalyseService
  ) { }

  ngOnInit() {
  }

  getQueryForm(form) {
    this.getSigners();
    const workFlowIds = [];
    // projectName, 產品別,Site,modelResultId,fact,signingurl,reporturl
    this.product = form[1];
    this.projectName = form[0];
    this.site = form[2];
    this.signingurl = form[5];
    this.reporturl = form[6];
    this.projectNames = form[7];
    this.projectCode = form[8];
    this.customer = form[9];
    this.plant = form[10];
    if (form[4].length !== 0) {
      form[4].forEach(element => {
        workFlowIds.push(element.workflowId);
      });
      // 有workflowId的数据
      this.service.getWorkFlows(workFlowIds).subscribe(res => {
        res = res.filter(reso => reso['facts'] && (reso['status'] !== '1' || reso['status'] !== '2'));
        const factArray = [];
        for (let index = 0; index < res.length; index++) {
          if (res[index]['facts']) {
            const obs = this.service.getModel(form[2], res[index]['facts'].modelResultId).pipe(
              switchMap(
                ((reso) => {
                  res[index]['projectCode'] = reso[0]['siteModel']['model'].projectId;
                  res[index]['projectName'] = reso[0]['siteModel']['model'].id;
                  res[index]['customer'] = reso[0]['siteModel']['model'].project.customerId;
                  return res;
                }
                )
              ));
            factArray.push(obs);
          }
        }
        forkJoin(factArray).subscribe(
          () => {
            res = res.filter(item => item['routingParameter'].includes('?site=' + this.site));
            this.projectNameGroup = Utils.groupBy(res, 'projectName');
            for (const j in this.projectNameGroup) {
              if (this.projectNameGroup.hasOwnProperty(j)) {
                this.projectNameGroup[j] = this.projectNameGroup[j].filter(item => item.current !== null);
              }
            }
            let i = 1;
            this.showData.length = 0;
            if (this.projectName && this.projectCode) {
              if (this.projectNameGroup[this.projectName][0].workflowSigns.filter(resd => resd.id === this.projectNameGroup[this.projectName][0].current).length !== 0) {
                this.showData.push(
                  {
                    key: i,
                    projectCode: this.projectNameGroup[this.projectName][0].projectCode,
                    projectName: this.projectNameGroup[this.projectName][0].projectName,
                    customer: this.projectNameGroup[this.projectName][0].customer,
                    signer: this.projectNameGroup[this.projectName][0].workflowSigns.filter(resd => resd.id === this.projectNameGroup[this.projectName][0].current)[0].role,
                    userId: this.projectNameGroup[this.projectName][0].workflowSigns.filter(resd => resd.id === this.projectNameGroup[this.projectName][0].current)[0].userId
                  }
                );
                this.showData = this.showData.slice();
              }
            } else if (!this.projectName && this.projectCode) {
              for (const projectName in this.projectNameGroup) {
                if (projectName !== 'undefined' && this.projectNames.includes(projectName)) {
                  if (this.projectNameGroup[projectName][0].workflowSigns.filter(resd => resd.id === this.projectNameGroup[projectName][0].current).length !== 0) {
                    this.showData.push(
                      {
                        key: i,
                        projectCode: this.projectNameGroup[projectName][0].projectCode,
                        projectName: this.projectNameGroup[projectName][0].projectName,
                        customer: this.projectNameGroup[projectName][0].customer,
                        signer: this.projectNameGroup[projectName][0].workflowSigns.filter(resd => resd.id === this.projectNameGroup[projectName][0].current)[0].role,
                        userId: this.projectNameGroup[projectName][0].workflowSigns.filter(resd => resd.id === this.projectNameGroup[projectName][0].current)[0].userId
                      }
                    );
                    i++;
                  }
                }
              }
              this.showData = this.showData.slice();
            } else {
              for (const projectName in this.projectNameGroup) {
                if (projectName !== 'undefined') {
                  if (this.projectNameGroup[projectName][0].workflowSigns.filter(resd => resd.id === this.projectNameGroup[projectName][0].current).length !== 0) {
                    this.showData.push(
                      {
                        key: i,
                        projectCode: this.projectNameGroup[projectName][0].projectCode,
                        projectName: this.projectNameGroup[projectName][0].projectName,
                        customer: this.projectNameGroup[projectName][0].customer,
                        signer: this.projectNameGroup[projectName][0].workflowSigns.filter(resd => resd.id === this.projectNameGroup[projectName][0].current)[0].role,
                        userId: this.projectNameGroup[projectName][0].workflowSigns.filter(resd => resd.id === this.projectNameGroup[projectName][0].current)[0].userId
                      }
                    );
                    i++;
                  }
                }
              }
              this.showData = this.showData.slice();
            }
            this.showList = true;
            this.showDetail = false;
          }
        );
      });
    } else {
      this.showData.length = 0;
      this.showList = false;
      this.showDetail = false;
    }
  }

  getSigners() {
    this.service.getSigners().subscribe(res => {
      this.Signers = res;
    });
  }

  goSigning(projectName, role, customer) {
    this.projectName = projectName;
    this.signingDetails = this.projectNameGroup[projectName];
    this.currentRole = role;
    this.customer = customer;
    this.picturereportService.getNuddUsers(`${this.plant}_${this.customer}_${this.product}`, 'NUDD001').subscribe(res => {
      this.users = res[0]['workflowFormMappings'][0]['workflowSignatories'];
      for (let index = 0; index < this.users.length; index++) {
        this.pictureanalyseService.findUserById(this.users[index].picId).subscribe(reso => {
          this.users[index].mail = reso;
          if (index === this.users.length - 1) {
            this.sendUsers = this.users;
          }
        }, err => console.log(err));
        this.showList = false;
        this.showDetail = true;
      }
    });
  }

  trans() {
    this.showDetail = false;
    this.getQueryForm(this.form);
  }
}
