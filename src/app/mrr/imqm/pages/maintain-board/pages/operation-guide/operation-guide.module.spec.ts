import { OperationGuideModule } from './operation-guide.module';

describe('OperationGuideModule', () => {
  let operationGuideModule: OperationGuideModule;

  beforeEach(() => {
    operationGuideModule = new OperationGuideModule();
  });

  it('should create an instance', () => {
    expect(operationGuideModule).toBeTruthy();
  });
});
