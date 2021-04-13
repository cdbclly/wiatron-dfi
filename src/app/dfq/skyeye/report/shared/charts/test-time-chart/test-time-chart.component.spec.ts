import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTimeChartComponent } from './test-time-chart.component';

describe('TestTimeChartComponent', () => {
  let component: TestTimeChartComponent;
  let fixture: ComponentFixture<TestTimeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestTimeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTimeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
