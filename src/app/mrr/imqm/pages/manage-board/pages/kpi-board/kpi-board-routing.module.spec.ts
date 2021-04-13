import { KpiBoardRoutingModule } from './kpi-board-routing.module';

describe('KpiBoardRoutingModule', () => {
  let kpiBoardRoutingModule: KpiBoardRoutingModule;

  beforeEach(() => {
    kpiBoardRoutingModule = new KpiBoardRoutingModule();
  });

  it('should create an instance', () => {
    expect(kpiBoardRoutingModule).toBeTruthy();
  });
});
