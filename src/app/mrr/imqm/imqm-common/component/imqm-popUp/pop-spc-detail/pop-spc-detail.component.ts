import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ToolkitService } from '../../../service';

@Component({
  selector: 'app-pop-spc-detail',
  templateUrl: './pop-spc-detail.component.html',
  styleUrls: ['./pop-spc-detail.component.scss']
})
export class PopSpcDetailComponent implements OnInit, OnChanges {

  @Input() data;
  isVisible = false;
  footer = null;
  cancelOK = false;
  rawData;
  maxHeadWidth;
  maxHeadWidthOther;
  subDetailFormHeadWidth; // SPC.CPK樣式
  subDetailFormHeadWidthOthers; // Abnormal, track樣式
  constructor(private toolService: ToolkitService) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['data']);
    if (changes['data'].firstChange) {
      this.isVisible = true;
    } else {
      this.isVisible = true;
      console.log(changes['data'].currentValue);
      console.log(JSON.parse(changes['data'].currentValue['rawData']));
      this.rawData = JSON.parse(changes['data'].currentValue['rawData']);
      this.data = changes['data'].currentValue['form'];
      console.log(this.data);
      if (changes['data'].currentValue['form']['objName'] === 'abnormal') {
        this.buildTableAbnormal();
      } else if (changes['data'].currentValue['form']['objName'] === 'fakeData') {
      } else {
        this.buildTable();
      }
    }
  }
  ngOnInit() {
  }

  buildTableAbnormal() {
    const originWidth = ['50px'];
    console.log(this.rawData);
    if (this.rawData['RawData'][0]['sizeData']) {
      this.maxHeadWidth = [
        {
          len: this.rawData['RawData'][0]['sizeData'].length,
          somePx: '50px'
        },
        {
          len: this.rawData['RawData'][0]['deformationData'] ? this.rawData['RawData'][0]['deformationData'].length : 0,
          somePx: '50px'
        }
      ];
      this.maxHeadWidthOther = [
        {
          len: this.rawData['RawData'][0]['sizeData'].length,
          somePx: '50px'
        },
        {
          len: this.rawData['RawData'][0]['deformationData'] ? this.rawData['RawData'][0]['deformationData'].length : 0,
          somePx: '50px'
        }
      ];
    }
    const originWidthOther = ['80px', '120px', '70px'];
    this.subDetailFormHeadWidthOthers = this.toolService.assembleHeadWidth(originWidthOther, this.maxHeadWidthOther);
  }

  buildTable() {
    // debugger;
    const originWidth = ['50px'];
    if (this.rawData['size']) {
      this.maxHeadWidth = [
        {
          len: this.rawData['size'].length,
          somePx: '50px'
        },
        {
          len: this.rawData['deformation'] ? this.rawData['deformation'].length : 0,
          somePx: '50px'
        }
      ];
      this.maxHeadWidthOther = [
        {
          len: this.rawData['size'].length,
          somePx: '50px'
        },
        {
          len: this.rawData['deformation'] ? this.rawData['deformation'].length : 0,
          somePx: '50px'
        }
      ];
    } else {
      this.maxHeadWidth = [
        {
          len: this.rawData[0]['size'].length,
          somePx: '50px'
        },
        {
          len: this.rawData[0]['deformation'] ? this.rawData[0]['deformation'].length : 0,
          somePx: '50px'
        }
      ];
      this.maxHeadWidthOther = [
        {
          len: this.rawData[0]['size'].length,
          somePx: '50px'
        },
        {
          len: this.rawData[0]['deformation'] ? this.rawData[0]['deformation'].length : 0,
          somePx: '50px'
        }
      ];
    }
    const originWidthOther = ['80px', '120px', '70px'];
      this.subDetailFormHeadWidthOthers = this.toolService.assembleHeadWidth(originWidthOther, this.maxHeadWidthOther);
    // }
    this.subDetailFormHeadWidth = this.toolService.assembleHeadWidth(originWidth, this.maxHeadWidth);
    console.log(this.subDetailFormHeadWidth);

  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

}
