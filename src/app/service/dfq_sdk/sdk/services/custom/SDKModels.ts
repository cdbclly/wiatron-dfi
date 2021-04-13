/* tslint:disable */
import { Injectable } from '@angular/core';
import { AccessToken } from '../../models/AccessToken';
import { ACL } from '../../models/ACL';
import { RoleMapping } from '../../models/RoleMapping';
import { Role } from '../../models/Role';
import { User } from '../../models/User';
import { Site } from '../../models/Site';
import { BusinessGroup } from '../../models/BusinessGroup';
import { Plant } from '../../models/Plant';
import { Customer } from '../../models/Customer';
import { BusinessUnit } from '../../models/BusinessUnit';
import { Stage } from '../../models/Stage';
import { NPICHECKLIST_EMT } from '../../models/NPICHECKLIST_EMT';
import { NPIMODEL } from '../../models/NPIMODEL';
import { NPITEAMMEMBERHEAD } from '../../models/NPITEAMMEMBERHEAD';
import { NPITEAMMEMBERLIST } from '../../models/NPITEAMMEMBERLIST';
import { NPICHECKLIST_EM_HEAD } from '../../models/NPICHECKLIST_EM_HEAD';
import { NPICHECKLIST_EM } from '../../models/NPICHECKLIST_EM';
import { ExitMeetingResult } from '../../models/ExitMeetingResult';
import { CheckListLog } from '../../models/CheckListLog';
import { View_ModelResult } from '../../models/View_ModelResult';
import { ModelMaterial } from '../../models/ModelMaterial';
import { ModelMaterialPart } from '../../models/ModelMaterialPart';
import { Material } from '../../models/Material';
import { Factor } from '../../models/Factor';
import { FactorType } from '../../models/FactorType';
import { View_ModelMaterial } from '../../models/View_ModelMaterial';
import { ModelMaterialUpload } from '../../models/ModelMaterialUpload';
import { View_ModelMaterialUpload } from '../../models/View_ModelMaterialUpload';
import { Discussion } from '../../models/Discussion';
import { ModelMaterialFactor } from '../../models/ModelMaterialFactor';
import { View_ModelYieldRate } from '../../models/View_ModelYieldRate';
import { ProjectPart } from '../../models/ProjectPart';
import { Part } from '../../models/Part';
import { View_ModelMaterialPart } from '../../models/View_ModelMaterialPart';
import { SFCDEFECTRATEDATA } from '../../models/SFCDEFECTRATEDATA';
import { View_SFCDEFECTRATEDATA } from '../../models/View_SFCDEFECTRATEDATA';
import { View_SfcModelMateiral } from '../../models/View_SfcModelMateiral';
import { ModelSchedule } from '../../models/ModelSchedule';
import { View_MassProduction } from '../../models/View_MassProduction';
import { View_ModelSchedule } from '../../models/View_ModelSchedule';
import { View_RfiDashboard } from '../../models/View_RfiDashboard';
import { View_Part } from '../../models/View_Part';
import { ProjectCodeProfile } from '../../models/ProjectCodeProfile';
import { ProjectMember } from '../../models/ProjectMember';
import { Member } from '../../models/Member';
import { PlantMapping } from '../../models/PlantMapping';
import { PcSchedule } from '../../models/PcSchedule';
import { SendEmail } from '../../models/SendEmail';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    AccessToken: AccessToken,
    ACL: ACL,
    RoleMapping: RoleMapping,
    Role: Role,
    User: User,
    Site: Site,
    BusinessGroup: BusinessGroup,
    Plant: Plant,
    Customer: Customer,
    BusinessUnit: BusinessUnit,
    Stage: Stage,
    NPICHECKLIST_EMT: NPICHECKLIST_EMT,
    NPIMODEL: NPIMODEL,
    NPITEAMMEMBERHEAD: NPITEAMMEMBERHEAD,
    NPITEAMMEMBERLIST: NPITEAMMEMBERLIST,
    NPICHECKLIST_EM_HEAD: NPICHECKLIST_EM_HEAD,
    NPICHECKLIST_EM: NPICHECKLIST_EM,
    ExitMeetingResult: ExitMeetingResult,
    CheckListLog: CheckListLog,
    View_ModelResult: View_ModelResult,
    ModelMaterial: ModelMaterial,
    ModelMaterialPart: ModelMaterialPart,
    Material: Material,
    Factor: Factor,
    FactorType: FactorType,
    View_ModelMaterial: View_ModelMaterial,
    ModelMaterialUpload: ModelMaterialUpload,
    View_ModelMaterialUpload: View_ModelMaterialUpload,
    Discussion: Discussion,
    ModelMaterialFactor: ModelMaterialFactor,
    View_ModelYieldRate: View_ModelYieldRate,
    ProjectPart: ProjectPart,
    Part: Part,
    View_ModelMaterialPart: View_ModelMaterialPart,
    SFCDEFECTRATEDATA: SFCDEFECTRATEDATA,
    View_SFCDEFECTRATEDATA: View_SFCDEFECTRATEDATA,
    View_SfcModelMateiral: View_SfcModelMateiral,
    ModelSchedule: ModelSchedule,
    View_MassProduction: View_MassProduction,
    View_ModelSchedule: View_ModelSchedule,
    View_RfiDashboard: View_RfiDashboard,
    View_Part: View_Part,
    ProjectCodeProfile: ProjectCodeProfile,
    ProjectMember: ProjectMember,
    Member: Member,
    PlantMapping: PlantMapping,
    PcSchedule: PcSchedule,
    SendEmail: SendEmail,
    
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
