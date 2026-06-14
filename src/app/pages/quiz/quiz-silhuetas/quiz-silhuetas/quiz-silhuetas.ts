import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CountryModel } from '../../../../models/country-model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Country } from '../../../../service/country/country';
import { Progression } from '../../../../service/progression/progression';

@Component({
  selector: 'app-quiz-silhuetas',
  imports: [RouterLink],
  templateUrl: './quiz-silhuetas.html',
  styleUrl: './quiz-silhuetas.css',
})
export class QuizSilhuetas implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly countryService = inject(Country);
  private readonly progressionService = inject(Progression);
  private readonly cdr = inject(ChangeDetectorRef);

  regiaoId: string = '';
  paisesDoContinente: CountryModel[] = [];

  paisCorreto: CountryModel | null = null;
  opcoes: string[] = [];
  silhuetaUrl: string = '';
  nomeCorreto: string = '';

  carregando = true;
  jogoIniciado = false;
  jaRespondeu = false;
  acertou = false;
  jogoFinalizado = false;

  rodadaAtual = 0;
  totalRodadas = 10;
  pontuacao = 0;
  readonly MINIMO_APROVACAO = 7;

  xpGanhoNaRodada: number = 0;
  subiuDeNivel: boolean = false;

  ngOnInit() {
    this.regiaoId = this.route.snapshot.paramMap.get('regiao') || '';

    this.countryService.getCountriesByRegion(this.regiaoId).subscribe({
      next: (dados) => {
        if (Array.isArray(dados)) {
          this.paisesDoContinente = dados.filter(country => 
            country.classification?.sovereign === true &&
            country.classification?.iso_status === 'official' &&
            country.codes?.alpha_2 
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
      
      forkJoin({
        resultadoXp: this.progressionService.processarXpDaRodada(this.pontuacao),
        salvamentoNota: this.progressionService.saveScore(this.regiaoId, 'silhuetas', this.pontuacao)
      }).subscribe({
        next: (respostas) => {
          this.xpGanhoNaRodada = respostas.resultadoXp.xpGanho;
          this.subiuDeNivel = respostas.resultadoXp.subiuDeNivel;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erro ao salvar no Supabase:', err)
      });
      return;
    }

    this.rodadaAtual++;
    this.jaRespondeu = false;
    this.acertou = false;

    const indexCorreto = Math.floor(Math.random() * this.paisesDoContinente.length);
    this.paisCorreto = this.paisesDoContinente[indexCorreto];
    this.nomeCorreto = this.paisCorreto.names.common;
    
    // Busca a silhueta no repositório público usando a sigla (ex: BR.svg, US.svg)
    const codigoIso2 = this.paisCorreto.codes.alpha_2.toLowerCase();
    this.silhuetaUrl = `https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${codigoIso2}/vector.svg`;

    const opcoes = new Set<string>([this.nomeCorreto]);
    while (opcoes.size < 4) {
      const p = this.paisesDoContinente[Math.floor(Math.random() * this.paisesDoContinente.length)];
      if (p.names.common) opcoes.add(p.names.common);
    }

    this.opcoes = this.embaralhar([...opcoes]);
    this.cdr.detectChanges();
  }

  verificarResposta(opcao: string) {
    if (this.jaRespondeu) return;
    this.jaRespondeu = true;
    this.acertou = opcao === this.nomeCorreto;
    if (this.acertou) this.pontuacao++;
    this.cdr.detectChanges();
  }

  lidarComErroImagem(event: any) {
    if (this.paisCorreto?.flag?.url_svg) {
      event.target.src = this.paisCorreto.flag.url_svg;
    }
  }

  private embaralhar(arr: string[]): string[] {
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
