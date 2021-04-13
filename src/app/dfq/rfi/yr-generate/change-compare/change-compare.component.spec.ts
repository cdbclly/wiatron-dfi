import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCompareComponent } from './change-compare.component';

describe('ChangeCompareComponent', () => {
  let component: ChangeCompareComponent;
  let fixture: ComponentFixture<ChangeCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
