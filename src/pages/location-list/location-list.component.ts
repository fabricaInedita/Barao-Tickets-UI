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
  public categorias: ICategory[];
  public instituicoes: IInstitution[];
  public locations: ILocation[];
  public displayedColumns: string[] = ['name', 'cep', 'actions'];
  public dataSource = new MatTableDataSource<ILocation>();
  public isLoading: boolean = false;
  public isSubmitting: boolean = false;
  public isDeleting: { [key: string]: boolean } = {};

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

    this.institutionService.getInstitution().subscribe(e => {
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
      this.isSubmitting = true;
      this.locationService.postLocation(this.formulario.value).subscribe({
        next: () => {
          this.UtilsService.snack("Ambiente adicionada com sucesso!","success");
          this.formulario.reset();
          this.isSubmitting = false;
          this.handleGetLocations();
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  handleGetLocations(event?: string) {
    if(event == null && this.formulario.value.institutionId == null){
      return;
    }

    this.isLoading = true;
    this.locationService.getLocation({ intitutionId: event ?? this.formulario.value.institutionId}).subscribe({
      next: (e) => {
        this.locations = e.data;
        this.dataSource.data = this.locations;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  deleteInstitution(id: string) {
    this.isDeleting[id] = true;
    this.locationService.deleteLocation({ institutionId: id }).subscribe({
      next: () => {
        this.UtilsService.snack("Ambiente removida com sucesso!","success");
        this.isDeleting[id] = false;
        this.handleGetLocations();
      },
      error: () => {
        this.isDeleting[id] = false;
      }
    });
  }
}