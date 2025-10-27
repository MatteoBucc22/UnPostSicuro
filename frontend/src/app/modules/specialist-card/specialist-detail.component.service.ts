import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Specialist {
  id: string;
  name: string;
  surname: string;
  expertise: string;
  bio: string;
  image_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpecialistService {

  constructor(private http: HttpClient) {}

  getSpecialist(id: string): Observable<Specialist> {
    return this.http.get<Specialist>(`/api/specialists/${id}`); // proxy-ready
  }

  getAllSpecialists(): Observable<Specialist[]> {
    return this.http.get<Specialist[]>(`/api/specialists`); // proxy-ready
  }
}
