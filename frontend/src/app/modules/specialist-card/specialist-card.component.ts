import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image_url?: string;
}

@Component({
  selector: 'app-specialist-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './specialist-card.component.html',
  styleUrls: ['./specialist-card.component.css']
})
export class SpecialistCardComponent {
  @Input() specialist!: Specialist;
}
