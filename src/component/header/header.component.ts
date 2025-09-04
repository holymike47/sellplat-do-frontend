import { Component, Input, OnInit } from '@angular/core';
import { ISelectedMenu } from '../../entity/menu-item';
import { IOption } from '../../entity/option';
import { PostService } from '../../service/post.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgFor, NgIf, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule ,NgIf, NgFor, RouterLink, RouterLinkActive,  TitleCasePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Input()
  menu!:ISelectedMenu[];
  @Input()
  option!:IOption;
   @Input()
  username!:string;
    constructor(private postService: PostService,private router: Router, private activatedRoute: ActivatedRoute){
        
      }
  ngOnInit(): void {
    console.log("username");
    console.log(this.username);
    console.log("menu");
    console.log(this.menu);
    console.log("option");
    console.log(this.option);
    //use only the root menu
    //this.menu.filter(m=>m.parentId==null || m.parentId==0);
  }

}
