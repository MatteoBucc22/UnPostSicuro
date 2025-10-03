import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SpecialistCardComponent } from './specialist-card.component';
import { SpecialistService, Specialist } from './specialist-detail.component.service';

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

  constructor(
    private route: ActivatedRoute,
    private specialistService: SpecialistService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    // Carica dettaglio specialist
    this.specialistService.getSpecialist(id).subscribe({
      next: data => this.specialist = data,
      error: err => console.error('Errore caricamento specialist:', err)
    });

    // Carica consigliati
    this.specialistService.getAllSpecialists().subscribe({
      next: data => {
        this.recommendedSpecialists = data.filter(s => s.id !== id).slice(0, 4);
      },
      error: err => console.error('Errore caricamento consigliati:', err)
    });
  }
}
