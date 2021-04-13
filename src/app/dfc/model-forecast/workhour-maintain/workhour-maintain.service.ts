import { Injectable } from '@angular/core';
import { ProjectNameProfileApi, TargetOperationSignApi } from '@service/dfc_sdk/sdk';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkhourMaintainService {

  constructor(
    private projectNameProfileApi: ProjectNameProfileApi,
    private targetOperationSignApi: TargetOperationSignApi
  ) { }

  queryRfqInfo(proName): Observable<any> {
    return this.projectNameProfileApi.findById(proName, {
      'fields': ['ProjectNameID', 'ProjectCodeID', 'ProjectName', 'ProjectCode', 'RfqProjectCode', 'RfqProjectName', 'IsRfq']
    });
  }

  queryTargetSign(stageID, process): Observable<boolean> {
    return this.targetOperationSignApi.find({
      'where': {
        'stageID': stageID,
        'process': process
      },
      'include': ['workflow'],
      'order': 'date DESC',
      'limit': 1
    }).pipe(map(targetSign => {
      if (targetSign.length > 0
        && !!targetSign[0]['workflow']
        && [0, 1].includes(targetSign[0]['workflow']['status'])) {
        return true;
      }
      return false;
    }));
  }
}
