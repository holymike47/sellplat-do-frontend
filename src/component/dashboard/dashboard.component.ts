import { Component, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PostListComponent } from '../post-list/post-list.component';
import { NgFor, NgIf } from '@angular/common';
import { OptionComponent } from "../option/option.component";
import { PostDetailComponent } from '../post-detail/post-detail.component';
import { FormsModule, NgModel } from '@angular/forms';
import { PostService } from '../../service/post.service';
import { UtilService } from '../../service/util.service';



@Component({
  selector: 'app-dashboard',
  imports: [FormsModule,NgIf, NgFor, RouterOutlet, RouterLink, RouterLinkActive,PostDetailComponent,
    PostListComponent, OptionComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  username!:string;
  sidebarType =  ["LEFT", "RIGHT", "NONE"];
  selectedSidebar = "NONE";
  _showCategories = false;
  _showTags = false;

  constructor(private util:UtilService,private postService: PostService,private router: Router, private activatedRoute: ActivatedRoute){

  }
  ngOnInit(): void {
    console.log("Dashbord");
this.username = this.util.getUsername();
  }
 
 logout():void{
  this.util.logout();
  this.router.navigate(["/"]);
 }
  }





