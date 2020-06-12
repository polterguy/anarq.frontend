/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { PublicService } from 'src/app/services/http/public.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  private success: boolean = null;

  constructor (
    private service: PublicService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.params.subscribe(pars => {
      this.service.verifyEmail({
        username: pars.username,
        hash: pars.hash,
      }).subscribe(res => {
        if (res.result === 'SUCCESS') {
          this.success = true;
          localStorage.setItem('jwt_token', res.extra);
          this.snackBar.open(
            'Your email address was successfully confirmed',
            'ok', {
              duration: 5000,
            });
            setTimeout(
              () => this.router.navigate(['/setup-regions']),
              2000);
        } else {
          this.success = false;
          this.snackBar.open(
            'Something went wrong, did you confirm your email address previously?',
            'ok', {
              duration: 5000,
            });
        }
      });
    }, err => {
      this.snackBar.open(
        err.error.message,
        'ok', {
        duration: 5000,
      })
    });
  }
}
