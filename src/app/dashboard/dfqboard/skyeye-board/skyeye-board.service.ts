import { Injectable } from '@angular/core';
import { SectionApi, LineApi, StationApi } from '@service/skyeye_sdk';

@Injectable({
  providedIn: 'root'
})
export class SkyeyeBoardService {

  constructor(
    private sectionService: SectionApi,
    private lineService: LineApi,
    private stationService: StationApi
  ) { }

  getSectionByPlant(plant) {
    return this.sectionService.find({fields: {id: true, name: true}, where: {plantId: plant}}).toPromise();
  }

  getLinesBySections(sectionIds: any[]) {
    return this.lineService.find({fields: {id: true, name: true}, where: {sectionId: {inq: sectionIds}}}).toPromise();
  }

  getStationByLine(line) {
    return this.stationService.find({where: {lineId: line}}).toPromise();
  }
}
