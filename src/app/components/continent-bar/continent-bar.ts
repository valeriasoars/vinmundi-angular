import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Country } from '../../service/country/country';

@Component({
  selector: 'app-continent-bar',
  imports: [],
  templateUrl: './continent-bar.html',
  styleUrl: './continent-bar.css',
})
export class ContinentBar implements OnInit {
  private readonly countryService = inject(Country);
  private readonly cdr = inject(ChangeDetectorRef);

  continents: {
    name: string;
    countriesCount: number;
  }[] = [];

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
        .map(([name, countriesCount]) => ({
          name: this.traducoesContinentes[name] || name,
          countriesCount,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      console.log('Continentes processados:', this.continents);

      this.cdr.detectChanges();
    });
  }
}
