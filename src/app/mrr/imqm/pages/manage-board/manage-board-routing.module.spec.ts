import { ManageBoardRoutingModule } from './manage-board-routing.module';

describe('ManageBoardRoutingModule', () => {
  let manageBoardRoutingModule: ManageBoardRoutingModule;

  beforeEach(() => {
    manageBoardRoutingModule = new ManageBoardRoutingModule();
  });

  it('should create an instance', () => {
    expect(manageBoardRoutingModule).toBeTruthy();
  });
});
