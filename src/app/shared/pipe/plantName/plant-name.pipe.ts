import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { PlantApi, Plant } from '@service/dfi-sdk';
@Pipe({
  name: 'plantName'
})
@Injectable({
  providedIn: 'root'
})

export class PlantNamePipe implements PipeTransform {
  cache;
  constructor(
    private plantService: PlantApi
  ) {
    this.cache = this.plantService.find().toPromise();
  }
  async transform(plantId: string): Promise<string> {
    let plant;
    if (this.cache.length > 0) {
      plant = this.cache.find(data => data.id === plantId);
    } else {
      this.cache = await this.plantService.find().toPromise();
      plant = this.cache.find(data => data.id === plantId);
    }
    if (plant) {
      return `${plant.siteId}-${plant.name}(${plant.id})`;
    } else {
      return '';
    }
  }
}
