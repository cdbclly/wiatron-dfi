import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-work-reaching',
  templateUrl: './work-reaching.component.html',
  styleUrls: ['./work-reaching.component.scss']
})
export class WorkReachingComponent implements OnInit {

  selectedIndex = 0;
  dfcWorkReachingHeight;
  workhourParam;
  @ViewChild('DFCWorkReachingReport') dfcWorkReachingReport: ElementRef;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.dfcWorkReachingHeight = (this.dfcWorkReachingReport.nativeElement.offsetHeight - 130) + 'px';
    this.route.params.subscribe(param => {
      if (JSON.stringify(param) === '{}') {
        localStorage.removeItem('workhourData');
        this.selectedIndex = 0;
      } else {
        this.workhourParam = JSON.parse(localStorage.getItem('workhourData'));
        if (!!this.workhourParam['name']) {
          if (this.workhourParam['name'].indexOf('RFQ') !== -1) {
            this.selectedIndex = 0;
          } else {
            this.selectedIndex = 1;
          }
        }
      }
    });
  }
}
