import { CloseRateAutoTrackModule } from './close-rate-auto-track.module';

describe('CloseRateAutoTrackModule', () => {
  let closeRateAutoTrackModule: CloseRateAutoTrackModule;

  beforeEach(() => {
    closeRateAutoTrackModule = new CloseRateAutoTrackModule();
  });

  it('should create an instance', () => {
    expect(closeRateAutoTrackModule).toBeTruthy();
  });
});
