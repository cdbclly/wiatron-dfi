import { TestBed } from '@angular/core/testing';

import { SkyeyeBoardService } from './skyeye-board.service';

describe('SkyeyeBoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SkyeyeBoardService = TestBed.get(SkyeyeBoardService);
    expect(service).toBeTruthy();
  });
});
