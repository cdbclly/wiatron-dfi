import { TestBed } from '@angular/core/testing';

import { FactoryDefectiveService } from './factory-defective.service';

describe('FactoryDefectiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FactoryDefectiveService = TestBed.get(FactoryDefectiveService);
    expect(service).toBeTruthy();
  });
});
