import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessmaintainComponent } from './processmaintain.component';

describe('ProcessmaintainComponent', () => {
  let component: ProcessmaintainComponent;
  let fixture: ComponentFixture<ProcessmaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessmaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessmaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
