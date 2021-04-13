import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMaintainBypassComponent } from './file-maintain-bypass.component';

describe('FileMaintainBypassComponent', () => {
  let component: FileMaintainBypassComponent;
  let fixture: ComponentFixture<FileMaintainBypassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileMaintainBypassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileMaintainBypassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
