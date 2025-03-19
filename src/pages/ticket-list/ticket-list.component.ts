import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CategoryService } from '../../services/category-service';
import { ICategory } from '../../interfaces/entities/category';
import { IInstitution } from '../../interfaces/entities/institution';
import { InstitutionService } from '../../services/institution-service';
import { ITicket } from '../../interfaces/entities/ticket';
import { TicketService } from '../../services/ticket-service';
import { Router } from '@angular/router';
import { LocationService } from '../../services/location-service';
import { ILocation } from '../../interfaces/entities/location';
import { MatDialog } from '@angular/material/dialog';
import { FastSelectSendTicketComponent } from '../../dialogs/fast-select-send-ticket/fast-select-send-ticket.component';

@Component({
  selector: 'app-ticket-list',
  standalone: false,
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css',
  providers: [provideNativeDateAdapter()],
  host: { 'class': 'flex flex-col w-full' }
})
export class TicketListComponent {
  public displayedColumns: string[];
  public dataSource: ITicket[];
  public categorias: ICategory[];
  public locations: ILocation[];
  public instituicoes: IInstitution[];
  public form: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private institutionService: InstitutionService,
    private locationService: LocationService,
    private ticketService: TicketService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.displayedColumns = ['categoria', 'titulo', 'instituicao', 'location', 'codigo_aluno', 'data', 'acao'];
    this.categorias = [];
    this.instituicoes = [];
    this.locations = [];
    this.dataSource = [];

    this.form = this.fb.group({
      title: [null],
      categoryId: [null],
      institutionId: [null],
      locationId: [null],
      studentCode: [null],
      initialDate: [null],
      endDate: null
    });
    this.categoryService.getCategory(this.form.value).subscribe(e => {
      this.categorias = e.data
    })
    this.institutionService.getInstitution().subscribe(e => {
      this.instituicoes = e.data
    })
    this.ticketService.getTickets(this.form.value).subscribe(e => {
      this.dataSource = e.data
    })
  }

  public verificar(id: any) {
    this.router.navigate([`/ticket-view/${id}`])
  }

  public filtrar() {
    this.ticketService.getTickets(this.form.value).subscribe(e => {
      this.dataSource = e.data
    })
  }

  public handleGetLocations(intitutionId: string) {
    this.locationService.getLocation({ intitutionId }).subscribe(e => {
      this.locations = e.data
    })
  }
}
