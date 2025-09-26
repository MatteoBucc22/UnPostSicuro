import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink]
})
export class RegistrationPageComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', [Validators.pattern(/^[0-9]*$/)]],
      city: ['', Validators.required],
      providerId: [''] // solo per Google
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['email'] && params['id']) {
        this.form.patchValue({
          email: params['email'],
          providerId: params['id']
        });
        this.form.get('email')?.disable(); // blocca modifica
        this.form.get('password')?.clearValidators(); // password opzionale
        this.form.get('password')?.updateValueAndValidity();
      }
    });
  }
  
  onRegister() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    this.http.post('http://localhost:3000/register', this.form.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => console.error('Errore registrazione:', err)
    });
  }
  

  get f(): { [key: string]: any } {
    return this.form.controls;
  }
}
