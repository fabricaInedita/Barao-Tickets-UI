import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOptionsResponse } from '../../interfaces/shared/options-response';
import { ILocation } from '../../interfaces/entities/location';
import { LocationService } from '../../services/location-service';
import { InstitutionService } from '../../services/institution-service';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { UtilsService } from '../../services/utils-service';

interface LocationPostSchema {
  name: AbstractControl<string | null>;
  description: AbstractControl<string | null>;
  institutionId: AbstractControl<string | null>;
}

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  standalone: false,
  host: {
    'class': 'h-screen w-screen'
  }
})
export class LocationListComponent {
  public formulario: FormGroup<any>;
  public instituicoes: IOptionsResponse[] = [];
  public displayedColumns: string[] = ['name', 'description', 'actions'];
  public dataSource = new MatTableDataSource<ILocation>();
  public isLoading: boolean = false;
  public pagination = { pageSize: 10, totalRecords: 0, page: 1 };
  public isEditing: boolean = false;
  public currentEditId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private institutionService: InstitutionService,
    private utilsService: UtilsService
  ) {
    this.formulario = this.fb.group<any>({
      description: this.fb.control('', Validators.required),
      name: this.fb.control('', Validators.required),
      institutionId: this.fb.control(null, Validators.required),
    });

    this.loadInstitutions();
  }

  isFieldInvalid(field: string): boolean | null {
    const control = this.formulario.get(field);
    return control && control.invalid && control.touched;
  }

  getErrorMessage(field: string): string {
    const control = this.formulario.get(field);
    return control?.hasError('required') ? 'Este campo é obrigatório.' : '';
  }

  onSubmit() {
    if (this.formulario.valid && !this.isLoading) {
      this.isLoading = true;
      const locationData = this.formulario.value;

      if (this.isEditing && this.currentEditId) {
        this.locationService.updateLocation({ locationId: this.currentEditId }, locationData).subscribe({
          next: () => {
            this.utilsService.snack("Ambiente atualizado com sucesso!", "success");
            this.resetForm();
            this.handleGetLocations();
          },
          error: (error) => {
            this.utilsService.snack(error.error?.message || "Erro ao atualizar ambiente", "error");
            this.isLoading = false;
          }
        });
      } else {
        this.locationService.postLocation(locationData).subscribe({
          next: () => {
            this.utilsService.snack("Ambiente adicionado com sucesso!", "success");
            this.resetForm();
            this.handleGetLocations();
          },
          error: (error) => {
            this.utilsService.snack(error.error?.message || "Erro ao adicionar ambiente", "error");
            this.isLoading = false;
          }
        });
      }
    }
  }

  editLocation(location: ILocation) {
    this.isEditing = true;
    this.currentEditId = location.id;
    this.formulario.patchValue({
      name: location.name,
      description: location.description
    });
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.formulario.patchValue({
      name: null,
      description: null
    });
    this.formulario.markAsPristine();
    this.formulario.markAsUntouched();
    this.isEditing = false;
    this.currentEditId = null;
    this.isLoading = false;
  }

  loadInstitutions() {
    this.institutionService.getInstitutionOptions().subscribe({
      next: (e) => {
        this.instituicoes = e.data;
      },
      error: (error) => {
        this.utilsService.snack(error.error?.message || "Erro ao carregar unidades", "error");
      }
    });
  }

  handleGetLocations(institutionId?: string) {
    const id = institutionId ?? this.formulario.value.institutionId;
    if (!id) return;

    this.isLoading = true;
    this.locationService.getLocation({
      page: this.pagination.page,
      pageSize: this.pagination.pageSize,
      institutionId: id
    }).subscribe({
      next: (e) => {
        this.dataSource.data = e.data;
        this.pagination.totalRecords = e.totalRecords;
      },
      error: (error) => {
        this.utilsService.snack(error.error?.message || "Erro ao carregar ambientes", "error");
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  deleteLocation(id: string) {
    this.locationService.deleteLocation({ locationId: id }).subscribe({
      next: () => {
        this.utilsService.snack("Ambiente removido com sucesso!", "success");
        this.handleGetLocations();
      },
      error: (error) => {
        this.utilsService.snack(error.error?.message || "Erro ao remover ambiente", "error");
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.page = event.pageIndex + 1;
    this.handleGetLocations();
  }
}