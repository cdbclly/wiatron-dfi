import { TestBed } from '@angular/core/testing';

import { SpecMemberListService } from './spec-member-list.service';

describe('SpecMemberListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpecMemberListService = TestBed.get(SpecMemberListService);
    expect(service).toBeTruthy();
  });
});
