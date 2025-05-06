import { Component } from '@angular/core';
import { CategoryService } from '../../services/category-service';
import { ICategory } from '../../interfaces/entities/category';
import { ICategoryTicket } from '../../interfaces/entities/category-ticket';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IOptionsResponse } from '../../interfaces/shared/options-response';
import { PageEvent } from '@angular/material/paginator';
import { InstitutionService } from '../../services/institution-service';
import { LocationService } from '../../services/location-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-category-analysis',
  standalone: false,
  templateUrl: './category-analysis.component.html',
  host: {
    'class': 'flex flex-col w-full'
  }
})
export class CategoryAnalysisComponent {
  public displayedColumns: string[]
  public dataSource: ICategoryTicket[]
  public categorias: IOptionsResponse[];
  public ordem: { label: string, value: boolean | null }[];
  public form: FormGroup;
  public isLoading: boolean = false; 
  public locations: IOptionsResponse[] = [];
  public instituicoes: IOptionsResponse[] = [];
  public pagination = { pageSize: 10, totalRecords: 0, page: 1 };

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private institutionService: InstitutionService,
    private locationService: LocationService
  ) {
    this.displayedColumns = ['categoria', 'numero'];
    this.categorias = [];
    this.ordem = [{ label: 'Sem filtro', value: null }, { label: 'Decrescente', value: true }, { label: 'Crescente', value: false },];
    this.dataSource = [];

    this.form = this.fb.group({
      categoryId: [null],
      isDescending: [null],
      institutionId: [null],
      locationId: [null]
    });

    this.loadData();
  }

  public loadData() {
    this.isLoading = true;

    forkJoin({
      categories: this.categoryService.getCategoryOptions(),
      institutions: this.institutionService.getInstitutionOptions()
    }).subscribe({
      next: (results) => {
        this.categorias = results.categories.data;
        this.instituicoes = results.institutions.data;
        this.loadTicketCategories();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  public loadTicketCategories() {
    this.categoryService.getTicketCategories({
      ...this.form.value,
      page: this.pagination.page,
      pageSize: this.pagination.pageSize
    }).subscribe({
      next: (e) => {
        this.dataSource = e.data;
        this.pagination.totalRecords = e.totalRecords;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  public handleGetLocations(institutionId: string | null): void {
    if (!institutionId) {
      this.locations = [];
      this.form.patchValue({ locationId: null });
      return;
    }

    this.locationService.getLocationOptions({ institutionId }).subscribe(res => {
      this.locations = res.data;
      this.form.patchValue({ locationId: null });
    });
  }

  public filtrar() {
    this.isLoading = true;
    this.pagination.page = 1; // Reset to first page when filtering
    this.loadTicketCategories();
  }

  onPageChange(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.page = event.pageIndex + 1; // Material paginator is 0-based
    this.loadTicketCategories();
  }
}