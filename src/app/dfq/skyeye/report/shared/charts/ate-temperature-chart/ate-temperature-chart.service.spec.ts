import { TestBed } from '@angular/core/testing';

import { AteTemperatureChartService } from './ate-temperature-chart.service';

describe('AteTemperatureChartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AteTemperatureChartService = TestBed.get(AteTemperatureChartService);
    expect(service).toBeTruthy();
  });
});
