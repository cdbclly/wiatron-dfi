import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsPunishmentRuleSignComponent } from './rewards-punishment-rule-sign.component';

describe('RewardsPunishmentRuleSignComponent', () => {
  let component: RewardsPunishmentRuleSignComponent;
  let fixture: ComponentFixture<RewardsPunishmentRuleSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardsPunishmentRuleSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsPunishmentRuleSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
