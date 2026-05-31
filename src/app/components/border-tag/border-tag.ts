import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-border-tag',
  imports: [ RouterLink ],
  templateUrl: './border-tag.html',
  styleUrl: './border-tag.css',
})
export class BorderTag {
  @Input() borders: string[] = [];
}
