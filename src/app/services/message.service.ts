/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';

/**
 * Message constants for types of messages that can be sent using service.
 */
export class Messages {

    /**
     * Sent when user is trying to login.
     * 
     * Expects raw base64 encoded JWT token as content.
     */
    static readonly APP_LOGIN = 'app:login';

    /**
     * Sent after user has been successfully logged in.
     * 
     * Expects username as content.
     */
    static readonly APP_LOGGED_IN = 'app:logged_in';

    /**
     * Sent after user has successfully refreshed his JWT token.
     * 
     * The value provided as input is the results from JwtHelperService's
     * decodeToken function.
     */
    static readonly APP_TOKEN_REFRESHED = 'app:token_refresh';

    /**
     * Sent when user has been successfully logged out.
     * 
     * Assumes no content, and returns no content.
     */
    static readonly APP_LOGGED_OUT = 'app:logged_out';

    /**
     * Sent when user wants to logout.
     * 
     * Assumes no content, and returns no content.
     */
    static readonly APP_LOGOUT = 'app:logout';

    /**
     * Returns decoded token as content.
     * 
     * The return value is the results from JwtHelperService's
     * decodeToken function.
     */
    static readonly APP_GET_JWT_TOKEN = 'app:get_jwt_token';
}

/**
 * Message class, encapsulating a message sent from one component to another.
 */
export class Message {

  /**
   * Name of message that was transmitted, which should be one of the
   * constants from the Messages class.
   */
  name: string;

  /**
   * Content/data the message either expects or returns after being handled.
   */
  content?: any = null;
}

/**
 * Message service bus for having compoments communicate with each other.
 */
@Injectable()
export class MessageService {

  private subject = new Subject<Message>();

  /**
   * Sends a message to any subscribers.
   * 
   * @param message Message to transmit to other listeners
   */
  sendMessage(message: Message) {
    this.subject.next(message);
  }

  /**
   * Returns the observable allowing you to subscribe to messages
   * transmitted by other components.
   */
  getMessage() {
    return this.subject.asObservable();
  }
}