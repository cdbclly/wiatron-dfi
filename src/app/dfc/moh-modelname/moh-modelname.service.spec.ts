import { TestBed } from '@angular/core/testing';

import { MohModelnameService } from './moh-modelname.service';

describe('MohModelnameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MohModelnameService = TestBed.get(MohModelnameService);
    expect(service).toBeTruthy();
  });
});
