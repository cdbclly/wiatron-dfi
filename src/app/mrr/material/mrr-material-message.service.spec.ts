import { TestBed } from '@angular/core/testing';

import { MrrMaterialMessageService } from './mrr-material-message.service';

describe('MrrMaterialMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MrrMaterialMessageService = TestBed.get(MrrMaterialMessageService);
    expect(service).toBeTruthy();
  });
});
