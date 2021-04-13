import { WaivePipe } from 'app/dfq/waive.pipe';
import { AgreePipe } from 'app/dfq/agree.pipe';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-signer-history',
  templateUrl: './signer-history.component.html',
  styleUrls: ['./signer-history.component.scss']
})
export class SignerHistoryComponent implements OnInit, OnChanges {

  // 顯示與否
  @Input() isEditSaveVisible;

  // 標題
  @Input() title;

  @Input() modalFooter;

  @Input() signings;

  @Output() handleCancel: EventEmitter<any> = new EventEmitter();


  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  onHandleCancel() {
    this.handleCancel.emit();
  }

}
