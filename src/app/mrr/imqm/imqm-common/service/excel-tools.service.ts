import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import * as XLSXSTYLE from 'xlsx-style';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelToolsService {

  constructor() { }

  public exportAsExcelFile(json: any, excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    const today = this.getDate();
    FileSaver.saveAs(data, fileName + '_' + today + EXCEL_EXTENSION);
  }

  // 添加表头样式, 默认从B1开始
  private formatStyle(color, data) {
    const header = {s: {c: 1, r: 0}, e: {c: 1, r: 6}};
  }

  private getDate() {
    const today = new Date().getTime();
    return moment(today).format('YYYYMMDD');
  }




    // 附带样式下载
    public exportAsExcelFileStyle(json: any, excelFileName: string, colWidth?: number[], headerBgColor?: string, merges?): void {

      const worksheet: XLSXSTYLE.WorkSheet = XLSX.utils.json_to_sheet(json);
      const workbook: XLSXSTYLE.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const ws = worksheet;
      // 设置表头颜色和样式, 并且设置列宽
      if (headerBgColor) {
        for (let i = 0; i < Object.keys(json[0]).length; i++) {
          // 設置沒個cell的樣式垂直居中
          const all = ws['!ref'];
          for (let j = 1; j < json.length + 2; j++) {
            if (j === 1) {
              ws[String.fromCharCode(65 + i) + j] = {
                v: ws[String.fromCharCode(65 + i) + j].v,
                s: {
                  // fill: {fgColor: {rgb: '53868B'}},
                  fill: {fgColor: {rgb: headerBgColor}},
                  alignment: {horizontal: 'center', vertical: 'center'},
                  font: {bold: true}
                },
                t: 's'
              };
            } else {
              ws[String.fromCharCode(65 + i) + j] = {
                v: ws[String.fromCharCode(65 + i) + j].v,
                s: {
                  alignment: {horizontal: 'center', vertical: 'center'},
                },
                t: 's'
              };
            }
          }
        }
      }
      // 设置列宽
      if (colWidth) {
        ws['!cols'] = [];
        ws['!cols'] = colWidth;
      }
      // 合并单元格
      if (merges) {
        ws['!merges'] = merges;
      }
      const excelBuffer: any = XLSXSTYLE.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' });
      this.saveAsExcelFilewithStyle(excelBuffer, excelFileName);
    }

    private saveAsExcelFilewithStyle(buffer: any, fileName: string): void {
      const data: Blob = new Blob([this.s2ab(buffer)], {
        type: EXCEL_TYPE
      });
      const today = this.getDate();
      FileSaver.saveAs(data, fileName + '_' + today + EXCEL_EXTENSION);
    }

    s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    }


}
