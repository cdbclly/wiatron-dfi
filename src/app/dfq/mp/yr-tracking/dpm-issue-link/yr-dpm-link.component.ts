import { Component, Input } from '@angular/core';
@Component({
  selector: 'mp-yr-dpm-link',
  templateUrl: './yr-dpm-link.component.html',
  styleUrls: ['./yr-dpm-link.component.scss']
})
export class YrDpmLinkComponent {
  @Input() isLoading: boolean;
  @Input() url;
  constructor() { }
}
