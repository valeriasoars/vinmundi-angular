import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Country } from '../../../service/country/country';
import { CountryModel } from '../../../models/country-model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quiz-continent',
  imports: [RouterLink],
  templateUrl: './quiz-continent.html',
  styleUrl: './quiz-continent.css',
})
export class QuizContinent implements OnInit {
private readonly countryService = inject(Country);
  private readonly cdr = inject(ChangeDetectorRef);

  todosPaises: CountryModel[] = [];
  paisCorreto: CountryModel | null = null;
  opcoes: string[] = [];

  nomePaisAtual: string = '';
  bandeiraUrl: string = '';
  respostaCorretaAtual: string = '';

  listaContinentes = [
    'África', 'América do Sul', 'América do Norte', 
    'América Central', 'Caribe', 'Ásia', 'Europa', 'Oceania'
  ];

  carregando: boolean = true;
  jogoIniciado: boolean = false;
  jaRespondeu: boolean = false;
  acertou: boolean = false;

  jogoFinalizado: boolean = false;
  rodadaAtual: number = 0;
  totalRodadas: number = 10;
  pontuacao: number = 0;

  ngOnInit() {
    this.countryService.getAllCountries().subscribe({
      next: (dados) => {
        this.todosPaises = dados;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao buscar os países:', erro);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  iniciarJogo() {
    this.jogoIniciado = true;
    this.jogoFinalizado = false;
    this.rodadaAtual = 0;
    this.pontuacao = 0;
    this.gerarRodada();
  }

  obterRegiaoExata(pais: CountryModel): string {
  const subregiao = pais?.['subregion'] || '';
  const regiao = pais?.['region'] || '';

  if (subregiao === 'South America') return 'América do Sul';
  if (subregiao === 'North America') return 'América do Norte';
  if (subregiao === 'Central America') return 'América Central';
  if (subregiao === 'Caribbean') return 'Caribe';

  const mapaRegioes: { [key: string]: string } = {
    'Africa': 'África',
    'Asia': 'Ásia',
    'Europe': 'Europa',
    'Oceania': 'Oceania',
    'Antarctic': 'Antártida'
  };

  return mapaRegioes[regiao] || regiao || 'Desconhecido';
}

  gerarRodada() {
  if (this.rodadaAtual >= this.totalRodadas) {
    this.jogoFinalizado = true;
    this.cdr.detectChanges();
    return;
  }

  this.rodadaAtual++;
  this.jaRespondeu = false;
  this.acertou = false;

  const indexCorreto = Math.floor(Math.random() * this.todosPaises.length);
  this.paisCorreto = this.todosPaises[indexCorreto];

  // // v5: notação de colchete
  // this.nomePaisAtual = this.paisCorreto?.['names.common'] || 'País Desconhecido';

  // this.bandeiraUrl = this.paisCorreto?.['flag.url_svg'] || 
  //                    this.paisCorreto?.['flag.url_png'] || '';

  // this.respostaCorretaAtual = this.obterRegiaoExata(this.paisCorreto);

  let novasOpcoes = [this.respostaCorretaAtual];

  while (novasOpcoes.length < 4) {
    const indexAleatorio = Math.floor(Math.random() * this.listaContinentes.length);
    const continenteAleatorio = this.listaContinentes[indexAleatorio];
    if (!novasOpcoes.includes(continenteAleatorio)) {
      novasOpcoes.push(continenteAleatorio);
    }
  }

  this.opcoes = this.embaralharArray(novasOpcoes);
  this.cdr.detectChanges();
}
  embaralharArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  verificarResposta(opcaoSelecionada: string) {
    if (this.jaRespondeu) return;

    this.jaRespondeu = true;
    this.acertou = (opcaoSelecionada === this.respostaCorretaAtual);
    
    if (this.acertou) {
      this.pontuacao++;
    }
    this.cdr.detectChanges();
  }

}

