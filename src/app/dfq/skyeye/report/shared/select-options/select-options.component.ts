import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { consumeBinding } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-select-options',
  templateUrl: './select-options.component.html',
  styleUrls: ['./select-options.component.scss']
})
export class SelectOptionsComponent implements OnInit, OnChanges {

  // tslint:disable-next-line:no-output-rename
  @Output('queryOption') queryOptions = new EventEmitter<any>();
  @Input() cur_site;
  siteInfos;
  siteGroup; // 厂别数据
  @Input() cur_plant;
  plantGroup = [];  // 厂区数据
  @Input() cur_line;
  // cur_lineId; // 实际选择发送到es的线别数据
  lineGroup = [];
  @Input() cur_section; // 当前制程
  cur_sectionId; // 实际选择发送到es的制程数据
  sectionGroup = [];
  @Input() cur_item; // 治具編號
  @Input() cur_mdname; // 当前站别
  @Input() project; // 父组件是谁
  @Input() datefrom;
  @Input() dateto;
  @Input() cur_MachineModel; // 治具类别
  machineModelGroup;
  itemGroup = [];
  bigTdGroup = [];  // 压头编号数据
  smlTdGroup = [];  // 监控项目数据
  mdGroup = [];
  @Input() cur_model; // 当前机种
  initEsData: {}[] = [];
  filterEsData: {}[] = []; // 筛选的es数据
  @Input() cur_bt;
  @Input() cur_st;
  modelGroup = [];
  modelArr = [];
  itemArr = [];
  mdArr = [];
  bigTdArr = [];
  smlTdArr = [];
  ndname;
  objectKeys = Object.keys;
  objectValue = Object.values;
  queryButton = true;

  constructor(private dataService: LineDataServiceService, private esService: EsDataServiceService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cur_model'] && !changes['cur_model'].firstChange) {
      this.ngOnInit();
    }

