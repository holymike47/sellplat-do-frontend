import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../../service/post.service';
import {IPost, IPostRecord} from '../../entity/post';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UtilService } from '../../service/util.service';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { ICategory } from '../../entity/category';
import { map, pipe, retry } from 'rxjs';
import { ConfigService } from '../../service/config.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IOption } from '../../entity/option';
import { ISelectedMenu } from '../../entity/menu-item';


@Component({
  selector: 'app-post-list',
  imports: [ErrorMessageComponent,NgFor,NgIf, RouterLink, RouterLinkActive,AsyncPipe,ReactiveFormsModule
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit,OnDestroy {
  username!:string;
  option!:IOption;
  menus:ISelectedMenu[]=[];
  postType!:string;
  statusMessage:string ="";
  alertType!:string;
  posts$:IPost[] = [];
  displayPosts:IPost[] = [];
  post$!:IPost;
  categories$:ICategory[] = [];
  postCategories:ICategory[] = [];
 // SelectedCategory = new FormControl("");
  //postToDeleteInput:FormControl = new FormControl("");
  postIdsToDelete:number[] = [];


  constructor(private changeDetectorRef: ChangeDetectorRef,private util:UtilService,private config:ConfigService, private postService: PostService,private router: Router, private activatedRoute: ActivatedRoute){
  }
  
  ngOnInit(): void {
    this.username = this.util.getUsername();
    this.option = this.util.getOption();
    this.activatedRoute.paramMap.pipe(map(
      param=>{
        let postType = param.get("postType")as string;
        return {"postType":postType};
      }
      )).subscribe(r=>{
      this.postType = r.postType;
      this.postService.getPosts(this.username,this.postType).pipe(retry(3)).subscribe(
        r=>{
          if(r){
        //console.log(r);
        this.preparePosts(r);
          }
          else{
            this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
          }
      },err=>this.notify("","",err)
      );

    },err=>this.notify("","",err));
    
      
  }//

  ngOnDestroy(): void {
    this.posts$ =[];
    this.displayPosts = [];
  }

  preparePosts(response:IPostRecord){
    this.posts$ = response.posts;
    this.displayPosts = this.posts$ = response.posts;
    this.menus = response.menus;
    this.option = response.option;
    if(this.postType=='post'){
      this.categories$ = response.categories;
    }
  }//

  getDisplayPosts():IPost[]{
    return this.displayPosts;
  }

  filterPostsByContentStatus(contentStatus:string){
    if(contentStatus=="ALL"){
      this.displayPosts = this.posts$;
    }
    else{
      let displayPosts = [];
      for(let p of this.posts$){
        if(p.contentStatus==contentStatus){
          displayPosts.push(p);
        }
      }
      this.displayPosts = displayPosts;
    }
    //this.changeDetectorRef.detectChanges();
  }
  filterPostsByCategory(name:string){
    if(name=="all"){
      this.displayPosts = this.posts$;
    }else{
      let displayPosts = [];
      for(let p of this.posts$){
        let cats = p.categories;
        for(let c of cats){
          if(c.name==name){
            displayPosts .push(p);
          }
        }
      }
      this.displayPosts = displayPosts; 
    }
  }//

    deletePost(id:number){
      let ids:number[] = [id];
      this.postService.deletePost(this.username,ids).pipe(retry(3)).subscribe(r=>{
        if(r==true){
          let updatedPosts:IPost[] =[];
          for(let p of this.posts$){
            if (p.id==id){break;}
            updatedPosts.push(p);
          }
          this.posts$ = updatedPosts;
          this.notify("Deleted",this.config.ALERT_TYPE[0]);
          location.reload();
        }else{
          this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
        }
       },err=>this.notify("","",err));
    
    }//

    //mass delete 
    deletePosts(){
      this.postService.deletePost(this.username,this.postIdsToDelete).pipe(retry(3)).subscribe(r=>{
        if(r==true){
          let updatedPosts:IPost[] =[];
          for(let allPosts of this.posts$){
            for(let deletedPosts of this.postIdsToDelete)
            if (allPosts.id==deletedPosts){break;}
            updatedPosts.push(allPosts);
          }
          this.posts$ = updatedPosts;
          location.reload();
          this.notify("Deleted",this.config.ALERT_TYPE[0]);
        }
       });
    }//

    postToDelete(id:number, postToDeleteInput:HTMLInputElement){
      let value = postToDeleteInput.checked;
      if(value==true){
        if(this.postIdsToDelete.includes(id)){return;}
        else{this.postIdsToDelete.push(id);}
      }//#if value 
      else{
        //if value is false
        if(this.postIdsToDelete.includes(id)){
          //remove
          let index = this.postIdsToDelete.indexOf(id);
        if(index >-1){
        this.postIdsToDelete.splice(index, 1);
        }
        }
      }
      console.log(this.postIdsToDelete);

    }//

private notify(message:string,alertType:string,err?:HttpErrorResponse):void{
this.statusMessage = message;
this.alertType = alertType;
if(err){
  if(err.status==0){
              console.log("network error: "+err.status+" message: "+err.message);
                 this.statusMessage = this.config.NETWORK_ERROR;
                 this.alertType = this.config.ALERT_TYPE[2];     
               }
               else{
                 console.log("server error: "+err.status+" message: "+err.message);
                  this.statusMessage = this.config.SERVER_ERROR;
                  this.alertType = this.config.ALERT_TYPE[2];
               }
}

setTimeout(() => 
  {
   this.statusMessage="";

}, 10000);
}//#notify()
}
