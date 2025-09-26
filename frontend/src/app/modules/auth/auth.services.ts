// auth.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

interface LoginResponse {
  session: Session | null;
  user: User | null;
}

interface RegisterResponse {
  user: User | null;
  session: Session | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  // BehaviorSubject per tenere traccia dell'utente loggato in tempo reale
  public currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    this.initSession();
  }

  // Inizializza la sessione all'avvio dell'app
  private async initSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    this.currentUser.next(session?.user ?? null);

    // Listener globale per cambiamenti di autenticazione
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUser.next(session?.user ?? null);
    });
  }

  // Login con email e password
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    this.currentUser.next(data.user ?? null);
    return { session: data.session, user: data.user };
  }

  // Registrazione con email e password
  async register(email: string, password: string): Promise<RegisterResponse> {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    this.currentUser.next(data.user ?? null);
    return { user: data.user, session: data.session };
  }

  // Login con Google
  loginWithGoogle() {
    this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/callback' }
    }).then(({ data, error }) => {
      if (error) console.error('Errore login Google:', error.message);
      else if (data.url) window.location.href = data.url;
    });
  }

  // Logout
  async logout() {
    await this.supabase.auth.signOut();
    this.currentUser.next(null);
  }

  // Recupera utente corrente
  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session?.user ?? null;
  }
}
