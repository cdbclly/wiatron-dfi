import { SummaryRoutingModule } from './summary-routing.module';

describe('SummaryRoutingModule', () => {
  let summaryRoutingModule: SummaryRoutingModule;

  beforeEach(() => {
    summaryRoutingModule = new SummaryRoutingModule();
  });

  it('should create an instance', () => {
    expect(summaryRoutingModule).toBeTruthy();
  });
});
