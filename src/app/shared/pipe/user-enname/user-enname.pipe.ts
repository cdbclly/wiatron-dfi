import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// service
import { MemberApi } from '@service/dfc_sdk/sdk/services/custom/Member';
import { Member } from '@service/dfc_sdk/sdk';

@Pipe({
  name: 'userEnname'
})
export class UserEnnamePipe implements PipeTransform {
  cache = [];
  constructor(
    private userService: MemberApi
  ) { }

  transform(userId: string): Observable<string> {
    if (userId) {
      const exist = this.cache.find(user => {
        if (user === userId || user['EmpID'] === userId) {
          return user;
        }
      });

      if (exist) {
        return of(exist).pipe(map(user => {
          if (typeof (user) === 'string') {
            return user;
          } else {
            return user.EName;
          }
        }));
      } else {
        return this.userService.findById(userId).pipe(
          map((user: Member) => {
            this.cache.push(user);
            return user.EName;
          }),
          catchError(err => {
            if (err.status === 404) {
              this.cache.push(userId);
              return of(userId);
            } else {
              throw err;
            }
          })
        );
      }
    }

  }


}
