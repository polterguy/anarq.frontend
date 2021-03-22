
// Angular imports.
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnDestroy, OnInit } from '@angular/core';

// Application specific imports.
import { StateService } from 'src/app/services/state.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { AnarqService, CountModel, PostExcerpt, Topic } from 'src/app/services/anarq.service';

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
   * All topics that exists in backend.
   */
   public topics: Topic[] = [];

   /**
    * Topic we should filter according to.
    */
   public topic: Topic;
 
  /**
   * How many minutes user wants to filter his feed according to.
   */
  public minuteFilter: string;

  /**
   * Number of OP posts in the system.
   */
  public countPosts: number;

  /**
   * Number of comments in the system.
   */
   public countComments: number;

  /**
   * Number of users in the system.
   */
   public countUsers: number;

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
    private snackBar: MatSnackBar,
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

    // Retrieving all topics from backend, to allow user to select topic to associate post with.
    this.anarqService.topics.list().subscribe((result: Topic[]) => {

      // Assigning models.
      const all: Topic[] = [{ name: 'No filter ...', description: null, items: 0, last_activity: null }];
      this.topics = all.concat(result);

      // Checking if we've stored a topic filter.
      const tp = localStorage.getItem('topic_filter');
      if (tp) {
        const old = this.topics.filter(x => x.name === tp);
        if (old.length > 0) {
          this.topic = old[0];
        } else {
          this.topic = this.topics[0];
        }
      } else {
        this.topic = this.topics[0];
      }

      // Databinding feed initially.
      this.getFeed();

    }, (error: any) => {

      // Oops ...!!
      this.snackBar.open(error.error.message, 'ok', {
        duration: 5000
      });
    });

    // Retrieving meta information from backend.
    this.getMetaInformation();
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

  /**
   * Retrieves feed from backend, and binds result to model.
   */
  getFeed() {

    // Storing selected topic into local storage.
    localStorage.setItem('topic_filter', this.topic.name);

    // Retrieving items from backend.
    this.anarqService.posts.feed(
      this.topic.description === null ? null : this.topic.name,
      null,
      +this.minuteFilter).subscribe((result: PostExcerpt[]) => {
      this.posts = result;
    }, (error: any) => {
      this.snackBar.open(error.error.message, 'ok', {
        duration: 5000,
      });
    });
  }

  /*
   * Private helper methods.
   */

  /*
   * Returns meta information from the backend.
   */
  private getMetaInformation() {

    // Counting posts in system.
    this.anarqService.posts.count().subscribe((result: CountModel) => {

      // Assigning model
      this.countPosts = result.count;

    }, (error: any) => {

      // Oops ...!!
      this.snackBar.open(error.error.message, 'ok', {
        duration: 5000,
      })
    });

    // Counting comments in system.
    this.anarqService.comments.count().subscribe((result: CountModel) => {

      // Assigning model
      this.countComments = result.count;

    }, (error: any) => {

      // Oops ...!!
      this.snackBar.open(error.error.message, 'ok', {
        duration: 5000,
      })
    });

    // Counting users in system.
    this.anarqService.users.count().subscribe((result: CountModel) => {

      // Assigning model
      this.countUsers = result.count;

    }, (error: any) => {

      // Oops ...!!
      this.snackBar.open(error.error.message, 'ok', {
        duration: 5000,
      })
    });
  }
}
