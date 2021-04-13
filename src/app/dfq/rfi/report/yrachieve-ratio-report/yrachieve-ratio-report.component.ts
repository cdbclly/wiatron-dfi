import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-yrachieve-ratio-report',
  templateUrl: './yrachieve-ratio-report.component.html',
  styleUrls: ['./yrachieve-ratio-report.component.scss']
})
export class YrachieveRatioReportComponent implements OnInit {


  // 查詢時的下拉框設定
  // 廠別相關
  plantSelectValue: string;
  listOfPlantSelectOption = []; // 下拉框内容
  plantSearchChange$ = new BehaviorSubject('');
  isPlantListLoading = false;

  // add 客戶相關
  customerSelectValue: string;
  listOfCustomerSelectOption = []; // 下拉框内容
  isCustomerListLoading = false;
  customerSearchChange$ = new BehaviorSubject('');
  customerSelectFlag = true; // 下拉框 是否可用

  // 產品相關
  modelTypeSelectValue;
  listOfModelTypeSelectOption = []; // 下拉框内容
  modelTypeSearchChange$ = new BehaviorSubject('');
  isModelTypeListLoading = false;
  modelTypeSelectFlag = true; // 下拉框 是否可用
  // ModelFamily相關
  modelFamilySelectValue = [];
  modelFamilySelectValues: string;
  listOfModelFamilySelectOption = []; // 下拉框内容
  modelFamilySearchChange$ = new BehaviorSubject('');
  isModelFamilyListLoading = false;
  modelFamilySelectFlag = true; // 下拉框 是否可用
  // ModelName相關
  modelNameSelectValue;
  modelNameSelectValues: string;
  listOfModelNameSelectOption = []; // 下拉框内容
  modelNameSearchChange$ = new BehaviorSubject('');
  isModelNameListLoading = false;
  // C流程相關
  cFlowSelectValue = 'RFQ'; // 下拉框選中的值
  cFlowSelectValues: string;
  // ['RFQ', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
  listOfCFlowSelectOption = ['RFQ'];  // 下拉框内容
  cFlowSelectFlag = true; // 下拉框 是否可用

  // 達標狀況
  listOfStatus = ['達標', '未達標'];

  constructor() { }

  ngOnInit() {
  }

  onPlantSearch(value: string): void {
    this.isPlantListLoading = true;
    this.plantSearchChange$.next(value);
  }

  onCustomerSearch(value: string): void {
    this.isCustomerListLoading = true;
    this.customerSearchChange$.next(value);
  }

  // 廠別下拉框選中改變后, 查詢出 產品
  changePlant() {
    console.log(this.plantSelectValue);
    this.customerSelectFlag = false;
    this.modelTypeSelectFlag = false;
    this.modelFamilySelectFlag = true;
    this.cFlowSelectFlag = true;

    this.customerSelectValue = '';
    this.modelFamilySelectValue = [];
    this.modelNameSelectValue = [];
    this.modelNameSelectValue = '';

    // 廠別選擇完畢，重新更新客戶別
    this.isCustomerListLoading = true;
    this.customerSearchChange$.next('');
  }

  // 產品
  onModelTypeSearch(value: string): void {
    this.isModelTypeListLoading = true;
    this.modelTypeSearchChange$.next(value);
  }

  // Model Name
  onModelNameSearch(value: string): void {
    this.isModelNameListLoading = true;
    this.modelNameSearchChange$.next(value);
  }

  // 產品 下拉框選中改變后, 查詢出 ModelFamily
  changeModelType() {
    this.modelFamilySelectFlag = false;
    this.cFlowSelectFlag = true;
    this.modelFamilySelectValue = [];
    this.modelNameSelectValue = [];
    this.cFlowSelectValue = 'RFQ';
  }

  queryFirstEchart() {

  }

  changeCustomer() {
    this.modelTypeSelectFlag = false;
    this.modelFamilySelectFlag = true;
    this.cFlowSelectFlag = true;

    this.modelTypeSelectValue = '';
    this.modelFamilySelectValue = [];
    this.modelNameSelectValue = [];

  }

  changeModelName(value) {
  }

  download() {

  }
}
