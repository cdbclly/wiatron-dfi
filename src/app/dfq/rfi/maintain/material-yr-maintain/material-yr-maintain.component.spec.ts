import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialYrMaintainComponent } from './material-yr-maintain.component';

describe('MaterialYrMaintainComponent', () => {
  let component: MaterialYrMaintainComponent;
  let fixture: ComponentFixture<MaterialYrMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialYrMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialYrMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
