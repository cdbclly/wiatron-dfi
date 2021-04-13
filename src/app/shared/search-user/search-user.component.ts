import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { MemberApi, Member, LoopBackFilter } from '@service/dfc_sdk/sdk';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent implements OnChanges {
  members: Member[];
  isLoading = false;
  member: Member;
  @Input() picId;
  @Input() disabled = false;
  @Output() selectedUserId: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedUserData: EventEmitter<Member> = new EventEmitter<Member>();

  constructor(
    private userService: MemberApi
  ) {}

  ngOnChanges(): void {
    if (this.picId) {
      this.userService.findOne<Member>({where: { EmpID: this.picId }}).subscribe(member => {
        this.member = member;
        this.members = [member];
        this.selectedUserData.emit(member);
        this.selectedUserId.emit(member.EmpID);
      });
    } else {
      this.member = undefined;
      this.members = [];
      this.selectedUserData.emit(undefined);
      this.selectedUserId.emit(undefined);
    }
  }

  onSearch(value: string) {
    this.isLoading = true;
    this.userService.find<Member>({where: { EName: { like: '%' + value + '%' } }, limit: 100}).subscribe(members => {
      this.members = members;
      this.isLoading = false;
    });
  }

  selectUser(member: Member) {
    this.selectedUserId.emit(member ? member.EmpID : null);
    this.selectedUserData.emit(member);
  }
}
