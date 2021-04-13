import { Pipe, PipeTransform } from '@angular/core';
import { ProcessApi } from '@service/dfc_sdk/sdk';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * DFC Process
 *
 * @export
 * @class DfcProcessPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'dfcProcess'
})
export class DfcProcessPipe implements PipeTransform {

  Process;
  constructor(
    private processApi: ProcessApi
  ) {}

  transform(value: any, args?: any): any {
    if (!this.Process) {
      return this.processApi.find().pipe(map((p: any[]) => {
        this.Process = p;
        return p.find(d => d.ProcessCode === value);
      }));
    } else {
      return of(this.Process.find(d => d.ProcessCode === value));
    }
  }
}
