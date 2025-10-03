import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EbookCardComponent } from '../ebook-card/ebook-card.component';
import { RouterLink } from '@angular/router';
import { EbooksService } from './ebooks.component.service';

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
  imports: [CommonModule, HttpClientModule, EbookCardComponent, RouterLink],
  templateUrl: './ebooks.component.html',
  styleUrls: ['./ebooks.component.css']
})
export class EbooksComponent implements OnInit {
  ebooks: Ebook[] = [];

  constructor(private ebooksService: EbooksService) {}

  ngOnInit(): void {
    this.ebooksService.fetchEbooks().subscribe({
      next: (data) => this.ebooks = data,
      error: (err) => console.error('Errore caricamento ebook:', err)
    });
  }
}
