import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YrCompareComponent } from './yr-compare.component';

describe('YrCompareComponent', () => {
  let component: YrCompareComponent;
  let fixture: ComponentFixture<YrCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YrCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YrCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
