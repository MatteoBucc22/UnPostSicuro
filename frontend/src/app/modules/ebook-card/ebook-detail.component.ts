import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EbookCardComponent } from './ebook-card.component';
import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../cart/cart.component.service';   // 👈 importa
import { AuthService, AppUser } from '../auth/auth.services';  // 👈 per recuperare userId

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
  imports: [CommonModule, EbookCardComponent, HttpClientModule], 
  templateUrl: './ebook-detail.component.html',
  styleUrls: ['./ebook-detail.component.css']
})
export class EbookDetailComponent implements OnInit {
  ebook?: Ebook;
  recommendedEbooks: Ebook[] = [];
  user?: AppUser | null;   // 👈 utente loggato
  isAdding: boolean = false; // 👈 per feedback UI

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cartService: CartService,  // 👈 inietto servizio carrello
    private auth: AuthService          // 👈 inietto auth
  ) {}

  ngOnInit(): void {
    // Recupera utente loggato
    this.auth.currentAppUser.subscribe(u => this.user = u);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Carica ebook
      this.http.get<Ebook>(`http://localhost:3000/ebooks/${id}`)
        .subscribe({
          next: data => this.ebook = data,
          error: err => console.error('Errore caricamento ebook:', err)
        });

      // Carica consigliati
      this.http.get<Ebook[]>(`http://localhost:3000/ebooks`)
        .subscribe({
          next: data => {
            this.recommendedEbooks = data.filter(e => e.id !== id).slice(0, 4);
          },
          error: err => console.error('Errore caricamento consigliati:', err)
        });
    }
  }

  addToCart() {
    console.log("Utente:", this.user);
    console.log("Ebook:", this.ebook);
  
    if (!this.user?.id || this.ebook?.id === undefined || this.ebook?.id === null) {
      console.warn("Manca user.id o ebook.id");
      return;
    }
  
    this.isAdding = true;
    this.cartService.addToCart(this.user.id, this.ebook.id).subscribe({
      next: () => {
        this.isAdding = false;
        alert("Ebook aggiunto al carrello! ✅");
      },
      error: err => {
        this.isAdding = false;
        console.error("Errore aggiunta al carrello:", err);
        alert("Errore durante l'aggiunta al carrello ❌");
      }
    });
  }
  
}
