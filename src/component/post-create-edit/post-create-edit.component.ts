import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../../service/post.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import {IPost, newPost } from '../../entity/post';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ICategory } from '../../entity/category';
import { UtilService } from '../../service/util.service';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { ConfigService } from '../../service/config.service';
import { DomSanitizer } from '@angular/platform-browser';
import { map, retry } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PageBuilderComponent } from '../page-builder/page-builder.component';
import { ImageHandlerComponent } from '../image-handler/image-handler.component';
import { CategoryComponent } from '../category/category.component';


@Component({
  selector: 'app-post-create-edit',
  imports: [ImageHandlerComponent,CategoryComponent,PageBuilderComponent,ErrorMessageComponent, NgIf, NgFor, RouterLink, RouterLinkActive,TitleCasePipe],
  templateUrl: './post-create-edit.component.html',
  styleUrl: './post-create-edit.component.css'
})
export class PostCreateEditComponent implements OnInit,AfterViewInit,OnDestroy {
  username!:string;
  postType!:string;
  formMessage!:string;
  statusMessage!:string;
  alertType!:string;
  showCustomContentSection = false;
  post$!:IPost;
  categories$:ICategory[] = [];//all categories
  postTags:string[]= [];
  allTags:string[] = [];
  imageFile!:File;
  @ViewChild('featuredImage',{static:false}) featuredImage!: ElementRef<HTMLImageElement>;
  //Display dynamic modal
  modalTitle!:string;
  pageBuilderMessage!:string;


  constructor(private sanitizer: DomSanitizer,public util:UtilService,public config:ConfigService ,private postService: PostService, private router:Router, private activatedRoute:ActivatedRoute){
  }//#constructor
 
  ngAfterViewInit(): void {  
    //this.featuredImage.nativeElement.src=this.post$.featuredImageUrl as string;  
  }
  ngOnInit(): void {
    this.username=this.util.getUsername();
    this.activatedRoute.paramMap.pipe(
      map(param=>{
        let id = param.get("id") as string;
        let postType = param.get("postType") as string;
        return {"id":id,"postType":postType}
      }))
      .subscribe(r=>{
            this.postType=r.postType;
            let postId = Number(r.id);
            this.preparePost(postId,this.postType);
            });
}//ngOnInit

 ngOnDestroy(): void {
     this.categories$ = [];
    this.postTags= [];
    this.allTags = [];
  }
preparePost(id:number,postType:string):void{
 switch(postType){
        case 'page':
          if(id==-1){
            this.post$ = newPost()
          }else{
            this.postService.getPost(this.username,id).pipe(retry(3)).subscribe(r=>{
                if(r){
                  this.post$ = this.post$ = r.posts[0];
                }else{
                  this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
                }

              },err=>this.notify("","",err));
          }
          break;
          case 'post':
          this.postService.getCategories(this.username).pipe(retry(3)).subscribe(r=>{
        if(r){
            this.categories$ = r as unknown as ICategory[];
            if(id==-1){
              this.post$ = newPost();
            }else{
                this.postService.getPost(this.username,id).pipe(retry(3)).subscribe(r=>{
                if(r){
                  console.log(r);
                  this.post$ = this.post$ = r.posts[0];
                  //now process
                              if(this.post$.tags){
                                  this.postTags = (this.post$.tags as string).split(",");
                                }
                              this.allTags = r.allTags;
                              for(let c of this.post$.categories){
                                  if(!this.post$.categoryIds.includes(c.id)){
                                    this.post$.categoryIds.unshift(c.id);
                                  }
                                }
                }else{
                  this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
                }

              },err=>this.notify("","",err));
            }
          }else{
            this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
          }
      },err=>{
        this.notify("","",err);
      });
      }
}//

savePageBuilderMessage($event:any):void{  
let pbm = $event as {title:string,message:string,publish:boolean};
this.submitPost(pbm.title,pbm.message,pbm.publish);
}

submitPost(title:string,message:string,publish:boolean){
  let allowComments:boolean = false;
  let isFeatured:boolean = false;
  let isSticky:boolean = false;
  let sidebarType:string = (document.getElementById('sidebarType')as HTMLSelectElement)?.value;
  if(this.postType=='post'){
  allowComments = (document.getElementById('allowComments')as HTMLInputElement)?.checked;
  isFeatured = (document.getElementById('isFeatured')as HTMLInputElement)?.checked;
  isSticky = (document.getElementById('isSticky')as HTMLInputElement)?.checked;
  }
  //validate
   let post:IPost = {
      id:this.post$.id,
      title:title,
      mainContent:message,
      excerpt:this.post$.excerpt,
      postType:this.postType,
      contentStatus: publish ? this.config.CONTENT_STATUS[1] : this.config.CONTENT_STATUS[0],
      featuredImageUrl:this.post$.featuredImageUrl,
      keywords:this.post$.keywords,
      tags:this.postTags.join(","),
      likes:this.post$.likes,
      views:this.post$.views,
      allowComments:allowComments,
      isFeatured:isFeatured,
      isSticky:isSticky,
      isHome:this.post$.isHome,
      isBlog:this.post$.isBlog,
      isContact:this.post$.isContact,
      isAbout:this.post$.isAbout,
		  isPrivacyPolicy:this.post$.isPrivacyPolicy,
		  isTos:this.post$.isTos,
		  isStore:this.post$.isStore,
      sidebarType:sidebarType,
      sidebarsId:this.post$.sidebarsId,
      categoryIds:this.post$.categoryIds,//

      categories:[],
      tenantsId:this.util.getUserId(),
      tenantsUuid:this.util.getTenantsUuid(),
      localHeadersId:this.post$.localHeadersId,
      localFootersId:this.post$.localFootersId,
      customFieldsId:this.post$.customFieldsId,
      commentIds:this.post$.commentIds,
      creationDate:null,
      lastUpdate:null
      }
      //now save post
      console.log('before submit');
      console.log(post);

      this.postService.createPost(this.username,post).pipe(retry(3)).subscribe(r=>{
        if(r){
          //
         if(r>0){
              this.notify("Success",this.config.ALERT_TYPE[0]);
              }else if(r==-500){
                this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
              }
              else{
                this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
              }
          
        }
      },(err=>{
        this.notify("","",err);
      }));
  }//

