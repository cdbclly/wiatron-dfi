import { TestBed } from '@angular/core/testing';

import { TraceBoardService } from './trace-board.service';

describe('TraceBoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TraceBoardService = TestBed.get(TraceBoardService);
    expect(service).toBeTruthy();
  });
});
