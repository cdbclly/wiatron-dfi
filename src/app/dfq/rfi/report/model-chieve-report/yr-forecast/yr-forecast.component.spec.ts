import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YrForecastComponent } from './yr-forecast.component';

describe('YrForecastComponent', () => {
  let component: YrForecastComponent;
  let fixture: ComponentFixture<YrForecastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YrForecastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YrForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
