import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YrmaintainComponent } from './yrmaintain.component';

describe('YrmaintainComponent', () => {
  let component: YrmaintainComponent;
  let fixture: ComponentFixture<YrmaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YrmaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YrmaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
