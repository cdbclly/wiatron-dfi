import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqmMaintainComponent } from './sqm-maintain.component';

describe('SqmMaintainComponent', () => {
  let component: SqmMaintainComponent;
  let fixture: ComponentFixture<SqmMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqmMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqmMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
