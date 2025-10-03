import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.currentAppUser.pipe(
      // 1. Ignora undefined (stato iniziale non ancora caricato)
      filter(userState => userState !== undefined),
      // 2. Prendi solo il primo valore valido
      take(1),
      // 3. Trasforma in boolean o UrlTree
      map(user => {
        if (user) {
          console.log("✅ Utente loggato, accesso consentito.");
          return true;
        } else {
          console.log("❌ Utente non loggato → redirect login.");
          return this.router.parseUrl('/login'); // ritorna UrlTree, non fa redirect immediato
        }
      })
    );
  }
}
