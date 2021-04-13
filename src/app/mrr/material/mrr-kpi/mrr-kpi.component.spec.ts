import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrrKpiComponent } from './mrr-kpi.component';

describe('MrrKpiComponent', () => {
  let component: MrrKpiComponent;
  let fixture: ComponentFixture<MrrKpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrrKpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrrKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
