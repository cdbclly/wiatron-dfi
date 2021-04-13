import { WorkhourGapModule } from './workhour-gap.module';

describe('WorkhourGapModule', () => {
  let workhourGapModule: WorkhourGapModule;

  beforeEach(() => {
    workhourGapModule = new WorkhourGapModule();
  });

  it('should create an instance', () => {
    expect(workhourGapModule).toBeTruthy();
  });
});
