import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, AppUser } from '../auth/auth.services';
import { CartService } from '../cart/cart.component.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  user: AppUser | null | undefined;
  cartItems: any[] = [];
  isMenuOpen = false;

  constructor(private authService: AuthService, private cartService: CartService) {}

  ngOnInit(): void {
    this.authService.currentAppUser.subscribe(user => {
      this.user = user ?? null;
      if (this.user?.id) this.loadCart();
    });
  }

  loadCart() {
    if (!this.user) return;
    this.cartService.getCart(this.user.id).subscribe(items => this.cartItems = items);
  }

  logout() {
    this.authService.logout();
    this.user = null;
    this.cartItems = [];
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  toggleMenu() { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu() { this.isMenuOpen = false; }
}
