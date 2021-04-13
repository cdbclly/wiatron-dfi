import { TestBed } from '@angular/core/testing';

import { MeetingMinutesService } from './meeting-minutes.service';

describe('MeetingMinutesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeetingMinutesService = TestBed.get(MeetingMinutesService);
    expect(service).toBeTruthy();
  });
});
