import { filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as XLSXSTYLE from 'xlsx-style';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { async } from 'rxjs/internal/scheduler/async';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})

class Cell {
  value: any;
  colSpan?: number;
  rowSpan?: number;
}

class Row {
  items: Cell[] = [];
  isHeader: boolean;
  subTable?: Table;  // 擴展的table
}

class Table {
  rows: Row[] = [];
}


export class DownexcelService {
  defaultColorArr = [{header: 'FFC125', body: '00C125'}, {header: '123456', body: 'cdf321'}];

  constructor() { }

  // public exportNestedTableToExcelFile(data: any, excelName: string, colorArr?: string[]): void {
  public exportNestedTableAsExcelFile(data: any, excelName: string, colorArr?: any[]): void {

    if (!colorArr) {
      colorArr = this.defaultColorArr;
    }

    const jsonData = this.ParsingNestedTable(data);
    const excelBuffer = this.NestedJsonToExcel(jsonData, colorArr);

    const a = XLSXSTYLE.write(excelBuffer, { bookType:  'xlsx', bookSST: false, type: 'binary' });
    const tmpDown = new Blob([this.s2ab(a)], {
          type: ''
      });
      this.saveAs(tmpDown, excelName);
  }

  private saveAs(obj, fileName) {
    const tmpa = document.createElement('a');
    tmpa.download = fileName + '.xlsx';
    tmpa.href = URL.createObjectURL(obj);
    tmpa.click();
    setTimeout(function () {
        URL.revokeObjectURL(obj);
    }, 100);
  }

  private parsing(data: any) {
    const allTrs = data.querySelectorAll('tr');
    const subTrs = data.querySelectorAll('table table tr');

    const nowAllTrs = Array.from(allTrs);
    const nowSubTrs = Array.from(subTrs);

    allTrs.forEach((tr, index) => {
      if (nowSubTrs.find(subTr => subTr === tr)) {
        tr.classList.add('hasFather');
      } else if (tr.querySelectorAll('table').length > 0) {
        allTrs[index - 1].classList.add('hasChildren');
      }
    });
  }

  private ParsingNestedTable(data: any): Table {
    // ToDo 將 table html or DOM 轉成 Table 結構
    this.parsing(data);

    const result: Table = new Table();
    result.rows = [];
    const trs = data.querySelectorAll('table tr');
    // debugger

    trs.forEach((tr, rowIndex) => {
      if (tr.innerText.includes('暂无数据') || tr.cells.length === 1) {  // 去掉框架空白的行和去掉框架多餘的總行
        return;
      }
      if (tr.className.includes('hasFather')) {  // 去掉框架的子數據
        return;
      }

      const newRow: Row = this.handleCell(tr);

      this.handleChildren(newRow, tr, trs[rowIndex + 1]);    // tr有子數據，trs[rowIndex + 1]為子數據總和

      result.rows.push(newRow);
    });

    return result;
  }

  private handleChildren(row: Row, fatherTr: HTMLTableRowElement, childrenTr: HTMLTableRowElement) {
    if (fatherTr.className.includes('hasChildren')) {  // 該行有子數據
      row.subTable = new Table();
      row.subTable.rows = [];
      const subTables = childrenTr.getElementsByTagName('table');
      const subTrs = subTables[0].getElementsByTagName('tr');
      const newSubTrs: HTMLTableRowElement[] = [].slice.call(subTrs);

      newSubTrs.forEach((subTr, subTrIndex) => {
        if (subTr.innerText.includes('暫無數據')) {
          return ;
        }
        const newSubRow: Row = this.handleCell(subTr);
        row.subTable.rows.push(newSubRow);
        this.handleChildren(newSubRow, subTr, newSubTrs[subTrIndex + 1]);
      });
    }
  }

  private handleCell(row: HTMLTableRowElement): Row {
    const ths = [].slice.call(row.getElementsByTagName('th'));
    const tds = [].slice.call(row.getElementsByTagName('td'));
    const newRow = new Row();
    newRow.items = [];

    if (ths.length > 0 && tds.length === 0) {
      newRow.isHeader = true;
      ths.forEach((th, colIndex) => {
        const cell = new Cell();
        cell.rowSpan = th.rowSpan;
        cell.colSpan = th.colSpan;
        cell.value = th.innerText;
        newRow.items.push(cell);
      });
    } else if (ths.length === 0 && tds.length > 0) {
      newRow.isHeader = false;
      tds.forEach((td, colIndex) => {
        const cell = new Cell();
        cell.rowSpan = td.rowSpan;
        cell.colSpan = td.colSpan;
        cell.value = td.innerText;
        newRow.items.push(cell);
      });
    }

    return newRow;
  }


