import { TestBed } from '@angular/core/testing';

import { WorkhourGapService } from './workhour-gap.service';

describe('WorkhourGapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkhourGapService = TestBed.get(WorkhourGapService);
    expect(service).toBeTruthy();
  });
});
