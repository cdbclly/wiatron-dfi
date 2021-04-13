import { DownexcelService } from '@service/downexcel.service';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { MailInterface } from '@service/dfi-sdk';
import { LoopBackAuth as DFILoopBackAuth } from '@service/dfi-sdk';
import { SigningService } from 'app/mrr/nudd/signing/signing.service';
import { PictureanalyseService } from '../../pictureanalyse/pictureanalyse.service';

@Component({
  selector: 'app-idresult',
  templateUrl: './idresult.component.html',
  styleUrls: ['./idresult.component.scss']
})
export class IdresultComponent implements OnInit {

  @Input() rdId;
  @Input() projectName;
  @Input() url;
  @Input() site;
  @Input() formParam;
  @Input() form = [];

  receivers: string;

  constructor(
    @Inject(DFILoopBackAuth) protected DFIAuth: DFILoopBackAuth,
    private downExcelService: DownexcelService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private signingService: SigningService,
    private pictureAnalyseService: PictureanalyseService
  ) { }

  ngOnInit() {
    this.pictureAnalyseService.findUserById(this.rdId).subscribe(reso => {
      this.receivers = 'D17030022@wistron.com';
    });
  }

  // 發郵件
  notice() {
    this.modalService.confirm({
      nzTitle: '<i>Do you Want to send these mails?</i>',
      nzContent: '',
      nzOnOk: () => {
        const mail: MailInterface = {
          subject: '[' + this.projectName + ']' + 'Nudd notification',
          content: '[' + this.projectName + ']NUDD need you judge(ID Book risk item),please review it.' +
            '<br>' +
            '<br>result:<br>' + this.getMailSendMessage() +
            '<br>Link <a href="' + this.url + '">MRR NUDD system</a> for detail information(需使用Google Chrome登陸)',
          sender: 'dfi@wistron.com',
          receiver: this.receivers
        };
        this.signingService.createMail(mail).subscribe(res => {
          this.message.create('success', 'Mail sent successfully！');
        },
          err => {
            this.message.create('error', 'Failed to send mail！');
          });
        this.getMailSendMessage();
      }
    });
  }

  // 郵件中加載表格的方法
  getMailSendMessage() {
    let send = '';
    if (this.site !== null && this.projectName !== null) {
      const title = this.site + '-' + this.projectName + ':' + '<br/>';
      send += title;
    }
    const style = 'style="border: 1px solid black;"';
    const style2 = 'style="border: 1px solid black;background: #F5C910"';
    const style3 = 'style="border: 1px solid black;border-collapse: collapse;text-align: center;width: 80%;margin: 0 auto;"';
    send += '<table ' + style3 + '>';
    const th = '<tr><th ' + style + '>Key Parts</th>' +
      '<th ' + style + '>Critical Process</th>' +
      '<th ' + style + '>YR</th>' +
      '</tr>';
    send += th;
    let i = 0;
    this.form.forEach(data => {
      if (data.operation.length !== 0) {
        let remark = '';
        if (data.material.desc === 'Other') {
          remark = data.material.remark;
        }
        const tr = '<tr>' +
          '<td ' + style + ' rowspan="' + (data.operation.length + 2) + '">' + data.part.name + ':' + data.process.name + '</td>' +
          '<td ' + style + '>' + data.material.desc + ' ' + remark + '</td>' +
          '<td ' + style + '>' + data.material.yieldRate * 100 + '%' + '</td>' +
          '</tr>';
        send += tr;
        data.operation.forEach(item => {
          let remark2 = '';
          if (item.name === 'Other') {
            remark2 = item.remark;
          }
          const tr2 = '<tr>' +
            '<td ' + style + '>' + item.name + ' ' + remark2 + '</td>' +
            '<td ' + style + '>' + item.yieldRate * 100 + '%' + '</td>' +
            '</tr>';
          send += tr2;
        });
        const tr3 = '<tr>' +
          '<td ' + style2 + '>直通率(%)</td>' +
          '<td ' + style2 + '>' + (this.getThroughRate(i) * 100).toFixed(2) + '%' + '</td>' +
          '</tr>';
        send += tr3;
        i++;
      }
      send = send;
    });
    send = send + '</table>';
    console.log(send);
    return send;
  }

  // 下載
  download() {
    const table = document.getElementById('downdata');
    this.downExcelService.exportTableAsExcelFile(table, 'IdBookData');
  }

  getThroughRate(index) {
    let throughRate = 1;
    this.form[index].operation.forEach(item => {
      throughRate = throughRate * item.yieldRate;
    });
    throughRate = throughRate * this.form[index].material.yieldRate;
    return throughRate;
  }

  otherClick() {
    return false;
  }
}
