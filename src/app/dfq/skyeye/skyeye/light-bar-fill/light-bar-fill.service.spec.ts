import { TestBed } from '@angular/core/testing';

import { LightBarFillService } from './light-bar-fill.service';

describe('LightBarFillService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LightBarFillService = TestBed.get(LightBarFillService);
    expect(service).toBeTruthy();
  });
});
