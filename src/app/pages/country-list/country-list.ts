import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CountryCard } from '../../components/country-card/country-card';
import { Country } from '../../service/country/country';
import { CountryModel } from '../../models/country-model';

@Component({
  selector: 'app-country-list',
  imports: [CountryCard],
  templateUrl: './country-list.html',
  styleUrl: './country-list.css',
})
export class CountryList implements OnInit {
  private readonly countryService = inject(Country);
  private readonly cdr = inject(ChangeDetectorRef);

  countries: CountryModel[] = [];

ngOnInit() {
    // FLUXO 1: Escuta a seleção de continentes
    this.countryService.regiaoSelecionada$.subscribe(regiao => {
      if (regiao) {
        this.countryService.getCountriesByRegion(regiao).subscribe((dados) => {
          this.atualizarLista(dados);
        });
      }
    });

    // FLUXO 2: Escuta a digitação na barra de pesquisa
    this.countryService.termoBusca$.subscribe(termo => {
      if (termo.trim().length > 0) {
        this.countryService.getCountriesByName(termo).subscribe({
          next: (dados) => {
            this.atualizarLista(dados);
          },
          error: () => {
            // Se a API devolver erro (ex: 404 se o país não existir), limpa a lista
            this.countries = [];
            this.cdr.detectChanges();
          }
        });
      } else {
        // Se a barra de pesquisa for esvaziada, limpa o ecrã para voltar ao Empty State original
        this.countries = [];
        this.cdr.detectChanges();
      }
    });
  }

  // Função auxiliar para evitar repetição de código mapeamento
  private atualizarLista(dados: CountryModel[]) {
    this.countries = dados.map(pais => ({
      ...pais,
      capital: pais.capital || [],
      borders: pais.borders || [] 
    }));
    this.cdr.detectChanges();
  }
}

