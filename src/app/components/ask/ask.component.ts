/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { PublicService } from 'src/app/services/http/public.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-ask',
  templateUrl: './ask.component.html',
  styleUrls: ['./ask.component.scss']
})
export class AskComponent implements OnInit {

  private subject: FormControl;
  public region: string;
  public canCreateCase = false;
  private subjectGood?: boolean = null;
  private body = ''

  // Number of milliseconds after a keystroke before filtering should be re-applied.
  private debounce = 800;

  constructor(
    private httpService: PublicService,
    private route: ActivatedRoute,
    private jwtHelper: JwtHelperService,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(pars => {
      this.region = pars.region;
      if (this.isLoggedIn()) {
        this.httpService.canCreateCase(this.region).subscribe(res => {
          this.canCreateCase = res.result === 'SUCCESS';
        });
      }
    });

    this.subject = new FormControl('');
    this.subject.valueChanges
      .pipe(debounceTime(this.debounce / 10), distinctUntilChanged())
      .subscribe(query => {
        if (this.subject.value.length >= 25 && this.subject.value.endsWith('?')) {
          this.subjectGood = true;
        } else if (this.subject.value.length === 0) {
          this.subjectGood = null;
        } else {
          this.subjectGood = false;
        }
      });
  }

  // Returns true if user is logged in, with a valid token, that's not expired.
  isLoggedIn() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      return false;
    }
    if (this.jwtHelper.isTokenExpired(token)) {
      return false;
    }
    return true;
  }

  getCodeMirrorOptions() {
    return {
      lineNumbers: true,
      theme: 'material',
      mode: 'markdown'
    };
  }

  submit() {
    this.httpService.submitCase({
      subject: this.subject.value,
      body: this.body,
      region: this.region,
    }).subscribe(res => {
      if (res.result === 'SUCCESS') {
        this.router.navigate(['/case/' + res.extra]);
      }
    });
  }
}
