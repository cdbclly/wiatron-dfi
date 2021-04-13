import { Component, OnInit } from '@angular/core';
import { IdbookanalyseService } from './idbookanalyse.service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-idbookanalyse',
  templateUrl: './idbookanalyse.component.html',
  styleUrls: ['./idbookanalyse.component.scss']
})
export class IdbookanalyseComponent implements OnInit {
  form = [];
  formParam = {};
  formList = [];
  parts = [];
  processes = [];
  operations = [];
  materials = [];
  crafts = [{ id: 1 }, { id: 2 }, { id: 3 }];
  formFlag = false;
  touchAnalyse = false;
  queryShow = true;
  site: any;
  url: any;
  projectName: any;
  rdId: any;
  product: any;

  constructor(private service: IdbookanalyseService, private message: NzMessageService) { }

  ngOnInit() {
  }

  // 分析
  analyse() {
    // flag控制分析頁是否打開
    let flag = true;
    // 判斷至少有一個工藝被選中
    let processFlag = true;
    this.form.forEach(item => {
      let i = 0;
      // 選擇工藝后
      if (item.process !== null) {
        processFlag = false;
        // 如果對應工藝的材料為空
        if (item.material === '') {
          flag = false;
          this.message.create('error', 'Please enter part:' + item.part.name + 'material parameters！');
          return;
          // 選中材料為Other
        } else if (item.material.desc === 'Other') {
          item.material.remark = null;
        }
        // 未選擇任意一個製程
        if (item.operation.length === 0) {
          flag = false;
          this.message.create('error', 'Please enter part:' + item.part.name + 'process parameters！');
          return;
        } else {
          // 遍歷該item下所有材料，如果找到Other選中，講其中的評論remark置為空
          item.operation.forEach(oper => {
            if (oper.name === 'Other') {
              oper.remark = null;
            }
          });
        }
        i++;
      }
    });
    // 當用戶未選擇任何一個工藝的時候
    if (processFlag) {
      this.message.create('error', 'Please enter analysis parameters！');
      return;
    }
    // 打開分析框
    if (flag) {
      this.touchAnalyse = true;
    }
  }

  // 獲取工藝列表
  getProcess() {
    this.service.getProcess(this.product)
      .subscribe(
        res => {
          this.processes = res;
          // 放值額外的Other選項
          this.processes.push({ id: null, name: 'Other' });
        });
  }

  // 獲取材料列表(form.poccess發生變化時觸發) i 定位用戶選中的位置
  getMaterial(i) {
    // 初始化 清空製程列表和材料列表 清空製程已選擇和材料已選擇
    this.form[i].operation = [];
    this.form[i].material = '';
    this.formList[i].materials = [];
    this.formList[i].operations = [];
    if (this.form[i] !== null || this.form[i] !== []) {
      // 如果為選中工藝
      if (this.form[i].process != null && this.form[i].process !== '') {
        // 允許材料框選擇
        this.form[i].materialFlag = true;
        // 拒絕製程框選擇
        this.form[i].operationFlag = false;
        // 如果選擇選項為Other 則放入Other選項至材料框中
        if (this.form[i].process.id === null) {
          this.formList[i].materials.push({ desc: 'Other', yieldRate: 0, id: null, remark: null });
          return;
        }
        // 發送HTTP請求通過工藝id獲取材料列表
        this.service.getMaterial(this.form[i].process.id)
          .subscribe(
            res => {
              this.formList[i].materials = res;
              // 材料列表中額外放值一個Other選項
              this.formList[i].materials.push({ desc: 'Other', yieldRate: 0, id: null, remark: null });
            });
        // 如果為清空Process
      } else {
        // 拒絕材料框和製程框輸入
        this.form[i].materialFlag = false;
        this.form[i].operationFlag = false;
      }
      // 分析頁關閉
      this.touchAnalyse = false;
    }
  }

  // 當form.material 發生變化時 獲取製程列表
  getOperations(i) {
    // 清空製程列表和已選擇項
    this.formList[i].operations = [];
    this.form[i].operation = [];
    // 選中materials裡面的選項時
    if (this.form[i].material != null && this.form[i].material !== '') {
      this.form[i].operationFlag = true;
      // 如果選中Other選項
      if (this.form[i].material.id === null) {
        // 在製程中添加Other選項
        this.formList[i].operations.push({ name: 'Other', yieldRate: 0, id: null, remark: null });
        return;
      }
      // 通過process獲取製程
      this.service.getOperation(this.form[i].process.id)
        .subscribe(
          res => {
            this.formList[i].operations = res;
            // 額外添加Other選項
            this.formList[i].operations.push({ name: 'Other', yieldRate: 0, id: null, remark: null });
          }
        );
      // 清空material已選擇項時
    } else {
      // 清空製程和製程列表 拒絕製程input輸入
      this.form[i].operation = [];
      this.formList[i].operations = [];
      this.form[i].operationFlag = false;
    }
    // 關閉分析框
    this.touchAnalyse = false;
  }
  onForm(event) {
    this.formFlag = event;
  }
  // 獲取queryform裡面的選中參數
  onFormParam(event) {
    this.formParam = event;
    // 選項判斷
    if (event['site'] === undefined || event['site'] === '') {
      this.formFlag = false;
      this.message.create('error', 'Please enter site parameters！');
    } else if (event['product'] === undefined || event['product'] === '') {
      this.formFlag = false;
      this.message.create('error', 'Please enter product parameters！');
    } else if (event['projectCode'] === undefined || event['projectCode'] === '') {
      this.formFlag = false;
      this.message.create('error', 'Please enter the project code parameters！');
    } else if (event['projectName'] === undefined || event['projectName'] === '') {
      this.formFlag = false;
      this.message.create('error', 'Please enter the project name parameters！');
    }
    this.projectName = event.projectName;
    this.site = event.site;
    this.url = event.url;
    this.rdId = event.rdId;
    this.product = event.product;
    // 通過Product獲取Part
    this.service.getPart(this.product).subscribe(
      res => {
        this.getProcess();
        this.parts = res;
        this.form = [];
        this.parts.forEach(part => {
          // 每有一個Part遍新增一行分析
          if (part.productId === event.product) {
            this.form.push({
              part: part,
              process: null,
              material: '',
              operation: [],
              materialFlag: false,
              operationFlag: false
            });
            // formList裡面會裝所有的製程材料list，每遍歷處一條part遍新增一條這個emmm
            this.formList.push({
              'operations': [],
              'materials': [],
            });
          }
        });
      });
  }
}