  public s2ab (s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) { view[i] = s.charCodeAt(i) & 0xFF; }
    return buf;
  }


  private NestedJsonToExcel(table: Table, colorArr?: any[]): any {
    // 將 table格式轉成excel格式
    const book = {
      SheetNames: ['Sheet1'],
      Sheets: {
        'Sheet1': {
          '!merges': []
        }
      }
    };

    if (!colorArr) {
      throw new Error('must input color to table');
    }

    this.handlerTable(table, colorArr, 0, book, 0, 0);

    // add reference
    const keys: string[] = Object.keys(book.Sheets.Sheet1);
    book.Sheets.Sheet1['!ref'] = keys[1] + ':' + this.getMaxString(keys);

    return book;
  }

  private getMaxString(arr: string[]): string {
    const nowArr = arr.slice(1);
    let maxNum = nowArr[0].split('')[1];
    let maxStr = nowArr[0];
    for (const currentVal of nowArr) {
      const currentNum = currentVal.split('')[1];
      if (maxNum < currentNum) {
        maxNum = currentNum;
      }
      if (maxStr < currentVal) {
        maxStr = currentVal;
      }
    }
    return maxStr.split('')[0] + maxNum.toString();
  }

  private encode_row(row: number): string {
    return '' + (row + 1);
  }

  private encode_col(col) {
    let s = '';
    for (++col; col; col = Math.floor((col - 1) / 26)) {
      s = String.fromCharCode(((col - 1) % 26) + 65) + s;
    }
    return s;
  }

  private encode_cell(cell) {
    return this.encode_col(cell.c) + this.encode_row(cell.r);
  }

  private handlerTable(table: Table, colorArr: any[], index: number, book: any, sheetRowIndex: number, sheetColIndex: number) {
    if (index < colorArr.length) {
      for (let rowIndex = 0, len = table.rows.length; rowIndex < len; rowIndex++) {
        const row: Row = table.rows[rowIndex];
        sheetColIndex = 0;

        if (row.items.length === 0) { // 跳過空白的行
          continue;
        }

        for (let colIndex = 0, cellLen = row.items.length; colIndex < cellLen; colIndex++) {
          const cell: Cell = row.items[colIndex];

          /**求出下一行的列起始位置*/
          for (let midx = 0, mLen = book.Sheets.Sheet1['!merges'].length; midx < mLen; ++midx) {
            const m = book.Sheets.Sheet1['!merges'][midx];
            if (m.s.c === sheetColIndex && m.s.r <= sheetRowIndex && sheetRowIndex <= m.e.r) {
              sheetColIndex = m.e.c + 1;
              midx = -1;
            }
          }

          /**一行行的處理，字母改變
           * 行合併，導致起始的字母不同，
           * 列合併，導致下一個字母會有跳動
           * 才用遞歸處理每個單元數據的(merge, rowStart, colSkip)
           */
          if (cell.rowSpan > 1 || cell.colSpan > 1) {
            book.Sheets.Sheet1['!merges'].push({s: {r: sheetRowIndex, c: sheetColIndex}, e: {r: sheetRowIndex + cell.rowSpan - 1, c: sheetColIndex + cell.colSpan - 1} });
          }

          /**做鍵值 */
          let color: string;
          if (row.isHeader) {
            color = colorArr[index].header;
          } else {
            color = colorArr[index].body;
          }
          book.Sheets.Sheet1[this.encode_cell({c: sheetColIndex, r: sheetRowIndex})] = {v: cell.value, s: {fill: {bgColor: {indexed: 64}, fgColor: {rgb: color}}}};
          sheetColIndex += cell.colSpan;   // 同行跳過的列
        }

        if (row.subTable) {
          this.handlerTable(row.subTable, colorArr, index + 1, book, sheetRowIndex + 1, 0);
          sheetRowIndex += row.subTable.rows.length;
        }
        sheetRowIndex++;
      }
    }

  }



  public exportAsExcelFile(json: any, excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportTableAsExcelFile(data: any, excelName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    // const today = this.getDate();
    FileSaver.saveAs(data, fileName + '_' + EXCEL_EXTENSION);
  }

 parseFile(fileUrl: string, callback: Function) {
    return new Promise((res, rej) => {
      const req: XMLHttpRequest = new XMLHttpRequest();
      req.open('GET', fileUrl, true);
      req.responseType = 'arraybuffer';
      req.onload = (e) => {
        const data = new Uint8Array(req.response);
        const workBook = XLSXSTYLE.read(data, {type: 'array', cellStyles: true});
        if (callback && callback instanceof Function) {
          res(callback(workBook));
        }
      };
    req.send();
    });
  }
}
