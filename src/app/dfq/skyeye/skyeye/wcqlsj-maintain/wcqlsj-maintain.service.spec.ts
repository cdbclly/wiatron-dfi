import { TestBed } from '@angular/core/testing';

import { WcqlsjMaintainService } from './wcqlsj-maintain.service';

describe('WcqlsjMaintainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WcqlsjMaintainService = TestBed.get(WcqlsjMaintainService);
    expect(service).toBeTruthy();
  });
});
