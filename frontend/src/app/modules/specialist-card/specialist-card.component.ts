import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Specialist } from './specialist-detail.component.service';


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
