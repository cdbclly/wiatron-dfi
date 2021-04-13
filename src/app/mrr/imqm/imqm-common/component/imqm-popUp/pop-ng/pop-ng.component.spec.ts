import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopNgComponent } from './pop-ng.component';

describe('PopNgComponent', () => {
  let component: PopNgComponent;
  let fixture: ComponentFixture<PopNgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopNgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
