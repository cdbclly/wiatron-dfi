import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MufrpiebyplantComponent } from './mufrpiebyplant.component';

describe('MufrpiebyplantComponent', () => {
  let component: MufrpiebyplantComponent;
  let fixture: ComponentFixture<MufrpiebyplantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MufrpiebyplantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MufrpiebyplantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
