import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BorderTag } from "../../components/border-tag/border-tag";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Country } from '../../service/country/country';

@Component({
  selector: 'app-country-detail',
  imports: [BorderTag, RouterLink],
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.css',
})
export class CountryDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private countryService = inject(Country);
  private cdr = inject(ChangeDetectorRef);

  country: any = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const code = params.get('code');
      console.log('Passo 1 - Código da Rota:', code);
      if (code) {
        this.carregarDetalhes(code);
      }else {
        console.error('Erro: O código do país não foi encontrado no URL.');
      }
    });
  }

  carregarDetalhes(code: string) {
    console.log('Passo 2 - A fazer pedido à API para:', code);
    this.countryService.getCountryByCode(code).subscribe(dados => {
      console.log('Passo 3 - Sucesso! Dados da API:', dados);
      this.country = dados[0]; 
      this.cdr.detectChanges();

      window.scrollTo(0, 0); 
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
}
