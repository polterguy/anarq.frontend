/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { PublicService } from 'src/app/services/http/public.service';

@Component({
  selector: 'app-setup-regions',
  templateUrl: './setup-regions.component.html',
  styleUrls: ['./setup-regions.component.scss']
})
export class SetupRegionsComponent implements OnInit {

  constructor(private service: PublicService) { }

  ngOnInit() {
  }
}
