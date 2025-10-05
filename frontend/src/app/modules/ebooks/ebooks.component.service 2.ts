import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  image_url?: string;
  category?: string;
}

@Injectable({ providedIn: 'root' })
export class EbooksService {
  private API_BASE = '/api'; // <-- usa il proxy configurato

  constructor(private http: HttpClient) {}

  fetchEbooks(): Observable<Ebook[]> {
    return this.http.get<Ebook[]>(`${this.API_BASE}/ebooks`);
  }
}
