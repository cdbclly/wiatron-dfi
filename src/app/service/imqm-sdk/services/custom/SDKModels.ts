/* tslint:disable */
import { Injectable } from '@angular/core';
import { EarlyWarning } from '../../models/EarlyWarning';
import { Abnormal } from '../../models/Abnormal';
import { DRMonthlyAverage } from '../../models/DRMonthlyAverage';
import { EmailMaintain } from '../../models/EmailMaintain';
import { YieldRate } from '../../models/YieldRate';
import { SelectMenu } from '../../models/SelectMenu';
import { TraceBack } from '../../models/TraceBack';
import { NumberOfStops } from '../../models/NumberOfStops';
import { ParameterSetting } from '../../models/ParameterSetting';
import { Group } from '../../models/Group';
import { GroupMappingRole } from '../../models/GroupMappingRole';
import { FunctionRole } from '../../models/FunctionRole';
import { UserInfo } from '../../models/UserInfo';
import { RawData } from '../../models/RawData';
import { DRate } from '../../models/DRate';
import { SavingInformation } from '../../models/SavingInformation';
import { VendorSavingInformationInfo } from '../../models/VendorSavingInformationInfo';
import { Email } from '../../models/Email';
import { TraceBackReply } from '../../models/TraceBackReply';
import { SummaryRate } from '../../models/SummaryRate';
import { SavingInformationDay } from '../../models/SavingInformationDay';
import { VendorSavingInformationInfoDay } from '../../models/VendorSavingInformationInfoDay';
import { ParameterSettingLog } from '../../models/ParameterSettingLog';
import { RawDataTemp } from '../../models/RawDataTemp';
import { SavingInformationMachine } from '../../models/SavingInformationMachine';
import { IMQMCSN } from '../../models/IMQMCSN';
import { InputInfo } from '../../models/InputInfo';
import { SelectMenuLog } from '../../models/SelectMenuLog';
import { TestItemGroup } from '../../models/TestItemGroup';
import { TestItemDetail } from '../../models/TestItemDetail';
import { FakeRawdata } from '../../models/FakeRawdata';
import { V_MRR_BYLAW_DIMENSION_IMAGE } from '../../models/V_MRR_BYLAW_DIMENSION_IMAGE';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    EarlyWarning: EarlyWarning,
    Abnormal: Abnormal,
    DRMonthlyAverage: DRMonthlyAverage,
    EmailMaintain: EmailMaintain,
    YieldRate: YieldRate,
    SelectMenu: SelectMenu,
    TraceBack: TraceBack,
    NumberOfStops: NumberOfStops,
    ParameterSetting: ParameterSetting,
    Group: Group,
    GroupMappingRole: GroupMappingRole,
    FunctionRole: FunctionRole,
    UserInfo: UserInfo,
    RawData: RawData,
    DRate: DRate,
    SavingInformation: SavingInformation,
    VendorSavingInformationInfo: VendorSavingInformationInfo,
    Email: Email,
    TraceBackReply: TraceBackReply,
    SummaryRate: SummaryRate,
    SavingInformationDay: SavingInformationDay,
    VendorSavingInformationInfoDay: VendorSavingInformationInfoDay,
    ParameterSettingLog: ParameterSettingLog,
    RawDataTemp: RawDataTemp,
    SavingInformationMachine: SavingInformationMachine,
    IMQMCSN: IMQMCSN,
    InputInfo: InputInfo,
    SelectMenuLog: SelectMenuLog,
    TestItemGroup: TestItemGroup,
    TestItemDetail: TestItemDetail,
    FakeRawdata: FakeRawdata,
    V_MRR_BYLAW_DIMENSION_IMAGE: V_MRR_BYLAW_DIMENSION_IMAGE,
    
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
