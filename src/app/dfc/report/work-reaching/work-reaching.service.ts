import { Injectable } from '@angular/core';
import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';
import { BehaviorSubject } from 'rxjs';
import { ProjectNameProfileApi } from '@service/dfc_sdk/sdk';

@Injectable({
  providedIn: 'root'
})
export class WorkReachingService {

  constructor(
    private projectNameProfileApi: ProjectNameProfileApi
  ) { }

  proNameTargetSignCheck(proNameId) {
    return this.projectNameProfileApi.targetSignCheck(proNameId, true, true);
  }
}

export const DfcWorkReachingReportQuery: {
  plant: {
    style: ClsDfcQueryStyle,
    select: ClsDfcQuerySelect,
    value: string,
    change$?
  }
} = {
  plant: {
    style: {
      type: 'select',
      style: { width: '80px', margin: '10px 0 0 0' },
      red: true,
      label: '廠別',
      selectType: 'simple'
    },
    select: {
      selectList: []
    },
    value: '',
    change$: new BehaviorSubject('')
  }
};
