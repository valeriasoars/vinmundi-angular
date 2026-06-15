import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CountryModel } from '../../models/country-model';

@Component({
  selector: 'app-country-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './country-card.html',
  styleUrl: './country-card.css',
})
export class CountryCard {
  @Input() country!: CountryModel;

  get nomePT(): string {
    return this.country.names?.translations?.['por']?.common || this.country.names?.common;
  }
}
