import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AnarqService, CreateModel, Topic } from 'src/app/services/anarq.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

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
   * Creates an instance of your component.
   * 
   * @param anarqService Needed to retrieve topics and save post
   */
  constructor(
    private anarqService: AnarqService,
    private snackBar: MatSnackBar,
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
    });
  }

  /**
   * Returns true of post can be saved.
   * 
   * @returns True if post can be saved
   */
  isGood() {
    return this.topic && this.visibility && this.content && this.content.length > 25 &&
      this.content.indexOf('https://') === -1 && this.content.indexOf('http://') === -1 &&
      (this.hyperlink === '' || this.hyperlink.startsWith('https://') || this.hyperlink.startsWith('http://'));
  }

  /**
   * Invoked when user wants to submit his post.
   */
  submit() {
    this.anarqService.posts.create(
      this.content,
      this.topic.name,
      this.visibility,
      this.hyperlink).subscribe((result: CreateModel) => {
      this.router.navigate(['/post/' + result.id]);
    }, (error: any) => {

      // Oops ...
      this.snackBar.open(error.error.message, 'ok', {
        duration: 2000,
      });
    });
  }
}
