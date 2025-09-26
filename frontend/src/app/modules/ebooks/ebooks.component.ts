import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EbookCardComponent } from '../ebook-card/ebook-card.component';

interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  image_url?: string;
  category?: string;
}

@Component({
  selector: 'app-ebooks',
  standalone: true,
  imports: [CommonModule, HttpClientModule, EbookCardComponent ],
  templateUrl: './ebooks.component.html',
  styleUrls: ['./ebooks.component.css']
})
export class EbooksComponent implements OnInit {
  ebooks: Ebook[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEbooks().subscribe({
      next: (data) => this.ebooks = data,
      error: (err) => console.error('Errore caricamento ebook:', err)
    });
  }

  fetchEbooks(): Observable<Ebook[]> {
    // Assicurati che il backend abbia una route GET /ebooks che ritorna tutti gli ebook
    return this.http.get<Ebook[]>('http://localhost:3000/ebooks');
  }
}
