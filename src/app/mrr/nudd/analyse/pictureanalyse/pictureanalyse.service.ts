import { UserApi } from '@service/portal/sdk/services/custom/User';
import { SiteModelApi } from './../../../../service/mrr-sdk/services/custom/SiteModel';
import { LessonLearnedApi } from './../../../../service/mrr-sdk/services/custom/LessonLearned';
import { RiskApi } from './../../../../service/mrr-sdk/services/custom/Risk';
import { Injectable } from '@angular/core';
import { DesignItemApi, PartApi, ProcessTypeApi, FactApi, FactRiskApi, FactLogApi } from '@service/mrr-sdk';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PictureanalyseService {

  constructor(
    private designItemService: DesignItemApi,
    private riskService: RiskApi,
    private lessonLearnedService: LessonLearnedApi,
    private partService: PartApi,
    private processTypeService: ProcessTypeApi,
    private factService: FactApi,
    private factLogService: FactLogApi,
    private factRiskService: FactRiskApi,
    private siteModelService: SiteModelApi,
    private userService: UserApi
  ) { }

  public dataChanged = new Subject<any>();

  upsertFact(data) {
    return this.factService.upsert(data);
  }

  upsertFactLog(data) {
    return this.factLogService.upsert(data);
  }

  upsertFactRisk(data) {
    return this.factRiskService.upsert(data);
  }

  getParts(data) {
    return this.partService.find({
      where: {
        productId: data,
      }
    }).pipe(map((res) => {
      return res;
    }));
  }

  getProcessTypes(data) {
    return this.processTypeService.find({
      where: {
        dimensionId: data,
        enabled: true
      }
    }).pipe(map((res) => {
      return res;
    }));
  }

  getModelResultId(site, projectname) {
    return this.siteModelService.find({
      include: {
        relation: 'modelResults',
      },
      where: {
        siteId: site,
        modelId: projectname
      },
      order: 'id DESC'
    }).pipe(map(res => {
      return res;
    }
    ));
  }

  getTableData(data) {
    return this.designItemService.find({
      include: {
        relation: 'sides',
        scope: {
          where: {
            enabled: true
          },
          include: {
            relation: 'points',
            scope: {
              where: {
                enabled: true
              }
            }
          }
        }
      },
      where: {
        processTypeId: data.processTypeId,
        enabled: true
      }
    }).pipe(map(res => {
      return res;
    }
    ));

  }

  getLevel(data) {
    return this.riskService.find({
      where: {
        designItemId: data.item,
      }
    }).pipe(map((res) => {
      return res;
    }));
  }

  getLessonLearned(data) {
    return this.lessonLearnedService.find({
      where: {
        designItemId: data.item,
      },
      limit: 3,
      order: ['year DESC', 'id DESC']
    }).pipe(map((res) => {
      return res;
    }));
  }

  getFact(dimension, modelResultId) {
    return this.factService.find({
      where: {
        modelResultId: modelResultId,
        dimensionName: dimension
      }
    }).pipe(map((res) => {
      return res;
    }));
  }

  deleteFacts(id) {
    return this.factService.deleteById(id);
  }

  getRdUserId(projectName) {
    return this.factService.find({
      where: {
        PROJECTNAME: projectName,
      },
      limit: 1
    }).pipe(map((res) => {
      return res;
    }));
  }

  findUserById(id) {
    return this.userService.findById(id);
  }

}
