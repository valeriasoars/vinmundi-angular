import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Progression } from '../../service/progression/progression';
import { RouterLink } from '@angular/router';

interface VistoContinente {
  id: string;
  nome: string;
  niveisConcluidos: number;
}

@Component({
  selector: 'app-vistos',
  imports: [RouterLink],
  templateUrl: './vistos.html',
  styleUrl: './vistos.css',
})
export class Vistos implements OnInit {
  private readonly progressionService = inject(Progression);
  private readonly cdr = inject(ChangeDetectorRef);

  private continentesBase = [
    { id: 'Africa', nome: 'África' },
    { id: 'Americas', nome: 'Américas' },
    { id: 'Asia', nome: 'Ásia' },
    { id: 'Europe', nome: 'Europa' },
    { id: 'Oceania', nome: 'Oceania' }
  ];

  vistosConquistados: VistoContinente[] = [];
  vistosPendentes: VistoContinente[] = [];
  mundoDesbloqueado = false;
  vistoMundialConquistado = false;

  ngOnInit() {
    this.progressionService.getAllProgress().subscribe({
      next: (progressosDoBanco) => {
        
        this.vistosConquistados = [];
        this.vistosPendentes = [];

        this.continentesBase.forEach(continente => {
          const progresso = progressosDoBanco.find(p => p.region_id === continente.id);
          
          let concluidos = 0;
          if (progresso) {
            if (progresso.score_flags !== null && progresso.score_flags >= 7) concluidos++;
            if (progresso.score_capitals !== null && progresso.score_capitals >= 7) concluidos++;
            if (progresso.score_silhouettes !== null && progresso.score_silhouettes >= 7) concluidos++;
          }

          const vistoAtual: VistoContinente = {
            id: continente.id,
            nome: continente.nome,
            niveisConcluidos: concluidos
          };

          if (concluidos === 3) {
            this.vistosConquistados.push(vistoAtual);
          } else {
            this.vistosPendentes.push(vistoAtual);
          }
        });

        this.mundoDesbloqueado = this.vistosConquistados.length === 5;
        this.cdr.detectChanges();
      }
    });

    this.progressionService.verificarVistoMundial().subscribe(status => {
      this.vistoMundialConquistado = status;
      this.cdr.detectChanges();
    });
  }
}
