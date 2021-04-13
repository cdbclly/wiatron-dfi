import { TestBed } from '@angular/core/testing';

import { KpiBoardSelectServiceService } from './kpi-board-select-service.service';

describe('KpiBoardSelectServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KpiBoardSelectServiceService = TestBed.get(KpiBoardSelectServiceService);
    expect(service).toBeTruthy();
  });
});
