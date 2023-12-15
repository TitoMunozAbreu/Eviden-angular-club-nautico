import { Component, OnInit } from '@angular/core';
import { Socio } from '../../socio';
import { SocioService } from '../../socio.service';

@Component({
  selector: 'app-socios-list',
  templateUrl: './socios-list.component.html',
  styleUrls: ['./socios-list.component.scss']
})
export class SociosListComponent implements OnInit{

  socios!: Socio[]
  errorMessage = null
  constructor(private socioService: SocioService){}

  ngOnInit(): void {
    this.socioService.getSocios().subscribe(
      {
        next: socios => {
          this.socios = socios
        },
        error: error => {
          this.errorMessage = error
        }
      }
    )
  }



}
