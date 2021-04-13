/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Stage } from '../../models/Stage';
import { ModelOperations } from '../../models/ModelOperations';
import { TargetOperations } from '../../models/TargetOperations';
import { ModelOperationsLog } from '../../models/ModelOperationsLog';
import { Process } from '../../models/Process';
import { Material } from '../../models/Material';
import { Factor } from '../../models/Factor';
import { FactorDetail } from '../../models/FactorDetail';
import { Action } from '../../models/Action';
import { StandardOperationTime } from '../../models/StandardOperationTime';
import { Member } from '../../models/Member';
import { MOHCondition } from '../../models/MOHCondition';
import { MOHAddition } from '../../models/MOHAddition';
import { MOH } from '../../models/MOH';
import { MOHLog } from '../../models/MOHLog';
import { Authority } from '../../models/Authority';
import { Group } from '../../models/Group';
import { ProjectCodeProfile } from '../../models/ProjectCodeProfile';
import { ProjectNameProfile } from '../../models/ProjectNameProfile';
import { ProjectMember } from '../../models/ProjectMember';
import { ModelOperationTime } from '../../models/ModelOperationTime';
import { EmailModel } from '../../models/EmailModel';
import { MOHDefaultCondition } from '../../models/MOHDefaultCondition';
import { Upload } from '../../models/Upload';
import { Opm_month } from '../../models/Opm_month';
import { Opm_finbasic } from '../../models/Opm_finbasic';
import { Opm_r3 } from '../../models/Opm_r3';
import { PlantMapping } from '../../models/PlantMapping';
import { MOHPlant } from '../../models/MOHPlant';
import { V_StanderOperation } from '../../models/V_StanderOperation';
import { ModelTypeMapping } from '../../models/ModelTypeMapping';
import { OperationLog } from '../../models/OperationLog';
import { ModuleMapping } from '../../models/ModuleMapping';
import { BU } from '../../models/BU';
import { Workflow } from '../../models/Workflow';
import { WorkflowSign } from '../../models/WorkflowSign';
import { MilitaryOrderSign } from '../../models/MilitaryOrderSign';
import { TargetOperationSign } from '../../models/TargetOperationSign';
import { DfiProject } from '../../models/DfiProject';
import { StandardOperationSign } from '../../models/StandardOperationSign';
import { StandardOperationSignContent } from '../../models/StandardOperationSignContent';
import { RewardSign } from '../../models/RewardSign';
import { ModelTypeProcessSetting } from '../../models/ModelTypeProcessSetting';
import { WorkflowForm } from '../../models/WorkflowForm';
import { WorkflowFormMapping } from '../../models/WorkflowFormMapping';
import { WorkflowSignatory } from '../../models/WorkflowSignatory';
import { V_ProjectSummary } from '../../models/V_ProjectSummary';
import { V_ProjectSelect } from '../../models/V_ProjectSelect';
import { View_Workflow } from '../../models/View_Workflow';
import { BasicModel } from '../../models/BasicModel';
import { GroupModel } from '../../models/GroupModel';
import { GroupModelMapping } from '../../models/GroupModelMapping';
import { DataVerification } from '../../models/DataVerification';
import { MOHGap } from '../../models/MOHGap';
import { OperationTimeGap } from '../../models/OperationTimeGap';
import { UiPage } from '../../models/UiPage';
import { KpiReportCache } from '../../models/KpiReportCache';
import { DashboardIgnoredProject } from '../../models/DashboardIgnoredProject';
import { ProjectModule } from '../../models/ProjectModule';
import { Product } from '../../models/Product';
import { ProductTypeMapping } from '../../models/ProductTypeMapping';
import { DfcDashboard } from '../../models/DfcDashboard';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    Stage: Stage,
    ModelOperations: ModelOperations,
    TargetOperations: TargetOperations,
    ModelOperationsLog: ModelOperationsLog,
    Process: Process,
    Material: Material,
    Factor: Factor,
    FactorDetail: FactorDetail,
    Action: Action,
    StandardOperationTime: StandardOperationTime,
    Member: Member,
    MOHCondition: MOHCondition,
    MOHAddition: MOHAddition,
    MOH: MOH,
    MOHLog: MOHLog,
    Authority: Authority,
    Group: Group,
    ProjectCodeProfile: ProjectCodeProfile,
    ProjectNameProfile: ProjectNameProfile,
    ProjectMember: ProjectMember,
    ModelOperationTime: ModelOperationTime,
    EmailModel: EmailModel,
    MOHDefaultCondition: MOHDefaultCondition,
    Upload: Upload,
    Opm_month: Opm_month,
    Opm_finbasic: Opm_finbasic,
    Opm_r3: Opm_r3,
    PlantMapping: PlantMapping,
    MOHPlant: MOHPlant,
    V_StanderOperation: V_StanderOperation,
    ModelTypeMapping: ModelTypeMapping,
    OperationLog: OperationLog,
    ModuleMapping: ModuleMapping,
    BU: BU,
    Workflow: Workflow,
    WorkflowSign: WorkflowSign,
    MilitaryOrderSign: MilitaryOrderSign,
    TargetOperationSign: TargetOperationSign,
    DfiProject: DfiProject,
    StandardOperationSign: StandardOperationSign,
    StandardOperationSignContent: StandardOperationSignContent,
    RewardSign: RewardSign,
    ModelTypeProcessSetting: ModelTypeProcessSetting,
    WorkflowForm: WorkflowForm,
    WorkflowFormMapping: WorkflowFormMapping,
    WorkflowSignatory: WorkflowSignatory,
    V_ProjectSummary: V_ProjectSummary,
    V_ProjectSelect: V_ProjectSelect,
    View_Workflow: View_Workflow,
    BasicModel: BasicModel,
    GroupModel: GroupModel,
    GroupModelMapping: GroupModelMapping,
    DataVerification: DataVerification,
    MOHGap: MOHGap,
    OperationTimeGap: OperationTimeGap,
    UiPage: UiPage,
    KpiReportCache: KpiReportCache,
    DashboardIgnoredProject: DashboardIgnoredProject,
    ProjectModule: ProjectModule,
    Product: Product,
    ProductTypeMapping: ProductTypeMapping,
    DfcDashboard: DfcDashboard,
    
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
