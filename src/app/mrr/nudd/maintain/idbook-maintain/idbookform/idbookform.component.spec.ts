import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdbookformComponent } from './idbookform.component';

describe('IdbookformComponent', () => {
  let component: IdbookformComponent;
  let fixture: ComponentFixture<IdbookformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdbookformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdbookformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
