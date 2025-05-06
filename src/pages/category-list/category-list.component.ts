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

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private UtilsService: UtilsService
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
    if (this.formulario.valid && !this.isLoading) {
      this.isLoading = true;
      const newCategory = this.formulario.value;

      this.categoryService.postTicketCategory(newCategory).subscribe({
        next: () => {
          this.UtilsService.snack("Categoria adicionada com sucesso!", "success");
          this.formulario.reset();
          this.formulario.markAsPristine();
          this.formulario.markAsUntouched();
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

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getCategory({
      page: this.pagination.page,
      pageSize: this.pagination.pageSize
    }).subscribe({
      next: (e) => {
        this.dataSource.data = e.data

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
    this.pagination.page = event.pageIndex;
    this.loadCategories();
  }
}