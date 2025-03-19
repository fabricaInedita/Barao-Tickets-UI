import { Component } from '@angular/core';
import { TicketService } from '../../services/ticket-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITicket } from '../../interfaces/entities/ticket';

@Component({
  selector: 'app-send-ticket',
  standalone: false,
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css'],
  host: {
    'class': 'h-screen w-screen'
  }
})
export class TicketViewComponent {
  
  public ticket: ITicket | null

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute
  ) {
    this.ticket = null
    this.ticketService.getTicketById({ ticketId: this.route.snapshot.paramMap.get('id') ?? "" }).subscribe(e => {
      this.ticket = e.data
    })
  }


}
