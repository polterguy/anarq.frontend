import { Injectable } from '@angular/core';
import { MessageService } from './message.service';

/**
 * State service, allowing us to keep state around shared by multiple
 * components and parts of our system.
 */
@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(private messageService: MessageService) {}

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
      this.messageService.sendMessage({
        name: 'app.logout'
      });
      return;
    }
    localStorage.setItem('ticket', value);
    this.messageService.sendMessage({
      name: 'app.login'
    });
  }

  /**
   * Returns JWT token required to perform authenticated requests towards backend.
   */
  public get ticket() {
    return localStorage.getItem('ticket');
  }
}