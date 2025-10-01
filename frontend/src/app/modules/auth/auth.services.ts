
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  surname: string;
  city?: string;
  gender?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  public currentAppUser = new BehaviorSubject<AppUser | null | undefined>(undefined);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    this.init();
  }

  private async init() {
    // Recupera sessione iniziale
    const { data } = await this.supabase.auth.getSession();
    const user = data.session?.user ?? null;

    if (user) {
      const appUser = await this.fetchAppUser(user.id);
      this.currentAppUser.next(appUser);
    } else {
      this.currentAppUser.next(null);
    }

    // Ascolta cambiamenti di sessione
    this.supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      if (user) {
        const appUser = await this.fetchAppUser(user.id);
        this.currentAppUser.next(appUser);
      } else {
        this.currentAppUser.next(null);
      }
    });
  }

  private async fetchAppUser(userId: string) {
    // Non tipizzare il primo argomento (tabella) e non usare T = AppUser
    const { data, error } = await this.supabase
      .from('users')            // <- senza generics qui
      .select('*')               // <- senza tipizzazione complicata
      .eq('id', userId)
      .single();
  
    if (error) throw error;
  
    // Forza il tipo qui, non prima
    return data as AppUser;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { session: data.session, user: data.user };
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    return { session: data.session, user: data.user };
  }

  async loginWithGoogle() {
    if (typeof window === 'undefined') {
      console.warn('[AuthService] Login Google in ambiente non-browser annullato.');
      return;
    }
    await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/callback' }
    });
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.currentAppUser.next(null);
  }

  async clearSession() {
    try {
      await this.supabase.auth.signOut(); // elimina la sessione corrente
      this.currentAppUser.next(null);     // resetta lo stato locale
      console.log('[AuthService] Sessione rimossa.');
    } catch (error) {
      console.error('[AuthService] Errore rimozione sessione:', error);
    }
  }

}

