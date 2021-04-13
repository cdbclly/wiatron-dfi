import { TestBed } from '@angular/core/testing';

import { TargetHourSignService } from './target-hour-sign.service';

describe('TargetHourSignService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TargetHourSignService = TestBed.get(TargetHourSignService);
    expect(service).toBeTruthy();
  });
});
