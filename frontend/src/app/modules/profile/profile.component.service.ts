import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  id: string;
  name: string;
  surname?: string;
  email: string;
  dob?: string;
  gender?: string;
  phone?: string;
  city?: string;
  bio?: string;
  avatar_url?: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = 'https://unpostsicuro.onrender.com/users';

  constructor(private http: HttpClient) {}

  getProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`);
  }

  updateProfile(userId: string, data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiUrl}/${userId}`, data);
  }
}
