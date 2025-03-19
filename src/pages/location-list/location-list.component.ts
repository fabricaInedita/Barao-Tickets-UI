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

export interface LocationPostSchema {
  name: AbstractControl<string | null>,
  description: AbstractControl<string | null>,
  institutionId: AbstractControl<string | null>
}

@Component({
  selector: 'app-location-list',
  standalone: false,
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.css'],
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
  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private institutionService: InstitutionService,
  ) {
    this.categorias = [];
    this.instituicoes = [];
    this.locations = [];

    this.formulario = this.fb.group<LocationPostSchema>({
      description: this.fb.control<string | null>('', Validators.required),
      name: this.fb.control<string | null>('', Validators.required),
      institutionId: this.fb.control<string | null>('', Validators.required),
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
      this.locationService.postLocation(this.formulario.value).subscribe(() => {
        this._snackBar.open("Instituição adicionada com sucesso!", "Ok");
        this.formulario.reset({ description: "", name: "", institutionId: this.formulario.value.institutionId });
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.handleGetLocations();
      });
    }
  }

  handleGetLocations(event?: string) {
    this.locationService.getLocation({ intitutionId: event ?? this.formulario.value.institutionId ?? "" }).subscribe(e => {
      this.locations = e.data;
      this.dataSource.data = this.locations;
    });
  }

  deleteInstitution(id: string) {
    this.locationService.deleteLocation({ institutionId: id }).subscribe(() => {
      this._snackBar.open("Instituição removida com sucesso!", "Ok");
      this.handleGetLocations();
    });
  }
}