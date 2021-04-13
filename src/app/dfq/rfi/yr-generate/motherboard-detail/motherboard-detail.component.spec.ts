import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherboardDetailComponent } from './motherboard-detail.component';

describe('MotherboardDetailComponent', () => {
  let component: MotherboardDetailComponent;
  let fixture: ComponentFixture<MotherboardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotherboardDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotherboardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
