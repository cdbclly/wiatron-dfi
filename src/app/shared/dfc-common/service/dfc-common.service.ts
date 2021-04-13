import { ModelTypeProcessSetting } from './../../../service/dfc_sdk/sdk/models/ModelTypeProcessSetting';
import { Injectable } from '@angular/core';
import { ModelTypeProcessSettingApi, ModelTypeProcessSettingInterface, V_ProjectSummaryApi, ProjectNameProfileApi, ProjectCodeProfileApi, MemberApi, BasicModelApi, GroupModelApi, BasicModel, GroupModel } from '@service/dfc_sdk/sdk';
import { map, switchMap } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DfcCommonService {

  constructor(
    private _modelTypeProcessSettings: ModelTypeProcessSettingApi,
    private _projectSummaryApi: V_ProjectSummaryApi,
    private projectNameProfileServer: ProjectNameProfileApi,
    private projectCodeProfileServer: ProjectCodeProfileApi,
    private memberApi: MemberApi,
    private basicModelApi: BasicModelApi,
    private groupModelApi: GroupModelApi

  ) { }

  getProjectCodeProfile(groupProjectCode) {
    return this.projectCodeProfileServer.find({
      'where': { 'ProjectCodeID': { 'inq': groupProjectCode } }
    });
  }

  getProcess(plant, modelType) {
    const query: any = {
      where: {
      }
    };
    if (typeof (plant) === 'string' && plant) {
      query.where.plant = { inq: [plant] };
    } else if (plant.length > 0) {
      query.where.plant = { inq: plant.filter((filterItem) => !!filterItem) };
    }
    if (!modelType) {
    } else if (typeof (modelType) === 'string') {
      query.where.modelType = { inq: [modelType] };
    } else if (modelType.length > 0) {
      query.where.modelType = { inq: modelType.filter((filterItem) => !!filterItem) };
    }
    return this._modelTypeProcessSettings.find<ModelTypeProcessSetting>(
      query
    );
  }

  getProcessForFilter = (orgProcessSelectOption, plant, modelType) => switchMap(
    (resOrigin) => {
      let processSelectOption = [];
      return this._modelTypeProcessSettings.find(
        {
          where: {
            plant: plant ? plant : undefined,
            modelType: modelType ? modelType : undefined
          }
        }
      ).pipe(
        map((res: ModelTypeProcessSettingInterface[]) => {
          if (res.length === 0) {
            processSelectOption.length = 0;
          } else {
            processSelectOption = orgProcessSelectOption.filter(
              (item: { Label: string, Value: string }) => {
                return res[0].processCode.includes(item.Value);
              }
            );
          }
          return { res: resOrigin, process: processSelectOption };
        }));
    })

  getProjectName(plant, modelType?, projectNameIDs?, Customer?, BU?, Status?: boolean) {
    const where = {
      'fields': [
        'Plant', 'Customer', 'ModelType', 'ProjectCodeID', 'ProjectCode', 'ProjectNameID', 'ProjectName'
        , 'StageID', 'Stage', 'BU', 'Customer', 'ModelType', 'CurrentStage'
      ],
      'where': {
        'Plant': { inq: plant.filter((filterItem) => !!filterItem) },
        'CurrentStage': { 'neq': 'EX' }
      }
    };
    if (modelType && modelType.length > 0) {
      where.where['ModelType'] = { inq: modelType.filter((filterItem) => !!filterItem) };
    }
    if (projectNameIDs && projectNameIDs.length > 0) {
      where.where['ProjectNameID'] = { inq: projectNameIDs.filter((filterItem) => !!filterItem) };
    }
    if (Customer && Customer.length > 0) {
      where.where['Customer'] = { inq: Customer.filter((filterItem) => !!filterItem) };
    }
    if (BU && BU.length > 0) {
      where.where['BU'] = { inq: BU.filter((filterItem) => !!filterItem) };
    }
    if (Status) {
      where.where['Status'] = 0;
    }
    return this._projectSummaryApi.find(where);
  }

  filterProjectName(bu, customer, modelType, projectNameList) {
    const filterBu = bu.filter((filterItem) => !!filterItem);
    const filterCustomer = customer.filter((filterItem) => !!filterItem);
    const filterModelType = modelType.filter((filterItem) => !!filterItem);
    const allList = projectNameList.filter(
      (item) => {
        const buRule = filterBu.length > 0 ? filterBu.includes(item['BU']) : true;
        const customerRule = filterCustomer.length > 0 ? filterCustomer.includes(item['Customer']) : true;
        const modelTypeRule = filterModelType.length > 0 ? filterModelType.includes(item['ModelType']) : true;
        return (buRule && customerRule && modelTypeRule);
      }
    );
    const listOfUserGroups = allList.reduce((acc, it) => {
      const filterIncluds = acc.filter(
        (item) => {
          return item.ProjectName === it.ProjectName;
        }
      );
      if (filterIncluds.length > 1) {
        return acc;
      }
      return [...acc, it];
    }, []);
    const query = {
      'where': {
        'ProjectNameID': {
          'inq': listOfUserGroups.map(item => item.ProjectNameID)
        }
      }
    };
    return this.projectNameProfileServer.find(query).pipe(
      map(
        (res) => {
          return res.map(
            (item) => {
              return {
                Value: item['ProjectNameID'],
                Label: item['ProjectName'],
                IsRfq: item['IsRfq'],
                ProCodeID: item['ProjectCodeID'],
                IsPLMProject: item['IsPLMProject'],
                RfqProjectCode: item['RfqProjectCode'],
                RfqProjectName: item['RfqProjectName']
              };
            }
          );
        }
      )
    );
  }

  // 判斷是否是 DFI Leader權限
  DFILeader(): Observable<any> {
    return this.memberApi.findById(localStorage.getItem('$DFI$userID'));
  }

  getModel(where): Observable<BasicModel[]> {
    return this.basicModelApi.find(
      {
        where: where,
        include: { 'projectNameProfile': 'projectCodeProfile' }
      }
    );
  }

  getGroupModel(where): Observable<GroupModel[]> {
    return this.groupModelApi.find(
      {
        where: where,
        include: { 'projectNameProfile': 'projectCodeProfile' }
      }
    );
  }

  getMappingModelName(projectNameId) {
    return forkJoin(
      this.getModel({ 'projectNameId': { 'inq': projectNameId } }),
      this.getGroupModel({ 'projectNameId': { 'inq': projectNameId } })
    ).pipe(
      map(
        (models) => {
          models[0].forEach(
            (item) => {
              item['type'] = 1;
            }
          );
          models[1].forEach(
            (item) => {
              item['modelName'] = item.groupModelName;
              item['modelId'] = item.groupModelId;
              item['type'] = 2;
            }
          );
          return [].concat.apply([], models);
        }
      )
    );
  }
}
