import { Routes } from '@angular/router';

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
},
{
path: 'ebooks/:id',
loadComponent: () =>
import('./modules/ebook-card/ebook-detail.component').then(m => m.EbookDetailComponent)
},
{
path: 'registration-page',
loadComponent: () =>
import('./modules/auth/register/registration-page.component').then(m => m.RegistrationPageComponent),
},
{ path: '**', redirectTo: '' }
];
