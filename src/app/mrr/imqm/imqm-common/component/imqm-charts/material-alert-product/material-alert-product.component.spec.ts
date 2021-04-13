import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialAlertProductComponent } from './material-alert-product.component';

describe('MaterialAlertProductComponent', () => {
  let component: MaterialAlertProductComponent;
  let fixture: ComponentFixture<MaterialAlertProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialAlertProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialAlertProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
