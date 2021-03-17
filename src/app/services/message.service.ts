import { Subject} from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * Message class, encapsulating a message sent from one component to another.
 */
 export class Message {

  /**
   * Name of message that was transmitted.
   */
  name: string;

  /**
   * Content/data the message either expects or returns after being handled.
   */
  content?: any = null;
}

/**
 * Message send/receive class, allowing you to subscribe to events,
 * and/or raise events.
 */
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private subject = new Subject<Message>();

  /**
   * Sends a message to all subscribers.
   * 
   * @param message Message to transmit to subscribers
   */
  sendMessage(message: Message) {
    this.subject.next(message);
  }

  /**
   * Returns the observable allowing you to subscribe to messages
   * transmitted by other components.
   */
  subscriber() {
    return this.subject.asObservable();
  }
}