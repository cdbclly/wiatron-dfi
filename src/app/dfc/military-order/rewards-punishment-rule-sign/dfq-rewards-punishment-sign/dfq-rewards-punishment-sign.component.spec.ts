import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfqRewardsPunishmentSignComponent } from './dfq-rewards-punishment-sign.component';

describe('DfqRewardsPunishmentSignComponent', () => {
  let component: DfqRewardsPunishmentSignComponent;
  let fixture: ComponentFixture<DfqRewardsPunishmentSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfqRewardsPunishmentSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfqRewardsPunishmentSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
