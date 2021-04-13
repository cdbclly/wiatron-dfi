import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiBoardSelectComponent } from './kpi-board-select.component';

describe('KpiBoardSelectComponent', () => {
  let component: KpiBoardSelectComponent;
  let fixture: ComponentFixture<KpiBoardSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiBoardSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiBoardSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
