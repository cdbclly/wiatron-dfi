import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialEndProductComponent } from './material-end-product.component';

describe('MaterialEndProductComponent', () => {
  let component: MaterialEndProductComponent;
  let fixture: ComponentFixture<MaterialEndProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialEndProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialEndProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
