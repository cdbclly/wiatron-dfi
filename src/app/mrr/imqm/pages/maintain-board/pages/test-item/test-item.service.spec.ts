import { TestBed } from '@angular/core/testing';

import { TestItemService } from './test-item.service';

describe('TestItemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TestItemService = TestBed.get(TestItemService);
    expect(service).toBeTruthy();
  });
});
