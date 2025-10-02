import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private http: HttpClient) {}

  getCart(userId: string): Observable<any> {
    return this.http.get(`http://localhost:3000/users/${userId}/cart`);
  }
  
  addToCart(userId: string, ebookId: string, quantity: number = 1): Observable<any> {
    return this.http.post(`http://localhost:3000/users/${userId}/cart/add`, { ebookId, quantity });
  }
  
  updateSpecialist(userId: string, itemId: string, specialistId: string): Observable<any> {
    return this.http.patch(`http://localhost:3000/users/${userId}/cart/item/${itemId}/specialist`, { selectedSpecialist: specialistId });
  }
  
  removeItem(userId: string, itemId: string): Observable<any> {
    return this.http.delete(`http://localhost:3000/users/${userId}/cart/remove/${itemId}`);
  }
  
}
