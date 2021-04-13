import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfcSummaryComponent } from './dfc-summary.component';

describe('DfcSummaryComponent', () => {
  let component: DfcSummaryComponent;
  let fixture: ComponentFixture<DfcSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfcSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfcSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
