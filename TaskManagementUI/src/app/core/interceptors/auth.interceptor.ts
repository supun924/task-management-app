import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth');

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Basic ${token}`
      }
    });

    return next(authReq);
  }

  return next(req);
};