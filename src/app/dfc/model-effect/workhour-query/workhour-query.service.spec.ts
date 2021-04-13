import { TestBed } from '@angular/core/testing';

import { WorkhourQueryService } from './workhour-query.service';

describe('WorkhourQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkhourQueryService = TestBed.get(WorkhourQueryService);
    expect(service).toBeTruthy();
  });
});
