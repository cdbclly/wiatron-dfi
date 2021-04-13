import { FilterDataModule } from './filter-data.module';

describe('FilterDataModule', () => {
  let filterDataModule: FilterDataModule;

  beforeEach(() => {
    filterDataModule = new FilterDataModule();
  });

  it('should create an instance', () => {
    expect(filterDataModule).toBeTruthy();
  });
});
