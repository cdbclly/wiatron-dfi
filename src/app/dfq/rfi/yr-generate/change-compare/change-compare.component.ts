import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { YrGenerateService } from '../yr-generate.service';

@Component({
  selector: 'app-change-compare',
  templateUrl: './change-compare.component.html',
  styleUrls: ['./change-compare.component.scss']
})
export class ChangeCompareComponent implements OnInit, OnChanges {

  material = '設計和改善因子對比';
  @Input() isVisiblePic;
  @Output() changeComCacel = new EventEmitter<any>();
  @Input() changeCompareMaterialId;
  @Input() projectName;
  @Input() plant;
  @Input() materialName;
  modalShow = false;
  factorTypes: any;
  history = [];
  modelHistory = [];
  showData = [];

  constructor(
    private yrGenerateService: YrGenerateService
  ) { }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.isVisiblePic) {
      this.history.length = 0;
      this.yrGenerateService.getFactorType(this.changeCompareMaterialId).subscribe(res => {
        this.factorTypes = res;
        this.yrGenerateService.getHistory(this.changeCompareMaterialId, this.projectName, this.plant.split('-')[0], this.plant.split('-')[1]).subscribe(async reso => {
          this.modelHistory = reso;
          for (let index = 0; index < reso.length; index++) {
            await this.yrGenerateService.getPreFactors(reso[index]['id']).toPromise().then(resou => {
              this.history.push(resou);
              if (index === reso.length - 1) {
                this.modalShow = true;
              }
            });
          }
        });
      });
    }
  }

  handleCancel() {
    this.modalShow = false;
    this.isVisiblePic = false;
    this.changeComCacel.emit(this.isVisiblePic);
  }
}
