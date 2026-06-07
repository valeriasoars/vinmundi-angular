import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BorderTag } from "../../components/border-tag/border-tag";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Country } from '../../service/country/country';
import { Wikipedia } from '../../service/wikipedia/wikipedia';
import { Unsplash } from '../../service/unsplash/unsplash';

@Component({
  selector: 'app-country-detail',
  imports: [BorderTag, RouterLink],
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.css',
})
export class CountryDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private countryService = inject(Country);
  private wikiService = inject(Wikipedia);
  private unsplashService = inject(Unsplash);
  private cdr = inject(ChangeDetectorRef);

  country: any = null;
  wikiData: any = null;
  imagemPaisUrl: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const code = params.get('code');
      if (code) {
        this.carregarDetalhes(code);
      }else {
        console.error('Erro: O código do país não foi encontrado no URL.');
      }
    });
  }

  carregarDetalhes(code: string) {
    this.wikiData = null;
    this.imagemPaisUrl = '';
    this.countryService.getCountryByCode(code).subscribe({
      next: (dados) => {
      this.country = dados[0]; 
      const nomeEmPortugues = this.country.translations?.por?.common || this.country.name.common;
      this.buscarWikipedia(nomeEmPortugues);

      const nomeEn = this.country.name.common;
      this.buscarFoto(nomeEn);
      this.cdr.detectChanges();
      window.scrollTo(0, 0); 
      },
      error: (erro) => console.error('Erro na REST Countries:', erro)
    });
  }


  getIdiomas(): string {
    if (!this.country?.languages) return 'N/A';
    return Object.values(this.country.languages).join(', ');
  }

  getMoedaNome(): string {
    if (!this.country?.currencies) return 'N/A';
    const primeiraChave = Object.keys(this.country.currencies)[0];
    return this.country.currencies[primeiraChave].name;
  }

  getMoedaCodigo(): string {
    if (!this.country?.currencies) return 'N/A';
    return Object.keys(this.country.currencies)[0];
  }

  getPrefixoTelefone(): string {
    if (!this.country?.idd?.root) return 'N/A';
    const root = this.country.idd.root; 
    const suffix = this.country.idd.suffixes ? this.country.idd.suffixes[0] : ''; 
    return `${root}${suffix}`;
  }

  buscarWikipedia(nome: string){
    this.wikiService.getResumoPais(nome).subscribe({
      next: (dadosWiki) => {
        this.wikiData = dadosWiki;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Artigo da Wikipedia não encontrado para:', nome);
      }
    })
  }


  buscarFoto(nome: string) {
    this.unsplashService.getFotoPais(nome).subscribe({
      next: (dados) => {
        if (dados.results && dados.results.length > 0) {
          this.imagemPaisUrl = dados.results[0].urls.regular;
          this.cdr.detectChanges();
        }
      }
    });
  }
}
