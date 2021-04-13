/* tslint:disable */
import { Injectable } from '@angular/core';
import { Site } from '../../models/Site';
import { Plant } from '../../models/Plant';
import { PlantModel } from '../../models/PlantModel';
import { Model } from '../../models/Model';
import { Project } from '../../models/Project';
import { ProfitCenter } from '../../models/ProfitCenter';
import { BusinessUnit } from '../../models/BusinessUnit';
import { BusinessGroup } from '../../models/BusinessGroup';
import { Product } from '../../models/Product';
import { Customer } from '../../models/Customer';
import { Email } from '../../models/Email';
import { Mail } from '../../models/Mail';
import { Workflow } from '../../models/Workflow';
import { WorkflowSign } from '../../models/WorkflowSign';
import { WorkflowCounterSign } from '../../models/WorkflowCounterSign';
import { Stage } from '../../models/Stage';
import { SiteModel } from '../../models/SiteModel';
import { ProjectStage } from '../../models/ProjectStage';
import { Container } from '../../models/Container';
import { WorkflowForm } from '../../models/WorkflowForm';
import { WorkflowFormMapping } from '../../models/WorkflowFormMapping';
import { WorkflowSignatory } from '../../models/WorkflowSignatory';
import { View_Workflow } from '../../models/View_Workflow';
import { View_WorkflowSign } from '../../models/View_WorkflowSign';
import { View_Model } from '../../models/View_Model';
import { View_WorkflowHistory } from '../../models/View_WorkflowHistory';
import { MailSchedule } from '../../models/MailSchedule';
import { PlantMapping } from '../../models/PlantMapping';
import { ProductTypeMapping } from '../../models/ProductTypeMapping';
import { Meeting } from '../../models/Meeting';
import { Attendance } from '../../models/Attendance';
import { TrackingIssue } from '../../models/TrackingIssue';
import { TrackingIssuePic } from '../../models/TrackingIssuePic';
import { FloorExecutionIssue } from '../../models/FloorExecutionIssue';
import { Company } from '../../models/Company';
import { ProcessCode } from '../../models/ProcessCode';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    Site: Site,
    Plant: Plant,
    PlantModel: PlantModel,
    Model: Model,
    Project: Project,
    ProfitCenter: ProfitCenter,
    BusinessUnit: BusinessUnit,
    BusinessGroup: BusinessGroup,
    Product: Product,
    Customer: Customer,
    Email: Email,
    Mail: Mail,
    Workflow: Workflow,
    WorkflowSign: WorkflowSign,
    WorkflowCounterSign: WorkflowCounterSign,
    Stage: Stage,
    SiteModel: SiteModel,
    ProjectStage: ProjectStage,
    Container: Container,
    WorkflowForm: WorkflowForm,
    WorkflowFormMapping: WorkflowFormMapping,
    WorkflowSignatory: WorkflowSignatory,
    View_Workflow: View_Workflow,
    View_WorkflowSign: View_WorkflowSign,
    View_Model: View_Model,
    View_WorkflowHistory: View_WorkflowHistory,
    MailSchedule: MailSchedule,
    PlantMapping: PlantMapping,
    ProductTypeMapping: ProductTypeMapping,
    Meeting: Meeting,
    Attendance: Attendance,
    TrackingIssue: TrackingIssue,
    TrackingIssuePic: TrackingIssuePic,
    FloorExecutionIssue: FloorExecutionIssue,
    Company: Company,
    ProcessCode: ProcessCode,
    
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
