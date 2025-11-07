import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category-service';
import { InstitutionService } from '../../services/institution-service';
import { TicketService } from '../../services/ticket-service';
import { LocationService } from '../../services/location-service';
import { FastSelectSendTicketComponent } from '../../dialogs/fast-select-send-ticket/fast-select-send-ticket.component';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, tap } from 'rxjs';
import { UtilsService } from '../../services/utils-service';
import { IOptionsResponse } from '../../interfaces/shared/options-response';

@Component({
  selector: 'app-send-ticket',
  standalone: false,
  templateUrl: './send-ticket.component.html',
  host: {
    'class': 'h-screen w-screen'
  }
})
export class SendTicketComponent {
  public isLoading = false;
  public formulario: FormGroup;
  public categorias: IOptionsResponse[] = [];
  public locations: IOptionsResponse[] = [];
  public instituicoes: IOptionsResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private locationService: LocationService,
    private institutionService: InstitutionService,
    private ticketService: TicketService,
    private dialog: MatDialog,
    private UtilsService: UtilsService
  ) {
    this.formulario = this.fb.group({
      title: ['', Validators.required],
      categoryId: ['', Validators.required],
      institutionId: ['', Validators.required],
      description: ['', Validators.required],
      locationId: ['', Validators.required],
    });

    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.isLoading = true;

    forkJoin({
      getCategory: this.categoryService.getCategoryOptions().pipe(tap(res => this.categorias = res.data)),
      getInstitution: this.institutionService.getInstitutionOptions().pipe(
        tap(res => {
          this.instituicoes = res.data;
          this.handleFastTicketDialog();
        })
      )
    }).subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false
    });
  }

  private handleFastTicketDialog(): void {
    this.dialog.closeAll()

    this.openFastTicketDialog().afterClosed().subscribe((id: number | null) => {
      if (id == null) return;

      this.isLoading = true;

      this.locationService.getLocationById({ locationId: id }).subscribe({
        next: res => {
          if (res?.data?.institution?.id == null) {
            this.UtilsService.snack("Não existem instituições cadastradas.", "error");
            this.isLoading = false;
          }

          const institutionId = res.data.institution.id;

          this.locationService.getLocationOptions({ institutionId: institutionId }).subscribe({
            next: locationsRes => {
              this.locations = locationsRes.data;
              this.formulario.reset({
                ...this.formulario.value,
                locationId: res.data.id,
                institutionId: institutionId
              });
              this.isLoading = false;
            },
            error: () => this.isLoading = false
          });
        },
        error: () => this.isLoading = false
      });
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.formulario.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.formulario.get(field);
    return control?.hasError('required') ? 'Este campo é obrigatório.' : '';
  }

  handleGetLocations(event?: string): void {
    const institutionId = event ?? this.formulario.value.institutionId ?? '';
    this.locationService.getLocationOptions({ institutionId: institutionId }).subscribe(
      {
        next: res => {
          this.locations = res.data;
          this.isLoading = false
        },
        error: () => this.isLoading = false
      }

    );
  }

  onSubmit(): void {
    if (!this.formulario.valid) return;

    this.isLoading = true;

    this.ticketService.postTicket(this.formulario.value).subscribe(() => {
      this.UtilsService.snack("Enviado com sucesso!", "success");

      this.formulario.reset();
      this.formulario.markAsPristine();
      this.formulario.markAsUntouched();
      this.isLoading = false;
    });
  }

  openFastTicketDialog() {
    return this.dialog.open(FastSelectSendTicketComponent, {
      width: '400px'
    });
  }
}
