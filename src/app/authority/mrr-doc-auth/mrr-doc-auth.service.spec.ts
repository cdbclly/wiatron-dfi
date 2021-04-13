import { TestBed } from '@angular/core/testing';

import { MrrDocAuthService } from './mrr-doc-auth.service';

describe('MrrDocAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MrrDocAuthService = TestBed.get(MrrDocAuthService);
    expect(service).toBeTruthy();
  });
});
