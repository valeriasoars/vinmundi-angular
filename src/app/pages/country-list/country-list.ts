import { Component } from '@angular/core';
import { CountryCard } from "../../components/country-card/country-card";

@Component({
  selector: 'app-country-list',
  imports: [CountryCard],
  templateUrl: './country-list.html',
  styleUrl: './country-list.css',
})
export class CountryList {
  countries = [
    {
      name: 'Brasil',
      code: 'BRA',
      flag: 'https://flagcdn.com/w640/br.png',
      population: 203062512,
      capital: 'Brasília',
      region: 'América'
    },
    {
      name: 'Estados Unidos',
      code: 'BRA2',
      flag: 'https://flagcdn.com/w640/us.png',
      population: 340110988,
      capital: 'Washington',
      region: 'América'
    },
    {
      name: 'França',
      code: 'BRA3',
      flag: 'https://flagcdn.com/w640/fr.png',
      population: 68374000,
      capital: 'Paris',
      region: 'Europa'
    },
    {
      name: 'Japão',
      code: 'BRA4',
      flag: 'https://flagcdn.com/w640/jp.png',
      population: 123900000,
      capital: 'Tóquio',
      region: 'Ásia'
    }
  ];
}
