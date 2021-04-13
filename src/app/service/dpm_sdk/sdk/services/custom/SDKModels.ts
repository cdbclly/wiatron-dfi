/* tslint:disable */
import { Injectable } from '@angular/core';
import { USER } from '../../models/USER';
import { ACL } from '../../models/ACL';
import { ROLEMAPPING } from '../../models/ROLEMAPPING';
import { ROLE } from '../../models/ROLE';
import { APPLICATION } from '../../models/APPLICATION';
import { LINE } from '../../models/LINE';
import { LINEGROUP } from '../../models/LINEGROUP';
import { LineGroupMapping } from '../../models/LineGroupMapping';
import { LineKpiMapping } from '../../models/LineKpiMapping';
import { PlantGroupMapping } from '../../models/PlantGroupMapping';
import { DEPARTMENT } from '../../models/DEPARTMENT';
import { DEPARTMENTUSER } from '../../models/DEPARTMENTUSER';
import { ROLEUSERS } from '../../models/ROLEUSERS';
import { DPMUSERKPI } from '../../models/DPMUSERKPI';
import { DPMROLEKPI } from '../../models/DPMROLEKPI';
import { DPMKPI } from '../../models/DPMKPI';
import { DPMKPIBASELINE } from '../../models/DPMKPIBASELINE';
import { DPMKPITARGET } from '../../models/DPMKPITARGET';
import { DPMPRODUCTIVITY } from '../../models/DPMPRODUCTIVITY';
import { DPMPDTISSUEGROUP } from '../../models/DPMPDTISSUEGROUP';
import { DPMPDTISSUES } from '../../models/DPMPDTISSUES';
import { DPMALERT } from '../../models/DPMALERT';
import { DPMKPIWARNING } from '../../models/DPMKPIWARNING';
import { DPMKPIMFG } from '../../models/DPMKPIMFG';
import { DPMUPH } from '../../models/DPMUPH';
import { DPMUPPH } from '../../models/DPMUPPH';
import { DPMUPPHN } from '../../models/DPMUPPHN';
import { DPMFPYR } from '../../models/DPMFPYR';
import { DPMYRISSUE } from '../../models/DPMYRISSUE';
import { DPMOEEISSUEGROUP } from '../../models/DPMOEEISSUEGROUP';
import { DPMOEE } from '../../models/DPMOEE';
import { DPMOEEDETAIL } from '../../models/DPMOEEDETAIL';
import { DPMOEECHARGEHOUR } from '../../models/DPMOEECHARGEHOUR';
import { DPMOEELOSSHOUR } from '../../models/DPMOEELOSSHOUR';
import { DPMSTOPCODE } from '../../models/DPMSTOPCODE';
import { DPMSTOPCODEGROUP } from '../../models/DPMSTOPCODEGROUP';
import { DPMDLBUFFERRATIO } from '../../models/DPMDLBUFFERRATIO';
import { APINI } from '../../models/APINI';
import { IssueSummary } from '../../models/IssueSummary';
import { IssueStatus } from '../../models/IssueStatus';
import { DPMCSSR } from '../../models/DPMCSSR';
import { SITE } from '../../models/SITE';
import { PLANT } from '../../models/PLANT';
import { PLANTGROUP } from '../../models/PLANTGROUP';
import { FunctionGroup } from '../../models/FunctionGroup';
import { EVENT } from '../../models/EVENT';
import { DPMFPYRSTATION } from '../../models/DPMFPYRSTATION';
import { ModelFamily } from '../../models/ModelFamily';
import { Model } from '../../models/Model';
import { ModelSeries } from '../../models/ModelSeries';
import { Tip } from '../../models/Tip';
import { FpyrTip } from '../../models/FpyrTip';
import { FpyrByModelSeries } from '../../models/FpyrByModelSeries';
import { StageFpyrByModelSeries } from '../../models/StageFpyrByModelSeries';
import { OeeIssue } from '../../models/OeeIssue';
import { ProductivityIssue } from '../../models/ProductivityIssue';
import { ModelSeriesTarget } from '../../models/ModelSeriesTarget';
import { ModelSeriesBaseline } from '../../models/ModelSeriesBaseline';
import { DPMOEEGROUPTARGET } from '../../models/DPMOEEGROUPTARGET';
import { DPMOEELINETARGET } from '../../models/DPMOEELINETARGET';
import { DPMIDLTARGET } from '../../models/DPMIDLTARGET';
import { DPMOFFLINETARGET } from '../../models/DPMOFFLINETARGET';
import { MANPOWERQUOTAS } from '../../models/MANPOWERQUOTAS';
import { DEDUCTEDDEPARTMENT } from '../../models/DEDUCTEDDEPARTMENT';
import { DPMDLBUFFERRATIOGAP_ATTENDANCE } from '../../models/DPMDLBUFFERRATIOGAP_ATTENDANCE';
import { DPMDLBUFFERRATIOGAP_EMPLOYED } from '../../models/DPMDLBUFFERRATIOGAP_EMPLOYED';
import { UploadForOEE } from '../../models/UploadForOEE';
import { UploadForDL } from '../../models/UploadForDL';
import { UploadForIDL } from '../../models/UploadForIDL';
import { UploadForOFFLINE } from '../../models/UploadForOFFLINE';
import { Fpyr } from '../../models/Fpyr';
import { RepairDetail } from '../../models/RepairDetail';
import { RepairMaster } from '../../models/RepairMaster';
import { DPMDIRECTLABOR } from '../../models/DPMDIRECTLABOR';
import { DPMINDIRECTLABOR } from '../../models/DPMINDIRECTLABOR';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    USER: USER,
    ACL: ACL,
    ROLEMAPPING: ROLEMAPPING,
    ROLE: ROLE,
    APPLICATION: APPLICATION,
    LINE: LINE,
    LINEGROUP: LINEGROUP,
    LineGroupMapping: LineGroupMapping,
    LineKpiMapping: LineKpiMapping,
    PlantGroupMapping: PlantGroupMapping,
    DEPARTMENT: DEPARTMENT,
    DEPARTMENTUSER: DEPARTMENTUSER,
    ROLEUSERS: ROLEUSERS,
    DPMUSERKPI: DPMUSERKPI,
    DPMROLEKPI: DPMROLEKPI,
    DPMKPI: DPMKPI,
    DPMKPIBASELINE: DPMKPIBASELINE,
    DPMKPITARGET: DPMKPITARGET,
    DPMPRODUCTIVITY: DPMPRODUCTIVITY,
    DPMPDTISSUEGROUP: DPMPDTISSUEGROUP,
    DPMPDTISSUES: DPMPDTISSUES,
    DPMALERT: DPMALERT,
    DPMKPIWARNING: DPMKPIWARNING,
    DPMKPIMFG: DPMKPIMFG,
    DPMUPH: DPMUPH,
    DPMUPPH: DPMUPPH,
    DPMUPPHN: DPMUPPHN,
    DPMFPYR: DPMFPYR,
    DPMYRISSUE: DPMYRISSUE,
    DPMOEEISSUEGROUP: DPMOEEISSUEGROUP,
    DPMOEE: DPMOEE,
    DPMOEEDETAIL: DPMOEEDETAIL,
    DPMOEECHARGEHOUR: DPMOEECHARGEHOUR,
    DPMOEELOSSHOUR: DPMOEELOSSHOUR,
    DPMSTOPCODE: DPMSTOPCODE,
    DPMSTOPCODEGROUP: DPMSTOPCODEGROUP,
    DPMDLBUFFERRATIO: DPMDLBUFFERRATIO,
    APINI: APINI,
    IssueSummary: IssueSummary,
    IssueStatus: IssueStatus,
    DPMCSSR: DPMCSSR,
    SITE: SITE,
    PLANT: PLANT,
    PLANTGROUP: PLANTGROUP,
    FunctionGroup: FunctionGroup,
    EVENT: EVENT,
    DPMFPYRSTATION: DPMFPYRSTATION,
    ModelFamily: ModelFamily,
    Model: Model,
    ModelSeries: ModelSeries,
    Tip: Tip,
    FpyrTip: FpyrTip,
    FpyrByModelSeries: FpyrByModelSeries,
    StageFpyrByModelSeries: StageFpyrByModelSeries,
    OeeIssue: OeeIssue,
    ProductivityIssue: ProductivityIssue,
    ModelSeriesTarget: ModelSeriesTarget,
    ModelSeriesBaseline: ModelSeriesBaseline,
    DPMOEEGROUPTARGET: DPMOEEGROUPTARGET,
    DPMOEELINETARGET: DPMOEELINETARGET,
    DPMIDLTARGET: DPMIDLTARGET,
    DPMOFFLINETARGET: DPMOFFLINETARGET,
    MANPOWERQUOTAS: MANPOWERQUOTAS,
    DEDUCTEDDEPARTMENT: DEDUCTEDDEPARTMENT,
    DPMDLBUFFERRATIOGAP_ATTENDANCE: DPMDLBUFFERRATIOGAP_ATTENDANCE,
    DPMDLBUFFERRATIOGAP_EMPLOYED: DPMDLBUFFERRATIOGAP_EMPLOYED,
    UploadForOEE: UploadForOEE,
    UploadForDL: UploadForDL,
    UploadForIDL: UploadForIDL,
    UploadForOFFLINE: UploadForOFFLINE,
    Fpyr: Fpyr,
    RepairDetail: RepairDetail,
    RepairMaster: RepairMaster,
    DPMDIRECTLABOR: DPMDIRECTLABOR,
    DPMINDIRECTLABOR: DPMINDIRECTLABOR,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
