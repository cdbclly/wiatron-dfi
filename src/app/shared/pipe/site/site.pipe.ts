import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'site'
})
export class SitePipe implements PipeTransform {
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping')) || [] ;

  transform(plant: any, args?: any): any {
    const plantMapping = this.PlantMapping.find(data => data.Plant === plant);
    if (!!args) {
      if (args.type === 'plant') {
        return plantMapping.PlantName;
      } else if (args.type === 'plantCode') {
        const plants = this.PlantMapping.filter(data => data.Plant === plant);
        return plants.map(m => {
          return 'F' + m.PlantCode;
        }).join();
      }
    } else {
      return plantMapping.Site;
    }
  }

}
