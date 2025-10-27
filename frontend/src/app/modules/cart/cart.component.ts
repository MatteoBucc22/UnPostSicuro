import { Component, OnInit } from '@angular/core'; // ❌ Rimosso ViewChild
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from './cart.component.service';
import { AuthService, AppUser } from '../auth/auth.services';
import { HttpClientModule } from '@angular/common/http';
// ❌ Rimosse:
// import { SpecialistCardComponent } from '../specialist-card/specialist-card.component';
// import { Specialist } from '../specialist-card/specialist-detail.component.service';
// import { AppointmentComponent } from '../appointment/appointment.component';

import { CartPaypalComponent } from './cart-paypal.component';



@Component({
  selector: 'app-cart',
  standalone: true,
  // ❌ Rimosso SpecialistCardComponent e AppointmentComponent
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, CurrencyPipe, CartPaypalComponent], 
  templateUrl: './cart.component.html',
})

export class CartComponent implements OnInit {
  // ❌ Rimosso:
  // @ViewChild('calendarComp') calendarComp?: AppointmentComponent;
  
  // ❌ Rimosso:
  // get appointmentId(): string | undefined {
  //   return this.calendarComp?.pendingAppointmentId;
  // }

  cartItems: any[] = [];
  // ❌ Rimosso:
  // specialists: Specialist[] = [];
  user?: AppUser | null;
  isLoading: boolean = true;

  constructor(
    private cartService: CartService,
    private auth: AuthService
  ) {}

  get subtotal(): number {
    return this.realCartItems.reduce((acc, item) => acc + (item.ebooks?.price || 0), 0);
  }

  get totalWithVAT(): number {
    return this.subtotal * 1.22; // aggiunge 22% IVA
  }
  

  ngOnInit(): void {
    // ❌ Rimosso caricamento specialisti
    // this.cartService.getSpecialists().subscribe({
    //   next: data => this.specialists = data,
    //   error: err => console.error('Errore caricamento specialisti:', err)
    // });

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
        // ❌ Rimosso 'selectedSpecialist: item.specialist_id || '' '
        this.cartItems = items.map(item => ({
          ...item
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

  // ❌ Rimosso:
  // selectSpecialist(itemId: string, specialistId: string) {
  //   if (!this.user?.id) return;
  //   this.cartService.updateSpecialist(this.user.id, itemId, specialistId)
  //     .subscribe(() => this.loadCart(this.user!.id));
  // }
  
  // ❌ Rimosso:
  // selectSpecialistForItem(itemId: string, specialistId: string) {
  //   if (!this.user?.id) return;
  //   this.cartService.updateSpecialist(this.user.id, itemId, specialistId)
  //     .subscribe(() => {
  //       const item = this.cartItems.find(i => i.id === itemId);
  //       if (item) item.selectedSpecialist = specialistId;
  //     });
  // }

  // ❌ Rimosso:
  // onScroll(event: WheelEvent) {
  //   const element = event.currentTarget as HTMLElement;
  //   if (event.deltaY !== 0) {
  //     event.preventDefault();
  //     element.scrollLeft += event.deltaY;
  //   }
  // }
  
  // ❌ Rimosso:
  // scrollLeft(id: string) {
  //   const container = document.querySelector(`[data-id="${id}"]`);
  //   if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
  // }
  
  // ❌ Rimosso:
  // scrollRight(id: string) {
  //   const container = document.querySelector(`[data-id="${id}"]`);
  //   if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
  // }
  

  checkout() {
    alert('Checkout in arrivo 🛒');
  }
  
  

  get realCartItems(): any[] {
    // Il carrello ora contiene solo ebook, quindi filtriamo solo su 'ebook_id'
    return this.cartItems.filter(item => item.ebook_id); 
  }

  get isEmpty(): boolean {
    return this.realCartItems.length === 0;
  }
}