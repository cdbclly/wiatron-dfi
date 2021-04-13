import { TestBed } from '@angular/core/testing';

import { SystemParamPlantService } from './system-param-plant.service';

describe('SystemParamPlantService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemParamPlantService = TestBed.get(SystemParamPlantService);
    expect(service).toBeTruthy();
  });
});
