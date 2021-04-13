import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LlUploadQueryComponent } from './ll-upload-query.component';

describe('LlUploadQueryComponent', () => {
  let component: LlUploadQueryComponent;
  let fixture: ComponentFixture<LlUploadQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LlUploadQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LlUploadQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
