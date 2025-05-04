import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../interfaces/entities/user';
import { UserService } from '../../services/user-service';
import { MatDialog } from '@angular/material/dialog';
import { TextDialogComponent } from '../../dialogs/text-dialog/text-dialog.component';
import { UtilsService } from '../../services/utils-service';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-category-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  host: {
    'class': 'h-screen w-screen'
  }
})
export class UserListComponent {
  public formulario: FormGroup;
  public displayedColumns: string[] = ['name', 'email', 'actions'];
  public dataSource = new MatTableDataSource<IUser>();
  public isLoading: boolean = false;
  public pagination = { pageSize: 10, totalRecords: 0, page: 0 };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private UtilsService: UtilsService
  ) {
    this.formulario = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    this.getUsersAdmin();
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
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    return '';
  }

  getUsersAdmin() {
    this.isLoading = true;
    this.userService.getColaborator({
      page: this.pagination.page + 1,
      pageSize: this.pagination.pageSize
    }).subscribe({
      next: (e) => {
        this.dataSource.data = e.data;
      },
      error: () => {
        this.UtilsService.snack("Erro ao carregar usuários", "error");
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  abrirDialog(senha: string): void {
    this.dialog.open(TextDialogComponent, {
      width: '400px',
      data: {
        title: "Senha temporária",
        message: `A senha temporária do usuário é: ${senha}`,
        messageButton: "Ok"
      }
    });
  }

  onSubmit() {
    if (this.formulario.valid && !this.isLoading) {
      this.isLoading = true;
      const newUser = this.formulario.value;

      this.userService.signupColaborador(newUser).subscribe({
        next: (e) => {
          this.formulario.reset();
          this.formulario.markAsPristine();
          this.formulario.markAsUntouched();
          this.getUsersAdmin();
          this.abrirDialog(e.data);
        },
        error: () => {
          this.UtilsService.snack("Erro ao criar usuário", "error");
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  deleteUser(id: string) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.userService.deleteColaborator({ userId: id }).subscribe({
      next: () => {
        this.UtilsService.snack("Usuário removido com sucesso!", "success");
        this.getUsersAdmin();
      },
      error: () => {
        this.UtilsService.snack("Erro ao remover usuário", "error");
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.page = event.pageIndex;
    this.getUsersAdmin();
  }
}