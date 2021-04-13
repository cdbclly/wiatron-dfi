import { ManageBoardModule } from './manage-board.module';

describe('ManageBoardModule', () => {
  let manageBoardModule: ManageBoardModule;

  beforeEach(() => {
    manageBoardModule = new ManageBoardModule();
  });

  it('should create an instance', () => {
    expect(manageBoardModule).toBeTruthy();
  });
});
