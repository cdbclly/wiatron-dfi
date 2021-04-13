import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WcqlsjMaintainComponent } from './wcqlsj-maintain.component';

describe('WcqlsjMaintainComponent', () => {
  let component: WcqlsjMaintainComponent;
  let fixture: ComponentFixture<WcqlsjMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WcqlsjMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WcqlsjMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
