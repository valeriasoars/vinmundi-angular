import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CountryModel } from '../../models/country-model';
import { Country } from '../../service/country/country';

@Component({
  selector: 'app-continent',
  imports: [RouterLink],
  templateUrl: './continent.html',
  styleUrl: './continent.css',
})
export class Continent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly countryService = inject(Country);
  private readonly cdr = inject(ChangeDetectorRef);

  regiaoId: string = '';
  nomeContinente: string = '';
  paises: CountryModel[] = [];
  carregando: boolean = true;

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

    this.countryService.getCountriesByRegion(this.regiaoId).subscribe({
      next: (dados) => {
        this.paises = dados;
        this.carregando = false;

        this.cdr.detectChanges();

        console.log('Dados puros do primeiro país:', this.paises[0]);
      },
      error: (err) => {
        console.error('Erro ao buscar países:', err);
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
