import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AnarqService, Post } from 'src/app/services/anarq.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  public post: Post;

  /**
   * Creates an instance of your component.
   * 
   * @param route Needed to figure out which post user wants to see
   * @param anarqService Needed to retrieve post from backend
   */
  constructor(
    private route: ActivatedRoute,
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
      });
    });
  }

  /**
   * Invoked when a post should be moderated.
   */
  moderate() {
    this.anarqService.admin.moderatePost(this.post.id).subscribe((result: any) => {
      console.log(result);
    });
  }
}
