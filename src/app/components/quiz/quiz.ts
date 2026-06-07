import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Country } from '../../service/country/country';
import { CountryModel } from '../../models/country-model';

@Component({
  selector: 'app-quiz',
  imports: [],
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

    this.nomeCorretoAtual = this.paisCorreto?.translations?.por?.common || 
                            this.paisCorreto?.name?.common || 
                            (typeof this.paisCorreto?.name === 'string' ? this.paisCorreto.name : '') || 
                            'País Desconhecido';

    this.bandeiraUrl = this.paisCorreto?.flags?.svg || 
                       this.paisCorreto?.flags?.png || 
                       (typeof this.paisCorreto?.flags === 'string' ? this.paisCorreto.flags : '');
    console.log('País Sorteado:', this.paisCorreto);
    console.log('Link da Bandeira:', this.bandeiraUrl);

    let novasOpcoes = [this.nomeCorretoAtual];

    while (novasOpcoes.length < 4) {
      const indexAleatorio = Math.floor(Math.random() * this.todosPaises.length);
      const paisAleatorio = this.todosPaises[indexAleatorio];
      
      const nomeAleatorio = paisAleatorio?.translations?.por?.common || 
                            paisAleatorio?.name?.common || 
                            (typeof paisAleatorio?.name === 'string' ? paisAleatorio.name : '');

      if (nomeAleatorio && !novasOpcoes.includes(nomeAleatorio)) {
        novasOpcoes.push(nomeAleatorio);
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
    this.acertou = (opcaoSelecionada === this.nomeCorretoAtual);
    
    if (this.acertou) {
      this.pontuacao++;
    }
    this.cdr.detectChanges();
  }
}
