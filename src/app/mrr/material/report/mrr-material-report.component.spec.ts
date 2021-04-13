import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrrMaterialReportComponent } from './mrr-material-report.component';

describe('MrrMaterialReportComponent', () => {
  let component: MrrMaterialReportComponent;
  let fixture: ComponentFixture<MrrMaterialReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrrMaterialReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrrMaterialReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
