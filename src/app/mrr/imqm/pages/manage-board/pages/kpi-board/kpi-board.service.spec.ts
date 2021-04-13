import { TestBed } from '@angular/core/testing';

import { KpiBoardService } from './kpi-board.service';

describe('KpiBoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KpiBoardService = TestBed.get(KpiBoardService);
    expect(service).toBeTruthy();
  });
});
