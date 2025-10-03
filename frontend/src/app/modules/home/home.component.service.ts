import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  image_url?: string;
  category?: string;
}

export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image_url?: string;
}

@Injectable({ providedIn: 'root' })
export class HomeService {
  private API_BASE = '/api'; // <-- proxy verso backend

  constructor(private http: HttpClient) {}

  fetchEbooks(): Observable<Ebook[]> {
    return this.http.get<Ebook[]>(`${this.API_BASE}/ebooks`);
  }

  fetchSpecialists(): Observable<Specialist[]> {
    return this.http.get<Specialist[]>(`${this.API_BASE}/specialists`);
  }
}
