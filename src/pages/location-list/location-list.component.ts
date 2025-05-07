import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICategory } from '../../interfaces/entities/category';
import { CategoryService } from '../../services/category-service';
import { InstitutionService } from '../../services/institution-service';
import { IInstitution } from '../../interfaces/entities/institution';
import { MatTableDataSource } from '@angular/material/table';
import { LocationService } from '../../services/location-service';
import { ILocation } from '../../interfaces/entities/location';
import { UtilsService } from '../../services/utils-service';
import { IOptionsResponse } from '../../interfaces/shared/options-response';
import { PageEvent } from '@angular/material/paginator';

export interface LocationPostSchema {
  name: AbstractControl<string | null>,
  description: AbstractControl<string | null>,
  institutionId: AbstractControl<string | null>
}

@Component({
  selector: 'app-location-list',
  standalone: false,
  templateUrl: './location-list.component.html',
  host: {
    'class': 'h-screen w-screen'
  }
})
export class LocationListComponent {
  public formulario: FormGroup<LocationPostSchema>;
  public categorias: IOptionsResponse[];
  public instituicoes: IOptionsResponse[];
  public locations: ILocation[];
  public displayedColumns: string[] = ['name', 'cep', 'actions'];
  public dataSource = new MatTableDataSource<ILocation>();
  public isLoading: boolean = false;
  public pagination = { pageSize: 10, totalRecords: 0, page: 1 };

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private institutionService: InstitutionService,
    private UtilsService: UtilsService
  ) {
    this.categorias = [];
    this.instituicoes = [];
    this.locations = [];

    this.formulario = this.fb.group<LocationPostSchema>({
      description: this.fb.control<string | null>('', Validators.required),
      name: this.fb.control<string | null>('', Validators.required),
      institutionId: this.fb.control<string | null>(null, Validators.required),
    });

    this.institutionService.getInstitutionOptions().subscribe(e => {
      this.instituicoes = e.data
    })

    this.handleGetLocations();
  }

  isFieldInvalid(field: string): boolean | null {
    const control = this.formulario.get(field);
    return control && control.invalid && control.touched;
  }

  getErrorMessage(field: string): string {
    const control = this.formulario.get(field);
    return control && control.hasError('required') ? 'Este campo é obrigatório.' : '';
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.isLoading = true;
      this.locationService.postLocation(this.formulario.value).subscribe({
        next: () => {
          this.UtilsService.snack("Ambiente adicionada com sucesso!","success");
          this.formulario.reset();
          this.isLoading = false;
          this.handleGetLocations();
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  handleGetLocations(event?: string) {
    if(event == null && this.formulario.value.institutionId == null){
      return;
    }

    this.isLoading = true;
    this.locationService.getLocation({
      page: this.pagination.page,
      pageSize: this.pagination.pageSize,
      institutionId: event ?? this.formulario.value.institutionId
    }).subscribe({
      next: (e) => {
        this.dataSource.data = e.data
        this.pagination.totalRecords = e.totalRecords;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  deleteInstitution(id: string) {
    this.isLoading = true;
    this.locationService.deleteLocation({ institutionId: id }).subscribe({
      next: () => {
        this.UtilsService.snack("Ambiente removida com sucesso!","success");
        this.isLoading = false;
        this.handleGetLocations();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.page = event.pageIndex;
    this.handleGetLocations();
  }
}