import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureanalyseComponent } from './pictureanalyse.component';

describe('PictureanalyseComponent', () => {
  let component: PictureanalyseComponent;
  let fixture: ComponentFixture<PictureanalyseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureanalyseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureanalyseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
