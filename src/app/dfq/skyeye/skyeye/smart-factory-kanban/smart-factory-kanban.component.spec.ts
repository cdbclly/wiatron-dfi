import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartFactoryKanbanComponent } from './smart-factory-kanban.component';

describe('SmartFactoryKanbanComponent', () => {
  let component: SmartFactoryKanbanComponent;
  let fixture: ComponentFixture<SmartFactoryKanbanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartFactoryKanbanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartFactoryKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
