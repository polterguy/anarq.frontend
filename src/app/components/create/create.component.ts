import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AnarqService, CreateModel, Topic } from 'src/app/services/anarq.service';

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
    return this.topic && this.visibility && this.content && this.content.length > 0;
  }

  /**
   * Invoked when user wants to submit his post.
   */
  submit() {
    this.anarqService.posts.create(this.content, this.topic.name, this.visibility).subscribe((result: CreateModel) => {
      this.router.navigate(['/post/' + result.id]);
    });
  }
}
