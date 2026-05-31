import { Component } from '@angular/core';
import { BorderTag } from "../../components/border-tag/border-tag";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-country-detail',
  imports: [BorderTag],
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.css',
})
export class CountryDetail {
  countryCode = '';

  constructor(private route: ActivatedRoute) {

    this.countryCode =
      this.route.snapshot.paramMap.get('code')!;

    console.log(this.countryCode);
  }
}
