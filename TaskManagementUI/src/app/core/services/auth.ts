import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private api =
    'http://localhost:56449/api/auth/login';

  constructor(
    private http: HttpClient
  ) { }

  // LOGIN
  login(username: string, password: string) {
    return this.http.post(this.api, {
      username,
      password
    });
  }

  // LOGOUT
  logout() {
    localStorage.removeItem('auth');
  }

  // GET TOKEN
  getToken(): string | null {
    return localStorage.getItem('auth');
  }

  // CHECK LOGIN
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth');
  }
}