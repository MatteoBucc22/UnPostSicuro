import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

interface UserProfile {
  id: string;
  name: string;
  surname?: string;
  email: string;
  dob?: string;
  gender?: string;
  phone?: string;
  city?: string;
  bio?: string;
  avatar_url?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user?: UserProfile;
  loading = true;
  error?: string;
  editing = false;
  editModel: Partial<UserProfile> = {};

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.error = undefined;

    const userId = localStorage.getItem('userId'); // o da auth service
    console.log('User ID:', userId);
    if (!userId) {
      this.error = 'Utente non autenticato';
      this.loading = false;
      return;
    }

    this.http.get<UserProfile>(`http://localhost:3000/users/${userId}`).subscribe({
      next: (u) => {
        this.user = u;
        this.resetEditModel();
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore caricamento profilo', err);
        this.error = 'Impossibile caricare il profilo. Riprova più tardi.';
        this.loading = false;
      }
    });
  }

  resetEditModel() {
    this.editModel = {
      name: this.user?.name,
      surname: this.user?.surname,
      email: this.user?.email,
      dob: this.user?.dob,
      gender: this.user?.gender,
      phone: this.user?.phone,
      city: this.user?.city,
      bio: this.user?.bio
    };
  }

  enableEdit() {
    this.editing = true;
    this.resetEditModel();
  }

  cancelEdit() {
    this.editing = false;
    this.resetEditModel();
  }

  saveProfile() {
    if (!this.user) return;
    const userId = localStorage.getItem('userId'); 
    this.http.patch<UserProfile>(`http://localhost:3000/users/${userId}`, this.editModel).subscribe({
      next: (updated) => {
        this.user = updated;
        this.editing = false;
      },
      error: (err) => {
        console.error('Errore salvataggio profilo', err);
        this.error = 'Errore durante il salvataggio. Riprova.';
      }
    });
  }

  logout() {
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
