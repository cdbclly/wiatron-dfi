import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class ExceljsService {
  objectKeys = Object.keys;
  objectValue = Object.values;
  constructor(
    private datePipe: DatePipe
  ) { }

  /**
   * @param selectData excel 1~3行 数据筛选条件数组
   * @param headerDatas 表头数组
   * @param  contentDatas 表内容数组
   * @param headerMerges 表头指定的特殊合并
   * @param contentMerges 表内容指定的特殊合并
   * @param title excel的名称
   * @param contentBackground 表内容有几行需要添加背景颜色
   */
  export(selectData, headerDatas, contentDatas, headerMerges, contentMerges, title, contentBackground?) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('DownLoad Data');
    // 头部 指定的不需要合并的单元格
    const constHeaderArray = headerMerges;
    // 内容 指定的不需要合并的单元格
    const constContentArray = contentMerges;


    // 筛选条件数组
    // 表头数据赋值
    const selectArray = [];
    selectData.forEach(ele => {
      selectArray.push(worksheet.addRow(ele));
    });
    for (let i = 0; i < selectArray.length; i++) {
      selectArray[i].eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          // 设置表头背景颜色
          fgColor: { argb: '008000' },
          bgColor: { argb: '008000' }
        };
        cell.font = {
          bold: true,
          // 设置表头的字体颜色
          color: { argb: 'FFFFFF' },
          // size: 18,
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          // 设置边框粗细
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
          color: { argb: '000000' }
        };
      });
    }



    // 表头
    const headerData = headerDatas;
    // 如果表头存在数据，才下载
    if (headerData.length > 0) {
      // 表头表格合并数组
      const marges = this.merges(constHeaderArray, selectArray.length + 1, headerData.length, headerData[0].length - constHeaderArray.length);
      // 表头数据赋值
      const array = [];
      headerData.forEach(ele => {
        array.push(worksheet.addRow(ele));
      });
      for (let i = 0; i < array.length; i++) {
        array[i].eachCell((cell) => {
          if (i < array.length) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              // 设置表头背景颜色
              fgColor: { argb: '006400' },
              bgColor: { argb: '006400' }
            };
          }
          cell.font = {
            bold: true,
            // 设置表头的字体颜色
            color: { argb: 'FFFFFF' },
            // size: 18,
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            // 设置边框粗细
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
            color: { argb: '000000' }
          };
        });
      }
      // 合并表头
      // this.mergeCells(worksheet, marges);
      this.mergeCells(worksheet, headerMerges);
    }


    // 表内容
    const contentData = contentDatas;
    // 表内容合并数组
    const contentmarges = this.merges(constContentArray, headerData.length + selectArray.length + 1, contentData.length + headerData.length + 1, contentData[0].length - constContentArray.length);
    // 表内容数据赋值
    const contentarray = [];
    contentData.forEach(ele => {
      contentarray.push(worksheet.addRow(ele));
    });
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < contentarray.length; i++) {
      contentarray[i].eachCell((cell) => {
        if (i < contentBackground) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            // 设置表头背景颜色
            fgColor: { argb: '006400' },
            bgColor: { argb: '006400' }
          };
          cell.border = {
            // 设置边框粗细
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
            color: { argb: '000000' }
          };
          cell.font = {
            bold: true,
            // 设置表头的字体颜色
            color: { argb: 'FFFFFF' },
          };
        }
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    }
    // 合并表内容
    // this.mergeCells(worksheet, contentmarges);


    // 设置单元格的宽度
    if (headerData.length > 0) {
      for (let i = 1; i <= headerData[0].length; i++) {
        if (i < headerMerges.length + 1) {
          // 设置指定单元格的宽度
          // if (i === 1) {
          //   worksheet.getColumn(i).width = 30;
          // } else {
          //   worksheet.getColumn(i).width = 20;
          // }
          worksheet.getColumn(i).width = 20;
        } else {
          worksheet.getColumn(i).width = 20;
        }
      }
    }
    const d = new Date();
    const date = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
      fs.saveAs(blob, title + '_' + date + '.xlsx');
    });
  }

  mergeCells(worksheet, marges) {
    for (const marge of marges) {
      worksheet.mergeCells(marge);
    }
  }


  /**
   * @param constArray 不需要合并的单元格数组
   * @param rowStart 从哪一行开始合并
   * @param  rowCount 合并多少行
   * @param colLength 需要合并多少列
   */
  merges(constArray, rowStart, rowLength, colLength) {
    let merges = constArray;
    for (let j = rowStart; j < rowLength; j++) {
      for (let i = 0; i < colLength; i += 2) { // 有多少列需要合并
        let first;
        let second;
        let third;
        const num = constArray.length + i;
        if (num / 26 < 1) {
          first = '';
          second = String.fromCharCode(65 + (num % 26));
        } else {
          // tslint:disable-next-line: radix
          first = String.fromCharCode(65 + parseInt((num / 26).toString()) - 1);
          second = String.fromCharCode(65 + (num % 26));
        }
        const letter1 = '' + first + second + j.toString();
        if ((num + 1) % 26 === 0) {
          // tslint:disable-next-line: radix
          first = String.fromCharCode(65 + parseInt((num / 26).toString()));
        }
        if ((num + 1) / 26 < 1) {
          third = String.fromCharCode(65 + ((num + 1) % 26));
        } else {
          third = String.fromCharCode(65 + ((num + 1) % 26));
        }
        const letter2 = '' + first + third + j.toString();
        merges = [...merges, '' + letter1 + ':' + letter2];
      }
    }
    // console.log('merges \n', merges);
    return merges;
  }


  /**
  * @param headerItemDic 后端发送来的表头测试项数据
  */
  getHeaderItem(headerItemDic: object) {
    const maxHeaderArr = [];
    const keysArr = this.objectKeys(headerItemDic);
    for (const item of keysArr) {
      if (headerItemDic[item] && headerItemDic[item].length > 0) {
        maxHeaderArr.push.apply(maxHeaderArr, headerItemDic[item]);
      }
    }
    return maxHeaderArr;
  }




  /**
  * @param headerItemDic 后端发送来的表头测试项数据
  * @param tableContentArr 上下限原始数据
  * @param choose 选择是哪种table  默认0:良率； 1：异常, 2:追溯
  */
  getUpperLimitData(headerItemDic: object, tableContentArr: Array<any>, choose?: number, dataObj?) {
    if (!choose) {
      choose = 0;
    }
    const testItemTemp = this.getHeaderItem(headerItemDic);
    const newTableData = []; // 存入整理后的表数据
    const keysArr = this.objectKeys(headerItemDic);
    // console.log('表头测试项key == \n', keysArr);
    let tempUpperLower = []; // 存储上下限的数据
    let machineID = [];
    let tableContent = []; // 整理后的表数据

    for (const data of tableContentArr) { // 循环table内容有多少行
      const tempData = []; // 每一行的表内容数据
      if (choose == 0) {
        tempData.push(data['_source']['unitSerialNumber']); // 产品条码
        tempData.push(this.datePipe.transform(data['_source']['executionTime'], 'yyyy/MM/dd HH:mm:ss') ? this.datePipe.transform(data['_source']['executionTime'], 'yyyy/MM/dd HH:mm:ss') : 'N/A'); // 日期
        tempData.push(data['_source']['sizeResult']); // 检验结果
      }
      if (choose == 1) {
        tempData.push(data['unitSerialNumber']); // 产品条码
        const timeTemp = data['executionTime'] ? data['executionTime'] :data['eventDate'];
        tempData.push(this.datePipe.transform(timeTemp, 'yyyy/MM/dd HH:mm:ss') ? this.datePipe.transform(timeTemp, 'yyyy/MM/dd HH:mm:ss') : 'N/A'); // 日期
        tempData.push(data['result']); // 检验结果
      }
      if (choose == 2) {
        tempData.push(data['name']); // "Supplier"
        tempData.push(dataObj['sn']) // SN
        tempData.push(this.datePipe.transform(data['time'], 'yyyy/MM/dd HH:mm:ss') ? this.datePipe.transform(data['time'], 'yyyy/MM/dd HH:mm:ss') : 'N/A'); // 日期
        tempData.push(data['result']); // 检验结果
      }

      for (const item of keysArr) { // keysArr 一共有多少测试项组

        let tempDic;
        if (choose == 0) {
          tempDic = data['_source'][item]
        }
        if (choose == 1) {
          tempDic = data[item]
        }
        if (choose == 2) {
          if (item === 'sizeData') {
            tempDic = data['size']
          } else {
            tempDic = data[item]
          }

        }
        if (headerItemDic[item] && headerItemDic[item].length > 0) {
          for (let j = 0; j < headerItemDic[item].length; j++) {
            let keyItem, upperKey, lowerKey, machineId;
            if (item === 'sizeData') {
              keyItem = 'sizeName';
              upperKey = 'sizeUpperLimit';
              lowerKey = 'sizeLowerLimit';
              machineId = 'sizeMachineID';
            } else if (item === 'deformationData') {
              keyItem = 'deformationName';
              upperKey = 'deformationUpperLimit';
              lowerKey = 'deformationLowerLimit';
              machineId = 'deformationMachineID';
            } else if (item === 'visualizationData') {
              keyItem = 'visualizationName';
              machineId = 'visualizationMachineID';
            } else if (item === 'measurementData') {
              keyItem = 'measurementName';
              upperKey = 'measurementUpperLimit';
              lowerKey = 'measurementLowerLimit';
              machineId = 'measurementMachineID';
            } else {
              keyItem = 'countName';
              machineId = 'countMachineID';
            }
            const obj = tempDic.filter(res => { return res[keyItem] === headerItemDic[item][j] });
            if (obj.length > 0) { // 如果存在，则该测试项存在数据

              // sizeData
              if (obj[0].hasOwnProperty('sizeLowerLimit')) {
                // 存入表内容显示数据
                tempData.push(obj[0]['size'].toFixed(2));
                // 存入上下限
                if (tempUpperLower.length !== testItemTemp.length) {
                  tempUpperLower.push(obj[0][lowerKey].toFixed(2) + '    |    ' + obj[0][upperKey].toFixed(2));
                } else {
                  if (choose === 2) {
                    if (tempUpperLower[tempData.length - 5] === '    |    ') {
                      tempUpperLower[tempData.length - 5] = (obj[0][lowerKey].toFixed(2) + '    |    ' + obj[0][upperKey].toFixed(2));
                    }
                  } else {
                    if (choose === 2) {
                      if (tempUpperLower[tempData.length - 5] === '    |    ') {
                        tempUpperLower[tempData.length - 5] = (obj[0][lowerKey].toFixed(2) + '    |    ' + obj[0][upperKey].toFixed(2));
                      }
                    } else {
                      if (tempUpperLower[tempData.length - 4] === '    |    ') {
                        tempUpperLower[tempData.length - 4] = (obj[0][lowerKey].toFixed(2) + '    |    ' + obj[0][upperKey].toFixed(2));
                      }
                    }
                  }
                }
                // 存入上machineID
                if (machineID.length !== testItemTemp.length) {
                  machineID.push(obj[0][machineId]);
                } else {
                  if (choose === 2) {
                    if (machineID[tempData.length - 5] === '') {
                      machineID[tempData.length - 5] = (obj[0][machineId]);
                    }
                  } else {
                    if (machineID[tempData.length - 4] === '') {
                      machineID[tempData.length - 4] = (obj[0][machineId]);
                    }
                  }
                }
              }

              // deformationData
              if (obj[0].hasOwnProperty('deformationLowerLimit')) {
                // 存入表内容显示数据
                tempData.push(obj[0]['deformation'].toFixed(2));
                // 存入上下限
                if (tempUpperLower.length !== testItemTemp.length) {
                  tempUpperLower.push(obj[0][lowerKey].toFixed(2) + '    |    ' + obj[0][upperKey].toFixed(2));
                } else {
                  if (choose === 2) {
                    if (tempUpperLower[tempData.length - 5] === '    |    ') {
                      tempUpperLower[tempData.length - 5] = (obj[0][lowerKey].toFixed(2) + '    |    ' + obj[0][upperKey].toFixed(2));
                    }
                  } else {
                    if (choose === 2) {
                      if (tempUpperLower[tempData.length - 5] === '    |    ') {
                        tempUpperLower[tempData.length - 5] = (obj[0][lowerKey].toFixed(2) + '    |    ' + obj[0][upperKey].toFixed(2));
                      }
                    } else {
                      if (tempUpperLower[tempData.length - 4] === '    |    ') {
                        tempUpperLower[tempData.length - 4] = (obj[0][lowerKey].toFixed(2) + '    |    ' + obj[0][upperKey].toFixed(2));
                      }
                    }
                  }
                }
                // 存入machineID
                if (machineID.length !== testItemTemp.length) {
                  machineID.push(obj[0][machineId]);
                } else {
                  if (choose === 2) {
                    if (machineID[tempData.length - 5] === '') {
                      machineID[tempData.length - 5] = (obj[0][machineId]);
                    }
                  } else {
                    if (machineID[tempData.length - 4] === '') {
                      machineID[tempData.length - 4] = (obj[0][machineId]);
                    }
                  }
                }
              }

              // "visualizationData"
              if (obj[0].hasOwnProperty('visualizationResult')) {
                // 存入表内容显示数据
                tempData.push(obj[0]['visualizationResult']);
                // 存入上下限
                if (tempUpperLower.length !== testItemTemp.length) {
                  tempUpperLower.push('    |    ');
                }
                // 存入machineID
                if (machineID.length !== testItemTemp.length) {
                  machineID.push(obj[0][machineId]);
                } else {
                  if (choose === 2) {
                    if (machineID[tempData.length - 5] === '') {
                      machineID[tempData.length - 5] = (obj[0][machineId]);
                    }
                  } else {
                    if (machineID[tempData.length - 4] === '') {
                      machineID[tempData.length - 4] = (obj[0][machineId]);
                    }
                  }
                }
              }

              // "measurementData"
              if (obj[0].hasOwnProperty('measurementLowerLimit')) {
                // 存入表内容显示数据
                tempData.push(obj[0]['measurement'].toFixed(2));
                // 存入上下限
                if (tempUpperLower.length !== testItemTemp.length) {
                  tempUpperLower.push(obj[0][lowerKey].toFixed(2) + '    |    ' + obj[0][upperKey].toFixed(2));
                } else {
                  if (choose === 2) {
                    if (tempUpperLower[tempData.length - 5] === '    |    ') {
                      tempUpperLower[tempData.length - 5] = (obj[0][lowerKey].toFixed(2) + '    |    ' + obj[0][upperKey].toFixed(2));
                    }
                  } else {
                    if (choose === 2) {
                      if (tempUpperLower[tempData.length - 5] === '    |    ') {
                        tempUpperLower[tempData.length - 5] = (obj[0][lowerKey].toFixed(2) + '    |    ' + obj[0][upperKey].toFixed(2));
                      }
                    } else {
                      if (tempUpperLower[tempData.length - 4] === '    |    ') {
                        tempUpperLower[tempData.length - 4] = (obj[0][lowerKey].toFixed(2) + '    |    ' + obj[0][upperKey].toFixed(2));
                      }
                    }
                  }
                }
                // 存入machineID
                if (machineID.length !== testItemTemp.length) {
                  machineID.push(obj[0][machineId]);
                } else {
                  if (choose === 2) {
                    if (machineID[tempData.length - 5] === '') {
                      machineID[tempData.length - 5] = (obj[0][machineId]);
                    }
                  } else {
                    if (machineID[tempData.length - 4] === '') {
                      machineID[tempData.length - 4] = (obj[0][machineId]);
                    }
                  }
                }
              }

              // "countData"
              if (obj[0].hasOwnProperty('countResult')) {
                // 存入表内容显示数据
                tempData.push(obj[0]['countResult']);
                // 存入上下限
                if (tempUpperLower.length !== testItemTemp.length) {
                  tempUpperLower.push('    |    ');
                }
                // 存入machineID
                if (machineID.length !== testItemTemp.length) {
                  machineID.push(obj[0][machineId]);
                } else {
                  if (choose === 2) {
                    if (machineID[tempData.length - 5] === '') {
                      machineID[tempData.length - 5] = (obj[0][machineId]);
                    }
                  } else {
                    if (machineID[tempData.length - 4] === '') {
                      machineID[tempData.length - 4] = (obj[0][machineId]);
                    }
                  }
                }
              }
            } else {
              tempData.push('');
              // 存入上下限
              if (tempUpperLower.length !== testItemTemp.length) {
                tempUpperLower.push('    |    ');
              }
              // 存入machineID
              if (machineID.length !== testItemTemp.length) {
                machineID.push('');
              }
            }
          }
        }
      }
      tableContent.push(tempData);
    }
    newTableData['testItem'] = testItemTemp;
    newTableData['upperLower'] = tempUpperLower;
    newTableData['machineId'] = machineID;
    newTableData['tableContent'] = tableContent;
    // console.log('整理的 newtable内容-------- \n', newTableData);
    return newTableData;
  }
}
