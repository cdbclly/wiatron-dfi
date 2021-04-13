import { TestBed } from '@angular/core/testing';

import { MrrDocViewService } from './mrr-doc-view.service';

describe('MrrDocViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MrrDocViewService = TestBed.get(MrrDocViewService);
    expect(service).toBeTruthy();
  });
});
