import { TestBed } from '@angular/core/testing';

import { MachineModelService } from './machine-model.service';

describe('MachineModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MachineModelService = TestBed.get(MachineModelService);
    expect(service).toBeTruthy();
  });
});
