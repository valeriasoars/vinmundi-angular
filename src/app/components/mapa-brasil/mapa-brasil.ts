import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mapa-brasil',
  imports: [],
  templateUrl: './mapa-brasil.html',
  styleUrl: './mapa-brasil.css',
})
export class MapaBrasil {
  @Input() regiaoSelecionada: string | null = null;
  @Input() regiaoAlvo: string = '';
  @Input() statusResposta: 'correto' | 'errado' | null = null;

  @Input() regioesCompletadas: string[] = [];

  @Output() regiaoClicada = new EventEmitter<string>();

  onClick(regiao: string) {
    this.regiaoClicada.emit(regiao);
  }
}
