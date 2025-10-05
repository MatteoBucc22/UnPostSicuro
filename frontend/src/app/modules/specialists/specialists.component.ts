import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SpecialistCardComponent } from '../specialist-card/specialist-card.component';
import { SpecialistService, Specialist } from '../specialist-card/specialist-detail.component.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-specialists',
  standalone: true,
  imports: [CommonModule, HttpClientModule, SpecialistCardComponent, RouterLink],
  templateUrl: './specialists.component.html',
  styleUrls: ['./specialists.component.css']
})
export class SpecialistsComponent implements OnInit {
  specialists: Specialist[] = [];

  constructor(private specialistService: SpecialistService) {}

  ngOnInit(): void {
    this.loadSpecialists();
  }

  loadSpecialists(): void {
    this.specialistService.getAllSpecialists().subscribe({
      next: data => this.specialists = data,
      error: err => console.error('Errore caricamento specialisti:', err)
    });
  }
}
