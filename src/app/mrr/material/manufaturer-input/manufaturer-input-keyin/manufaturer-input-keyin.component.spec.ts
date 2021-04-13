import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufaturerInputKeyinComponent } from './manufaturer-input-keyin.component';

describe('ManufaturerInputKeyinComponent', () => {
  let component: ManufaturerInputKeyinComponent;
  let fixture: ComponentFixture<ManufaturerInputKeyinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufaturerInputKeyinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufaturerInputKeyinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
