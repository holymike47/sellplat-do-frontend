import { CommonModule, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PostService } from '../../service/post.service';
import { map } from 'rxjs';
import { IPost, IPostRecord } from '../../entity/post';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { UtilService } from '../../service/util.service';

@Component({
  selector: 'app-archive',
  imports: [CommonModule, NgIf, NgFor, RouterLink, RouterLinkActive, FormsModule, ReactiveFormsModule, TitleCasePipe, HeaderComponent, FooterComponent],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.css'
})
export class ArchiveComponent implements OnInit {
  username!:string;
  id!:number;
  archiveType!:string;
  posts$:IPost[] = [];
  archiveTitle!:string;
  archiveMessage!:string;
  constructor(private util:UtilService,private postService: PostService,private router: Router, private activatedRoute: ActivatedRoute){
      
    }
  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(map(
      param=> {
        let username:string = param.get("username") as string;
        let id:number = Number(param.get("id") as string);
        let archiveType = param.get("archiveType") as string;
        return {"username":username,"id":id,"archiveType":archiveType};
      }
    )
    ).subscribe(r=>{
      this.username=r.username;
      this.id = r.id;
      this.archiveType = r.archiveType;
      this.processArchive();
    });
  }//username

  processArchive():void{
    console.log(this.archiveType);
    console.log(this.id);
    switch(this.archiveType){
    case "post":
      this.archiveTitle ="Recent Posts";
      this.postService.getPosts(this.username,"post").subscribe(r=>{
        if(r){
          this.posts$ = r.posts;
          //retrieve archive message
          this.postService.getPost(this.username,this.id).subscribe(r2=>{
            if(r2){
              this.archiveMessage = (r2.posts[0]).mainContent as string;
            }
          });
        }
      },err=>{});
      break;
    case "category":
      this.archiveTitle ="Category: ";
      this.postService.getPostsBycategoryId(this.username,this.id).subscribe(r=>{
        if(r){
          this.posts$ = r;
        }
      },err=>{});
      break;
    case "product":
      break;
    case "course":
      break;
    default:
      break;
      }

  }

}
