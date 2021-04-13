import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-echarts-modal',
  templateUrl: './echarts-modal.component.html',
  styleUrls: ['./echarts-modal.component.scss']
})
export class EchartsModalComponent implements OnInit {

  @Input() echartsOptionArr: any[];
  @Output() echartsClick = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  emitClick(event: any, type: any) {
    this.echartsClick.emit({ event, type });
  }
}
