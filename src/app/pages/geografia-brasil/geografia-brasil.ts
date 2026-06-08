import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegionBrazilQuiz } from "../region-brazil-quiz/region-brazil-quiz";

@Component({
  selector: 'app-geografia-brasil',
  imports: [RouterLink, RegionBrazilQuiz],
  templateUrl: './geografia-brasil.html',
  styleUrl: './geografia-brasil.css',
})
export class GeografiaBrasil {
  ecraAtual: 'menu' | 'quiz-regiao' | 'info' = 'menu';

  abrirJogoRegioes() {
    this.ecraAtual = 'quiz-regiao';
  }

  voltarAoMenu() {
    this.ecraAtual = 'menu';
  }
}
