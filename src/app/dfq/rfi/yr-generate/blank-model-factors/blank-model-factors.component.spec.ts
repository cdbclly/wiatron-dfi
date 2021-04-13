import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankModelFactorsComponent } from './blank-model-factors.component';

describe('BlankModelFactorsComponent', () => {
  let component: BlankModelFactorsComponent;
  let fixture: ComponentFixture<BlankModelFactorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlankModelFactorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlankModelFactorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
