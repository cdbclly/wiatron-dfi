import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrrDocReportComponent } from './mrr-doc-report.component';

describe('MrrDocReportComponent', () => {
  let component: MrrDocReportComponent;
  let fixture: ComponentFixture<MrrDocReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrrDocReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrrDocReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
