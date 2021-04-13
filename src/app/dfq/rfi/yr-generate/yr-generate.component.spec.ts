import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YrGenerateComponent } from './yr-generate.component';

describe('YrGenerateComponent', () => {
  let component: YrGenerateComponent;
  let fixture: ComponentFixture<YrGenerateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YrGenerateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YrGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
