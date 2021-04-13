import { TestBed } from '@angular/core/testing';

import { SmartFactoryService } from './smart-factory.service';

describe('SmartFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmartFactoryService = TestBed.get(SmartFactoryService);
    expect(service).toBeTruthy();
  });
});
