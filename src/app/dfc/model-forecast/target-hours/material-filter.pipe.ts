import { Pipe, PipeTransform } from '@angular/core';
import { DFCTargetHourTableData } from './target-hours.component';

@Pipe({
  name: 'MaterialFilter'
})
export class MaterialFilterPipe implements PipeTransform {

  transform(value: DFCTargetHourTableData[], str?: string): any {
    if(value == null){
      return null;
    }
    if(str == '' || str == null){
      return value;
    }
    return value.filter(x=>x.Material.toLowerCase().includes(str.toLowerCase()));
  }

}
