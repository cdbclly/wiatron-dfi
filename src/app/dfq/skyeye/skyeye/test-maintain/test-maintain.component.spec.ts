import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMaintainComponent } from './test-maintain.component';

describe('TestMaintainComponent', () => {
  let component: TestMaintainComponent;
  let fixture: ComponentFixture<TestMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
