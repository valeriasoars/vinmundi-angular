import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CountryModel } from '../../models/country-model';
import { Country } from '../../service/country/country';
import { forkJoin } from 'rxjs';
import { Progression } from '../../service/progression/progression';
import { ContinentProgressModel } from '../../models/progress-model';

@Component({
  selector: 'app-continent',
  imports: [RouterLink],
  templateUrl: './continent.html',
  styleUrl: './continent.css',
})
export class Continent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly countryService = inject(Country);
  private readonly progressionService = inject(Progression)
  private readonly cdr = inject(ChangeDetectorRef);

  regiaoId: string = '';
  nomeContinente: string = '';
  paises: CountryModel[] = [];
  carregando: boolean = true;
  progresso!: ContinentProgressModel

  nivelCapitaisLiberado: boolean = false;
  nivelSilhuetasLiberado: boolean = false;

  private readonly traducoes: Record<string, string> = {
    Africa: 'África',
    Americas: 'Américas',
    Asia: 'Ásia',
    Europe: 'Europa',
    Oceania: 'Oceania',
    Antarctic: 'Antártida',
  };

  ngOnInit() {
    this.regiaoId = this.route.snapshot.paramMap.get('regiao') || '';
    this.nomeContinente = this.traducoes[this.regiaoId] || this.regiaoId;

forkJoin({
      progressoBanco: this.progressionService.getProgress(this.regiaoId),
      paisesApi: this.countryService.getCountriesByRegion(this.regiaoId)
    }).subscribe({
      next: (resultados) => {
        this.progresso = resultados.progressoBanco;
        this.nivelCapitaisLiberado = this.progresso.bandeiras !== null && this.progresso.bandeiras >= 7;
        this.nivelSilhuetasLiberado = this.progresso.capitais !== null && this.progresso.capitais >= 7;

        if (Array.isArray(resultados.paisesApi)) {
          this.paises = resultados.paisesApi.filter(country => 
            country.classification?.sovereign === true &&
            country.classification?.iso_status === 'official'
          );
        }

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar missão:', err);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
