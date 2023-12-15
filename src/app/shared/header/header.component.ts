import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() title!: string 

  logoUrl = 'https://previews.123rf.com/images/siberica/siberica1601/siberica160100071/51309870-%C3%A9tiquette-nautique-yacht-ic%C3%B4ne-peut-%C3%AAtre-utilis%C3%A9-pour-un-logo-de-club-de-yacht.jpg' 

}
