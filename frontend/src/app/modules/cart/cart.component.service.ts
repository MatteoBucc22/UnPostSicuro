import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private http: HttpClient) {}

  getCart(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/users/${userId}/cart`);
  }

  addToCart(userId: string, ebookId: string): Observable<any> {
    return this.http.post(`/api/users/${userId}/cart/add`, { ebookId });
  }

  removeItem(userId: string, itemId: string): Observable<any> {
    return this.http.delete(`/api/users/${userId}/cart/remove/${itemId}`);
  }

  updateSpecialist(userId: string, itemId: string, specialistId: string): Observable<any> {
    return this.http.patch(`/api/users/${userId}/cart/item/${itemId}/specialist`, { specialistId });
  }

  getSpecialists(): Observable<any[]> {
    return this.http.get<any[]>('/api/specialists');
  }
}
