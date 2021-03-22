import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AnarqService, CreateModel, Post, Topic } from 'src/app/services/anarq.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  /**
   * Only assigned when editing a post.
   */
  public id: number;

  /**
   * Actual content user submits.
   */
  public content: string;

  /**
   * Hyperlink user wants to associate with post.
   */
  public hyperlink: string = '';

  /**
   * All topics user can associate a post with.
   */
  public topics: Topic[] = [];

  /**
   * Topic post should appear within.
   */
  public topic: Topic;

  /**
   * Possible values for visibility setting of post.
   */
  public visibilities: string[] = [
    'public',
    'friends',
  ];

  /**
   * Visibility of post.
   */
  public visibility: string;

  /**
   * If true, the post is being submitted.
   */
  public submitting: boolean = false;

  /**
   * Creates an instance of your component.
   * 
   * @param anarqService Needed to retrieve topics and save post
   */
  constructor(
    private anarqService: AnarqService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router) { }

  /**
   * Implementation of OnInit.
   */
  ngOnInit() {

    // Defaulting visibility to whatever is the first value in options.
    this.visibility = this.visibilities[0];

    // Retrieving all topics from backend, to allow user to select topic to associate post with.
    this.anarqService.topics.list().subscribe((result: Topic[]) => {
      this.topics = result;
      this.topic = this.topics[0];

      // If this is an edit operation, the ID of the post we want to edit can be found as the 'id' parameter.
      this.route.params.subscribe((params: any) => {
        
        // Checking if we're editing a post.
        const id = params.id;
        if (id) {

          // Assigning model.
          this.id = id;

          // Retrieving post content.
          this.anarqService.posts.get(id).subscribe((result: Post) => {
            
            // Assigning model.
            const topics = this.topics.filter(x => x.name === result.topic);
            if (topics.length > 0) {
              this.topic = topics[0];
            }
            this.visibility = result.visibility;
            if (result.content.indexOf('<!-- End of Open Graph -->') !== -1) {
              this.content = result.content.split('<!-- End of Open Graph -->')[1].trim();
              this.hyperlink = result.content.split('<a href="')[1].split('"')[0];
            } else {
              this.content = result.content;
            }
          }, (error: any) => {

            // Oops ...!!
            this.snackBar.open(error.error.message, 'ok', {
              duration: 5000,
            });
          });
        }
      });
    });
  }

  /**
   * Returns true of post can be saved.
   * 
   * @returns True if post can be saved
   */
  isGood() {
    return this.topic && this.visibility && this.content && this.content.length >= 5 &&
      (this.hyperlink === '' || this.hyperlink.startsWith('https://') || this.hyperlink.startsWith('http://'));
  }

  /**
   * Invoked when user wants to submit his post.
   */
  submit() {

    // Making sure we obscure things while post is being submitted.
    this.submitting = true;

    // Checking if we're creating a new post or updating an existing.
    if (this.id) {

      // Updating an existing.
      this.anarqService.posts.update(
        this.id,
        this.content,
        this.topic.name,
        this.visibility,
        this.hyperlink).subscribe((res: any) => {

          // Success!
          this.submitting = false;
          this.router.navigate(['/post/' + this.id]);

      }, (error: any) => {

        // Oops ...
        this.submitting = false;
        this.snackBar.open(error.error.message, 'ok', {
          duration: 5000,
        });
      });

    } else {

      // Creating a new post.
      this.anarqService.posts.create(
        this.content,
        this.topic.name,
        this.visibility,
        this.hyperlink).subscribe((result: CreateModel) => {

          // Success!
          this.submitting = false;
          this.router.navigate(['/post/' + result.id]);

      }, (error: any) => {

        // Oops ...
        this.submitting = false;
        this.snackBar.open(error.error.message, 'ok', {
          duration: 5000,
        });
      });
    }
  }
}
