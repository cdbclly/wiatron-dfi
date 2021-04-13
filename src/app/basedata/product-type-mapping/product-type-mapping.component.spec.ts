import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTypeMappingComponent } from './product-type-mapping.component';

describe('ProductTypeMappingComponent', () => {
  let component: ProductTypeMappingComponent;
  let fixture: ComponentFixture<ProductTypeMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductTypeMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTypeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
