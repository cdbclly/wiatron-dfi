import { WorkflowFormApi, WorkflowApi, WorkflowSignApi } from '@service/dfi-sdk';
import { DiscussionInterface } from './../../../service/dfq_sdk/sdk/models/Discussion';
import { HttpClient } from '@angular/common/http';
import { ProjectPartApi, View_ModelYieldRateApi, View_ModelMaterialPartApi, ModelMaterialFactorApi, ModelMaterialApi, FactorTypeApi, FactorApi, View_ModelMaterialApi, DiscussionApi, View_ModelMaterialUploadApi } from '@service/dfq_sdk/sdk';
import { Injectable, Inject } from '@angular/core';
import { UserApi } from '@service/portal/sdk';
import { LoopBackAuth as UserLoopBackAuth } from '@service/portal/sdk/services/core/auth.service';
import { Subject } from 'rxjs';
import { ProjectCodeProfileApi } from '@service/dfc_sdk/sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class YrGenerateService {
  factorIds = [];
  esUrl: string;

  constructor(
    @Inject(UserLoopBackAuth) protected UserAuth: UserLoopBackAuth,
    private modelMaterialService: ModelMaterialApi,
    private factorTypeService: FactorTypeApi,
    private view_ModelMaterialService: View_ModelMaterialApi,
    private view_ModelMaterialUpService: View_ModelMaterialUploadApi,
    private view_ModelMaterialPartService: View_ModelMaterialPartApi,
    private http: HttpClient,
    private discussService: DiscussionApi,
    private factorService: FactorApi,
    private modelMaterialFactorService: ModelMaterialFactorApi,
    private workflowFormService: WorkflowFormApi,
    private workflowService: WorkflowApi,
    private workflowSignService: WorkflowSignApi,
    private view_ModelYieldRateService: View_ModelYieldRateApi,
    private userService: UserApi,
    private projectPartService: ProjectPartApi,
    private projectCodeProfileApi: ProjectCodeProfileApi
  ) {
    this.esUrl = localStorage.getItem('RFI_ES_URL');
  }

  public scrollSub = new Subject<any>();

  // 所有BA機種上傳物料因子組合 給預測RFQ機種良率參考（Rfi物料因子維護使用）
  getRFiBAModel(Plant?, ModelType?, Customer?, Status?) {
    const query: any = {
      where: {
        and: []
      },
      include: [{
        relation: 'projectNames',
        include: ['projectModules']
      }]
    };
    if (Plant) {
      query.where.and.push({ Plant: Plant });
    }
    if (ModelType) {
      query.where.and.push({ ModelType: ModelType });
    }
    if (Customer) {
      query.where.and.push({ Customer: Customer });
    }
    query.where.and.push({ IsRfq: 0 });
    return this.projectCodeProfileApi.find(query).pipe(map(projectCodeProfile => {
      const projectModel = projectCodeProfile.reduce((p, t) => {
        if (t['projectNames'] && t['projectNames'].length > 0) {
          t['projectNames'].forEach(item => {
            if (!p['model'].includes(item['ProjectName'])) {
              p['model'].push(item['ProjectName']);
            }
            if (!p['project'].includes(item['ProjectCode'])) {
              p['project'].push(item['ProjectCode']);
            }
          });
        }
        return p;
      }, { model: [], project: [] });
      return {
        ProjectCodeProfile: projectCodeProfile,
        ProjectModel: projectModel
      };
    }));
  }
  // 新機種信息維護 添加DFQ流程后 對RFi模組的機種進行過濾（RFi模組全局使用）
  getRFiModel(Plant?, ModelType?, Customer?, Status?) {
    const query: any = {
      where: {
        and: []
      },
      include: [{
        relation: 'projectNames',
        include: ['projectModules'],
        where: {
          moduleName: 'rfi',
          enabled: true
        }
      }]
    };
    if (Plant) {
      query.where.and.push({ Plant: Plant });
    }
    if (ModelType) {
      query.where.and.push({ ModelType: ModelType });
    }
    if (Customer) {
      query.where.and.push({ Customer: Customer });
    }
    return this.projectCodeProfileApi.find(query).pipe(map(projectCodeProfile => {
      const projectModel = projectCodeProfile.reduce((p, t) => {
        if (t['projectNames'] && t['projectNames'].length > 0) {
          t['projectNames'].forEach(item => {
            if (!p['model'].includes(item['ProjectName'])) {
              p['model'].push(item['ProjectName']);
            }
            if (!p['project'].includes(item['ProjectCode'])) {
              p['project'].push(item['ProjectCode']);
            }
          });
        }
        return p;
      }, { model: [], project: [] });
      return {
        ProjectCodeProfile: projectCodeProfile,
        ProjectModel: projectModel
      };
    }));
  }

  updateProjectPart(id, form) {
    return this.projectPartService.patchAttributes(id, form);
  }

  getChartData(site, plant, model, product) {
    return this.view_ModelYieldRateService.find({
      where: {
        site: site,
        plant: plant,
        model: model,
        product: product
      }
    });
  }

  // 設置token
  setToken() {
    const userInfo = localStorage.getItem('$DFI$setToken');
    this.userService.login(userInfo)
      .subscribe(
        res => {
          this.UserAuth.setToken(res);
        });

  }

  findUser(id) {
    return this.userService.find({ where: { userName: id } });
  }

  findUserById(id) {
    return this.userService.findById(id);
  }

  findUserByuserId(id) {
    return this.userService.find({
      where: {
        EmpID: id
      }
    });
  }

  getDiscussionByMId(modelMaterialId) {
    return this.discussService.findOne({
      where: {
        modelMaterialId: modelMaterialId
      }
    });
  }

  getFlowStatusByDes(desc) {
    return this.workflowService.find({
      where: {
        desc: desc
      },
      order: 'id DESC'
    });
  }

  getFirstFlowSignByFlowId(workflowId) {
    return this.workflowSignService.find({
      where: {
        workflowId: workflowId,
        previousWorkflowSignId: null
      }
    });
  }

  getSigner(key) {
    return this.workflowFormService.find({
      where: {
        name: 'DFQ0004'
      },
      include: {
        relation: 'workflowFormMappings',
        scope: {
          where: {
            key: key
          },
          include: {
            relation: 'workflowSignatories',
            scope: {
              where: {
                isDynamic: 0
              },
              order: 'stage ASC'
            }
          }
        }
      }
    });
  }


  getBaseDataSigner(key) {
    return this.workflowFormService.find({
      where: {
        name: 'DFQ0003'
      },
      include: {
        relation: 'workflowFormMappings',
        scope: {
          where: {
            key: key
          },
          include: {
            relation: 'workflowSignatories',
            scope: {
              where: {
                isDynamic: 0
              },
              order: 'stage ASC'
            }
          }
        }
      }
    });
  }

  getMBYieldForm() {
    return this.workflowFormService.find({
      where: {
        name: 'DFQ0005'
      }
    });
  }

  getMbDataByModel(model) {
    return this.view_ModelMaterialPartService.find({
      where: {
        modelId: model
      }
    });
  }

  getHistory(materialId, modelId, site, plant) {
    return this.modelMaterialService.find({
      where: {
        materialId: materialId,
        modelId: modelId,
        siteId: site,
        plantId: plant
      },
      include: {
        relation: 'discussion'
      },
      order: 'id ASC'
    });
  }

  addModelMaterial(form) {
    return this.modelMaterialService.create(form);
  }

  updateModelMaterial(id, form) {
    return this.modelMaterialService.patchAttributes(id, form);
  }

  addDiscussion(form) {
    return this.discussService.create(form);
  }

  getModelUploadByMaterialId(materialId, sitePlant?) {
    if (sitePlant) {
      const site = sitePlant.split('-')[0];
      const plant = sitePlant.split('-')[1];
      return this.view_ModelMaterialUpService.find({
        where: {
          materialId: materialId,
          status: '1',
          site: site,
          plant: plant
        },
        order: 'yieldRate DESC'
      });
    } else {
      return this.view_ModelMaterialUpService.find({
        where: {
          materialId: materialId,
          status: '1'
        },
        order: 'yieldRate DESC'
      });
    }
  }

  getModelUpload(id) {
    return this.view_ModelMaterialUpService.find({
      where: {
        id: id,
        status: '1'
      }
    });
  }

  getModelUploadByIds(ids) {
    return this.view_ModelMaterialUpService.find({
      where: {
        id: { inq: ids },
        status: '1'
      },
      order: 'yieldRate DESC'
    });
  }

  addFactorsRelation(form) {
    return this.modelMaterialFactorService.upsert(form);
  }

  getModelMaterial(model, sitePlant) {
    const site = sitePlant.split('-')[0];
    const plant = sitePlant.split('-')[1];
    return this.view_ModelMaterialService.find({
      where: {
        site: site,
        plant: plant,
        modelId: model
      },
      include: {
        relation: 'material'
      },
      order: 'status,yieldRate,materialId ASC'
    });
  }

  getPreFactors(id) {
    return this.modelMaterialFactorService.find({
      where: {
        modelMaterialId: id
      },
      include: {
        relation: 'factor',
        scope: {
          include: {
            relation: 'factorType'
          }
        }
      },
      order: 'id ASC'
    });
  }

  getEsByModelMaterialId(id) {
    const query = `{
      "query": {
        "bool": {
          "should": {
            "match": {
              "modelMaterialId": ${id}
            }
          }
        }
      }
    }`;
    const url = `${this.esUrl}/_search`;
    let header;
    header = `'Content-Type', 'application/x-www-form-urlencoded'`;
    return this.http.post(url, query, { headers: header });
  }

  getEsByFactorIds(factorIds) {
    this.factorIds.length = 0;
    const query = `{
      "query": {
        "bool": {
          "should":{
              "terms":{
                "factors": [${factorIds}]
              }
          }
        }
      }
    }`;
    const url = `${this.esUrl}/_search`;
    let header;
    header = `'Content-Type', 'application/x-www-form-urlencoded'`;
    return this.http.post(url, query, { headers: header });
  }

  addEsData(id, factorIds) {
    const url = `${this.esUrl}`;
    const body = `{
  "factors": [${factorIds}],
  "modelMaterialId": ${id}
  }`;
    let header;
    header = `'Content-Type', 'application/x-www-form-urlencoded'`;
    return this.http.post(url, body, { headers: header });
  }

  updateEsData(esId, id, factorIds) {
    const url = `${this.esUrl}/${esId}`;
    const body = `{
  "factors": [${factorIds}],
  "modelMaterialId": ${id}
  }`;
    let header;
    header = `'Content-Type', 'application/x-www-form-urlencoded'`;
    return this.http.put(url, body, { headers: header });
  }


  getFactor(factorId) {
    return this.factorService.find({
      where: {
        id: factorId
      },
      include: {
        relation: 'factorType'
      }
    });
  }

  updateDiscussion(id, form) {
    const data: DiscussionInterface = {
      pic: form.pic,
      desc: form.discussion,
      duedate: form.duedate,
      status: form.status
    };
    return this.discussService.patchAttributes(id, data);
  }

  getFactorType(materialId) {
    return this.factorTypeService.find({
      where: {
        materialId: materialId
      },
      include: {
        relation: 'factors'
      },
      order: 'id ASC'
    });
  }

}
