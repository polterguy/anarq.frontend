
// Angular imports.
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

// Utility imports.
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';

// Application specific imports.
import { StateService } from 'src/app/services/state.service';
import { Affected, AnarqService, CreateModel, Post, Comment, User, ResultModel } from 'src/app/services/anarq.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  /**
   * PayPal donate configuration.
   */
   public payPalConfig? : IPayPalConfig;

  /**
   * Model for post.
   */
  public post: Post;

  /**
   * Model for what users liked the post.
   */
  public lickers: string[] = [];

  /**
   * Model for whether or not currently authenticated user has liked post or not.
   */
  public liked: boolean = false;

  /**
   * Comments for post.
   */
  public comments: Comment[];

  /**
   * Model for comment.
   */
  public comment: string;

  /**
   * Model for user, including PayPal ID.
   */
  public user: User;

  /**
   * If post was not found, this will be true.
   */
  public is404: boolean = false;

  /**
   * If true, the PayPal donate buttons should be shown.
   */
  public showPayPal: boolean = false;

  /**
   * If true, the post is being submitted.
   */
   public submitting: boolean = false;

  /**
   * Creates an instance of your component.
   * 
   * @param route Needed to figure out which post user wants to see
   * @param anarqService Needed to retrieve post from backend
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private anarqService: AnarqService,
    private snackBar: MatSnackBar,
    public stateService: StateService) { }

  /**
   * Implementation of OnInit.
   */
  ngOnInit() {

    // Figuring out which post user wants to see.
    this.route.params.subscribe(params => {
      const id = +params.id;

      // Retrieving post's content from backend.
      this.getPost(id, () => {
        this.getComments();
        this.getLickers();
        this.getUserMeta();
      });
    });
  }

  /**
   * Invoked when post needs to be retrieved for some reasons.
   */
  getPost(id: number, lambda:() => void = null) {
    this.anarqService.posts.get(id).subscribe((result: Post) => {

      // Success!
      this.post = result;
      if (lambda) {
        lambda();
      }
    }, (error: any) => {

      // Oops ...!!
      this.snackBar.open(error.error.message, 'ok', {
        duration: 5000,
      });
      this.is404 = true;
    });
  }

  /**
   * Returns true if currently authenticated user can like post.
   */
  canLike() {
    if (!this.stateService.isVerified) {
      return false;
    }
    if (this.post.user === this.stateService.username) {
      return false;
    }
    if (this.post.visibility === 'moderated') {
      return false;
    }
    return true;
  }

  /**
   * Returns true if currently authenticated user can edit the current post.
   */
  canEditPost() {
    return this.stateService.isModerator || this.stateService.username === this.post.user;
  }


  /**
   * Invoked when user clicks the like button of the post.
   */
  likePost() {

    // Checking if we're supposed to like or remove existing like.
    if (this.liked) {
      this.anarqService.licks.unlick(this.post.id).subscribe((result: any) => {
        this.lickers.splice(this.lickers.indexOf(this.stateService.username));
        this.liked = false;
        this.post.licks -= 1;
      });
    } else {
      this.anarqService.licks.lick(this.post.id).subscribe((result: any) => {
        this.lickers.push(this.stateService.username);
        this.liked = true;
        this.post.licks += 1;
      });
    }
  }

  /**
   * Invoked when a post should be moderated.
   */
  moderate() {
    this.anarqService.admin.moderatePost(this.post.id).subscribe((result: Affected) => {
      if (result.affected === 1) {
        this.post.visibility = 'moderated';
        this.snackBar.open('Post was moderated', 'ok', {
          duration: 2000,
        });
      }
    });
  }

  /**
   * Invoked when a post should be un-moderated.
   */
   unModerate() {
    this.anarqService.admin.unModeratePost(this.post.id).subscribe((result: Affected) => {
      if (result.affected === 1) {
        this.post.visibility = 'public';
        this.snackBar.open('Post was made public again', 'ok', {
          duration: 2000,
        });
      }
    });
  }

  /**
   * Invoked when a comment should be moderated.
   */
   moderateComment(comment: Comment) {
    this.anarqService.admin.moderateComment(comment.id).subscribe((result: Affected) => {
      if (result.affected === 1) {
        comment.visibility = 'moderated';
        this.snackBar.open('Comment was moderated', 'ok', {
          duration: 2000,
        });
      }
    });
  }

  /**
   * Invoked when a comment should be un-moderated.
   */
   unModerateComment(comment: Comment) {
    this.anarqService.admin.unModerateComment(comment.id).subscribe((result: Affected) => {
      if (result.affected === 1) {
        comment.visibility = 'public';
        this.snackBar.open('Comment was made public again', 'ok', {
          duration: 2000,
        });
      }
    });
  }

  /**
   * Invoked when comments needs to be retrieved for post.
   */
  getComments() {
    this.anarqService.comments.list(this.post.id).subscribe((result: Comment[]) => {
      this.comments = result;
    });
  }

  /**
   * Retrieves all usernames that liked the post.
   */
  getLickers() {
    if (this.post.licks > 0) {
      this.anarqService.licks.lickers(this.post.id).subscribe((result: string[]) => {
        this.lickers = result;
        this.liked = result.indexOf(this.stateService.username) !== -1;
      });
    } else {
      this.lickers = [];
      this.liked = false;
    }
  }

  /**
   * Invoked when user's meta information needs to be retrieved.
   */
  getUserMeta() {

    // Invoking backend to retrieve user information.
    this.anarqService.users.get(this.post.user).subscribe((result: User) => {

      // Assigning model.
      this.user = result;
      this.payPalConfig = {
        currency: 'EUR',
        clientId: result.payPalId,
        createOrderOnClient: (data) => <ICreateOrderRequest> {
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'EUR',
              value: '5',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '5'
                }
              }
            },
            items: [{
              name: 'AnarQ Donation',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'EUR',
                value: '5',
              },
            }]
          }]
        },
        advanced: {
          commit: 'true'
        },
        style: {
          label: 'paypal',
          layout: 'vertical'
        },
        onApprove: (data, actions) => {
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
          actions.order.get().then(details => {
            console.log('onApprove - you can get full order details inside onApprove: ', details);
          });
        },
        onClientAuthorization: (data) => {

          // Invoking server to log the fact that somebody donated to author.
          const donator = data.payer.email_address;
          const donations = data.purchase_units.length;
          this.anarqService.misc.logDonation(this.post.user, donator, donations * 5).subscribe((result: ResultModel) => {
            console.log('Donation was logged on server');
          });
        },
        onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
        },
        onError: err => {
          console.log('OnError', err);
        },
        onClick: (data, actions) => {
          console.log('onClick', data, actions);
        }
      };

    }, (error: any) => {

      // Oops ...!!
      this.snackBar.open(error.error.message, 'ok', {
        duration: 5000,
      })
    });
  }

  /**
   * Invoked when user clicks the "Buy author coffee" button.
   */
  showPayPalClicked() {
    this.showPayPal = true;
  }

  /**
   * Invoked when comment is submitted.
   */
  submitComment() {

    // Making sure we show spinner while comment is submitted.
    this.submitting = true;
    this.anarqService.comments.create(this.post.id, this.comment).subscribe((result: CreateModel) => {

      // Success, emptying model and retreiving comments again, making sure we hid obscurer.
      this.comment = '';
      this.getComments();
      this.submitting = false;
      this.snackBar.open('Your comment was successfully saved', 'ok', {
        duration: 5000,
      });

    }, (error: any) => {

      // Oops ...!!
      this.submitting = false;
      this.snackBar.open(error.error.message, 'ok', {
        duration: 5000,
      });
    });
  }
}
