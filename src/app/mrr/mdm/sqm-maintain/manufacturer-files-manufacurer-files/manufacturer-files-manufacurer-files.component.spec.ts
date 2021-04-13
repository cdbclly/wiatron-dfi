import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerFilesManufacurerFilesComponent } from './manufacturer-files-manufacurer-files.component';

describe('ManufacturerFilesManufacurerFilesComponent', () => {
  let component: ManufacturerFilesManufacurerFilesComponent;
  let fixture: ComponentFixture<ManufacturerFilesManufacurerFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerFilesManufacurerFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerFilesManufacurerFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
