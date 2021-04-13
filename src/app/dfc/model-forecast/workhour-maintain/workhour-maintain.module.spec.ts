import { WorkhourMaintainModule } from './workhour-maintain.module';

describe('WorkhourMaintainModule', () => {
  let workhourMaintainModule: WorkhourMaintainModule;

  beforeEach(() => {
    workhourMaintainModule = new WorkhourMaintainModule();
  });

  it('should create an instance', () => {
    expect(workhourMaintainModule).toBeTruthy();
  });
});
