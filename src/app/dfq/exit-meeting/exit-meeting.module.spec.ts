import { ExitMeetingModule } from './exit-meeting.module';

describe('ExitMeetingModule', () => {
  let exitMeetingModule: ExitMeetingModule;

  beforeEach(() => {
    exitMeetingModule = new ExitMeetingModule();
  });

  it('should create an instance', () => {
    expect(exitMeetingModule).toBeTruthy();
  });
});
