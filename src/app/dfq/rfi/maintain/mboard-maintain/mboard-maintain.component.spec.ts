import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MboardMaintainComponent } from './mboard-maintain.component';

describe('MboardMaintainComponent', () => {
  let component: MboardMaintainComponent;
  let fixture: ComponentFixture<MboardMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MboardMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MboardMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
