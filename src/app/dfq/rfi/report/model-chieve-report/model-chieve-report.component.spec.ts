import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelChieveReportComponent } from './model-chieve-report.component';

describe('ModelChieveReportComponent', () => {
  let component: ModelChieveReportComponent;
  let fixture: ComponentFixture<ModelChieveReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelChieveReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelChieveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
