import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpecialistCardComponent } from '../specialist-card/specialist-card.component';
import { AuthService } from '../auth/auth.services'; // importa il servizio auth
import { User } from '@supabase/supabase-js';

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image_url?: string;
}

@Component({
  selector: 'app-specialists',
  standalone: true,
  imports: [CommonModule, HttpClientModule, SpecialistCardComponent],
  templateUrl: './specialists.component.html',
  styleUrls: ['./specialists.component.css']
})
export class SpecialistsComponent implements OnInit {
  specialists: Specialist[] = [];
  currentUser: User | null = null; // tiene traccia dell'utente loggato

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    // Sottoscrizione al BehaviorSubject di AuthService
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log('Utente loggato:', user);
    });

    // Carica gli specialisti dal backend
    this.fetchSpecialists().subscribe({
      next: (data) => this.specialists = data,
      error: (err) => console.error('Errore caricamento specialisti:', err)
    });
  }

  fetchSpecialists(): Observable<Specialist[]> {
    return this.http.get<Specialist[]>('http://localhost:3000/specialists');
  }
}
