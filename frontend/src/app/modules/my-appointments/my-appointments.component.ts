import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, Appointment } from '../appointment/appointment.component.service';
import { AuthService, AppUser } from '../auth/auth.services';
import { take } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Importa i componenti necessari per la nuova sezione
import { SpecialistCardComponent } from '../specialist-card/specialist-card.component';
import { Specialist } from '../specialist-card/specialist-detail.component.service';
import { AppointmentComponent } from '../appointment/appointment.component'; 
import { CartService } from '../cart/cart.component.service';


@Component({
  selector: 'app-my-appointments',
  standalone: true,
  // Assicurati che tutti i componenti usati nel template siano importati qui
  imports: [CommonModule, RouterLink, FormsModule, SpecialistCardComponent, AppointmentComponent], 
  templateUrl: './my-appointments.component.html'
})
export class MyAppointmentsComponent implements OnInit {
  appointments: (Appointment & {
    editing?: boolean;
    newDate?: string;
    newTime?: string;
    availableSlots?: string[];
  })[] = [];

  loading = false;
  error?: string;
  user?: AppUser | null; // Aggiunto per l'uso nel template di booking
  
  // Filtri
  filterStatus: 'all' | 'booked' | 'completed' | 'blocked' | 'canceled' = 'all';
  filterDate?: string; // yyyy-MM-dd

  // ────────────── Nuova Seduta ──────────────
  isBookingNew: boolean = false;
  specialists: Specialist[] = [];
  selectedSpecialistId?: string | number;


  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private cartService: CartService // Usato per caricare la lista degli specialisti
  ) {}

  ngOnInit() {
    // Carica specialisti
    this.cartService.getSpecialists().subscribe({
      next: data => this.specialists = data,
      error: err => console.error('Errore caricamento specialisti:', err)
    });

    this.authService.currentAppUser.pipe(take(1)).subscribe(user => {
      this.user = user;
      if (user?.id) this.loadAppointments(user.id);
    });
  }

  filteredAppointments: typeof this.appointments = [];

  loadAppointments(userId: string) {
    this.loading = true;
    fetch(`/api/appointments/user/${userId}`)
      .then(res => res.json())
      .then((data: any[]) => {
        this.appointments = data.map(app => ({
          ...app,
          editing: false
        }));
        this.applyFilters();
      })
      .catch(err => {
        console.error('Errore caricamento appuntamenti:', err);
        this.error = 'Errore durante il caricamento degli appuntamenti.';
      })
      .finally(() => (this.loading = false));
  }

  applyFilters() {
    this.filteredAppointments = this.appointments.filter(app => {
      const statusMatch = this.filterStatus === 'all' || app.status === this.filterStatus;
      const dateMatch = !this.filterDate || app.start_time.startsWith(this.filterDate);
      return statusMatch && dateMatch;
    });
  }


  // ────────────── Nuova Seduta Metodi ──────────────
  toggleBookingMode() {
    this.isBookingNew = !this.isBookingNew;
    // Resetta lo stato quando si chiude il pannello di booking
    if (!this.isBookingNew) {
      this.selectedSpecialistId = undefined;
    }
  }

  getSpecialistNameById(id: string | number): string {
    const specialist = this.specialists.find(s => s.id == id);
    return specialist ? `${specialist.name} ${specialist.surname}` : 'Specialista Sconosciuto';
  }

  onNewAppointmentBooked(newAppointment: Appointment) {
    this.isBookingNew = false;
    this.selectedSpecialistId = undefined;
    alert('✅ Nuova seduta prenotata con successo');
    // Ricarica la lista degli appuntamenti
    if (this.user?.id) {
      this.loadAppointments(this.user.id);
    }
  }

  // ────────────── Utility per lo scroll ──────────────
  onScroll(event: WheelEvent) {
    const element = event.currentTarget as HTMLElement;
    if (event.deltaY !== 0) {
      event.preventDefault();
      element.scrollLeft += event.deltaY;
    }
  }
  
  scrollLeft(dataId: string) {
    const container = document.querySelector(`[data-id="${dataId}"]`);
    if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
  }
  
  scrollRight(dataId: string) {
    const container = document.querySelector(`[data-id="${dataId}"]`);
    if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
  }

  // ────────────── Modifica appuntamento (Logica esistente) ──────────────
  onDateChange(app: any) {
    if (!app.newDate || !app.specialist_id) return;
    const date = new Date(app.newDate);
    this.generateAvailableSlots(app, date);
  }

  generateAvailableSlots(app: any, date: Date) {
    const startHour = 9;
    const endHour = 18;
    const slotDuration = 60;
    const allSlots: string[] = [];

    for (let h = startHour; h < endHour; h++) {
      allSlots.push(`${h.toString().padStart(2, '0')}:00`);
    }

    this.appointmentService
      .getSpecialistAppointments(app.specialist_id)
      .subscribe(appointments => {
        const now = new Date();
        const blockedSlots: string[] = [];

        appointments.forEach(a => {
          const start = new Date(a.start_time);
          const end = new Date(a.end_time);

          if (a.status === 'booked' || a.status === 'blocked') {
            for (let h = startHour; h < endHour; h++) {
              const slotStart = new Date(date);
              slotStart.setHours(h, 0, 0, 0);
              const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);

              if (
                (slotStart >= start && slotStart < end) ||
                (slotEnd > start && slotEnd <= end)
              ) {
                blockedSlots.push(`${h.toString().padStart(2, '0')}:00`);
              }
            }
          }
        });

        app.availableSlots = allSlots.filter(slot => {
          const [hour] = slot.split(':').map(Number);
          const slotStart = new Date(date);
          slotStart.setHours(hour, 0, 0, 0);
          return !blockedSlots.includes(slot) && slotStart > now;
        });
      });
  }

  onSlotClick(app: any, slot: string) {
    if (!app.availableSlots?.includes(slot)) return;
    app.newTime = slot;
  }

  updateAppointment(app: any) {
    if (!app.newDate || !app.newTime) {
      alert('Inserisci una nuova data e un nuovo orario');
      return;
    }

    const start = new Date(`${app.newDate}T${app.newTime}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 ora

    fetch(`/api/appointments/${app.id}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start_time: start.toISOString(),
        end_time: end.toISOString()
      })
    })
      .then(res => res.json())
      .then(updated => {
        app.start_time = updated.start_time;
        app.end_time = updated.end_time;
        app.editing = false;
        alert('✅ Appuntamento aggiornato con successo');
      })
      .catch(() => alert('Errore durante l\'aggiornamento dell\'appuntamento'));
  }

  cancelAppointment(id: string) {
    this.appointmentService.cancelAppointment(id).subscribe(() => {
      this.authService.currentAppUser.pipe(take(1)).subscribe(user => {
        if (user?.id) this.loadAppointments(user.id);
      });
    });
  }

  // ────────────── Utility ──────────────
  getSpecialistName(app: any): string {
    const specialist = app.specialists;
    return specialist ? `${specialist.name} ${specialist.surname}` : 'Specialista';
  }
  
  translateStatus(status: string): string {
    switch (status) {
      case 'booked': return 'Confermato';
      case 'completed': return 'Completato';
      case 'blocked': return 'In attesa';
      case 'canceled': return 'Annullato';
      default: return status;
    }
  }
}