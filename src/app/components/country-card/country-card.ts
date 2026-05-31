import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';


export interface Country {
  name: string;
  flag: string;
  population: number;
  capital: string;
  region: string;
}

@Component({
  selector: 'app-country-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './country-card.html',
  styleUrl: './country-card.css',
})
export class CountryCard {
@Input() country!: {
    name: string;
    code: string;
    flag: string;
    population: number;
    capital: string;
    region: string;
  };
}
