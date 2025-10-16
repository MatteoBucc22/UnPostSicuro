import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EbookCardComponent } from '../ebook-card/ebook-card.component';
import { SpecialistCardComponent } from '../specialist-card/specialist-card.component';
import { HomeService } from './home.component.service';
import { Ebook } from '../ebook-card/ebook-detail.component.service';
import { Specialist } from '../specialist-card/specialist-detail.component.service';

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

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.fetchEbooks().subscribe({
      next: (data: Ebook[]) => this.ebooks = data,
      error: (err: unknown) => console.error('Errore caricamento ebook:', err)
    });

    this.homeService.fetchSpecialists().subscribe({
      next: (data: Specialist[]) => this.specialists = data,
      error: (err: unknown) => console.error('Errore caricamento specialisti:', err)
    });
  }
}
