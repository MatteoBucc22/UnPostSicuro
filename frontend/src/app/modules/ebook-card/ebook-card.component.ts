// ebook-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  image_url?: string;
  category?: string;
}

@Component({
  selector: 'app-ebook-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ebook-card.component.html',
  styleUrls: ['./ebook-card.component.css']
})
export class EbookCardComponent {
  @Input() ebook!: Ebook;
}
