import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Country } from '../../service/country/country';
import { CountryModel } from '../../models/country-model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quiz',
  imports: [RouterLink],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit{
  private readonly countryService = inject(Country);
  private readonly cdr = inject(ChangeDetectorRef);

  todosPaises: CountryModel[] = [];
  paisCorreto: CountryModel | null = null;
  opcoes: string[] = [];

  bandeiraUrl: string = '';
  nomeCorretoAtual: string = '';

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
        
        console.log('Total de países carregados para o jogo:', this.todosPaises.length);
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

  // // v5: campo é 'names.common' com notação de colchete
  // this.nomeCorretoAtual = this.paisCorreto?.['names.common'] || 'País Desconhecido';

  // // v5: bandeira é 'flag.url_svg' ou 'flag.url_png'
  // this.bandeiraUrl = this.paisCorreto?.['flag.url_svg'] || 
  //                    this.paisCorreto?.['flag.url_png'] || '';

  console.log('País Sorteado:', this.paisCorreto);
  console.log('Link da Bandeira:', this.bandeiraUrl);

  let novasOpcoes = [this.nomeCorretoAtual];

  while (novasOpcoes.length < 4) {
    const indexAleatorio = Math.floor(Math.random() * this.todosPaises.length);
    const paisAleatorio = this.todosPaises[indexAleatorio];

    // mesmo padrão v5
    // const nomeAleatorio = paisAleatorio?.['names.common'];

    // if (nomeAleatorio && !novasOpcoes.includes(nomeAleatorio)) {
    //   novasOpcoes.push(nomeAleatorio);
    // }
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
    this.acertou = (opcaoSelecionada === this.nomeCorretoAtual);
    
    if (this.acertou) {
      this.pontuacao++;
    }
    this.cdr.detectChanges();
  }
}
