import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicinputComponent } from './picinput.component';

describe('PicinputComponent', () => {
  let component: PicinputComponent;
  let fixture: ComponentFixture<PicinputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicinputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
