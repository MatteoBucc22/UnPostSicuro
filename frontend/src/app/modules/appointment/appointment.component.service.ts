// ─────────────────────────────────────────────
//             appointment.service.ts
// ─────────────────────────────────────────────
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Specialist } from '../specialist-card/specialist-detail.component.service';

export interface Appointment {
  id: string;
  user_id: string;
  specialist_id: number;
  start_time: string;
  end_time: string;
  status: 'booked' | 'canceled' | 'blocked' | 'completed';
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
  specialists?: Specialist; 
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  constructor(private http: HttpClient) {}

  getSpecialistAppointments(specialistId: string | number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`/api/appointments/${specialistId}`);
  }

  getAppointmentsByUser(userId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`/api/appointments/user/${userId}`);
  }

  updateAppointment(id: string, start_time: string, end_time: string): Observable<Appointment> {
    // Aggiorna appuntamento esistente mantenendo status booked
    return this.http.put<Appointment>(`/api/appointments/${id}/update`, { start_time, end_time, status: 'booked' });
  }

  cancelAppointment(id: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`/api/appointments/${id}/cancel`, {});
  }

  bookAppointment(userId: string, specialistId: number, startTime: string, endTime: string, status?: string, expiresAt?: string) {
    return this.http.post(`/api/appointments`, { userId, specialistId, startTime, endTime, status, expiresAt });
  }

  confirmAppointment(id: string) {
    return this.http.patch(`/api/appointments/${id}/confirm`, {});
  }

  getPendingAppointment(userId: string) {
    return this.http.get<Appointment | null>(`/api/appointments/pending/${userId}`);
  }
}
