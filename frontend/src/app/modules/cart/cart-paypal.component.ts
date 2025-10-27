import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppointmentService } from '../appointment/appointment.component.service'

declare global {
  interface Window { paypal: any; }
}

@Component({
  selector: 'app-cart-paypal',
  template: `<div id="paypal-button-container" class="mt-4"></div>`,
  standalone: true
})
export class CartPaypalComponent implements OnInit {
  @Input() amount!: number;
  @Input() userId!: string;
  @Input() appointmentId?: string; // 👈 aggiunto: serve per collegare il pagamento all’appuntamento “blocked”

  constructor(
    private http: HttpClient,
    private appointmentService: AppointmentService // 👈 inietta il service
  ) {}

  async ngOnInit() {
    if (!this.userId) {
      console.error('userId mancante');
      return;
    }

    const cfg: any = await this.http.get('/payments/config').toPromise();
    const clientId = cfg.clientId;

    await this.loadPaypalScript(clientId);
    this.renderButtons();
  }

  private loadPaypalScript(clientId: string) {
    return new Promise((resolve, reject) => {
      if (document.getElementById('paypal-sdk')) return resolve(true);

      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
      script.onload = () => resolve(true);
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    });
  }

  private renderButtons() {
    window.paypal.Buttons({
      style: { layout: 'horizontal', color: 'gold', shape: 'rect', label: 'pay' },

      createOrder: (_data: any, _actions: any) => {
        return this.http.post('/payments/create-order', {
          amount: this.amount,
          userId: this.userId
        }).toPromise().then((res: any) => res.id);
      },

      onApprove: async (_data: any, _actions: any) => {
        try {
          const orderData = await this.http.post('/payments/capture-order', {
            orderID: _data.orderID,
            userId: this.userId
          }).toPromise();

          console.log('Pagamento completato:', orderData);
          alert('✅ Pagamento completato con successo!');

          // 👇 Conferma l'appuntamento "blocked" → "booked"
          if (this.appointmentId) {
            this.appointmentService.confirmAppointment(this.appointmentId).subscribe({
              next: () => {
                alert('📅 Appuntamento confermato!');
              },
              error: (err) => {
                console.error('Errore durante conferma:', err);
                alert('Pagamento completato, ma errore nella conferma appuntamento.');
              }
            });
          }

          if (_actions && typeof _actions.close === 'function') {
            _actions.close();
          }
        } catch (err) {
          console.error('Errore durante la cattura:', err);
          alert('Errore nel pagamento PayPal.');
        }
      },

      onError: (err: any) => {
        console.error('PayPal error:', err);
        alert('Errore PayPal. Riprova più tardi.');
      }

    }).render('#paypal-button-container');
  }
}
