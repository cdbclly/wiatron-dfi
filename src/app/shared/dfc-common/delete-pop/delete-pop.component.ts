import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-delete-pop',
  templateUrl: './delete-pop.component.html',
  styleUrls: ['./delete-pop.component.scss']
})
export class DeletePopComponent implements OnInit {
  @Output() cancelDel = new EventEmitter<boolean>();
  @Output() del = new EventEmitter<boolean>();
  @Input() isAfterDeleteVisible: boolean;

  constructor() { }

  ngOnInit() {
  }

  cancelDelete() {
    this.cancelDel.emit(true);
  }

  Delete() {
    this.del.emit(true);
  }
}
