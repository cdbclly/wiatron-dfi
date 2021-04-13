import { WorkflowSignatoryInterface } from 'app/service/dfi-sdk/models/WorkflowSignatory';
import { WorkflowFormApi } from 'app/service/dfi-sdk/services/custom/WorkflowForm';
import { WorkflowSignatoryApi } from 'app/service/dfi-sdk/services/custom/WorkflowSignatory';
import { WorkflowCounterSignApi } from 'app/service/dfi-sdk/services/custom/WorkflowCounterSign';
import { WorkflowSignApi } from 'app/service/dfi-sdk/services/custom/WorkflowSign';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NPIMODELApi,
  BusinessGroupApi,
  BusinessUnitApi,
  SiteApi,
  PlantApi,
  CustomerApi,
  StageApi,
  NPICHECKLIST_EM_HEADApi,
  ExitMeetingResultApi,
  CheckListLogApi,
  NPICHECKLIST_EMApi,
  NPITEAMMEMBERHEADApi,
  View_ModelResultApi,
  NPITEAMMEMBERLISTApi
} from '@service/dfq_sdk/sdk/services/custom';
import { NPICHECKLIST_EMInterface, NPICHECKLIST_EM_HEADInterface, NPICHECKLIST_EM } from '@service/dfq_sdk/sdk';
import { forkJoin, of, throwError, Subject } from 'rxjs';
import { UtilsService } from '@service/utils.service';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { UserApi } from '@service/portal/sdk/services/custom/User';
import { Utils } from 'app/dfq/utils';
import { WorkflowApi, WorkflowSignInterface, MailApi } from '@service/dfi-sdk';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeetingReviewTestService {

  constructor(
    private http: HttpClient,
    private modelService: NPIMODELApi,
    private businessGroupService: BusinessGroupApi,
    private businessUnitService: BusinessUnitApi,
    private SiteService: SiteApi,
    private plantService: PlantApi,
    private customerService: CustomerApi,
    private stageService: StageApi,
    private exitMeetingService: NPICHECKLIST_EM_HEADApi,
    private exitMeetingResultService: ExitMeetingResultApi,
    private workflowSign: WorkflowSignApi,
    private counterSigningService: WorkflowCounterSignApi,
    private workflowFormService: WorkflowFormApi,
    private checklistLogService: CheckListLogApi,
    private workflowService: WorkflowApi,
    private npiCheckListService: NPICHECKLIST_EMApi,
    private mailService: MailApi,
    private userService: UserApi,
    private npiTeamMemberHeadService: NPITEAMMEMBERHEADApi,
    private npiTeamMemberListService: NPITEAMMEMBERLISTApi,
    private utilsService: UtilsService,
    private viewModelResultApi: View_ModelResultApi

  ) {
  }

  public dataChanged = new Subject<any>();

  // sendChange() {
  //   this.dataChanged.next('change');
  // }

  getBgs(filter?) {
    return this.businessGroupService.find(filter);
  }

  getSites(filter?) {
    return this.SiteService.find(filter);
  }

  getCustomers(filter?) {
    return this.customerService.find(filter);
  }

  getStages(filter?) {
    return this.stageService.find(filter);
  }

  getBus(filter?) {
    return this.businessUnitService.find(filter);
  }

  getPlants(filter?) {
    return this.plantService.find(filter);
  }

  getModel(filter?) {
    return this.viewModelResultApi.find(filter);
  }

  getFormMappingId(key) {
    return this.workflowFormService.find({
      where: {
        name: 'DFQ0001'
      },
      include: {
        relation: 'workflowFormMappings',
        scope: {
          where: {
            model: 'DFQ',
            key: key
          },
          include: {
            relation: 'workflowSignatories',
            scope: { where: { isDynamic: 0 } }
          }
        }
      }
    }).pipe(map(res => {
      return (res[0]['workflowFormMappings'][0].id) as number;
    }));
  }

  getMeetingId(form) {
    const query = {
      where: {
        SITE: form.site,
        PLANT: form.plant,
        MODEL: form.model,
        STAGE: form.stage,
        DOCNO: this._checkNull(form.docno)
      }
    };
    // debugger;
    const url = `${location.origin}${location.pathname}?bg=${form.bg}&bu=${form.bu}&site=${form.site}&plant=${form.plant}&customer=${form.customer}&stage=${form.stage}&model=${form.model}`;
    const param = `?bg=${form.bg}&bu=${form.bu}&site=${form.site}&plant=${form.plant}&customer=${form.customer}&stage=${form.stage}&model=${form.model}`;
    console.log(url);
    return this.exitMeetingService.find(query).pipe(
      map(
        (meetingIdsRes: NPICHECKLIST_EM_HEADInterface[]) => {

          if (meetingIdsRes.length !== 1) {
            return throwError('This is an error!');
          }

          return {
            url: url,
            siteId: meetingIdsRes[0].SITE,
            plantId: meetingIdsRes[0].PLANT,
            exitMeetingId: meetingIdsRes[0].EXITMEETINGID,
            id: meetingIdsRes[0].id,
            signStatus: meetingIdsRes[0].SIGNSTATUS,
            param,
            key: form.bg + '_' + form.bu + '_' + form.plant + '_' + form.customer
          };
        }
      )
    );
  }

  getMeetingResult(filter?) {
    return this.exitMeetingResultService.find(filter);
  }

  getWorkFlow(filter?) {
    return this.workflowService.find(filter);
  }

  getNpiRole(filter?) {
    return this.npiTeamMemberHeadService.findOne(filter);
  }

  getNpiTeamMemberList(filter?) {
    return this.npiTeamMemberListService.find(filter);
  }

  getSigning(filter?) {
    return this.workflowSign.find(filter);
  }

  getCheckListEm(site, exitMeetingId, meetingResults, plant) {
    let $obs;
    if (meetingResults.length && (meetingResults[0].signStatus === 3 || meetingResults[0].signStatus === 5)) {
      $obs = this.checklistLogService.find(
        {
          where: {
            SITE: site,
            exitMeetingResultId: meetingResults[0].id
          },
          order: 'SEQ ASC'
        }
      );
    } else {
      $obs = this.npiCheckListService.find(
        {
          where: {
            SITE: site,
            EXITMEETINGID: exitMeetingId
          },
          order: 'SEQ ASC'
        }
      );
    }

    return $obs.pipe(
      map(
        (checklist: NPICHECKLIST_EMInterface[]) => {
          const itemsData = {
            overall: { closed: [], ongoing: [], open: [], na: [] },
            mustDo: { closed: [], ongoing: [], open: [] }
          };
          let functionStatus: { count: number, total: number, color: string, name: string }[] = [];

          let judgeStatus: number;
          let showSendButton = true;

          itemsData.overall.closed = checklist.filter(item => item.JUDGMENT === 1);
          itemsData.overall.ongoing = checklist.filter(item => item.JUDGMENT === 2);
          itemsData.overall.open = checklist.filter(item => item.JUDGMENT === 3);
          itemsData.overall.na = checklist.filter(item => item.JUDGMENT === 4);
          itemsData.mustDo.closed = checklist.filter(item => item.JUDGMENT === 1 && item.MUSTDO);
          itemsData.mustDo.ongoing = checklist.filter(item => item.JUDGMENT === 2 && item.MUSTDO);
          itemsData.mustDo.open = checklist.filter(item => item.JUDGMENT === 3 && item.MUSTDO);

          const nonMustdo = {
            closed: itemsData.overall.closed.length - itemsData.mustDo.closed.length,
            ongoing: itemsData.overall.ongoing.length - itemsData.mustDo.ongoing.length,
            open: itemsData.overall.open.length - itemsData.mustDo.open.length
          };

          // functions status
          const funcs = Utils.groupBy(checklist, 'CHECKFUNCTIONROLE');

          for (const func in funcs) {
            if (funcs.hasOwnProperty(func)) {
              const status: { count: number, total: number, color: string, name: string } = funcs[func].reduce((item, current) => {
                if (current.JUDGMENT === 1 || current.JUDGMENT === 2 || current.JUDGMENT === 3 || current.JUDGMENT === 4) {
                  item.count++;
                }
                item.total++;
                return item;
              }, { count: 0, total: 0, color: '', name: '' });

              if (status.count === 0) {
                status.color = 'red-circle';
              } else if (status.count === status.total) {
                status.color = 'green-circle';
              } else {
                status.color = 'orange-circle';
              }
              status.name = func;

              functionStatus.push(status);
            }
          }

          functionStatus = functionStatus.filter(
            (item) => {
              return item.total > 0;
            }
          );
          if (plant === '5') { // WKS F232
            if (checklist.length !== 0) {
              if (itemsData.mustDo.open.length >= 1) {

                // Not ready
                judgeStatus = 1;
              } else if (itemsData.overall.ongoing.length >= 1) {

                // Ready with Medium risk
                judgeStatus = 3;
              } else if (itemsData.overall.closed.length !== 0) {

                // Pass
                judgeStatus = 5;
              }
            } else {
              showSendButton = false;
            }
          } else { // Other plants
            if (checklist.length !== 0) {
              // Not ready
              if (itemsData.mustDo.open.length >= 1) {
                judgeStatus = 1;
              } else if (nonMustdo.open > 3) {
                // Ready with High risk
                judgeStatus = 2;
              } else if (itemsData.overall.ongoing.length >= 5 || (nonMustdo.open <= 3 && nonMustdo.open !== 0)) {
                // Ready with Medium risk
                judgeStatus = 3;
              } else if (itemsData.overall.ongoing.length < 5 && itemsData.overall.ongoing.length !== 0) {
                // Ready with Low risk
                judgeStatus = 4;
              } else if (itemsData.overall.ongoing.length === 0 && itemsData.overall.open.length === 0 && itemsData.overall.closed.length !== 0) {
                // Pass
                judgeStatus = 5;
              } else {
                judgeStatus = 1;
              }
            } else {
              showSendButton = false;
            }
          }
          return {
            itemsData: itemsData,
            functionStatus: functionStatus,
            judgeStatus: judgeStatus,
            showSendButton: showSendButton,
            npiCheckList: checklist
          };
        }
      )
    );
  }

  patchexitMeetingResultAttributes(meetingResultId, exitMeetingResultd) {
    return this.exitMeetingResultService.patchAttributes(meetingResultId, exitMeetingResultd);
  }
  patchexitMeetingResultAttributes2(meetingResultId, workflowId) {
    return this.exitMeetingResultService.patchAttributes(meetingResultId, workflowId);
  }

  patchWorkFlowAttributes(flowId, flows) {
    return this.workflowService.patchAttributes(flowId, flows);
  }

  updateNpiMeetingStatus(exitMeetingId: string, signStatus, site: string) {
    if (signStatus === 4) {
      signStatus = 'Rejected';
    } else if (signStatus === 5) {
      signStatus = 'Completed';
    } else {
      return of(null);
    }

    return this.utilsService.getConfig()
      .pipe(
        map((response) => {
          if (environment.enable) {
            response = environment;
          }
          const data = {
            type: 'POST',
            url: response['npiApi'][site],
            header: {
              'Content-Type': 'application/soap+xml; charset=utf-8;'
            },
            body:
              `<?xml version="1.0" encoding="utf-8"?>
              <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
                <soap12:Body>
                  <UpdateExitMeetingSignStatus xmlns="http://tempuri.org/">
                    <exitMeetingId>` + exitMeetingId + `</exitMeetingId>
                    <status>` + signStatus + `</status>
                  </UpdateExitMeetingSignStatus>
                </soap12:Body>
              </soap12:Envelope>`
          };

          const url = response['transferUrl'];
          this.http.post(url + '?Data=' + JSON.stringify(data), null).subscribe(result => console.log(result));
        })
      );
  }

  getSigner(filter?) {
    return this.workflowFormService.find({
      where: {
        name: 'DFQ0001'
      },
      include: {
        relation: 'workflowFormMappings',
        scope: {
          where: {
            key: filter.bg + '_' + filter.bu + '_' + filter.plant + '_' + filter.customer
          },
          include: {
            relation: 'workflowSignatories',
            scope: {
              where: {
                isDynamic: 0
              }
            }
          }
        }
      }
    }).pipe(map(res => {
      if (res[0]['workflowFormMappings'][0]) {
        return res[0]['workflowFormMappings'][0]['workflowSignatories'];
      }
    }, err => console.log(err)
    ));

    // return this.signerService.find(filter);
  }

  // api是null會把直塞進去，要undefined才會濾過
  _checkNull(data) {

    if (typeof data === 'object') {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          data[key] = data[key] ? data[key] : undefined;
        }
      }
    } else {
      return data ? data : undefined;
    }
  }

  getCheckListLog(filter?) {
    return this.checklistLogService.find(filter);
  }

  createExitMeetingResult(data) {
    return this.exitMeetingResultService.create(data);
  }

  createSigning(data) {
    return this.workflowSign.create(data);
  }

  createCounterSigning(data) {
    return this.counterSigningService.create(data);
  }

  findUserById(id) {
    return this.userService.findById(id);
  }

  createMail(data) {
    return this.mailService.create(data);
  }

  upsetCheckListLog(data) {
    return this.checklistLogService.create(data);
  }

  upsetSigning(data) {
    return this.workflowSign.upsert(data);
  }

  updateSigning(role, id, data, buHeadName) {
    if (role.toUpperCase() === 'CFE' || role.toUpperCase() === 'PM HEAD' || role.toUpperCase() === 'BU HEAD' || (!buHeadName && role.toUpperCase() === 'BG QM HEAD')) {
      return this.workflowSign.patchAttributes(id, data);
    } else {
      return this.counterSigningService.patchAttributes(id, data);
    }
  }

  updateEmHeadStatus(signStatus, user, id) {
    const emHead = {
      SIGNSTATUS: signStatus,
      UPDATEDATE: new Date(),
      UPDATEDBY: user.id
    };
    return this.exitMeetingService.patchAttributes(id, emHead);
  }

  setSigner(exitMeetingResult, user, meetinQueryForm, signerObj, workFlows) {

    if (workFlows.length > 0) {

      return this.getSigning({
        include: {
          relation: 'workflowCounterSigns'
        },
        where: {
          workflowId: workFlows[0].id
        },
        order: 'id DESC'
      }).pipe(
        switchMap(
          (signingRes: any[]) => {
            return this._setSignerCommend(signingRes, exitMeetingResult, signerObj);
          }
        ),
        switchMap(
          (res: { cfe, pmHead, buQmHead, buHead, bgQmHead, plant }) => {
            return this.setSignerAndEnable(meetinQueryForm, res, exitMeetingResult, user);
          }
        )
      );
    } else {

      return of(
        { cfe: signerObj.cfe, pmHead: signerObj.pmHead, buQmHead: signerObj.buQmHead, buHead: signerObj.buHead, bgQmHead: signerObj.bgQmHead, plant: signerObj.plant }
      ).pipe(
        switchMap(
          (res: { cfe, pmHead, buQmHead, buHead, bgQmHead, plant }) => {
            return this.setSignerAndEnable(meetinQueryForm, res, exitMeetingResult, user);
          }
        )
      );
    }
  }

  private setSignerAndEnable(meetinQueryForm: any, res: { cfe: any; pmHead: any; buQmHead: any; buHead: any; bgQmHead: any; plant: any; }, exitMeetingResult: any, user: any) {
    return this.getSigner({
      bg: meetinQueryForm.bg.toUpperCase(),
      bu: meetinQueryForm.bu.toUpperCase(),
      plant: meetinQueryForm.plant.toUpperCase(),
      customer: meetinQueryForm.customer.toUpperCase()
    }).pipe(map((signer: WorkflowSignatoryInterface[]) => {
      if (signer !== undefined && signer.length !== 0) {
        if (signer.find(item => item.stageDesc.toUpperCase() === 'CFE')) {
          res.cfe.user = signer.find(item => item.stageDesc.toUpperCase() === 'CFE').picId;
        }
        if (signer.find(item => item.stageDesc.toUpperCase() === 'PM HEAD')) {
          res.pmHead.user = signer.find(item => item.stageDesc.toUpperCase() === 'PM HEAD').picId;
        }
        if (signer.find(item => item.stageDesc.toUpperCase() === 'BU QM HEAD')) {
          res.buQmHead.user = signer.find(item => item.stageDesc.toUpperCase() === 'BU QM HEAD').picId;
        }
        if (signer.find(item => item.stageDesc.toUpperCase() === 'BU HEAD')) {
          res.buHead.user = signer.find(item => item.stageDesc.toUpperCase() === 'BU HEAD').picId;
        }
        res.bgQmHead.user = signer.find(item => item.stageDesc.toUpperCase() === 'BG QM HEAD').picId;
        res.plant.user = signer.find(item => item.stageDesc.toUpperCase() === 'PLANT MANAGER').picId;
      }
      return this._setSignerAndEnable(res, exitMeetingResult, user);
    }));
  }

  _setSignerAndEnable(res: { cfe, pmHead, buQmHead, buHead, bgQmHead, plant }, exitMeetingResult, user) {
    const tempComplete = exitMeetingResult.find(result => result.signStatus === 5);
    if (tempComplete) {
      res.plant.enable = false;
      res.pmHead.enable = false;
      res.buQmHead.enable = false;
      res.buHead.enable = false;
      res.bgQmHead.enable = false;
      res.cfe.enable = false;
      return res;
    }
    if (user.id === res.cfe.user) {
      res.cfe.enable = true;
      if (exitMeetingResult[0] && exitMeetingResult[0].signStatus === 3) {
        res.cfe.enable = false;
      }
    }
    if (user.id === res.pmHead.user && res.cfe.judge === 1) {
      res.pmHead.enable = true;
      if (res.pmHead.comment) {
        res.pmHead.enable = false;
      }
    }
    if (user.id === res.buQmHead.user && res.cfe.judge === 1) {
      res.buQmHead.enable = true;
      if (res.buQmHead.comment) {
        res.buQmHead.enable = false;
      }
    }
    if (user.id === res.buHead.user && !res.buQmHead.user && res.pmHead.comment) {
      res.buHead.enable = true;
      if (res.buHead.comment) {
        res.buHead.enable = false;
      }
    }
    if (user.id === res.buHead.user && res.pmHead.comment && res.buQmHead.comment) {
      res.buHead.enable = true;
      if (res.buHead.judge === 0 || res.buHead.judge === 1) {
        res.buHead.enable = false;
      }
    }
    if (user.id === res.bgQmHead.user && !res.buQmHead.user && res.pmHead.comment) {
      res.bgQmHead.enable = true;
      if (res.bgQmHead.judge === 0 || res.bgQmHead.judge === 1) {
        res.bgQmHead.enable = false;
      }
    }
    if (user.id === res.bgQmHead.user && res.pmHead.comment && res.buQmHead.comment) {
      res.bgQmHead.enable = true;
      if (res.bgQmHead.judge === 0 || res.bgQmHead.judge === 1) {
        res.bgQmHead.enable = false;
      }
    }
    if (user.id === res.plant.user && !res.buQmHead.user && res.pmHead.comment) {
      res.plant.enable = true;
      if (res.plant.judge === 0 || res.plant.judge === 1) {
        res.plant.enable = false;
      }
    }
    if (user.id === res.plant.user && res.pmHead.comment && res.buQmHead.comment) {
      res.plant.enable = true;
      if (res.plant.judge === 0 || res.plant.judge === 1) {
        res.plant.enable = false;
      }
    }
    return res;
  }

  _setSignerCommend(signingRes: WorkflowSignInterface[], exitMeetingResult, signerObj, forAll?) {

    if (exitMeetingResult[0] && exitMeetingResult[0].signStatus !== 4) {
      for (let index = 0; index < signingRes.length; index++) {
        const tempComment = signingRes[index].comment;
        switch (signingRes[index].role.toUpperCase()) {
          case 'CFE':
            signerObj.cfe.comment = tempComment;
            signerObj.cfe.judge = signingRes[index].isAgree;
            if (forAll) {
              signerObj.cfe.user = signingRes[index].userId;
              signerObj.cfe.id = signingRes[index].id;
            }
            break;
          case 'PM HEAD':
            signerObj.pmHead.comment = tempComment;
            if (forAll) {
              signerObj.pmHead.user = signingRes[index].userId;
              signerObj.pmHead.id = signingRes[index].id;
            }
            break;
          case 'BU HEAD':
            signerObj.buHead.comment = tempComment;
            signerObj.buHead.judge = signingRes[index].isAgree;
            if (forAll) {
              signerObj.buHead.user = signingRes[index].userId;
              signerObj.buHead.id = signingRes[index].id;
            }
            break;
          case 'BG QM HEAD':
            signerObj.bgQmHead.comment = tempComment;
            signerObj.bgQmHead.judge = signingRes[index].isAgree;
            if (forAll) {
              signerObj.bgQmHead.user = signingRes[index].userId;
              signerObj.bgQmHead.id = signingRes[index].id;
            }
            break;
          default:
            break;
        }
        if (signingRes[index].workflowCounterSigns.length !== 0) {
          for (let j = 0; j < signingRes[index].workflowCounterSigns.length; j++) {
            switch (signingRes[index].workflowCounterSigns[j].role.toUpperCase()) {
              case 'BU QM HEAD':
                signerObj.buQmHead.comment = signingRes[index].workflowCounterSigns[j].comment;
                if (forAll) {
                  signerObj.buQmHead.user = signingRes[index].workflowCounterSigns[j].userId;
                  signerObj.buQmHead.id = signingRes[index].workflowCounterSigns[j].id;
                }
                break;
              case 'BG QM HEAD':
                signerObj.bgQmHead.comment = signingRes[index].workflowCounterSigns[j].comment;
                signerObj.bgQmHead.judge = signingRes[index].workflowCounterSigns[j].isAgree;
                if (forAll) {
                  signerObj.bgQmHead.user = signingRes[index].workflowCounterSigns[j].userId;
                  signerObj.bgQmHead.id = signingRes[index].workflowCounterSigns[j].id;
                }
                break;
              case 'PLANT MANAGER':
                signerObj.plant.comment = signingRes[index].workflowCounterSigns[j].comment;
                signerObj.plant.judge = signingRes[index].workflowCounterSigns[j].isAgree;
                if (forAll) {
                  signerObj.plant.user = signingRes[index].workflowCounterSigns[j].userId;
                  signerObj.plant.id = signingRes[index].workflowCounterSigns[j].id;
                }
                break;
              default:
                break;
            }

          }
        }

      }
    }

    return of({
      cfe: signerObj.cfe,
      pmHead: signerObj.pmHead,
      buQmHead: signerObj.buQmHead,
      buHead: signerObj.buHead,
      bgQmHead: signerObj.bgQmHead,
      plant: signerObj.plant
    });
  }

  judge(checklist: NPICHECKLIST_EM[]): number {
    let status: number;
    const data = {
      overall: {
        closed: [],
        ongoing: [],
        open: [],
        na: []
      },
      mustDo: {
        closed: [],
        ongoing: [],
        open: []
      },
      nonMustDo: {
        closed: [],
        ongoing: [],
        open: []
      }
    };

    data.overall.closed = checklist.filter(item => item.JUDGMENT === 1);
    data.overall.ongoing = checklist.filter(item => item.JUDGMENT === 2);
    data.overall.open = checklist.filter(item => item.JUDGMENT === 3);
    data.overall.na = checklist.filter(item => item.JUDGMENT === 4);
    data.mustDo.closed = checklist.filter(item => item.JUDGMENT === 1 && item.MUSTDO);
    data.mustDo.ongoing = checklist.filter(item => item.JUDGMENT === 2 && item.MUSTDO);
    data.mustDo.open = checklist.filter(item => item.JUDGMENT === 3 && item.MUSTDO);
    data.nonMustDo.closed = checklist.filter(item => item.JUDGMENT === 1 && !item.MUSTDO);
    data.nonMustDo.ongoing = checklist.filter(item => item.JUDGMENT === 2 && !item.MUSTDO);
    data.nonMustDo.open = checklist.filter(item => item.JUDGMENT === 3 && !item.MUSTDO);

    // Not ready
    if (data.mustDo.open.length >= 1) {
      status = 1;
    } else if (data.nonMustDo.open.length > 3) {
      // Ready with High risk
      status = 2;
    } else if (data.overall.ongoing.length >= 5 || (data.nonMustDo.open.length <= 3 && data.nonMustDo.open.length !== 0)) {
      // Ready with Medium risk
      status = 3;
    } else if (data.overall.ongoing.length < 5 && data.overall.ongoing.length !== 0) {
      // Ready with Low risk
      status = 4;
    } else if (data.overall.ongoing.length === 0 && data.overall.open.length === 0 && data.overall.closed.length !== 0) {
      // Pass
      status = 5;
    } else {
      status = 1;
    }

    return status;
  }

  getResultByPlantId(plantId, judgeStatus: number): boolean {
    switch (judgeStatus) {
      case 1:
      case 2: return false;
      case 3: if (plantId === '5') { return true; } else { return false; }
      case 4:
      case 5: return true;
    }
  }
}

