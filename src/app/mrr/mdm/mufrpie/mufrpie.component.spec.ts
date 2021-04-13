import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MufrpieComponent } from './mufrpie.component';

describe('MufrpieComponent', () => {
  let component: MufrpieComponent;
  let fixture: ComponentFixture<MufrpieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MufrpieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MufrpieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
