import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MapaBrasil } from '../../../components/mapa-brasil/mapa-brasil';


@Component({
  selector: 'app-region-brazil-quiz',
  imports: [MapaBrasil],
  templateUrl: './region-brazil-quiz.html',
  styleUrl: './region-brazil-quiz.css',
})
export class RegionBrazilQuiz implements OnInit {
private readonly cdr = inject(ChangeDetectorRef);
  @Output() voltar = new EventEmitter<void>();

  regioesPendentes: string[] = [];
  regioesCompletadas: string[] = [];
  regiaoAlvo: string = ''; 
  
  jogoFinalizado: boolean = false;
  statusResposta: 'errado' | null = null;
  regiaoSelecionada: string | null = null;
  
  erros: number = 0;

  ngOnInit() {
    this.iniciarJogo();
  }

  iniciarJogo() {
    this.regioesPendentes = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];
    this.regioesCompletadas = [];
    this.erros = 0;
    this.jogoFinalizado = false;
    this.sortearRegiao();
  }

  sortearRegiao() {
    if (this.regioesPendentes.length === 0) {
      this.jogoFinalizado = true;
      this.cdr.detectChanges();
      return;
    }
    const indexAleatorio = Math.floor(Math.random() * this.regioesPendentes.length);
    this.regiaoAlvo = this.regioesPendentes[indexAleatorio];
    this.cdr.detectChanges();
  }

  receberCliqueDoMapa(regiaoClicada: string) {
    // Bloqueia clique numa região que já está verde
    if (this.regioesCompletadas.includes(regiaoClicada)) return;

    if (regiaoClicada === this.regiaoAlvo) {
      this.regioesCompletadas = [...this.regioesCompletadas, regiaoClicada];
      this.regioesPendentes = this.regioesPendentes.filter(r => r !== regiaoClicada);
      
      this.regiaoSelecionada = null;
      this.statusResposta = null;
      this.sortearRegiao(); 

    } else {
      this.statusResposta = 'errado';
      this.regiaoSelecionada = regiaoClicada;
      this.erros++;

      setTimeout(() => {
        if (this.regiaoSelecionada === regiaoClicada) {
          this.regiaoSelecionada = null;
          this.statusResposta = null;
          this.cdr.detectChanges();
        }
      }, 1000);
    }
    this.cdr.detectChanges();
  }

  sairDoJogo() {
    this.voltar.emit();
  }
}
