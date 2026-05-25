import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// =========================
// APPLICATION CONFIGURATION
// =========================

export const appConfig: ApplicationConfig = {
  providers: [

    // =========================
    // GLOBAL ERROR HANDLING
    // =========================
    provideBrowserGlobalErrorListeners(),

    // =========================
    // ROUTING CONFIGURATION
    // =========================
    provideRouter(routes),

    // =========================
    // HTTP CLIENT SETUP
    // =========================
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    )
  ]
};