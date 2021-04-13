import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighSpeedAnalyzeComponent } from './high-speed-analyze.component';

describe('HighSpeedAnalyzeComponent', () => {
  let component: HighSpeedAnalyzeComponent;
  let fixture: ComponentFixture<HighSpeedAnalyzeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighSpeedAnalyzeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighSpeedAnalyzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
