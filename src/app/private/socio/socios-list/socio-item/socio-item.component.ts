import { Component, Input, OnInit } from '@angular/core';
import { Socio } from 'src/app/private/model/socio';

@Component({
  selector: 'app-socio-item',
  templateUrl: './socio-item.component.html',
  styleUrls: ['./socio-item.component.scss']
})
export class SocioItemComponent {
  @Input() socio!: any
  @Input() index!: any
  
}
