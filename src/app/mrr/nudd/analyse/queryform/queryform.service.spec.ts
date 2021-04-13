import { TestBed } from '@angular/core/testing';

import { QueryformService } from './queryform.service';

describe('QueryformService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryformService = TestBed.get(QueryformService);
    expect(service).toBeTruthy();
  });
});
