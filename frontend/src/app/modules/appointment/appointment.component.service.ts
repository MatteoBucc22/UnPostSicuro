import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  constructor(private http: HttpClient) {}

  getSpecialistAppointments(specialistId: string | number): Observable<Appointment[]> {
    const id = Number(specialistId);
    if (!id) return of([]);
    return this.http.get<Appointment[]>(`/api/appointments/${id}`);
  }

  // Crea prenotazione bloccata
  bookAppointment(userId: string, specialistId: number, startTime: string, endTime: string, status?: string, expiresAt?: string) {
    return this.http.post(`/api/appointments`, { userId, specialistId, startTime, endTime, status, expiresAt });
  }
  
  confirmAppointment(appointmentId: string) {
    return this.http.patch(`/api/appointments/${appointmentId}/confirm`, {});
  }
  
  cancelAppointment(appointmentId: string) {
    return this.http.patch(`/api/appointments/${appointmentId}/cancel`, {});
  }

  getPendingAppointment(userId: string) {
    return this.http.get<Appointment | null>(`/api/appointments/pending/${userId}`);
  }
  
  
}
