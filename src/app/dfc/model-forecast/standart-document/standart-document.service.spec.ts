import { TestBed } from '@angular/core/testing';

import { StandartDocumentService } from './standart-document.service';

describe('StandartDocumentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StandartDocumentService = TestBed.get(StandartDocumentService);
    expect(service).toBeTruthy();
  });
});
