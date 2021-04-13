import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MohParameterComponent } from './moh-parameter.component';

describe('MohParameterComponent', () => {
  let component: MohParameterComponent;
  let fixture: ComponentFixture<MohParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MohParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MohParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
