import { GroupAuthModule } from './group-auth.module';

describe('GroupAuthModule', () => {
  let groupAuthModule: GroupAuthModule;

  beforeEach(() => {
    groupAuthModule = new GroupAuthModule();
  });

  it('should create an instance', () => {
    expect(groupAuthModule).toBeTruthy();
  });
});
