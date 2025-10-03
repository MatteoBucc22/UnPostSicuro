import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

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
    const { data } = await this.supabase.auth.getSession();
    const user = data.session?.user ?? null;

    await this.handleSessionUser(user);

    this.supabase.auth.onAuthStateChange(async (_event, session) => {
      await this.handleSessionUser(session?.user ?? null);
    });
  }

  private async handleSessionUser(user: User | null) {
    if (user) {
      try {
        const appUser = await this.fetchAppUser(user.id);
        this.currentAppUser.next(appUser);
        localStorage.setItem('userId', appUser.id);
        // await this.initCartForUser(appUser.id);
      } catch (error) {
        console.error('[AuthService] Errore fetch AppUser:', error);
        this.currentAppUser.next(null);
        localStorage.removeItem('userId');
      }
    } else {
      this.currentAppUser.next(null);
      localStorage.removeItem('userId');
    }
  }

  private async fetchAppUser(userId: string): Promise<AppUser> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as AppUser;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    if (data.user) {
      await this.handleSessionUser(data.user);
    }

    return { session: data.session, user: data.user };
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      await this.handleSessionUser(data.user);
    }

    return { session: data.session, user: data.user };
  }

  async loginWithGoogle() {
    if (typeof window === 'undefined') return;
    await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/callback' }
    });
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.currentAppUser.next(null);
    localStorage.removeItem('userId');
  }

  async clearSession() {
    try {
      await this.supabase.auth.signOut();
      this.currentAppUser.next(null);
      localStorage.removeItem('userId');
      console.log('[AuthService] Sessione rimossa.');
    } catch (error) {
      console.error('[AuthService] Errore rimozione sessione:', error);
    }
  }

//   private async initCartForUser(userId: string) {
//     try {
//       const { data, error } = await this.supabase
//         .from('cart_item')
//         .select('*')
//         .eq('user_id', userId)
//         .single();

//       if (error) {
//         if (error.code === 'PGRST116') {
//           // Nessun record → crealo
//           const newCartItem = { id: uuidv4(), user_id: userId, ebook_id: null, specialist_id: null };
//           const { data: inserted, error: insertError } = await this.supabase
//             .from('cart_item')
//             .insert(newCartItem)
//             .select()
//             .single();

//           if (insertError) console.error('[AuthService] Errore creazione cartItem:', insertError);
//           else console.log('[AuthService] CartItem creato:', inserted);
//         } else {
//           console.error('[AuthService] Errore fetch cartItem:', error.message);
//         }
//         return;
//       }

//       console.log('[AuthService] CartItem già esistente:', data);
//     } catch (err) {
//       console.error('[AuthService] Errore initCartForUser:', err);
//     }
//   }
}
