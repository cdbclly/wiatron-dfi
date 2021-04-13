import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DocumentApi, ProductDocumentApi, ProductDocumentInterface } from '@service/mrr-sdk';
import { MemberApi } from '@service/dfc_sdk/sdk';

@Injectable({
  providedIn: 'root'
})
export class MrrDocAuthService {

  constructor(
    private documentApi: DocumentApi,
    private productDocumentApi: ProductDocumentApi,
    private memberApi: MemberApi
  ) { }

  /**
   * 獲取MmeberList
   *
   * @returns {Observable<any>}
   * @memberof MrrDocAuthService
   */
  getMemberList(): Observable<any> {
    return this.memberApi.find({
      'fields': ['EmpID', 'Name', 'EName', 'Role']
    }).pipe(map(members => {
      return members.map(member => {
        return {
          'Label': member['EName'] ? member['EName'] : member['EmpID'],
          'Value': member['EmpID'],
          'Name': member['Name'],
          'Show': member['EmpID'] + '\t' + member['Name'] + '\t' + member['EName'],
          'Role': member['Role']
        };
      });
    }));
  }

  async queryTable(plant, productType, docType) {
    const docDatas = await this.productDocumentApi.find<ProductDocumentInterface>({ where: { plant: plant, productId: productType }, include: { 'document': 'documentType' } }).toPromise();
    const dataSet = [];
    docDatas.filter(y => y['document']['documentType']['typeId'] === docType).forEach(proDoc => {
      dataSet.push({
        'proDocID': proDoc['productDocumentId'],
        'docName': proDoc['document']['documentName'],
        'docID': proDoc['document']['documentId'],
        'PIC': proDoc['PIC'].split(','),
        'PICUnit': proDoc['PICUnit'],
        'PICLeader1': proDoc['PICLeader1'].split(','),
        'PICLeader2': proDoc['PICLeader2'].split(','),
        'siteUser1': proDoc['siteUser1'],
        'siteUser2': proDoc['siteUser2'],
        'siteUser3': proDoc['siteUser3'],
        'siteUser4': proDoc['siteUser4'],
        'siteUser5': proDoc['siteUser5'],
        'stageCheckBox': [
          { label: 'C3', value: 'C3', checked: (!!proDoc['C3'] ? true : false) },
          { label: 'C4', value: 'C4', checked: (!!proDoc['C4'] ? true : false) },
          { label: 'C5', value: 'C5', checked: (!!proDoc['C5'] ? true : false) }
        ]
      });
    });
    return dataSet;
  }

  /**
   * 新增保存
   *
   * @param {*} addContent
   * @param {*} productType
   * @param {*} plant
   * @param {*} docTypeID
   * @returns {Promise<any>}
   * @memberof MrrDocAuthService
   */
  async addSave(addContent, addStage, addPICUnit, productType, plant, docTypeID): Promise<any> {
    // 1.存儲文件名稱
    // 1.1 判斷是否有值
    const docFlag = await this.documentApi.find({
      'where': {
        'and': [
          { 'documentTypeId': docTypeID },
          { 'documentName': addContent['docName'].value }
        ]
      }
    }).toPromise().then(datas => {
      if (datas.length > 0) {
        return { flag: false, documentId: datas[0]['documentId'] };
      } else {
        return { flag: true };
      }
    });
    let documentId;
    if (!docFlag.flag) {
      documentId = docFlag.documentId;
    } else {
      const docSaveInfo = await this.documentApi.create({
        'documentTypeId': docTypeID,
        'documentName': addContent['docName'].value
      }).toPromise().then(data => {
        console.log('存入Document表成功...');
        return { 'flag': true, 'data': data };
      }).catch(error => {
        console.log(error);
        return { 'flag': false, 'data': error };
      });
      if (!docSaveInfo.flag) {
        return { 'flag': 'error', 'msg': '請檢查文件名稱是否正確，與符合標準..' };
      }
      documentId = docSaveInfo.data['documentId'];
    }
    // 2.存儲對應的PIC信息
    const proDoc = {
      'documentId': documentId,
      'productId': productType,
      'PICUnit': addPICUnit
    };
    for (const key in addContent) {
      if (addContent.hasOwnProperty(key) && key !== 'docName') {
        const content = addContent[key];
        proDoc[key] = content.value;
      }
    }
    addStage.forEach(stage => {
      proDoc[stage['value']] = stage['checked'];
    });
    proDoc['plant'] = plant;
    const proDocInfo = await this.productDocumentApi.create(proDoc).toPromise().then(data => {
      console.log('存入ProductDocument表成功...');
      return { 'flag': 'success', 'data': data, 'msg': '新增成功!' };
    }).catch(error => {
      console.log(error);
      return { 'flag': 'error', 'data': error, 'msg': '請檢查pic與user是否正確!' };
    });
    return proDocInfo;
  }

  /**
   * 編輯保存
   *
   * @param {*} editCache
   * @param {*} proDocID
   * @returns {Observable<any>}
   * @memberof MrrDocAuthService
   */
  editSave(editCache, proDocID): Observable<any> {
    const stageCheckBox = [...editCache['stageCheckBox']];
    const param = { ...editCache };
    delete param['stageCheckBox'];
    stageCheckBox.forEach(data => {
      param[data.value] = data.checked;
    });
    return this.productDocumentApi.patchAttributes(proDocID, param);
  }

  /**
   * 刪除數據
   *
   * @param {*} proDocID
   * @returns {Observable<any>}
   * @memberof MrrDocAuthService
   */
  delete(proDocID): Observable<any> {
    return this.productDocumentApi.deleteById(proDocID);
  }
}
