import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from './cart.component.service';
import { AuthService, AppUser } from '../auth/auth.services';
import { HttpClientModule } from '@angular/common/http';

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  bio?: string;
  image_url?: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, CurrencyPipe],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  specialists: Specialist[] = [];
  user?: AppUser | null;
  isLoading: boolean = true;

  constructor(
    private cartService: CartService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // Carica specialisti
    this.cartService.getSpecialists().subscribe({
      next: data => this.specialists = data,
      error: err => console.error('Errore caricamento specialisti:', err)
    });

    // Subscribe utente
    this.auth.currentAppUser.subscribe(user => {
      this.user = user;
      if (user?.id) this.loadCart(user.id);
      else {
        this.cartItems = [];
        this.isLoading = false;
      }
    });
  }

  loadCart(userId: string) {
    this.isLoading = true;
    this.cartService.getCart(userId).subscribe({
      next: items => {
        this.cartItems = items;
        this.isLoading = false;
      },
      error: err => {
        console.error('Errore caricamento carrello:', err);
        this.cartItems = [];
        this.isLoading = false;
      }
    });
  }

  removeItem(itemId: string) {
    if (!this.user?.id) return;
    this.cartService.removeItem(this.user.id, itemId)
      .subscribe(() => this.loadCart(this.user!.id));
  }

  selectSpecialist(itemId: string, specialistId: string) {
    if (!this.user?.id) return;
    this.cartService.updateSpecialist(this.user.id, itemId, specialistId)
      .subscribe(() => this.loadCart(this.user!.id));
  }

  get realCartItems(): any[] {
    return this.cartItems.filter(item => item.ebook_id || item.specialist_id);
  }

  get isEmpty(): boolean {
    return this.realCartItems.length === 0;
  }
}
