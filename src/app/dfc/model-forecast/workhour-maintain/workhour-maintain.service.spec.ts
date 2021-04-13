import { TestBed } from '@angular/core/testing';

import { WorkhourMaintainService } from './workhour-maintain.service';

describe('WorkhourMaintainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkhourMaintainService = TestBed.get(WorkhourMaintainService);
    expect(service).toBeTruthy();
  });
});
