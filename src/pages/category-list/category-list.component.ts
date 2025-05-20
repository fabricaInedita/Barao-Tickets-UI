import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICategory } from '../../interfaces/entities/category';
import { CategoryService } from '../../services/category-service';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from '../../services/utils-service';
import { IOptionsResponse } from '../../interfaces/shared/options-response';
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
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
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
    if (this.formulario.valid && !this.isLoading) {
      this.isLoading = true;
      const categoryData = this.formulario.value;

      if (this.isEditing && this.currentEditId) {
        // Atualizar categoria existente
        this.categoryService.updateCategory({categoryId: this.currentEditId }, categoryData).subscribe({
          next: () => {
            this.UtilsService.snack("Categoria atualizada com sucesso!", "success");
            this.resetForm();
            this.loadCategories();
          },
          error: () => {
            this.UtilsService.snack("Erro ao atualizar categoria", "error");
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      } else {
        // Criar nova categoria
        this.categoryService.postTicketCategory(categoryData).subscribe({
          next: () => {
            this.UtilsService.snack("Categoria adicionada com sucesso!", "success");
            this.resetForm();
            this.loadCategories();
          },
          error: () => {
            this.UtilsService.snack("Erro ao adicionar categoria", "error");
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    }
  }

  editCategory(category: ICategory) {
    this.isEditing = true;
    this.currentEditId = category.categoryId;
    this.formulario.patchValue({
      description: category.description
    });
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
      error: () => {
        this.UtilsService.snack("Erro ao carregar categorias", "error");
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
      error: () => {
        this.UtilsService.snack("Erro ao remover categoria", "error");
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.page = event.pageIndex + 1; // +1 porque geralmente a paginação começa em 1
    this.loadCategories();
  }
}