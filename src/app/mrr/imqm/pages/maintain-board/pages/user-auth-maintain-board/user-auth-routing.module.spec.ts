import { UserAuthRoutingModule } from './user-auth-routing.module';

describe('UserAuthRoutingModule', () => {
  let userAuthRoutingModule: UserAuthRoutingModule;

  beforeEach(() => {
    userAuthRoutingModule = new UserAuthRoutingModule();
  });

  it('should create an instance', () => {
    expect(userAuthRoutingModule).toBeTruthy();
  });
});
