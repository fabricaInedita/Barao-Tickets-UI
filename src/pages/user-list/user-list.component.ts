import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICategory } from '../../interfaces/entities/category';
import { CategoryService } from '../../services/category-service';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user-service';
import { IUser } from '../../interfaces/entities/user';
import { MatDialog } from '@angular/material/dialog';
import { TextDialogComponent } from '../../dialogs/text-dialog/text-dialog.component';

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
  public usuarios: IUser[];
  public displayedColumns: string[] = ['name', 'email', 'actions'];
  public dataSource = new MatTableDataSource<ICategory>();
  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.usuarios = [];

    this.formulario = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
    });
    this.getUsersAdmin()
  }

  isFieldInvalid(field: string): boolean | null {
    const control = this.formulario.get(field);
    return control && control.invalid && control.touched;
  }

  getErrorMessage(field: string): string {
    const control = this.formulario.get(field);
    return control && control.hasError('required') ? 'Este campo é obrigatório.' : '';
  }

  getUsersAdmin() {
    this.userService.getColaborator().subscribe(e=>{
      this.dataSource = e.data
    })
  }

  abrirDialog(senha:string): void {
    const dialogRef = this.dialog.open(TextDialogComponent, {
      width: '400px',
      data: {title:"Senha temporária", message:`A senha temporária do usuário é: ${senha}`,messageButton:"Ok"} 
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      const newCategory = this.formulario.value;
      this.userService.signupColaborador(newCategory).subscribe((e) => {
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();
        this.getUsersAdmin();
        this.abrirDialog(e.data)
      });
    }
  }
  deleteCategory(id: string) {
    this.userService.deleteColaborator({ userId: id }).subscribe(() => {
      this._snackBar.open("Usuário removido com sucesso!", "Ok");
      this.getUsersAdmin();
    });
  }
}
