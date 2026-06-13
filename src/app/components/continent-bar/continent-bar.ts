import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Country } from '../../service/country/country';
import { ContinentModel } from '../../models/continent-model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-continent-bar',
  imports: [RouterLink],
  templateUrl: './continent-bar.html',
  styleUrl: './continent-bar.css',
})
export class ContinentBar implements OnInit {
  private readonly countryService = inject(Country);
  private readonly cdr = inject(ChangeDetectorRef);

  continents: ContinentModel[] = [];
  continenteAtivo: string = '';

  private readonly traducoesContinentes: Record<string, string> = {
    Africa: 'África',
    Americas: 'Américas',
    Asia: 'Ásia',
    Europe: 'Europa',
    Oceania: 'Oceania',
    Antarctic: 'Antártida',
  };

ngOnInit(): void {
    this.countryService.getAllCountries().subscribe({
      next: (countries) => {
        if (!Array.isArray(countries)) return;

        const regioesValidas = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic'];

        const grouped = countries.reduce((acc, country) => {
          const region = country.region;
          
          if (region && regioesValidas.includes(region)) {
            acc[region] = (acc[region] || 0) + 1;
          }
          
          return acc;
        }, {} as Record<string, number>);

        this.continents = Object.entries(grouped).map(([id, countriesCount]) => ({
          id: id,
          name: this.traducoesContinentes[id] || id,
          countriesCount: countriesCount, 
          completedCount: 0 
        }));

        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao buscar os continentes da Home:', erro);
      }
    });
  }

  selecionarContinente(regiaoId: string) {
    this.continenteAtivo = regiaoId;
    this.countryService.setRegiao(regiaoId);
  }

  calcularProgresso(completed: number = 0, total: number): number {
    if (total === 0) return 0;
    return (completed / total) * 100;
  }
}
