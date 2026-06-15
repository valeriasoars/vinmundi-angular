import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Country } from '../../../../service/country/country';
import { CountryModel } from '../../../../models/country-model';
import { RouterLink } from '@angular/router';
import { Progression } from '../../../../service/progression/progression';

@Component({
  selector: 'app-quiz-mundial',
  imports: [RouterLink],
  templateUrl: './quiz-mundial.html',
  styleUrl: './quiz-mundial.css',
})
export class QuizMundial implements OnInit {
  private readonly countryService = inject(Country);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly progressionService = inject(Progression);

  todosPaises: CountryModel[] = [];
  paisCorreto: CountryModel | null = null;
  opcoes: CountryModel[] = [];

  carregando = true;
  jogoIniciado = false;
  jaRespondeu = false;
  acertou = false;
  jogoFinalizado = false;
  salvando = false;

  rodadaAtual = 0;
  totalRodadas = 15;
  pontuacao = 0;
  readonly MINIMO_APROVACAO = 12;

  ngOnInit() {
    this.countryService.getAllCountries().subscribe({
      next: (dados) => {
        if (Array.isArray(dados)) {
          this.todosPaises = dados.filter(country => 
            country.classification?.sovereign === true 
          );
        }
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
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
      
      if (this.aprovado) {
        this.salvando = true;
        this.progressionService.desbloquearVistoMundial().subscribe({
          next: () => {
            this.salvando = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error(err);
            this.salvando = false;
            this.cdr.detectChanges();
          }
        });
      }
      return;
    }

    this.rodadaAtual++;
    this.jaRespondeu = false;
    this.acertou = false;

    const indexCorreto = Math.floor(Math.random() * this.todosPaises.length);
    this.paisCorreto = this.todosPaises[indexCorreto];

    const opcoesSet = new Set<CountryModel>([this.paisCorreto]);
    while (opcoesSet.size < 4) {
      const p = this.todosPaises[Math.floor(Math.random() * this.todosPaises.length)];
      opcoesSet.add(p);
    }

    this.opcoes = this.embaralhar([...opcoesSet]);
    this.cdr.detectChanges();
  }

  verificarResposta(opcao: CountryModel) {
    if (this.jaRespondeu) return;
    this.jaRespondeu = true;
    this.acertou = opcao.codes.alpha_3 === this.paisCorreto?.codes.alpha_3;
    if (this.acertou) this.pontuacao++;
    this.cdr.detectChanges();
  }

  private embaralhar(arr: any[]): any[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  get aprovado(): boolean {
    return this.pontuacao >= this.MINIMO_APROVACAO;
  }
}
