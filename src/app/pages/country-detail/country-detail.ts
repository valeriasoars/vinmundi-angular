import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BorderTag } from "../../components/border-tag/border-tag";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Country } from '../../service/country/country';
import { Wikipedia } from '../../service/wikipedia/wikipedia';

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
    this.countryService.getCountryByCode(code).subscribe({
      next: (dados) => {
      this.country = dados[0]; 
      const nomeEmPortugues = this.country.translations?.por?.common || this.country.name.common;
      this.buscarWikipedia(nomeEmPortugues);
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

    this.wikiService.getImagensPais(nome).subscribe({
    next: (media) => {
      // Previne erro caso a API não devolva o array 'items'
      if (!media || !media.items) return;

      const fotosReais = media.items.filter((item: any) => {
        const titulo = item.title.toLowerCase();
        
        return item.type === 'image' && 
               !titulo.includes('.svg') &&     // Remove mapas em vetor e ícones
               !titulo.includes('map') &&      // Remove mapas
               !titulo.includes('bandeira') && // Remove bandeiras
               !titulo.includes('flag') && 
               !titulo.includes('brasão') &&   // Remove brasões
               !titulo.includes('coat');
      });

      // VAMOS ESPIAR O QUE A API DEVOLVEU:
      console.log('Todas as fotos encontradas:', fotosReais);

      // Verifica se encontrou alguma foto e se ela tem o array de links (srcset)
      if (fotosReais.length > 0 && fotosReais[0].srcset && fotosReais[0].srcset.length > 0) {
        
        // Pega o link da foto
        let link = fotosReais[0].srcset[0].src;
        
        // Corrige o link se vier sem https
        this.imagemPaisUrl = link.startsWith('//') ? 'https:' + link : link;
        
        console.log('Link final da imagem:', this.imagemPaisUrl);
        
        this.cdr.detectChanges();
      } else {
        console.log('Nenhuma foto válida sobreviveu ao filtro.');
      }
    },
    error: (erro) => console.error('Erro ao buscar imagens na Wikipedia:', erro)
  });
  }
}
