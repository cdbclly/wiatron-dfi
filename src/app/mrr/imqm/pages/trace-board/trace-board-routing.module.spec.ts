import { TraceBoardRoutingModule } from './trace-board-routing.module';

describe('TraceBoardRoutingModule', () => {
  let traceBoardRoutingModule: TraceBoardRoutingModule;

  beforeEach(() => {
    traceBoardRoutingModule = new TraceBoardRoutingModule();
  });

  it('should create an instance', () => {
    expect(traceBoardRoutingModule).toBeTruthy();
  });
});
