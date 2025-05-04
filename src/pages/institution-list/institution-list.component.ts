import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategory } from '../../interfaces/entities/category';
import { IInstitution } from '../../interfaces/entities/institution';
import { InstitutionService } from '../../services/institution-service';
import { UtilsService } from '../../services/utils-service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-send-Ticket',
  standalone: false,
  templateUrl: './institution-list.component.html',
  host: {
    'class': 'h-screen w-screen'
  }
})
export class InstitutionListComponent {
  public formulario: FormGroup;
  public categorias: ICategory[] = [];
  public instituicoes: IInstitution[] = [];
  public displayedColumns: string[] = ['name', 'cep', 'actions'];
  public dataSource = new MatTableDataSource<IInstitution>();
  public isLoading: boolean = false;
  public pagination = { pageSize: 10, totalRecords: 0, page: 0 };

  constructor(
    private fb: FormBuilder,
    private UtilsService: UtilsService,
    private institutionService: InstitutionService,
  ) {
    this.formulario = this.fb.group({
      name: ['', Validators.required],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]]
    });

    this.loadInstitutions();
  }

  isFieldInvalid(field: string): boolean | null {
    const control = this.formulario.get(field);
    return control && control.invalid && control.touched;
  }

  getErrorMessage(field: string): string {
    const control = this.formulario.get(field);
    if (control?.hasError('required')) {
      return 'Este campo é obrigatório.';
    }
    if (control?.hasError('pattern') && field === 'cep') {
      return 'CEP inválido (formato: 00000-000)';
    }
    return '';
  }

  onSubmit() {
    if (this.formulario.valid && !this.isLoading) {
      this.isLoading = true;
      const newInstitution: IInstitution = this.formulario.value;

      this.institutionService.postInstitution(newInstitution).subscribe({
        next: () => {
          this.UtilsService.snack("Unidade adicionada com sucesso!", "success");
          this.formulario.reset();
          this.formulario.markAsPristine();
          this.formulario.markAsUntouched();
          this.loadInstitutions();
        },
        error: (error) => {
          this.UtilsService.snack(error.error?.message || "Erro ao adicionar unidade", "error");
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  loadInstitutions() {
    this.isLoading = true;
    this.institutionService.getInstitution().subscribe({
      next: (e) => {
        this.instituicoes = e.data;
        this.dataSource.data = this.instituicoes;
      },
      error: (error) => {
        this.UtilsService.snack(error.error?.message || "Erro ao carregar unidades", "error");
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  deleteInstitution(id: string) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.institutionService.deleteInstitution({ institutionId: id }).subscribe({
      next: () => {
        this.UtilsService.snack("Unidade removida com sucesso!", "success");
        this.loadInstitutions();
      },
      error: (error) => {
        this.UtilsService.snack(error.error?.message || "Erro ao remover unidade", "error");
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}