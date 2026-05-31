import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Country } from '../../service/country/country';
import { ContinentModel } from '../../models/continent-model';

@Component({
  selector: 'app-continent-bar',
  imports: [],
  templateUrl: './continent-bar.html',
  styleUrl: './continent-bar.css',
})
export class ContinentBar implements OnInit {
  private readonly countryService = inject(Country);
  private readonly cdr = inject(ChangeDetectorRef);

  continents: ContinentModel[] = [];

  private readonly traducoesContinentes: Record<string, string> = {
    Africa: 'África',
    Americas: 'Américas',
    Asia: 'Ásia',
    Europe: 'Europa',
    Oceania: 'Oceania',
    Antarctic: 'Antártida',
  };

  ngOnInit(): void {
    this.countryService.getAllCountries().subscribe((countries) => {
      const grouped = countries.reduce(
        (acc, country) => {
          const region = country.region;
          if (!region) return acc;
          acc[region] = (acc[region] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

          this.continents = Object.entries(grouped)
          .map(([id, countriesCount]) => ({
            id: id, 
            name: this.traducoesContinentes[id] || id, 
            countriesCount
          }));
       

      console.log('Continentes processados:', this.continents);

      this.cdr.detectChanges();
    });
  }

  selecionarContinente(regiaoId: string) {
    this.countryService.setRegiao(regiaoId);
  }
}
