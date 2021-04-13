import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ContainerApi } from './dfi-sdk';
// DFC SDK
import { LoopBackConfig as DFCLoopBackConfig } from '@service/dfc_sdk/sdk';
// DFI SDK
import { LoopBackConfig as DFILoopBackConfig } from '@service/dfi-sdk';
@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private http: HttpClient,
    private containerService: ContainerApi) { }

  postMRRFile(fileToUpload: File, container, fileName: string) {
    const token = localStorage.getItem('$DFI$token').toString();
    const apiURL = DFILoopBackConfig.getPath().toString();
    const endpoint = apiURL + `/api/containers/${container}/upload`;
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileName);
    formData.append('token', token);
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': token
      })
    };
    return this.http.post(endpoint, formData, httpOptions);
  }

  // MRR 產品標準文件上傳管理
  postMRRDocFile(fileToUpload: File[], container) {
    const token = localStorage.getItem('$DFI$token').toString();
    const apiURL = DFILoopBackConfig.getPath().toString();
    const endpoint = apiURL + `/api/containers/${container}/upload`;
    const formData: FormData = new FormData();
    fileToUpload.forEach(file => formData.append('fileKey', file));
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': token
      })
    };
    return this.http.post(endpoint, formData, httpOptions);
  }

  downloadMRRFile(container?: string, fileName?: string) {
    const apiURL = DFILoopBackConfig.getPath().toString();
    const apiLink = apiURL + `/api/containers/${container}/download/${fileName}`;
    window.open(apiLink);
  }

  deleteMRRFile(container?: string, fileName?: string) {
    return this.containerService.removeFile(container, fileName);
  }

  postDFCFile(fileToUpload: File, container: string, para?: any) {
    const apiURL = DFCLoopBackConfig.getPath().toString();
    const endpoint = apiURL + `/api/uploads/${container}/upload`;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    if (container === 'model') {
      formData.append('stageid', para.stageid);
      formData.append('process', para.process);
    } else if (container === 'project') {
      formData.append('role', para.role);
      formData.append('empID', para.empID);
      formData.append('empPlant', para.empPlant);
    }
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        // 'Authorization': token
      })
    };
    return this.http.post(endpoint, formData, httpOptions);
  }

  postPicture(fileToUpload: File, container: string) {
    const apiURL = DFCLoopBackConfig.getPath().toString();
    const endpoint = apiURL + `/api/uploads/${container}/upload`;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        // 'Authorization': token
      })
    };
    return this.http.post(endpoint, formData, httpOptions);
  }
  downloadDFCFile(process?: string, site?: string, modelType?: string, stageID?) {
    const apiURL = DFCLoopBackConfig.getPath().toString();
    const token = localStorage.getItem('$DFI$token').toString();
    let apiLink = apiURL + '/api/uploads/getTemplete?process=' + process + '&site=' + site + '&modelType=' + modelType;
    if (stageID) {
      apiLink += '&stageID=' + stageID;
    }
    apiLink += '&access_token=' + token;
    window.open(apiLink);
  }

  downloadStandart(process?: string, modelType?: string, material?: string, factor?: string, action?: string) {
    const apiURL = DFCLoopBackConfig.getPath().toString();
    const token = localStorage.getItem('$DFI$token').toString();
    let apiLink = apiURL + '/api/uploads/getTemplete?process=' + process + '&modelType=' + modelType;
    if (material) {
      apiLink += '&material=' + material;
    }
    if (factor) {
      apiLink += '&factor=' + factor;
    }
    if (action) {
      apiLink += '&action=' + action;
    }
    apiLink += '&access_token=' + token;
    window.open(apiLink);
  }

  downloadNewModel(projectNameIds) {
    let apiURL = DFCLoopBackConfig.getPath().toString();
    apiURL += '/api/ProjectCodeProfiles/DownloadProjectInfo';

    this.http.post(apiURL, 'ProjectNameIds=' + projectNameIds.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'arraybuffer'
    }
    ).subscribe(response => this.saveData(response, 'application/ms-excel', 'Projects.xlsx'));
  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type, });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed === 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }

  downloadAuthMember(empIDs?) {
    let apiURL = DFCLoopBackConfig.getPath().toString();
    apiURL += '/api/Members/download';
    this.http.get(apiURL, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: { 'EmpIds': empIDs.toString() },
      responseType: 'arraybuffer'
    }
    ).subscribe(response => {
      this.saveData(response, 'application/ms-excel', 'Member.xlsx');
      console.log(this.saveData(response, 'application/ms-excel', 'Member.xlsx'));
    });
  }

  saveData(data, type, fileName) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    const blob = new Blob([data], { type: type }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  downloadTargetOperation(stageID, process) {
    const apiURL = DFCLoopBackConfig.getPath().toString();
    const token = localStorage.getItem('$DFI$token').toString();
    let apiLink = apiURL + '/api/TargetOperations/download?stageID='
      + stageID + '&process=' + process;
    apiLink += '&access_token=' + token;
    window.open(apiLink);
  }

  downloadMOHConditions(plant, projectCode?, projectName?, modelName?) {
    const apiURL = DFCLoopBackConfig.getPath().toString();
    const token = localStorage.getItem('$DFI$token').toString();
    let apiLink = apiURL + '/api/MOHConditions/Download?plant='
      + plant;
    if (projectCode) {
      apiLink += '&projectCode=' + projectCode;
    }
    if (projectName) {
      apiLink += '&projectName=' + projectName;
    }
    if (modelName) {
      apiLink += '&modelName=' + modelName;
    }
    apiLink += '&access_token=' + token;
    window.open(apiLink);
  }

  downloadMOHAdditions(plant, projectCode?, projectName?, modelName?) {
    const apiURL = DFCLoopBackConfig.getPath().toString();
    const token = localStorage.getItem('$DFI$token').toString();
    let apiLink = apiURL + '/api/MOHAdditions/Download?plant='
      + plant;
    if (projectCode) {
      apiLink += '&projectCode=' + projectCode;
    }
    if (projectName) {
      apiLink += '&projectName=' + projectName;
    }
    if (modelName) {
      apiLink += '&modelName=' + modelName;
    }
    apiLink += '&access_token=' + token;
    window.open(apiLink);
  }

  downloadMOHReport(stageIDs, stage) {
    const apiURL = DFCLoopBackConfig.getPath().toString();
    const token = localStorage.getItem('$DFI$token').toString();
    let apiLink = apiURL + '/api/MOHs/download?stageIDs='
      + stageIDs;
    if (stage) {
      apiLink += '&stage=' + stage;
    }
    apiLink += '&access_token=' + token;
    window.open(apiLink);
  }

  downloadTargetOperationReport(stageIDs, plant, modelType) {
    const apiURL = DFCLoopBackConfig.getPath().toString();
    const token = localStorage.getItem('$DFI$token').toString();
    let apiLink = apiURL + '/api/TargetOperations/downloadReport?stageIDs='
      + stageIDs;
    if (plant) {
      apiLink += '&plant=' + plant;
    }
    if (modelType) {
      apiLink += '&modelType=' + modelType;
    }
    apiLink += '&access_token=' + token;
    window.open(apiLink);
  }

  postIMQMFile(fileToUpload: File, type: string) {
    const token = localStorage.getItem('$DFI$token').toString();
    const apiURL = DFILoopBackConfig.getPath().toString();
    const endpoint = apiURL + `/api/containers/imqm/upload`;
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, `${type}操作指南.pdf`);
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': token
      })
    };
    return this.http.post(endpoint, formData, httpOptions);
  }
}
