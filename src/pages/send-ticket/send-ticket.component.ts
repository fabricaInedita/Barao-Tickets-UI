import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICategory } from '../../interfaces/entities/category';
import { CategoryService } from '../../services/category-service';
import { InstitutionService } from '../../services/institution-service';
import { IInstitution } from '../../interfaces/entities/institution';
import { TicketService } from '../../services/ticket-service';
import { ILocation } from '../../interfaces/entities/location';
import { LocationService } from '../../services/location-service';
import { FastSelectSendTicketComponent } from '../../dialogs/fast-select-send-ticket/fast-select-send-ticket.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-send-ticket',
  standalone: false,
  templateUrl: './send-ticket.component.html',
  styleUrls: ['./send-ticket.component.css'],
  host: {
    'class': 'h-screen w-screen'
  }
})
export class SendTicketComponent {
  public formulario: FormGroup;
  public categorias: ICategory[];
  public locations: ILocation[];
  public instituicoes: IInstitution[];
  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private locationService: LocationService,
    private institutionService: InstitutionService,
    private ticketService: TicketService,
    private dialog: MatDialog
  ) {
    this.categorias = []
    this.instituicoes = []
    this.instituicoes = []
    this.locations = []

    this.formulario = this.fb.group({
      title: ['', Validators.required],
      categoryId: ['', Validators.required],
      institutionId: ['', Validators.required],
      description: ['', Validators.required],
      locationId: ['', Validators.required],
    });
    this.categoryService.getCategory().subscribe(e => {
      this.categorias = e.data
    })
    this.institutionService.getInstitution().subscribe(e => {
      this.instituicoes = e.data

      this.openFastTicketDialog().afterClosed().subscribe((id: number) => {
        if (id == null) {
          return;
        }

        this.locationService.getLocationById({ locationId: id }).subscribe(e => {
          this.locationService.getLocation({ intitutionId: e.data.institution.id }).subscribe(items => {
            this.locations = items.data;
            this.formulario.reset({
              ...this.formulario.value,
              locationId: e.data.id,
              institutionId: e.data.institution.id
            })

          })
        })
      })
    })

  }

  isFieldInvalid(field: string): boolean {
    const control = this.formulario.get(field);

    if (control && control.invalid && control.touched) {
      return true;
    }

    return false;
  }

  getErrorMessage(field: string): string {
    const control = this.formulario.get(field);

    if (control && control.hasError('required')) {
      return 'Este campo é obrigatório.';
    }
    return '';
  }

  handleGetLocations(event?: string) {
    this.locationService.getLocation({ intitutionId: event ?? this.formulario.value.institutionId ?? "" }).subscribe(e => {
      this.locations = e.data;
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.ticketService.postTicket(this.formulario.value).subscribe(e => {
        this._snackBar.open("Enviado com sucesso!", "Ok");
        this.formulario.reset();
        this.formulario.markAsPristine();
        this.formulario.markAsUntouched();

      })
    }
  }

  openFastTicketDialog() {
    return this.dialog.open(FastSelectSendTicketComponent, {
      width: '400px',
    });
  }
}
