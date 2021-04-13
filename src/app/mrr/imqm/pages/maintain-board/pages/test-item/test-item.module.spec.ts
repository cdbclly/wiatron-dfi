import { TestItemModule } from './test-item.module';

describe('TestItemModule', () => {
  let testItemModule: TestItemModule;

  beforeEach(() => {
    testItemModule = new TestItemModule();
  });

  it('should create an instance', () => {
    expect(testItemModule).toBeTruthy();
  });
});
