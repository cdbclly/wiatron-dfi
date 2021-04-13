import { TestBed } from '@angular/core/testing';

import { MrrDocSelectService } from './mrr-doc-select.service';

describe('MrrDocSelectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MrrDocSelectService = TestBed.get(MrrDocSelectService);
    expect(service).toBeTruthy();
  });
});
