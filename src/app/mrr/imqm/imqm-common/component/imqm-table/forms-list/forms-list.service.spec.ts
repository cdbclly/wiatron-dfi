import { TestBed } from '@angular/core/testing';

import { FormsListService } from './forms-list.service';

describe('FormsListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormsListService = TestBed.get(FormsListService);
    expect(service).toBeTruthy();
  });
});
