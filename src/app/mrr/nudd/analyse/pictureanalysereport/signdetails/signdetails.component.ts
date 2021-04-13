import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-signdetails',
  templateUrl: './signdetails.component.html',
  styleUrls: ['./signdetails.component.scss']
})
export class SigndetailsComponent implements OnInit {

  @Input() isVisibleSignItems;
  @Input() itemName;
  @Input() signItems;
  @Output() isSign = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  handleCancel() {
    this.isVisibleSignItems = false;
    this.isSign.emit(this.isVisibleSignItems);
  }

}
