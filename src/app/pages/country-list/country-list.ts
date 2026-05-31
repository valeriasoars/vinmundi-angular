import { Component, inject } from '@angular/core';
import { CountryCard } from '../../components/country-card/country-card';
import { Country } from '../../service/country/country';
import { CountryModel } from '../../models/country-model';

@Component({
  selector: 'app-country-list',
  imports: [CountryCard],
  templateUrl: './country-list.html',
  styleUrl: './country-list.css',
})
export class CountryList {
  private readonly countryService = inject(Country);

  countries: CountryModel[] = [];

ngOnInit() {
    this.countryService.regiaoSelecionada$.subscribe(regiao => {
      if (regiao) {
        // Agora podemos usar CountryModel[] diretamente aqui!
        this.countryService.getCountriesByRegion(regiao).subscribe((dados: CountryModel[]) => {
          
          this.countries = dados.map(pais => ({
            ...pais, // Copia todos os dados que já vêm perfeitos da API
            capital: pais.capital || [], // Previne erro se o país não tiver capital
            borders: pais.borders || []  // Previne erro se o país não tiver fronteiras
          }));
          
        });
      }
    });
  }
}
