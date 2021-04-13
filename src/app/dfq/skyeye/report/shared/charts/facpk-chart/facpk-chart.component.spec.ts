import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacpkChartComponent } from './facpk-chart.component';

describe('FacpkChartComponent', () => {
  let component: FacpkChartComponent;
  let fixture: ComponentFixture<FacpkChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacpkChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacpkChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
