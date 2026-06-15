import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CountryCard } from '../../components/country-card/country-card';
import { Country } from '../../service/country/country';
import { CountryModel } from '../../models/country-model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-country-list',
  imports: [CountryCard, RouterLink],
  templateUrl: './country-list.html',
  styleUrl: './country-list.css',
})
export class CountryList implements OnInit {
  private readonly countryService = inject(Country);
  private readonly cdr = inject(ChangeDetectorRef);

  countries: CountryModel[] = [];

  ngOnInit() {
    this.countryService.regiaoSelecionada$.subscribe((regiao) => {
      if (regiao) {
        this.countryService.getCountriesByRegion(regiao).subscribe((dados) => {
          this.atualizarLista(dados);
        });
      }
    });

    this.countryService.termoBusca$.subscribe((termo) => {
      if (termo.trim().length > 0) {
        this.countryService.getCountriesByName(termo).subscribe({
          next: (dados) => {
            this.atualizarLista(dados);
          },
          error: () => {
            this.countries = [];
            this.cdr.detectChanges();
          },
        });
      } else {
        this.countries = [];
        this.cdr.detectChanges();
      }
    });
  }

  private atualizarLista(dados: CountryModel[]) {
    console.log('TOTAL:', dados.length);
    console.log('PRIMEIRO:', dados[0]);
    this.countries = dados.map((pais) => ({ ...pais }));
    this.cdr.detectChanges();
  }
}
