import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-dfc-loading',
  templateUrl: './dfc-loading.component.html',
  styleUrls: ['./dfc-loading.component.scss']
})
export class DfcLoadingComponent implements OnInit {
  loadshow = false;
  isVisible = true;
  constructor() { }

  ngOnInit() { }
}
