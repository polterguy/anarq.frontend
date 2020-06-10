/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseView } from 'src/app/models/case-view';
import { PublicService } from 'src/app/services/http/public.service';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss']
})
export class CaseComponent implements OnInit {

  public item: CaseView = null;
  public id: number;

  constructor(
    private service: PublicService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(pars => {
      this.id = +pars.id;
      this.service.getCase(pars.id).subscribe(res => {
        this.item = res;
      });
    });
  }

  getCaseUrl() {
    return window.location.href;
  }

  yes() {
    this.service.vote(this.id, true).subscribe(res => {
      this.item.opinion = true;
    });
  }

  no() {
    this.service.vote(this.id, true).subscribe(res => {
      this.item.opinion = false;
    });
  }

  getOpinion() {
    if (this.item.opinion) {
      return 'Yes';
    } else {
      return 'No';
    }
  }
}
