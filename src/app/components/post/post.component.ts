
// Angular imports.
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Application specific imports.
import { StateService } from 'src/app/services/state.service';
import { Affected, AnarqService, CreateModel, Post, Comment } from 'src/app/services/anarq.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

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
   * If post was not found, this will be true.
   */
  public is404: boolean = false;

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
      });
    });
  }

  /**
   * Invoked when post needs to be retrieved for some reasons.
   */
  getPost(id: number, lambda:() => void = null) {
    this.anarqService.posts.get(id).subscribe((result: Post) => {
      this.post = result;
      if (lambda) {
        lambda();
      }
    }, (error: any) => {
      this.snackBar.open(error.error.message, 'ok', {
        duration: 2000,
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
   * Invoked when user clicks the like button of the post.
   */
  likePost() {
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
    this.anarqService.comments.get(this.post.id).subscribe((result: Comment[]) => {
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
   * Invoked when comment is submitted.
   */
  submitComment() {
    this.anarqService.comments.create(this.post.id, this.comment).subscribe((result: CreateModel) => {
      this.comment = '';
      this.getComments();
    });
  }
}
