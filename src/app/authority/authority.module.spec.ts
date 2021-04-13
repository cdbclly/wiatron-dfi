import { AuthorityModule } from './authority.module';

describe('AuthorityModule', () => {
  let authorityModule: AuthorityModule;

  beforeEach(() => {
    authorityModule = new AuthorityModule();
  });

  it('should create an instance', () => {
    expect(authorityModule).toBeTruthy();
  });
});
