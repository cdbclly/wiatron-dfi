import { Component, Input } from '@angular/core';
import { DownexcelService } from '@service/downexcel.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {
  @Input() site;
  @Input() plant;
  @Input() customer;
  @Input() data;
  @Input() isLoading: boolean;
  checkListsData = [];
  isEditSaveVisible3 = false;
  isEditSaveVisible = false;
  signerHistoryData: any;
  isDownLoadC4 = false;
  isDownLoadC5 = false;
  downLoading;
  downloadC4Data;
  downloadC5Data;
  tableC4: string;
  tableC5: string;

  constructor(
    private downexcel: DownexcelService
  ) { }

  showChecklist(data) {
    this.isEditSaveVisible3 = true;
    if (data) {
      this.checkListsData = data;
    } else {
      this.checkListsData = [];
    }
  }

  showSigns(data) {
    this.isEditSaveVisible = true;
    this.signerHistoryData = data;
  }

  handleCancel() {
    this.isEditSaveVisible = false;
  }

  handleOk() {
    this.isEditSaveVisible = false;
  }

  isVisible(isVisible) {
    this.isEditSaveVisible3 = isVisible;
  }

  downLoad(tableId) {
    if (tableId === 'tableC4') {
      this.isDownLoadC4 = true;
      setTimeout(() => {
        this.downloadC4Data = <HTMLDivElement>document.getElementById(tableId);
        this.downexcel.exportTableAsExcelFile(this.downloadC4Data, 'CX Exit Status Report C4.xlsx');
        this.isDownLoadC4 = false;
      }, 500);
    } else if (tableId === 'tableC5') {
      this.isDownLoadC5 = true;
      setTimeout(() => {
        this.downloadC4Data = <HTMLDivElement>document.getElementById(tableId);
        this.downexcel.exportTableAsExcelFile(this.downloadC4Data, 'CX Exit Status Report C5.xlsx');
        this.isDownLoadC5 = false;
      }, 500);
    }
  }
}
