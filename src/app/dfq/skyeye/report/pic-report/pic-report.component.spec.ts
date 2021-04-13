import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicReportComponent } from './pic-report.component';

describe('PicReportComponent', () => {
  let component: PicReportComponent;
  let fixture: ComponentFixture<PicReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
