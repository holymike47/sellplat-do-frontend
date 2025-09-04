import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { PostService } from '../../../service/post.service';
import { IPost, IPostRecord } from '../../../entity/post';
import { map } from 'rxjs';

@Component({
  selector: 'app-recent-posts',
  imports: [NgIf,NgFor, RouterLink, RouterLinkActive,TitleCasePipe],
  templateUrl: './recent-posts.component.html',
  styleUrl: './recent-posts.component.css'
})
export class RecentPostsComponent implements OnInit {
  username!:string;
  posts$:IPost[] = [];
  recentPosts:IPost[] = [];
  @Input()
  postId = 0;
  @Output() 
postIdChange = new EventEmitter<number>();
updatePostId(id: number):void{
this.postId =id;
this.postIdChange.emit(this.postId);
    }//

  constructor(private postservice:PostService,private activatedRoute:ActivatedRoute){

  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(map(
          param=> {
            let username:string = param.get("username") as string;
            return {"username":username};
          }
        )
        ).subscribe(r=>{
          this.username=r.username;
        });//username
    this.postservice.getPosts(this.username,"post").subscribe(r=>this.preparePosts(r));
  }//
  
  preparePosts(postRecord:IPostRecord):void{
    this.posts$ = postRecord.posts as IPost[];
    // for(let p of this.posts$){
    //   if(p.id == this.postId){
    //     break;
    //   }
    //   this.recentPosts.push(p);
    // }
  }

}
