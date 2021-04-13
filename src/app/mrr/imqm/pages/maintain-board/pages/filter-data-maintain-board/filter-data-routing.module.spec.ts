import { FilterDataRoutingModule } from './filter-data-routing.module';

describe('FilterDataRoutingModule', () => {
  let filterDataRoutingModule: FilterDataRoutingModule;

  beforeEach(() => {
    filterDataRoutingModule = new FilterDataRoutingModule();
  });

  it('should create an instance', () => {
    expect(filterDataRoutingModule).toBeTruthy();
  });
});
