import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.services';

@Injectable({
    providedIn: 'root'
  })
  export class GuestGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(): Observable<boolean | UrlTree> {
      return this.authService.currentAppUser.pipe(
        filter(userState => userState !== undefined),
        take(1),
        map(user => user ? this.router.parseUrl('/') : true)
      );
    }
  }
  