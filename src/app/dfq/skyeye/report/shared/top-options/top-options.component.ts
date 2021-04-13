import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-top-options',
  templateUrl: './top-options.component.html',
  styleUrls: ['./top-options.component.scss']
})
export class TopOptionsComponent implements OnInit, OnChanges {

  // tslint:disable-next-line:no-output-rename
  @Output('queryOption') queryOptions = new EventEmitter<any>();
  @Input() cur_site;
  siteInfos;
  siteGroup;
  @Input() cur_plant;
  plantGroup = [];
  @Input() cur_line;
  // cur_lineId;
  lineGroup = [];
  @Input() cur_section;
  cur_sectionId;
  sectionGroup = [];
  @Input() cur_item; // 治具編號
  @Input() cur_mdname;
  @Input() project;
  @Input() datefrom;
  @Input() dateto;
  itemGroup = [];
  bigTdGroup = [];
  smlTdGroup = [];
  mdGroup = [];
  @Input() cur_model;
  initEsData: {}[] = [];
  filterEsData: {}[] = [];
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
  @Input() cur_upn; // 架构
  upnArr = [];

  constructor(private dataService: LineDataServiceService, private esService: EsDataServiceService, public activatedRoute:ActivatedRoute) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cur_model'] && !changes['cur_model'].firstChange) {
      this.ngOnInit();
    }

    if (changes['datefrom'] && !changes['cur_model']) {
      // this.cur_sectionId = undefined;
      this.cur_item = undefined;
      this.cur_mdname = undefined;
      this.cur_model = undefined;
      this.cur_bt = undefined;
      this.cur_st = undefined;
      this.cur_upn = undefined;
      this.cur_line = undefined;
    }
    if (changes['dateto'] && !changes['cur_model']) {
      // this.cur_sectionId = undefined;
      this.cur_item = undefined;
      this.cur_mdname = undefined;
      this.cur_model = undefined;
      this.cur_bt = undefined;
      this.cur_st = undefined;
      this.cur_upn = undefined;
      this.cur_line = undefined;
    }

  }
  async ngOnInit() {


    this.activatedRoute.queryParams.subscribe((data) => {
      if (data) {
        this.cur_model = data['model'];
      }
    });


    this.siteInfos = JSON.parse(localStorage.getItem('Skyeye_plantMapping'));
    this.siteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    if (this.cur_site !== undefined && this.cur_plant !== undefined
      && this.cur_line !== undefined && this.cur_mdname !== undefined) {
      // console.log('DMC 跳转过来的数据============= \n');
      // console.log('厂别 cur_site ------- \n', this.cur_site);
      // console.log('厂区 cur_plant ------- \n', this.cur_plant);
      // console.log('制程 cur_section ------- \n', this.cur_section);
      // console.log('线别 cur_line ------- \n', this.cur_line);
      // console.log('站别 cur_mdname ------- \n', this.cur_mdname);
      // console.log('机种 cur_model ------- \n', this.cur_model);
      // console.log('架构 cur_upn ------- \n', this.cur_upn);
      // console.log('治具编号 cur_item ------- \n', this.cur_item);
      // console.log('压头编号 cur_bt ------- \n', this.cur_bt);
      // console.log('监控项目 cur_bt ------- \n', this.cur_st);

      this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
        return res['Plant'];
      });

      // this.cur_sectionId = await this.dataService.getSectionId(this.cur_plant, this.cur_section);
      // this.cur_sectionId = this.cur_sectionId[0]['id'];

      this.dataService.getSectionsByPlant(this.cur_plant).subscribe(res => {
        this.sectionGroup = res.map(section => {
          if (this.project === 'ATE Temperature' && section['name'] === 'FA') {
            return null;
          } else {
            return section;
          }
        });
        this.sectionGroup = this.sectionGroup.filter(ress => ress !== null);
      });

      if (this.project === 'fpyr') {
        if (this.cur_model) {
          await this.getESDatas('fpyr', 'op');
        } else {
          await this.getESDatas('fpyr', 'init');
        }
        this.filterData();
        if (this.filterEsData.length > 0) {
          this.mdGroup = this.dataService.groupBy(this.filterEsData, 'mdname');
          this.mdGroup = this.objectKeys(this.mdGroup);
          this.modelGroup = this.dataService.groupBy(this.filterEsData, 'model');
          this.modelGroup = this.objectKeys(this.modelGroup);
          // this.upnArr = this.objectKeys(this.dataService.groupBy(this.filterEsData, 'upn'));
          // this.upnArr = this.upnArr.map(res => {
          //   if (res === '') {
          //     return 'NA';
          //   } else {
          //     return res;
          //   }
          // });
          // this.cur_upn = this.cur_upn ? this.cur_upn : 'NA';
          // this.itemGroup = this.objectKeys(this.dataService.groupBy(this.filterEsData, 'item'));
          // this.itemGroup = this.itemGroup.map(res => {
          //   if (res === '') {
          //     return 'NA';
          //   } else {
          //     return res;
          //   }
          // });
          // this.cur_item = this.cur_item === '' ? 'NA' : this.cur_item;
        }
      }


      if (this.project === 'retry rate') {
        if (this.cur_model) {
          await this.getESDatas('retry-rate', 'op');
        } else {
          await this.getESDatas('retry-rate', 'init');
        }
        await this.filterData();
        if (this.filterEsData.length > 0) {
          this.mdGroup = this.dataService.groupBy(this.filterEsData, 'mdname');
          this.mdGroup = this.objectKeys(this.mdGroup);
          this.modelGroup = this.dataService.groupBy(this.filterEsData, 'model');
          this.modelGroup = this.objectKeys(this.modelGroup);
          this.upnArr = this.objectKeys(this.dataService.groupBy(this.filterEsData, 'upn'));
          this.upnArr = this.upnArr.map(res => {
            if (res === '') {
              return 'NA';
            } else {
              return res;
            }
          });
          this.cur_upn = this.cur_upn ? this.cur_upn : 'NA';
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

      if (this.project === 'ATE Temperature') {
        if (this.cur_model) {
          await this.getESDatas('ATE Temperature', 'op');
        } else {
          await this.getESDatas('ATE Temperature', 'init');
        }
        this.filterData();
        if (this.filterEsData.length > 0) {
          this.mdGroup = this.dataService.groupBy(this.filterEsData, 'mdname');
          this.mdGroup = this.objectKeys(this.mdGroup);
          this.modelGroup = this.dataService.groupBy(this.filterEsData, 'model');
          this.modelGroup = this.objectKeys(this.modelGroup);
        }
      }

      if (this.project === 'test time') {
        if (this.cur_model) { // 从DMC Link过来
          await this.getESDatas('test-time', 'op');
        } else {
          await this.getESDatas('test-time', 'init');
        }
        await this.filterData();
        if (this.filterEsData.length > 0) {
          this.mdGroup = this.dataService.groupBy(this.filterEsData, 'mdname');
          this.mdGroup = this.objectKeys(this.mdGroup);
          this.modelGroup = this.dataService.groupBy(this.filterEsData, 'model');
          this.modelGroup = this.objectKeys(this.modelGroup);
          this.upnArr = this.objectKeys(this.dataService.groupBy(this.filterEsData, 'upn'));
          this.upnArr = this.upnArr.map(res => {
            if (res === '') {
              return 'NA';
            } else {
              return res;
            }
          });
          this.cur_upn = this.cur_upn ? this.cur_upn : 'NA';
          this.itemGroup = this.objectKeys(this.dataService.groupBy(this.filterEsData, 'item'));
          this.itemGroup = this.itemGroup.map(res => {
            if (res === '') {
              return 'NA';
            } else {
              return res;
            }
          });
          this.cur_item = this.cur_item ? this.cur_item : 'NA';
        }
      }

      if (this.project === 'rf cpk') {
        if (this.cur_model) { // 从DMC Link过来
          await this.getESDatas('rf cpk', 'op');
        } else {
          await this.getESDatas('rf cpk', 'init');
        }

        await this.filterData();
        if (this.filterEsData.length > 0) {
          this.mdGroup = this.dataService.groupBy(this.filterEsData, 'mdname');
          this.mdGroup = this.objectKeys(this.mdGroup);
          this.modelGroup = this.dataService.groupBy(this.filterEsData, 'model');
          this.modelGroup = this.objectKeys(this.modelGroup);
          this.upnArr = this.objectKeys(this.dataService.groupBy(this.filterEsData, 'upn'));
          this.upnArr = this.upnArr.map(res => {
            if (res === '') {
              return 'NA';
            } else {
              return res;
            }
          });
          this.cur_upn = this.cur_upn ? this.cur_upn : '';
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
    }



    // if (this.cur_model || (this.project === 'ATE Temperature' && this.cur_mdname)) {
    //      this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
    //     return res['Plant'];
    //   });

    //   this.cur_sectionId = await this.dataService.getSectionId(this.cur_plant, this.cur_section);
    //   this.cur_sectionId = this.cur_sectionId[0]['id'];

    //   if (this.cur_mdname) { // 从DMC Link过来
    //     await this.getESDatas('ATE Temperature', 'op');
    //   } else {
    //     await this.getESDatas('ATE Temperature', 'init');
    //   }
    //   await this.filterData();
    //   if (this.filterEsData.length > 0) {
    //     this.mdGroup = this.dataService.groupBy(this.filterEsData, 'mdname');
    //     this.mdGroup = this.objectKeys(this.mdGroup);
    //   }
    // }

    if (this.cur_model || (this.project === 'ATE Temperature' && this.cur_mdname)) {
      this.queryOptions.emit({
        'cur_site': this.cur_site, 'cur_plant': this.cur_plant,
        'cur_line': this.cur_line, 'cur_mdname': this.cur_mdname, 'cur_model': this.cur_model, 'cur_item': this.cur_item === 'NA' ? '' : this.cur_item, 'cur_bt': this.cur_bt,
        'cur_st': this.cur_st, 'project': this.project, 'datefrom': this.datefrom, 'dateto': this.dateto, 'upn': this.cur_upn
      });
      this.queryButton = false;
    }
  }


  async getOptions(type) {
    if (type === 'site') {
      this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
        return res['Plant'];
      });
      this.cur_plant = '';
      this.cur_line = '';
      this.lineGroup = [];
      this.cur_mdname = '';
      // this.cur_sectionId = '';
      this.cur_model = '';
      this.cur_item = '';
      if (this.project === 'rf cpk') {
        this.cur_bt = '';
        this.cur_st = '';
      }
      this.lineGroup = [];
      this.mdGroup = [];
      this.upnArr = [];
      this.cur_upn = '';
      this.queryButton = true;
    }

    if (type === 'plant') {
      this.dataService.getSectionsByPlant(this.cur_plant).subscribe(res => {
        this.sectionGroup = res.map(section => {
          if (this.project === 'ATE Temperature' && section['name'] === 'FA') {
            return null;
          } else {
            return section;
          }
        });
        this.sectionGroup = this.sectionGroup.filter(sec => sec !== null);
      });
      this.cur_line = '';
      this.lineGroup = [];
      this.cur_mdname = '';
      // this.cur_sectionId = '';
      this.cur_model = '';
      this.cur_item = '';
      if (this.project === 'rf cpk') {
        this.cur_bt = '';
        this.cur_st = '';
      }
      this.lineGroup = [];
      this.mdGroup = [];
      this.upnArr = [];
      this.cur_upn = '';
      this.queryButton = true;
      if (this.cur_plant) {
        if (this.project === 'fpyr') {
          await this.getESDatas('fpyr', 'op');
        }
        if (this.project === 'retry rate') {
          await this.getESDatas('retry-rate', 'op');
        }
        if (this.project === 'test time') {
          await this.getESDatas('test-time', 'op');
        }
        if (this.project === 'rf cpk') {
          await this.getESDatas('rf cpk', 'op');
        }
        if (this.project === 'ATE Temperature') {
          await this.getESDatas('ATE Temperature', 'op');
        }
      }
    }

    // if (type === 'section') {
    //   this.cur_line = '';
    //   this.lineGroup = [];
    //   this.cur_mdname = '';
    //   this.cur_model = '';
    //   this.cur_item = '';
    //   this.mdGroup = [];
    //   this.modelGroup = [];
    //   this.itemGroup = [];
    //   this.cur_bt = '';
    //   this.cur_st = '';
    //   this.bigTdGroup = [];
    //   this.smlTdGroup = [];
    //   this.upnArr = [];
    //   this.cur_upn = '';
    //   this.queryButton = true;

    //   if (this.cur_sectionId) {
    //     if (this.project === 'fpyr') {
    //       await this.getESDatas('fpyr', 'op');
    //     }
    //     if (this.project === 'retry rate') {
    //       await this.getESDatas('retry-rate', 'op');
    //     }
    //     if (this.project === 'test time') {
    //       await this.getESDatas('test-time', 'op');
    //     }
    //     if (this.project === 'rf cpk') {
    //       await this.getESDatas('rf cpk', 'op');
    //     }
    //     if (this.project === 'ATE Temperature') {
    //       await this.getESDatas('ATE Temperature', 'op');
    //     }
    //   }
    // }

    if (type === 'line') {
      this.queryButton = true;
      this.mdGroup = [];
      // this.cur_line = this.lineGroup.filter(res => res['id'] === this.cur_lineId)[0]['name'];
      // const mdGroup = await this.dataService.getStationByLine(this.cur_lineId);
      // mdGroup.forEach(element => {
      //   this.mdGroup.push(element['type']);
      // });
      this.cur_mdname = '';
      this.cur_item = '';
      this.modelGroup = [];
      this.itemGroup = [];
      this.cur_bt = '';
      this.cur_st = '';
      this.bigTdGroup = [];
      this.smlTdGroup = [];
      this.cur_model = '';
      this.upnArr = [];
      this.cur_upn = '';

      this.filterData();
      this.mdGroup = this.dataService.groupBy(this.filterEsData, 'mdname');
      this.mdGroup = this.objectKeys(this.mdGroup);
    }

    if (type === 'mdname') {
      this.cur_model = '';
      this.cur_item = '';
      this.itemGroup = [];
      this.cur_bt = '';
      this.cur_st = '';
      this.bigTdGroup = [];
      this.smlTdGroup = [];
      this.upnArr = [];
      this.cur_upn = '';
      // if (this.cur_mdname) {
      //   if (this.project === 'fpyr') {
      //     await this.getESDatas('fpyr', 'op');
      //   }
      //   if (this.project === 'retry rate') {
      //     await this.getESDatas('retry-rate', 'op');
      //   }
      //   if (this.project === 'test time') {
      //     await this.getESDatas('test-time', 'op');
      //   }
      //   if (this.project === 'rf cpk') {
      //     await this.getESDatas('rf cpk', 'op');
      //   }
      //   if (this.project === 'ATE Temperature') {
      //     await this.getESDatas('ATE Temperature', 'op');
      //   }
      // }
      this.filterData();
      this.modelGroup = this.dataService.groupBy(this.filterEsData, 'model');
      this.modelGroup = this.objectKeys(this.modelGroup);
      if (this.project === 'ATE Temperature') {
        this.queryButton = false;
      } else {
        this.queryButton = true;
      }
    }


    if (type === 'model') {
      this.cur_upn = undefined;
      this.cur_bt = undefined;
      this.cur_st = undefined;
      this.bigTdGroup = [];
      this.smlTdGroup = [];
      this.upnArr = [];
      this.cur_item = undefined;
      if (this.project === 'rf cpk' || this.project === 'retry rate' || this.project === 'test time') {
        this.filterData();
        this.upnArr = this.dataService.groupBy(this.filterEsData, 'upn');
        this.upnArr = this.objectKeys(this.upnArr);
        this.upnArr = this.upnArr.map(res => {
          if (res === '' || res === 'undefined') {
            return 'NA';
          } else {
            return res;
          }
        });
        if (this.cur_mdname && this.cur_model && (this.cur_item || this.cur_item === '')) {
          this.queryButton = false;
        } else {
          this.queryButton = true;
        }
      } else {
        this.filterData();
        this.itemGroup = this.dataService.groupBy(this.filterEsData, 'item');
        this.itemGroup = this.objectKeys(this.itemGroup);
        this.itemGroup = this.itemGroup.map(res => {
          if (res === '') {
            return 'NA';
          } else {
            return res;
          }
        });
        this.insertItem(this.itemGroup);
        if (this.cur_model === '' || this.cur_model === undefined) {
          this.cur_mdname = '';
        }
        if (this.cur_mdname && this.cur_model && (this.cur_item || this.cur_item === '')) {
          this.queryButton = false;
        } else {
          if (this.cur_model && this.project === 'fpyr') {
            this.queryButton = false;
          } else {
            this.queryButton = true;
          }
        }
      }
    }



    if (type === 'upn') {
      this.cur_bt = undefined;
      this.cur_st = undefined;
      this.bigTdGroup = [];
      this.smlTdGroup = [];
      this.cur_item = undefined;
      this.itemGroup = [];

      // if (this.cur_upn !== 'NA' && this.cur_upn !== 'undefined') {
        this.filterData();
        this.itemGroup = this.dataService.groupBy(this.filterEsData, 'item');
        this.itemGroup = this.objectKeys(this.itemGroup);
        this.itemGroup = this.itemGroup.map(res => {
          if (res === '') {
            return 'NA';
          } else {
            return res;
          }
        });
        this.insertItem(this.itemGroup);
        if (this.cur_model === '' || this.cur_model === undefined) {
          this.cur_mdname = '';
        }
        if (this.cur_mdname && this.cur_model && (this.cur_item || this.cur_item === '')) {
          this.queryButton = false;
        } else {
          this.queryButton = true;
        }
      // }
      // const lis = document.getElementsByTagName('nz-option-li');
    }

    if (type === 'fixture') {
      this.cur_st = '';
      this.cur_bt = '';
      this.smlTdGroup = [];
      this.bigTdGroup = [];
      if (this.project !== 'rf cpk') {
        if (this.cur_item === '' || this.cur_item === undefined || this.cur_item === null) {
          this.queryButton = true;
        } else {
          if (this.cur_mdname && this.cur_model && this.cur_item) {
            this.queryButton = false;
          }
        }
      } else {
        this.queryButton = true;
        if (this.cur_item === '' || this.cur_item === undefined || this.cur_item === null) {
          this.cur_bt = '';
          this.cur_st = '';
          this.bigTdGroup = [];
          this.smlTdGroup = [];
        } else {
          this.filterData();
          this.bigTdGroup = this.dataService.groupBy(this.filterEsData, 'bigt');
          this.bigTdGroup = this.objectKeys(this.bigTdGroup);
        }
      }
    }

    if (type === 'bt') {
      this.cur_st = '';
      this.queryButton = true;
      this.smlTdGroup = this.smlTdArr;
      if (this.cur_bt === '' || this.cur_bt === undefined) {
        this.cur_st = '';
        this.smlTdGroup = [];
      } else {
        this.filterData();
        this.smlTdGroup = this.dataService.groupBy(this.filterEsData, 'smlt');
        this.smlTdGroup = this.objectKeys(this.smlTdGroup);
      }
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

    if (this.project !== 'ATE Temperature') {
      if (this.cur_model !== undefined && this.cur_model !== null && this.cur_model !== '') {
        this.filterEsData = this.filterEsData.filter(res => res['model'] === this.cur_model);
      }

      if (this.cur_upn !== 'NA' && this.cur_upn !== undefined && this.cur_upn !== '') {
        this.filterEsData = this.filterEsData.filter(res => res['upn'] === this.cur_upn);
      }
      if (this.cur_item !== undefined && this.cur_item !== null && this.cur_item !== '') {
        this.filterEsData = this.filterEsData.filter(res => res['item'] === (this.cur_item === 'NA' ? '' : this.cur_item));
      }
      if (this.cur_bt !== undefined && this.cur_bt !== null && this.cur_bt !== '' && this.cur_bt !== 'undefined') {
        this.filterEsData = this.filterEsData.filter(res => res['bigt'] === this.cur_bt);
      }
    }

  }

  async getESDatas(type, op) {
    this.mdArr = []; // 站别
    this.modelArr = [];
    this.itemArr = [];
    this.initEsData = [];
    let date_range;
    let size;

    if (type === 'ATE Temperature') {
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
    } else {
      if (this.datefrom && this.dateto) {
        date_range = `"range": {
          "stopdate": {
            "lte": ${this.dateto},
            "gte": ${this.datefrom}
          }
        }`;
        size = `"size": 10000`;
      } else {
        date_range = `"range": {
          "stopdate": {
            "lte": "now"
          }
        }`;
        size = `"size": 5000`;
      }
    }

    if (type === 'fpyr') {
      let esURL;
      if (this.cur_site !== 'WKS') {
        esURL = this.esService.getUrl(type + '/', '_' + this.cur_site.toLowerCase());
      } else {
        esURL = this.esService.getUrl(type + '/');
      }
      const querys = this.esService.getDefectLossOp(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(), date_range, size);
      const data = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
      console.log(esURL, querys);
      console.log('查询出来的下拉数据 ==== \n', data);
      for (let i = 0; i < data['hits']['hits'].length; i++) {
        this.lineGroup.push(data['hits']['hits'][i]._source.stationline);
        this.lineGroup = Array.from(new Set(this.lineGroup)); // 去重
        this.lineGroup = this.lineGroup.filter(function (e) { return e });

        const dataitem = {
          line: data['hits']['hits'][i]._source.stationline,
          mdname: data['hits']['hits'][i]._source.stationtype,
          upn: data['hits']['hits'][i]._source.upn ? data['hits']['hits'][i]._source.upn : 'NA',
          model: data['hits']['hits'][i]._source.modelname,
          item: data['hits']['hits'][i]._source.stationname,
          bigt: null,
          smlt: null
        };
        this.initEsData.push(dataitem);
        if (op === 'init' && this.cur_mdname !== '' && this.cur_mdname !== undefined && this.cur_mdname !== null && this.cur_model === undefined && this.cur_item === undefined) {
          if (this.cur_mdname === data['hits']['hits'][i]._source.stationtype && data['hits']['hits'][i]._source.failrate > data['hits']['hits'][i]._source.lowerlimit) {
            this.cur_model = data['hits']['hits'][i]._source.modelname;
            this.cur_item = data['hits']['hits'][i]._source.stationname;
            this.cur_upn = data['hits']['hits'][i]._source.upn ? data['hits']['hits'][i]._source.upn : 'NA';
          }
        }
      }
    }


    if (type === 'retry-rate') {
      let esURL;
      if (this.cur_site !== 'WKS') {
        esURL = this.esService.getUrl(type + '/', '_' + this.cur_site.toLowerCase());
      } else {
        esURL = this.esService.getUrl(type + '/');
      }
      const querys = this.esService.getRetryRateOp(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(), date_range, size);
      console.log('查询的条件\n', esURL, querys);
      const data = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
      // this.initEsData = data;
      console.log(' retry rate 查询到的数据 data ===== \n', data);
      for (let i = 0; i < data['hits']['hits'].length; i++) {
        this.lineGroup.push(data['hits']['hits'][i]._source.stationline);
        this.lineGroup = Array.from(new Set(this.lineGroup)); // 去重
        this.lineGroup = this.lineGroup.filter(function (e) { return e });

        const dataitem = {
          line: data['hits']['hits'][i]._source.stationline,
          mdname: data['hits']['hits'][i]._source.stationtype,
          upn: data['hits']['hits'][i]._source.upn ? data['hits']['hits'][i]._source.upn : 'NA',
          model: data['hits']['hits'][i]._source.modelname,
          item: data['hits']['hits'][i]._source.stationid,
          bigt: null,
          smlt: null
        };
        this.initEsData.push(dataitem);
        if (op === 'init' && this.cur_mdname !== '' && this.cur_mdname !== undefined && this.cur_mdname !== null && this.cur_model === undefined && this.cur_item === undefined) {
          if (this.cur_mdname === data['hits']['hits'][i]._source.stationtype && data['hits']['hits'][i]._source.retryrate > data['hits']['hits'][i]._source.lowerlimit) {
            this.cur_upn = data['hits']['hits'][i]._source.upn ? data['hits']['hits'][i]._source.upn : 'NA',
              this.cur_model = data['hits']['hits'][i]._source.modelname;
            this.cur_item = data['hits']['hits'][i]._source.stationid;
          }
        }
      }
    }


    if (type === 'ATE Temperature') {
      let esURL;
      if (this.cur_site !== 'WKS') {
        esURL = this.esService.getUrl('temperature/', '_' + this.cur_site.toLowerCase());
      } else {
        esURL = this.esService.getUrl('temperature/');
      }
      const querys = this.esService.getATETemperatureOP(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(), date_range, size);
      console.log(esURL, querys);
      const data = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
      for (let i = 0; i < data['hits']['hits'].length; i++) {
        this.lineGroup.push(data['hits']['hits'][i]._source.stationline);
        this.lineGroup = Array.from(new Set(this.lineGroup)); // 去重
        this.lineGroup = this.lineGroup.filter(function (e) { return e });

        const dataitem = {
          line: data['hits']['hits'][i]._source.stationline,
          mdname: data['hits']['hits'][i]._source.stationtype,
          model: data['hits']['hits'][i]._source.modelname,
          item: data['hits']['hits'][i]._source.stationid,
          bigt: null,
          smlt: null
        };
        this.initEsData.push(dataitem);
        // if (op === 'init' && this.cur_mdname !== '' && this.cur_mdname !== undefined ) {
        //   if (this.cur_mdname === data['hits']['hits'][i]._source.stationtype && data['hits']['hits'][i]._source.average > data['hits']['hits'][i]._source.upperlimit) {
        //     this.cur_model = data['hits']['hits'][i]._source.modelname;
        //   }
        // }
      }
    }


    if (type === 'test-time') {
      let extended_bounds;
      const min_date = new Date().getTime() - 18000000;
      if (this.datefrom && this.dateto) {
        extended_bounds = `"extended_bounds": {
          "min": ${this.datefrom},
          "max": ${this.dateto}
        },
        "time_zone": "+08:00"`;
        date_range = `"range": {
          "stopdate": {
            "lte": ${this.dateto},
            "gte": ${this.datefrom}
          }
        }`;
        size = `"size": 500`;
      } else {
        extended_bounds = `"extended_bounds": {
          "min": ${min_date},
          "max": "now"
        },
        "time_zone": "+08:00"`;
        date_range = `"range": {
          "stopdate": {
            "lte": "now"
          }
        }`;
        size = `"size": 500`;
      }
      let esURL;
      if (this.cur_site !== 'WKS') {
        esURL = this.esService.getUrl(type + '/', '_' + this.cur_site.toLowerCase());
      } else {
        esURL = this.esService.getUrl(type + '/');
      }
      const querys = this.esService.getTestTimeOp(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(), date_range, size);
      const data = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
      console.log(esURL, querys);
      console.log(data);
      for (let i = 0; i < data['hits']['hits'].length; i++) {
        this.lineGroup.push(data['hits']['hits'][i]._source.stationline);
        this.lineGroup = Array.from(new Set(this.lineGroup)); // 去重
        this.lineGroup = this.lineGroup.filter(function (e) { return e });

        const dataitem = {
          line: data['hits']['hits'][i]._source.stationline,
          mdname: data['hits']['hits'][i]._source.stationtype,
          model: data['hits']['hits'][i]._source.modelname,
          upn: data['hits']['hits'][i]._source.upn ? data['hits']['hits'][i]._source.upn : 'NA',
          item: data['hits']['hits'][i]._source.stationid,
          bigt: null,
          smlt: null
        };
        const warnData = data['hits']['hits'][i]._source.detail.filter(res => res.testcycletime > data['hits']['hits'][i]._source.upperlimit || res.testcycletime < data['hits']['hits'][i]._source.lowerlimit);
        this.initEsData.push(dataitem);
        if (op === 'init' && this.cur_mdname !== '' && this.cur_mdname !== undefined && this.cur_mdname !== null && this.cur_model === undefined && this.cur_item === undefined) {
          if (this.cur_mdname === data['hits']['hits'][i]._source.stationtype && warnData.length > 0) {
            this.cur_model = data['hits']['hits'][i]._source.modelname;
            this.cur_item = data['hits']['hits'][i]._source.stationid !== '' ? data['hits']['hits'][i]._source.stationid : 'NA';
            this.cur_upn = data['hits']['hits'][i]._source.upn ? data['hits']['hits'][i]._source.upn : 'NA';
          }
        }
      }
    }


    if (type === 'rf cpk') {
      this.bigTdArr = [];
      this.smlTdArr = [];
      let esURL1;
      if (this.cur_site !== 'WKS') {
        esURL1 = this.esService.getUrl('tumbling-count-cpk/', '_' + this.cur_site.toLowerCase());
      } else {
        esURL1 = this.esService.getUrl('tumbling-count-cpk/');
      }
      const querys1 = this.esService.getCPKSlidingOp(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(), date_range, size);
      console.log(esURL1, querys1);
      const data = await this.esService.postData(esURL1, JSON.parse(querys1)).toPromise();
      // this.initEsData = data;
      // let esURL2;
      // if (this.cur_site !== 'WKS') {
      //   esURL2 = this.esService.getUrl('tumbling-count-cpk/', '_' + this.cur_site.toLowerCase());
      // } else {
      //   esURL2 = this.esService.getUrl('tumbling-count-cpk/');
      // }
      // const querys2 = this.esService.getCPKTumblingOp(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(), date_range, size);
      // console.log(esURL2, querys2);
      // const data2 = await this.esService.postData(esURL2, JSON.parse(querys2)).toPromise();
      // console.log('*******************************\n',data2)
      // for (let i = 0; i < data2['hits']['hits'].length; i++) {
      //   this.lineGroup.push(data2['hits']['hits'][i]._source.stationline);
      //   this.lineGroup = Array.from(new Set(this.lineGroup)); // 去重
      //   this.lineGroup = this.lineGroup.filter(function (e) { return e });

      //   const dataitem = {
      //     line: data2['hits']['hits'][i]._source.line,
      //     mdname: data2['hits']['hits'][i]._source.stationtype,
      //     model: data2['hits']['hits'][i]._source.modelname,
      //     upn: data2['hits']['hits'][i]._source.upn ? data2['hits']['hits'][i]._source.upn : 'NA',
      //     item: data2['hits']['hits'][i]._source.stationid,
      //     bigt: data2['hits']['hits'][i]._source.tdname,
      //     smlt: data2['hits']['hits'][i]._source.mdname
      //   };
      //   this.initEsData.push(dataitem);
      //   if (op === 'init' && this.cur_mdname !== '' && this.cur_mdname !== undefined && this.cur_mdname !== null && this.cur_model === undefined && this.cur_item === undefined) {
      //     if (this.cur_mdname === data2['hits']['hits'][i]._source.stationtype && data2['hits']['hits'][i]._source.cpk < data2['hits']['hits'][i]._source.upperlimit) {
      //       this.cur_item = data2['hits']['hits'][i]._source.stationid;
      //       this.cur_model = data2['hits']['hits'][i]._source.modelname;
      //       this.cur_upn = data2['hits']['hits'][i]._source.upn ? data2['hits']['hits'][i]._source.upn : 'NA',
      //       this.cur_bt = data2['hits']['hits'][i]._source.tdname;
      //       this.cur_st = data2['hits']['hits'][i]._source.mdname;
      //     }
      //   }
      // }

      for (let i = 0; i < data['hits']['hits'].length; i++) {
        this.lineGroup.push(data['hits']['hits'][i]._source.stationline);
        this.lineGroup = Array.from(new Set(this.lineGroup)); // 去重
        this.lineGroup = this.lineGroup.filter(function (e) { return e });

        const dataitem = {
          line: data['hits']['hits'][i]._source.stationline,
          mdname: data['hits']['hits'][i]._source.stationtype,
          model: data['hits']['hits'][i]._source.modelname,
          item: data['hits']['hits'][i]._source.stationid,
          bigt: data['hits']['hits'][i]._source.tdname,
          smlt: data['hits']['hits'][i]._source.mdname,
          upn: data['hits']['hits'][i]._source.upn ? data['hits']['hits'][i]._source.upn : 'NA'
        };
        this.initEsData.push(dataitem);
        if (op === 'init' && this.cur_mdname !== '' && this.cur_mdname !== undefined && this.cur_mdname !== null) {
          if (this.cur_mdname === data['hits']['hits'][i]._source.stationtype && data['hits']['hits'][i]._source.cpk < data['hits']['hits'][i]._source.upperlimit) {
            this.cur_item = data['hits']['hits'][i]._source.stationid;
            this.cur_model = data['hits']['hits'][i]._source.modelname;
            this.cur_bt = data['hits']['hits'][i]._source.tdname;
            this.cur_st = data['hits']['hits'][i]._source.mdname;
            this.cur_upn = data['hits']['hits'][i]._source.upn ? data['hits']['hits'][i]._source.upn : 'NA';
            this.cur_mdname = data['hits']['hits'][i]._source.stationtype;
          }
        }
      }
      console.log(this.cur_item, this.cur_model, this.cur_bt, this.cur_st);
    }
    this.mdArr = Array.from(new Set(this.mdArr));
  }

  query() {
    this.queryOptions.emit({
      'cur_site': this.cur_site, 'cur_plant': this.cur_plant,
      'cur_line': this.cur_line, 'cur_mdname': this.cur_mdname, 'cur_model': this.cur_model, 'cur_item': this.cur_item === 'NA' ? '' : this.cur_item, 'cur_bt': this.cur_bt,
      'cur_st': this.cur_st, 'project': this.project, 'datefrom': this.datefrom, 'dateto': this.dateto, 'upn': this.cur_upn
    });
  }

  insertItem(arr: Array<any>) {
    let isHas = false;
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 'ALL') {
          arr.splice(i, 1);
          isHas = true;
        }
      }
      if (isHas) {
        arr.unshift('ALL');
      }
    }
  }
}
