import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialNgComponent } from './material-ng.component';

describe('MaterialNgComponent', () => {
  let component: MaterialNgComponent;
  let fixture: ComponentFixture<MaterialNgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialNgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
