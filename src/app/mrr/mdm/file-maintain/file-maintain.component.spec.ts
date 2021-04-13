import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMaintainComponent } from './file-maintain.component';

describe('FileMaintainComponent', () => {
  let component: FileMaintainComponent;
  let fixture: ComponentFixture<FileMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
