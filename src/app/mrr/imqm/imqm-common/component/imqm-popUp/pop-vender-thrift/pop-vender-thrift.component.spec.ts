import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopVenderThriftComponent } from './pop-vender-thrift.component';

describe('PopVenderThriftComponent', () => {
  let component: PopVenderThriftComponent;
  let fixture: ComponentFixture<PopVenderThriftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopVenderThriftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopVenderThriftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
