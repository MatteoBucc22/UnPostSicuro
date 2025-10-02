import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


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
  { path: 'ebooks/:id', loadComponent: () =>
    import('./modules/ebook-card/ebook-detail.component').then(m => m.EbookDetailComponent)
  },
  { path: 'specialists/:id', loadComponent: () =>
    import('./modules/specialist-card/specialist-detail.component').then(m => m.SpecialistDetailComponent)
  },
  {
    path: 'registration-page',
    loadComponent: () =>
      import('./modules/auth/register/registration-page.component').then(m => m.RegistrationPageComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./modules/profile/profile.component').then(m => m.ProfileComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./modules/cart/cart.component').then(m => m.CartComponent),
  },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
