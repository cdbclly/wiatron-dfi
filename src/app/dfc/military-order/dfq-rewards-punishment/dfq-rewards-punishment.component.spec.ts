import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfqRewardsPunishmentComponent } from './dfq-rewards-punishment.component';

describe('DfqRewardsPunishmentComponent', () => {
  let component: DfqRewardsPunishmentComponent;
  let fixture: ComponentFixture<DfqRewardsPunishmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfqRewardsPunishmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfqRewardsPunishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
