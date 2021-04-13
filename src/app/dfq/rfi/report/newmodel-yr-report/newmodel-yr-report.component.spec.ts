import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewmodelYrReportComponent } from './newmodel-yr-report.component';

describe('NewmodelYrReportComponent', () => {
  let component: NewmodelYrReportComponent;
  let fixture: ComponentFixture<NewmodelYrReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewmodelYrReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewmodelYrReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
