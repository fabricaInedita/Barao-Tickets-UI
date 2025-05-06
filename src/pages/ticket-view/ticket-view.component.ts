import { Component } from '@angular/core';
import { TicketService } from '../../services/ticket-service';
import { ActivatedRoute } from '@angular/router';
import { ITicket } from '../../interfaces/entities/ticket';

@Component({
  selector: 'app-send-ticket',
  standalone: false,
  templateUrl: './ticket-view.component.html',
  host: {
    'class': 'h-screen w-screen'
  }
})
export class TicketViewComponent {
  public ticket: ITicket | null = null;
  public isLoading: boolean = true;
  public errorLoading: boolean = false;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute
  ) {
    this.loadTicket();
  }

  private loadTicket(): void {
    const ticketId = this.route.snapshot.paramMap.get('id') ?? '';
    this.isLoading = true;
    this.errorLoading = false;

    this.ticketService.getTicketById({ ticketId }).subscribe({
      next: (e) => {
        this.ticket = e.data;
      },
      error: () => {
        this.errorLoading = true;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}