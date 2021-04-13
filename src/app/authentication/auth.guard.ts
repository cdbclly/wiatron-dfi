import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    return this.checkToken(state.url);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    return this.checkToken(state.url);
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    let url = `${route.path}`;
    return this.checkToken(url);
  }

  checkToken(url: string): boolean {
    if (this.authService.getAccessTokenId()) {
      return true;
    } else {
      this.authService.redirectUrl = url;
      this.router.navigate(['/login']);
      return false;
    }
  }
}

@Injectable()
export class ManufacturerGuard implements CanActivate {
  constructor(
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('$DFI$isExt')) {
      this.router.navigateByUrl('/dashboard/mrrMaterial/manufaturer');
      return false;
    } else {
      return true;
    }
  }
}
