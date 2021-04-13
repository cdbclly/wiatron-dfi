import { TestBed } from '@angular/core/testing';

import { MilitaryOrderSignService } from './military-order-sign.service';

describe('MilitaryOrderSignService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MilitaryOrderSignService = TestBed.get(MilitaryOrderSignService);
    expect(service).toBeTruthy();
  });
});
