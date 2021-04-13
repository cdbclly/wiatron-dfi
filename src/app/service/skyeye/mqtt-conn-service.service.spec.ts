import { TestBed } from '@angular/core/testing';

import { MqttConnServiceService } from './mqtt-conn-service.service';

describe('MqttConnServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MqttConnServiceService = TestBed.get(MqttConnServiceService);
    expect(service).toBeTruthy();
  });
});
