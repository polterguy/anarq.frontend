
// Angular imports.
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// Application specific imports.
import { StateService } from 'src/app/services/state.service';
import { AnarqService, PostExcerpt, ResultModel, User } from 'src/app/services/anarq.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  /**
   * Username of user currently being viewed.
   */
  public username: string;

  /**
   * User's meta information.
   */
  public user: User;

  /**
   * Posts currently being viewed that was written by user.
   */
  public posts: PostExcerpt[];

  /**
   * Creates an instance of your component.
   * 
   * @param route Needed to extract username
   * @param anarqService Needed to retrieve user information from backend
   */
  constructor(
    private route: ActivatedRoute,
    private anarqService: AnarqService,
    private snackBar: MatSnackBar,
    public stateService: StateService) { }

  /**
   * Implementation of OnInit.
   */
  ngOnInit() {

    // Extracting username from URL.
    this.route.params.subscribe(params => {

      // Assigning model and retrieving user's meta information from backend.
      this.username = params.user;
      this.anarqService.users.get(this.username).subscribe((result: User) => {
        this.user = result;
      });
    });

    // Retrieving initial posts written by user.
    this.getPosts();
  }

  /**
   * Invoked when posts user have written needs to be retrieved.
   */
  getPosts() {
    this.anarqService.posts.feed(null, this.username).subscribe((result: PostExcerpt[]) => {
      this.posts = result;
    });
  }

  /**
   * Invoked when caller wants to see more posts.
   */
   feedMore() {
    this.anarqService.posts.feed(null, null, null, 10, this.posts.length).subscribe((result: PostExcerpt[]) => {
      this.posts = this.posts.concat(result);
    });
  }

  /**
   * Returns roles user belongs to.
   * 
   * @returns Returns all roles user belongs to separated by comma
   */
  getRoles() {
    return this.user.roles.join(', ');
  }

  /**
   * Returns true if use can be blocked.
   */
  canBlock() {
    return this.user.roles.indexOf('blocked') === -1;
  }

  /**
   * Invoked if user needs to be blocked.
   */
  blockUser() {
    this.anarqService.admin.blockUser(this.username).subscribe((result: ResultModel) => {
      this.snackBar.open('User was blocked from site', 'ok', {
        duration: 2000,
      });
      this.user.roles = ['blocked'];
    }, (error: any) => {
      this.snackBar.open(error.error.message, 'ok', {
        duration: 2000,
      });
    });
  }

  /**
   * Invoked if user needs to be blocked.
   */
   unblockUser() {
    this.anarqService.admin.unblockUser(this.username).subscribe((result: ResultModel) => {
      this.snackBar.open('User was unblocked from site', 'ok', {
        duration: 2000,
      });
      this.user.roles = ['guest'];
    });
  }
}
