import { DownloadRawdataModule } from './download-rawdata.module';

describe('DownloadRawdataModule', () => {
  let downloadRawdataModule: DownloadRawdataModule;

  beforeEach(() => {
    downloadRawdataModule = new DownloadRawdataModule();
  });

  it('should create an instance', () => {
    expect(downloadRawdataModule).toBeTruthy();
  });
});
