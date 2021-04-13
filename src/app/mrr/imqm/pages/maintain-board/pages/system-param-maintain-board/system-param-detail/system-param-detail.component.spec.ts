import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemParamDetailComponent } from './system-param-detail.component';

describe('SystemParamDetailComponent', () => {
  let component: SystemParamDetailComponent;
  let fixture: ComponentFixture<SystemParamDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemParamDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemParamDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
