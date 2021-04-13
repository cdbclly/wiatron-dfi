import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MohParameterPlantComponent } from './moh-parameter-plant.component';

describe('MohParameterPlantComponent', () => {
  let component: MohParameterPlantComponent;
  let fixture: ComponentFixture<MohParameterPlantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MohParameterPlantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MohParameterPlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
