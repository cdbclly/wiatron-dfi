import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerFilesMaintainComponent } from './manufacturer-files-maintain.component';

describe('ManufacturerFilesMaintainComponent', () => {
  let component: ManufacturerFilesMaintainComponent;
  let fixture: ComponentFixture<ManufacturerFilesMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerFilesMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerFilesMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
