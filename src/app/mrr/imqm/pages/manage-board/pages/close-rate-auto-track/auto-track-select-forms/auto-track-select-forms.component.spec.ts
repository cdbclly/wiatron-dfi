import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoTrackSelectFormsComponent } from './auto-track-select-forms.component';

describe('AutoTrackSelectFormsComponent', () => {
  let component: AutoTrackSelectFormsComponent;
  let fixture: ComponentFixture<AutoTrackSelectFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoTrackSelectFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoTrackSelectFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
