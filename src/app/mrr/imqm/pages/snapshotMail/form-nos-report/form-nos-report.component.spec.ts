import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNosReportComponent } from './form-nos-report.component';

describe('FormNosReportComponent', () => {
  let component: FormNosReportComponent;
  let fixture: ComponentFixture<FormNosReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormNosReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNosReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
