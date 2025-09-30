import { Component, OnInit } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-debug-supabase',
  template: `<p>Controlla la console per il debug di Supabase</p>`
})
export class DebugSupabaseComponent implements OnInit {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  async ngOnInit() {
    console.log('--- Debug Supabase ---');

    // 1️⃣ Controllo URL e Key
    console.log('Supabase URL:', environment.supabaseUrl);
    console.log('Supabase Anon Key:', environment.supabaseAnonKey ? 'Caricata' : 'Manca');

    // 2️⃣ Test getSession
    const { data: sessionData, error: sessionError } = await this.supabase.auth.getSession();
    console.log('getSession() ->', sessionData, sessionError);

    // 3️⃣ Test onAuthStateChange
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('onAuthStateChange:', event, session);
    });

    // 4️⃣ Test login fittizio (senza password reale)
    // const { data, error } = await this.supabase.auth.signInWithPassword({
    //   email: 'test@example.com',
    //   password: 'password'
    // });
    // console.log('Tentativo login test:', data, error);
  }
}
