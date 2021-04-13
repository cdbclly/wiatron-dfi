/* tslint:disable */
import { Injectable } from '@angular/core';
import { KPI } from '../../models/KPI';
import { Section } from '../../models/Section';
import { Line } from '../../models/Line';
import { Station } from '../../models/Station';
import { TestItemMap } from '../../models/TestItemMap';
import { StageMap } from '../../models/StageMap';
import { KPI_log } from '../../models/KPI_log';
import { LightBar } from '../../models/LightBar';
import { LightBar_Log } from '../../models/LightBar_Log';
import { Moroute } from '../../models/Moroute';
import { Recipient } from '../../models/Recipient';
import { Recipient_Log } from '../../models/Recipient_Log';
import { Spc_Maintain } from '../../models/Spc_Maintain';
import { Spc_Maintain_Log } from '../../models/Spc_Maintain_Log';
import { Wcq_Screw_Parameter } from '../../models/Wcq_Screw_Parameter';
import { Wcq_Screw_Parameter_Log } from '../../models/Wcq_Screw_Parameter_Log';
import { CTQ } from '../../models/CTQ';
import { CTQ_log } from '../../models/CTQ_log';
import { Skyeye_ctq_spc_cl_list } from '../../models/Skyeye_ctq_spc_cl_list';
import { ToolsVersion } from '../../models/ToolsVersion';
import { ToolsVersion_log } from '../../models/ToolsVersion_log';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    KPI: KPI,
    Section: Section,
    Line: Line,
    Station: Station,
    TestItemMap: TestItemMap,
    StageMap: StageMap,
    KPI_log: KPI_log,
    LightBar: LightBar,
    LightBar_Log: LightBar_Log,
    Moroute: Moroute,
    Recipient: Recipient,
    Recipient_Log: Recipient_Log,
    Spc_Maintain: Spc_Maintain,
    Spc_Maintain_Log: Spc_Maintain_Log,
    Wcq_Screw_Parameter: Wcq_Screw_Parameter,
    Wcq_Screw_Parameter_Log: Wcq_Screw_Parameter_Log,
    CTQ: CTQ,
    CTQ_log: CTQ_log,
    Skyeye_ctq_spc_cl_list: Skyeye_ctq_spc_cl_list,
    ToolsVersion: ToolsVersion,
    ToolsVersion_log: ToolsVersion_log,
    
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
