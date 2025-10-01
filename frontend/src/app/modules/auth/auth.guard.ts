import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentAppUser.pipe(
      // 1. Filtra: Ignora il valore iniziale 'undefined' e attendi
      //    che lo stato sia definito (o User o null).
      filter(userState => userState !== undefined),
      // 2. Prendi solo il primo valore emesso dopo il filtro (non vogliamo
      //    che il guard si riattivi al logout, per esempio).
      take(1),
      // 3. Mappa: Trasforma il valore in un booleano.
      map(user => {
        if (user) {
          console.log("TEST: Utente loggato, accesso consentito.");
          return true; // Utente loggato, permette la navigazione.
        } else {
          // Utente non loggato, reindirizza alla pagina di login.
          console.log("TEST: Utente non loggato, reindirizzamento alla pagina di login.");
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}