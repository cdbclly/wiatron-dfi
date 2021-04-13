import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { NPICHECKLIST_EMInterface } from '@service/dfq_sdk/sdk';
import { Utils } from 'app/dfq/utils';

@Component({
  selector: 'app-npi-items-table',
  templateUrl: './npi-items-table.component.html',
  styleUrls: ['./npi-items-table.component.scss']
})
export class NpiItemsTableComponent implements OnInit, OnChanges {
  @Input() checklistStatus;
  @Input() judgeStatus: number;
  @Input() plantId: string;
  @Input() functionStatus: { count: number, total: number, color: string, name: string }[];

  // popup checklistmodal
  checklistmodal = {
    showCheckListsData: false,
    checkListsData: []
  };
  overallClosed: number;
  overallOngoing: number;
  overallOpen: number;
  overallNa: number;
  mustDoClosed: number;
  mustDoOngoing: number;
  mustDoOpen: number;

  constructor() {}

  ngOnInit() {
    this.overallClosed = 0;
    this.overallOngoing = 0;
    this.overallOpen = 0;
    this.overallNa = 0;
    this.mustDoClosed = 0;
    this.mustDoOngoing = 0;
    this.mustDoOpen = 0;
  }

  ngOnChanges() {
    this.overallClosed = this.checklistStatus.overall.closed.length;
    this.overallOngoing = this.checklistStatus.overall.ongoing.length;
    this.overallOpen = this.checklistStatus.overall.open.length;
    this.overallNa = this.checklistStatus.overall.na.length;
    this.mustDoClosed = this.checklistStatus.mustDo.closed.length;
    this.mustDoOngoing = this.checklistStatus.mustDo.ongoing.length;
    this.mustDoOpen = this.checklistStatus.mustDo.open.length;
  }

  // click overall open or close ongoing
  showItemsData(items) {
    this.checklistmodal = {
      showCheckListsData: true,
      checkListsData: [...items]
    };
  }

  closeItemsData($event) {
    this.checklistmodal = {
      showCheckListsData: false,
      checkListsData: []
    };
  }
}
