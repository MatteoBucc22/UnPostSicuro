import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Specialist } from '../specialist-card/specialist-detail.component.service';
import { Ebook } from '../ebook-card/ebook-detail.component.service';



@Injectable({ providedIn: 'root' })
export class HomeService {
  private API_BASE = '/api'; 

  constructor(private http: HttpClient) {}

  fetchEbooks(): Observable<Ebook[]> {
    return this.http.get<Ebook[]>(`${this.API_BASE}/ebooks`);
  }

  fetchSpecialists(): Observable<Specialist[]> {
    return this.http.get<Specialist[]>(`${this.API_BASE}/specialists`);
  }
}
