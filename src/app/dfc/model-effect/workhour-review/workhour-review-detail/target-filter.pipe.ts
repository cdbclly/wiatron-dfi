import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'targetFilter' })
export class TargetFilterPipe implements PipeTransform {
  transform(items: any[], all: boolean = false, dataSet): any[] {
    if (!items) return [];
    if (all) return items.filter(data => !dataSet[data] ? false : true);
    return items.filter(data => !dataSet[data] ? false : (dataSet[data].rfqFactorTime - dataSet[data].stageFactorTime < 0 || dataSet[data].targetFactorTime != null));
  }
}
