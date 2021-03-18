import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnarqService, PostExcerpt } from 'src/app/services/anarq.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { StateService } from 'src/app/services/state.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {

  // Used to subscribe to relevant application messages transmitted by other components.
  private _subscription: Subscription;

  /**
   * Posts currently being viewed.
   */
  public posts: PostExcerpt[] = [];

  /**
   * How many minutes user wants to filter his feed according to.
   */
  public minuteFilter: string;

  /**
   * Creates an instance of your component.
   * 
   * @param anarqService AnarQ main HTTP service
   * @param messageService Used to subscribe to and transmit messages to and from other components.
   * @param stateService Needed to determine if we're logged in or not
   */
  constructor(
    private anarqService: AnarqService,
    private messageService: MessageService,
    public stateService: StateService) { }

  /**
   * Implementation of OnInit.
   */
  ngOnInit() {

    // Checking if we've stored current filter condition in local storage
    const ls = localStorage.getItem('timespan_filter');
    if (ls) {
      this.minuteFilter = ls;
    } else {
      this.minuteFilter = '1440';
    }

    // Making sure we subscribe to relevant messages.
    this._subscription = this.messageService.subscriber().subscribe((msg: Message) => {

      switch(msg.name) {

        case 'app.login':
        case 'app.logout':
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

  /**
   * Invoked when filter condition changes, as in for how long
   * period user wants to display his or her feed.
   */
  filterHot(value: string) {
    this.minuteFilter = value;
    localStorage.setItem('timespan_filter', this.minuteFilter.toString());
    this.getFeed();
  }

  /**
   * Invoked when caller wants to see more posts.
   */
  feedMore() {
    this.anarqService.posts.feed(null, null, +this.minuteFilter, 10, this.posts.length).subscribe((result: PostExcerpt[]) => {
      this.posts = this.posts.concat(result);
    });
  }

  /*
   * Retrieves feed from backend, and binds result to model.
   */
  private getFeed() {
    this.anarqService.posts.feed(null, null, +this.minuteFilter).subscribe((result: PostExcerpt[]) => {
      this.posts = result;
    });
  }
}
