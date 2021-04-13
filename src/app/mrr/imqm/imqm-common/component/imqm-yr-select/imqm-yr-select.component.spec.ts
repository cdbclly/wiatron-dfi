import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImqmYrSelectComponent } from './imqm-yr-select.component';

describe('ImqmYrSelectComponent', () => {
  let component: ImqmYrSelectComponent;
  let fixture: ComponentFixture<ImqmYrSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImqmYrSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImqmYrSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
