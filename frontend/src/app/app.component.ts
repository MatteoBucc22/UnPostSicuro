import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './modules/navbar/navbar.component';
import { DebugSupabaseComponent } from './test.component';
import { AuthService } from './modules/auth/auth.services'; // <-- 1. IMPORTA IL SERVIZIO
import { CommonModule } from '@angular/common'; // <-- 2. IMPORTA CommonModule PER *ngIf e | async

@Component({
  selector: 'app-root',
  standalone: true,
  // 3. AGGIUNGI CommonModule AGLI IMPORTS
  imports: [CommonModule, RouterOutlet, NavbarComponent, DebugSupabaseComponent],

  // 4. MODIFICA IL TEMPLATE INLINE CON LA LOGICA DI CARICAMENTO
  template: `
    <!--
      Contenitore principale che attende la fine del caricamento.
      Mostra il contenuto solo quando lo stato NON è più 'undefined'.
    -->
    <div *ngIf="(authService.currentUser | async) !== undefined; else loadingScreen">

      <!-- La tua Navbar -->
      <app-navbar></app-navbar>

      <!-- 
        Il contenuto principale, dove Angular caricherà i componenti.
        Il pt-28 (padding-top) serve per non far finire il contenuto
        sotto la navbar fissa.
      -->
      <div class="pt-28 min-h-screen">
        <router-outlet></router-outlet>
        
        <!-- Componente di debug, puoi lasciarlo o toglierlo -->
        <app-debug-supabase></app-debug-supabase>
      </div>

      <!-- Aggiungi un footer se lo desideri -->
      <footer class="text-center p-6 bg-gray-100 mt-8">
        <p class="text-gray-600">© 2025 Un Posto Sicuro. Tutti i diritti riservati.</p>
      </footer>

    </div>

    <!-- 
      Schermata di caricamento: viene mostrata SOLO mentre lo stato è 'undefined'.
    -->
    <ng-template #loadingScreen>
      <div class="flex items-center justify-center h-screen bg-gray-50">
        <div class="text-center">
          <img src="assets/img/logo.jpeg" alt="Logo" class="w-24 h-24 mx-auto mb-4 animate-pulse"/>
          <p class="text-lg text-gray-700">Caricamento in corso...</p>
        </div>
      </div>
    </ng-template>
  `,
})
export class AppComponent {
  // 5. INIETTA L'AUTHSERVICE NEL COSTRUTTORE E RENDILO PUBBLICO
  constructor(public authService: AuthService) {}
}