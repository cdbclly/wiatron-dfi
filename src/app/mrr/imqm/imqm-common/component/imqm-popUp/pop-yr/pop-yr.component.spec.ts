import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopYrComponent } from './pop-yr.component';

describe('PopYrComponent', () => {
  let component: PopYrComponent;
  let fixture: ComponentFixture<PopYrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopYrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopYrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
