import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuddUploadQueryComponent } from './nudd-upload-query.component';

describe('NuddUploadQueryComponent', () => {
  let component: NuddUploadQueryComponent;
  let fixture: ComponentFixture<NuddUploadQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuddUploadQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuddUploadQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
