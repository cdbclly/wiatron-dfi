import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuddUploadComponent } from './nudd-upload.component';

describe('NuddUploadComponent', () => {
  let component: NuddUploadComponent;
  let fixture: ComponentFixture<NuddUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuddUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuddUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
