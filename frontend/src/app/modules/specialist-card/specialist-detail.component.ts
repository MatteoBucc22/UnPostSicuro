import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SpecialistCardComponent } from './specialist-card.component';
import { HttpClientModule } from '@angular/common/http';

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image_url?: string;
}

@Component({
  selector: 'app-specialist-detail',
  standalone: true,
  imports: [CommonModule, SpecialistCardComponent, HttpClientModule], 
  templateUrl: './specialist-detail.component.html',
  styleUrls: ['./specialist-detail.component.css']
})
export class SpecialistDetailComponent implements OnInit {
  specialist?: Specialist;
  recommendedSpecialists: Specialist[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Carica il dettaglio specialist
      this.http.get<Specialist>(`http://localhost:3000/specialists/${id}`)
        .subscribe({
          next: data => this.specialist = data,
          error: err => console.error('Errore caricamento specialist:', err)
        });

      // Carica altri specialisti consigliati
      this.http.get<Specialist[]>(`http://localhost:3000/specialists`)
        .subscribe({
          next: data => {
            this.recommendedSpecialists = data.filter(s => s.id !== id).slice(0, 4);
          },
          error: err => console.error('Errore caricamento consigliati:', err)
        });
    }
  }
}
