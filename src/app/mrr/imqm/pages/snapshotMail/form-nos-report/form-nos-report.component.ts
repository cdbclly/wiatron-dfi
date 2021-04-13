import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsNosReportService } from './forms-nos-report.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-form-nos-report',
  templateUrl: './form-nos-report.component.html',
  styleUrls: ['./form-nos-report.component.scss']
})
export class FormNosReportComponent implements OnInit {

  formNos;
  type;
  tableData;
  rawData;
  rawDataSizeSpec = []; // 显示处理过后的rawData
  rawDataDefSpec = [];
  seriesHeadWidth = ['100px', '100px', '160px', '160px', '160px', '160px', '160px', '160px', '160px', '160px', '160px', '160px', '160px', '160px', '160px', '160px' ];
  scrollConfig = { x: '130%'};


  constructor(
    private activatedRoute: ActivatedRoute,
    private _service: FormsNosReportService
    ) {
    this.activatedRoute.queryParams.subscribe(queryPars => {
      console.log(queryPars);
      // debugger;
      this.formNos = queryPars.formNos;
      this.type = queryPars.type;
    });
  }

  ngOnInit() {
    // debugger;
    if (this.type === 'abnormal') {
      this._service.getAbnormalFormsDetail(this.formNos).subscribe(res => {
        // debugger;
        if (res['result'].length > 0) {
          this.tableData = res['result'];
          res['result'][0]['objName'] = this.type;
          res['result'][0]['expand'] = true;
          this.rawData = JSON.parse(res['result'][0]['rawData']);
          this.rawData['size'].map(element => {
          this.rawDataSizeSpec.push(element['xUpperSpecLimit']);
          this.rawDataSizeSpec.push(element['xLowerSpecLimit']);
          });
          if (this.rawData['deformation']) {
               this.rawData['deformation'].map(element => {
              this.rawDataDefSpec.push(element['xUpperSpecLimit']);
              this.rawDataDefSpec.push(element['xLowerSpecLimit']);
            });
          }
          console.log(this.tableData);
        }
      });
    }
    if (this.type === 'traceBack') {
      this._service.getTraceFormsDetail(this.formNos).subscribe(res => {
        if (res['result'].length > 0) {
        this.tableData = res['result'];
        res['result'][0]['objName'] = this.type;
        res['result'][0]['expand'] = true;
        this.rawData = JSON.parse(res['result'][0]['rawData']);
        this.rawData['size'].map(element => {
          this.rawDataSizeSpec.push(element['xUpperSpecLimit']);
          this.rawDataSizeSpec.push(element['xLowerSpecLimit']);
        });
        if (this.rawData['deformation']) {
          this.rawData['deformation'].map(element => {
            this.rawDataDefSpec.push(element['xUpperSpecLimit']);
            this.rawDataDefSpec.push(element['xLowerSpecLimit']);
          });
        }
      }
      });
    }
    if (this.type === 'earlyWarn') {
      this._service.getEarlyWarnFormsDetail(this.formNos).subscribe(res => {
        if (res['result'].length > 0) {
        this.tableData = res['result'];
        res['result'][0]['objName'] = this.type;
        res['result'][0]['expand'] = true;
        this.rawData = JSON.parse(res['result'][0]['rawData']);
        this.rawData['size'].map(element => {
          this.rawDataSizeSpec.push(element['xUpperSpecLimit']);
          this.rawDataSizeSpec.push(element['xLowerSpecLimit']);
        });
        if (this.rawData['deformation']) {
        this.rawData['deformation'].map(element => {
          this.rawDataDefSpec.push(element['xUpperSpecLimit']);
          this.rawDataDefSpec.push(element['xLowerSpecLimit']);
        });
      }
      }
      });
    }
  }

}
