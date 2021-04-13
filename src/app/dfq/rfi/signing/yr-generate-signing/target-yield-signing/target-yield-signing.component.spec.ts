import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetYieldSigningComponent } from './target-yield-signing.component';

describe('TargetYieldSigningComponent', () => {
  let component: TargetYieldSigningComponent;
  let fixture: ComponentFixture<TargetYieldSigningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetYieldSigningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetYieldSigningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
