import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-itemdetails',
  templateUrl: './itemdetails.component.html',
  styleUrls: ['./itemdetails.component.scss']
})
export class ItemdetailsComponent implements OnInit {

  @Input() isVisibleDetails;
  @Input() itemName;
  @Input() itemDetailsData;
  @Output() isVisible = new EventEmitter<any>();

  constructor(
  ) { }

  ngOnInit() {
  }

  handleCancel() {
    this.isVisibleDetails = false;
    this.isVisible.emit(this.isVisibleDetails);
  }

}
