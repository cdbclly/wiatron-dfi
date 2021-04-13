import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checklistmodal',
  templateUrl: './checklistmodal.component.html',
  styleUrls: ['./checklistmodal.component.scss']
})
export class ChecklistmodalComponent implements OnInit, OnChanges {

  checkListColor = [];
  @Input()
  checkListsData = [];
  @Input()
  isEditSaveVisible3: boolean;
  @Output()
  isVisible = new EventEmitter<boolean>();


  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    // if (changes.checkListsData.currentValue.length !== 0) {
    //   this.checkListsData = changes.checkListsData.currentValue;
    // }
    // this.isEditSaveVisible3 = changes.isEditSaveVisible3.currentValue;
  }

  handleOk() {
    this.isVisible.emit(false);
  }

  handleCancel() {
    this.isVisible.emit(false);
  }

}
