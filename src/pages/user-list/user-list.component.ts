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
  selector: 'app-user-list',
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
  public pagination = { pageSize: 10, totalRecords: 0, page: 1 };
  public isEditing: boolean = false;
  public currentEditId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private UtilsService: UtilsService
  ) {
    this.formulario = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    });
  }

  ngOnInit() {
    this.getUsersAdmin();
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
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('maxlength')) {
      return 'O tamanho máximo é de 100 caracteres';
    }
    return '';
  }

  getUsersAdmin() {
    this.isLoading = true;
    this.userService.getColaborator({
      page: this.pagination.page,
      pageSize: this.pagination.pageSize
    }).subscribe({
      next: (e) => {
        this.dataSource.data = e.data;
        this.pagination.totalRecords = e.totalRecords;
      },
      error: (error) => {
        this.UtilsService.snack(error.error?.message || "Erro ao carregar usuários", "error");
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
      const userData = this.formulario.value;

      if (this.isEditing && this.currentEditId) {
        this.userService.updateUser({ userId: this.currentEditId }, userData).subscribe({
          next: () => {
            this.UtilsService.snack("Usuário atualizado com sucesso!", "success");
            this.resetForm();
            this.getUsersAdmin();
          },
          error: (error) => {
            this.UtilsService.snack(error.error?.message || "Erro ao atualizar usuário", "error");
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      } else {
        this.userService.signupColaborador(userData).subscribe({
          next: (e) => {
            this.UtilsService.snack("Usuário adicionado com sucesso!", "success");
            this.resetForm();
            this.getUsersAdmin();
            this.abrirDialog(e.data);
          },
          error: (error) => {
            this.UtilsService.snack(error.error?.message || "Erro ao criar usuário", "error");
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

  editUser(user: IUser) {
    this.isEditing = true;
    this.currentEditId = user.id;
    this.formulario.patchValue({
      name: user.name,
      email: user.email
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

  deleteUser(id: string) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.userService.deleteColaborator({ userId: id }).subscribe({
      next: () => {
        this.UtilsService.snack("Usuário removido com sucesso!", "success");
        this.getUsersAdmin();
      },
      error: (error) => {
        this.UtilsService.snack(error.error?.message || "Erro ao remover usuário", "error");
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
    this.getUsersAdmin();
  }
}