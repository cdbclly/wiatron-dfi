import { TestBed } from '@angular/core/testing';

import { ManufaturerInputService } from './manufaturer-input.service';

describe('ManufaturerInputService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManufaturerInputService = TestBed.get(ManufaturerInputService);
    expect(service).toBeTruthy();
  });
});
