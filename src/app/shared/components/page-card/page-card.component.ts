import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-card',
  templateUrl: './page-card.component.html',
  styleUrls: ['./page-card.component.css'],
  standalone: false
})
export class PageCardComponent {

  @Input() height: string = '30rem';
  @Input() width: string = '60rem';

}
