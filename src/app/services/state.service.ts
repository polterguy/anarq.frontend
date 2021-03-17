import { Injectable } from '@angular/core';

/**
 * State service, allowing us to keep state around shared by multiple
 * components and parts of our system.
 */
@Injectable({
  providedIn: 'root'
})
export class StateService {

  /**
   * If true, the user is logged in.
   */
  public get isLoggedIn() {
    return localStorage.getItem('ticket');
  }

  /**
   * Sets the JWT token required to perform authenticated requests towards backend.
   */
  public set ticket(value: string) {
    if (!value) {
      localStorage.removeItem('ticket');
      return;
    }
    localStorage.setItem('ticket', value);
  }

  /**
   * Returns JWT token required to perform authenticated requests towards backend.
   */
  public get ticket() {
    return localStorage.getItem('ticket');
  }
}