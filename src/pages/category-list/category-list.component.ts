import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategory } from '../../interfaces/entities/category';
import { CategoryService } from '../../services/category-service';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from '../../services/utils-service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-category-list',
  standalone: false,
  templateUrl: './category-list.component.html',
  host: {
    'class': 'h-screen w-screen'
  }
})
export class CategoryListComponent {
  public formulario: FormGroup;
  public categorias: ICategory[];
  public displayedColumns: string[] = ['description', 'actions'];
  public dataSource = new MatTableDataSource<ICategory>();
  public isLoading: boolean = false;
  public pagination = { pageSize: 10, totalRecords: 0, page: 1 };
  public isEditing: boolean = false;
  public currentEditId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private UtilsService: UtilsService
  ) {
    this.categorias = [];

    this.formulario = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  isFieldInvalid(field: string): boolean | null {
    const control = this.formulario.get(field);
    return control && control.invalid && (control.touched || control.dirty);
  }

  getErrorMessage(field: string): string {
    const control = this.formulario.get(field);
    if (control?.hasError('required')) {
      return 'Este campo é obrigatório.';
    }
    if (control?.hasError('maxlength')) {
      return 'O tamanho máximo é de 100 caracteres';
    }
    return '';
  }

  onSubmit() {
    if (this.formulario.valid && !this.isLoading) {
      this.isLoading = true;
      const categoryData = this.formulario.value;

      if (this.isEditing && this.currentEditId) {
        this.categoryService.updateCategory({categoryId: this.currentEditId }, categoryData).subscribe({
          next: () => {
            this.UtilsService.snack("Categoria atualizada com sucesso!", "success");
            this.resetForm();
            this.loadCategories();
          },
          error: (error) => {
            this.UtilsService.snack(error.error?.message || "Erro ao atualizar categoria", "error");
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      } else {
        this.categoryService.postTicketCategory(categoryData).subscribe({
          next: () => {
            this.UtilsService.snack("Categoria adicionada com sucesso!", "success");
            this.resetForm();
            this.loadCategories();
          },
          error: (error) => {
            this.UtilsService.snack(error.error?.message || "Erro ao adicionar categoria", "error");
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    } else {
      this.formulario.markAllAsTouched();
    }
  }

  editCategory(category: ICategory) {
    this.isEditing = true;
    this.currentEditId = category.categoryId;
    this.formulario.patchValue({
      description: category.description
    });
    this.formulario.markAsTouched();
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.formulario.reset();
    this.formulario.markAsPristine();
    this.formulario.markAsUntouched();
    this.isEditing = false;
    this.currentEditId = null;
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getCategory({
      page: this.pagination.page,
      pageSize: this.pagination.pageSize
    }).subscribe({
      next: (e) => {
        this.dataSource.data = e.data;
        this.pagination.totalRecords = e.totalRecords;
      },
      error: (error) => {
        this.UtilsService.snack(error.error?.message || "Erro ao carregar categorias", "error");
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  deleteCategory(id: number) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.categoryService.deleteCategory({ categoryId: id }).subscribe({
      next: () => {
        this.UtilsService.snack("Categoria removida com sucesso!", "success");
        this.loadCategories();
      },
      error: (error) => {
        this.UtilsService.snack(error.error?.message || "Erro ao remover categoria", "error");
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.page = event.pageIndex + 1;
    this.loadCategories();
  }
}