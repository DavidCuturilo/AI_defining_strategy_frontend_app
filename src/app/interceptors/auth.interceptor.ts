import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { EnvService } from '../config/env.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private injector: Injector) {}
  envService: EnvService = this.injector.get(EnvService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // const token = this.authService.getToken();

    const authRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
        ai_assist_apiKey: this.envService.ai_assist_apiKey,
      },
    });
    return next.handle(authRequest);
  }
}
