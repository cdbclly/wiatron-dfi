import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pop-vender-thrift',
  templateUrl: './pop-vender-thrift.component.html',
  styleUrls: ['./pop-vender-thrift.component.scss']
})
export class PopVenderThriftComponent implements OnInit, OnChanges {

  @Input() data;
  tableData;
  isVisible = false;
  footer = null;
  cancelOK = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'].firstChange) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
      this.buildTable(changes['data'].currentValue);
    }
  }

  ngOnInit() {
  }

  buildTable(rawTableData) {
    this.tableData = rawTableData;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

}
