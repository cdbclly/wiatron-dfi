import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-judgement-component',
  templateUrl: './judgement-component.component.html',
  styleUrls: ['./judgement-component.component.scss']
})
export class JudgementComponentComponent implements OnInit {
  @Input() judgeStatus;
  @Input() plantId;

  constructor() { }

  ngOnInit() {}

  getColor(plantId, judgeStatus) {
    if (plantId === '5') {
      switch (judgeStatus) {
        case 1:
        case 2: return { background: 'rgba(212, 48, 48, 1)', color: 'white' };
        case 3:
        case 4:
        case 5: return { background: 'rgb(6, 238, 26)', color: 'black' };
        default: break;
      }
    } else {
      switch (judgeStatus) {
        case 1:
        case 2:
        case 3: return { background: 'rgba(212, 48, 48, 1)', color: 'white' };
        case 4:
        case 5: return { background: 'rgb(6, 238, 26)', color: 'black' };
        default: break;
      }
    }
  }
}
