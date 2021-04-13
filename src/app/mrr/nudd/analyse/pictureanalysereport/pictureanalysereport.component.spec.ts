import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureanalysereportComponent } from './pictureanalysereport.component';

describe('PictureanalysereportComponent', () => {
  let component: PictureanalysereportComponent;
  let fixture: ComponentFixture<PictureanalysereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureanalysereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureanalysereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
