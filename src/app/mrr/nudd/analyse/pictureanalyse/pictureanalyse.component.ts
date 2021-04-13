import { PictureanalyseService } from './pictureanalyse.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-pictureanalyse',
  templateUrl: './pictureanalyse.component.html',
  styleUrls: ['./pictureanalyse.component.scss']
})
export class PictureanalyseComponent implements OnInit {
  addEnable = false;

  i = 0;
  analysisShow = true;
  uploadShow = false;
  uploadFileName: string;
  value = [];
  item = [];
  processType: string;
  excel: string;
  part: string;
  dimension: string;
  dimensionId: number;
  excels = [];
  processTypes = [];
  parts = [];

  inputDataSet = [];
  dataSet = [];
  ifInputShow: boolean;
  afterAnalyseEnable: boolean;
  tableShow = false;
  queryShow = true;
  processTypeId = [];
  inputdata = [];
  noOtherDataSet: any[];
  modelResultId: any;
  facts = [];
  url: any;
  projectName: any;
  rdId: any;
  site: any;

  otherItems = [];
  valueItems = [];
  customer: any;

  constructor(
    private pictureService: PictureanalyseService,
    private message: NzMessageService
  ) { }

  ngOnInit() { }

  menu(event) {
    this.part = '';
    this.processType = '';
    this.parts.length = 0;
    this.processTypes.length = 0;
    this.pictureService.getParts(event[3]).subscribe(res => {
      this.parts = res;
    });
    this.pictureService.getProcessTypes(event[2]).subscribe(res => {
      this.processTypes = res;
      this.processTypes.push({
        name: 'Other'
      });
    });
    this.site = event[4];
    this.projectName = event[0];
    this.url = event[7];
    this.rdId = event[8];
    this.modelResultId = event[5];
    this.tableShow = false;
    this.dimension = event[1];
    this.dimensionId = event[2];
    this.dataSet = [];
    if (event[0] && event[1] && event[4] && event[6] === '0') {
      this.addEnable = true;
    } else if (event[0] && event[1] && event[4] && event[6] !== '0') {
      this.message.create('warning', 'This model has been submitted！');
      this.addEnable = false;
    } else {
      this.addEnable = false;
    }
  }

  custo(event) {
    this.customer = event;
  }

  getProcessType(data) {
    this.processTypeId = this.processTypes.find(res => res.name === data);
  }

  change(event) {
    this.addEnable = event;
  }

  delete(key) {
    const dataSet = this.dataSet.filter(d => d.key !== key);
    this.dataSet = dataSet;
    this.inputDataSet = [];
    this.ifInputShow = false;
    this.analysisShow = false;
  }

