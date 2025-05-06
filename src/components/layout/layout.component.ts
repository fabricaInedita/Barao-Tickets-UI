import { Component, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { IRouteConfig, ROUTE_CONFIG } from '../../config/route-config'
import { UserService } from '../../services/user-service';
import { CookiesService } from '../../services/cookies-service';
import { AUTH } from '../../config/auth-config';
import { UpdatePasswordComponent } from '../../dialogs/update-password/update-password.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from '../../dialogs/profile/profile.component';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  public nome: string;
  public items: IRouteConfig[]
  public userType: string | undefined

  @ViewChild('drawer') drawer!: MatSidenav;

  constructor(
    private UserService: UserService,
    private cookieService: CookiesService,
    private dialog: MatDialog
  ) {
    this.userType = this.cookieService.get("type")
    this.nome = this.cookieService.get("name") ?? ""
    this.items = Object.values(ROUTE_CONFIG).filter(e => e.sidebar && (this.userType && e.claim?.includes(this.userType) || AUTH.DISABLE_AUTH))
  }

  toggleDrawer() {
    this.drawer.toggle();
  }

  logout() {
    this.UserService.logout()
  }

  updatePassword() {
    const dialogRef = this.dialog.open(UpdatePasswordComponent, {
      width: '400px',
    });
  }

  updateProfile() {
    const dialogRef = this.dialog.open(ProfileComponent, {
      width: '400px',
    }).afterClosed().subscribe(e => {
      this.nome = this.cookieService.get("name") ?? ""
    });
  }
}
