import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefecLossAnalyzeComponent } from './defec-loss-analyze.component';

describe('DefecLossAnalyzeComponent', () => {
  let component: DefecLossAnalyzeComponent;
  let fixture: ComponentFixture<DefecLossAnalyzeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefecLossAnalyzeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefecLossAnalyzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
