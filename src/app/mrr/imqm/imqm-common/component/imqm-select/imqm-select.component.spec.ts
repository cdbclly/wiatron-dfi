import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImqmSelectComponent } from './imqm-select.component';

describe('ImqmSelectComponent', () => {
  let component: ImqmSelectComponent;
  let fixture: ComponentFixture<ImqmSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImqmSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImqmSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
