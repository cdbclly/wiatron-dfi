import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FpyrMovingAverageComponent } from './fpyr-moving-average.component';

describe('FpyrMovingAverageComponent', () => {
  let component: FpyrMovingAverageComponent;
  let fixture: ComponentFixture<FpyrMovingAverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FpyrMovingAverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FpyrMovingAverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
