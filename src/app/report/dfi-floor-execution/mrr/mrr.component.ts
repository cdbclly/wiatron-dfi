import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-mrr',
  templateUrl: './mrr.component.html',
  styleUrls: ['./mrr.component.scss']
})
export class MrrComponent implements OnInit {


  @Output() queryParams = new EventEmitter<any>();
  flag = false;
  constructor() { }

  ngOnInit() {
    this.flag = true;
    this.queryParams.emit(this.flag);
  }

}
