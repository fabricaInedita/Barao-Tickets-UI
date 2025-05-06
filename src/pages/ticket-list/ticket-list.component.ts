import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UtilsService } from '../../services/utils-service';
import { IOptionsResponse } from '../../interfaces/shared/options-response';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-ticket-list',
  standalone: false,
  templateUrl: './ticket-list.component.html',
  providers: [provideNativeDateAdapter()],
  host: { 'class': 'flex flex-col w-full' }
})
export class TicketListComponent {
  public displayedColumns: string[];
  public dataSource: ITicket[];
  public categorias: IOptionsResponse[];
  public locations: IOptionsResponse[];
  public instituicoes: IOptionsResponse[];
  public form: FormGroup;
  public isLoading: boolean = false;
  public pagination = { pageSize: 10, totalRecords: 0, page: 1 };

  constructor(
    private categoryService: CategoryService,
    private institutionService: InstitutionService,
    private locationService: LocationService,
    private ticketService: TicketService,
    private fb: FormBuilder,
    private router: Router,
    private UtilsService: UtilsService
  ) {
    this.displayedColumns = ['categoria', 'titulo', 'instituicao', 'location', 'codigo_aluno', 'data', 'process', 'acao'];
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
      endDate: [null],
      process: [null],
    });

    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.isLoading = true;

    this.categoryService.getCategoryOptions().subscribe({
      next: (e) => this.categorias = e.data,
      complete: () => this.isLoading = false
    });

    this.institutionService.getInstitutionOptions().subscribe({
      next: (e) => this.instituicoes = e.data,
      complete: () => this.isLoading = false
    });

    this.loadTickets();
  }

  public verificar(id: any): void {
    this.router.navigate([`/ticket-view/${id}`]);
  }

  public filtrar(): void {
    this.loadTickets();
  }

  private loadTickets(): void {
    this.isLoading = true;
    this.ticketService.getTickets({
      ...this.form.value,
      page: this.pagination.page,
      pageSize: this.pagination.pageSize
    }).subscribe({
      next: (e) => {
        this.dataSource = e.data

      this.pagination.totalRecords = e.totalRecords;
      },
      complete: () => this.isLoading = false
    });
  }

  public handleGetLocations(institutionId: string): void {
    this.isLoading = true;
    this.locationService.getLocationOptions({ institutionId }).subscribe({
      next: (e) => this.locations = e.data,
      complete: () => this.isLoading = false
    });
  }

  public handleProcessTicket(event: MatCheckboxChange, id: number): void {
    this.isLoading = true;
    this.ticketService.proccessTicket({ ticketId: id }, { status: event.checked })
      .subscribe({
        next: () => {
          this.dataSource = this.dataSource.map(d => {
            if (d.ticketId === id) {
              d.processed = event.checked;
            }
            return d;
          });
        },
        error: () => {
          this.dataSource = this.dataSource.map(d => {
            if (d.ticketId === id) {
              d.processed = !event.checked;
            }
            return d;
          });
          this.UtilsService.snack("Não foi possível atualizar o status do ticket.", "error");
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.page = event.pageIndex;
    this.loadTickets();
  }
}