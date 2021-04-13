import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmAutoJudgementQualifieldRateComponent } from './em-auto-judgement-qualifield-rate.component';

describe('SkyeyeBoardComponent', () => {
  let component: EmAutoJudgementQualifieldRateComponent;
  let fixture: ComponentFixture<EmAutoJudgementQualifieldRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmAutoJudgementQualifieldRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmAutoJudgementQualifieldRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
