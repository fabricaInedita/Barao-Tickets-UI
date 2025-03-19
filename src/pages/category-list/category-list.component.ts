import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICategory } from '../../interfaces/entities/category';
import { CategoryService } from '../../services/category-service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-category-list',
  standalone: false,
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  host: {
    'class': 'h-screen w-screen'
  }
})
export class CategoryListComponent {
  public formulario: FormGroup;
  public categorias: ICategory[];
  public displayedColumns: string[] = ['description', 'actions'];
  public dataSource = new MatTableDataSource<ICategory>();
  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
  ) {
    this.categorias = [];

    this.formulario = this.fb.group({
      description: ['', Validators.required]
    });

    this.loadCategories();
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
      const newCategory = this.formulario.value;
      this.categoryService.postTicketCategory(newCategory).subscribe(() => {
        this._snackBar.open("Categoria adicionada com sucesso!", "Ok");
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.loadCategories();
      });
    }
  }

  loadCategories() {
    this.categoryService.getCategory().subscribe(e => {
      this.categorias = e.data;
      this.dataSource.data = this.categorias;
    });
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory({ categoryId: id }).subscribe(() => {
      this._snackBar.open("Categoria removida com sucesso!", "Ok");
      this.loadCategories();
    });
  }
}
