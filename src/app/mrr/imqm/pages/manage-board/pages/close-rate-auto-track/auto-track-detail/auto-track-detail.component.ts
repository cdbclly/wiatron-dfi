import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auto-track-detail',
  templateUrl: './auto-track-detail.component.html',
  styleUrls: ['./auto-track-detail.component.scss']
})
export class AutoTrackDetailComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  goBack() {
    window.history.back();
  }

}
