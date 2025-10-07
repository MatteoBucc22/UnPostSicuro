import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from './cart.component.service';
import { AuthService, AppUser } from '../auth/auth.services';
import { HttpClientModule } from '@angular/common/http';
import { SpecialistCardComponent } from '../specialist-card/specialist-card.component';
import { Specialist } from '../specialist-card/specialist-detail.component.service';
import { CartPaypalComponent } from './cart-paypal.component';



@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, CurrencyPipe, SpecialistCardComponent, CartPaypalComponent],
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

  get subtotal(): number {
    return this.realCartItems.reduce((acc, item) => acc + (item.ebooks?.price || 0), 0);
  }

  ngOnInit(): void {
    // Carica specialisti
    this.cartService.getSpecialists().subscribe({
      next: data => this.specialists = data,
      error: err => console.error('Errore caricamento specialisti:', err)
    });

    console.log(this.subtotal)
  
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
        this.cartItems = items.map(item => ({
          ...item,
          selectedSpecialist: item.specialist_id || ''
        }));
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

  selectSpecialistForItem(itemId: string, specialistId: string) {
    if (!this.user?.id) return;
    this.cartService.updateSpecialist(this.user.id, itemId, specialistId)
      .subscribe(() => {
        // aggiorna solo la selezione senza ricaricare tutto
        const item = this.cartItems.find(i => i.id === itemId);
        if (item) item.selectedSpecialist = specialistId;
      });
  }

  onScroll(event: WheelEvent) {
    const element = event.currentTarget as HTMLElement;
    if (event.deltaY !== 0) {
      event.preventDefault();
      element.scrollLeft += event.deltaY;
    }
  }
  
  scrollLeft(id: string) {
    const container = document.querySelector(`[data-id="${id}"]`);
    if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
  }
  
  scrollRight(id: string) {
    const container = document.querySelector(`[data-id="${id}"]`);
    if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
  }
  


  
  
  checkout() {
    alert('Checkout in arrivo 🛒');
  }
  
  

  get realCartItems(): any[] {
    return this.cartItems.filter(item => item.ebook_id || item.specialist_id);
  }

  get isEmpty(): boolean {
    return this.realCartItems.length === 0;
  }
}
