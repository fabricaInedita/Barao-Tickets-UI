import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone:false,
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  host:{
    'class': 'flex flex-col w-full h-fit'
  }
})
export class CardComponent {
  @Input() title: string;
  @Input() overflow: boolean;

  constructor() {
    this.title = "Enviar Ticket"
    this.overflow = false
  }
}
