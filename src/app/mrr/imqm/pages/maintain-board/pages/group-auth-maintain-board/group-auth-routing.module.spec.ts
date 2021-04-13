import { GroupAuthRoutingModule } from './group-auth-routing.module';

describe('GroupAuthRoutingModule', () => {
  let groupAuthRoutingModule: GroupAuthRoutingModule;

  beforeEach(() => {
    groupAuthRoutingModule = new GroupAuthRoutingModule();
  });

  it('should create an instance', () => {
    expect(groupAuthRoutingModule).toBeTruthy();
  });
});
