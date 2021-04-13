import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-sqm-base-data',
  templateUrl: './sqm-base-data.component.html',
  styleUrls: ['./sqm-base-data.component.scss']
})
export class SqmBaseDataComponent implements OnInit {

  selectedIndex = 0;
  isExt = localStorage.getItem('$DFI$isExt') ? true : false;
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      switch (param['rout']) {
        case 'toSqmBaseDataParts':
          this.selectedIndex = 1;
          break;
        default:
          this.selectedIndex = 0;
          break;
      }
    });
  }
}