    if (changes['datefrom'] && !changes['cur_model']) {
      // this.sectionGroup = [];
      // this.cur_sectionId = '';
      // this.lineGroup = [];
      this.cur_line = '';
      this.cur_item = undefined;
      this.cur_mdname = undefined;
      this.cur_model = undefined;
      // this.machineModelGroup = [];
      this.cur_MachineModel = '';
      this.cur_bt = undefined;
      this.cur_st = undefined;
    }
    if (changes['dateto'] && !changes['cur_model']) {
      // this.sectionGroup = [];
      // this.cur_sectionId = '';
      // this.lineGroup = [];
      this.cur_line = '';
      this.cur_item = undefined;
      // this.machineModelGroup = [];
      this.cur_MachineModel = '';
      this.cur_mdname = undefined;
      this.cur_model = undefined;
      this.cur_bt = undefined;
      this.cur_st = undefined;
    }
  }



  async ngOnInit() {
    this.siteInfos = JSON.parse(localStorage.getItem('Skyeye_plantMapping'));
    this.siteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    // debugger;
    // 下面的逻辑是DMC跳转过来的数据
    if (this.cur_site !== undefined && this.cur_plant !== undefined
      && this.cur_line !== undefined && this.cur_mdname !== undefined) {
      console.log('DMC 跳转过来的数据============= \n');

      // console.log('厂别 cur_site ------- \n', this.cur_site);
      // console.log('厂区 cur_plant ------- \n', this.cur_plant);
      // console.log('制程 cur_section ------- \n', this.cur_section);
      // console.log('线别 cur_line ------- \n', this.cur_line);
      // console.log('站别 cur_mdname ------- \n', this.cur_mdname);
      // console.log('机种 cur_model ------- \n', this.cur_model);
      // console.log('治具类别 cur_machineModel ------- \n', this.cur_MachineModel);
      // console.log('治具编号 cur_item ------- \n', this.cur_item);
      // console.log('压头编号 cur_bt ------- \n', this.cur_bt);
      // console.log('监控项目 cur_bt ------- \n', this.cur_st);

      this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
        return res['Plant'];
      });

      // this.cur_sectionId = await this.dataService.getSectionId(this.cur_plant, this.cur_section);
      // this.cur_sectionId = this.cur_sectionId[0]['id'];
      // console.log('this.cur_sectionId == \n', this.cur_sectionId);

      this.dataService.getSectionsByPlant(this.cur_plant).subscribe(res => {
        this.sectionGroup = res.map(section => {
          if (this.project === 'ATE Temperature' && section['name'] === 'FA') {
            return null;
          } else {
            return section;
          }
        });
        this.sectionGroup = this.sectionGroup.filter(ress => ress !== null);
        console.log(this.sectionGroup);
      });

      // this.cur_lineId = await this.dataService.getLineIdByName(this.cur_line, this.cur_sectionId);
      // this.cur_lineId = this.cur_lineId[0]['id'];

      if (this.project === 'yield_rate') {
        if (this.cur_model) {
          await this.getESDatas('yield_rate', 'op');
        } else {
          await this.getESDatas('yield_rate', 'init');
        }
        this.filterData();
        if (this.filterEsData.length > 0) {
          this.mdGroup = this.dataService.groupBy(this.filterEsData, 'mdname');
          this.mdGroup = this.objectKeys(this.mdGroup);
          this.modelGroup = this.dataService.groupBy(this.filterEsData, 'model');
          this.modelGroup = this.objectKeys(this.modelGroup);
          this.machineModelGroup = this.dataService.groupBy(this.filterEsData, 'machineModel');
          this.machineModelGroup = this.objectKeys(this.machineModelGroup);
          this.machineModelGroup = this.machineModelGroup.map(res => {
            if (res === '') {
              return 'NA';
            } else {
              return res;
            }
          });
          this.cur_MachineModel = this.cur_MachineModel === '' ? 'NA' : this.cur_MachineModel;
          this.itemGroup = this.objectKeys(this.dataService.groupBy(this.filterEsData, 'item'));
          this.itemGroup = this.itemGroup.map(res => {
            if (res === '') {
              return 'NA';
            } else {
              return res;
            }
          });
          this.cur_item = this.cur_item === '' ? 'NA' : this.cur_item;
        }
      }

      if (this.project === 'assy fixturecpk') {
        if (this.cur_model) { // 从DMC Link过来
          await this.getESDatas('fa_tumbling_cnt_cpk', 'op');
        } else {
          await this.getESDatas('fa_tumbling_cnt_cpk', 'init');
        }

        await this.filterData();
        console.log(this.filterEsData);
        if (this.filterEsData.length > 0) {
          this.mdGroup = this.dataService.groupBy(this.filterEsData, 'mdname');
          this.mdGroup = this.objectKeys(this.mdGroup);
          this.modelGroup = this.dataService.groupBy(this.filterEsData, 'model');
          this.modelGroup = this.objectKeys(this.modelGroup);
          this.machineModelGroup = this.dataService.groupBy(this.filterEsData, 'machineModel');
          this.machineModelGroup = this.objectKeys(this.machineModelGroup);
          this.machineModelGroup = this.machineModelGroup.map(res => {
            if (res === '') {
              return 'NA';
            } else {
              return res;
            }
          });
          this.cur_MachineModel = this.cur_MachineModel === '' ? 'NA' : this.cur_MachineModel;
          this.itemGroup = this.objectKeys(this.dataService.groupBy(this.filterEsData, 'item'));
          this.itemGroup = this.itemGroup.map(res => {
            if (res === '') {
              return 'NA';
            } else {
              return res;
            }
          });
          this.cur_item = this.cur_item === '' ? 'NA' : this.cur_item;
          this.bigTdGroup = this.objectKeys(this.dataService.groupBy(this.filterEsData, 'bigt'));
          this.smlTdGroup = this.objectKeys(this.dataService.groupBy(this.filterEsData, 'smlt'));
        }
      }

      if (this.project === 'fixture retry rate') {
        if (this.cur_model) {
          await this.getESDatas('fa_retest_rate', 'op');
        } else {
          await this.getESDatas('fa_retest_rate', 'init');
        }
        this.filterData();
        if (this.filterEsData.length > 0) {
          this.mdGroup = this.dataService.groupBy(this.filterEsData, 'mdname');
          this.mdGroup = this.objectKeys(this.mdGroup);
          this.modelGroup = this.dataService.groupBy(this.filterEsData, 'model');
          this.modelGroup = this.objectKeys(this.modelGroup);
          this.machineModelGroup = this.dataService.groupBy(this.filterEsData, 'machineModel');
          this.machineModelGroup = this.objectKeys(this.machineModelGroup);
          this.machineModelGroup = this.machineModelGroup.map(res => {
            if (res === '') {
              return 'NA';
            } else {
              return res;
            }
          });
          this.cur_MachineModel = this.cur_MachineModel === '' ? 'NA' : this.cur_MachineModel;
          this.itemGroup = this.objectKeys(this.dataService.groupBy(this.filterEsData, 'item'));
          this.itemGroup = this.itemGroup.map(res => {
            if (res === '') {
              return 'NA';
            } else {
              return res;
            }
          });
          this.cur_item = this.cur_item === '' ? 'NA' : this.cur_item;
        }
      }
    }
    if (this.cur_model) {
      this.query();
      this.queryButton = false;
    }
  }


  // 当input框选中的值发送变化的时候调用
  async getOptions(type) {
    // 厂别改变
    if (type === 'site') {
      this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
        return res['Plant'];
      });
      this.cur_plant = '';
      this.cur_line = '';
      this.cur_mdname = '';
      // this.cur_sectionId = '';
      this.cur_model = '';
      this.cur_MachineModel = '';
      this.machineModelGroup = [];
      this.cur_item = '';
      if (this.project === 'assy fixturecpk') {
        this.cur_bt = '';
        this.cur_st = '';
      }
      this.lineGroup = [];
      this.mdGroup = [];
      this.queryButton = true;
    }

    // 厂区改变
    if (type === 'plant') {
      this.dataService.getSectionsByPlant(this.cur_plant).subscribe(res => {
        this.sectionGroup = res.map(section => {
          return section;
        });
        this.sectionGroup = this.sectionGroup.filter(sec => sec !== null);
        console.log('制程数据 ===\n', this.sectionGroup);
      });

      // this.cur_section = '';
      // this.cur_lineId = '';
      this.cur_mdname = '';
      // this.cur_sectionId = '';
      this.cur_model = '';
      this.cur_MachineModel = '';
      this.machineModelGroup = [];
      this.cur_item = '';
      if (this.project === 'assy fixturecpk') {
        this.cur_bt = '';
        this.cur_st = '';
      }
      this.cur_line = '';
      this.lineGroup = [];
      this.mdGroup = [];
      this.queryButton = true;
      if (this.cur_plant) {
        if (this.project === 'assy fixturecpk') {
          await this.getESDatas('fa_tumbling_cnt_cpk', 'op');
        }

        if (this.project === 'yield_rate') {
          await this.getESDatas('yield_rate', 'op');
        }

        if (this.project === 'fixture retry rate') {
          await this.getESDatas('fa_retest_rate', 'op');
        }
      }
    }

    // 制程改变
    // if (type === 'section') {
    //   console.log(this.cur_section);
    //   // debugger;
    //   // this.cur_lineId = '';
    //   this.cur_line = '';
    //   this.lineGroup = [];
    //   this.cur_mdname = '';
    //   this.cur_model = '';
    //   this.cur_item = '';
    //   this.mdGroup = [];
    //   this.modelGroup = [];
    //   this.itemGroup = [];
    //   this.cur_MachineModel = '';
    //   this.machineModelGroup = [];
    //   this.cur_bt = '';
    //   this.cur_st = '';
    //   this.bigTdGroup = [];
    //   this.smlTdGroup = [];
    //   this.queryButton = true;

    //   if (this.cur_sectionId) {
    //     if (this.project === 'assy fixturecpk') {
    //       await this.getESDatas('fa_tumbling_cnt_cpk', 'op');
    //     }

    //     if (this.project === 'yield_rate') {
    //       await this.getESDatas('yield_rate', 'op');
    //     }

    //     if (this.project === 'fixture retry rate') {
    //       await this.getESDatas('fa_retest_rate', 'op');
    //     }
    //   }
    // }

    // 线别改变
    if (type === 'line') {
      this.cur_mdname = '';
      this.mdGroup = [];
      this.cur_model = '';
      this.modelGroup = [];
      this.cur_MachineModel = '';
      this.machineModelGroup = [];
      this.cur_item = '';
      this.itemGroup = [];
      this.cur_bt = '';
      this.cur_st = '';
      this.bigTdGroup = [];
      this.smlTdGroup = [];
      this.queryButton = true;

      this.filterData();
      this.mdGroup = this.dataService.groupBy(this.filterEsData, 'mdname');
      this.mdGroup = this.objectKeys(this.mdGroup);
      console.log('站别 数据 ===== \n', this.mdGroup);
    }


    // 站别改变
    if (type === 'mdname') {
      this.cur_model = '';
      this.modelGroup = [];
      this.cur_MachineModel = '';
      this.machineModelGroup = [];
      this.cur_item = '';
      this.itemGroup = [];
      this.cur_bt = '';
      this.cur_st = '';
      this.bigTdGroup = [];
      this.smlTdGroup = [];
      this.queryButton = true;
      this.filterData();
      this.modelGroup = this.dataService.groupBy(this.filterEsData, 'model');
      this.modelGroup = this.objectKeys(this.modelGroup);
      console.log('机种 数据 ===== \n', this.modelGroup);
    }


    // 机种改变
    if (type === 'model') {
      this.cur_MachineModel = '';
      this.machineModelGroup = [];
      this.cur_item = '';
      this.itemGroup = [];
      this.cur_bt = '';
      this.cur_st = '';
      this.bigTdGroup = [];
      this.smlTdGroup = [];
      this.queryButton = true;
      this.filterData();
      this.machineModelGroup = this.dataService.groupBy(this.filterEsData, 'machineModel');
      this.machineModelGroup = this.objectKeys(this.machineModelGroup);
      this.machineModelGroup = this.machineModelGroup.map(res => {
        if (res === '') {
          return 'NA';
        } else {
          return res;
        }
      });
      console.log('治具类别  =\n', this.machineModelGroup);
    }


    // 治具类别改变
    if (type === 'machineModel') {
      this.cur_item = '';
      this.itemGroup = [];
      this.cur_bt = '';
      this.cur_st = '';
      this.bigTdGroup = [];
      this.smlTdGroup = [];
      this.queryButton = true;
      this.filterData();
      this.itemGroup = this.dataService.groupBy(this.filterEsData, 'item');
      this.itemGroup = this.objectKeys(this.itemGroup);
      console.log('治具编号  =\n', this.itemGroup);
    }


    // 治具编号改变
    if (type === 'fixture') {
      this.cur_bt = '';
      this.cur_st = '';
      this.bigTdGroup = [];
      this.smlTdGroup = [];
      this.queryButton = true;

      if (this.project === 'assy fixturecpk') {
        this.filterData();
        this.bigTdGroup = this.dataService.groupBy(this.filterEsData, 'bigt');
        this.bigTdGroup = this.objectKeys(this.bigTdGroup);
        console.log('压头编号  =\n', this.bigTdGroup);
      } else {
        if (this.cur_item) {
          this.queryButton = false;
        }
      }

    }

    if (type === 'bt') {
      this.cur_st = '';
      this.smlTdGroup = [];
      this.queryButton = true;

      this.filterData();
      this.smlTdGroup = this.dataService.groupBy(this.filterEsData, 'smlt');
      this.smlTdGroup = this.objectKeys(this.smlTdGroup);
      console.log('监控项目数据 === \n ', this.smlTdGroup);
    }

    if (type === 'st') {
      if (this.cur_st === '' || this.cur_st === undefined) {
        this.queryButton = true;
      } else {
        this.queryButton = false;
      }
    }
  }

  filterData() {
    this.filterEsData = this.initEsData;
    if (this.cur_line !== undefined && this.cur_line !== null && this.cur_line !== '') {
      this.filterEsData = this.filterEsData.filter(res => res['line'] === this.cur_line);
    }

    if (this.cur_mdname !== undefined && this.cur_mdname !== null && this.cur_mdname !== '') {
      this.filterEsData = this.filterEsData.filter(res => res['mdname'] === this.cur_mdname);
    }

    if (this.cur_model !== undefined && this.cur_model !== null && this.cur_model !== '') {
      this.filterEsData = this.filterEsData.filter(res => res['model'] === this.cur_model);
    }

    if (this.cur_MachineModel !== undefined && this.cur_MachineModel !== null && this.cur_MachineModel !== '') {
      this.filterEsData = this.filterEsData.filter(res => res['machineModel'] === this.cur_MachineModel);
    }

    if (this.cur_item !== undefined && this.cur_item !== null && this.cur_item !== '') {
      this.filterEsData = this.filterEsData.filter(res => res['item'] === (this.cur_item === 'NA' ? '' : this.cur_item));
    }

    if (this.cur_bt !== undefined && this.cur_bt !== null && this.cur_bt !== '' && this.cur_bt !== 'undefined') {
      this.filterEsData = this.filterEsData.filter(res => res['bigt'] === this.cur_bt);
    }
    console.log('筛选后的数据---- \n', this.filterEsData);
  }


  // es数据查询
  async getESDatas(type, op) {
    console.log('线程被点击，开发查询es数据 == \n');
    console.log(this.cur_site, this.cur_line, this.cur_mdname, this.cur_line);
    this.mdArr = []; // 站别
    this.modelArr = [];
    this.itemArr = [];
    this.initEsData = [];
    let date_range;
    let size;

    // 如果有时间范围
    if (this.datefrom && this.dateto) {
      date_range = `"range": {
        "executiontime": {
          "lte": ${this.dateto},
          "gte": ${this.datefrom}
        }
      }`;
      size = `"size": 10000`;
    } else {
      date_range = `"range": {
        "executiontime": {
          "lte": "now"
        }
      }`;
      size = `"size": 5000`;
    }


    // assy fixturecpk es查询
    if (type === 'fa_tumbling_cnt_cpk') {
      let esURL;
      if (this.cur_site !== 'WKS') {
        esURL = this.esService.getUrl(type + '/', '_' + this.cur_site.toLowerCase());
      } else {
        esURL = this.esService.getUrl(type + '/');
      }
      const querys = this.esService.getFAcpkOp(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(), date_range, size);
      const data = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
      console.log('assy fixturecpk从es中查出来的站别数据 === \n');
      console.log(esURL, querys, data);

      for (let i = 0; i < data['hits']['hits'].length; i++) {
        // this.mdArr.push(data['hits']['hits'][i]._source.MachineStation);
        this.lineGroup.push(data['hits']['hits'][i]._source.line);
        this.lineGroup = Array.from(new Set(this.lineGroup)); // 去重
        this.lineGroup = this.lineGroup.filter(function (e) { return e });

        const dataitem = {
          line: data['hits']['hits'][i]._source.line,
          mdname: data['hits']['hits'][i]._source.MachineStation,
          model: data['hits']['hits'][i]._source.Model,
          machineModel: data['hits']['hits'][i]._source.MachineModel,
          item: data['hits']['hits'][i]._source.MachineSN,
          bigt: data['hits']['hits'][i]._source.tdname,
          smlt: data['hits']['hits'][i]._source.mdname
        };
        this.initEsData.push(dataitem);
        if (op === 'init' && this.cur_mdname !== '' && this.cur_mdname !== undefined && this.cur_mdname !== null) {
          if (this.cur_mdname === data['hits']['hits'][i]._source.stationtype && data['hits']['hits'][i]._source.cpk < data['hits']['hits'][i]._source.upperlimit) {
            this.cur_MachineModel = data['hits']['hits'][i]._source.MachineModel,
              this.cur_item = data['hits']['hits'][i]._source.MachineSN;
            this.cur_model = data['hits']['hits'][i]._source.Model;
            this.cur_bt = data['hits']['hits'][i]._source.tdname;
            this.cur_st = data['hits']['hits'][i]._source.mdname;
          }
        }
      }
      console.log('assy fixturecpk --- \n', this.initEsData);
    }


    // 良率es查询
    if (type === 'yield_rate') {
      let esURL;
      if (this.cur_site !== 'WKS') {
        esURL = this.esService.getUrl(type + '/', '_' + this.cur_site.toLowerCase());
      } else {
        esURL = this.esService.getUrl(type + '/');
      }
      const querys = this.esService.getYieldRateOp(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(), date_range, size);
      const data = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
      console.log('yield rate 从es中查出来的站别数据 === \n');
      console.log(esURL, querys);
      console.log(data);
      for (let i = 0; i < data['hits']['hits'].length; i++) {
        // this.mdArr.push(data['hits']['hits'][i]._source.MachineStation);
        this.lineGroup.push(data['hits']['hits'][i]._source.line);
        this.lineGroup = Array.from(new Set(this.lineGroup)); // 去重
        this.lineGroup = this.lineGroup.filter(function (e) { return e });

        const dataitem = {
          line: data['hits']['hits'][i]._source.line,
          mdname: data['hits']['hits'][i]._source.MachineStation,
          model: data['hits']['hits'][i]._source.Model,
          machineModel: data['hits']['hits'][i]._source.MachineModel,
          item: data['hits']['hits'][i]._source.MachineSN,
          bigt: null,
          smlt: null
        };
        this.initEsData.push(dataitem);
        if (op === 'init' && this.cur_mdname !== '' && this.cur_mdname !== undefined && this.cur_mdname !== null && this.cur_model === undefined && this.cur_item === undefined) {
          if (this.cur_mdname === data['hits']['hits'][i]._source.stationtype && data['hits']['hits'][i]._source.retryrate > data['hits']['hits'][i]._source.lowerlimit) {
            this.cur_MachineModel = data['hits']['hits'][i]._source.MachineModel,
              this.cur_item = data['hits']['hits'][i]._source.MachineSN;
            this.cur_model = data['hits']['hits'][i]._source.Model;
          }
        }
      }
      console.log('良率的es数据 --- \n', this.initEsData);
    }


    // 组装治具retest rate es查询
    if (type === 'fa_retest_rate') {
      let esURL;
      if (this.cur_site !== 'WKS') {
        esURL = this.esService.getUrl(type + '/', '_' + this.cur_site.toLowerCase());
      } else {
        esURL = this.esService.getUrl(type + '/');
      }
      const querys = this.esService.getYieldRateOp(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(), date_range, size);
      const data = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
      console.log('组装治具retest rate 从es中查出来的站别数据 === \n');
      console.log(esURL, querys);
      console.log(data);
      for (let i = 0; i < data['hits']['hits'].length; i++) {
        // this.mdArr.push(data['hits']['hits'][i]._source.MachineStation);
        this.lineGroup.push(data['hits']['hits'][i]._source.line);
        this.lineGroup = Array.from(new Set(this.lineGroup)); // 去重
        this.lineGroup = this.lineGroup.filter(function (e) { return e });

        const dataitem = {
          line: data['hits']['hits'][i]._source.line,
          mdname: data['hits']['hits'][i]._source.MachineStation,
          model: data['hits']['hits'][i]._source.Model,
          machineModel: data['hits']['hits'][i]._source.MachineModel,
          item: data['hits']['hits'][i]._source.MachineSN,
          bigt: null,
          smlt: null
        };
        this.initEsData.push(dataitem);
        if (op === 'init' && this.cur_mdname !== '' && this.cur_mdname !== undefined && this.cur_mdname !== null && this.cur_model === undefined && this.cur_item === undefined) {
          if (this.cur_mdname === data['hits']['hits'][i]._source.stationtype && data['hits']['hits'][i]._source.retryrate > data['hits']['hits'][i]._source.lowerlimit) {
            this.cur_MachineModel = data['hits']['hits'][i]._source.MachineModel,
              this.cur_item = data['hits']['hits'][i]._source.MachineSN;
            this.cur_model = data['hits']['hits'][i]._source.Model;
          }
        }
      }
      console.log('组装治具retest rate --- \n', this.initEsData);
    }
  }

  query() {
    if (this.project === 'yield_rate') {
      this.queryOptions.emit({
        'cur_site': this.cur_site, 'cur_plant': this.cur_plant,
        'cur_line': this.cur_line, 'cur_mdname': this.cur_mdname, 'cur_model': this.cur_model, 'cur_MachineModel': this.cur_MachineModel, 'cur_item': this.cur_item === 'NA' ? '' : this.cur_item, 'cur_bt': this.cur_bt,
        'cur_st': this.cur_st, 'project': this.project, 'datefrom': this.datefrom, 'dateto': this.dateto, 'itemGroup': this.itemGroup
      });
    } else {
      this.queryOptions.emit({
        'cur_site': this.cur_site, 'cur_plant': this.cur_plant,
        'cur_line': this.cur_line, 'cur_mdname': this.cur_mdname, 'cur_model': this.cur_model, 'cur_MachineModel': this.cur_MachineModel, 'cur_item': this.cur_item === 'NA' ? '' : this.cur_item, 'cur_bt': this.cur_bt,
        'cur_st': this.cur_st, 'project': this.project, 'datefrom': this.datefrom, 'dateto': this.dateto
      });
    }
  }
}
