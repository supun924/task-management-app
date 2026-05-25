import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';

// =========================
// APPLICATION ROUTES
// =========================

export const routes: Routes = [

  // =========================
  // LOGIN PAGE (PUBLIC ROUTE)
  // =========================
  {
    path: '',
    component: Login
  },

  // =========================
  // DASHBOARD (PROTECTED ROUTE)
  // =========================
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  }

];