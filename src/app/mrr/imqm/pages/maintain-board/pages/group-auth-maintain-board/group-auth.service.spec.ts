import { TestBed } from '@angular/core/testing';

import { GroupAuthService } from './group-auth.service';

describe('GroupAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GroupAuthService = TestBed.get(GroupAuthService);
    expect(service).toBeTruthy();
  });
});
