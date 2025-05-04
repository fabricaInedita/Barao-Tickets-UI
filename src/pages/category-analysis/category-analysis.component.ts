import { Component } from '@angular/core';
import { CategoryService } from '../../services/category-service';
import { ICategory } from '../../interfaces/entities/category';
import { ICategoryTicket } from '../../interfaces/entities/category-ticket';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IOptionsResponse } from '../../interfaces/shared/options-response';

@Component({
  selector: 'app-category-analysis',
  standalone: false,
  templateUrl: './category-analysis.component.html',
  host: {
    'class': 'flex flex-col w-full'
  }
})
export class CategoryAnalysisComponent {
  public displayedColumns: string[]
  public dataSource: ICategoryTicket[]
  public categorias: IOptionsResponse[];
  public ordem: { label: string, value: boolean | null }[];
  public form: FormGroup;
  public isLoading: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
  ) {
    this.displayedColumns = ['categoria', 'numero'];
    this.categorias = [];
    this.ordem = [{ label: 'Sem filtro', value: null }, { label: 'Decrescente', value: true }, { label: 'Crescente', value: false },];
    this.dataSource = [];

    this.form = this.fb.group({
      categoryId: [null],
      isDescending: [null]
    });

    this.loadData();
  }

  public loadData() {
    this.isLoading = true;
    
    this.categoryService.getCategoryOptions().subscribe({
      next: (e) => {
        this.categorias = e.data;
        this.loadTicketCategories();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  public loadTicketCategories() {
    this.categoryService.getTicketCategories(this.form.value).subscribe({
      next: (e) => {
        this.dataSource = e.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  public filtrar() {
    this.isLoading = true;
    this.loadTicketCategories();
  }
}