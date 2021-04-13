import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrrDocUploadComponent } from './mrr-doc-upload.component';

describe('MrrDocUploadComponent', () => {
  let component: MrrDocUploadComponent;
  let fixture: ComponentFixture<MrrDocUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrrDocUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrrDocUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
