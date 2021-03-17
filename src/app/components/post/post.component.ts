import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Affected, AnarqService, Post } from 'src/app/services/anarq.service';
import { StateService } from 'src/app/services/state.service';

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
   * Comments for post.
   */
  public comments: Comment[];

  /**
   * Model for comment.
   */
  public comment: string;

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
    public stateService: StateService) { }

  /**
   * Implementation of OnInit.
   */
  ngOnInit() {

    // Figuring out which post user wants to see.
    this.route.params.subscribe(params => {
      const id = +params.id;

      // Retrieving post's content from backend.
      this.anarqService.posts.get(id).subscribe((result: Post) => {
        this.post = result;
        this.getComments();
      });
    });
  }

  /**
   * Invoked when a post should be moderated.
   */
  moderate() {
    this.anarqService.admin.moderatePost(this.post.id).subscribe((result: Affected) => {
      this.router.navigate(['/']);
    });
  }

  /**
   * Invoked when comments needs to be retrieved for post.
   */
  getComments() {
    this.anarqService.comments.get(this.post.id).subscribe((result: any) => {
      this.comments = result;
    });
  }

  /**
   * Invoked when comment is submitted.
   */
  submitComment() {
    this.anarqService.comments.create(this.post.id, this.comment, this.post.visibility).subscribe((result: Comment[]) => {
      this.comment = '';
      this.getComments();
    });
  }
}
