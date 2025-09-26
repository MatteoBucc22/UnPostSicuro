import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onLogin(): Promise<void> {
    const { email, password } = this.form.value;
    try {
      const res = await this.auth.login(email, password);
      if (res.user) {
        console.log('Login ok:', res);
        // Redirect automatico a /home
        this.router.navigate(['/home']);
      }
    } catch (err: any) {
      console.error('Errore login:', err.message || err);
      this.errorMessage = err.message || 'Errore durante il login';
    }
  }

  loginWithGoogle(): void {
    this.auth.loginWithGoogle(); 
    // La callback di Supabase gestirà il redirect
  }
}
