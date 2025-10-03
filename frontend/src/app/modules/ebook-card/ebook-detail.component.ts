import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EbookCardComponent } from './ebook-card.component';
import { CartService } from '../cart/cart.component.service';
import { AuthService, AppUser } from '../auth/auth.services';
import { EbookService, Ebook } from './ebook-detail.component.service';

@Component({
  selector: 'app-ebook-detail',
  standalone: true,
  imports: [CommonModule, EbookCardComponent],
  templateUrl: './ebook-detail.component.html',
  styleUrls: ['./ebook-detail.component.css']
})
export class EbookDetailComponent implements OnInit {
  ebook?: Ebook;
  recommendedEbooks: Ebook[] = [];
  user?: AppUser | null;
  isAdding = false;

  constructor(
    private route: ActivatedRoute,
    private ebookService: EbookService,
    private cartService: CartService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.currentAppUser.subscribe(u => this.user = u);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ebookService.getEbook(id).subscribe({
        next: (data) => this.ebook = data,
        error: (err) => console.error('Errore caricamento ebook:', err)
      });

      this.ebookService.getAllEbooks().subscribe({
        next: (data) => {
          this.recommendedEbooks = data.filter(e => e.id !== id).slice(0, 4);
        },
        error: (err) => console.error('Errore caricamento consigliati:', err)
      });
    }
  }

  addToCart() {
    if (!this.user?.id || !this.ebook?.id) {
      console.warn("Manca user.id o ebook.id");
      return;
    }

    this.isAdding = true;
    this.cartService.addToCart(this.user.id, this.ebook.id).subscribe({
      next: () => {
        this.isAdding = false;
        alert("Ebook aggiunto al carrello! ✅");
      },
      error: (err) => {
        this.isAdding = false;
        console.error("Errore aggiunta al carrello:", err);
        alert("Errore durante l'aggiunta al carrello ❌");
      }
    });
  }
}
