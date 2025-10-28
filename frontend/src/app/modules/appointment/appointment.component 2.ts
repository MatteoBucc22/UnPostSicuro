// calendar.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { AppointmentService, Appointment } from './appointment.component.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule, MatInputModule, MatNativeDateModule],
  templateUrl: './appointment.component.html'
})
export class AppointmentComponent implements OnInit, OnDestroy {
  @Input() specialistId?: number;
  @Input() userId?: string;
  @Output() appointmentBooked = new EventEmitter<Appointment>();


  selectedDate?: Date;
  selectedTime?: string;

  allSlots: string[] = [];
  availableSlots: string[] = [];

  pendingAppointmentId?: string;
  timerSeconds?: number;
  private intervalId?: any;
  private subs: Subscription = new Subscription();

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    if (!this.userId) return;

    // Carica appuntamento pendente da localStorage
    const stored = localStorage.getItem(`pendingAppointment_${this.userId}`);
    if (stored) {
      const res: Appointment = JSON.parse(stored);
      this.pendingAppointmentId = res.id;
      this.selectedDate = new Date(res.start_time);
      this.selectedTime = `${this.selectedDate.getHours().toString().padStart(2,'0')}:00`;

      const now = new Date();
      const expires = new Date(res.expires_at!);
      this.timerSeconds = Math.max(0, Math.floor((expires.getTime() - now.getTime()) / 1000));
      if (this.timerSeconds > 0) this.startTimer();
    }

    if (this.specialistId) {
      const dateToUse = this.selectedDate ?? new Date();
      this.generateAvailableSlots(dateToUse);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.subs.unsubscribe();
  }

  onDateChange() {
    this.selectedTime = undefined;
    if (this.selectedDate && this.specialistId) {
      this.generateAvailableSlots(this.selectedDate);
    }
  }

  startTimer() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (!this.timerSeconds) return;
      if (this.timerSeconds > 0) {
        this.timerSeconds!--;
      } else {
        clearInterval(this.intervalId);
        this.pendingAppointmentId = undefined;
        localStorage.removeItem(`pendingAppointment_${this.userId}`);
        if (this.selectedDate) this.generateAvailableSlots(this.selectedDate);
      }
    }, 1000);
  }

  generateAvailableSlots(date: Date) {
    if (!this.specialistId) return;

    const startHour = 9;
    const endHour = 18;
    const slotDuration = 60;

    this.allSlots = [];
    for (let h = startHour; h < endHour; h++) {
      this.allSlots.push(`${h.toString().padStart(2,'0')}:00`);
    }

    this.subs.add(
      this.appointmentService.getSpecialistAppointments(this.specialistId)
        .subscribe((appointments: Appointment[]) => {
          const now = new Date();
          const blockedOrBookedSlots: string[] = [];

          appointments.forEach(a => {
            const startUTC = new Date(a.start_time + 'Z');
            const endUTC = new Date(a.end_time + 'Z');

            // Ignora slot bloccati scaduti
            if (a.status === 'blocked' && a.expires_at) {
              const expires = new Date(a.expires_at + 'Z');
              if (expires <= now) return;
            }

            if (a.status === 'booked' || a.status === 'blocked') {
              for (let h = startHour; h < endHour; h++) {
                const slotStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), h));
                const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);

                if ((slotStart >= startUTC && slotStart < endUTC) ||
                    (slotEnd > startUTC && slotEnd <= endUTC) ||
                    (slotStart <= startUTC && slotEnd >= endUTC)) {
                  blockedOrBookedSlots.push(`${h.toString().padStart(2,'0')}:00`);
                }
              }
            }
          });

          this.availableSlots = this.allSlots.filter(s => {
            const [hour] = s.split(':').map(Number);
            const slotStart = new Date(date);
            slotStart.setHours(hour, 0, 0, 0);
            return !blockedOrBookedSlots.includes(s) && slotStart > now;
          });
        })
    );
  }

  onSlotClick(slot: string) {
    if (!this.availableSlots.includes(slot)) return;
    this.selectedTime = slot;
  }

  bookAppointment() {
    if (!this.selectedDate || !this.selectedTime || !this.userId || !this.specialistId) return;
  
    const [hour, minute] = this.selectedTime.split(':').map(Number);
    const start = new Date(this.selectedDate);
    start.setHours(hour, minute, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
  
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  
    this.appointmentService.bookAppointment(
      this.userId,
      this.specialistId,
      start.toISOString(), // ✅ conversione corretta in UTC
      end.toISOString(),
      'blocked',
      expiresAt
    ).subscribe({
      next: (res: any) => {
        const appointment = res[0];
        this.pendingAppointmentId = appointment.id;
      
        localStorage.setItem(`pendingAppointment_${this.userId}`, JSON.stringify(appointment));
      
        // ✅ emetti l’evento verso il componente padre
        this.appointmentBooked.emit(appointment);
      
        alert('🕒 Appuntamento bloccato per 10 minuti! Completa il pagamento per confermare.');
      
        this.selectedDate && this.generateAvailableSlots(this.selectedDate);
        this.timerSeconds = 10 * 60;
        this.startTimer();
      },      
      error: err => alert(err.error?.message || 'Errore durante la prenotazione')
    });
  }
  
}
