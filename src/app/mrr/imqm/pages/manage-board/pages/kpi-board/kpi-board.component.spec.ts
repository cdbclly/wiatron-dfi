import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiBoardComponent } from './kpi-board.component';

describe('KpiBoardComponent', () => {
  let component: KpiBoardComponent;
  let fixture: ComponentFixture<KpiBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
