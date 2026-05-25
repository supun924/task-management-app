import { Component } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  // =========================
  // FORM BINDING FIELDS
  // =========================
  username = '';
  password = '';

  constructor(
    private auth: Auth,
    private snackBar: MatSnackBar
  ) { }

  // =========================
  // LOGIN FUNCTION
  // =========================
  login() {
    // Call backend login API
    this.auth.login(this.username, this.password)
      .subscribe({

        // =========================
        // SUCCESS RESPONSE
        // =========================
        next: (res: any) => {
          // Create simple auth token (basic encoding)
          const token = btoa(`${this.username}:${this.password}`);

          // Store token in browser (local authentication state)
          localStorage.setItem('auth', token);

          // Show success toast notification
          this.snackBar.open('Login successful', '', {
            duration: 3000,
            panelClass: ['snack-success'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          // Redirect user to dashboard after login
          window.location.href = '/dashboard';
        },

        // =========================
        // ERROR RESPONSE
        // =========================
        error: () => {
          // Show error toast notification
          this.snackBar.open('Invalid username or password', '', {
            duration: 3000,
            panelClass: ['snack-error'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
  }
}