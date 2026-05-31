import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-border-tag',
  imports: [],
  templateUrl: './border-tag.html',
  styleUrl: './border-tag.css',
})
export class BorderTag {
  @Input() borders: string[] = [];
}
