import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryMOHComponent } from './summary-moh.component';

describe('SummaryMOHComponent', () => {
  let component: SummaryMOHComponent;
  let fixture: ComponentFixture<SummaryMOHComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryMOHComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryMOHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
