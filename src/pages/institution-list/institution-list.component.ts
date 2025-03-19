import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICategory } from '../../interfaces/entities/category';
import { CategoryService } from '../../services/category-service';
import { InstitutionService } from '../../services/institution-service';
import { IInstitution } from '../../interfaces/entities/institution';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-send-Ticket',
  standalone: false,
  templateUrl: './institution-list.component.html',
  styleUrls: ['./institution-list.component.css'],
  host: {
    'class': 'h-screen w-screen'
  }
})
export class InstitutionListComponent {
  public formulario: FormGroup;
  public categorias: ICategory[];
  public instituicoes: IInstitution[];
  public displayedColumns: string[] = ['name', 'cep', 'actions'];
  public dataSource = new MatTableDataSource<IInstitution>();
  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private institutionService: InstitutionService,
  ) {
    this.categorias = [];
    this.instituicoes = [];

    this.formulario = this.fb.group({
      name: ['', Validators.required],
      cep: ['', Validators.required]
    });

    this.loadInstitutions();
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
      const newInstitution: IInstitution = this.formulario.value;
      this.institutionService.postInstitution(newInstitution).subscribe(() => {
        this._snackBar.open("Instituição adicionada com sucesso!", "Ok");
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();        
        this.loadInstitutions();
      });
    }
  }

  loadInstitutions() {
    this.institutionService.getInstitution().subscribe(e => {
      this.instituicoes = e.data;
      this.dataSource.data = this.instituicoes;
    });
  }

  deleteInstitution(id: string) {
    this.institutionService.deleteInstitution({ institutionId: id }).subscribe(() => {
      this._snackBar.open("Instituição removida com sucesso!", "Ok");
      this.loadInstitutions();
    });
  }
}