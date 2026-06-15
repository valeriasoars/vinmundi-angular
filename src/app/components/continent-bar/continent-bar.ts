import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Country } from '../../service/country/country';
import { ContinentModel } from '../../models/continent-model';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Progression } from '../../service/progression/progression';

@Component({
  selector: 'app-continent-bar',
  imports: [RouterLink],
  templateUrl: './continent-bar.html',
  styleUrl: './continent-bar.css',
})
export class ContinentBar implements OnInit {
  private readonly countryService = inject(Country);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly progressionService = inject(Progression);

  continents: ContinentModel[] = [];
  continenteAtivo: string = '';

  private readonly regioesValidas = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  private readonly traducoesContinentes: Record<string, string> = {
    Africa: 'África',
    Americas: 'Américas',
    Asia: 'Ásia',
    Europe: 'Europa',
    Oceania: 'Oceania',
    /*Antarctic: 'Antártida',*/
  };

  ngOnInit(): void {
    this.countryService.getAllCountries().subscribe({
      next: (countries) => {
        if (!Array.isArray(countries)) return;

        const grouped = countries.reduce((acc, country) => {
          const region = country.region;
          if (region && this.regioesValidas.includes(region)) {
            acc[region] = (acc[region] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        const continentesBase = Object.entries(grouped).map(([id, countriesCount]) => ({
          id,
          name: this.traducoesContinentes[id] || id,
          countriesCount,
          completedCount: 0,
          vistoDesbloqueado: false,
        }));

        const progressRequests = continentesBase.map(c =>
          this.progressionService.getProgress(c.id)
        );

        forkJoin(progressRequests).subscribe({
          next: (progressos) => {
            this.continents = continentesBase.map((c, i) => {
              const p = progressos[i];
              const completedCount = [p.bandeiras, p.capitais, p.silhuetas]
                .filter(score => score !== null && score >= 7).length;

              return {
                ...c,
                completedCount,
                vistoDesbloqueado: p.visa_unlocked || false,
              };
            });
            this.cdr.detectChanges();
          },
          error: () => {
            this.continents = continentesBase;
            this.cdr.detectChanges();
          }
        });
      },
      error: (erro) => {
        console.error('Erro ao buscar os continentes:', erro);
      }
    });
  }

  selecionarContinente(regiaoId: string) {
    this.continenteAtivo = regiaoId;
    this.countryService.setRegiao(regiaoId);
  }

  calcularProgresso(completedCount: number = 0): number {
    const totalQuizzes = 3; 
    return (completedCount / totalQuizzes) * 100;
  }
}
