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

  /**
   * Returns true if user is allowed to moderate posts.
   */
  public get isModerator() {
    if (!this.isLoggedIn) {
      return false;
    }
    const payload = <string>atob(this.ticket.split('.')[1]);
    const roles = JSON.parse(payload).role;
    if (Array.isArray(roles)) {
      return (<string[]>roles).filter(x => x === 'moderator' || x === 'admin' || x === 'root').length > 0;
    }
    return roles === 'moderator' || roles === 'admin' || roles === 'root';
  }

  /**
   * Returns true if user is an administrator on the site.
   */
   public get isAdmin() {
    if (!this.isLoggedIn) {
      return false;
    }
    const payload = <string>atob(this.ticket.split('.')[1]);
    const roles = JSON.parse(payload).role;
    if (Array.isArray(roles)) {
      return (<string[]>roles).filter(x => x === 'admin' || x === 'root').length > 0;
    }
    return roles === 'admin' || roles === 'root';
  }

  /**
   * Returns true if user is allowed to like, post and comment.
   */
  public get isVerified() {
    if (!this.isLoggedIn) {
      return false;
    }
    const payload = <string>atob(this.ticket.split('.')[1]);
    const roles = JSON.parse(payload).role;
    if (Array.isArray(roles)) {
      return (<string[]>roles).filter(x => x === 'guest' || x === 'moderator' || x === 'admin' || x === 'root').length > 0;
    }
    return roles === 'guest' || roles === 'moderator' || roles === 'admin' || roles === 'root';
  }

  /**
   * Returns the username of the currently authenticated user.
   */
  public get username() {
    if (!this.isLoggedIn) {
      return '';
    }
    const payload = <string>atob(this.ticket.split('.')[1]);
    const json = JSON.parse(payload);
    return json.unique_name;
  }
}