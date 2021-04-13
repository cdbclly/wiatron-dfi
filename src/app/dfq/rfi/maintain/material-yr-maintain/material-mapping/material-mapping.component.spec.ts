import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialMappingComponent } from './material-mapping.component';

describe('MaterialMappingComponent', () => {
  let component: MaterialMappingComponent;
  let fixture: ComponentFixture<MaterialMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
