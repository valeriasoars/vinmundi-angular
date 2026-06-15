import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BorderTag } from '../../components/border-tag/border-tag';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Country } from '../../service/country/country';
import { Location, DecimalPipe } from '@angular/common';
import { Wikipedia } from '../../service/wikipedia/wikipedia';
import { Unsplash } from '../../service/unsplash/unsplash';

@Component({
  selector: 'app-country-detail',
  imports: [BorderTag, RouterLink, DecimalPipe],
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.css',
})
export class CountryDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly countryService = inject(Country);
  private readonly unsplashService = inject(Unsplash);
  private readonly wikiService = inject(Wikipedia);

  pais: any = null;
  carregando = true;
  imagemUrl: string = '';
  wikipediaText: string = '';

  ngOnInit() {
    const codigoPais = this.route.snapshot.paramMap.get('code');

    if (codigoPais) {
      this.countryService.getCountryByCode(codigoPais).subscribe({
        next: (dados) => {
          this.pais = Array.isArray(dados) ? dados[0] : dados;
          this.carregando = false;

          this.cdr.markForCheck();

          const nomeIngles = this.pais.name?.common || this.pais.names?.common;
          if (nomeIngles) {
            this.unsplashService.getFotoPais(nomeIngles).subscribe({
              next: (res) => {
                if (res.results && res.results.length > 0) {
                  this.imagemUrl = res.results[0].urls.regular;
                  this.cdr.markForCheck();
                }
              },
              error: (err) => console.error('Falha no Unsplash:', err),
            });
          }

          const nomePortugues =
            this.pais.names?.translations?.por?.common || this.pais.names?.common;
          if (nomePortugues) {
            this.wikiService.getResumoPais(nomePortugues).subscribe({
              next: (res) => {
                if (res.extract) {
                  this.wikipediaText = res.extract;
                  this.cdr.markForCheck();
                }
              },
              error: (err) => {
                this.wikipediaText =
                  'Não foi possível aceder aos registos deste território no momento.';
                this.cdr.markForCheck();
              },
            });
          }
        },
        error: () => {
          this.carregando = false;
          this.cdr.markForCheck();
        },
      });
    } else {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  garantirNumero(valor: any): number {
    if (typeof valor === 'number') return valor;
    if (typeof valor === 'string') return parseFloat(valor) || 0;
    return 0;
  }

  obterCapital(): string {
    if (!this.pais?.capitals?.length) return 'Não declarada';
    const capital = this.pais.capitals[0];
    return typeof capital === 'object' ? capital.name : capital;
  }

  voltar() {
    this.location.back();
  }
}
