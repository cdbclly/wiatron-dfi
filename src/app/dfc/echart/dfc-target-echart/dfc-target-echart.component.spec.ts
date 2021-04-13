import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfcTargetEchartComponent } from './dfc-target-echart.component';

describe('DfcTargetEchartComponent', () => {
  let component: DfcTargetEchartComponent;
  let fixture: ComponentFixture<DfcTargetEchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfcTargetEchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfcTargetEchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
