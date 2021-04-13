import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsSignDetailComponent } from './rewards-sign-detail.component';

describe('RewardsSignDetailComponent', () => {
  let component: RewardsSignDetailComponent;
  let fixture: ComponentFixture<RewardsSignDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardsSignDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsSignDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
