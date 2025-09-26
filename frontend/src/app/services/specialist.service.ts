// src/app/services/specialist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpecialistService {
  private apiUrl = 'http://localhost:3000/specialist';
  constructor(private http: HttpClient) {}
  getEbooks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
