import { TestBed } from '@angular/core/testing';

import { StandartOperationSignService } from './standart-operation-sign.service';

describe('StandartOperationSignService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StandartOperationSignService = TestBed.get(StandartOperationSignService);
    expect(service).toBeTruthy();
  });
});
