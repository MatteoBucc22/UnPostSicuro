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

@Injectable({ providedIn: 'root' })
export class EbookService {
  private apiUrl = 'https://unpostsicuro.onrender.com/ebooks';

  constructor(private http: HttpClient) {}

  getEbook(id: string): Observable<Ebook> {
    return this.http.get<Ebook>(`${this.apiUrl}/${id}`);
  }

  getAllEbooks(): Observable<Ebook[]> {
    return this.http.get<Ebook[]>(this.apiUrl);
  }
}
