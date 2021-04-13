import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightBarFillComponent } from './light-bar-fill.component';

describe('LightBarFillComponent', () => {
  let component: LightBarFillComponent;
  let fixture: ComponentFixture<LightBarFillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightBarFillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightBarFillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
