import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, AppUser } from '../auth/auth.services';
import { CartService } from '../cart/cart.component.service';

interface CartItem {
  id: string;
  ebook_id?: string | null;
  specialist_id?: string | null;
  quantity?: number;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  user: AppUser | null = null;
  realCartItems: CartItem[] = [];
  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authService.currentAppUser.subscribe((user: AppUser | null | undefined) => {
      this.user = user ?? null;
      if (this.user?.id) {
        this.loadCart();
      } else {
        this.realCartItems = [];
      }
    });
  }

  loadCart(): void {
    if (!this.user) return;
  
    this.cartService.getCart(this.user.id).subscribe({
      next: (items: CartItem[]) => {
        // Filtra le righe senza ebook o specialist
        this.realCartItems = items.filter(item => item.ebook_id || item.specialist_id);
      },
      error: (err: unknown) => console.error('Errore caricamento carrello:', err)
    });
  }
  

  logout(): void {
    this.authService.logout();
    this.user = null;
    this.realCartItems = [];
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
