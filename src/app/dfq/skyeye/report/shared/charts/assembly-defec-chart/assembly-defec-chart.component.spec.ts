import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyDefecChartComponent } from './assembly-defec-chart.component';

describe('AssemblyDefecChartComponent', () => {
  let component: AssemblyDefecChartComponent;
  let fixture: ComponentFixture<AssemblyDefecChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssemblyDefecChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyDefecChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
