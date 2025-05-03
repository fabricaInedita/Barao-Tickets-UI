import { Component } from '@angular/core';
import { TicketService } from '../../services/ticket-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITicket } from '../../interfaces/entities/ticket';

@Component({
  selector: 'app-send-ticket',
  standalone: false,
  templateUrl: './profile.component.html',
  host: {
    'class': 'h-screen w-screen'
  }
})
export class ProfileComponent {
  public ticket: ITicket | null = null;
  public isLoading: boolean = true;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute
  ) {
    this.loadTicket();
  }

  private loadTicket(): void {
    const ticketId = this.route.snapshot.paramMap.get('id') ?? "";
    this.isLoading = true;
    
    this.ticketService.getTicketById({ ticketId }).subscribe({
      next: (e) => {
        this.ticket = e.data;
      },
      error: () => {
        this.ticket = null;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}