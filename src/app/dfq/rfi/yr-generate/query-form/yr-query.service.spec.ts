import { TestBed } from '@angular/core/testing';

import { YrQueryService } from './yr-query.service';

describe('YrQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YrQueryService = TestBed.get(YrQueryService);
    expect(service).toBeTruthy();
  });
});
