import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  standalone: false,
  templateUrl: './loading-screen.component.html'
})
export class LoadingScreenComponent {
  @Input() isLoading: boolean = false;
}
