/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { PublicService } from 'src/app/services/http/public.service';
import { RegionsModel } from 'src/app/models/regions-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup-regions',
  templateUrl: './setup-regions.component.html',
  styleUrls: ['./setup-regions.component.scss']
})
export class SetupRegionsComponent implements OnInit {

  private regions: RegionsModel = null;
  private filter: string = null;

  constructor(
    private service: PublicService,
    private router: Router) { }

  ngOnInit() {
    this.service.getRegions().subscribe(res => {
      this.regions = res;
    });
  }

  getFilteredRegions() {
    if (this.regions === null) {
      return [];
    }
    if (this.filter === null || this.filter === '') {
      return this.regions.regions;
    }
    return this.regions.regions.filter(x => x.toLocaleLowerCase().includes(this.filter.toLocaleLowerCase()));
  }

  selectRegion(region: string) {
    this.service.setRegion(region).subscribe(res => {
      if (res.result === 'SUCCESS') {
        this.router.navigate(['/region/' + region])
      }
    });
  }
}
