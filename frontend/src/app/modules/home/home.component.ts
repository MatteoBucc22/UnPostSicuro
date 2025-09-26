import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EbookCardComponent } from '../ebook-card/ebook-card.component'; 
import { SpecialistCardComponent } from '../specialist-card/specialist-card.component';

interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  image_url?: string;
  category?: string;
}

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image_url?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, EbookCardComponent, SpecialistCardComponent], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ebooks: Ebook[] = [];
  specialists: Specialist[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEbooks().subscribe({
      next: (data) => this.ebooks = data,
      error: (err) => console.error('Errore caricamento ebook:', err)
    });
  
    this.fetchSpecialists().subscribe({
      next: (data) => this.specialists = data,
      error: (err) => console.error('Errore caricamento ebook:', err)
    });
  }

  fetchEbooks(): Observable<Ebook[]> {
    return this.http.get<Ebook[]>('http://localhost:3000/ebooks');
  }
  fetchSpecialists(): Observable<Specialist[]> {
    return this.http.get<Specialist[]>('http://localhost:3000/specialists');
  }
}