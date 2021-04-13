import { YrGenerateService } from './../yr-generate.service';
import { PartApi } from './../../../../service/dfq_sdk/sdk/services/custom/Part';
import { ProjectPartApi } from './../../../../service/dfq_sdk/sdk/services/custom/ProjectPart';
import { Component, ElementRef, HostListener, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NzInputDirective } from 'ng-zorro-antd/input/nz-input.directive';
import { NzMessageService } from 'ng-zorro-antd';
import { ProjectPartInterface } from '@service/dfq_sdk/sdk';
import { error } from 'util';
import { YrQueryService } from '../query-form/yr-query.service';
@Component({
  selector: 'app-motherboard-add',
  templateUrl: './motherboard-add.component.html',
  styleUrls: ['./motherboard-add.component.scss']
})
export class MotherboardAddComponent implements OnInit, OnChanges {

  @Input() mbMaterialId;
  @Input() projectName;
  @Input() projectCode;
  @Input() isVisiblePic;
  @Output() mBoardAddCancel = new EventEmitter<any>();
  modalShow = false;
  material = '新增MB物料';
  parts: {}[];
  isComplete = true;

  constructor(
    private yrQueryService: YrQueryService,
    private nzMessageService: NzMessageService,
    private projectPartService: ProjectPartApi,
    private partService: PartApi,
    private yrGenerateService: YrGenerateService
  ) { }

  i = 0;
  editId: string | null;
  listOfData: any[] = [];
  // @ViewChild(NzInputDirective, { read: ElementRef }) inputElement: ElementRef;

  // @HostListener('window:click', ['$event'])
  // handleClick(e: MouseEvent): void {
  //   if (this.editId && this.inputElement && this.inputElement.nativeElement !== e.target) {
  //     this.editId = null;
  //   }
  // }

  ngOnChanges() {
    if (this.isVisiblePic) {
      this.getPart();
    }
  }

  addRow(): void {
    this.listOfData = [
      ...this.listOfData,
      {
        id: `${this.i}`,
        projectCode: this.projectCode,
        partId: '',
        partNum: null
      }
    ];
    this.i++;
  }

  deleteRow(id: string): void {
    this.listOfData = this.listOfData.filter(d => d.id !== id);
  }

  startEdit(id: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.editId = id;
  }

  ngOnInit(): void {
  }

  getPart() {
    this.partService.find({}).subscribe(res => {
      this.parts = res;
      this.addRow();
      this.modalShow = true;
    });
  }

  handleCancel() {
    this.modalShow = false;
    this.isVisiblePic = false;
    this.mBoardAddCancel.emit(this.isVisiblePic);
  }

  cancel(): void {
    this.nzMessageService.info('save cancel');
  }

  // confirm(): void {
  //   this.isComplete = false;
  //   this.listOfData.forEach((element, index) => {
  //     const form: ProjectPartInterface = {
  //       projectId: element.projectCode,
  //       partId: element.partId,
  //       usageAmt: element.partNum
  //     };
  //     this.projectPartService.create(form).subscribe(res => {
  //       if (index === this.listOfData.length - 1) {
  //         let yr = 1;
  //         this.yrQueryService.getMb(this.projectName).subscribe(reso => {
  //           for (let r = 0; r < reso.length; r++) {
  //             yr *= reso[r]['totalYieldRate'];
  //           }
  //           this.yrGenerateService.updateModelMaterial(this.mbMaterialId, {
  //             yieldRate: yr
  //           }).subscribe(ee => {
  //             this.isComplete = true;
  //             this.nzMessageService.info('save confirm');
  //             this.handleCancel();
  //           });
  //         });

  //       }
  //     }, err => {
  //       this.isComplete = true;
  //     }
  //     );
  //   });
  //   // console.log(this.listOfData);
  // }

}
