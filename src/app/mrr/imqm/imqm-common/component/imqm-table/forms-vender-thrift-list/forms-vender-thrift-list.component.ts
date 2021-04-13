import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-forms-vender-thrift-list',
  templateUrl: './forms-vender-thrift-list.component.html',
  styleUrls: ['./forms-vender-thrift-list.component.scss']
})
export class FormsVenderThriftListComponent implements OnInit {

  @Input() seriesData;
  constructor() { }

  ngOnInit() {
  }

}
