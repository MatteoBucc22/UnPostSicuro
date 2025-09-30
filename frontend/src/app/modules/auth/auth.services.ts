import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;

  // Stato utente:
  // undefined = Lo stato iniziale, sto ancora caricando/verificando la sessione.
  // null      = Verifica completata, l'utente non è loggato.
  // User      = Verifica completata, l'utente è loggato.
  public currentUser = new BehaviorSubject<User | null | undefined>(undefined);

  constructor() {
    console.log('[AuthService] Inizializzazione del servizio...');
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  
    // Recupera la sessione iniziale
    this.supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('[AuthService] Errore recupero sessione iniziale:', error);
        this.currentUser.next(null);
      } else {
        console.log('[AuthService] Sessione iniziale:', data.session);
        this.currentUser.next(data.session?.user ?? null);
      }
    });
  
    // Ascolta i cambiamenti successivi
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[AuthService] Evento onAuthStateChange: ${event}`, session);
      this.currentUser.next(session?.user ?? null);
    });
  }
  

  // ngOnInit non è più necessario per l'inizializzazione della sessione.
  // Rimosso.

  // initSession() non è più necessario, perché onAuthStateChange fa già tutto.
  // Rimosso.

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Non è necessario fare this.currentUser.next() qui,
    // perché onAuthStateChange verrà attivato automaticamente da Supabase.
    return { session: data.session, user: data.user };
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    // Anche qui, onAuthStateChange si occuperà di aggiornare lo stato.
    return { session: data.session, user: data.user };
  }

  async loginWithGoogle() {
    // Gestisci il caso in cui 'window' non sia definito (SSR)
    if (typeof window === 'undefined') {
      console.warn('[AuthService] Tentativo di login con Google in ambiente non-browser (SSR). Operazione annullata.');
      return;
    }
    await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/callback' } // Assicurati che '/callback' sia una rotta valida
    });
  }

  async logout() {
    await this.supabase.auth.signOut();
    // onAuthStateChange imposterà currentUser a null automaticamente.
  }
}