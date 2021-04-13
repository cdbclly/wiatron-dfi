import { TestBed } from '@angular/core/testing';

import { MboardService } from './mboard.service';

describe('MboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MboardService = TestBed.get(MboardService);
    expect(service).toBeTruthy();
  });
});
