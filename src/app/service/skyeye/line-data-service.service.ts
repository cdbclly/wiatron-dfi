import { Injectable } from '@angular/core';
import { SectionApi, KPIApi, LineApi, StationApi, StageMapApi, TestItemMapApi, LightBarApi, RecipientApi, Spc_MaintainApi, Wcq_Screw_ParameterApi, CTQApi, ToolsVersionApi} from '@service/skyeye_sdk';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class LineDataServiceService {

  constructor(private sectionApi: SectionApi, private lineApi: LineApi, private kpiApi: KPIApi, private testItemApi: TestItemMapApi,
    private stationApi: StationApi,
    private stageApi: StageMapApi,
    private lightBarApi: LightBarApi,
    private testMaintainApi: ToolsVersionApi,
    private nzMessage: NzMessageService,
    private recipientApi: RecipientApi,
    private spcmaintain:Spc_MaintainApi,
    private wcqlsjmaintain:Wcq_Screw_ParameterApi,
    private ctqApi: CTQApi) {
    }

  getBaseSiteInfo() {
    return this.sectionApi.find().toPromise();
  }

  public groupBy(data, key) {
    return data.reduce(function (total, current) {
      (total[current[key]] = total[current[key]] || []).push(current);
      return total;
    }, {});
  }

  getSections(site: string) {
    return this.sectionApi.find().toPromise();
  }

  getSectionsByPlant(plant: string) {
    return this.sectionApi.find({ where: { plantId: plant } });
  }

  getSectionByLine(line: string, site, plant) {
    return this.lineApi.find({ include: { relation: 'section' }, where: { and: [{name: line}, {site: site}, {plant: plant}]} });
  }

  getLinesAll() {
    return this.lineApi.find().toPromise();
  }

  getLinesBySection(id) {
    return this.lineApi.find({ fields: { id: true, name: true }, where: { sectionId: id } }).toPromise();
  }

  getSectionId(plant, sectionName) {
    console.log(plant, sectionName);
    return this.sectionApi.find({ where: { and: [{ name: sectionName }, { plantId: plant }] } }).toPromise();
  }

  getStageMapping(stage, plant, site) {
    return this.stageApi.find({ where: { and: [{ stageCode: stage }, { plantCode: plant }, { siteCode: site }] } }).toPromise();
  }

  getTestItemMapping(plant, site, testItem, subTestItem) {
    return this.testItemApi.find({ where: { and: [{ plantCode: plant }, { siteCode: site }, { testItemName: testItem }, { subTestItemName: subTestItem }] } });
  }

  getStationAll() {
    return this.stationApi.find().toPromise();
  }

  getStationType() {
    return this.stationApi.find({ fields: { lineId: true, type: true } }).toPromise();
  }

  getStationByLine(line) {
    return this.stationApi.find({ where: { lineId: line}, order: ['stationSort asc', 'id asc']}).toPromise();
  }

  getKPIAll(plant) {
    return this.kpiApi.find({where: {plantId: plant}}).toPromise();
  }

  getLightBarApi(plant) {
    return this.lightBarApi.find({where: {plantId: plant}}).toPromise();
  }

  getTestMaintainApi(plant) {
    return this.testMaintainApi.find({where: {plantId: plant}}).toPromise();
  }

  getCTQApi(plant) {
    return this.ctqApi.find({where: {plantId: plant}}).toPromise();
  }

  getRecipientApi(plant) {
    return this.recipientApi.find({where: {plantId: plant}}).toPromise();
  }

  getSpcmaintainApi(plant) {
    return this.spcmaintain.find({where: {plantId: plant}}).toPromise();
  }

  getwcqlsjmaintainApi(plant) {
    return this.wcqlsjmaintain.find({where: {plantId: plant}}).toPromise();
  }

  getKPIByPlant(plant) {
    // this.kpiApi.
    return this.kpiApi.find({ where: { plantId: plant } }).toPromise();
  }
  getKPIByPlantName(plant, name) {
    return this.kpiApi.find({ where: { and: [{ plantId: plant }, { name: { inq: name } }] } }).toPromise();
  }

  getKPIByPlantNameStage(plant, name, stage) {
    return this.kpiApi.find({ where: { and: [{ plantId: plant }, { name: { inq: name } }, { stageId: { inq: stage } }] } }).toPromise();
  }

  getKPIByPlantNameModel(plant, name, model) {
    return this.kpiApi.find({ where: { and: [{ plantId: plant }, { name: { inq: name } }, { modelId: { inq: model } }] } }).toPromise();
  }

  getAllNodes() {
    return this.lineApi.find({ include: ['stations', 'section'] }).toPromise();
  }

  getKPIByOptions(plant, stageId, project) {
    if (project === null) {
      this.kpiApi.find({ where: { and: [{ plantId: plant }, { stageId: stageId }] } }).toPromise();
    } else {
      return this.kpiApi.find({ where: { and: [{ plantId: plant }, { stageId: stageId }, { name: project }] } }).toPromise();
    }
  }
//                    厂别，  站别，   类别，  机种，大测试项，小测试项，架构，cpk上限，cpk下限
  getPKIByAllOptions(plant, stageId, project, model, bTest?, sTest?, upn?, upperCpk?, lowerCpk?) {
    if (project === 'fpyr' || project === 'retry rate') {
      return this.kpiApi.find({ where: { and: [{ plantId: plant }, { stageId: stageId }, { name: project }, { modelId: model }] } }).toPromise();
    } else if ( project === 'assy fixturecpk' ) {
      return this.kpiApi.find({ where: { and: [{ plantId: plant }, { stageId: stageId }, { name: project }, { modelId: model }, { threshold1: bTest }, { threshold2: sTest }] } }).toPromise();
    } else if (project === 'rf cpk') {
      return this.kpiApi.find({ where: { and: [{ plantId: plant }, { stageId: stageId }, { name: project }, { modelId: model }, { threshold1: bTest }, { threshold2: sTest }] } }).toPromise();
    } else {
      return this.kpiApi.find({ where: { and: [{ plantId: plant }, { stageId: stageId }, { name: project }, { modelId: model }] } }).toPromise();
    }





    // if (project !== 'rf cpk' && project !== 'assy fixturecpk') {
    //   return this.kpiApi.find({ where: { and: [{ plantId: plant }, { stageId: stageId }, { name: project }, { modelId: model }] } }).toPromise();
    // } else {
    //   return this.kpiApi.find({ where: { and: [{ plantId: plant }, { stageId: stageId }, { name: project }, { modelId: model }, { threshold1: bTest }, { threshold2: sTest }] } }).toPromise();
    // }

    // if (project === 'rf cpk') {
    //   return this.kpiApi.find({ where: { and: [{ plantId: plant }, { stageId: stageId }, { name: project }, { modelId: model }, { threshold1: bTest }, { threshold2: sTest }, { upn: upn }] } }).toPromise();
    // } else if (project === 'assy fixturecpk') {
    //   return this.kpiApi.find({ where: { and: [{ plantId: plant }, { stageId: stageId }, { name: project }, { modelId: model }, { threshold1: bTest }, { threshold2: sTest }] } }).toPromise();
    // } else if (project === 'retry rate') {
    //   return this.kpiApi.find({ where: { and: [{ plantId: plant }, { stageId: stageId }, { name: project }, { modelId: model }, { upn: upn }] } }).toPromise();
    // } else {
    //   return this.kpiApi.find({ where: { and: [{ plantId: plant }, { stageId: stageId }, { name: project }, { modelId: model }] } }).toPromise();
    // }



  }

  getLightBarApiByAllOptions(plantId, model) {
    return this.lightBarApi.find({ where: { and: [{ plantId: plantId }, { model: model }] } }).toPromise();
  }

  getTestMaintainApiByAllOptions(site, plant, modelname, stationtype) {
    return this.testMaintainApi.find({ where: { and: [{ site: site }, { plant: plant }, { modelname: modelname}, , { stationtype: stationtype}] } }).toPromise();
  }

  getCTQApiByAllOptions(plant, project, modelname, stationtype, tdname, mdname) {
    return this.ctqApi.find({ where: { and: [{ plant: plant }, { project: project }, { modelname: modelname }, { stationtype: stationtype }, { tdname: tdname }, { mdname: mdname }] } }).toPromise();
  }


  getRecipientApiByAllOptions(plantId, model) {
    return this.recipientApi.find({ where: { and: [{ plantId: plantId }, { model: model }] } }).toPromise();
  }

  getRecipientApiByAllOptions1(plantId, model,PlantName,stageId,phase) {
    return this.recipientApi.find({ where: { and: [{ plantId: plantId }, { model: model },{ PlantName: PlantName }, { stageId: stageId }, { phase: phase}] } }).toPromise();
  }

  getSpcMaintainApiByAllOptions(model,stageId,tdName,mdName) {
    return this.spcmaintain.find({ where: { and: [{ model: model },{ stageId: stageId }, { tdName: tdName }, { mdName: mdName }] } }).toPromise();
  }

  getwcqlsjMaintainApiByAllOptions(stance,monitorPro,maxKgf,minKgf) {
    return this.wcqlsjmaintain.find({ where: { and: [{ stance: stance },{ monitorPro: monitorPro }, { maxKgf: maxKgf }, { minKgf: minKgf }] } }).toPromise();
  }

    updateKPIById(data) {
     return this.kpiApi.upsert(data).toPromise();
    }

  updateLightBarApiById(data) {
    return this.lightBarApi.upsert(data).toPromise();
  }

  updateTestMaintainApiById(data) {
    return this.testMaintainApi.upsert(data).toPromise();
  }

  updateCTQApiById(data) {
    return this.ctqApi.upsert(data).toPromise();
  }

  updateRecipientApiById(data) {
    return this.recipientApi.upsert(data).toPromise();
  }

  updatewcqlsjApiById(data) {
    return this.wcqlsjmaintain.upsert(data).toPromise();
  }

  updateSpcMaintainApiById(data) {
    return this.spcmaintain.upsert(data).toPromise();
  }

  updatewcqlsjMaintainApiById(data) {
    return this.wcqlsjmaintain.upsert(data).toPromise();
  }

  addKPIItem(data) {
    return this.kpiApi.upsert(data);
  }

  insertKPISets(data) {
    return this.kpiApi.createMany(data);
  }

  insertRecipientApiSets(data) {
    return this.recipientApi.createMany(data);
  }

  insertSpcMaintainApiSets(data) {
    return this.spcmaintain.createMany(data);
  }

  insertwcqlsjApiSets(data) {
    return this.wcqlsjmaintain.createMany(data);
  }

  insertLightBarApSets(data) {
    return this.lightBarApi.createMany(data);
  }

  insertTestMaintainApiSets(data) {
    return this.testMaintainApi.createMany(data);
  }

  insertCTQApSets(data) {
    return this.ctqApi.createMany(data);
  }

  deleteKPIById(id) {
    this.kpiApi.deleteById(id).subscribe(res => {
      console.log(res);
      this.nzMessage.create('success', '刪除成功');
    });
  }

  deleteLightBarApiById(id) {
    this.lightBarApi.deleteById(id).subscribe(res => {
      console.log(res);
      this.nzMessage.create('success', '刪除成功');
    });
  }

  deleteTestMaintainApiById(id) {
    this.testMaintainApi.deleteById(id).subscribe(res => {
      console.log(res);
      this.nzMessage.create('success', '刪除成功');
    });
  }

  deleteCTQApiById(id) {
    this.ctqApi.deleteById(id).subscribe(res => {
      console.log(res);
      this.nzMessage.create('success', '刪除成功');
    });
  }

  deleteRecipientApiById(id) {
    this.recipientApi.deleteById(id).subscribe(res => {
      console.log(res);
      this.nzMessage.create('success', '刪除成功');
    });
  }

  deleteSpcMaintainApiById(id) {
    this.spcmaintain.deleteById(id).subscribe(res => {
      console.log(res);
      this.nzMessage.create('success', '刪除成功');
    });
  }

  deletewcqlsjMaintainApiById(id) {
    this.wcqlsjmaintain.deleteById(id).subscribe(res => {
      console.log(res);
      this.nzMessage.create('success', '刪除成功');
    });
  }

  getLineIdByName(line, sectionId) {
    return this.lineApi.find({ where: { and: [{ name: line }, { sectionId: sectionId }] } }).toPromise();
  }

}
