import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkhourForecastComponent } from './workhour-forecast.component';

describe('WorkhourForecastComponent', () => {
  let component: WorkhourForecastComponent;
  let fixture: ComponentFixture<WorkhourForecastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkhourForecastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkhourForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
