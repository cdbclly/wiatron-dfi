import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsItemTraceComponent } from './forms-item-trace.component';

describe('FormsItemTraceComponent', () => {
  let component: FormsItemTraceComponent;
  let fixture: ComponentFixture<FormsItemTraceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsItemTraceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsItemTraceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
