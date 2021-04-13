import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherboardAddComponent } from './motherboard-add.component';

describe('MotherboardAddComponent', () => {
  let component: MotherboardAddComponent;
  let fixture: ComponentFixture<MotherboardAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotherboardAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotherboardAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
