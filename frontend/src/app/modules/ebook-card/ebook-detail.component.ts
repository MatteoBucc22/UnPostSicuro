// ebook-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EbookCardComponent } from './ebook-card.component';

interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  image_url?: string;
  category?: string;
}

@Component({
  selector: 'app-ebook-detail',
  standalone: true,
  imports: [CommonModule, EbookCardComponent], 
  templateUrl: './ebook-detail.component.html',
  styleUrls: ['./ebook-detail.component.css']
})
export class EbookDetailComponent implements OnInit {
  ebook?: Ebook;
  recommendedEbooks: Ebook[] = []; // 👈 lista consigliati

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Carica il dettaglio ebook
      this.http.get<Ebook>(`http://localhost:3000/ebooks/${id}`)
        .subscribe({
          next: data => this.ebook = data,
          error: err => console.error('Errore caricamento ebook:', err)
        });

      // Carica altri ebook consigliati (escluso quello corrente)
      this.http.get<Ebook[]>(`http://localhost:3000/ebooks`)
        .subscribe({
          next: data => {
            this.recommendedEbooks = data.filter(e => e.id !== id).slice(0, 4);
          },
          error: err => console.error('Errore caricamento consigliati:', err)
        });
    }
  }
}
