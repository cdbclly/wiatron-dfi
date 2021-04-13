import { WorkhourValidationModule } from './workhour-validation.module';

describe('WorkhourValidationModule', () => {
  let workhourValidationModule: WorkhourValidationModule;

  beforeEach(() => {
    workhourValidationModule = new WorkhourValidationModule();
  });

  it('should create an instance', () => {
    expect(workhourValidationModule).toBeTruthy();
  });
});