@Injectable()
export class MeetingReviewResolve implements Resolve<any> {

  meetinQuery: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _service: MeetingReviewTestService
  ) { }

  resolve(_route: ActivatedRouteSnapshot) {

    if (_route.queryParamMap.get('bg')
      && _route.queryParamMap.get('bu')
      && _route.queryParamMap.get('site')
      && _route.queryParamMap.get('plant')
      && _route.queryParamMap.get('customer')
      && _route.queryParamMap.get('stage')
      && _route.queryParamMap.get('model')) {
      this.meetinQuery = this._fb.group({
        bg: [_route.queryParamMap.get('bg'), [Validators.required]],
        bu: [_route.queryParamMap.get('bu'), [Validators.required]],
        site: [_route.queryParamMap.get('site'), [Validators.required]],
        plant: [_route.queryParamMap.get('plant'), [Validators.required]],
        customer: [_route.queryParamMap.get('customer')],
        stage: [_route.queryParamMap.get('stage'), [Validators.required]],
        projectCode: [_route.queryParamMap.get('projectCode')],
        projectName: [_route.queryParamMap.get('projectName')],
        model: [_route.queryParamMap.get('model'), [Validators.required]],
        docno: [_route.queryParamMap.get('docno')]
      });

      return forkJoin(
        this._service.getBus({
          where: {
            businessGroupId: _route.params['bg']
          }
        }),
        this._service.getPlants({
          where: {
            siteId: _route.params['site']
          }
        }),
        this._service.getModel({
          where: {
            SITE: this._service._checkNull(_route.params['site']),
            PLANT: this._service._checkNull(_route.params['plant']),
            CUSTOMER: this._service._checkNull(_route.params['customer']),
            PROJECTCODE: this._service._checkNull(_route.params['projectCode']),
            PROJECTNAME: this._service._checkNull(_route.params['projectName']),
            BG: this._service._checkNull(_route.params['bg']),
            BU: this._service._checkNull(_route.params['bu'])
          }
        }),
        of(this.meetinQuery)
      );

    } else {

      this.meetinQuery = this._fb.group({
        bg: [null, [Validators.required]],
        bu: [null, [Validators.required]],
        site: [null, [Validators.required]],
        plant: [null, [Validators.required]],
        customer: [null, [Validators.required]],
        stage: [null, [Validators.required]],
        projectCode: [null],
        projectName: [null],
        model: [null, [Validators.required]],
        docno: [null]
      });
    }

    return this.meetinQuery;
  }
}
