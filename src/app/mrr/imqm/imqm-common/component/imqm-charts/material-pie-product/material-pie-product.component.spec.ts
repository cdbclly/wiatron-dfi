import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialPieProductComponent } from './material-pie-product.component';

describe('MaterialPieProductComponent', () => {
  let component: MaterialPieProductComponent;
  let fixture: ComponentFixture<MaterialPieProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialPieProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialPieProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
