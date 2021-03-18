import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AnarqService, PostExcerpt, User } from 'src/app/services/anarq.service';

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
    private anarqService: AnarqService) { }

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
}
