import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LLUploadComponent } from './ll-upload.component';

describe('LLUploadComponent', () => {
  let component: LLUploadComponent;
  let fixture: ComponentFixture<LLUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LLUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LLUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
