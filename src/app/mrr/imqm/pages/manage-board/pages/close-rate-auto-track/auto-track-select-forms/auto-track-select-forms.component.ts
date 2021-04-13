import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-auto-track-select-forms',
  templateUrl: './auto-track-select-forms.component.html',
  styleUrls: ['./auto-track-select-forms.component.scss']
})
export class AutoTrackSelectFormsComponent implements OnInit {

  cur_searchBy;
  formNos;
  queryButton = true;
  @Output() queryNos = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    if (this.cur_searchBy && this.formNos) {
      this.queryButton = false;
    } else {
      this.queryButton = true;
    }
  }

  getOptions(type) {
    // debugger;
    switch (type) {
      case 'searchBy':
      if (this.cur_searchBy && this.formNos) {
        this.queryButton = false;
      } else {
        this.queryButton = true;
      }
      break;
      case 'formNos':
      if (this.cur_searchBy && this.formNos) {
        this.queryButton = false;
      } else {
        this.queryButton = true;
      }
      break;
    }
  }

  query() {
    this.queryNos.emit({'cur_searchBy': this.cur_searchBy, 'formNos': this.formNos});
  }

}
