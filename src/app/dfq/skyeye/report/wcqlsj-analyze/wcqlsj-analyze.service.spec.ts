import { TestBed } from '@angular/core/testing';

import { WcqlsjAnalyzeService } from './wcqlsj-analyze.service';

describe('WcqlsjAnalyzeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WcqlsjAnalyzeService = TestBed.get(WcqlsjAnalyzeService);
    expect(service).toBeTruthy();
  });
});
