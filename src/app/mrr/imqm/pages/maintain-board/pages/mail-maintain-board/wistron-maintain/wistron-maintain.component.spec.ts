import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WistronMaintainComponent } from './wistron-maintain.component';

describe('WistronMaintainComponent', () => {
  let component: WistronMaintainComponent;
  let fixture: ComponentFixture<WistronMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WistronMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WistronMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
