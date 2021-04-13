import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfcEchartComponent } from './dfc-echart.component';

describe('DfcEchartComponent', () => {
  let component: DfcEchartComponent;
  let fixture: ComponentFixture<DfcEchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfcEchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfcEchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
