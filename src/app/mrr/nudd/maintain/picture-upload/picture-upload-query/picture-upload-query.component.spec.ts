import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureUploadQueryComponent } from './picture-upload-query.component';

describe('PictureUploadQueryComponent', () => {
  let component: PictureUploadQueryComponent;
  let fixture: ComponentFixture<PictureUploadQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureUploadQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureUploadQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
