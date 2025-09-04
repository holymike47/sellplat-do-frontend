import { CommonModule, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IOption } from '../../entity/option';
import { ISelectedMenu } from '../../entity/menu-item';

@Component({
  selector: 'app-footer',
  imports: [CommonModule ,NgIf, NgFor, RouterLink, RouterLinkActive,  TitleCasePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
    // @Input()
    // menu!:ISelectedMenu[];
    @Input()
    option!:IOption;
    @Input()
    username!:string;
  ngOnInit(): void {
  }

}
