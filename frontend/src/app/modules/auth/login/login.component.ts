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
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onLogin(): Promise<void> {
    if (this.form.invalid) {
      this.errorMessage = 'Compila correttamente tutti i campi';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { email, password } = this.form.value;

    try {
      const res = await this.auth.login(email, password);

      if (res?.user) {
        console.log('Login ok:', res);
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Credenziali non valide';
      }
    } catch (err: unknown) {
      console.error('Errore login:', err);
      this.errorMessage = err instanceof Error ? err.message : 'Errore durante il login';
    } finally {
      this.isSubmitting = false;
    }
  }

  loginWithGoogle(): void {
    this.auth.loginWithGoogle();
    // Supabase gestisce il redirect con la callback
  }
}
