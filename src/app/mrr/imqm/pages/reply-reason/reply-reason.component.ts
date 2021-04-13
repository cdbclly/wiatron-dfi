import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbnormalApi, EarlyWarningApi, TraceBackApi, TraceBackReplyApi } from '@service/imqm-sdk';
import { tap, concatMap } from 'rxjs/operators';
import { iif, of } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-reply-reason',
  templateUrl: './reply-reason.component.html',
  styleUrls: ['./reply-reason.component.scss']
})
export class ReplyReasonComponent implements OnInit {
  type;
  number;
  reason;
  countermeasures;
  notFillIn = false;
  reply = [];
  constructor(
    private route: ActivatedRoute,
    private abnormalApi: AbnormalApi,
    private earlyWarningApi: EarlyWarningApi,
    private traceBackApi: TraceBackApi,
    private traceBackReplyApi: TraceBackReplyApi,

  ) {
    this.route.queryParams.subscribe(params => {
      this.number = params['number'];
      this.type = params['type'].toLowerCase();

      switch (this.type) {
        case 'abnormal':
          this.abnormalApi.get(this.number).pipe(
            tap((abnormal) => {
              const numberInfo = abnormal.result[0];
              if (numberInfo && numberInfo.status !== 'open') {
                this.notFillIn = true;
              } else {
                this.reason = numberInfo ? numberInfo.reason : '';
                this.countermeasures = numberInfo ? numberInfo.countermeasures : '';
              }
            })
          ).subscribe();

          break;
        case 'earlywarn':
          this.earlyWarningApi.get(this.number).pipe(
            tap((earlyWarning) => {
              const numberInfo = earlyWarning.result[0];
              if (numberInfo && numberInfo.status !== 'open') {
                this.notFillIn = true;
              } else {
                this.reason = numberInfo ? numberInfo.reason : '';
                this.countermeasures = numberInfo ? numberInfo.countermeasures : '';
              }
            })
          ).subscribe();
          break;
        case 'traceback':
          this.traceBackApi.get(this.number).pipe(
            concatMap((traceback) => iif(
              () => traceback.result[0] && traceback.result[0].status === 'open',
              this.traceBackReplyApi.find({ where: { number: this.number }, order: 'times' }),
              of(false)
            )),
            tap(
              (reply: any) => {
                if (!reply) {
                  this.notFillIn = true;
                } else {
                  this.reply = reply;
                }
              }
            )
          ).subscribe();
          break;
        default:
          break;
      }
    });

  }

  ngOnInit() {
  }

  send() {

    switch (this.type) {
      case 'abnormal':
        this.abnormalApi.upsertReasonAndCountermeasures(this.number, this.reason, this.countermeasures).subscribe(
          () => {
            location.reload();
          }
        );
        break;
      case 'earlywarn':
        this.earlyWarningApi.upsertReasonAndCountermeasures(this.number, this.reason, this.countermeasures).subscribe(
          () => {
            location.reload();
          }
        );
        break;
      case 'traceback':
        this.traceBackApi.upsertReasonAndCountermeasures(this.number)
          .pipe(
            concatMap(
              () => {
                return this.traceBackReplyApi.upsert({
                  number: this.number,
                  times: this.reply.length + 1,
                  reason: this.reason,
                  countermeasures: this.countermeasures,
                  updateTime: moment().valueOf()
                });
              }
            )
          ).subscribe(
            () => {
              location.reload();
            }
          );
        break;
      default:
        break;
    }
  }
}
