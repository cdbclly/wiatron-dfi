/* tslint:disable */
import { Injectable } from '@angular/core';
import { USER } from '../../models/USER';
import { ACL } from '../../models/ACL';
import { Customer } from '../../models/Customer';
import { DesignItem } from '../../models/DesignItem';
import { Side } from '../../models/Side';
import { Point } from '../../models/Point';
import { Process } from '../../models/Process';
import { Operation } from '../../models/Operation';
import { Material } from '../../models/Material';
import { ProcessMaterial } from '../../models/ProcessMaterial';
import { ProcessOperation } from '../../models/ProcessOperation';
import { Risk } from '../../models/Risk';
import { FactRisk } from '../../models/FactRisk';
import { Fact } from '../../models/Fact';
import { FactLog } from '../../models/FactLog';
import { ProcessType } from '../../models/ProcessType';
import { Dimension } from '../../models/Dimension';
import { LessonLearned } from '../../models/LessonLearned';
import { ModelResult } from '../../models/ModelResult';
import { Part } from '../../models/Part';
import { PartDocument } from '../../models/PartDocument';
import { ModelDocument } from '../../models/ModelDocument';
import { Site } from '../../models/Site';
import { Plant } from '../../models/Plant';
import { PlantModel } from '../../models/PlantModel';
import { Model } from '../../models/Model';
import { Project } from '../../models/Project';
import { ProfitCenter } from '../../models/ProfitCenter';
import { BusinessUnit } from '../../models/BusinessUnit';
import { BusinessGroup } from '../../models/BusinessGroup';
import { Product } from '../../models/Product';
import { SiteModel } from '../../models/SiteModel';
import { Workflow } from '../../models/Workflow';
import { WorkflowSign } from '../../models/WorkflowSign';
import { WorkflowCounterSign } from '../../models/WorkflowCounterSign';
import { Stage } from '../../models/Stage';
import { ProjectStage } from '../../models/ProjectStage';
import { WorkflowForm } from '../../models/WorkflowForm';
import { WorkflowFormMapping } from '../../models/WorkflowFormMapping';
import { WorkflowSignatory } from '../../models/WorkflowSignatory';
import { View_ModelResult } from '../../models/View_ModelResult';
import { DocumentType } from '../../models/DocumentType';
import { Document } from '../../models/Document';
import { ProductDocument } from '../../models/ProductDocument';
import { Container } from '../../models/Container';
import { NewModelDocument } from '../../models/NewModelDocument';
import { V_PlantProject } from '../../models/V_PlantProject';
import { SendModel } from '../../models/SendModel';
import { PLM_allpart } from '../../models/PLM_allpart';
import { Member } from '../../models/Member';
import { ProjectNameProfile } from '../../models/ProjectNameProfile';
import { ProjectCodeProfile } from '../../models/ProjectCodeProfile';
import { NewMember } from '../../models/NewMember';
import { ProjectMember } from '../../models/ProjectMember';
import { PartNumber } from '../../models/PartNumber';
import { Vendor } from '../../models/Vendor';
import { Manufacturer } from '../../models/Manufacturer';
import { PartNumberVendor } from '../../models/PartNumberVendor';
import { ProjectStageSkipReason } from '../../models/ProjectStageSkipReason';
import { ProjectPartNumber } from '../../models/ProjectPartNumber';
import { PartNumberVendorOperation } from '../../models/PartNumberVendorOperation';
import { ManufacturerPIC } from '../../models/ManufacturerPIC';
import { SqmTargetYield } from '../../models/SqmTargetYield';
import { VendorTargetYield } from '../../models/VendorTargetYield';
import { PartNumberVendorRecord } from '../../models/PartNumberVendorRecord';
import { FactoryRecord } from '../../models/FactoryRecord';
import { SqmsIqcRecord } from '../../models/SqmsIqcRecord';
import { VendorRecord } from '../../models/VendorRecord';
import { YieldRateRecord } from '../../models/YieldRateRecord';
import { FactoryIssue } from '../../models/FactoryIssue';
import { VendorIssue } from '../../models/VendorIssue';
import { NuddItem } from '../../models/NuddItem';
import { PLM_allpart_Project } from '../../models/PLM_allpart_Project';
import { View_LatestTargetYield } from '../../models/View_LatestTargetYield';
import { ExternalUser } from '../../models/ExternalUser';
import { VendorDocument } from '../../models/VendorDocument';
import { VendorProductDocument } from '../../models/VendorProductDocument';
import { PartNumberVendorFile } from '../../models/PartNumberVendorFile';
import { View_ProjectPartNumberList } from '../../models/View_ProjectPartNumberList';
import { NuddRfqIgnore } from '../../models/NuddRfqIgnore';
import { View_PartNumberOverview } from '../../models/View_PartNumberOverview';
import { ProjectPartNumberForMaintain } from '../../models/ProjectPartNumberForMaintain';
import { PlantPartNumberConfig } from '../../models/PlantPartNumberConfig';
import { PlantCustomer } from '../../models/PlantCustomer';
import { VendorDocumentCategory } from '../../models/VendorDocumentCategory';
import { VendorDocumentSubCategory } from '../../models/VendorDocumentSubCategory';
import { PartNumberVendorFileRejectHistory } from '../../models/PartNumberVendorFileRejectHistory';
import { ProductTypeStageScore } from '../../models/ProductTypeStageScore';
import { View_PieChart } from '../../models/View_PieChart';
import { MaterialInput } from '../../models/MaterialInput';
import { MaterialRepair } from '../../models/MaterialRepair';
import { MaterialIssue } from '../../models/MaterialIssue';
import { MaterialYieldRate } from '../../models/MaterialYieldRate';
import { SqmsIqcData } from '../../models/SqmsIqcData';
import { View_ManufacturerMaterialYieldRate } from '../../models/View_ManufacturerMaterialYieldRate';
import { View_ProcessYieldRate } from '../../models/View_ProcessYieldRate';
import { View_MaterialYieldRateReport } from '../../models/View_MaterialYieldRateReport';
import { MaterialUsage } from '../../models/MaterialUsage';
import { IqcMatYrRankByUpdatedOn } from '../../models/IqcMatYrRankByUpdatedOn';
import { FactoryMatYrRankByMfgDate } from '../../models/FactoryMatYrRankByMfgDate';
import { VendorMatYrRankByMfgDate } from '../../models/VendorMatYrRankByMfgDate';
import { ProjectMaterialStatus } from '../../models/ProjectMaterialStatus';
import { ProjectStatus } from '../../models/ProjectStatus';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    USER: USER,
    ACL: ACL,
    Customer: Customer,
    DesignItem: DesignItem,
    Side: Side,
    Point: Point,
    Process: Process,
    Operation: Operation,
    Material: Material,
    ProcessMaterial: ProcessMaterial,
    ProcessOperation: ProcessOperation,
    Risk: Risk,
    FactRisk: FactRisk,
    Fact: Fact,
    FactLog: FactLog,
    ProcessType: ProcessType,
    Dimension: Dimension,
    LessonLearned: LessonLearned,
    ModelResult: ModelResult,
    Part: Part,
    PartDocument: PartDocument,
    ModelDocument: ModelDocument,
    Site: Site,
    Plant: Plant,
    PlantModel: PlantModel,
    Model: Model,
    Project: Project,
    ProfitCenter: ProfitCenter,
    BusinessUnit: BusinessUnit,
    BusinessGroup: BusinessGroup,
    Product: Product,
    SiteModel: SiteModel,
    Workflow: Workflow,
    WorkflowSign: WorkflowSign,
    WorkflowCounterSign: WorkflowCounterSign,
    Stage: Stage,
    ProjectStage: ProjectStage,
    WorkflowForm: WorkflowForm,
    WorkflowFormMapping: WorkflowFormMapping,
    WorkflowSignatory: WorkflowSignatory,
    View_ModelResult: View_ModelResult,
    DocumentType: DocumentType,
    Document: Document,
    ProductDocument: ProductDocument,
    Container: Container,
    NewModelDocument: NewModelDocument,
    V_PlantProject: V_PlantProject,
    SendModel: SendModel,
    PLM_allpart: PLM_allpart,
    Member: Member,
    ProjectNameProfile: ProjectNameProfile,
    ProjectCodeProfile: ProjectCodeProfile,
    NewMember: NewMember,
    ProjectMember: ProjectMember,
    PartNumber: PartNumber,
    Vendor: Vendor,
    Manufacturer: Manufacturer,
    PartNumberVendor: PartNumberVendor,
    ProjectStageSkipReason: ProjectStageSkipReason,
    ProjectPartNumber: ProjectPartNumber,
    PartNumberVendorOperation: PartNumberVendorOperation,
    ManufacturerPIC: ManufacturerPIC,
    SqmTargetYield: SqmTargetYield,
    VendorTargetYield: VendorTargetYield,
    PartNumberVendorRecord: PartNumberVendorRecord,
    FactoryRecord: FactoryRecord,
    SqmsIqcRecord: SqmsIqcRecord,
    VendorRecord: VendorRecord,
    YieldRateRecord: YieldRateRecord,
    FactoryIssue: FactoryIssue,
    VendorIssue: VendorIssue,
    NuddItem: NuddItem,
    PLM_allpart_Project: PLM_allpart_Project,
    View_LatestTargetYield: View_LatestTargetYield,
    ExternalUser: ExternalUser,
    VendorDocument: VendorDocument,
    VendorProductDocument: VendorProductDocument,
    PartNumberVendorFile: PartNumberVendorFile,
    View_ProjectPartNumberList: View_ProjectPartNumberList,
    NuddRfqIgnore: NuddRfqIgnore,
    View_PartNumberOverview: View_PartNumberOverview,
    ProjectPartNumberForMaintain: ProjectPartNumberForMaintain,
    PlantPartNumberConfig: PlantPartNumberConfig,
    PlantCustomer: PlantCustomer,
    VendorDocumentCategory: VendorDocumentCategory,
    VendorDocumentSubCategory: VendorDocumentSubCategory,
    PartNumberVendorFileRejectHistory: PartNumberVendorFileRejectHistory,
    ProductTypeStageScore: ProductTypeStageScore,
    View_PieChart: View_PieChart,
    MaterialInput: MaterialInput,
    MaterialRepair: MaterialRepair,
    MaterialIssue: MaterialIssue,
    MaterialYieldRate: MaterialYieldRate,
    SqmsIqcData: SqmsIqcData,
    View_ManufacturerMaterialYieldRate: View_ManufacturerMaterialYieldRate,
    View_ProcessYieldRate: View_ProcessYieldRate,
    View_MaterialYieldRateReport: View_MaterialYieldRateReport,
    MaterialUsage: MaterialUsage,
    IqcMatYrRankByUpdatedOn: IqcMatYrRankByUpdatedOn,
    FactoryMatYrRankByMfgDate: FactoryMatYrRankByMfgDate,
    VendorMatYrRankByMfgDate: VendorMatYrRankByMfgDate,
    ProjectMaterialStatus: ProjectMaterialStatus,
    ProjectStatus: ProjectStatus,
    
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