  //############### EXCERPT #########################
saveExcerpt(excerpt:string){
  this.post$.excerpt = excerpt;
}// #saveExcerpt()

//############### CONTENT STATUS #########################
saveContentStatus(contentStatus:string){
  this.post$.contentStatus = contentStatus;
}// #saveContentStatus()

checkedCategory(catId:number|string|null):boolean{
return this.post$.categoryIds.includes(catId as number);
}
selectCategory(element:HTMLInputElement){
  let pcn = this.post$.categoryIds;
  let status = element.checked;
  let id = element.value as unknown as number;
if(status==true){
if(!pcn.includes(id)){
  pcn.push(id);
}
}else{// checked == false
if(pcn.includes(id)){
 let index = pcn.indexOf(id) as number;
if(index >-1){
  pcn?.splice(index, 1);
}

}
}
this.post$.categoryIds = pcn;
console.log(pcn);
}//

getDisplayCategories():ICategory[]{
  let displayCat = this.post$.categories;
  let displayCatNames:string[] = [];
  for(let cat of displayCat)
    {displayCatNames.push(cat.name.toLowerCase());}
  for(let cat of this.categories$){
    let name = cat.name.toLowerCase();
    if(!(displayCatNames.includes(name))){
      displayCatNames.push(name);
      displayCat.push(cat);
    }
  }
  //console.log(displayCat);
  return displayCat;
}

//############# TAGS ######################
addNewTag(el:HTMLTextAreaElement){
  let newTag = el.value;
  const tags:string[] = newTag.trim().split(",");
  for(let tag of tags){
    let t = this.util.capitalize(tag);
    if(!this.postTags?.includes(t)){
      this.postTags?.push(t);
    }
if(!this.allTags?.includes(t)){
  this.allTags?.push(t);
}
  }
  //this.postForm.get("tags")?.reset();
  el.value = '';
  console.log(newTag);
  console.log(this.postTags);
}// #addNewTag()

removeTag(tag:string):void{
let index = 0;
index = this.postTags?.indexOf(tag) as number;
if(index >-1){
  this.postTags?.splice(index, 1);
}
}// removeTag()

//################# MODAL #############
displayModal(modalTitle:string){
  this.modalTitle = modalTitle;
  console.log(modalTitle);
  switch(modalTitle){
    case "Status":
      break;
    case "Category":
      break;
    case "Excerpt":
      break; 
  }
} //#displayModal()

saveImageUrl($event:any):void{  
this.post$.featuredImageUrl = $event as string;
}

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
}//

}