  paramShow() {
    this.ifInputShow = true;
    this.getFact();
    if (this.dataSet.length === this.parts.length) {
      this.inputDataSet.length = 0;
      this.tableShow = true;
      this.afterAnalyseEnable = false;
      const $obsArray = [];
      let key = 0;
      this.noOtherDataSet = this.dataSet.filter(
        res => res.processType !== 'Other'
      );
      this.noOtherDataSet.forEach(element => {
        const $obs = this.pictureService.getTableData(element).pipe(
          map(res => {
            const tempArray = [];
            for (let index = 0; index < res.length; index++) {
              for (let i = 0; i < res[index]['sides'].length; i++) {
                for (
                  let j = 0;
                  j < res[index]['sides'][i]['points'].length;
                  j++
                ) {
                  tempArray.push({
                    key: key++,
                    dimension: element.dimension,
                    part: element.part,
                    processType: element.processType,
                    item: res[index]['id'],
                    itemName: res[index]['name'],
                    picPath: res[index]['picturePath'],
                    side: res[index]['sides'][i].code,
                    sideName: res[index]['sides'][i].name,
                    point: res[index]['sides'][i]['points'][j].name,
                    level: undefined,
                    levelDetails: undefined,
                    lessonLearned: undefined,
                    length:
                      res[index]['sides'].length *
                      res[index]['sides'][i]['points'].length,
                    modelResultId: this.modelResultId,
                    designItemId: res[index]['id'],
                    isFactNumeric: res[index]['isFactNumeric']
                  });
                }
              }
            }
            return tempArray;
          })
        );
        $obsArray.push($obs);
      });
      forkJoin($obsArray)
        .pipe(
          map(res => {
            this.inputDataSet = [].concat.apply([], res);
            this.dataSet.forEach(element => {
              if (element.processType === 'Other') {
                this.inputDataSet.push({
                  key: key++,
                  dimension: element.dimension,
                  part: element.part,
                  processType: element.processType,
                  item: null,
                  itemName: undefined,
                  picPath: undefined,
                  side: undefined,
                  sideName: undefined,
                  point: undefined,
                  level: undefined,
                  levelDetails: undefined,
                  lessonLearned: undefined,
                  length: undefined,
                  modelResultId: this.modelResultId,
                });
              }
            });
          })
        )
        .subscribe();
      if (this.noOtherDataSet.length === 0) {
        this.dataSet.forEach(element => {
          if (element.processType === 'Other') {
            this.inputDataSet.push({
              key: key++,
              dimension: element.dimension,
              part: element.part,
              processType: element.processType,
              item: null,
              itemName: undefined,
              picPath: undefined,
              side: undefined,
              sideName: undefined,
              point: undefined,
              level: undefined,
              levelDetails: undefined,
              lessonLearned: undefined,
              length: undefined,
              modelResultId: this.modelResultId
            });
          }
        });
      }
    }
  }

  getFact() {
    this.pictureService
      .getFact(this.dimension, this.modelResultId)
      .subscribe(res => {
        this.facts = res;
      });
  }

  tableChange(data) {
    this.afterAnalyseEnable = data;
    this.ifInputShow = !data;
  }

  addLists() {
    if (this.part && this.processType && this.dimension) {
      for (let index = 0; index < this.dataSet.length; index++) {
        if (this.dataSet[index].part === this.part) {
          return;
        }
      }
      this.tableShow = false;
      this.i++;
      this.dataSet = [
        ...this.dataSet,
        {
          key: this.i,
          dimension: this.dimension,
          part: this.part,
          processType: this.processType,
          processTypeId: this.processTypeId['id']
        }
      ];
    }
  }

  handleFileInput(evt: any) {
    this.uploadFileName = evt.files[0].name;
    const reader: FileReader = new FileReader();
    // reader.readAsArrayBuffer(evt.files[0]);
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.inputdata = XLSX.utils.sheet_to_json(ws, { header: 1 });
    };
    reader.readAsBinaryString(evt.files[0]);
  }

  upload() {
    for (let i = 1; i < this.inputdata.length; i++) {
      for (let index = 0; index < this.inputDataSet.length; index++) {
        if (this.inputdata[i][2] === 'Other') {
          if (
            this.inputdata[i][0] === this.inputDataSet[index].dimension &&
            this.inputdata[i][1] === this.inputDataSet[index].part &&
            this.inputdata[i][2] === this.inputDataSet[index].processType
          ) {
            this.otherItems[this.inputDataSet[index].key] = this.inputdata[
              i
            ][3];
          }
        } else {
          if (
            this.inputdata[i][0] === this.inputDataSet[index].dimension &&
            this.inputdata[i][1] === this.inputDataSet[index].part &&
            this.inputdata[i][2] === this.inputDataSet[index].processType &&
            this.inputdata[i][3] ===
            `${this.inputDataSet[index].itemName}(${this.inputDataSet[index].item
            })` &&
            this.inputdata[i][4] ===
            `${this.inputDataSet[index].sideName}(${this.inputDataSet[index].side
            })` &&
            this.inputdata[i][5] == this.inputDataSet[index].point
          ) {
            this.valueItems[this.inputDataSet[index].key] = this.inputdata[
              i
            ][6];
          }
        }
      }
    }
    this.pictureService.dataChanged.next('uploaded');
  }
}
