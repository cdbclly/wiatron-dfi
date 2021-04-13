import { WorkhourQueryModule } from './workhour-query.module';

describe('WorkhourQueryModule', () => {
  let workhourQueryModule: WorkhourQueryModule;

  beforeEach(() => {
    workhourQueryModule = new WorkhourQueryModule();
  });

  it('should create an instance', () => {
    expect(workhourQueryModule).toBeTruthy();
  });
});
