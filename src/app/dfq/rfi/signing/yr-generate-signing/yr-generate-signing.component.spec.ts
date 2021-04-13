import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YrGenerateSigningComponent } from './yr-generate-signing.component';

describe('YrGenerateSigningComponent', () => {
  let component: YrGenerateSigningComponent;
  let fixture: ComponentFixture<YrGenerateSigningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YrGenerateSigningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YrGenerateSigningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
