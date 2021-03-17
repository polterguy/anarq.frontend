import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnarqService } from 'src/app/services/anarq.service';
import { Message, MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {

  // Used to subscribe to relevant application messages transmitted by other components.
  private _subscription: Subscription;

  /**
   * Creates an instance of your component.
   * 
   * @param anarqService AnarQ main HTTP service
   * @param messageService Used to subscribe to and transmit messages to and from other components.
   */
  constructor(
    private anarqService: AnarqService,
    private messageService: MessageService) { }

  /**
   * Implementation of OnInit.
   */
  ngOnInit() {

    // Making sure we subscribe to relevant messages.
    this._subscription = this.messageService.subscriber().subscribe((msg: Message) => {
      switch(msg.name) {

        case 'app.login':
          this.getFeed();
          break;
      }
    });

    // Databinding feed initially.
    this.getFeed();
  }

  /**
   * Implementation of OnDestroy.
   */
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  /*
   * Retrieves feed from backend, and binds result to model.
   */
  private getFeed() {
    this.anarqService.posts.feed().subscribe((result: any) => {
      console.log(result);
    });
  }
}
