import { Component, Input } from '@angular/core';
import { Socio } from 'src/app/private/socio';

@Component({
  selector: 'app-socio-item',
  templateUrl: './socio-item.component.html',
  styleUrls: ['./socio-item.component.scss']
})
export class SocioItemComponent {
  @Input() socio!: Socio
  @Input() index!: any

}
