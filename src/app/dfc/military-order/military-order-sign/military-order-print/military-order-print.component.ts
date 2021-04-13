import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { MilitaryOrderSignService } from '../military-order-sign.service';
import { ActivatedRoute } from '@angular/router';
import { DfcCommonService } from 'app/shared/dfc-common/service/dfc-common.service';

@Component({
  selector: 'app-military-order-print',
  templateUrl: './military-order-print.component.html',
  styleUrls: ['./military-order-print.component.scss']
})
export class MilitaryOrderPrintComponent implements OnInit, OnChanges {
  @Input() queryValue: {
    proNameID: any,
    formNo: any,
    signIDs: any
  };
  table = {
    formCode: '',
    pic: '',
    imgSrc: '',
    customer: '',
    modelType: '',
    fcst: '',
    proName: '',
    proNameID: '',
    plantCapacity: '', // plant規模量
    size: '', // 機種尺寸
    modelList: [],
    c3: '', // C3時間
    c4: '', // C4時間
    c5: '', // C5時間
    mp: '', // MP時間
    IE: '',
    PME: '',
    PE: '',
    PSE: '',
    DFI_LEADER: '',
    GSQM: '',
    PQM: '',
    PLANT_MANAGER: '',
    EE: '',
    ME: '',
    SW: '',
    PM: '',
    PM_HEAD: '',
    BU_HEAD: ''
  };
  DFiLeaderFlag = false;
  isMohFAYield = false;
  downFlag = false;
  modelListPageCount = [];

  constructor(
    private militaryOrderSignService: MilitaryOrderSignService,
    private dfcCommonService: DfcCommonService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.DFILeader();
    this.route.params.subscribe(r => {
      if (!!r.proNameID && !!r.militaryOrderNo && !!r.signID) {
        this.query(r.proNameID, r.militaryOrderNo, r.signID);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['queryValue'] && changes['queryValue'].currentValue) {
      if (!!this.queryValue.signIDs && !!this.queryValue.proNameID) {
        this.query(this.queryValue.proNameID, this.queryValue.formNo, this.queryValue.signIDs);
      }
    }
  }

  // 判斷是否是 DFI Leader權限
  DFILeader() {
    this.dfcCommonService.DFILeader().subscribe(data => {
      this.DFiLeaderFlag = data['DFILeader'] || data['IsPlantLevel'];
    });
  }

  query(proNameID, militaryOrderNo, signIDs) {
    this.militaryOrderSignService.queryPrint(proNameID, militaryOrderNo, signIDs).then(data => {
      this.modelListPageCount = [];
      if (!!data) {
        this.table = data;
        const length = (data['modelList'].length - 3);
        if (length > 0) {
          for (let index = 0; index < (length / 10); index++) {
            this.modelListPageCount.push(1);
          }
        }
      }
    });
  }

  // btClick
  btClick() {
    this.downFlag = true;
    const data = document.getElementById('dfc-print');
    const width = data.offsetWidth; // 获取dom 宽度
    const height = data.offsetHeight; // 获取dom 高度
    const can = document.createElement('canvas'); // 创建一个canvas节点
    const scale = 2.5; // 定义任意放大倍数 支持小数
    can.width = width * scale; // 定义canvas 宽度 * 缩放
    can.height = height * scale; // 定义canvas高度 *缩放
    can.getContext('2d').scale(scale, scale); // 获取context,设置scale
    const opts = {
      scale: scale, // 添加的scale 参数
      canvas: can, // 自定义 canvas
      // logging: true, //日志开关，便于查看html2canvas的内部执行流程
      width: width, // dom 原始宽度
      height: height,
      useCORS: true // 开启跨域配置
    };
    html2canvas(data, opts).then(canvas => {
      // 【重要】关闭抗锯齿
      canvas.getContext('2d').mozImageSmoothingEnabled = false;
      canvas.getContext('2d').webkitImageSmoothingEnabled = false;
      canvas.getContext('2d')['msImageSmoothingEnabled'] = false;
      canvas.getContext('2d').imageSmoothingEnabled = false;
      // Few necessary setting options
      const imgWidth = 211;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      // const pageHeight = 298;
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const contentDataURL = canvas.toDataURL('image/png');
      // 一页pdf显示html页面生成的canvas高度;
      const pageHeight = canvas.width / 211 * 298;
      // 未生成pdf的html页面高度
      let leftHeight = canvas.height;
      let position = 0;
      // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      // 当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 298;
          // 避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      pdf.save('MilitaryOrder.pdf'); // Generated PDF  --- 下載
      this.downFlag = false;
    });
  }
}
