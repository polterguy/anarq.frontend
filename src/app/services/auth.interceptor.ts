
// Angular imports.
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { StateService } from './state.service';

/**
 * HTTP client Authorization interceptor, to attach JWT token to all HTTP requests.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  /**
   * Creates an instance of your service.
   * 
   * @param stateService State service where we persist and keep JWT tokens required to perform authorized requests
   */
  constructor(private stateService: StateService) { }

  /**
   * Intercepts all HTTP requests to associate an Authorization
   * HTTP header with the request, if possible.
   * 
   * @param req HTTP request
   * @param next Next handler
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler) {

    if (this.stateService.isLoggedIn) {

      // Cloning HTTP request, adding Authorisation header, and invoking next in chain.
      const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + this.stateService.ticket)});
      return next.handle(authReq);

    } else {

      /*
       * No token for invocation, hence simply invoking next
       * interceptor without doing anything.
       */
      return next.handle(req);
    }
  }
}