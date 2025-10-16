import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/auth.guard';
import { GuestGuard } from './modules/auth/guest.guard';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'ebooks',
    loadComponent: () =>
      import('./modules/ebooks/ebooks.component').then(m => m.EbooksComponent)
  },
  {
    path: 'specialists',
    loadComponent: () =>
      import('./modules/specialists/specialists.component').then(m => m.SpecialistsComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [GuestGuard]  // blocca se loggato
  },
  {
    path: 'registration-page',
    loadComponent: () =>
      import('./modules/auth/register/registration-page.component').then(m => m.RegistrationPageComponent),
    canActivate: [GuestGuard]  // blocca se loggato
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./modules/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]   // solo utenti loggati
  },
  {
    path: 'my-appointments',
    loadComponent: () =>
      import('./modules/my-appointments/my-appointments.component').then(m => m.MyAppointmentsComponent),
    canActivate: [AuthGuard]   // solo utenti loggati
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./modules/cart/cart.component').then(m => m.CartComponent),
    canActivate: [AuthGuard]   // solo utenti loggati
  },
  { path: 'ebooks/:id', loadComponent: () =>
      import('./modules/ebook-card/ebook-detail.component').then(m => m.EbookDetailComponent)
  },
  { path: 'specialists/:id', loadComponent: () =>
      import('./modules/specialist-card/specialist-detail.component').then(m => m.SpecialistDetailComponent)
  },
  { path: '**', redirectTo: '' }
];
