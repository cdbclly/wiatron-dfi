import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdbookMaintainComponent } from './idbook-maintain.component';

describe('IdbookMaintainComponent', () => {
  let component: IdbookMaintainComponent;
  let fixture: ComponentFixture<IdbookMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdbookMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdbookMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
