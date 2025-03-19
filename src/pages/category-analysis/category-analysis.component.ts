import { Component } from '@angular/core';
import { CategoryService } from '../../services/category-service';
import { ICategory } from '../../interfaces/entities/category';
import { ICategoryTicket } from '../../interfaces/entities/category-ticket';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-category-analysis',
  standalone: false,
  templateUrl: './category-analysis.component.html',
  styleUrl: './category-analysis.component.css',
  host: {
    'class': 'flex flex-col w-full'
  }
})
export class CategoryAnalysisComponent {
  public displayedColumns: string[]
  public dataSource: ICategoryTicket[]
  public categorias: ICategory[];
  public ordem: { label: string, value: boolean | null }[];
  public form: FormGroup;

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

    this.categoryService.getCategory().subscribe(e => {
      this.categorias = e.data
    })
    this.categoryService.getTicketCategories(this.form.value).subscribe(e => {
      this.dataSource = e.data
    })
  }

  public filtrar(){
    this.categoryService.getTicketCategories(this.form.value).subscribe(e => {
      this.dataSource = e.data
    })
  }
}
