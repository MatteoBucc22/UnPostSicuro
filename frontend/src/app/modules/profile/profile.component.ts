import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProfileService, UserProfile } from './profile.component.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user?: UserProfile;
  loading = true;
  error?: string;
  editing = false;
  editModel: Partial<UserProfile> = {};

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private get userId(): string | null {
    return localStorage.getItem('userId');
  }

  loadProfile() {
    this.loading = true;
    this.error = undefined;

    if (!this.userId) {
      this.error = 'Utente non autenticato';
      this.loading = false;
      return;
    }

    this.profileService.getProfile(this.userId).subscribe({
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
    if (!this.user) return;
    this.editModel = { ...this.user };
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
    if (!this.userId) return;

    this.profileService.updateProfile(this.userId, this.editModel).subscribe({
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
