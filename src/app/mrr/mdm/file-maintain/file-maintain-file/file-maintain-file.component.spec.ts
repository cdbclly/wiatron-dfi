import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMaintainFileComponent } from './file-maintain-file.component';

describe('FileMaintainFileComponent', () => {
  let component: FileMaintainFileComponent;
  let fixture: ComponentFixture<FileMaintainFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileMaintainFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileMaintainFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
