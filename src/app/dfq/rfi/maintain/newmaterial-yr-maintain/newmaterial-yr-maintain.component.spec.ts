import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewmaterialYrMaintainComponent } from './newmaterial-yr-maintain.component';

describe('NewmaterialYrMaintainComponent', () => {
  let component: NewmaterialYrMaintainComponent;
  let fixture: ComponentFixture<NewmaterialYrMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewmaterialYrMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewmaterialYrMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
